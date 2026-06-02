from __future__ import annotations

from .models import MissionItemPayload, MissionPlan


class MissionValidationError(ValueError):
    """Raised when a web mission cannot be converted into a MissionExecutor payload."""


def _compile_item(item: MissionItemPayload) -> dict[str, object]:
    if item.type == "takeoff":
        if item.altitude_m is None:
            raise MissionValidationError("takeoff items require a relative target altitude")
        return {
            "type": "takeoff",
            "targetAltitudeM": float(item.altitude_m),
        }

    if item.type == "waypoint":
        if item.latitude_deg is None or item.longitude_deg is None or item.altitude_m is None:
            raise MissionValidationError("waypoint items require latitude, longitude, and altitude")
        return {
            "type": "navigation",
            "navigationType": "waypoint",
            "x": float(item.latitude_deg),
            "y": float(item.longitude_deg),
            "z": float(item.altitude_m),
            "frame": "global",
        }

    if item.type == "hold":
        payload: dict[str, object] = {"type": "hold"}
        if item.hold_time_s > 0:
            payload["duration"] = float(item.hold_time_s)
        return payload

    if item.type == "land":
        return {"type": "land"}

    if item.type == "rtl":
        return {"type": "rtl"}

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
