"""Narrative interpretation HTML for reports."""
from __future__ import annotations

import math

from .utils import stats_summary

def _grade(value, good_thresh, warn_thresh, lower_is_better=True):
    """Return ('good'|'warn'|'bad', emoji) based on thresholds."""
    if lower_is_better:
        if value <= good_thresh:
            return "good", "&#9989;"   # ✅
        elif value <= warn_thresh:
            return "warn", "&#9888;&#65039;"   # ⚠️
        else:
            return "bad", "&#10060;"   # ❌
    else:
        if value >= good_thresh:
            return "good", "&#9989;"
        elif value >= warn_thresh:
            return "warn", "&#9888;&#65039;"
        else:
            return "bad", "&#10060;"


def generate_interpretation(accuracy, latency, kf, det, ctrl, vlp, quality_score):
    """
    Generate an HTML interpretation section that explains every metric,
    grades the system, and suggests tunable parameters for improvement.

    Returns an HTML string to insert into the report.
    """
    innov = accuracy.get("innovation", {})
    landing = accuracy.get("landing", {})
    approach = accuracy.get("approach", {})
    smoothness = accuracy.get("smoothness", {})
    det_noise = accuracy.get("det_noise", {})
    vc = accuracy.get("valid_counts", {})

    cam_det = stats_summary(latency.cam_to_det_ms)
    det_est = stats_summary(latency.det_to_est_ms)
    cam_est = stats_summary(latency.cam_to_est_ms)

    cam_ctrl = stats_summary(latency.cam_to_ctrl_ms)
    est_ctrl = stats_summary(latency.est_to_ctrl_ms)
    det_total = sum(det.status_counts.values()) or 1
    det_rate = 100.0 * det.status_counts.get("DETECTED", 0) / det_total
    kf_total = sum(kf.status_counts.values()) or 1
    kf_track = 100.0 * (kf.status_counts.get("DETECTED", 0) + kf.status_counts.get("PREDICTED", 0)) / kf_total

    findings = []  # list of (subsystem, grade_cls, emoji, title, explanation, params)

    # ── 1. Detection System ───────────────────────────────────────────────
    g, e = _grade(det_rate, 80, 50, lower_is_better=False)
    expl = (
        f"<b>Detection rate = {det_rate:.0f}%</b> — the fraction of frames where the ArUco marker was successfully detected. "
        f"Status breakdown: DETECTED={det.status_counts.get('DETECTED',0)}, LOST={det.status_counts.get('LOST',0)}."
    )
    if det_rate > 80:
        expl += " The detector reliably finds the marker in most frames. This is excellent."
    elif det_rate > 50:
        expl += " The marker is occasionally lost. This happens when the drone is far away, the marker is partially occluded, or lighting conditions are poor."
    else:
        expl += " The marker is frequently lost, severely limiting tracking quality. The system cannot land precisely without reliable detections."

    params = []
    if det_rate < 80:
        params.append(("<code>marker_size_m</code>", "Increase physical marker size for easier detection at distance"))
        params.append(("<code>camera resolution</code>", "Higher resolution improves detection range (trades off latency)"))
        params.append(("<code>adaptive_thresh_block_size</code>", "Tune ArUco adaptive threshold for current lighting"))
        params.append(("<code>min_marker_perimeter_rate</code>", "Lower → detect smaller markers, but more false positives"))
    findings.append(("Detection", g, e, "ArUco Marker Detection", expl, params))

    # Detector noise / jitter
    if det_noise:
        jx = det_noise.get("jitter_x", {}).get("mean", 0)
        jy = det_noise.get("jitter_y", {}).get("mean", 0)
        jitter_xy = math.sqrt(jx**2 + jy**2)
        g2, e2 = _grade(jitter_xy, 0.02, 0.08)
        expl2 = (
            f"<b>Detector jitter σ = {jitter_xy:.4f}m (X={jx:.4f}m, Y={jy:.4f}m)</b> — "
            "the windowed standard deviation of raw detector measurements. "
            "This reflects camera noise, marker pose estimation instability, and vibration."
        )
        if jitter_xy < 0.02:
            expl2 += " Very low jitter — the raw measurements are stable. Excellent camera + solvePnP performance."
        elif jitter_xy < 0.08:
            expl2 += " Moderate jitter — the Kalman filter should smooth this adequately."
        else:
            expl2 += " High jitter — consider improving camera stability (vibration dampening) or increasing marker size."
        params2 = []
        if jitter_xy > 0.03:
            params2.append(("<code>marker_size_m</code>", "Larger markers give more stable solvePnP pose estimates"))
            params2.append(("Camera mounting", "Add vibration dampening to reduce image blur"))
        findings.append(("Detection", g2, e2, "Detector Measurement Noise", expl2, params2))

    # ── 2. Kalman Filter ──────────────────────────────────────────────────
    g, e = _grade(kf_track, 85, 60, lower_is_better=False)
    expl = (
        f"<b>KF track rate = {kf_track:.0f}%</b> — the fraction of estimator outputs in DETECTED or PREDICTED state "
        f"(vs LOST). DETECTED={kf.status_counts.get('DETECTED',0)}, "
        f"PREDICTED={kf.status_counts.get('PREDICTED',0)}, LOST={kf.status_counts.get('LOST',0)}."
    )
    if kf_track > 85:
        expl += " The KF maintains a solid track. When detections are briefly lost, the prediction model bridges the gap."
    elif kf_track > 60:
        expl += " The KF loses track periodically. The prediction model coasts during detection gaps but may drift."
    else:
        expl += " The KF is mostly in LOST state. This means insufficient detector input and the filter cannot maintain a track."
    params = []
    if kf_track < 85:
        params.append(("<code>predict_timeout_s</code>", "Increase to let KF predict longer during detection gaps (risk: drift)"))
        params.append(("<code>process_noise_q</code> (Q matrix)", "Increase diagonal → KF trusts predictions less, responds faster to new detections"))
    findings.append(("Kalman Filter", g, e, "KF Track Continuity", expl, params))

    # Innovation
    if innov:
        innov_xy_mean = innov["xy"]["mean"]
        innov_xy_max = innov["xy"]["max"]
        g, e = _grade(innov_xy_mean, 0.05, 0.2)
        expl = (
            f"<b>Innovation XY mean = {innov_xy_mean:.4f}m, max = {innov_xy_max:.4f}m</b> — "
            "innovation is the difference between the KF prediction and the detector measurement at each step. "
            "It measures how well the KF model matches reality. "
            "Small innovation → KF accurately predicts where the marker will be. "
            "Large innovation → KF model deviates from actual movement (target moved unexpectedly, or filter is too sluggish)."
        )
        if innov_xy_mean < 0.05:
            expl += " Excellent: the KF prediction closely tracks the detector. The constant-velocity model fits well."
        elif innov_xy_mean < 0.2:
            expl += " Acceptable: some deviation between KF and detector. Consider tuning process noise."
        else:
            expl += " Poor: the KF is significantly out of sync with detections. The motion model may be inadequate, or Q/R need tuning."
        params = []
        if innov_xy_mean > 0.05:
            params.append(("<code>process_noise_q</code> (Q matrix)", "Increase → KF trusts prediction less, adapts faster to new measurements"))
            params.append(("<code>measurement_noise_r</code> (R matrix)", "Decrease → KF trusts detector more (only if detector jitter is low)"))
        findings.append(("Kalman Filter", g, e, "Innovation (KF vs Detector Agreement)", expl, params))

    # KF Smoothness
    if smoothness:
        acc_mean = smoothness.get("acc_xy", {}).get("mean", 0)
        g, e = _grade(acc_mean, 1.0, 5.0)
        expl = (
            f"<b>KF acceleration magnitude mean = {acc_mean:.3f} m/s²</b> — "
            "computed from the derivative of KF velocity estimates. "
            "Low values mean the KF output is smooth (good for controller); high values mean the estimate is jerky."
        )
        if acc_mean < 1.0:
            expl += " Very smooth output. The controller receives stable position/velocity estimates."
        elif acc_mean < 5.0:
            expl += " Some jitter in KF velocity. The controller may exhibit oscillation."
        else:
            expl += " High KF jitter — the controller will struggle. Increase process noise or reduce measurement trust."
        params = []
        if acc_mean > 1.0:
            params.append(("<code>process_noise_q</code> (Q matrix)", "Increase velocity noise terms to smooth output more (trades off responsiveness)"))
        findings.append(("Kalman Filter", g, e, "KF Smoothness (Output Jitter)", expl, params))

    # KF Velocity estimation quality
    vel_acc = accuracy.get("velocity", {})
    phase_acc = accuracy.get("phase_delay", {})
    if vel_acc:
        vel_err_mean = vel_acc["err_xy_stats"]["mean"]
        kf_speed_mean = vel_acc["kf_speed_stats"]["mean"]
        det_speed_mean = vel_acc["det_speed_stats"]["mean"]
        g, e = _grade(vel_err_mean, 0.2, 0.8)
        expl = (
            f"<b>Velocity error |ΔV_xy| mean = {vel_err_mean:.4f} m/s</b> — "
            f"KF mean speed = {kf_speed_mean:.4f} m/s, detector-derived mean speed = {det_speed_mean:.4f} m/s. "
            "The KF estimates target velocity internally from its constant-velocity motion model. "
            "Detector-derived velocity is computed from numerical differentiation of raw position measurements (noisy reference). "
            "For a <b>stationary target</b> (ArUco on ground), both should be ~0 m/s. "
            "For a <b>moving target</b>, the KF velocity should track the target's actual movement."
        )
        if kf_speed_mean < 0.05 and det_speed_mean < 0.5:
            expl += " Target appears stationary — KF correctly estimates near-zero velocity. Detector derivative noise is expected from measurement jitter."
        elif vel_err_mean < 0.2:
            expl += " Good velocity tracking — KF velocity closely matches the position-derived reference."
        elif vel_err_mean < 0.8:
            expl += " Moderate velocity deviation — the KF may be over-smoothing or under-reacting to velocity changes."
        else:
            expl += " Large velocity error — the KF velocity estimate is significantly off. Consider tuning Q matrix velocity terms."
        params = []
        if vel_err_mean > 0.2 and kf_speed_mean > 0.05:
            params.append(("<code>process_noise_q</code> (velocity terms)", "Increase velocity diagonal in Q → KF adapts faster to velocity changes"))
            params.append(("<code>measurement_noise_r</code>", "Decrease → KF trusts position measurements more, improving velocity estimate indirectly"))
        findings.append(("Velocity Estimation", g, e, "KF Velocity Accuracy", expl, params))

    # Phase delay
    if phase_acc:
        pd_mean = phase_acc["mean_ms"]
        pd_x = phase_acc["x_ms"]
        pd_y = phase_acc["y_ms"]
        g, e = _grade(abs(pd_mean), 15, 40)
        expl = (
            f"<b>Phase delay: X = {pd_x:.1f}ms, Y = {pd_y:.1f}ms, mean = {pd_mean:.1f}ms</b> — "
            "measured via cross-correlation between detector position (reference) and KF position (estimate). "
            "Positive lag means the KF output lags behind the raw detector measurement. "
            "This delay has two sources: (1) computational pipeline latency, and (2) KF smoothing inherent lag. "
            f"For reference, the pipeline latency is ~{cam_est['mean']:.0f}ms (camera→estimator)."
        )
        if abs(pd_mean) < 15:
            expl += " Minimal phase delay — the KF tracks position changes with negligible lag. Excellent for landing control."
        elif abs(pd_mean) < 40:
            expl += " Moderate phase delay. At 0.5 m/s descent, this corresponds to ~{:.0f}mm of position staleness.".format(abs(pd_mean) * 0.5)
            expl += " Acceptable for slow approach, but may cause overshoot during fast maneuvers."
        else:
            expl += " Significant phase delay. The KF is too sluggish — position estimates are stale by ~{:.0f}ms.".format(abs(pd_mean))
            expl += " This will cause the controller to overshoot the target."
        params = []
        if abs(pd_mean) > 15:
            params.append(("<code>process_noise_q</code>", "Increase → KF responds faster to new measurements (reduces lag, increases noise)"))
            params.append(("<code>measurement_noise_r</code>", "Decrease → KF trusts detector more, reducing lag"))
            if abs(pd_mean) > 40:
                params.append(("<code>latency_compensation</code>", "Enable/increase latency compensation in the estimator to counteract pipeline delay"))
        findings.append(("Velocity Estimation", g, e, "KF Phase Delay vs Detector", expl, params))

    # ── 3. Pipeline Latency ───────────────────────────────────────────────
    # Use Camera→Controller as primary E2E metric (full pipeline).
    # Fall back to Camera→Estimator if controller data missing.
    e2e_src = cam_ctrl if cam_ctrl["n"] > 0 else cam_est
    e2e_label = "Camera→Controller" if cam_ctrl["n"] > 0 else "Camera→Estimator"
    e2e_p95 = e2e_src["p95"]
    g, e = _grade(e2e_p95, 50, 100)
    expl = (
        f"<b>End-to-end latency ({e2e_label}) p95 = {e2e_p95:.1f}ms</b> — "
        f"mean={e2e_src['mean']:.1f}ms. Breakdown: Camera→Detector mean={cam_det['mean']:.1f}ms, "
        f"Detector→Estimator mean={det_est['mean']:.1f}ms, "
        f"Camera→Estimator mean={cam_est['mean']:.1f}ms, "
        f"Estimator→Controller mean={est_ctrl['mean']:.1f}ms."
    )
    expl += (
        " This is the total delay from image capture to position estimate. "
        "For a drone descending at 0.5 m/s, each 10ms of latency ≈ 5mm of position staleness."
    )
    if e2e_p95 < 50:
        expl += " Excellent latency. Full pipeline completes within one camera frame period."
    elif e2e_p95 < 100:
        expl += " Acceptable latency. May cause slight position lag during fast maneuvers."
    else:
        expl += " High latency. Consider reducing image resolution or optimizing ArUco detection."
    params = []
    if cam_det["mean"] > 20:
        params.append(("<code>camera resolution</code>", "Lower resolution → faster detection (trades off detection range)"))
        params.append(("<code>ArUco dictionary</code>", "Smaller dictionaries (e.g., 4X4_50) are faster to detect"))
    if det_est["mean"] > 10:
        params.append(("<code>estimator_rate_hz</code>", "KF update rate — higher rate doesn't help if limited by detector"))
    findings.append(("Latency", g, e, "End-to-End Pipeline Latency", expl, params))

    # ── 4. Landing Precision ──────────────────────────────────────────────
    if landing:
        final_xy = landing["final_xy_error_m"]
        min_xy = landing["min_xy_error_m"]
        g, e = _grade(final_xy, 0.15, 0.5)
        expl = (
            f"<b>Final XY error = {final_xy:.3f}m ({final_xy*100:.1f}cm)</b>, "
            f"min XY error during descent = {min_xy:.3f}m ({min_xy*100:.1f}cm), "
            f"final altitude = {landing['final_altitude_m']:.2f}m. "
            "Final XY error is the horizontal distance between drone and target at the last DESCENDING sample. "
            "This is the most important metric for precision landing quality."
        )
        if final_xy < 0.15:
            expl += " Outstanding precision. The drone lands within 15cm of the target center — well within a typical landing pad."
        elif final_xy < 0.5:
            expl += " Good precision, but there's room for improvement. Check if the error oscillates (controller gains too aggressive) or steadily drifts (gains too low)."
        else:
            expl += " Poor landing precision. The drone misses the target significantly. Check approach charts to diagnose whether the error is from tracking, latency, or controller response."
        params = []
        if final_xy > 0.1:
            params.append(("<code>kp_xy</code>", "Proportional gain for XY position → increase for faster convergence (risk: oscillation)"))
            params.append(("<code>kd_xy</code> / <code>kv_xy</code>", "Derivative/velocity gain → increase for better damping if XY oscillates"))
            params.append(("<code>descent_rate_m_s</code>", "Slower descent gives more time to align (trades off landing speed)"))
        findings.append(("Landing", g, e, "Landing Precision", expl, params))

    # Landing approach convergence
    if approach:
        xy_stats = approach.get("xy_stats", {})
        rel_xy = approach.get("rel_xy", [])
        if rel_xy:
            last_10pct = rel_xy[int(len(rel_xy) * 0.9):]
            final_rel = sum(last_10pct) / len(last_10pct) if last_10pct else 0
            g, e = _grade(final_rel, 0.3, 1.0)
            expl = (
                f"<b>Approach convergence: final 10% average = {final_rel:.3f}m</b> "
                f"(range mean={xy_stats.get('mean',0):.3f}m). "
                "The approach chart shows target−drone XY distance over time. "
                "A healthy landing shows this monotonically decreasing toward 0. "
                "Oscillation = P gain too high; flat convergence = P gain too low."
            )
            if final_rel < 0.3:
                expl += " Good convergence — the drone actively closed on the target."
            else:
                expl += " The drone did not converge on the target. Check controller gains and descent strategy."
            findings.append(("Landing", g, e, "Approach Convergence", expl, []))

    # ── 5. Controller Health ──────────────────────────────────────────────
    if ctrl.timestamps_s:
        states_set = set(ctrl.states)
        # Check state progression
        expected = {0: "SEARCH", 1: "ALIGN", 2: "DESCEND"}
        reached = [s for s in [0, 1, 2, 3] if s in states_set]
        state_names = {0: "SEARCH", 1: "ALIGN", 2: "DESCEND", 3: "LANDED", 4: "RTL"}
        reached_str = " → ".join(state_names.get(s, f"?{s}") for s in reached)
        if 3 in states_set:
            g, e = "good", "&#9989;"
            expl = f"<b>FSM reached LANDED state.</b> State progression: {reached_str}. The full autonomous landing sequence completed successfully."
        elif 2 in states_set:
            g, e = "warn", "&#9888;&#65039;"
            expl = f"<b>FSM reached DESCEND but not LANDED.</b> States: {reached_str}. The descent was in progress but may not have completed."
        else:
            g, e = "bad", "&#10060;"
            expl = f"<b>FSM did not reach DESCEND.</b> States: {reached_str}. The landing sequence did not progress far enough — check detection reliability and trigger thresholds."
        params = []
        if 2 not in states_set:
            params.append(("<code>align_timeout_s</code>", "Increase to give the drone more time to align before giving up"))
            params.append(("<code>confidence_threshold</code>", "Lower threshold to enter DESCEND earlier (risk: descend with poor estimate)"))
        findings.append(("Controller", g, e, "FSM State Progression", expl, params))

    # ── Build overall grade ───────────────────────────────────────────────
    bad_count = sum(1 for _, g, _, _, _, _ in findings if g == "bad")
    warn_count = sum(1 for _, g, _, _, _, _ in findings if g == "warn")
    good_count = sum(1 for _, g, _, _, _, _ in findings if g == "good")
    total = len(findings)

    if bad_count == 0 and warn_count == 0:
        overall_cls, overall_icon, overall_text = "good", "&#9989;", "EXCELLENT"
        overall_desc = "All subsystems are performing well. The precision landing pipeline is operating optimally."
    elif bad_count == 0:
        overall_cls, overall_icon, overall_text = "warn", "&#9888;&#65039;", "GOOD (with notes)"
        overall_desc = f"{warn_count} metric(s) could be improved, but no critical issues. See details below."
    elif bad_count <= 2:
        overall_cls, overall_icon, overall_text = "warn", "&#9888;&#65039;", "NEEDS ATTENTION"
        overall_desc = f"{bad_count} critical issue(s) and {warn_count} warning(s) found. Address the red items first."
    else:
        overall_cls, overall_icon, overall_text = "bad", "&#10060;", "POOR"
        overall_desc = f"{bad_count} critical issues detected. The pipeline is not performing adequately for precision landing."

    # ── Render HTML ───────────────────────────────────────────────────────
    html = f'<h2 id="sec-interpretation">13. Interpretation &amp; Diagnosis</h2>\n'
    html += f'<div class="alert alert-{overall_cls}" style="font-size:16px;font-weight:700">'
    html += f'{overall_icon} Overall: {overall_text} — {good_count} good, {warn_count} warnings, {bad_count} critical'
    html += f'</div>\n'
    html += f'<p style="color:#8b949e">{overall_desc}</p>\n'

    # Group findings by subsystem
    subsystems = []
    seen = set()
    for subsys, _, _, _, _, _ in findings:
        if subsys not in seen:
            subsystems.append(subsys)
            seen.add(subsys)

    for subsys in subsystems:
        html += f'<h3 style="color:#58a6ff;margin-top:24px">{subsys}</h3>\n'
        sub_findings = [(g, e, t, ex, p) for s, g, e, t, ex, p in findings if s == subsys]
        for grade, emoji, title, explanation, params in sub_findings:
            html += f'<div class="card" style="margin-bottom:12px">\n'
            html += f'<h3>{emoji} <span class="{grade}">{title}</span></h3>\n'
            html += f'<p style="font-size:13px;line-height:1.6">{explanation}</p>\n'
            if params:
                html += '<table style="margin-top:8px"><tr><th>Parameter</th><th>Tuning Suggestion</th></tr>\n'
                for pname, pdesc in params:
                    html += f'<tr><td>{pname}</td><td style="color:#8b949e">{pdesc}</td></tr>\n'
                html += '</table>\n'
            html += '</div>\n'

    # ── Quick-reference parameter table ───────────────────────────────────
    all_params = []
    for _, g, _, _, _, params in findings:
        for pname, pdesc in params:
            all_params.append((pname, pdesc, g))

    if all_params:
        html += '<h3 style="color:#58a6ff;margin-top:24px">Parameter Tuning Summary</h3>\n'
        html += '<div class="card"><table>\n'
        html += '<tr><th>Parameter</th><th>Suggestion</th><th>Priority</th></tr>\n'
        # Sort by priority: bad first, then warn
        priority_order = {"bad": 0, "warn": 1, "good": 2}
        all_params.sort(key=lambda x: priority_order.get(x[2], 2))
        seen_params = set()
        for pname, pdesc, pg in all_params:
            if pname in seen_params:
                continue
            seen_params.add(pname)
            pcls = "bad" if pg == "bad" else ("warn" if pg == "warn" else "good")
            plabel = "HIGH" if pg == "bad" else ("MEDIUM" if pg == "warn" else "LOW")
            html += f'<tr><td>{pname}</td><td style="color:#8b949e">{pdesc}</td>'
            html += f'<td class="{pcls}">{plabel}</td></tr>\n'
        html += '</table></div>\n'

    # ── Chart legend / reading guide ──────────────────────────────────────
    html += '<h3 style="color:#58a6ff;margin-top:24px">How to Read the Charts</h3>\n'
    html += '<div class="card"><table>\n'
    html += '<tr><th>Chart</th><th>What It Shows</th><th>What Good Looks Like</th></tr>\n'
    chart_guide = [
        ("Top-Down XY", "East–North plane: VLP NED mapped to (east,north); target KF/detector in ROS odom ENU.",
         "Green path converges toward yellow cluster — drone flew to the target."),
        ("Altitude Profile", "Drone height over time. Dist-bottom is rangefinder reading.",
         "Smooth descent from cruise altitude to ground. No sudden altitude changes."),
        ("XY Distance to Target", "Controller-reported horizontal error between drone and target over time.",
         "Monotonically decreasing during descent. Low final value = precise landing."),
        ("Approach Vector", "ΔEast and ΔNorth (target ENU minus drone mapped from NED). Horizontal closing error.",
         "Converges smoothly to 0. Oscillation = P gain too high. No convergence = P gain too low."),
        ("Innovation Over Time", "KF prediction error: det − KF at each timestep (both are target position).",
         "Small, zero-mean, no drift. Spikes = sudden target movement or missed detections."),
        ("Innovation Scatter", "Innovation X vs Y colored by time. Shows directional bias in KF error.",
         "Tight cluster around (0,0). Elongated shape = directional bias in estimation."),
        ("Detector vs KF: X/Y", "Raw detector measurements (dots) vs KF smoothed estimate (line).",
         "KF line should track detector dots closely with less noise. Smooth line through noisy dots."),
        ("KF Vel vs Det Deriv", "KF estimated velocity (lines) vs numerical derivative of detector positions (dots). Both estimate target velocity.",
         "KF lines should be smooth. For stationary targets, both near 0. KF should filter out the noisy spikes from detector derivative."),
        ("Velocity XY Speed", "Magnitude of horizontal velocity vector for KF and detector-derived estimates over time.",
         "For stationary target: KF speed ≈0, detector derivative shows only measurement noise. For moving target: KF tracks actual speed."),
        ("Velocity Error", "Difference between KF velocity and detector-derived velocity over time. Shows how well KF velocity matches reality.",
         "Small values near 0. Systematic offset = velocity estimation bias. Large spikes = KF lag or missed velocity changes."),
        ("Cross-Correlation", "Normalized cross-correlation of detector vs KF position at varying time lags. Peak location = phase delay.",
         "Peak near lag=0 means minimal phase delay. Peak at positive lag = KF output is delayed. Sharper peak = more reliable estimate."),
        ("Descent Profile", "Altitude vs XY error during descent. Color = time. Lower-left = landed on target.",
         "Funnel converging to lower-left corner. Straight diagonal = consistent descent."),
        ("Latency Distribution", "Histogram of processing delays between pipeline stages.",
         "Narrow distribution with low mean. No long tail. All samples under 100ms."),
    ]
    for name, shows, good in chart_guide:
        html += f'<tr><td><b>{name}</b></td><td style="color:#8b949e">{shows}</td>'
        html += f'<td style="color:#8b949e">{good}</td></tr>\n'
    html += '</table></div>\n'

    return html

