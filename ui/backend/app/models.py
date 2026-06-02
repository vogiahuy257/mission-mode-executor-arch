from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


MissionItemType = Literal["takeoff", "waypoint", "hold", "land", "rtl"]


class MissionDefaultsPayload(BaseModel):
    horizontal_velocity_m_s: float = Field(default=5.0, gt=0.1, le=20.0)
    vertical_velocity_m_s: float = Field(default=2.0, gt=0.1, le=10.0)
    max_heading_rate_deg_s: float = Field(default=60.0, gt=1.0, le=360.0)


class MissionItemPayload(BaseModel):
    type: MissionItemType
    name: str = ""
    latitude_deg: float | None = Field(default=None, ge=-90.0, le=90.0)
    longitude_deg: float | None = Field(default=None, ge=-180.0, le=180.0)
    altitude_m: float | None = Field(default=None, ge=-1000.0, le=10000.0)
    hold_time_s: float = Field(default=5.0, ge=0.0, le=3600.0)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        return value.strip()

    @model_validator(mode="after")
    def validate_item(self) -> "MissionItemPayload":
        if self.type == "takeoff" and self.altitude_m is None:
            raise ValueError("takeoff items require a relative target altitude")
        if self.type == "waypoint":
            if self.latitude_deg is None or self.longitude_deg is None or self.altitude_m is None:
                raise ValueError("waypoint items require latitude, longitude, and altitude")
        return self


class MissionPlan(BaseModel):
    name: str = Field(default="adaptive-run", min_length=1, max_length=64)
    defaults: MissionDefaultsPayload = Field(default_factory=MissionDefaultsPayload)
    items: list[MissionItemPayload] = Field(default_factory=list, min_length=1)


class MissionPublishRequest(BaseModel):
    mission: MissionPlan


class ActivateMissionRequest(BaseModel):
    activate: bool = True


class ActionResponse(BaseModel):
    success: bool
    detail: str


class PositionSnapshot(BaseModel):
    latitude_deg: float | None = None
    longitude_deg: float | None = None
    altitude_amsl_m: float | None = None


class VehicleSnapshot(BaseModel):
    connected: bool
    flight_mode: str | None = None
    nav_state: int | None = None
    executor_in_charge: int | None = None
    armed: bool = False
    preflight_checks_pass: bool | None = None
    failsafe: bool | None = None
    system_id: int | None = None
    component_id: int | None = None
    battery_percent: int | None = None
    last_status_age_s: float | None = None
    last_position_age_s: float | None = None
    last_battery_age_s: float | None = None
    position: PositionSnapshot = Field(default_factory=PositionSnapshot)


class MissionCacheSnapshot(BaseModel):
    loaded: bool
    mission_name: str | None = None
    item_count: int = 0
    last_mission_publish_at: str | None = None
    last_activate_publish_at: str | None = None


class MissionRuntimeSnapshot(BaseModel):
    available: bool = False
    runtime_state: str | None = None
    active_bt_branch: str | None = None
    mission_ready: bool | None = None
    mission_active: bool | None = None
    mission_start_in_progress: bool | None = None
    current_item_index: int | None = None
    manual_altitude_active: bool | None = None
    altitude_offset_m: float | None = None
    throttle_input: float | None = None
    last_error: str | None = None
    last_update_age_s: float | None = None




class MavlinkSnapshot(BaseModel):
    enabled: bool = True
    connected: bool = False
    connection_url: str | None = None
    target_system: int | None = None
    target_component: int | None = None
    autopilot: int | None = None
    mav_type: int | None = None
    base_mode: int | None = None
    custom_mode: int | None = None
    system_status: int | None = None
    armed: bool | None = None
    battery_percent: int | None = None
    voltage_battery_v: float | None = None
    current_battery_a: float | None = None
    latitude_deg: float | None = None
    longitude_deg: float | None = None
    altitude_amsl_m: float | None = None
    relative_altitude_m: float | None = None
    heading_deg: float | None = None
    yaw_deg: float | None = None
    roll_deg: float | None = None
    pitch_deg: float | None = None
    groundspeed_m_s: float | None = None
    last_heartbeat_age_s: float | None = None
    last_message_age_s: float | None = None
    last_error: str | None = None
    last_statustext: str | None = None
    message_counts: dict[str, int] = Field(default_factory=dict)


class MavlinkArmRequest(BaseModel):
    arm: bool = True
    force: bool = False


class MavlinkModeRequest(BaseModel):
    main_mode: int = Field(ge=0, le=255)
    sub_mode: int = Field(default=0, ge=0, le=255)


class MavlinkTakeoffRequest(BaseModel):
    altitude_m: float = Field(default=3.0, gt=0.5, le=120.0)


class MavlinkSetMessageRateRequest(BaseModel):
    message_id: int = Field(ge=0, le=16777215)
    rate_hz: float = Field(default=1.0, ge=0.0, le=200.0)


class MavlinkPx4ModeNameRequest(BaseModel):
    mode: Literal[
        "manual",
        "altctl",
        "posctl",
        "hold",
        "mission",
        "rtl",
        "land",
        "takeoff",
        "offboard",
    ]


class StatusSnapshot(BaseModel):
    ros_ready: bool
    mission_topic: str
    activate_topic: str
    vehicle: VehicleSnapshot
    mission_cache: MissionCacheSnapshot
    mission_runtime: MissionRuntimeSnapshot = Field(default_factory=MissionRuntimeSnapshot)
    mavlink: MavlinkSnapshot = Field(default_factory=MavlinkSnapshot)
