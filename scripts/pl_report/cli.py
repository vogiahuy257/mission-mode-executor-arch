"""CLI entry: analyze an existing bag, write HTML + JSON KPI exports."""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

from .analytics_engine import assess_data_quality, compute_accuracy, recommended_analysis_window
from .data_provider import DataProvider
from .report_generator import generate_html
from .utils import stats_summary


def _build_summary_json(
    accuracy: dict,
    latency,
    det,
    kf,
    ctrl,
    quality_score: int,
) -> dict:
    landing = accuracy.get("landing", {})
    cam_ctrl = stats_summary(latency.cam_to_ctrl_ms)
    cam_est = stats_summary(latency.cam_to_est_ms)
    e2e = cam_ctrl if cam_ctrl["n"] > 0 else cam_est
    det_total = sum(det.status_counts.values()) or 1
    det_rate = det.status_counts.get("DETECTED", 0) / det_total
    kf_total = sum(kf.status_counts.values()) or 1
    kf_track = (kf.status_counts.get("DETECTED", 0) + kf.status_counts.get("PREDICTED", 0)) / kf_total
    landed = bool(ctrl.states) and (3 in set(ctrl.states))
    return {
        "quality_score": quality_score,
        "success_landed_fsm": landed,
        "detection_rate": round(det_rate, 4),
        "kf_track_rate": round(kf_track, 4),
        "final_xy_error_m": landing.get("final_xy_error_m"),
        "min_xy_error_m": landing.get("min_xy_error_m"),
        "max_e2e_latency_ms": e2e.get("max"),
        "p95_e2e_latency_ms": e2e.get("p95"),
        "mean_e2e_latency_ms": e2e.get("mean"),
        "innovation_rmse_xy_m": accuracy.get("det_vs_kf_errors", {}).get("rmse_xy_m"),
        "phase_delay_mean_ms": accuracy.get("phase_delay", {}).get("mean_ms"),
        "kf_fft_peak_hz": accuracy.get("kf_position_fft", {}).get("dominant_hz"),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Flight Log Review & Algorithm Accuracy Analysis")
    parser.add_argument("--bag", type=str, required=True, help="Path to existing rosbag2 directory")
    parser.add_argument("--output", type=str, default=None, help="Output HTML file path")
    parser.add_argument(
        "--no-analysis-window",
        action="store_true",
        help="Use full bag for metrics (do not trim to armed / ALIGN+ FSM start)",
    )
    args = parser.parse_args()

    ws = Path(__file__).resolve().parent.parent.parent
    if args.output:
        html_path = Path(args.output)
        output_dir = html_path.parent
    else:
        output_dir = ws / "log" / "report" / time.strftime("%Y%m%d_%H%M%S")
        html_path = output_dir / "report.html"
    output_dir.mkdir(parents=True, exist_ok=True)

    bag_path = Path(args.bag)
    if not bag_path.exists():
        sys.exit(f"ERROR: Bag not found: {bag_path}")

    print(f"\n[analyze] Reading bag: {bag_path}")
    topic_stats, latency, kf, det, ctrl, traj, vlp, vstatus, events = DataProvider.read_bag(bag_path)

    print("\n[summary] Topic counts:")
    for key, ts in topic_stats.items():
        if not ts.present_in_bag:
            print(f"  {ts.name:44s}  NOT_RECORDED")
        else:
            print(f"  {ts.name:44s}  count={ts.count:6d}  hz={ts.hz_mean:6.1f}")

    print("\n[summary] Pipeline latency:")
    cam_anchor = topic_stats.get("camera_info") and topic_stats["camera_info"].present_in_bag
    if not cam_anchor and topic_stats.get("camera"):
        cam_anchor = topic_stats["camera"].present_in_bag
    for label, data in [
        ("Frame → Detector     ", latency.cam_to_det_ms if cam_anchor else None),
        ("Detector → Estimator ", latency.det_to_est_ms),
        ("Frame → Estimator    ", latency.cam_to_est_ms if cam_anchor else None),
        ("Estimator → Controller", latency.est_to_ctrl_ms),
        ("Frame → Controller   ", latency.cam_to_ctrl_ms if cam_anchor else None),
    ]:
        if data is None:
            print(f"  {label}:  N/A (no /pl/camera/camera_info or image_raw in bag)")
        else:
            s = stats_summary(data)
            print(f"  {label}:  mean={s['mean']:6.1f}ms  p95={s['p95']:6.1f}ms  n={s['n']}")

    print(
        f"\n[summary] KF track rate: "
        f"L={kf.status_counts['LOST']} D={kf.status_counts['DETECTED']} "
        f"P={kf.status_counts['PREDICTED']}  dropped={kf.dropped}"
    )

    quality_score, quality_warnings = assess_data_quality(det, kf, ctrl, vlp)
    if quality_warnings:
        print(f"\n[quality] Score: {quality_score}/100")
        for level, msg in quality_warnings:
            print(f"  [{level.upper()}] {msg}")

    t0, t1 = (None, None)
    if not args.no_analysis_window:
        t0, t1 = recommended_analysis_window(vstatus, ctrl)
        if t0 is not None:
            print(f"\n[metrics] Analysis time window: t >= {t0:.3f}s (armed + precision landing start)")

    print("\n[accuracy] Computing accuracy metrics...")
    accuracy = compute_accuracy(det, kf, vlp, ctrl, traj, analysis_t0=t0, analysis_t1=t1)

    if "innovation" in accuracy:
        inv = accuracy["innovation"]
        print(
            f"  Innovation XY:  mean={inv['xy']['mean']:.4f}m  "
            f"std={inv['xy']['std']:.4f}m  max={inv['xy']['max']:.4f}m"
        )
        print(
            f"  Innovation 3D:  mean={inv['3d']['mean']:.4f}m  "
            f"std={inv['3d']['std']:.4f}m  max={inv['3d']['max']:.4f}m"
        )

    if "smoothness" in accuracy:
        sm = accuracy["smoothness"]
        print(f"  KF vel std:     X={sm['vel_std_x']['std']:.4f}  Y={sm['vel_std_y']['std']:.4f}")
        print(f"  KF acc XY:      mean={sm['acc_xy']['mean']:.3f} m/s²")

    if "velocity" in accuracy:
        va = accuracy["velocity"]
        print(
            f"  KF speed:       mean={va['kf_speed_stats']['mean']:.4f} m/s  "
            f"max={va['kf_speed_stats']['max']:.4f} m/s"
        )
        print(
            f"  Vel error |ΔXY|: mean={va['err_xy_stats']['mean']:.4f} m/s  "
            f"max={va['err_xy_stats']['max']:.4f} m/s"
        )

    if "phase_delay" in accuracy:
        pd = accuracy["phase_delay"]
        print(f"  Phase delay:    X={pd['x_ms']:.1f}ms  Y={pd['y_ms']:.1f}ms  mean={pd['mean_ms']:.1f}ms")

    if "landing" in accuracy:
        ld = accuracy["landing"]
        print(
            f"  Landing:        final_xy={ld['final_xy_error_m']:.3f}m  "
            f"min_xy={ld['min_xy_error_m']:.3f}m  alt={ld['final_altitude_m']:.2f}m"
        )

    vlp_ts = topic_stats.get("vlp")
    if vlp_ts:
        print(f"\n[summary] VehicleLocalPosition: {vlp_ts.hz_mean:.1f} Hz ({vlp_ts.count} msgs)")

    report = generate_html(
        html_path, topic_stats, latency, kf, det, ctrl, traj, vlp, vstatus, events, accuracy,
        quality_score, quality_warnings,
    )
    print(f"\n[done] Report: {report}")

    acc_json = output_dir / "accuracy.json"
    acc_export = {}
    for k, v in accuracy.items():
        if isinstance(v, dict):
            acc_export[k] = {kk: vv for kk, vv in v.items() if not isinstance(vv, list)}
    acc_export["latency"] = {
        "cam_to_det": stats_summary(latency.cam_to_det_ms),
        "det_to_est": stats_summary(latency.det_to_est_ms),
        "cam_to_est": stats_summary(latency.cam_to_est_ms),
        "est_to_ctrl": stats_summary(latency.est_to_ctrl_ms),
        "cam_to_ctrl": stats_summary(latency.cam_to_ctrl_ms),
    }
    acc_json.write_text(json.dumps(acc_export, indent=2))
    print(f"[done] Accuracy JSON: {acc_json}")

    summary = _build_summary_json(accuracy, latency, det, kf, ctrl, quality_score)
    (output_dir / "summary.json").write_text(json.dumps(summary, indent=2))
    print(f"[done] Summary KPI JSON: {output_dir / 'summary.json'}")


if __name__ == "__main__":
    main()
