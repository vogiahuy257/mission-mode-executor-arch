from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TopicStats:
    name: str
    count: int = 0
    timestamps: list = field(default_factory=list)
    pub_stamps_ns: list = field(default_factory=list)
    age_at_recv_ms: list = field(default_factory=list)  # recv_time - publish_time
    hz_mean: float = 0.0
    hz_std: float = 0.0
    hz_min: float = 0.0
    hz_max: float = 0.0
    gaps_ms: list = field(default_factory=list)
    present_in_bag: bool = True


@dataclass
class PipelineLatency:
    """Pipeline delay samples (milliseconds).

    Camera paths use **rosbag record receive time** (``recv_ns``) and ``timestamp_sample``
    / image header stamps — good for relative pipeline delay in the bag.

    ``det_to_est_ms`` / ``cam_to_est_ms``: only samples where ``timestamp_sample`` **changes**
    on ``/pl/estimator/target`` (fresh measurement), matched to detector receive time by
    ``timestamp_sample`` — excludes 20 Hz KF timer outputs that reuse an old sample id.

    ``est_to_ctrl_ms``: **header.stamp** delta (publish-time semantics; depends on how each
    node sets ``header.stamp``).

    ``cam_to_ctrl_ms``: one sample per new camera frame (first ``/pl/controller/status`` after
    each fresh estimator sample) so 10 Hz controller ticks do not inflate p95.
    """
    cam_to_det_ms: list = field(default_factory=list)
    det_to_est_ms: list = field(default_factory=list)
    cam_to_est_ms: list = field(default_factory=list)
    est_to_ctrl_ms: list = field(default_factory=list)
    cam_to_ctrl_ms: list = field(default_factory=list)

    cam_to_est_timestamps_s: list = field(default_factory=list)
    cam_to_ctrl_timestamps_s: list = field(default_factory=list)


@dataclass
class KalmanQuality:
    confidence: list = field(default_factory=list)
    statuses: list = field(default_factory=list)
    status_counts: dict = field(default_factory=lambda: {"LOST": 0, "DETECTED": 0, "PREDICTED": 0})
    update_counts: list = field(default_factory=list)
    dropped: int = 0
    position_x: list = field(default_factory=list)
    position_y: list = field(default_factory=list)
    position_z: list = field(default_factory=list)
    velocity_x: list = field(default_factory=list)
    velocity_y: list = field(default_factory=list)
    velocity_z: list = field(default_factory=list)
    timestamps_s: list = field(default_factory=list)


@dataclass
class DetectorQuality:
    confidence: list = field(default_factory=list)
    statuses: list = field(default_factory=list)
    status_counts: dict = field(default_factory=lambda: {"LOST": 0, "DETECTED": 0, "PREDICTED": 0})
    position_x: list = field(default_factory=list)
    position_y: list = field(default_factory=list)
    position_z: list = field(default_factory=list)
    timestamps_s: list = field(default_factory=list)


@dataclass
class ControllerQuality:
    states: list = field(default_factory=list)
    state_names: list = field(default_factory=list)
    altitude: list = field(default_factory=list)
    xy_error: list = field(default_factory=list)
    target_confidence: list = field(default_factory=list)
    tag_visible: list = field(default_factory=list)
    pipeline_healthy: list = field(default_factory=list)
    timestamps_s: list = field(default_factory=list)


@dataclass
class TrajectorySetpointStats:
    """px4_msgs/TrajectorySetpoint — controller output towards FCU."""
    timestamps_s: list = field(default_factory=list)
    vx: list = field(default_factory=list)
    vy: list = field(default_factory=list)
    vz: list = field(default_factory=list)
    yaw: list = field(default_factory=list)
    yawspeed: list = field(default_factory=list)


@dataclass
class Event:
    """Generic event for timeline review."""
    t_s: float
    kind: str
    detail: str = ""


@dataclass
class VLPStats:
    """VehicleLocalPosition — drone trajectory in NED."""
    timestamps_s: list = field(default_factory=list)
    x: list = field(default_factory=list)
    y: list = field(default_factory=list)
    z: list = field(default_factory=list)
    vx: list = field(default_factory=list)
    vy: list = field(default_factory=list)
    vz: list = field(default_factory=list)
    heading: list = field(default_factory=list)
    dist_bottom: list = field(default_factory=list)


@dataclass
class VehicleStatusStats:
    """px4_msgs/VehicleStatus — used for mode shading on plots."""
    timestamps_s: list = field(default_factory=list)
    nav_state: list = field(default_factory=list)
    arming_state: list = field(default_factory=list)

