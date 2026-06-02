from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import AppSettings
from .mavlink_gcs import MavlinkGcsBridge
from .mission import MissionValidationError, compile_mission
from .models import (
    ActionResponse,
    ActivateMissionRequest,
    MavlinkArmRequest,
    MavlinkModeRequest,
    MavlinkPx4ModeNameRequest,
    MavlinkSetMessageRateRequest,
    MavlinkSnapshot,
    MavlinkTakeoffRequest,
    MissionPublishRequest,
    StatusSnapshot,
)
from .ros_bridge import RosMissionBridge


settings = AppSettings.load()
ros_bridge = RosMissionBridge(settings)
mavlink_bridge = MavlinkGcsBridge(settings)


def _mavlink_snapshot() -> MavlinkSnapshot:
    cache = mavlink_bridge.snapshot()
    return MavlinkSnapshot(
        enabled=settings.mavlink_enabled,
        connected=cache.connected,
        connection_url=cache.connection_url,
        target_system=cache.target_system,
        target_component=cache.target_component,
        autopilot=cache.autopilot,
        mav_type=cache.mav_type,
        base_mode=cache.base_mode,
        custom_mode=cache.custom_mode,
        system_status=cache.system_status,
        armed=cache.armed,
        battery_percent=cache.battery_percent,
        voltage_battery_v=cache.voltage_battery_v,
        current_battery_a=cache.current_battery_a,
        latitude_deg=cache.latitude_deg,
        longitude_deg=cache.longitude_deg,
        altitude_amsl_m=cache.altitude_amsl_m,
        relative_altitude_m=cache.relative_altitude_m,
        heading_deg=cache.heading_deg,
        yaw_deg=cache.yaw_deg,
        roll_deg=cache.roll_deg,
        pitch_deg=cache.pitch_deg,
        groundspeed_m_s=cache.groundspeed_m_s,
        last_heartbeat_age_s=cache.last_heartbeat_age_s,
        last_message_age_s=cache.last_message_age_s,
        last_error=cache.last_error,
        last_statustext=cache.last_statustext,
        message_counts=cache.message_counts,
    )


def _status_snapshot() -> StatusSnapshot:
    snapshot = ros_bridge.status_snapshot()
    snapshot.mavlink = _mavlink_snapshot()
    return snapshot


@asynccontextmanager
async def lifespan(_: FastAPI):
    # ROS 2 gives access to px4_msgs topics and the adaptive mission mode topics.
    ros_bridge.start()
    # MAVLink gives PX4 a real GCS heartbeat, so the backend can replace QGC
    # for the "No connection to GCS" preflight requirement.
    mavlink_bridge.start()
    try:
        yield
    finally:
        mavlink_bridge.shutdown()
        ros_bridge.shutdown()


app = FastAPI(title=settings.api_title, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, object]:
    snapshot = _status_snapshot()
    return {
        "status": "ok",
        "ros_ready": snapshot.ros_ready,
        "vehicle_connected": snapshot.vehicle.connected,
        "mavlink_enabled": snapshot.mavlink.enabled,
        "mavlink_connected": snapshot.mavlink.connected,
        "mavlink_last_error": snapshot.mavlink.last_error,
    }


@app.get("/api/status", response_model=StatusSnapshot)
async def status() -> StatusSnapshot:
    return _status_snapshot()


@app.get("/api/mavlink/status", response_model=MavlinkSnapshot)
async def mavlink_status() -> MavlinkSnapshot:
    return _mavlink_snapshot()


@app.post("/api/mavlink/arm", response_model=ActionResponse)
async def mavlink_arm(request: MavlinkArmRequest) -> ActionResponse:
    success, detail = mavlink_bridge.command_arm(arm=request.arm, force=request.force)
    return ActionResponse(success=success, detail=detail)


@app.post("/api/mavlink/disarm", response_model=ActionResponse)
async def mavlink_disarm() -> ActionResponse:
    success, detail = mavlink_bridge.command_arm(arm=False, force=False)
    return ActionResponse(success=success, detail=detail)


@app.post("/api/mavlink/rtl", response_model=ActionResponse)
async def mavlink_rtl() -> ActionResponse:
    success, detail = mavlink_bridge.command_rtl()
    return ActionResponse(success=success, detail=detail)


@app.post("/api/mavlink/takeoff", response_model=ActionResponse)
async def mavlink_takeoff(request: MavlinkTakeoffRequest) -> ActionResponse:
    success, detail = mavlink_bridge.command_takeoff(altitude_m=request.altitude_m)
    return ActionResponse(success=success, detail=detail)


@app.post("/api/mavlink/land", response_model=ActionResponse)
async def mavlink_land() -> ActionResponse:
    success, detail = mavlink_bridge.command_land()
    return ActionResponse(success=success, detail=detail)


@app.post("/api/mavlink/mode", response_model=ActionResponse)
async def mavlink_mode(request: MavlinkModeRequest) -> ActionResponse:
    success, detail = mavlink_bridge.set_px4_mode(
        main_mode=request.main_mode,
        sub_mode=request.sub_mode,
    )
    return ActionResponse(success=success, detail=detail)


@app.post("/api/mavlink/mode/name", response_model=ActionResponse)
async def mavlink_mode_name(request: MavlinkPx4ModeNameRequest) -> ActionResponse:
    success, detail = mavlink_bridge.set_px4_mode_name(request.mode)
    return ActionResponse(success=success, detail=detail)


@app.post("/api/mavlink/message-rate", response_model=ActionResponse)
async def mavlink_message_rate(request: MavlinkSetMessageRateRequest) -> ActionResponse:
    success, detail = mavlink_bridge.set_message_rate(
        message_id=request.message_id,
        rate_hz=request.rate_hz,
    )
    return ActionResponse(success=success, detail=detail)


@app.post("/api/mission", response_model=ActionResponse)
async def publish_mission(request: MissionPublishRequest) -> ActionResponse:
    try:
        payload = compile_mission(request.mission)
    except MissionValidationError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    ros_bridge.publish_mission(payload, request.mission.name, len(request.mission.items))
    return ActionResponse(
        success=True,
        detail=f"Published mission '{request.mission.name}' with {len(request.mission.items)} items",
    )


@app.post("/api/activate", response_model=ActionResponse)
async def activate_mission(request: ActivateMissionRequest) -> ActionResponse:
    ros_bridge.publish_activate(request.activate)
    return ActionResponse(
        success=True,
        detail="Published activate_json request" if request.activate else "Published deactivate request",
    )


@app.post("/api/mission/run", response_model=ActionResponse)
async def run_mission(request: MissionPublishRequest) -> ActionResponse:
    try:
        payload = compile_mission(request.mission)
    except MissionValidationError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    ros_bridge.publish_mission(payload, request.mission.name, len(request.mission.items))
    await asyncio.sleep(settings.activate_delay_s)
    ros_bridge.publish_activate(True)
    return ActionResponse(
        success=True,
        detail=f"Published mission '{request.mission.name}' and activate_json",
    )
