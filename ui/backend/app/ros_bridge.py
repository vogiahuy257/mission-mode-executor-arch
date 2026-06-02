from __future__ import annotations

import json
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

import rclpy
from px4_msgs.msg import BatteryStatus, VehicleGlobalPosition, VehicleStatus
from rclpy.executors import ExternalShutdownException, SingleThreadedExecutor
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy
from std_msgs.msg import String

from .config import AppSettings
from .models import (
    MissionCacheSnapshot,
    MissionRuntimeSnapshot,
    PositionSnapshot,
    StatusSnapshot,
    VehicleSnapshot,
)


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _age_seconds(timestamp: float | None) -> float | None:
    if timestamp is None:
        return None
    return max(time.monotonic() - timestamp, 0.0)


NAV_STATE_NAMES = {
    VehicleStatus.NAVIGATION_STATE_MANUAL: "Manual",
    VehicleStatus.NAVIGATION_STATE_ALTCTL: "Altitude",
    VehicleStatus.NAVIGATION_STATE_POSCTL: "Position",
    VehicleStatus.NAVIGATION_STATE_AUTO_MISSION: "Mission",
    VehicleStatus.NAVIGATION_STATE_AUTO_LOITER: "Hold",
    VehicleStatus.NAVIGATION_STATE_AUTO_RTL: "RTL",
    VehicleStatus.NAVIGATION_STATE_DESCEND: "Descend",
    VehicleStatus.NAVIGATION_STATE_OFFBOARD: "Offboard",
    VehicleStatus.NAVIGATION_STATE_STAB: "Stabilized",
    VehicleStatus.NAVIGATION_STATE_AUTO_TAKEOFF: "Takeoff",
    VehicleStatus.NAVIGATION_STATE_AUTO_LAND: "Land",
    VehicleStatus.NAVIGATION_STATE_AUTO_PRECLAND: "Precision Land",
    VehicleStatus.NAVIGATION_STATE_EXTERNAL1: "External Mode 1",
    VehicleStatus.NAVIGATION_STATE_EXTERNAL2: "External Mode 2",
    VehicleStatus.NAVIGATION_STATE_EXTERNAL3: "External Mode 3",
    VehicleStatus.NAVIGATION_STATE_EXTERNAL4: "External Mode 4",
    VehicleStatus.NAVIGATION_STATE_EXTERNAL5: "External Mode 5",
    VehicleStatus.NAVIGATION_STATE_EXTERNAL6: "External Mode 6",
    VehicleStatus.NAVIGATION_STATE_EXTERNAL7: "External Mode 7",
    VehicleStatus.NAVIGATION_STATE_EXTERNAL8: "External Mode 8",
}


@dataclass(slots=True)
class _Cache:
    mission_name: str | None = None
    item_count: int = 0
    last_mission_publish_at: str | None = None
    last_activate_publish_at: str | None = None
    vehicle_status: VehicleStatus | None = None
    vehicle_status_time: float | None = None
    vehicle_global_position: VehicleGlobalPosition | None = None
    vehicle_global_position_time: float | None = None
    battery_status: BatteryStatus | None = None
    battery_status_time: float | None = None
    mission_runtime: dict[str, Any] | None = None
    mission_runtime_time: float | None = None


class RosMissionBridge:
    def __init__(self, settings: AppSettings):
        self._settings = settings
        self._lock = threading.Lock()
        self._cache = _Cache()
        self._node: Node | None = None
        self._executor: SingleThreadedExecutor | None = None
        self._thread: threading.Thread | None = None
        self._stop_event = threading.Event()
        self._mission_pub = None
        self._activate_pub = None

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return

        if not rclpy.ok():
            rclpy.init(args=None)

        self._node = Node("adaptive_mission_ui_bridge")
        self._executor = SingleThreadedExecutor()
        self._executor.add_node(self._node)

        sensor_qos = QoSProfile(
            history=HistoryPolicy.KEEP_LAST,
            depth=10,
            reliability=ReliabilityPolicy.BEST_EFFORT,
        )
        command_qos = QoSProfile(
            history=HistoryPolicy.KEEP_LAST,
            depth=10,
            reliability=ReliabilityPolicy.RELIABLE,
        )

        self._mission_pub = self._node.create_publisher(String, self._settings.mission_topic, command_qos)
        self._activate_pub = self._node.create_publisher(
            String,
            self._settings.activate_topic,
            command_qos,
        )

        self._node.create_subscription(
            VehicleStatus,
            "fmu/out/vehicle_status",
            self._on_vehicle_status,
            sensor_qos,
        )
        self._node.create_subscription(
            VehicleGlobalPosition,
            "fmu/out/vehicle_global_position",
            self._on_vehicle_global_position,
            sensor_qos,
        )
        self._node.create_subscription(
            BatteryStatus,
            "fmu/out/battery_status",
            self._on_battery_status,
            sensor_qos,
        )
        self._node.create_subscription(
            String,
            self._settings.mission_status_topic,
            self._on_mission_runtime,
            command_qos,
        )

        self._stop_event.clear()
        self._thread = threading.Thread(target=self._spin, name="adaptive-mission-ui-ros", daemon=True)
        self._thread.start()

    def shutdown(self) -> None:
        self._stop_event.set()
        if self._executor is not None:
            self._executor.shutdown()
        if self._thread is not None:
            self._thread.join(timeout=2.0)
        if self._node is not None:
            self._node.destroy_node()
        self._thread = None
        self._executor = None
        self._node = None
        self._mission_pub = None
        self._activate_pub = None
        if rclpy.ok():
            rclpy.shutdown()

    def publish_mission(self, mission_payload: dict[str, Any], mission_name: str, item_count: int) -> None:
        if self._mission_pub is None:
            raise RuntimeError("ROS bridge is not running")

        message = String()
        message.data = json.dumps(mission_payload, separators=(",", ":"))
        self._mission_pub.publish(message)

        with self._lock:
            self._cache.mission_name = mission_name
            self._cache.item_count = item_count
            self._cache.last_mission_publish_at = _utcnow_iso()

    def publish_activate(self, activate: bool = True) -> None:
        if self._activate_pub is None:
            raise RuntimeError("ROS bridge is not running")

        message = String()
        message.data = json.dumps({"activate": bool(activate)}, separators=(",", ":"))
        self._activate_pub.publish(message)

        with self._lock:
            self._cache.last_activate_publish_at = _utcnow_iso()

    def status_snapshot(self) -> StatusSnapshot:
        with self._lock:
            status = self._cache.vehicle_status
            status_age = _age_seconds(self._cache.vehicle_status_time)
            position = self._cache.vehicle_global_position
            position_age = _age_seconds(self._cache.vehicle_global_position_time)
            battery = self._cache.battery_status
            battery_age = _age_seconds(self._cache.battery_status_time)
            mission_runtime = dict(self._cache.mission_runtime or {})
            mission_runtime_age = _age_seconds(self._cache.mission_runtime_time)
            mission_cache = MissionCacheSnapshot(
                loaded=self._cache.item_count > 0,
                mission_name=self._cache.mission_name,
                item_count=self._cache.item_count,
                last_mission_publish_at=self._cache.last_mission_publish_at,
                last_activate_publish_at=self._cache.last_activate_publish_at,
            )

        connected = bool(status_age is not None and status_age <= self._settings.vehicle_status_timeout_s)
        battery_percent = None
        if battery is not None and battery.remaining >= 0:
            battery_percent = max(0, min(100, int(round(battery.remaining * 100))))

        return StatusSnapshot(
            ros_ready=self._node is not None and self._thread is not None and self._thread.is_alive(),
            mission_topic=self._settings.mission_topic,
            activate_topic=self._settings.activate_topic,
            vehicle=VehicleSnapshot(
                connected=connected,
                flight_mode=NAV_STATE_NAMES.get(status.nav_state) if status is not None else None,
                nav_state=status.nav_state if status is not None else None,
                executor_in_charge=status.executor_in_charge if status is not None else None,
                armed=bool(
                    status is not None
                    and status.arming_state == VehicleStatus.ARMING_STATE_ARMED
                ),
                preflight_checks_pass=status.pre_flight_checks_pass if status is not None else None,
                failsafe=status.failsafe if status is not None else None,
                system_id=status.system_id if status is not None else None,
                component_id=status.component_id if status is not None else None,
                battery_percent=battery_percent,
                last_status_age_s=status_age,
                last_position_age_s=position_age,
                last_battery_age_s=battery_age,
                position=PositionSnapshot(
                    latitude_deg=position.lat if position is not None and position.lat_lon_valid else None,
                    longitude_deg=position.lon if position is not None and position.lat_lon_valid else None,
                    altitude_amsl_m=position.alt if position is not None and position.alt_valid else None,
                ),
            ),
            mission_cache=mission_cache,
            mission_runtime=MissionRuntimeSnapshot(
                available=bool(mission_runtime),
                runtime_state=_optional_str(mission_runtime.get("runtime_state")),
                active_bt_branch=_optional_str(mission_runtime.get("active_bt_branch")),
                mission_ready=_optional_bool(mission_runtime.get("mission_ready")),
                mission_active=_optional_bool(mission_runtime.get("mission_active")),
                mission_start_in_progress=_optional_bool(mission_runtime.get("mission_start_in_progress")),
                current_item_index=_optional_int(mission_runtime.get("current_item_index")),
                manual_altitude_active=_optional_bool(mission_runtime.get("manual_altitude_active")),
                altitude_offset_m=_optional_float(mission_runtime.get("altitude_offset_m")),
                throttle_input=_optional_float(mission_runtime.get("throttle_input")),
                last_error=_optional_str(mission_runtime.get("last_error")),
                last_update_age_s=mission_runtime_age,
            ),
        )

    def _spin(self) -> None:
        assert self._executor is not None
        try:
            while not self._stop_event.is_set():
                self._executor.spin_once(timeout_sec=0.1)
        except ExternalShutdownException:
            pass

    def _on_vehicle_status(self, message: VehicleStatus) -> None:
        with self._lock:
            self._cache.vehicle_status = message
            self._cache.vehicle_status_time = time.monotonic()

    def _on_vehicle_global_position(self, message: VehicleGlobalPosition) -> None:
        with self._lock:
            self._cache.vehicle_global_position = message
            self._cache.vehicle_global_position_time = time.monotonic()

    def _on_battery_status(self, message: BatteryStatus) -> None:
        with self._lock:
            self._cache.battery_status = message
            self._cache.battery_status_time = time.monotonic()

    def _on_mission_runtime(self, message: String) -> None:
        try:
            payload = json.loads(message.data)
        except json.JSONDecodeError:
            payload = {"last_error": "Failed to decode /adaptive_mission_mode/status JSON"}

        with self._lock:
            self._cache.mission_runtime = payload if isinstance(payload, dict) else {}
            self._cache.mission_runtime_time = time.monotonic()


def _optional_str(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text if text else None


def _optional_bool(value: Any) -> bool | None:
    if isinstance(value, bool):
        return value
    return None


def _optional_int(value: Any) -> int | None:
    if value is None:
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _optional_float(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None
