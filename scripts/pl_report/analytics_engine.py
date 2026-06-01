"""Accuracy metrics, data quality, and extended analytics."""
from __future__ import annotations

import math
from typing import Optional

from .utils import _interp_nearest, stats_summary

def assess_data_quality(det, kf, ctrl, vlp):
    """
    Assess whether the recorded bag has enough valid data for meaningful analysis.
    Returns (quality_score 0-100, list of (level, message) warnings).

    Coordinate frame note:
      - TargetState.position = target absolute position in odom frame
      - VehicleLocalPosition (x,y,z) = drone absolute position in NED/odom frame
      - These are different objects in the same frame (target vs drone)
      - Innovation = KF prediction − detector measurement (both are target position)
    """
    warnings = []
    score = 100

    # Check detector
    det_total = sum(det.status_counts.values())
    det_detected = det.status_counts.get("DETECTED", 0)
    if det_total == 0:
        warnings.append(("bad", "No detector messages recorded"))
        score -= 40
    elif det_detected == 0:
        warnings.append(("bad", f"Detector published {det_total} messages but target was NEVER detected (all LOST). "
                         "ArUco marker not visible during recording."))
        score -= 35
    elif det_detected / det_total < 0.3:
        warnings.append(("warn", f"Low detection rate: {det_detected}/{det_total} "
                         f"({100*det_detected/det_total:.0f}%). Marker intermittently visible."))
        score -= 15

    # Check estimator
    kf_total = sum(kf.status_counts.values())
    kf_tracking = kf.status_counts.get("DETECTED", 0) + kf.status_counts.get("PREDICTED", 0)
    if kf_total == 0:
        warnings.append(("bad", "No estimator messages recorded"))
        score -= 30
    elif kf_tracking == 0:
        warnings.append(("bad", f"KF published {kf_total} messages but never entered DETECTED/PREDICTED state. "
                         "KF was not tracking — positions are stale/uninitialized."))
        score -= 25

    # Check controller
    if not ctrl.timestamps_s:
        warnings.append(("warn", "No controller (LandingState) data. Landing FSM was not running."))
        score -= 10
    else:
        states = set(ctrl.states)
        if 2 not in states and 3 not in states:  # DESCENDING=2, LANDED=3
            warnings.append(("warn", "Controller active but never entered DESCENDING or LANDED state. "
                             "No landing attempt captured."))
            score -= 10

    # Check drone in flight
    if vlp.z:
        max_alt = max(-z for z in vlp.z)
        if max_alt < 1.0:
            warnings.append(("bad", f"Drone max altitude was {max_alt:.1f}m — appears to be on the ground. "
                             "No flight captured."))
            score -= 20
    else:
        warnings.append(
            ("bad",
             "No VehicleLocalPosition or usable VehicleOdometry (NED) in the bag. "
             "Cannot assess drone state. Record /fmu/out/vehicle_local_position* and/or "
             "/fmu/out/vehicle_odometry* with the same ROS_DOMAIN_ID as PX4."))
        score -= 20

    # Overall summary
    if score <= 20:
        warnings.insert(0, ("bad", "INSUFFICIENT DATA: This bag does not contain a valid precision landing sequence. "
                           "Accuracy metrics are unreliable. Record during an active landing attempt."))
        if det_total == 0 and kf_total == 0 and not vlp.z:
            warnings.append(
                ("bad",
                 "Pipeline topics appear empty: same ROS_DOMAIN_ID as sim? precision_landing + gz-bridge running "
                 "while recording? Wait until after rosbag starts (see DELAY_BAG_S in sim_launch.sh) before "
                 "make sim-stop. Drone pose: /fmu/out/vehicle_local_position* or /fmu/out/vehicle_odometry*."))
    elif score <= 60:
        warnings.insert(0, ("warn", "PARTIAL DATA: Some pipeline components missing. Accuracy metrics may be limited."))

    return max(0, score), warnings


def recommended_analysis_window(vstatus, ctrl) -> tuple[Optional[float], Optional[float]]:
    """Focus metrics on armed flight and active precision-landing FSM (state >= ALIGN).

    Returns (t_start_s, t_end_s). ``t_end_s`` is always ``None`` (use bag end).
    If neither armed nor ALIGN is found, returns (None, None) — no windowing.
    """
    armed_t: Optional[float] = None
    if vstatus and vstatus.timestamps_s and vstatus.arming_state:
        for i, a in enumerate(vstatus.arming_state):
            if int(a) == 2:
                armed_t = float(vstatus.timestamps_s[i])
                break
    pl_t: Optional[float] = None
    if ctrl and ctrl.timestamps_s:
        for i, s in enumerate(ctrl.states):
            if int(s) >= 1:
                pl_t = float(ctrl.timestamps_s[i])
                break
    parts = [t for t in (armed_t, pl_t) if t is not None]
    if not parts:
        return None, None
    return max(parts), None


def compute_accuracy(
    det,
    kf,
    vlp,
    ctrl=None,
    traj=None,
    analysis_t0: Optional[float] = None,
    analysis_t1: Optional[float] = None,
):
    """
    Compute accuracy metrics between detector, estimator, and drone position.

    IMPORTANT: Only uses samples where status != LOST (i.e. DETECTED or PREDICTED).
    LOST samples have stale/zero positions and would corrupt accuracy metrics.

    Innovation = |KF_prediction - Detector_measurement| (both are target pos in odom)
    KF Smoothness = acceleration magnitude (jitter reduction vs raw detector)
    Detector Noise = windowed std of raw detector measurements
    Landing Precision = final XY error from controller during descent phase
    Approach Analysis = target_pos − drone_pos (relative position over time)

    When ``analysis_t0`` / ``analysis_t1`` are set (e.g. from
    :func:`recommended_analysis_window`), valid samples outside the window are
    excluded from metrics so taxi / disarmed segments do not dominate KPIs.

    ``traj`` is optional: trajectory setpoints for control-tracking / step metrics.
    """
    metrics = {}

    def _win(t: float) -> bool:
        if analysis_t0 is not None and t < analysis_t0:
            return False
        if analysis_t1 is not None and t > analysis_t1:
            return False
        return True

    # ── Filter to valid (non-LOST) samples ────────────────────────────────
    det_valid = {"t": [], "x": [], "y": [], "z": [], "conf": []}
    if det.statuses:
        for i, s in enumerate(det.statuses):
            if s != 0:  # not LOST
                if not _win(float(det.timestamps_s[i])):
                    continue
                det_valid["t"].append(det.timestamps_s[i])
                det_valid["x"].append(det.position_x[i])
                det_valid["y"].append(det.position_y[i])
                det_valid["z"].append(det.position_z[i])
                det_valid["conf"].append(det.confidence[i])

    kf_valid = {"t": [], "x": [], "y": [], "z": [], "vx": [], "vy": [], "vz": [], "conf": []}
    if kf.statuses:
        for i, s in enumerate(kf.statuses):
            if s != 0:  # not LOST
                if not _win(float(kf.timestamps_s[i])):
                    continue
                kf_valid["t"].append(kf.timestamps_s[i])
                kf_valid["x"].append(kf.position_x[i])
                kf_valid["y"].append(kf.position_y[i])
                kf_valid["z"].append(kf.position_z[i])
                kf_valid["vx"].append(kf.velocity_x[i])
                kf_valid["vy"].append(kf.velocity_y[i])
                kf_valid["vz"].append(kf.velocity_z[i])
                kf_valid["conf"].append(kf.confidence[i])

    n_det_valid = len(det_valid["t"])
    n_kf_valid = len(kf_valid["t"])

    metrics["valid_counts"] = {
        "det_valid": n_det_valid,
        "det_total": len(det.statuses),
        "kf_valid": n_kf_valid,
        "kf_total": len(kf.statuses),
    }

    # ── Innovation: KF vs Detector (only valid samples) ───────────────────
    if n_det_valid >= 5 and n_kf_valid >= 5:
        kf_x_at_det = _interp_nearest(det_valid["t"], kf_valid["t"], kf_valid["x"])
        kf_y_at_det = _interp_nearest(det_valid["t"], kf_valid["t"], kf_valid["y"])
        kf_z_at_det = _interp_nearest(det_valid["t"], kf_valid["t"], kf_valid["z"])

        innov_x = [d - k for d, k in zip(det_valid["x"], kf_x_at_det)]
        innov_y = [d - k for d, k in zip(det_valid["y"], kf_y_at_det)]
        innov_z = [d - k for d, k in zip(det_valid["z"], kf_z_at_det)]
        innov_xy = [math.sqrt(ix**2 + iy**2) for ix, iy in zip(innov_x, innov_y)]
        innov_3d = [math.sqrt(ix**2 + iy**2 + iz**2)
                    for ix, iy, iz in zip(innov_x, innov_y, innov_z)]

        metrics["innovation"] = {
            "xy": stats_summary(innov_xy, "m"),
            "3d": stats_summary(innov_3d, "m"),
            "x": stats_summary(innov_x, "m"),
            "y": stats_summary(innov_y, "m"),
            "z": stats_summary(innov_z, "m"),
            "innov_x": innov_x,
            "innov_y": innov_y,
            "innov_z": innov_z,
            "innov_xy": innov_xy,
            "innov_3d": innov_3d,
            "timestamps_s": list(det_valid["t"]),
        }

    # ── KF smoothness (only valid samples) ────────────────────────────────
    if n_kf_valid > 2:
        dt_list = [kf_valid["t"][i+1] - kf_valid["t"][i]
                   for i in range(n_kf_valid - 1)]
        dvx = [(kf_valid["vx"][i+1] - kf_valid["vx"][i]) / max(dt, 0.001)
               for i, dt in enumerate(dt_list)]
        dvy = [(kf_valid["vy"][i+1] - kf_valid["vy"][i]) / max(dt, 0.001)
               for i, dt in enumerate(dt_list)]
        acc_mag = [math.sqrt(ax**2 + ay**2) for ax, ay in zip(dvx, dvy)]
        metrics["smoothness"] = {
            "vel_std_x": stats_summary(kf_valid["vx"], "m/s"),
            "vel_std_y": stats_summary(kf_valid["vy"], "m/s"),
            "acc_xy": stats_summary(acc_mag, "m/s²"),
        }

    # ── Detector noise (only valid/DETECTED samples) ─────────────────────
    if n_det_valid > 10:
        win = min(10, n_det_valid // 3)
        det_jitter_x, det_jitter_y = [], []
        for i in range(win, n_det_valid):
            wx = det_valid["x"][i-win:i]
            wy = det_valid["y"][i-win:i]
            mx = sum(wx) / win
            my = sum(wy) / win
            sx = math.sqrt(sum((v - mx) ** 2 for v in wx) / win)
            sy = math.sqrt(sum((v - my) ** 2 for v in wy) / win)
            det_jitter_x.append(sx)
            det_jitter_y.append(sy)
        metrics["det_noise"] = {
            "jitter_x": stats_summary(det_jitter_x, "m"),
            "jitter_y": stats_summary(det_jitter_y, "m"),
            "jitter_x_ts": det_jitter_x,
            "jitter_y_ts": det_jitter_y,
            "jitter_ts": det_valid["t"][win:],
        }

    # ── Approach analysis: target−drone relative position ──
    # KF/detector: ROS odom ENU (x=east, y=north, z=up). VLP: PX4 NED (x=north, y=east, z=down).
    if n_kf_valid >= 5 and vlp.timestamps_s:
        drone_north_at_kf = _interp_nearest(kf_valid["t"], vlp.timestamps_s, vlp.x)
        drone_east_at_kf = _interp_nearest(kf_valid["t"], vlp.timestamps_s, vlp.y)
        drone_z_at_kf = _interp_nearest(kf_valid["t"], vlp.timestamps_s, vlp.z)

        # Relative: target − drone in ENU horizontal components
        rel_x = [t - d for t, d in zip(kf_valid["x"], drone_east_at_kf)]
        rel_y = [t - d for t, d in zip(kf_valid["y"], drone_north_at_kf)]
        rel_z = [t - (-d) for t, d in zip(kf_valid["z"], drone_z_at_kf)]  # target_z vs -drone_z(NED→alt)
        rel_xy = [math.sqrt(rx**2 + ry**2) for rx, ry in zip(rel_x, rel_y)]

        metrics["approach"] = {
            "rel_x": rel_x, "rel_y": rel_y, "rel_z": rel_z,
            "rel_xy": rel_xy,
            "timestamps_s": list(kf_valid["t"]),
            "xy_stats": stats_summary(rel_xy, "m"),
        }

    # ── Velocity analysis: KF velocity vs detector-derived velocity ─────
    if n_det_valid >= 10 and n_kf_valid >= 10:
        # Numerical derivative of detector positions → noisy "ground truth" velocity
        det_vx_num, det_vy_num, det_vz_num, det_vel_t = [], [], [], []
        for i in range(1, n_det_valid):
            dt = det_valid["t"][i] - det_valid["t"][i - 1]
            if dt < 0.001:
                continue
            det_vx_num.append((det_valid["x"][i] - det_valid["x"][i - 1]) / dt)
            det_vy_num.append((det_valid["y"][i] - det_valid["y"][i - 1]) / dt)
            det_vz_num.append((det_valid["z"][i] - det_valid["z"][i - 1]) / dt)
            det_vel_t.append((det_valid["t"][i] + det_valid["t"][i - 1]) / 2)

        if len(det_vel_t) >= 5:
            # Interpolate KF velocity at detector-derivative timestamps
            kf_vx_at_det = _interp_nearest(det_vel_t, kf_valid["t"], kf_valid["vx"])
            kf_vy_at_det = _interp_nearest(det_vel_t, kf_valid["t"], kf_valid["vy"])
            kf_vz_at_det = _interp_nearest(det_vel_t, kf_valid["t"], kf_valid["vz"])
            kf_speed_at_det = [math.sqrt(vx**2 + vy**2) for vx, vy in zip(kf_vx_at_det, kf_vy_at_det)]
            det_speed_num = [math.sqrt(vx**2 + vy**2) for vx, vy in zip(det_vx_num, det_vy_num)]

            # Velocity error: KF − detector_derivative
            vel_err_x = [k - d for k, d in zip(kf_vx_at_det, det_vx_num)]
            vel_err_y = [k - d for k, d in zip(kf_vy_at_det, det_vy_num)]
            vel_err_xy = [math.sqrt(ex**2 + ey**2) for ex, ey in zip(vel_err_x, vel_err_y)]

            # KF velocity magnitude time series (full valid set)
            kf_speed_ts = [math.sqrt(vx**2 + vy**2) for vx, vy in zip(kf_valid["vx"], kf_valid["vy"])]

            metrics["velocity"] = {
                "kf_vx": list(kf_valid["vx"]),
                "kf_vy": list(kf_valid["vy"]),
                "kf_vz": list(kf_valid["vz"]),
                "kf_speed": kf_speed_ts,
                "kf_vel_t": list(kf_valid["t"]),
                "det_vx_num": det_vx_num,
                "det_vy_num": det_vy_num,
                "det_vz_num": det_vz_num,
                "det_speed_num": det_speed_num,
                "det_vel_t": det_vel_t,
                "vel_err_x": vel_err_x,
                "vel_err_y": vel_err_y,
                "vel_err_xy": vel_err_xy,
                "err_xy_stats": stats_summary(vel_err_xy, "m/s"),
                "kf_speed_stats": stats_summary(kf_speed_ts, "m/s"),
                "det_speed_stats": stats_summary(det_speed_num, "m/s"),
            }

            try:
                t_start = max(det_vel_t[0], kf_valid["t"][0])
                t_end = min(det_vel_t[-1], kf_valid["t"][-1])
                if t_end - t_start > 2.0:
                    hz = 50.0
                    n = int((t_end - t_start) * hz)
                    n = max(200, min(n, 5000))
                    dt = (t_end - t_start) / (n - 1)
                    t_u = [t_start + i * dt for i in range(n)]

                    det_spd_u = _interp_nearest(t_u, det_vel_t, det_speed_num)
                    kf_spd_u = _interp_nearest(t_u, kf_valid["t"], kf_speed_ts)

                    # Smooth detector speed to reduce derivative noise
                    win = max(5, int(0.25 / dt))  # ~250ms
                    win = min(win, 101)
                    det_s = []
                    for i in range(n):
                        lo = max(0, i - win // 2)
                        hi = min(n, i + win // 2 + 1)
                        det_s.append(sum(det_spd_u[lo:hi]) / (hi - lo))

                    accel = [0.0]
                    for i in range(1, n):
                        accel.append((det_s[i] - det_s[i - 1]) / dt)

                    accel_thresh = 0.6
                    min_change = 0.3
                    settle_band = 0.2
                    max_settle_s = 3.0

                    events = []
                    in_evt = False
                    evt_start = 0
                    for i in range(1, n):
                        if (not in_evt) and abs(accel[i]) > accel_thresh:
                            in_evt = True
                            evt_start = i
                        elif in_evt and abs(accel[i]) < accel_thresh * 0.2:
                            in_evt = False
                            evt_end = i

                            before = det_s[max(0, evt_start - int(0.3 / dt)):evt_start]
                            after = det_s[evt_end:min(n, evt_end + int(0.3 / dt))]
                            if not before or not after:
                                continue
                            sp0 = sum(before) / len(before)
                            sp1 = sum(after) / len(after)
                            change = abs(sp1 - sp0)
                            if change < min_change:
                                continue

                            # settle when |kf-det| within band for a hold period
                            settle_idx = None
                            hold = max(3, int(0.2 / dt))  # 200ms
                            search_end = min(n, evt_end + int(max_settle_s / dt))
                            for j in range(evt_end, max(evt_end + 1, search_end - hold)):
                                ok = True
                                for k in range(j, j + hold):
                                    if abs(kf_spd_u[k] - det_s[k]) > settle_band:
                                        ok = False
                                        break
                                if ok:
                                    settle_idx = j
                                    break

                            events.append({
                                "t_start": round(t_u[evt_start], 3),
                                "t_end": round(t_u[evt_end], 3),
                                "speed_before": round(sp0, 3),
                                "speed_after": round(sp1, 3),
                                "speed_change": round(change, 3),
                                "settle_band_mps": settle_band,
                                "settle_time_ms": round((t_u[settle_idx] - t_u[evt_start]) * 1000, 1) if settle_idx else None,
                            })

                    settle_times = [e["settle_time_ms"] for e in events if e["settle_time_ms"] is not None]
                    if events:
                        metrics["target_motion_response"] = {
                            "events": events,
                            "n_events": len(events),
                            "n_settled": len(settle_times),
                            "settle_time_ms_stats": stats_summary(settle_times, "ms") if settle_times else None,
                            "accel_thresh_mps2": accel_thresh,
                            "min_change_mps": min_change,
                            "settle_band_mps": settle_band,
                            "t_u": t_u,
                            "det_speed_u": det_s,
                            "kf_speed_u": kf_spd_u,
                        }
            except Exception:
                pass

        # ── Phase delay via cross-correlation (position domain) ────────
        # Use detector X position as reference, KF X position as estimate.
        # Resample both to uniform grid then cross-correlate.
        if n_det_valid >= 20 and n_kf_valid >= 20:
            # Pick the overlapping time range
            t_start = max(det_valid["t"][0], kf_valid["t"][0])
            t_end = min(det_valid["t"][-1], kf_valid["t"][-1])
            if t_end - t_start > 1.0:
                # Resample at ~100 Hz uniform grid
                n_samples = int((t_end - t_start) * 100)
                if n_samples > 20:
                    dt_u = (t_end - t_start) / n_samples
                    t_uniform = [t_start + i * dt_u for i in range(n_samples)]

                    det_x_u = _interp_nearest(t_uniform, det_valid["t"], det_valid["x"])
                    kf_x_u = _interp_nearest(t_uniform, kf_valid["t"], kf_valid["x"])
                    det_y_u = _interp_nearest(t_uniform, det_valid["t"], det_valid["y"])
                    kf_y_u = _interp_nearest(t_uniform, kf_valid["t"], kf_valid["y"])

                    # Remove DC offset (subtract mean)
                    det_x_m = sum(det_x_u) / len(det_x_u)
                    kf_x_m = sum(kf_x_u) / len(kf_x_u)
                    det_y_m = sum(det_y_u) / len(det_y_u)
                    kf_y_m = sum(kf_y_u) / len(kf_y_u)
                    det_x_c = [v - det_x_m for v in det_x_u]
                    kf_x_c = [v - kf_x_m for v in kf_x_u]
                    det_y_c = [v - det_y_m for v in det_y_u]
                    kf_y_c = [v - kf_y_m for v in kf_y_u]

                    # Cross-correlation for limited lag range (±500ms)
                    max_lag_samples = min(int(0.5 / dt_u), n_samples // 4)
                    best_lag_x, best_corr_x = 0, -1e30
                    best_lag_y, best_corr_y = 0, -1e30
                    xcorr_lags_ms, xcorr_vals_x, xcorr_vals_y = [], [], []

                    for lag in range(-max_lag_samples, max_lag_samples + 1):
                        cx, cy = 0.0, 0.0
                        count = 0
                        for j in range(n_samples):
                            k = j + lag
                            if 0 <= k < n_samples:
                                cx += det_x_c[j] * kf_x_c[k]
                                cy += det_y_c[j] * kf_y_c[k]
                                count += 1
                        if count > 0:
                            cx /= count
                            cy /= count
                        xcorr_lags_ms.append(lag * dt_u * 1000)
                        xcorr_vals_x.append(cx)
                        xcorr_vals_y.append(cy)
                        if cx > best_corr_x:
                            best_corr_x = cx
                            best_lag_x = lag
                        if cy > best_corr_y:
                            best_corr_y = cy
                            best_lag_y = lag

                    phase_delay_x_ms = best_lag_x * dt_u * 1000
                    phase_delay_y_ms = best_lag_y * dt_u * 1000
                    # Normalize correlation
                    norm_x = max(abs(v) for v in xcorr_vals_x) if xcorr_vals_x else 1
                    norm_y = max(abs(v) for v in xcorr_vals_y) if xcorr_vals_y else 1
                    xcorr_norm_x = [v / norm_x if norm_x > 0 else 0 for v in xcorr_vals_x]
                    xcorr_norm_y = [v / norm_y if norm_y > 0 else 0 for v in xcorr_vals_y]

                    metrics["phase_delay"] = {
                        "x_ms": round(phase_delay_x_ms, 1),
                        "y_ms": round(phase_delay_y_ms, 1),
                        "mean_ms": round((phase_delay_x_ms + phase_delay_y_ms) / 2, 1),
                        "xcorr_lags_ms": xcorr_lags_ms,
                        "xcorr_norm_x": xcorr_norm_x,
                        "xcorr_norm_y": xcorr_norm_y,
                        "dt_uniform_ms": round(dt_u * 1000, 2),
                    }

    # ── Landing precision ─────────────────────────────────────────────────
    if ctrl and ctrl.timestamps_s and ctrl.xy_error:
        desc_idx = [
            i for i, s in enumerate(ctrl.states)
            if s == 2 and _win(float(ctrl.timestamps_s[i]))
        ]  # DESCENDING=2
        if desc_idx:
            errs = [float(ctrl.xy_error[i]) for i in desc_idx if math.isfinite(float(ctrl.xy_error[i]))]
            if errs:
                final_xy = errs[-1]
                min_xy = min(errs)
                final_alt = ctrl.altitude[desc_idx[-1]]
                metrics["landing"] = {
                    "final_xy_error_m": round(final_xy, 3),
                    "min_xy_error_m": round(min_xy, 3),
                    "final_altitude_m": round(final_alt, 3),
                    "descent_samples": len(desc_idx),
                }

    # ── KF velocity convergence time (step response) ─────────────────────
    # Compare KF velocity XY against VLP (drone truth) velocity.
    # Detect step changes in VLP velocity, then measure how long until
    # KF velocity error settles to within threshold.
    if n_kf_valid >= 20 and vlp.timestamps_s and len(vlp.vx) >= 20:
        # VLP velocity is in NED body frame.  KF velocity is target-relative.
        # During tracking, target is stationary → KF velocity ≈ -drone velocity.
        # Use VLP speed for magnitude comparison (sign-agnostic).
        vlp_speed = [math.sqrt(vx**2 + vy**2) for vx, vy in zip(vlp.vx, vlp.vy)]
        kf_speed_full = [math.sqrt(vx**2 + vy**2)
                         for vx, vy in zip(kf_valid["vx"], kf_valid["vy"])]

        # Resample both to common uniform grid for comparison
        t_start = max(kf_valid["t"][0], vlp.timestamps_s[0])
        t_end = min(kf_valid["t"][-1], vlp.timestamps_s[-1])
        if t_end - t_start > 2.0:
            n_pts = int((t_end - t_start) * 50)  # 50 Hz grid
            dt_g = (t_end - t_start) / n_pts
            t_grid = [t_start + i * dt_g for i in range(n_pts)]

            vlp_spd_u = _interp_nearest(t_grid, vlp.timestamps_s, vlp_speed)
            kf_spd_u = _interp_nearest(t_grid, kf_valid["t"], kf_speed_full)

            # Detect velocity step changes (acceleration > threshold sustained)
            accel_thresh = 0.3  # m/s² → significant maneuver
            settle_thresh = 0.15  # m/s → consider converged when |error| < this
            step_events = []
            # Smooth VLP speed with small window to reduce noise
            win = max(3, min(10, n_pts // 20))
            vlp_smooth = []
            for i in range(n_pts):
                lo = max(0, i - win // 2)
                hi = min(n_pts, i + win // 2 + 1)
                vlp_smooth.append(sum(vlp_spd_u[lo:hi]) / (hi - lo))

            # Find regions where VLP speed derivative exceeds threshold
            in_step = False
            step_start_idx = 0
            for i in range(1, n_pts):
                accel = abs(vlp_smooth[i] - vlp_smooth[i - 1]) / dt_g
                if not in_step and accel > accel_thresh:
                    in_step = True
                    step_start_idx = i
                elif in_step and accel < accel_thresh * 0.3:
                    # Step ended — now measure KF settling time
                    in_step = False
                    step_end_idx = i
                    speed_change = abs(vlp_smooth[step_end_idx] - vlp_smooth[step_start_idx])
                    if speed_change < 0.1:
                        continue  # Too small, skip
                    # Find when KF speed converges to within settle_thresh of VLP
                    settle_idx = None
                    for j in range(step_end_idx, min(step_end_idx + int(3.0 / dt_g), n_pts)):
                        if abs(kf_spd_u[j] - vlp_smooth[j]) < settle_thresh:
                            settle_idx = j
                            break
                    converge_ms = ((settle_idx - step_start_idx) * dt_g * 1000
                                   if settle_idx is not None else float('nan'))
                    step_events.append({
                        "t_start": t_grid[step_start_idx],
                        "t_end": t_grid[step_end_idx],
                        "speed_change": round(speed_change, 3),
                        "converge_ms": round(converge_ms, 1) if settle_idx else None,
                    })

            if step_events:
                converge_times = [e["converge_ms"] for e in step_events
                                  if e["converge_ms"] is not None]
                metrics["kf_convergence"] = {
                    "step_events": step_events,
                    "n_steps": len(step_events),
                    "n_converged": len(converge_times),
                    "converge_ms_stats": stats_summary(converge_times, "ms") if converge_times else None,
                    "settle_threshold_mps": settle_thresh,
                    "vlp_speed_grid": vlp_spd_u,
                    "kf_speed_grid": kf_spd_u,
                    "t_grid": t_grid,
                }

    # ── Innovation whiteness (lag-1 ACF) + global 3σ consistency proxy ──
    innov_block = metrics.get("innovation")
    if innov_block and len(innov_block.get("innov_x", [])) > 5:
        ix = innov_block["innov_x"]
        iy = innov_block["innov_y"]
        iz = innov_block.get("innov_z", [])

        def _lag1_autocorr(series: list[float]) -> float:
            n = len(series)
            if n < 4:
                return 0.0
            m = sum(series) / n
            xc = [v - m for v in series]
            num = sum(xc[i] * xc[i + 1] for i in range(n - 1))
            den = sum(v * v for v in xc) or 1.0
            return num / den

        ac_x = _lag1_autocorr(ix)
        ac_y = _lag1_autocorr(iy)
        ac_z = _lag1_autocorr(iz) if len(iz) > 3 else 0.0
        sigma_xy = float(innov_block["xy"]["std"] or 0.0) or 1e-9
        innov_xy_list = innov_block.get("innov_xy", [])
        outside = sum(1 for v in innov_xy_list if abs(v) > 3 * sigma_xy)
        nxy = max(len(innov_xy_list), 1)
        frac_out = outside / nxy
        gauss_exp = 1 - 0.9973
        metrics["kalman_whiteness"] = {
            "acf_lag1_x": round(ac_x, 4),
            "acf_lag1_y": round(ac_y, 4),
            "acf_lag1_z": round(ac_z, 4),
            "acf_max_abs": round(max(abs(ac_x), abs(ac_y), abs(ac_z)), 4),
            "white_like": abs(ac_x) < 0.35 and abs(ac_y) < 0.35,
        }
        metrics["innovation_consistency"] = {
            "sigma_xy_m": round(sigma_xy, 5),
            "fraction_outside_3sigma_xy": round(frac_out, 4),
            "gaussian_expected_fraction": round(gauss_exp, 5),
            "tag": "overconfident" if frac_out > 0.05 else ("ok" if frac_out < 0.02 else "watch"),
        }
        nrm = len(ix)
        if nrm:
            mse_xy = sum(ix[i] ** 2 + iy[i] ** 2 for i in range(nrm)) / nrm
            rmse_xy = math.sqrt(mse_xy)
            mae_xy = sum(innov_xy_list) / max(len(innov_xy_list), 1)
            metrics["det_vs_kf_errors"] = {
                "rmse_xy_m": round(rmse_xy, 5),
                "mae_xy_m": round(mae_xy, 5),
                "rmse_x_m": round(math.sqrt(sum(v * v for v in ix) / nrm), 5),
                "rmse_y_m": round(math.sqrt(sum(v * v for v in iy) / nrm), 5),
            }

    # ── FFT dominant frequency on uniform KF Z (vibration / bobbing proxy) ──
    if n_kf_valid >= 64:
        t0f = float(kf_valid["t"][0])
        t1f = float(kf_valid["t"][-1])
        span = t1f - t0f
        if span > 2.0:
            fs = 40.0
            n = int(min(512, max(64, span * fs)))
            dt = span / max(n - 1, 1)
            t_u = [t0f + i * dt for i in range(n)]
            z_u = _interp_nearest(t_u, kf_valid["t"], kf_valid["z"])
            zm = sum(z_u) / len(z_u)
            zc = [v - zm for v in z_u]
            best_f, best_mag = 0.0, 0.0
            for k in range(1, n // 2):
                f = k / (n * dt)
                if f < 0.08 or f > 24.0:
                    continue
                ang = 2 * math.pi * k / n
                re = sum(zc[j] * math.cos(ang * j) for j in range(n))
                im = sum(zc[j] * math.sin(ang * j) for j in range(n))
                mag = math.hypot(re, im)
                if mag > best_mag:
                    best_mag = mag
                    best_f = f
            metrics["kf_position_fft"] = {
                "dominant_hz": round(best_f, 3),
                "magnitude_au": round(best_mag, 2),
                "fs_hz": round(1.0 / dt, 2),
                "n_samples": n,
            }

    # ── Controller: horizontal setpoint speed vs VLP body horizontal speed ──
    if traj and traj.timestamps_s and len(traj.timestamps_s) > 20 and vlp.timestamps_s:
        tv = vlp.timestamps_s
        vlp_xy_spd = [math.hypot(float(vx), float(vy)) for vx, vy in zip(vlp.vx, vlp.vy)]
        cmd_spd = [math.hypot(float(traj.vx[i]), float(traj.vy[i])) for i in range(len(traj.vx))]
        fb_spd = [_interp_nearest([t], tv, vlp_xy_spd)[0] for t in traj.timestamps_s]
        err = [abs(c - f) for c, f in zip(cmd_spd, fb_spd) if math.isfinite(f)]
        if err:
            metrics["control_tracking"] = {
                "mean_abs_cmd_minus_vlp_spd_mps": round(sum(err) / len(err), 4),
                "max_abs_cmd_minus_vlp_spd_mps": round(max(err), 4),
                "cmd_spd": cmd_spd,
                "fb_spd": fb_spd,
                "timestamps_s": list(traj.timestamps_s),
            }
        # Step-like transients on command magnitude
        if len(cmd_spd) > 40:
            dcmd = [
                abs(cmd_spd[i + 1] - cmd_spd[i]) / max(traj.timestamps_s[i + 1] - traj.timestamps_s[i], 1e-6)
                for i in range(len(cmd_spd) - 1)
            ]
            thr = sorted(dcmd)[int(len(dcmd) * 0.97)] if dcmd else 0.0
            steps = []
            for i in range(1, len(dcmd) - 1):
                if dcmd[i] > max(0.8, thr * 0.5):
                    t0s = traj.timestamps_s[i]
                    base = cmd_spd[i]
                    settle_ms = None
                    overshoot = None
                    for j in range(i, min(i + 200, len(cmd_spd))):
                        if abs(cmd_spd[j] - fb_spd[j]) < 0.12:
                            settle_ms = (traj.timestamps_s[j] - t0s) * 1000
                            seg = fb_spd[i : j + 1]
                            if seg and base > 0.05:
                                mx = max(seg)
                                mn = min(seg)
                                overshoot = max(0.0, (mx - base) / base, (base - mn) / base)
                            break
                    steps.append({
                        "t_s": round(t0s, 3),
                        "settle_ms": round(settle_ms, 1) if settle_ms is not None else None,
                        "overshoot_ratio": round(overshoot, 3) if overshoot is not None else None,
                    })
            if steps:
                settles = [s["settle_ms"] for s in steps if s["settle_ms"] is not None]
                metrics["control_step_response"] = {
                    "n_steps": len(steps),
                    "settle_ms_stats": stats_summary(settles, "ms") if settles else None,
                    "examples": steps[:12],
                }

    return metrics


class AnalyticsEngine:
    """RMSE/MAE, innovation, phase lag, FFT, and extended Kalman / control KPIs."""

    assess_data_quality = staticmethod(assess_data_quality)
    compute_accuracy = staticmethod(compute_accuracy)
    recommended_analysis_window = staticmethod(recommended_analysis_window)

