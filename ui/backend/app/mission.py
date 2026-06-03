from __future__ import annotations

import json
from typing import Any

from .models import MissionItemPayload, MissionPlan


class MissionValidationError(ValueError):
    """Raised when a web mission cannot be converted into a MissionExecutor payload."""


def _set_id_if_needed(payload: dict[str, object], item: MissionItemPayload) -> dict[str, object]:
    if item.name:
        payload.setdefault("id", item.name)
    return payload


def _parse_object_json(raw_json: str, label: str) -> dict[str, Any]:
    try:
        payload = json.loads(raw_json or "{}")
    except json.JSONDecodeError as error:
        raise MissionValidationError(f"{label} JSON is invalid: {error.msg}") from error

    if not isinstance(payload, dict):
        raise MissionValidationError(f"{label} JSON must be an object")
    return payload


def _compile_item(item: MissionItemPayload) -> dict[str, object]:
    if item.type == "takeoff":
        payload: dict[str, object] = {"type": "takeoff"}
        if item.altitude_m is not None:
            # Optional extension. The simple mode also accepts bare {"type":"takeoff"}.
            payload["altitude"] = float(item.altitude_m)
        return _set_id_if_needed(payload, item)

    if item.type == "waypoint":
        if item.latitude_deg is None or item.longitude_deg is None or item.altitude_m is None:
            raise MissionValidationError("waypoint items require latitude, longitude, and altitude")
        return _set_id_if_needed(
            {
                "type": "navigation",
                "navigationType": "waypoint",
                "x": float(item.latitude_deg),
                "y": float(item.longitude_deg),
                "z": float(item.altitude_m),
                "frame": "global",
            },
            item,
        )

    if item.type == "hold":
        payload: dict[str, object] = {"type": "hold"}
        if item.hold_time_s > 0:
            payload["duration"] = float(item.hold_time_s)
        return _set_id_if_needed(payload, item)

    if item.type == "changeSettings":
        payload: dict[str, object] = {"type": "changeSettings"}
        if item.reset_all:
            payload["resetAll"] = True
        if item.horizontal_velocity_m_s is not None:
            payload["horizontalVelocity"] = float(item.horizontal_velocity_m_s)
        if item.vertical_velocity_m_s is not None:
            payload["verticalVelocity"] = float(item.vertical_velocity_m_s)
        if item.max_heading_rate_deg_s is not None:
            payload["maxHeadingRate"] = float(item.max_heading_rate_deg_s)
        return _set_id_if_needed(payload, item)

    if item.type == "land":
        return _set_id_if_needed({"type": "land"}, item)

    if item.type == "rtl":
        return _set_id_if_needed({"type": "rtl"}, item)

    if item.type == "pickup":
        payload = _parse_object_json(item.custom_json, "pickup")
        payload["type"] = "pickup"
        return _set_id_if_needed(payload, item)

    if item.type == "servoPulse":
        # Kept for backward compatibility with the old UI. The provided simple ROS
        # mode only registers the "pickup" action, so this item requires a mode
        # that has a matching custom action registered.
        return _set_id_if_needed(
            {
                "type": "servoPulse",
                "channel": int(item.servo_channel),
                "pwm_on_us": int(item.servo_pwm_on_us),
                "pwm_off_us": int(item.servo_pwm_off_us),
                "period_s": float(item.servo_period_s),
                "on_duration_s": float(item.servo_on_duration_s),
            },
            item,
        )

    if item.type == "customAction":
        payload = _parse_object_json(item.custom_json, "custom action")
        payload["type"] = item.custom_type.strip()
        return _set_id_if_needed(payload, item)

    raise MissionValidationError(f"Unsupported mission item type: {item.type}")


def compile_mission(plan: MissionPlan) -> dict[str, object]:
    if not plan.items:
        raise MissionValidationError("mission must contain at least one item")

    return {
        "version": 1,
        "mission": {
            "defaults": {
                "horizontalVelocity": float(plan.defaults.horizontal_velocity_m_s),
                "verticalVelocity": float(plan.defaults.vertical_velocity_m_s),
                "maxHeadingRate": float(plan.defaults.max_heading_rate_deg_s),
            },
            "items": [_compile_item(item) for item in plan.items],
        },
    }
