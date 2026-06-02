from __future__ import annotations

import math
import threading
import time
from dataclasses import dataclass, field
from typing import Any

try:
    from pymavlink import mavutil
except Exception:  # pragma: no cover - handled at runtime when dependency is missing
    mavutil = None  # type: ignore[assignment]

from .config import AppSettings


@dataclass(slots=True)
class MavlinkTelemetryCache:
    connected: bool = False
    connection_url: str = ""
    target_system: int | None = None
    target_component: int | None = None
    autopilot: int | None = None
    mav_type: int | None = None
    base_mode: int | None = None
    custom_mode: int | None = None
    system_status: int | None = None
    battery_percent: int | None = None
    voltage_battery_v: float | None = None
    current_battery_a: float | None = None
    latitude_deg: float | None = None
    longitude_deg: float | None = None
    relative_altitude_m: float | None = None
    altitude_amsl_m: float | None = None
    heading_deg: float | None = None
    yaw_deg: float | None = None
    roll_deg: float | None = None
    pitch_deg: float | None = None
    groundspeed_m_s: float | None = None
    armed: bool | None = None
    last_heartbeat_age_s: float | None = None
    last_message_age_s: float | None = None
    last_error: str | None = None
    last_statustext: str | None = None
    message_counts: dict[str, int] = field(default_factory=dict)


def _age_seconds(timestamp: float | None) -> float | None:
    if timestamp is None:
        return None
    return max(time.monotonic() - timestamp, 0.0)


def _rad_to_deg(value: float) -> float:
    return math.degrees(float(value))


def _yaw_to_heading_deg(yaw_rad: float) -> float:
    return (_rad_to_deg(yaw_rad) + 360.0) % 360.0


PX4_CUSTOM_MAIN_MODE_MANUAL = 1
PX4_CUSTOM_MAIN_MODE_ALTCTL = 2
PX4_CUSTOM_MAIN_MODE_POSCTL = 3
PX4_CUSTOM_MAIN_MODE_AUTO = 4
PX4_CUSTOM_MAIN_MODE_OFFBOARD = 6

PX4_CUSTOM_SUB_MODE_AUTO_TAKEOFF = 2
PX4_CUSTOM_SUB_MODE_AUTO_LOITER = 3
PX4_CUSTOM_SUB_MODE_AUTO_MISSION = 4
PX4_CUSTOM_SUB_MODE_AUTO_RTL = 5
PX4_CUSTOM_SUB_MODE_AUTO_LAND = 6

PX4_MODE_NAME_TO_MAIN_SUB = {
    "manual": (PX4_CUSTOM_MAIN_MODE_MANUAL, 0),
    "altctl": (PX4_CUSTOM_MAIN_MODE_ALTCTL, 0),
    "posctl": (PX4_CUSTOM_MAIN_MODE_POSCTL, 0),
    "hold": (PX4_CUSTOM_MAIN_MODE_AUTO, PX4_CUSTOM_SUB_MODE_AUTO_LOITER),
    "mission": (PX4_CUSTOM_MAIN_MODE_AUTO, PX4_CUSTOM_SUB_MODE_AUTO_MISSION),
    "rtl": (PX4_CUSTOM_MAIN_MODE_AUTO, PX4_CUSTOM_SUB_MODE_AUTO_RTL),
    "land": (PX4_CUSTOM_MAIN_MODE_AUTO, PX4_CUSTOM_SUB_MODE_AUTO_LAND),
    "takeoff": (PX4_CUSTOM_MAIN_MODE_AUTO, PX4_CUSTOM_SUB_MODE_AUTO_TAKEOFF),
    "offboard": (PX4_CUSTOM_MAIN_MODE_OFFBOARD, 0),
}


class MavlinkGcsBridge:
    """Small MAVLink ground-station bridge used to replace QGroundControl heartbeat.

    This class intentionally does not try to implement the full QGC UI. It provides
    the parts needed by PX4 to see a GCS connection and exposes a few safe command
    helpers for the FastAPI layer.
    """

    def __init__(self, settings: AppSettings):
        self._settings = settings
        self._lock = threading.Lock()
        self._mav_io_lock = threading.Lock()
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None
        self._mav: Any | None = None
        self._target_system: int | None = None
        self._target_component: int | None = None
        self._last_heartbeat_time: float | None = None
        self._last_message_time: float | None = None
        self._last_sent_heartbeat_time = 0.0
        self._last_stream_request_time = 0.0
        self._cache = MavlinkTelemetryCache(
            connected=False,
            connection_url=settings.mavlink_connection_url,
        )

    def start(self) -> None:
        if not self._settings.mavlink_enabled:
            return

        if self._thread and self._thread.is_alive():
            return

        if mavutil is None:
            with self._lock:
                self._cache.last_error = "pymavlink is not installed. Run: python -m pip install pymavlink"
            return

        self._stop_event.clear()
        self._thread = threading.Thread(
            target=self._run,
            name="adaptive-mission-ui-mavlink-gcs",
            daemon=True,
        )
        self._thread.start()

    def shutdown(self) -> None:
        self._stop_event.set()
        if self._thread is not None:
            self._thread.join(timeout=2.0)
        self._thread = None
        if self._mav is not None:
            try:
                self._mav.close()
            except Exception:
                pass
        self._mav = None
        with self._lock:
            self._cache.connected = False

    def snapshot(self) -> MavlinkTelemetryCache:
        with self._lock:
            snapshot = MavlinkTelemetryCache(
                connected=self._cache.connected,
                connection_url=self._cache.connection_url,
                target_system=self._cache.target_system,
                target_component=self._cache.target_component,
                autopilot=self._cache.autopilot,
                mav_type=self._cache.mav_type,
                base_mode=self._cache.base_mode,
                custom_mode=self._cache.custom_mode,
                system_status=self._cache.system_status,
                battery_percent=self._cache.battery_percent,
                voltage_battery_v=self._cache.voltage_battery_v,
                current_battery_a=self._cache.current_battery_a,
                latitude_deg=self._cache.latitude_deg,
                longitude_deg=self._cache.longitude_deg,
                relative_altitude_m=self._cache.relative_altitude_m,
                altitude_amsl_m=self._cache.altitude_amsl_m,
                heading_deg=self._cache.heading_deg,
                yaw_deg=self._cache.yaw_deg,
                roll_deg=self._cache.roll_deg,
                pitch_deg=self._cache.pitch_deg,
                groundspeed_m_s=self._cache.groundspeed_m_s,
                armed=self._cache.armed,
                last_heartbeat_age_s=_age_seconds(self._last_heartbeat_time),
                last_message_age_s=_age_seconds(self._last_message_time),
                last_error=self._cache.last_error,
                last_statustext=self._cache.last_statustext,
                message_counts=dict(self._cache.message_counts),
            )
        return snapshot

    def command_arm(self, arm: bool, force: bool = False, timeout_s: float = 3.0) -> tuple[bool, str]:
        force_code = 21196.0 if force else 0.0
        return self._command_long(
            command=mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            params=[1.0 if arm else 0.0, force_code, 0.0, 0.0, 0.0, 0.0, 0.0],
            timeout_s=timeout_s,
        )

    def command_land(self, timeout_s: float = 3.0) -> tuple[bool, str]:
        return self._command_long(
            command=mavutil.mavlink.MAV_CMD_NAV_LAND,
            params=[0.0, 0.0, 0.0, 0.0, float("nan"), float("nan"), float("nan")],
            timeout_s=timeout_s,
        )

    def command_rtl(self, timeout_s: float = 3.0) -> tuple[bool, str]:
        return self._command_long(
            command=mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH,
            params=[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            timeout_s=timeout_s,
        )

    def command_takeoff(self, altitude_m: float, timeout_s: float = 3.0) -> tuple[bool, str]:
        with self._lock:
            latitude_deg = self._cache.latitude_deg
            longitude_deg = self._cache.longitude_deg
            altitude_amsl_m = self._cache.altitude_amsl_m

        target_altitude_amsl_m = float(altitude_m)
        if altitude_amsl_m is not None and math.isfinite(float(altitude_amsl_m)):
            target_altitude_amsl_m = float(altitude_amsl_m) + float(altitude_m)

        return self._command_long(
            command=mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
            params=[
                0.0,
                0.0,
                0.0,
                float("nan"),
                float(latitude_deg) if latitude_deg is not None and math.isfinite(float(latitude_deg)) else float("nan"),
                float(longitude_deg) if longitude_deg is not None and math.isfinite(float(longitude_deg)) else float("nan"),
                float(target_altitude_amsl_m),
            ],
            timeout_s=timeout_s,
        )

    def set_px4_mode_name(self, mode: str) -> tuple[bool, str]:
        normalized_mode = mode.strip().lower()
        main_sub = PX4_MODE_NAME_TO_MAIN_SUB.get(normalized_mode)
        if main_sub is None:
            return False, f"Unsupported PX4 mode name: {mode}"
        main_mode, sub_mode = main_sub
        return self.set_px4_mode(main_mode=main_mode, sub_mode=sub_mode)

    def set_message_rate(self, message_id: int, rate_hz: float) -> tuple[bool, str]:
        if mavutil is None:
            return False, "pymavlink is not installed"
        if self._mav is None:
            return False, "MAVLink bridge is not running"
        if self._target_system is None or self._target_component is None:
            return False, "No MAVLink vehicle heartbeat received yet"

        interval_us = -1.0 if rate_hz <= 0.0 else float(int(1_000_000 / max(rate_hz, 0.01)))
        return self._command_long(
            command=mavutil.mavlink.MAV_CMD_SET_MESSAGE_INTERVAL,
            params=[float(message_id), interval_us, 0.0, 0.0, 0.0, 0.0, 0.0],
            timeout_s=2.0,
        )

    def set_px4_mode(self, main_mode: int, sub_mode: int = 0) -> tuple[bool, str]:
        if mavutil is None:
            return False, "pymavlink is not installed"
        # PX4 custom_mode layout: main_mode in byte 2, sub_mode in byte 3.
        custom_mode = (int(main_mode) << 16) | (int(sub_mode) << 24)
        return self._set_mode(custom_mode)

    def _run(self) -> None:
        try:
            self._mav = mavutil.mavlink_connection(
                self._settings.mavlink_connection_url,
                source_system=self._settings.mavlink_source_system,
                source_component=self._settings.mavlink_source_component,
                autoreconnect=True,
                robust_parsing=True,
            )
            with self._lock:
                self._cache.last_error = None
        except Exception as exc:
            with self._lock:
                self._cache.last_error = f"MAVLink connection failed: {exc}"
            return

        while not self._stop_event.is_set():
            now = time.monotonic()
            self._send_gcs_heartbeat_if_needed(now)
            self._request_common_messages_if_needed(now)
            self._receive_messages()

            with self._lock:
                heartbeat_age = _age_seconds(self._last_heartbeat_time)
                self._cache.connected = bool(
                    heartbeat_age is not None
                    and heartbeat_age <= self._settings.mavlink_timeout_s
                )

            time.sleep(0.01)

    def _send_gcs_heartbeat_if_needed(self, now: float) -> None:
        interval_s = 1.0 / max(self._settings.mavlink_heartbeat_hz, 0.1)
        if now - self._last_sent_heartbeat_time < interval_s:
            return

        if self._mav is None:
            return

        try:
            with self._mav_io_lock:
                self._mav.mav.heartbeat_send(
                    mavutil.mavlink.MAV_TYPE_GCS,
                    mavutil.mavlink.MAV_AUTOPILOT_INVALID,
                    0,
                    0,
                    mavutil.mavlink.MAV_STATE_ACTIVE,
                )
            self._last_sent_heartbeat_time = now
        except Exception as exc:
            with self._lock:
                self._cache.last_error = f"MAVLink heartbeat failed: {exc}"

    def _receive_messages(self) -> None:
        if self._mav is None:
            return

        for _ in range(50):
            try:
                with self._mav_io_lock:
                    message = self._mav.recv_match(blocking=False)
            except Exception as exc:
                with self._lock:
                    self._cache.last_error = f"MAVLink receive failed: {exc}"
                return

            if message is None:
                return

            self._handle_message(message)

    def _handle_message(self, message: Any) -> None:
        message_type = message.get_type()
        if message_type == "BAD_DATA":
            return

        now = time.monotonic()
        src_system = int(message.get_srcSystem())
        src_component = int(message.get_srcComponent())

        with self._lock:
            self._last_message_time = now
            self._cache.message_counts[message_type] = self._cache.message_counts.get(message_type, 0) + 1

        if message_type == "HEARTBEAT":
            self._target_system = src_system
            self._target_component = src_component
            self._last_heartbeat_time = now
            with self._lock:
                self._cache.connected = True
                self._cache.target_system = src_system
                self._cache.target_component = src_component
                self._cache.autopilot = int(message.autopilot)
                self._cache.mav_type = int(message.type)
                self._cache.base_mode = int(message.base_mode)
                self._cache.custom_mode = int(message.custom_mode)
                self._cache.system_status = int(message.system_status)
                self._cache.armed = bool(message.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED)
            return

        if message_type == "SYS_STATUS":
            voltage = None if message.voltage_battery == 65535 else float(message.voltage_battery) / 1000.0
            current = None if message.current_battery == -1 else float(message.current_battery) / 100.0
            battery_remaining = None if message.battery_remaining < 0 else int(message.battery_remaining)
            with self._lock:
                self._cache.voltage_battery_v = voltage
                self._cache.current_battery_a = current
                if battery_remaining is not None:
                    self._cache.battery_percent = battery_remaining
            return

        if message_type == "BATTERY_STATUS":
            battery_remaining = None if message.battery_remaining < 0 else int(message.battery_remaining)
            if battery_remaining is not None:
                with self._lock:
                    self._cache.battery_percent = battery_remaining
            return

        if message_type == "GLOBAL_POSITION_INT":
            heading = None
            if hasattr(message, "hdg") and int(message.hdg) != 65535:
                heading = float(message.hdg) / 100.0
            with self._lock:
                self._cache.latitude_deg = float(message.lat) / 1e7
                self._cache.longitude_deg = float(message.lon) / 1e7
                self._cache.altitude_amsl_m = float(message.alt) / 1000.0
                self._cache.relative_altitude_m = float(message.relative_alt) / 1000.0
                if heading is not None:
                    self._cache.heading_deg = heading
            return

        if message_type == "ATTITUDE":
            heading = _yaw_to_heading_deg(message.yaw)
            with self._lock:
                self._cache.roll_deg = _rad_to_deg(message.roll)
                self._cache.pitch_deg = _rad_to_deg(message.pitch)
                self._cache.yaw_deg = heading
                if self._cache.heading_deg is None:
                    self._cache.heading_deg = heading
            return

        if message_type == "VFR_HUD":
            with self._lock:
                if int(message.heading) >= 0:
                    self._cache.heading_deg = float(message.heading)
                self._cache.groundspeed_m_s = float(message.groundspeed)
            return

        if message_type == "STATUSTEXT":
            text = str(message.text).strip("\x00")
            with self._lock:
                self._cache.last_statustext = text
            return

    def _request_common_messages_if_needed(self, now: float) -> None:
        if not self._settings.mavlink_request_streams:
            return
        if self._mav is None:
            return
        if self._target_system is None or self._target_component is None:
            return
        if now - self._last_stream_request_time < 5.0:
            return

        # Similar to the useful subset a GCS normally wants. This does not replace
        # the ROS 2 bridge; it only gives MAVLink-side health/telemetry and helps
        # PX4 recognize this backend as an active GCS.
        message_rates_hz = {
            mavutil.mavlink.MAVLINK_MSG_ID_HEARTBEAT: 1,
            mavutil.mavlink.MAVLINK_MSG_ID_SYS_STATUS: 1,
            mavutil.mavlink.MAVLINK_MSG_ID_BATTERY_STATUS: 1,
            mavutil.mavlink.MAVLINK_MSG_ID_EXTENDED_SYS_STATE: 1,
            mavutil.mavlink.MAVLINK_MSG_ID_GLOBAL_POSITION_INT: 5,
            mavutil.mavlink.MAVLINK_MSG_ID_LOCAL_POSITION_NED: 5,
            mavutil.mavlink.MAVLINK_MSG_ID_ATTITUDE: 10,
            mavutil.mavlink.MAVLINK_MSG_ID_VFR_HUD: 5,
            mavutil.mavlink.MAVLINK_MSG_ID_HOME_POSITION: 1,
            mavutil.mavlink.MAVLINK_MSG_ID_STATUSTEXT: 2,
        }

        for message_id, rate_hz in message_rates_hz.items():
            try:
                interval_us = int(1_000_000 / max(rate_hz, 1))
                with self._mav_io_lock:
                    self._mav.mav.command_long_send(
                        self._target_system,
                        self._target_component,
                        mavutil.mavlink.MAV_CMD_SET_MESSAGE_INTERVAL,
                        0,
                        float(message_id),
                        float(interval_us),
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                    )
            except Exception as exc:
                with self._lock:
                    self._cache.last_error = f"Failed to request MAVLink message interval: {exc}"
                break

        self._last_stream_request_time = now

    def _command_long(self, command: int, params: list[float], timeout_s: float) -> tuple[bool, str]:
        if mavutil is None:
            return False, "pymavlink is not installed"
        if self._mav is None:
            return False, "MAVLink bridge is not running"
        if self._target_system is None or self._target_component is None:
            return False, "No MAVLink vehicle heartbeat received yet"

        params = (params + [0.0] * 7)[:7]
        try:
            with self._mav_io_lock:
                self._mav.mav.command_long_send(
                    self._target_system,
                    self._target_component,
                    int(command),
                    0,
                    *params,
                )

                deadline = time.monotonic() + timeout_s
                while time.monotonic() < deadline:
                    ack = self._mav.recv_match(type="COMMAND_ACK", blocking=True, timeout=0.15)
                    if ack is None:
                        continue
                    if int(ack.command) != int(command):
                        continue
                    result = int(ack.result)
                    accepted = result in (
                        mavutil.mavlink.MAV_RESULT_ACCEPTED,
                        mavutil.mavlink.MAV_RESULT_IN_PROGRESS,
                    )
                    return accepted, f"COMMAND_ACK command={command} result={result}"
        except Exception as exc:
            return False, f"Failed to send/wait MAVLink command {command}: {exc}"

        return False, f"Timeout waiting COMMAND_ACK for command={command}"

    def _set_mode(self, custom_mode: int) -> tuple[bool, str]:
        if self._mav is None:
            return False, "MAVLink bridge is not running"
        if self._target_system is None:
            return False, "No MAVLink vehicle heartbeat received yet"

        try:
            with self._mav_io_lock:
                self._mav.mav.set_mode_send(
                    self._target_system,
                    mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,
                    int(custom_mode),
                )
            return True, f"Sent SET_MODE custom_mode={custom_mode}"
        except Exception as exc:
            return False, f"Failed to send SET_MODE: {exc}"
