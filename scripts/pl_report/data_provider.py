"""ROS 2 bag ingest: read, topic stats, and latency aligned on ``timestamp_sample``."""

from __future__ import annotations

import bisect
import math
import sys
from pathlib import Path

from .utils import sanitize_controller_xy_error
from .config import (
    OPTIONAL_BAG_TOPICS,
    TOPICS,
    _bag_topic_to_stats_key,
    _vlp_topic_recorded,
)
from .models import (
    ControllerQuality,
    DetectorQuality,
    Event,
    KalmanQuality,
    PipelineLatency,
    TopicStats,
    TrajectorySetpointStats,
    VehicleStatusStats,
    VLPStats,
)


class DataProvider:
    """Read bags and produce aligned pipeline structs."""

    @staticmethod
    def read_bag(bag_path: Path):
        try:
            from rosidl_runtime_py.utilities import get_message
            from rclpy.serialization import deserialize_message
        except ImportError:
            sys.exit("ERROR: ROS 2 Python not found. Source your setup.bash first.")
        try:
            from rosbag2_py import ConverterOptions, SequentialReader, StorageOptions
        except ImportError:
            sys.exit("ERROR: rosbag2_py not installed.")

        bag_path = Path(bag_path)
        meta_yaml = bag_path / "metadata.yaml"
        if not meta_yaml.exists():
            mcap_files = sorted(bag_path.glob("*.mcap"))
            if not mcap_files:
                sys.exit(f"ERROR: No .mcap files in {bag_path}")
            print(f"[warn] metadata.yaml missing — generating from {len(mcap_files)} .mcap file(s)")
            import yaml

            files = [
                {
                    "path": f.name,
                    "starting_time": {"nanoseconds_since_epoch": 0},
                    "duration": {"nanoseconds": 0},
                    "message_count": 0,
                }
                for f in mcap_files
            ]
            meta = {
                "rosbag2_bagfile_information": {
                    "version": 8,
                    "storage_identifier": "mcap",
                    "relative_file_paths": [f.name for f in mcap_files],
                    "duration": {"nanoseconds": 0},
                    "starting_time": {"nanoseconds_since_epoch": 0},
                    "message_count": 0,
                    "topics_with_message_count": [],
                    "compression_format": "",
                    "compression_mode": "",
                    "files": files,
                }
            }
            meta_yaml.write_text(yaml.dump(meta, default_flow_style=False))

        reader = SequentialReader()
        storage = StorageOptions(uri=str(bag_path), storage_id="mcap")
        converter = ConverterOptions(
            input_serialization_format="cdr",
            output_serialization_format="cdr",
        )
        reader.open(storage, converter)

        type_map = {}
        for meta in reader.get_all_topics_and_types():
            type_map[meta.name] = meta.type

        topic_stats = {}
        for key, topic_name in TOPICS.items():
            topic_stats[key] = TopicStats(name=topic_name)

        topics_in_bag = set(type_map.keys())
        for key, ts in topic_stats.items():
            if key == "vlp":
                ts.present_in_bag = _vlp_topic_recorded(topics_in_bag)
            else:
                ts.present_in_bag = ts.name in topics_in_bag
        missing_in_bag = []
        for t in TOPICS.values():
            if t in OPTIONAL_BAG_TOPICS:
                continue
            if t == TOPICS["vlp"] and _vlp_topic_recorded(topics_in_bag):
                continue
            if t not in topics_in_bag:
                missing_in_bag.append(t)
        if missing_in_bag:
            print("[warn] Some expected topics are not present in this bag (not recorded or no data):")
            for t in missing_in_bag:
                print(f"  - {t}")

        latency = PipelineLatency()
        kf = KalmanQuality()
        det = DetectorQuality()
        ctrl = ControllerQuality()
        traj = TrajectorySetpointStats()
        vlp = VLPStats()
        vstatus = VehicleStatusStats()
        events: list[Event] = []

        cam_simstamp_to_recv = {}
        cam_simstamps_sorted = []
        cam_match_max_skew_us = 50_000
        last_est_wallstamp_ns = None
        last_est_sample_ns = None
        last_fresh_cam_recv_ns = None
        det_recv_by_sample: dict = {}
        cam_e2e_pending = False

        status_map = {0: "LOST", 1: "DETECTED", 2: "PREDICTED"}
        t0 = None
        last_det_status = None
        last_kf_status = None
        last_ctrl_state = None
        vlp_odom_buf: list = []

        def resolve_cam_recv(sample_us: int):
            exact = cam_simstamp_to_recv.get(sample_us)
            if exact is not None:
                return exact
            if not cam_simstamps_sorted:
                return None
            idx = bisect.bisect_left(cam_simstamps_sorted, sample_us)
            candidates = []
            if idx > 0:
                candidates.append(cam_simstamps_sorted[idx - 1])
            if idx < len(cam_simstamps_sorted):
                candidates.append(cam_simstamps_sorted[idx])
            if not candidates:
                return None
            nearest = min(candidates, key=lambda s: abs(s - sample_us))
            if abs(nearest - sample_us) <= cam_match_max_skew_us:
                return cam_simstamp_to_recv.get(nearest)
            return None

        _ZSTD_MAGIC = b"\x28\xb5\x2f\xfd"
        _zstd_dctx = None

        while reader.has_next():
            topic, data, recv_ns = reader.read_next()

            if topic not in type_map:
                continue

            if data[:4] == _ZSTD_MAGIC:
                if _zstd_dctx is None:
                    import zstandard

                    _zstd_dctx = zstandard.ZstdDecompressor()
                data = _zstd_dctx.decompress(data)

            msg_type_str = type_map[topic]
            try:
                msg_class = get_message(msg_type_str)
            except Exception:
                continue
            try:
                msg = deserialize_message(data, msg_class)
            except Exception:
                continue

            if t0 is None:
                t0 = recv_ns
            t_rel_s = (recv_ns - t0) / 1e9

            stats_key = _bag_topic_to_stats_key(topic)
            if stats_key is not None:
                ts = topic_stats[stats_key]
                ts.count += 1
                ts.timestamps.append(recv_ns)

                pub_ns = None
                try:
                    if hasattr(msg, "header") and hasattr(msg.header, "stamp"):
                        pub_ns = msg.header.stamp.sec * 1_000_000_000 + msg.header.stamp.nanosec
                    elif hasattr(msg, "timestamp"):
                        pub_ns = int(msg.timestamp) * 1_000
                except Exception:
                    pub_ns = None
                if pub_ns is not None and pub_ns > 0:
                    ts.pub_stamps_ns.append(pub_ns)

                    age_ms = (recv_ns - pub_ns) / 1e6
                    if -500 < age_ms < 5_000:
                        ts.age_at_recv_ms.append(age_ms)

            if topic in (TOPICS["camera"], TOPICS["camera_info"]):
                stamp = msg.header.stamp
                sim_stamp_us = stamp.sec * 1_000_000 + stamp.nanosec // 1_000
                if sim_stamp_us not in cam_simstamp_to_recv:
                    cam_simstamp_to_recv[sim_stamp_us] = recv_ns
                    cam_simstamps_sorted.append(sim_stamp_us)

            elif topic == TOPICS["detector"]:
                sample_us = int(msg.timestamp_sample)
                det_recv_by_sample[sample_us] = recv_ns

                cam_recv = resolve_cam_recv(sample_us)
                if cam_recv and recv_ns > cam_recv:
                    latency.cam_to_det_ms.append((recv_ns - cam_recv) / 1e6)

                s = status_map.get(msg.status, "LOST")
                det.status_counts[s] += 1
                det.statuses.append(msg.status)
                det.confidence.append(msg.confidence)
                det.position_x.append(msg.position.x)
                det.position_y.append(msg.position.y)
                det.position_z.append(msg.position.z)
                det.timestamps_s.append(t_rel_s)

                if last_det_status is None:
                    last_det_status = msg.status
                elif msg.status != last_det_status:
                    if last_det_status == 0 and msg.status in (1, 2):
                        events.append(
                            Event(t_rel_s, "VISION_REGAINED", f"detector status {status_map.get(msg.status)}")
                        )
                    elif last_det_status in (1, 2) and msg.status == 0:
                        events.append(Event(t_rel_s, "VISION_LOST", "detector LOST"))
                    last_det_status = msg.status

            elif topic == TOPICS["estimator"]:
                wall_stamp_ns = msg.header.stamp.sec * 1_000_000_000 + msg.header.stamp.nanosec
                sample_us = int(msg.timestamp_sample)

                last_est_wallstamp_ns = wall_stamp_ns

                if sample_us != last_est_sample_ns:
                    last_est_sample_ns = sample_us
                    if sample_us > 0:
                        det_recv = det_recv_by_sample.get(sample_us)
                        if det_recv is not None and recv_ns > det_recv:
                            latency.det_to_est_ms.append((recv_ns - det_recv) / 1e6)
                    cam_recv = resolve_cam_recv(sample_us)
                    if cam_recv and recv_ns > cam_recv:
                        latency.cam_to_est_ms.append((recv_ns - cam_recv) / 1e6)
                        latency.cam_to_est_timestamps_s.append(t_rel_s)
                        last_fresh_cam_recv_ns = cam_recv
                        if sample_us > 0:
                            cam_e2e_pending = True

                s = status_map.get(msg.status, "LOST")
                kf.status_counts[s] += 1
                kf.statuses.append(msg.status)
                kf.confidence.append(msg.confidence)
                kf.update_counts.append(msg.update_count)
                kf.position_x.append(msg.position.x)
                kf.position_y.append(msg.position.y)
                kf.position_z.append(msg.position.z)
                kf.velocity_x.append(msg.velocity.x)
                kf.velocity_y.append(msg.velocity.y)
                kf.velocity_z.append(msg.velocity.z)
                kf.timestamps_s.append(t_rel_s)

                if last_kf_status is None:
                    last_kf_status = msg.status
                elif msg.status != last_kf_status:
                    events.append(
                        Event(
                            t_rel_s,
                            "KF_STATE",
                            f"{status_map.get(last_kf_status)}→{status_map.get(msg.status)}",
                        )
                    )
                    last_kf_status = msg.status

            elif topic == TOPICS["controller"]:
                stamp = msg.header.stamp
                stamp_ns = stamp.sec * 1_000_000_000 + stamp.nanosec

                if last_est_wallstamp_ns and stamp_ns > last_est_wallstamp_ns:
                    dt = (stamp_ns - last_est_wallstamp_ns) / 1e6
                    if dt < 500:
                        latency.est_to_ctrl_ms.append(dt)

                if (
                    cam_e2e_pending
                    and last_fresh_cam_recv_ns
                    and recv_ns > last_fresh_cam_recv_ns
                ):
                    dt_e2e = (recv_ns - last_fresh_cam_recv_ns) / 1e6
                    if dt_e2e < 500:
                        latency.cam_to_ctrl_ms.append(dt_e2e)
                        latency.cam_to_ctrl_timestamps_s.append(t_rel_s)
                    cam_e2e_pending = False

                ctrl.states.append(msg.state)
                ctrl.state_names.append(msg.state_name)
                ctrl.altitude.append(msg.altitude_m)
                ctrl.xy_error.append(msg.xy_error_m)
                ctrl.target_confidence.append(msg.target_confidence)
                ctrl.tag_visible.append(msg.tag_visible)
                ctrl.pipeline_healthy.append(msg.pipeline_healthy)
                ctrl.timestamps_s.append(t_rel_s)

                if last_ctrl_state is None:
                    last_ctrl_state = msg.state
                elif msg.state != last_ctrl_state:
                    try:
                        prev = ctrl.state_names[-2] if len(ctrl.state_names) >= 2 else str(last_ctrl_state)
                    except Exception:
                        prev = str(last_ctrl_state)
                    events.append(Event(t_rel_s, "STATE_TRANSITION", f"{prev}→{msg.state_name}"))
                    last_ctrl_state = msg.state

            elif topic == TOPICS["traj_sp"]:
                traj.timestamps_s.append(t_rel_s)
                traj.vx.append(float(msg.velocity[0]))
                traj.vy.append(float(msg.velocity[1]))
                traj.vz.append(float(msg.velocity[2]))
                traj.yaw.append(float(msg.yaw))
                traj.yawspeed.append(float(msg.yawspeed))

            elif stats_key == "vlp":
                vlp.timestamps_s.append(t_rel_s)
                vlp.x.append(float(msg.x))
                vlp.y.append(float(msg.y))
                vlp.z.append(float(msg.z))
                vlp.vx.append(float(msg.vx))
                vlp.vy.append(float(msg.vy))
                vlp.vz.append(float(msg.vz))
                vlp.heading.append(float(msg.heading))
                vlp.dist_bottom.append(float(msg.dist_bottom) if msg.dist_bottom_valid else float("nan"))

            elif topic.startswith("/fmu/out/vehicle_odometry"):
                try:
                    pf = int(msg.pose_frame)
                    pos = msg.position
                    vel = msg.velocity
                    if pf in (0, 1) and all(math.isfinite(float(pos[i])) for i in range(3)):
                        vlp_odom_buf.append(
                            (
                                t_rel_s,
                                float(pos[0]),
                                float(pos[1]),
                                float(pos[2]),
                                float(vel[0]),
                                float(vel[1]),
                                float(vel[2]),
                                float("nan"),
                                float("nan"),
                            )
                        )
                except (TypeError, ValueError, IndexError, AttributeError):
                    pass

            elif topic == TOPICS["vstatus"]:
                vstatus.timestamps_s.append(t_rel_s)
                try:
                    vstatus.nav_state.append(int(msg.nav_state))
                except Exception:
                    vstatus.nav_state.append(-1)
                try:
                    vstatus.arming_state.append(int(msg.arming_state))
                except Exception:
                    vstatus.arming_state.append(-1)

            elif topic == TOPICS["rosout"]:
                try:
                    m = getattr(msg, "msg", "")
                    if isinstance(m, str) and "Innovation gate reject" in m:
                        events.append(Event(t_rel_s, "KF_GATING_REJECT", m.strip()))
                except Exception:
                    pass

        if not vlp.z and vlp_odom_buf:
            print(
                "[warn] No VehicleLocalPosition in bag; filling drone trajectory from "
                "/fmu/out/vehicle_odometry* (NED position). "
                "Sim bags normally record VLP only; add odometry topics if you need this fallback."
            )
            for row in vlp_odom_buf:
                t_rel_s, x, y, z, vx, vy, vz, hd, db = row
                vlp.timestamps_s.append(t_rel_s)
                vlp.x.append(x)
                vlp.y.append(y)
                vlp.z.append(z)
                vlp.vx.append(vx)
                vlp.vy.append(vy)
                vlp.vz.append(vz)
                vlp.heading.append(hd)
                vlp.dist_bottom.append(db)

        for key, ts in topic_stats.items():
            if len(ts.timestamps) > 1:
                gaps = [(ts.timestamps[i + 1] - ts.timestamps[i]) / 1e6 for i in range(len(ts.timestamps) - 1)]
                ts.gaps_ms = gaps
                if gaps:
                    mean_gap = sum(gaps) / len(gaps)
                    ts.hz_mean = 1000.0 / mean_gap if mean_gap > 0 else 0
                    ts.hz_min = 1000.0 / max(gaps) if max(gaps) > 0 else 0
                    ts.hz_max = 1000.0 / min(gaps) if min(gaps) > 0 else 0
                    variance = sum((g - mean_gap) ** 2 for g in gaps) / len(gaps)
                    ts.hz_std = math.sqrt(variance) if variance > 0 else 0

        if len(kf.update_counts) > 1:
            expected = kf.update_counts[-1] - kf.update_counts[0]
            actual = len(kf.update_counts) - 1
            kf.dropped = max(0, expected - actual)

        sanitize_controller_xy_error(ctrl)

        return topic_stats, latency, kf, det, ctrl, traj, vlp, vstatus, events


# Backwards-compatible module-level alias
read_bag = DataProvider.read_bag
