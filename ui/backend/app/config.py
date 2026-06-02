from __future__ import annotations

import os
from dataclasses import dataclass


DEFAULT_API_TITLE = "Adaptive Mission UI API"
DEFAULT_MISSION_TOPIC = "/adaptive_mission_mode/mission_json"
DEFAULT_ACTIVATE_TOPIC = "/adaptive_mission_mode/activate_json"
DEFAULT_MISSION_STATUS_TOPIC = "/adaptive_mission_mode/status"
DEFAULT_STATUS_TIMEOUT_S = 3.0
DEFAULT_ACTIVATE_DELAY_S = 0.25

DEFAULT_MAVLINK_ENABLED = True
DEFAULT_MAVLINK_CONNECTION_URL = "udpin:0.0.0.0:14550"
DEFAULT_MAVLINK_HEARTBEAT_HZ = 1.0
DEFAULT_MAVLINK_TIMEOUT_S = 3.0
DEFAULT_MAVLINK_SOURCE_SYSTEM = 255
DEFAULT_MAVLINK_SOURCE_COMPONENT = 190
DEFAULT_MAVLINK_REQUEST_STREAMS = True


def _parse_origins(raw_value: str) -> list[str]:
    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


@dataclass(slots=True)
class AppSettings:
    api_title: str = DEFAULT_API_TITLE
    cors_origins: list[str] = None  # type: ignore[assignment]
    mission_topic: str = DEFAULT_MISSION_TOPIC
    activate_topic: str = DEFAULT_ACTIVATE_TOPIC
    mission_status_topic: str = DEFAULT_MISSION_STATUS_TOPIC
    vehicle_status_timeout_s: float = DEFAULT_STATUS_TIMEOUT_S
    activate_delay_s: float = DEFAULT_ACTIVATE_DELAY_S
    mavlink_enabled: bool = DEFAULT_MAVLINK_ENABLED
    mavlink_connection_url: str = DEFAULT_MAVLINK_CONNECTION_URL
    mavlink_heartbeat_hz: float = DEFAULT_MAVLINK_HEARTBEAT_HZ
    mavlink_timeout_s: float = DEFAULT_MAVLINK_TIMEOUT_S
    mavlink_source_system: int = DEFAULT_MAVLINK_SOURCE_SYSTEM
    mavlink_source_component: int = DEFAULT_MAVLINK_SOURCE_COMPONENT
    mavlink_request_streams: bool = DEFAULT_MAVLINK_REQUEST_STREAMS

    @classmethod
    def load(cls) -> "AppSettings":
        raw_origins = os.getenv("MISSION_UI_CORS_ORIGINS", "http://localhost:5173")
        return cls(
            api_title=os.getenv("MISSION_UI_API_TITLE", DEFAULT_API_TITLE),
            cors_origins=_parse_origins(raw_origins),
            mission_topic=os.getenv("MISSION_UI_MISSION_TOPIC", DEFAULT_MISSION_TOPIC),
            activate_topic=os.getenv("MISSION_UI_ACTIVATE_TOPIC", DEFAULT_ACTIVATE_TOPIC),
            mission_status_topic=os.getenv("MISSION_UI_MISSION_STATUS_TOPIC", DEFAULT_MISSION_STATUS_TOPIC),
            vehicle_status_timeout_s=float(
                os.getenv("MISSION_UI_VEHICLE_STATUS_TIMEOUT_S", DEFAULT_STATUS_TIMEOUT_S)
            ),
            activate_delay_s=float(
                os.getenv("MISSION_UI_ACTIVATE_DELAY_S", DEFAULT_ACTIVATE_DELAY_S)
            ),
            mavlink_enabled=os.getenv("MISSION_UI_MAVLINK_ENABLED", "1").lower() not in {"0", "false", "no", "off"},
            mavlink_connection_url=os.getenv(
                "MISSION_UI_MAVLINK_CONNECTION",
                DEFAULT_MAVLINK_CONNECTION_URL,
            ),
            mavlink_heartbeat_hz=float(
                os.getenv("MISSION_UI_MAVLINK_HEARTBEAT_HZ", DEFAULT_MAVLINK_HEARTBEAT_HZ)
            ),
            mavlink_timeout_s=float(
                os.getenv("MISSION_UI_MAVLINK_TIMEOUT_S", DEFAULT_MAVLINK_TIMEOUT_S)
            ),
            mavlink_source_system=int(
                os.getenv("MISSION_UI_MAVLINK_SOURCE_SYSTEM", DEFAULT_MAVLINK_SOURCE_SYSTEM)
            ),
            mavlink_source_component=int(
                os.getenv("MISSION_UI_MAVLINK_SOURCE_COMPONENT", DEFAULT_MAVLINK_SOURCE_COMPONENT)
            ),
            mavlink_request_streams=os.getenv(
                "MISSION_UI_MAVLINK_REQUEST_STREAMS", "1"
            ).lower() not in {"0", "false", "no", "off"},
        )
