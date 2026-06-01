# ── Topic map ─────────────────────────────────────────────────────────────────
TOPICS = {
    "camera":     "/pl/camera/image_raw",
    "camera_info": "/pl/camera/camera_info",
    "detector":   "/pl/detector/target",
    "estimator":  "/pl/estimator/target",
    "controller": "/pl/controller/status",
    "traj_sp":    "/fmu/in/trajectory_setpoint",
    "vlp":        "/fmu/out/vehicle_local_position",
    "vstatus":    "/fmu/out/vehicle_status_v1",
    "rosout":     "/rosout",
}

# Not passed to `ros2 bag record`: /clock is absent in many SITL setups (recorder can stall
# waiting for publishers), /rosout optional for analysis, /pl/camera/image_raw omitted to
# reduce SITL load (camera_info carries synchronized stamps for pipeline latency).
OPTIONAL_BAG_TOPICS = frozenset({"/rosout", "/clock", "/pl/camera/image_raw"})

# PX4 + px4_msgs may expose VehicleLocalPosition as /fmu/out/vehicle_local_position
# or /fmu/out/vehicle_local_position_v1 (MESSAGE_VERSION). Record both in sim.
EXTRA_RECORD_TOPICS = [
    "/fmu/out/vehicle_local_position_v1",
]

# Keep in sync with sim_launch.sh (background ros2 bag record topic list).
RECORD_TOPICS = tuple(
    [t for t in TOPICS.values() if t not in OPTIONAL_BAG_TOPICS] + EXTRA_RECORD_TOPICS
)


def _bag_topic_to_stats_key(topic: str):
    """Map bag topic name to topic_stats / TOPICS logical key (PX4 version suffixes)."""
    for key, tname in TOPICS.items():
        if topic == tname:
            return key
    if topic.startswith("/fmu/out/vehicle_local_position"):
        return "vlp"
    return None


def _vlp_topic_recorded(topics_in_bag: set) -> bool:
    if TOPICS["vlp"] in topics_in_bag:
        return True
    return any(t.startswith("/fmu/out/vehicle_local_position") for t in topics_in_bag)
