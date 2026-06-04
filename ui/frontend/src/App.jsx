import { memo, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";


const API_BASE = import.meta.env.VITE_API_BASE ?? "";

const DEFAULT_DEFAULTS = {
  horizontal_velocity_m_s: 5,
  vertical_velocity_m_s: 2,
  max_heading_rate_deg_s: 60,
};

const EMPTY_STATUS = {
  ros_ready: false,
  mission_topic: "/adaptive_mission_mode/mission_json",
  activate_topic: "/adaptive_mission_mode/activate",
  pickup_topic: "/adaptive_mission_mode/pickup",
  pause_rtl_topic: "/adaptive_mission_mode/pause_rtl",
  continue_mission_topic: "/adaptive_mission_mode/continue_mission",
  start_topic: "/adaptive_mission_mode/activate",
  return_home_topic: "/adaptive_mission_mode/activate",
  vehicle: {
    connected: false,
    flight_mode: null,
    nav_state: null,
    executor_in_charge: null,
    armed: false,
    preflight_checks_pass: null,
    failsafe: null,
    system_id: null,
    component_id: null,
    battery_percent: null,
    last_status_age_s: null,
    last_position_age_s: null,
    last_local_position_age_s: null,
    last_battery_age_s: null,
    position: {
      latitude_deg: null,
      longitude_deg: null,
      altitude_amsl_m: null,
      relative_altitude_m: null,
      source: null,
      local_x_ned_m: null,
      local_y_ned_m: null,
      local_z_ned_m: null,
      local_heading_rad: null,
      local_xy_valid: null,
      local_z_valid: null,
      local_reference_valid: null,
      ref_lat_deg: null,
      ref_lon_deg: null,
      ref_alt_msl_m: null,
    },
  },
  mission_cache: {
    loaded: false,
    mission_name: null,
    item_count: 0,
    last_mission_publish_at: null,
    last_start_publish_at: null,
    last_return_home_publish_at: null,
    last_pause_rtl_publish_at: null,
    last_continue_publish_at: null,
  },
  mission_runtime: {
    available: false,
    runtime_state: null,
    mission_ready: null,
    mission_active: null,
    mission_start_in_progress: null,
    current_item_index: null,
    current_item_type: null,
    vehicle: {
      valid: null,
      armed: null,
      landed: null,
      nav_state: null,
      x_ned_m: null,
      y_ned_m: null,
      z_ned_m: null,
      local_reference_valid: null,
      ref_lat_deg: null,
      ref_lon_deg: null,
      ref_alt_msl_m: null,
    },
    manual_altitude_active: null,
    altitude_offset_m: null,
    throttle_input: null,
    climb_rate_command_m_s: null,
    target: {
      valid: null,
      x_ned_m: null,
      y_ned_m: null,
      base_z_ned_m: null,
      effective_z_ned_m: null,
      altitude_offset_m: null,
    },
    payload_servo: {
      active: null,
      item_index: null,
      channel: null,
      pwm_us: null,
      pulse_high: null,
    },
    pause: {
      phase: null,
      paused: null,
      has_pause_point: null,
      pause_point: null,
    },
    last_error: null,
    last_update_age_s: null,
  },
  mavlink: {
    enabled: false,
    connected: false,
    connection_url: null,
    target_system: null,
    target_component: null,
    autopilot: null,
    mav_type: null,
    base_mode: null,
    custom_mode: null,
    system_status: null,
    armed: false,
    battery_percent: null,
    voltage_battery_v: null,
    current_battery_a: null,
    latitude_deg: null,
    longitude_deg: null,
    altitude_amsl_m: null,
    relative_altitude_m: null,
    heading_deg: null,
    yaw_deg: null,
    roll_deg: null,
    pitch_deg: null,
    last_heartbeat_age_s: null,
    last_message_age_s: null,
    last_error: null,
    last_statustext: null,
    message_counts: {},
  },
};

const TILE_SIZE = 256;
const MAP_TILE_URL_TEMPLATE = import.meta.env.VITE_MAP_TILE_URL_TEMPLATE ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const MIN_MAP_ZOOM = 3;
const MAX_MAP_ZOOM = 20;
const DEFAULT_MAP_CENTER = { latitude_deg: 10.823099, longitude_deg: 106.629662 };
const MAP_3D_PITCH_SCALE = 0.66;
// Vì tile OSM không có địa hình/độ cao, UI dựng 3D giả lập bằng cách nâng marker theo altitude_m.
// Scale này chỉ dùng để hiển thị trực quan, không làm đổi dữ liệu mission gửi xuống backend.
const MAP_3D_ALTITUDE_SCALE = 1.55;
const MAP_3D_MAX_VISUAL_ALTITUDE_M = 120;
const MAX_FLIGHT_TRACK_JUMP_M = 120;

// Chỉnh độ dày đường line mission tại đây.
// Đơn vị là mét trong scene 3D; tăng số này nếu muốn line to hơn.
const MISSION_PATH_LINE_THICKNESS_M = 0.34;
const MISSION_PATH_LINE_OPACITY = 0.94;
const MISSION_PATH_LINE_COLOR = 0x22d3ee;

// Chỉnh mức sáng/halo của waypoint đang được ROS mode thực hiện.
const ACTIVE_MISSION_MARKER_EMISSIVE_INTENSITY = 1.15;
const ACTIVE_MISSION_MARKER_GLOW_OPACITY = 0.26;
const ACTIVE_MISSION_MARKER_GLOW_RADIUS_EXTRA_M = 1.05;


const PX4_MAIN_MODE = {
  1: "MANUAL",
  2: "ALTCTL",
  3: "POSCTL",
  4: "AUTO",
  5: "ACRO",
  6: "OFFBOARD",
  7: "STABILIZED",
  8: "RATTITUDE",
  9: "SIMPLE",
};

const PX4_AUTO_SUB_MODE = {
  1: "READY",
  2: "TAKEOFF",
  3: "LOITER",
  4: "MISSION",
  5: "RTL",
  6: "LAND",
  7: "RTGS",
  8: "FOLLOW_TARGET",
  9: "PRECLAND",
  10: "VTOL_TAKEOFF",
  11: "EXTERNAL1",
  12: "EXTERNAL2",
  13: "EXTERNAL3",
  14: "EXTERNAL4",
  15: "EXTERNAL5",
  16: "EXTERNAL6",
  17: "EXTERNAL7",
  18: "EXTERNAL8",
};

const MISSION_ICON = {
  takeoff: "rocket_launch",
  waypoint: "add_location_alt",
  hold: "pause_circle",
  changeSettings: "tune",
  land: "flight_land",
  rtl: "home_pin",
  pickup: "inventory_2",
  servoPulse: "settings_input_component",
  customAction: "extension",
};

const MISSION_LABEL = {
  takeoff: "TO",
  waypoint: "WP",
  hold: "HOLD",
  changeSettings: "SET",
  land: "LAND",
  rtl: "RTL",
  pickup: "PICK",
  servoPulse: "SERVO",
  customAction: "ACT",
};

const MISSION_MARKER_STYLE = {
  takeoff: "border-emerald-100 bg-emerald-400 text-zinc-950 ring-emerald-300/20",
  waypoint: "border-cyan-100 bg-cyan-400 text-zinc-950 ring-cyan-300/20",
  hold: "border-amber-100 bg-amber-300 text-zinc-950 ring-amber-300/20",
  changeSettings: "border-sky-100 bg-sky-400 text-zinc-950 ring-sky-300/20",
  land: "border-violet-100 bg-violet-400 text-zinc-950 ring-violet-300/20",
  rtl: "border-rose-100 bg-rose-400 text-zinc-950 ring-rose-300/20",
  pickup: "border-orange-100 bg-orange-300 text-zinc-950 ring-orange-300/20",
  servoPulse: "border-lime-100 bg-lime-300 text-zinc-950 ring-lime-300/20",
  customAction: "border-fuchsia-100 bg-fuchsia-400 text-zinc-950 ring-fuchsia-300/20",
};

const MAP_COORDINATE_ITEM_TYPES = new Set(["waypoint"]);
const ALTITUDE_DRAG_ITEM_TYPES = new Set(["takeoff", "waypoint", "hold", "land"]);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clampLatitude(latitude) {
  return clamp(latitude, -85.05112878, 85.05112878);
}

function hasValidCoordinate(latitude, longitude) {
  return Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));
}

function nedOffsetToLatLon(refLatDeg, refLonDeg, northM, eastM) {
  const earthRadiusM = 6378137;
  const refLatRad = Number(refLatDeg) * Math.PI / 180;
  const latitude = Number(refLatDeg) + (Number(northM) / earthRadiusM) * 180 / Math.PI;
  const lonScale = Math.max(Math.cos(refLatRad), 1e-7);
  const longitude = Number(refLonDeg) + (Number(eastM) / (earthRadiusM * lonScale)) * 180 / Math.PI;
  return { latitude_deg: clampLatitude(latitude), longitude_deg: longitude };
}

function coordinateFromLocalNed(localX, localY, refLat, refLon) {
  if (!Number.isFinite(Number(localX)) || !Number.isFinite(Number(localY))) {
    return null;
  }
  const anchorLat = Number.isFinite(Number(refLat)) ? Number(refLat) : DEFAULT_MAP_CENTER.latitude_deg;
  const anchorLon = Number.isFinite(Number(refLon)) ? Number(refLon) : DEFAULT_MAP_CENTER.longitude_deg;
  return nedOffsetToLatLon(anchorLat, anchorLon, Number(localX), Number(localY));
}

function isDroneArmed(status) {
  return Boolean(status?.mavlink?.armed || status?.vehicle?.armed);
}

function haversineDistanceMeters(a, b) {
  if (!hasValidCoordinate(a?.latitude_deg, a?.longitude_deg) || !hasValidCoordinate(b?.latitude_deg, b?.longitude_deg)) {
    return Number.POSITIVE_INFINITY;
  }

  const earthRadiusM = 6371000;
  const lat1 = Number(a.latitude_deg) * Math.PI / 180;
  const lat2 = Number(b.latitude_deg) * Math.PI / 180;
  const dLat = (Number(b.latitude_deg) - Number(a.latitude_deg)) * Math.PI / 180;
  const dLon = (Number(b.longitude_deg) - Number(a.longitude_deg)) * Math.PI / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * earthRadiusM * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function itemCanUseMapCoordinate(item) {
  return MAP_COORDINATE_ITEM_TYPES.has(item?.type);
}

function itemCanDragAltitude(item) {
  return ALTITUDE_DRAG_ITEM_TYPES.has(item?.type);
}

function itemCanInteractOnMap(item) {
  return itemCanUseMapCoordinate(item) || itemCanDragAltitude(item);
}

function findFirstMissionCoordinate(items, livePosition) {
  const firstItem = items.find((item) => hasValidCoordinate(item.latitude_deg, item.longitude_deg));
  if (firstItem) {
    return {
      latitude_deg: Number(firstItem.latitude_deg),
      longitude_deg: Number(firstItem.longitude_deg),
    };
  }

  if (hasValidCoordinate(livePosition?.latitude_deg, livePosition?.longitude_deg)) {
    return {
      latitude_deg: Number(livePosition.latitude_deg),
      longitude_deg: Number(livePosition.longitude_deg),
    };
  }

  return null;
}

function findPreviousWaypointIndex(items, index) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (items[cursor]?.type === "waypoint") {
      return cursor;
    }
  }
  return null;
}

function buildWaypointActionSummary(items) {
  const summaryByWaypointIndex = new Map();
  const parentByActionIndex = new Map();

  items.forEach((item, index) => {
    if (item?.type !== "hold" && item?.type !== "land") {
      return;
    }

    const parentIndex = findPreviousWaypointIndex(items, index);
    if (!Number.isInteger(parentIndex)) {
      return;
    }

    const summary = summaryByWaypointIndex.get(parentIndex) ?? {
      holdItems: [],
      landItems: [],
      totalHoldTimeS: 0,
      hasHold: false,
      hasLand: false,
    };

    if (item.type === "hold") {
      const holdTimeS = Number.isFinite(Number(item.hold_time_s)) ? Math.max(0, Number(item.hold_time_s)) : 0;
      summary.holdItems.push({ index, holdTimeS });
      summary.totalHoldTimeS += holdTimeS;
      summary.hasHold = true;
      parentByActionIndex.set(index, parentIndex);
    }

    if (item.type === "land") {
      summary.landItems.push({ index });
      summary.hasLand = true;
      parentByActionIndex.set(index, parentIndex);
    }

    summaryByWaypointIndex.set(parentIndex, summary);
  });

  return { summaryByWaypointIndex, parentByActionIndex };
}

function formatHoldTimeLabel(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "HOLD";
  }
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return remainingSeconds > 0 ? `HOLD ${minutes}m${remainingSeconds}s` : `HOLD ${minutes}m`;
  }
  return `HOLD ${seconds.toFixed(seconds >= 10 ? 0 : 1)}s`;
}

function getActionHomeDisplayCoordinate(item, livePosition, homeCoordinate = null) {
  // Takeoff/RTL là action không có lat/lon trong payload mission, nhưng UI vẫn cần
  // một điểm hiển thị. Ưu tiên điểm đã chốt lúc tạo item; nếu điểm đó hoặc HOME
  // bị dính map-origin/local-reference sai quá xa UAV thì dùng live UAV làm fallback.
  // Như vậy marker không bị nhảy ra tọa độ map, còn độ cao vẫn xử lý riêng ở phần vẽ.
  const candidates = [
    {
      latitude_deg: item.display_latitude_deg,
      longitude_deg: item.display_longitude_deg,
      fromFallback: false,
      fromHome: true,
      source: "item display home",
    },
    {
      latitude_deg: homeCoordinate?.latitude_deg,
      longitude_deg: homeCoordinate?.longitude_deg,
      fromFallback: false,
      fromHome: true,
      source: homeCoordinate?.source ?? "home",
    },
  ];

  const liveValid = hasValidCoordinate(livePosition?.latitude_deg, livePosition?.longitude_deg);
  const maxTrustedHomeDistanceM = 500;

  for (const candidate of candidates) {
    if (!hasValidCoordinate(candidate.latitude_deg, candidate.longitude_deg)) {
      continue;
    }

    const normalized = {
      latitude_deg: Number(candidate.latitude_deg),
      longitude_deg: Number(candidate.longitude_deg),
      fromFallback: candidate.fromFallback,
      fromHome: candidate.fromHome,
      source: candidate.source,
    };

    if (!liveValid) {
      return normalized;
    }

    const distanceToUavM = haversineDistanceMeters(normalized, livePosition);
    if (distanceToUavM <= maxTrustedHomeDistanceM) {
      return normalized;
    }
  }

  if (liveValid) {
    return {
      latitude_deg: Number(livePosition.latitude_deg),
      longitude_deg: Number(livePosition.longitude_deg),
      fromFallback: true,
      fromHome: true,
      source: "live UAV fallback",
    };
  }

  const fallbackHomeCoordinate = findFirstMissionCoordinate([], livePosition);
  return fallbackHomeCoordinate ? { ...fallbackHomeCoordinate, fromFallback: true, fromHome: true } : null;
}

function getMissionMarkerCoordinate(item, index, items, livePosition, homeCoordinate = null) {
  // Takeoff và RTL chỉ là action marker của UI: XY neo tại home/drone display,
  // còn altitude không lấy từ UAV live mà xử lý riêng ở getVisualAltitudeM.
  if (item.type === "takeoff" || item.type === "rtl") {
    return getActionHomeDisplayCoordinate(item, livePosition, homeCoordinate);
  }

  if (hasValidCoordinate(item.latitude_deg, item.longitude_deg)) {
    return {
      latitude_deg: Number(item.latitude_deg),
      longitude_deg: Number(item.longitude_deg),
      fromFallback: false,
    };
  }

  if (itemCanUseMapCoordinate(item)) {
    const previousItem = items
      .slice(0, index)
      .reverse()
      .find((candidate) => hasValidCoordinate(candidate.latitude_deg, candidate.longitude_deg));

    if (previousItem) {
      return {
        latitude_deg: Number(previousItem.latitude_deg),
        longitude_deg: Number(previousItem.longitude_deg),
        fromFallback: true,
      };
    }
  }

  return null;
}

function decodePx4Mode(customMode) {
  if (!Number.isFinite(Number(customMode))) {
    return "--";
  }

  const value = Number(customMode) >>> 0;
  const mainMode = (value >> 16) & 0xff;
  const subMode = (value >> 24) & 0xff;
  const mainName = PX4_MAIN_MODE[mainMode] ?? `MAIN_${mainMode}`;

  if (mainMode === 4 && subMode > 0) {
    return `${mainName}/${PX4_AUTO_SUB_MODE[subMode] ?? `SUB_${subMode}`}`;
  }

  return mainName;
}

function getLivePosition(status) {
  const mavlink = status?.mavlink ?? {};
  const rosPosition = status?.vehicle?.position ?? {};
  const runtimeVehicle = status?.mission_runtime?.vehicle ?? status?.vehicle?.runtime_vehicle ?? {};

  const runtimeLatitude = firstFiniteNumber(runtimeVehicle.lat, runtimeVehicle.latitude_deg, runtimeVehicle.latitude);
  const runtimeLongitude = firstFiniteNumber(runtimeVehicle.lon, runtimeVehicle.longitude_deg, runtimeVehicle.longitude);
  const runtimeAltitudeAmsl = firstFiniteNumber(runtimeVehicle.alt_msl, runtimeVehicle.altitude_amsl_m, runtimeVehicle.alt_msl_m);

  // Drone UI/map must prefer the global state published by adaptive_mission_mode:
  // lat, lon, alt_msl. Local NED is kept only as a debug/fallback field.
  if (hasValidCoordinate(runtimeLatitude, runtimeLongitude)) {
    return {
      latitude_deg: runtimeLatitude,
      longitude_deg: runtimeLongitude,
      altitude_amsl_m: runtimeAltitudeAmsl ?? rosPosition.altitude_amsl_m ?? mavlink.altitude_amsl_m ?? null,
      relative_altitude_m: rosPosition.relative_altitude_m ?? mavlink.relative_altitude_m ?? null,
      local_x_ned_m: runtimeVehicle.x_ned_m ?? rosPosition.local_x_ned_m ?? mavlink.local_x_ned_m ?? null,
      local_y_ned_m: runtimeVehicle.y_ned_m ?? rosPosition.local_y_ned_m ?? mavlink.local_y_ned_m ?? null,
      local_z_ned_m: runtimeVehicle.z_ned_m ?? rosPosition.local_z_ned_m ?? mavlink.local_z_ned_m ?? null,
      ref_lat_deg: runtimeVehicle.ref_lat_deg ?? rosPosition.ref_lat_deg ?? null,
      ref_lon_deg: runtimeVehicle.ref_lon_deg ?? rosPosition.ref_lon_deg ?? null,
      ref_alt_msl_m: runtimeVehicle.ref_alt_msl_m ?? rosPosition.ref_alt_msl_m ?? null,
      source: "adaptive state lat/lon/AMSL",
    };
  }

  if (hasValidCoordinate(rosPosition.latitude_deg, rosPosition.longitude_deg)) {
    return {
      ...rosPosition,
      relative_altitude_m: rosPosition.relative_altitude_m ?? mavlink.relative_altitude_m ?? null,
      altitude_amsl_m: rosPosition.altitude_amsl_m ?? mavlink.altitude_amsl_m ?? null,
      local_x_ned_m: rosPosition.local_x_ned_m ?? mavlink.local_x_ned_m ?? null,
      local_y_ned_m: rosPosition.local_y_ned_m ?? mavlink.local_y_ned_m ?? null,
      local_z_ned_m: rosPosition.local_z_ned_m ?? mavlink.local_z_ned_m ?? null,
      source: rosPosition.source ?? "PX4 global_position lat/lon/AMSL",
    };
  }

  if (mavlink.connected && hasValidCoordinate(mavlink.latitude_deg, mavlink.longitude_deg)) {
    return {
      latitude_deg: mavlink.latitude_deg,
      longitude_deg: mavlink.longitude_deg,
      altitude_amsl_m: mavlink.altitude_amsl_m,
      relative_altitude_m: mavlink.relative_altitude_m,
      local_x_ned_m: mavlink.local_x_ned_m ?? rosPosition.local_x_ned_m ?? null,
      local_y_ned_m: mavlink.local_y_ned_m ?? rosPosition.local_y_ned_m ?? null,
      local_z_ned_m: mavlink.local_z_ned_m ?? rosPosition.local_z_ned_m ?? null,
      ref_lat_deg: rosPosition.ref_lat_deg ?? null,
      ref_lon_deg: rosPosition.ref_lon_deg ?? null,
      source: "MAVLink lat/lon/AMSL",
    };
  }

  const localCoordinate = coordinateFromLocalNed(
    rosPosition.local_x_ned_m ?? mavlink.local_x_ned_m,
    rosPosition.local_y_ned_m ?? mavlink.local_y_ned_m,
    rosPosition.ref_lat_deg,
    rosPosition.ref_lon_deg,
  );
  if (localCoordinate) {
    const localZ = rosPosition.local_z_ned_m ?? mavlink.local_z_ned_m ?? null;
    const refAltMsl = firstFiniteNumber(rosPosition.ref_alt_msl_m, mavlink.global_origin_alt_msl_m);
    const fallbackAmsl = Number.isFinite(Number(localZ)) && Number.isFinite(Number(refAltMsl))
      ? Number(refAltMsl) - Number(localZ)
      : null;
    return {
      ...localCoordinate,
      altitude_amsl_m: fallbackAmsl,
      relative_altitude_m: Number.isFinite(Number(localZ)) ? -Number(localZ) : null,
      local_x_ned_m: rosPosition.local_x_ned_m ?? mavlink.local_x_ned_m ?? null,
      local_y_ned_m: rosPosition.local_y_ned_m ?? mavlink.local_y_ned_m ?? null,
      local_z_ned_m: localZ,
      ref_lat_deg: rosPosition.ref_lat_deg ?? DEFAULT_MAP_CENTER.latitude_deg,
      ref_lon_deg: rosPosition.ref_lon_deg ?? DEFAULT_MAP_CENTER.longitude_deg,
      ref_alt_msl_m: refAltMsl,
      source: rosPosition.ref_lat_deg && rosPosition.ref_lon_deg ? "local NED fallback -> lat/lon/AMSL" : "map-origin fallback -> lat/lon",
    };
  }

  return {
    latitude_deg: null,
    longitude_deg: null,
    altitude_amsl_m: null,
    relative_altitude_m: null,
    local_x_ned_m: rosPosition.local_x_ned_m ?? mavlink.local_x_ned_m ?? null,
    local_y_ned_m: rosPosition.local_y_ned_m ?? mavlink.local_y_ned_m ?? null,
    local_z_ned_m: rosPosition.local_z_ned_m ?? mavlink.local_z_ned_m ?? null,
    source: "none",
  };
}


function getHomeCoordinate(status, fallbackPosition = null) {
  const rosPosition = status?.vehicle?.position ?? {};
  const runtimeVehicle = status?.mission_runtime?.vehicle ?? status?.vehicle?.runtime_vehicle ?? {};
  const mavlink = status?.mavlink ?? {};

  const candidates = [
    {
      latitude_deg: runtimeVehicle.ref_lat_deg,
      longitude_deg: runtimeVehicle.ref_lon_deg,
      altitude_amsl_m: runtimeVehicle.ref_alt_msl_m,
      source: "PX4 mission local reference",
    },
    {
      latitude_deg: rosPosition.ref_lat_deg,
      longitude_deg: rosPosition.ref_lon_deg,
      altitude_amsl_m: rosPosition.ref_alt_msl_m,
      source: "PX4 local reference",
    },
    {
      latitude_deg: mavlink.global_origin_lat_deg,
      longitude_deg: mavlink.global_origin_lon_deg,
      altitude_amsl_m: mavlink.global_origin_alt_msl_m,
      source: "MAVLink global origin",
    },
    {
      latitude_deg: fallbackPosition?.ref_lat_deg,
      longitude_deg: fallbackPosition?.ref_lon_deg,
      altitude_amsl_m: fallbackPosition?.ref_alt_msl_m,
      source: "live local reference",
    },
  ];

  const coordinate = candidates.find((candidate) => hasValidCoordinate(candidate.latitude_deg, candidate.longitude_deg));
  if (coordinate) {
    return {
      latitude_deg: Number(coordinate.latitude_deg),
      longitude_deg: Number(coordinate.longitude_deg),
      altitude_amsl_m: normalizeNumber(coordinate.altitude_amsl_m),
      relative_altitude_m: 0,
      source: coordinate.source,
    };
  }

  if (hasValidCoordinate(fallbackPosition?.latitude_deg, fallbackPosition?.longitude_deg)) {
    return {
      latitude_deg: Number(fallbackPosition.latitude_deg),
      longitude_deg: Number(fallbackPosition.longitude_deg),
      altitude_amsl_m: normalizeNumber(fallbackPosition.altitude_amsl_m),
      relative_altitude_m: 0,
      source: "first live position fallback",
    };
  }

  return null;
}


function getDroneTelemetry(status) {
  const mavlink = status?.mavlink ?? {};
  const vehicle = status?.vehicle ?? {};
  const position = vehicle.position ?? {};
  const useMavlink = Boolean(mavlink.connected);
  const headingFromLocal = Number.isFinite(Number(position.local_heading_rad))
    ? Number(position.local_heading_rad) * 180 / Math.PI
    : null;

  return {
    id: `${mavlink.target_system ?? vehicle.system_id ?? 1}:${mavlink.target_component ?? vehicle.component_id ?? 1}`,
    name: `Drone ${mavlink.target_system ?? vehicle.system_id ?? 1}`,
    source: useMavlink ? "MAVLink" : "ROS 2",
    connected: useMavlink ? true : Boolean(vehicle.connected),
    armed: useMavlink ? Boolean(mavlink.armed) : Boolean(vehicle.armed),
    mode: useMavlink ? decodePx4Mode(mavlink.custom_mode) : vehicle.flight_mode ?? "--",
    navState: vehicle.nav_state ?? "--",
    preflight: vehicle.preflight_checks_pass,
    failsafe: vehicle.failsafe,
    batteryPercent: mavlink.battery_percent ?? vehicle.battery_percent,
    voltage: mavlink.voltage_battery_v,
    current: mavlink.current_battery_a,
    headingDeg: mavlink.heading_deg ?? mavlink.yaw_deg ?? headingFromLocal,
    yawDeg: mavlink.yaw_deg ?? headingFromLocal,
    rollDeg: mavlink.roll_deg ?? null,
    pitchDeg: mavlink.pitch_deg ?? null,
    baseMode: mavlink.base_mode,
    customMode: mavlink.custom_mode,
    systemStatus: mavlink.system_status,
    autopilot: mavlink.autopilot,
    mavType: mavlink.mav_type,
    targetSystem: mavlink.target_system ?? vehicle.system_id,
    targetComponent: mavlink.target_component ?? vehicle.component_id,
    heartbeatAge: mavlink.last_heartbeat_age_s,
    messageAge: useMavlink ? mavlink.last_message_age_s : vehicle.last_status_age_s,
    positionAge: vehicle.last_position_age_s ?? vehicle.last_local_position_age_s,
    localPositionAge: vehicle.last_local_position_age_s,
    connectionUrl: mavlink.connection_url,
    lastError: mavlink.last_error,
    lastStatustext: mavlink.last_statustext,
    messageCounts: mavlink.message_counts ?? {},
  };
}


function getDroneOptions(status) {
  if (Array.isArray(status?.drones) && status.drones.length > 0) {
    return status.drones.map((drone, index) => ({
      id: String(drone.id ?? `${drone.system_id ?? index + 1}:${drone.component_id ?? 1}`),
      name: drone.name ?? `Drone ${drone.system_id ?? index + 1}`,
      connected: Boolean(drone.connected),
      armed: Boolean(drone.armed),
      batteryPercent: drone.battery_percent,
      mode: drone.flight_mode ?? drone.mode ?? "--",
    }));
  }

  const drone = getDroneTelemetry(status);
  return [drone];
}

function latLonToWorld(latitude, longitude, zoom) {
  const lat = clampLatitude(Number(latitude));
  const lon = clamp(Number(longitude), -180, 180);
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const scale = TILE_SIZE * 2 ** zoom;

  return {
    x: ((lon + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function worldToLatLon(x, y, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const longitude = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const latitude = (180 / Math.PI) * Math.atan(Math.sinh(n));

  return {
    latitude_deg: clampLatitude(latitude),
    longitude_deg: ((longitude + 540) % 360) - 180,
  };
}

function buildMapTileUrl(zoom, x, y) {
  return MAP_TILE_URL_TEMPLATE
    .replaceAll("{z}", String(zoom))
    .replaceAll("{x}", String(x))
    .replaceAll("{y}", String(y));
}


function coordinateToSceneMeters(coordinate, baseCoordinate) {
  const baseLatitudeRad = (Number(baseCoordinate.latitude_deg) * Math.PI) / 180;
  const metersPerDegLat = 111_320;
  const metersPerDegLon = Math.max(1, 111_320 * Math.cos(baseLatitudeRad));
  return {
    x: (Number(coordinate.longitude_deg) - Number(baseCoordinate.longitude_deg)) * metersPerDegLon,
    z: -(Number(coordinate.latitude_deg) - Number(baseCoordinate.latitude_deg)) * metersPerDegLat,
  };
}

function sceneMetersToCoordinate(x, z, baseCoordinate) {
  const baseLatitudeRad = (Number(baseCoordinate.latitude_deg) * Math.PI) / 180;
  const metersPerDegLat = 111_320;
  const metersPerDegLon = Math.max(1, 111_320 * Math.cos(baseLatitudeRad));
  return {
    latitude_deg: clampLatitude(Number(baseCoordinate.latitude_deg) - z / metersPerDegLat),
    longitude_deg: ((Number(baseCoordinate.longitude_deg) + x / metersPerDegLon + 540) % 360) - 180,
  };
}

function getBaseCoordinateForScene(missionItems, livePosition) {
  const firstMissionCoordinate = missionItems.find((item) => hasValidCoordinate(item.latitude_deg, item.longitude_deg));
  if (firstMissionCoordinate) {
    return {
      latitude_deg: Number(firstMissionCoordinate.latitude_deg),
      longitude_deg: Number(firstMissionCoordinate.longitude_deg),
    };
  }

  if (hasValidCoordinate(livePosition?.latitude_deg, livePosition?.longitude_deg)) {
    return {
      latitude_deg: Number(livePosition.latitude_deg),
      longitude_deg: Number(livePosition.longitude_deg),
    };
  }

  return DEFAULT_MAP_CENTER;
}

function disposeThreeObject(object) {
  object.traverse?.((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      if (material.map) {
        material.map.dispose();
      }
      material.dispose?.();
    });
  });
}

function createTextSprite(THREERef, text, options = {}) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const lines = String(text).split("\n");
  const fontSize = options.fontSize ?? 34;
  const paddingX = 20;
  const paddingY = 14;
  context.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
  const width = Math.ceil(Math.max(...lines.map((line) => context.measureText(line).width)) + paddingX * 2);
  const height = Math.ceil(lines.length * (fontSize + 5) + paddingY * 2);
  canvas.width = Math.max(128, Math.ceil(width / 2) * 2);
  canvas.height = Math.max(64, Math.ceil(height / 2) * 2);

  context.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = options.background ?? "rgba(2, 6, 23, 0.88)";
  const radius = 22;
  context.beginPath();
  context.moveTo(radius, 0);
  context.lineTo(canvas.width - radius, 0);
  context.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
  context.lineTo(canvas.width, canvas.height - radius);
  context.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
  context.lineTo(radius, canvas.height);
  context.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
  context.lineTo(0, radius);
  context.quadraticCurveTo(0, 0, radius, 0);
  context.closePath();
  context.fill();
  context.strokeStyle = options.border ?? "rgba(255,255,255,0.22)";
  context.lineWidth = 3;
  context.stroke();

  lines.forEach((line, lineIndex) => {
    context.fillStyle = lineIndex === 0 ? (options.color ?? "#ecfeff") : (options.subColor ?? "#cbd5e1");
    context.fillText(line, canvas.width / 2, paddingY + fontSize / 2 + lineIndex * (fontSize + 5));
  });

  const texture = new THREERef.CanvasTexture(canvas);
  texture.colorSpace = THREERef.SRGBColorSpace;
  const material = new THREERef.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
  const sprite = new THREERef.Sprite(material);
  const scale = options.scale ?? 0.18;
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
  return sprite;
}

function createCircleActionSprite(THREERef, text, options = {}) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const size = options.size ?? 128;
  canvas.width = size;
  canvas.height = size;

  const center = size / 2;
  const radius = size * 0.43;
  context.clearRect(0, 0, size, size);
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.fillStyle = options.background ?? "rgba(2, 6, 23, 0.92)";
  context.fill();
  context.lineWidth = size * 0.055;
  context.strokeStyle = options.border ?? "rgba(255,255,255,0.70)";
  context.stroke();

  context.font = `900 ${options.fontSize ?? 62}px Inter, system-ui, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = options.color ?? "#f8fafc";
  context.fillText(String(text), center, center + size * 0.015);

  const texture = new THREERef.CanvasTexture(canvas);
  texture.colorSpace = THREERef.SRGBColorSpace;
  const material = new THREERef.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
  const sprite = new THREERef.Sprite(material);
  const scale = options.scale ?? 0.040;
  sprite.scale.set(size * scale, size * scale, 1);
  return sprite;
}

function formatAge(value) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "--";
  }
  return `${Number(value).toFixed(1)}s`;
}

function formatCoordinate(value) {
  if (value == null || value === "" || !Number.isFinite(Number(value))) {
    return "--";
  }
  return Number(value).toFixed(7);
}

function formatSmallNumber(value, digits = 2, suffix = "") {
  if (value == null || value === "" || !Number.isFinite(Number(value))) {
    return "--";
  }
  return `${Number(value).toFixed(digits)}${suffix}`;
}

function firstFiniteNumber(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function formatLinkSummary(value) {
  if (!value) {
    return "--";
  }

  const text = String(value);
  const udpMatch = text.match(/:(\d+)$/);
  if (text.includes("udp") && udpMatch) {
    return `UDP ${udpMatch[1]}`;
  }
  return text;
}

function getMissionRuntimeState(status) {
  return String(status?.mission_runtime?.runtime_state ?? status?.state ?? "").trim().toLowerCase();
}

function getRawMissionAltitudeOffsetM(status) {
  const candidates = [
    status?.mission_runtime?.altitude_offset_m,
    status?.mission_runtime?.target?.altitude_offset_m,
    status?.altitude?.offset_m,
  ];

  const value = candidates.find((candidate) => Number.isFinite(Number(candidate)));
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function isMissionAltitudeOffsetVisible(status) {
  const runtimeState = getMissionRuntimeState(status);
  const terminalStates = new Set([
    "",
    "idle",
    "completed",
    "complete",
    "finished",
    "done",
    "cancel",
    "cancelled",
    "canceled",
    "aborted",
    "error",
  ]);

  if (terminalStates.has(runtimeState)) {
    return false;
  }

  const active = Boolean(
    status?.mission_runtime?.mission_active ||
    status?.mission_runtime?.active ||
    status?.active ||
    ["starting", "mission", "pause_rtl", "rtl_landing", "resume_arm", "return_pause_point"].includes(runtimeState),
  );

  return active;
}

function getMissionVisualAltitudeOffsetM(status) {
  const offsetM = getRawMissionAltitudeOffsetM(status);
  if (!Number.isFinite(offsetM) || Math.abs(offsetM) < 0.005) {
    return 0;
  }
  return isMissionAltitudeOffsetVisible(status) ? offsetM : 0;
}

function getCurrentMissionItemIndex(status) {
  const candidates = [
    status?.mission_runtime?.current_item_index,
    status?.mission_runtime?.current_item?.index,
    status?.mission_runtime?.mission?.current_index,
    status?.mission?.current_index,
  ];

  const value = candidates.find((candidate) => Number.isInteger(Number(candidate)));
  if (value == null) {
    return null;
  }

  const index = Number(value);
  return index >= 0 ? index : null;
}

function getActiveMissionDisplayIndex(items, currentIndex) {
  if (!Array.isArray(items) || !Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= items.length) {
    return null;
  }

  const currentItem = items[currentIndex];
  if (currentItem?.type === "hold" || currentItem?.type === "land") {
    return findPreviousWaypointIndex(items, currentIndex);
  }

  return currentIndex;
}

function getCurrentMissionActionLabel(status, items, currentIndex) {
  const runtimeItem = status?.mission_runtime?.current_item;
  const runtimeType = status?.mission_runtime?.current_item_type ?? runtimeItem?.type;
  const localItem = Number.isInteger(currentIndex) ? items?.[currentIndex] : null;
  const actionType = runtimeType ?? localItem?.type;
  const actionId = runtimeItem?.id ?? localItem?.id ?? localItem?.name;

  if (!actionType) {
    return null;
  }

  const normalizedType = String(actionType).toLowerCase();
  const displayType = normalizedType === "navigation" ? "WAYPOINT" : String(actionType).toUpperCase();
  return actionId ? `▶ ${displayType} · ${actionId}` : `▶ ${displayType}`;
}

function getBaseVisualAltitudeM(item, livePosition) {
  if (Number.isFinite(Number(item?.altitude_m))) {
    return Math.max(0, Number(item.altitude_m));
  }
  const droneAmslM = firstFiniteNumber(livePosition?.altitude_amsl_m, livePosition?.alt_msl);
  if (droneAmslM !== null) {
    return Math.max(0, droneAmslM);
  }
  return 0;
}

function getVisualAltitudeM(item, livePosition, missionAltitudeOffsetM = 0) {
  const baseAltitudeM = getBaseVisualAltitudeM(item, livePosition);
  if (item?.type === "waypoint" && Number.isFinite(Number(missionAltitudeOffsetM))) {
    return Math.max(0, baseAltitudeM + Number(missionAltitudeOffsetM));
  }
  return baseAltitudeM;
}

function getDroneDisplayAltitudeM(livePosition) {
  const altitudeAmslM = firstFiniteNumber(livePosition?.altitude_amsl_m, livePosition?.alt_msl);
  if (altitudeAmslM !== null) {
    return altitudeAmslM;
  }

  // Last-resort fallback only when no global AMSL is available.
  const relativeAltitudeM = firstFiniteNumber(livePosition?.relative_altitude_m);
  if (relativeAltitudeM !== null) {
    return relativeAltitudeM;
  }
  const localZM = firstFiniteNumber(livePosition?.local_z_ned_m);
  return localZM !== null ? -localZM : 0;
}

function formatAltitudeLabel(value) {
  if (!Number.isFinite(Number(value))) {
    return "-- m";
  }
  const numeric = Number(value);
  if (Math.abs(numeric) >= 100) {
    return `${numeric.toFixed(0)} m`;
  }
  return `${numeric.toFixed(1)} m`;
}

function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getTakeoffAltitude(missionItems, status) {
  const takeoffItem = Array.isArray(missionItems)
    ? missionItems.find((item) => item.type === "takeoff" && Number.isFinite(Number(item.altitude_m)))
    : null;
  if (takeoffItem) {
    return Number(takeoffItem.altitude_m);
  }

  const livePosition = getLivePosition(status ?? EMPTY_STATUS);
  const liveAmslM = firstFiniteNumber(livePosition.altitude_amsl_m, livePosition.alt_msl);
  if (liveAmslM !== null) {
    return liveAmslM;
  }
  return 20;
}

function createMissionItem(type, status, missionItems = []) {
  const position = getLivePosition(status ?? EMPTY_STATUS);
  const homeCoordinate = getHomeCoordinate(status ?? EMPTY_STATUS, position) ?? position;
  const actionHomeCoordinate = getActionHomeDisplayCoordinate({}, position, homeCoordinate) ?? position;
  const latitude = position.latitude_deg ?? "";
  const longitude = position.longitude_deg ?? "";
  const actionLatitude = actionHomeCoordinate?.latitude_deg ?? latitude;
  const actionLongitude = actionHomeCoordinate?.longitude_deg ?? longitude;
  const takeoffAltitude = getTakeoffAltitude(missionItems, status ?? EMPTY_STATUS);
  const mapAltitude = Number.isFinite(Number(takeoffAltitude)) ? Number(takeoffAltitude) : 20;

  if (type === "waypoint") {
    return {
      type,
      name: "Waypoint",
      latitude_deg: latitude,
      longitude_deg: longitude,
      altitude_m: mapAltitude,
      hold_time_s: 0,
    };
  }

  if (type === "hold") {
    return {
      type,
      name: "Hold",
      latitude_deg: "",
      longitude_deg: "",
      altitude_m: "",
      hold_time_s: 5,
    };
  }

  if (type === "takeoff") {
    return {
      type,
      name: "Takeoff",
      latitude_deg: "",
      longitude_deg: "",
      display_latitude_deg: actionLatitude,
      display_longitude_deg: actionLongitude,
      altitude_m: mapAltitude,
      hold_time_s: 0,
    };
  }

  if (type === "land") {
    return {
      type,
      name: "Land",
      latitude_deg: "",
      longitude_deg: "",
      altitude_m: "",
      hold_time_s: 0,
    };
  }

  if (type === "changeSettings") {
    return {
      type,
      name: "Change Settings",
      latitude_deg: "",
      longitude_deg: "",
      altitude_m: "",
      hold_time_s: 0,
      reset_all: false,
      horizontal_velocity_m_s: "",
      vertical_velocity_m_s: "",
      max_heading_rate_deg_s: "",
    };
  }

  if (type === "pickup") {
    return {
      type,
      name: "Pickup",
      latitude_deg: "",
      longitude_deg: "",
      altitude_m: "",
      hold_time_s: 0,
      custom_json: "{}",
    };
  }

  if (type === "servoPulse") {
    return {
      type,
      name: "Servo Pulse",
      latitude_deg: "",
      longitude_deg: "",
      altitude_m: "",
      hold_time_s: 0,
      servo_channel: 1,
      servo_pwm_on_us: 1900,
      servo_pwm_off_us: 1500,
      servo_period_s: 0.5,
      servo_on_duration_s: 0.2,
    };
  }

  if (type === "customAction") {
    return {
      type,
      name: "Custom Action",
      latitude_deg: "",
      longitude_deg: "",
      altitude_m: "",
      hold_time_s: 0,
      custom_type: "customAction",
      custom_json: "{}",
    };
  }

  if (type === "rtl") {
    return {
      type,
      name: "RTL",
      latitude_deg: "",
      longitude_deg: "",
      display_latitude_deg: actionLatitude,
      display_longitude_deg: actionLongitude,
      altitude_m: "",
      hold_time_s: 0,
    };
  }

  return {
    type,
    name: type.toUpperCase(),
    latitude_deg: "",
    longitude_deg: "",
    altitude_m: "",
    hold_time_s: 0,
  };
}

function missionPayload(name, defaults, items) {
  return {
    mission: {
      name,
      defaults: {
        horizontal_velocity_m_s: Number(defaults.horizontal_velocity_m_s),
        vertical_velocity_m_s: Number(defaults.vertical_velocity_m_s),
        max_heading_rate_deg_s: Number(defaults.max_heading_rate_deg_s),
      },
      items: items.map((item) => ({
        type: item.type,
        name: item.name,
        latitude_deg: normalizeNumber(item.latitude_deg),
        longitude_deg: normalizeNumber(item.longitude_deg),
        altitude_m: normalizeNumber(item.altitude_m),
        hold_time_s: Number(item.hold_time_s || 0),
        reset_all: Boolean(item.reset_all),
        horizontal_velocity_m_s: normalizeNumber(item.horizontal_velocity_m_s),
        vertical_velocity_m_s: normalizeNumber(item.vertical_velocity_m_s),
        max_heading_rate_deg_s: normalizeNumber(item.max_heading_rate_deg_s),
        servo_channel: Number(item.servo_channel || 1),
        servo_pwm_on_us: Number(item.servo_pwm_on_us || 1900),
        servo_pwm_off_us: Number(item.servo_pwm_off_us || 1500),
        servo_period_s: Number(item.servo_period_s || 0.5),
        servo_on_duration_s: Number(item.servo_on_duration_s || 0.2),
        custom_type: item.custom_type || "customAction",
        custom_json: item.custom_json || "{}",
      })),
    },
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail ?? "Request failed");
  }
  return data;
}

function Icon({ name, className = "", ...props }) {
  return <span className={`material-symbols-rounded select-none ${className}`} {...props}>{name}</span>;
}

function GlassButton({ icon, label, tone = "zinc", disabled = false, onClick, className = "" }) {
  const toneMap = {
    zinc: "border-white/10 bg-white/10 text-zinc-100 hover:bg-white/20",
    cyan: "border-cyan-300/30 bg-cyan-400/15 text-cyan-50 hover:bg-cyan-400/25",
    emerald: "border-emerald-300/30 bg-emerald-400/15 text-emerald-50 hover:bg-emerald-400/25",
    amber: "border-amber-300/30 bg-amber-400/15 text-amber-50 hover:bg-amber-400/25",
    rose: "border-rose-300/30 bg-rose-400/15 text-rose-50 hover:bg-rose-400/25",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold leading-tight text-center transition disabled:cursor-not-allowed disabled:opacity-40 ${toneMap[tone]} ${className}`}
    >
      {icon ? <Icon name={icon} className="shrink-0 text-[20px]" /> : null}
      {label ? <span className="min-w-0 whitespace-normal break-words">{label}</span> : null}
    </button>
  );
}

function MiniIconButton({ icon, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      title={label}
      disabled={disabled}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-zinc-950/80 text-zinc-100 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon name={icon} className="text-[21px]" />
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

const MissionMap = memo(function MissionMap({
  status,
  missionItems,
  selectedIndex,
  activeMapPickIndex,
  flightTrack,
  onSelectItem,
  onUpdateWaypointFromMap,
  onClearMapPick,
  onClearFlightTrack,
}) {
  const mountRef = useRef(null);
  const canvasHostRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const tileGroupRef = useRef(null);
  const objectGroupRef = useRef(null);
  const helperGroupRef = useRef(null);
  const droneGroupRef = useRef(null);
  const droneVisualRef = useRef({
    group: null,
    disk: null,
    ring: null,
    tower: null,
    arrow: null,
    label: null,
    labelKey: "",
    towerHeightM: null,
    targetPosition: new THREE.Vector3(),
    currentPosition: new THREE.Vector3(),
    targetHeadingRad: 0,
    currentHeadingRad: 0,
    visible: false,
    initialized: false,
    lastTimestampMs: null,
    forceSnap: false,
  });
  const trackGroupRef = useRef(null);
  const animationFrameRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const textureLoaderRef = useRef(null);
  const raycasterRef = useRef(null);
  const pointerRef = useRef({
    mode: "idle",
    pointerId: null,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    moved: false,
    selectedIndex: null,
    draftCoordinate: null,
    dragOffsetX: 0,
    dragOffsetZ: 0,
    startAltitudeM: 0,
    dragGesture: null,
  });
  const cameraControlRef = useRef({ azimuth: -2.35, elevation: 0.82, distance: 210, target: new THREE.Vector3(0, 0, 0) });
  const currentBaseCoordinateRef = useRef(DEFAULT_MAP_CENTER);
  const baseInitializedRef = useRef(false);
  const homeCoordinateRef = useRef(null);
  const missionObjectByIndexRef = useRef(new Map());
  const missionLineRef = useRef(null);
  const tileBuildKeyRef = useRef("");
  const markerPositionsRef = useRef([]);
  const hoveredMissionIndexRef = useRef(null);
  const activeInfoSpriteIndexRef = useRef(null);
  const activeInfoSpriteSignatureRef = useRef("");
  const [sceneBaseCoordinate, setSceneBaseCoordinate] = useState(DEFAULT_MAP_CENTER);
  const [sceneReadyVersion, setSceneReadyVersion] = useState(0);
  const [overlayAnchor, setOverlayAnchor] = useState({ left: 24, top: 24, visible: false, source: "none" });
  const livePosition = getLivePosition(status);
  const droneTelemetry = getDroneTelemetry(status);
  const hasLivePosition = hasValidCoordinate(livePosition.latitude_deg, livePosition.longitude_deg);
  const detectedHomeCoordinate = getHomeCoordinate(status, null);
  if (detectedHomeCoordinate) {
    homeCoordinateRef.current = detectedHomeCoordinate;
  } else if (!homeCoordinateRef.current && hasLivePosition) {
    homeCoordinateRef.current = getHomeCoordinate(status, livePosition);
  }
  const homeCoordinate = homeCoordinateRef.current ?? detectedHomeCoordinate;
  const activeMapPickItem = Number.isInteger(activeMapPickIndex) ? missionItems[activeMapPickIndex] : null;
  const hasActiveMapPick = itemCanUseMapCoordinate(activeMapPickItem);
  const tileZoom = 18;
  const missionAltitudeOffsetM = getMissionVisualAltitudeOffsetM(status);
  const missionAltitudeOffsetActive = Math.abs(missionAltitudeOffsetM) >= 0.005;
  const currentMissionItemIndex = getCurrentMissionItemIndex(status);
  const activeMissionDisplayIndex = getActiveMissionDisplayIndex(missionItems, currentMissionItemIndex);
  const currentMissionActionLabel = getCurrentMissionActionLabel(status, missionItems, currentMissionItemIndex);

  useEffect(() => {
    if (baseInitializedRef.current) {
      return;
    }

    const firstMissionCoordinate = missionItems.find((item) => hasValidCoordinate(item.latitude_deg, item.longitude_deg));
    const anchor = hasLivePosition
      ? { latitude_deg: Number(livePosition.latitude_deg), longitude_deg: Number(livePosition.longitude_deg) }
      : (firstMissionCoordinate ? { latitude_deg: Number(firstMissionCoordinate.latitude_deg), longitude_deg: Number(firstMissionCoordinate.longitude_deg) } : null);

    if (!anchor) {
      return;
    }

    baseInitializedRef.current = true;
    currentBaseCoordinateRef.current = anchor;
    setSceneBaseCoordinate(anchor);
  }, [missionItems, hasLivePosition, livePosition.latitude_deg, livePosition.longitude_deg]);

  function setOverlayAnchorSafe(nextAnchor) {
    setOverlayAnchor((previous) => {
      const left = Math.round(Number(nextAnchor.left) || 0);
      const top = Math.round(Number(nextAnchor.top) || 0);
      const visible = Boolean(nextAnchor.visible);
      const source = nextAnchor.source || "marker";
      if (previous.left === left && previous.top === top && previous.visible === visible && previous.source === source) {
        return previous;
      }
      return { left, top, visible, source };
    });
  }

  function clampOverlayPosition(localLeft, localTop) {
    const mount = mountRef.current;
    if (!mount) {
      return { left: localLeft, top: localTop, visible: false };
    }
    const overlayWidth = 310;
    const overlayHeight = 138;
    return {
      left: clamp(localLeft, 12, Math.max(12, mount.clientWidth - overlayWidth - 12)),
      top: clamp(localTop, 12, Math.max(12, mount.clientHeight - overlayHeight - 12)),
      visible: true,
    };
  }

  function setOverlayAnchorFromCursor(event) {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }
    const rect = mount.getBoundingClientRect();
    const next = clampOverlayPosition(event.clientX - rect.left + 18, event.clientY - rect.top + 18);
    setOverlayAnchorSafe({ ...next, source: "cursor" });
  }

  function setOverlayAnchorFromMarker(index = selectedIndex) {
    const mount = mountRef.current;
    const camera = cameraRef.current;
    const entry = missionObjectByIndexRef.current.get(index);
    if (!mount || !camera || !entry) {
      setOverlayAnchorSafe({ left: 24, top: 24, visible: false, source: "marker" });
      return;
    }
    const rect = mount.getBoundingClientRect();
    const worldPosition = new THREE.Vector3();
    entry.group.getWorldPosition(worldPosition);
    const projected = worldPosition.clone().project(camera);
    if (projected.z < -1 || projected.z > 1) {
      setOverlayAnchorSafe({ left: 24, top: 24, visible: false, source: "marker" });
      return;
    }
    const screenX = ((projected.x + 1) / 2) * rect.width;
    const screenY = ((-projected.y + 1) / 2) * rect.height;
    const next = clampOverlayPosition(screenX + 18, screenY - 54);
    setOverlayAnchorSafe({ ...next, source: "marker" });
  }


  function updateCameraView() {
    const camera = cameraRef.current;
    if (!camera) {
      return;
    }

    const control = cameraControlRef.current;
    control.elevation = clamp(control.elevation, 0.18, 1.45);
    control.distance = clamp(control.distance, 18, 1200);
    const horizontalRadius = Math.cos(control.elevation) * control.distance;
    camera.position.set(
      control.target.x + Math.cos(control.azimuth) * horizontalRadius,
      control.target.y + Math.sin(control.elevation) * control.distance,
      control.target.z + Math.sin(control.azimuth) * horizontalRadius,
    );
    camera.lookAt(control.target);
  }

  function setCameraTarget(target, nextDistance = null) {
    cameraControlRef.current.target.copy(target);
    if (Number.isFinite(Number(nextDistance))) {
      cameraControlRef.current.distance = Number(nextDistance);
    }
    updateCameraView();
  }

  function zoomThreeCamera(delta) {
    cameraControlRef.current.distance = clamp(cameraControlRef.current.distance + delta, 18, 1200);
    updateCameraView();
  }

  function resetThreeCamera() {
    cameraControlRef.current.azimuth = -2.35;
    cameraControlRef.current.elevation = 0.82;
    cameraControlRef.current.distance = 210;
    updateCameraView();
  }

  function clearDroneVisual() {
    const droneGroup = droneGroupRef.current;
    const droneVisual = droneVisualRef.current;
    if (droneGroup) {
      droneGroup.children.forEach((child) => disposeThreeObject(child));
      droneGroup.clear();
    }
    droneVisual.group = null;
    droneVisual.disk = null;
    droneVisual.ring = null;
    droneVisual.tower = null;
    droneVisual.arrow = null;
    droneVisual.label = null;
    droneVisual.labelKey = "";
    droneVisual.towerHeightM = null;
    droneVisual.visible = false;
    droneVisual.initialized = false;
    droneVisual.lastTimestampMs = null;
  }

  function ensureDroneVisual() {
    const droneGroup = droneGroupRef.current;
    const droneVisual = droneVisualRef.current;
    if (!droneGroup) {
      return null;
    }
    if (droneVisual.group && droneGroup.children.includes(droneVisual.group)) {
      return droneVisual.group;
    }

    droneGroup.children.forEach((child) => disposeThreeObject(child));
    droneGroup.clear();

    const visualGroup = new THREE.Group();
    visualGroup.visible = false;
    droneGroup.add(visualGroup);

    const droneMaterial = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2, metalness: 0.22, emissive: 0x10b981, emissiveIntensity: 0.68 });
    const droneDisk = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.54, 42), droneMaterial);
    visualGroup.add(droneDisk);

    const droneRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.075, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.82 }),
    );
    droneRing.rotation.x = Math.PI / 2;
    visualGroup.add(droneRing);

    const headingVector = new THREE.Vector3(0, 0, -1);
    const arrow = new THREE.ArrowHelper(headingVector, new THREE.Vector3(0, 0.76, 0), 4.5, 0xf0fdf4, 1.25, 0.72);
    visualGroup.add(arrow);

    droneVisual.group = visualGroup;
    droneVisual.disk = droneDisk;
    droneVisual.ring = droneRing;
    droneVisual.arrow = arrow;
    droneVisual.tower = null;
    droneVisual.label = null;
    droneVisual.labelKey = "";
    droneVisual.towerHeightM = null;
    return visualGroup;
  }

  function updateDroneTower(altitudeM) {
    const droneVisual = droneVisualRef.current;
    const visualGroup = droneVisual.group;
    if (!visualGroup) {
      return;
    }

    const heightM = Math.max(0, Number(altitudeM) || 0);
    if (heightM <= 1.2) {
      if (droneVisual.tower) {
        droneVisual.tower.visible = false;
      }
      droneVisual.towerHeightM = heightM;
      return;
    }

    if (!droneVisual.tower) {
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.095, 0.095, 1, 8),
        new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.30 }),
      );
      visualGroup.add(tower);
      droneVisual.tower = tower;
    }

    droneVisual.tower.visible = true;
    droneVisual.tower.scale.set(1, heightM, 1);
    droneVisual.tower.position.set(0, -heightM / 2, 0);
    droneVisual.towerHeightM = heightM;
  }


  function updateDroneLabel(altitudeM) {
    const droneVisual = droneVisualRef.current;
    const visualGroup = droneVisual.group;
    if (!visualGroup) {
      return;
    }

    const labelKey = formatAltitudeLabel(altitudeM);
    if (droneVisual.label && droneVisual.labelKey === labelKey) {
      droneVisual.label.position.set(0, 3.8, 0);
      return;
    }

    if (droneVisual.label) {
      visualGroup.remove(droneVisual.label);
      disposeThreeObject(droneVisual.label);
      droneVisual.label = null;
    }

    const droneLabel = createTextSprite(THREE, `UAV\n${labelKey}`, {
      color: "#ecfdf5",
      subColor: "#bbf7d0",
      background: "rgba(2, 6, 23, 0.92)",
      border: "rgba(134,239,172,0.82)",
      scale: 0.056,
      fontSize: 32,
    });
    droneLabel.position.set(0, 3.8, 0);
    visualGroup.add(droneLabel);
    droneVisual.label = droneLabel;
    droneVisual.labelKey = labelKey;
  }

  function updateDroneAnimatedFrame(timestampMs) {
    const droneVisual = droneVisualRef.current;
    const visualGroup = droneVisual.group;
    if (!visualGroup) {
      return;
    }

    if (!droneVisual.visible) {
      visualGroup.visible = false;
      droneVisual.lastTimestampMs = timestampMs;
      return;
    }

    visualGroup.visible = true;
    const previousTimestampMs = Number.isFinite(droneVisual.lastTimestampMs) ? droneVisual.lastTimestampMs : timestampMs;
    const dtSec = clamp((timestampMs - previousTimestampMs) / 1000, 0.001, 0.12);
    droneVisual.lastTimestampMs = timestampMs;

    const distanceToTarget = droneVisual.currentPosition.distanceTo(droneVisual.targetPosition);
    if (!droneVisual.initialized || droneVisual.forceSnap || distanceToTarget > 160) {
      droneVisual.currentPosition.copy(droneVisual.targetPosition);
      droneVisual.currentHeadingRad = droneVisual.targetHeadingRad;
      droneVisual.initialized = true;
      droneVisual.forceSnap = false;
    } else {
      const positionAlpha = 1 - Math.exp(-7.5 * dtSec);
      const headingAlpha = 1 - Math.exp(-10.0 * dtSec);
      droneVisual.currentPosition.lerp(droneVisual.targetPosition, positionAlpha);
      if (distanceToTarget < 0.012) {
        droneVisual.currentPosition.copy(droneVisual.targetPosition);
      }
      const headingError = Math.atan2(
        Math.sin(droneVisual.targetHeadingRad - droneVisual.currentHeadingRad),
        Math.cos(droneVisual.targetHeadingRad - droneVisual.currentHeadingRad),
      );
      droneVisual.currentHeadingRad += headingError * headingAlpha;
    }

    visualGroup.position.copy(droneVisual.currentPosition);
    const headingVector = new THREE.Vector3(Math.sin(droneVisual.currentHeadingRad), 0, -Math.cos(droneVisual.currentHeadingRad)).normalize();
    if (droneVisual.arrow?.setDirection) {
      droneVisual.arrow.setDirection(headingVector);
    }

    const smoothAltitudeM = Math.max(0.65, droneVisual.currentPosition.y);
    updateDroneTower(smoothAltitudeM);
  }

  function resizeThreeRenderer() {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) {
      return;
    }
    const width = Math.max(320, mountRef.current.clientWidth);
    const height = Math.max(360, mountRef.current.clientHeight);
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height, false);
  }

  function screenPointToGround(event) {
    if (!mountRef.current || !cameraRef.current || !raycasterRef.current) {
      return null;
    }
    const rect = mountRef.current.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    raycasterRef.current.setFromCamera(pointer, cameraRef.current);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    const hit = raycasterRef.current.ray.intersectPlane(groundPlane, point);
    return hit ? point : null;
  }

  function getInteractiveUserData(object) {
    let cursor = object;
    while (cursor) {
      if (Number.isInteger(cursor.userData?.index)) {
        return cursor.userData;
      }
      cursor = cursor.parent;
    }
    return null;
  }

  function screenPointToMissionMarker(event) {
    if (!mountRef.current || !cameraRef.current || !raycasterRef.current || !objectGroupRef.current) {
      return null;
    }
    const rect = mountRef.current.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    raycasterRef.current.setFromCamera(pointer, cameraRef.current);
    const hits = raycasterRef.current.intersectObjects(objectGroupRef.current.children, true);
    for (const hit of hits) {
      const userData = getInteractiveUserData(hit.object);
      if (userData) {
        return { hit, userData };
      }
    }
    return null;
  }

  function updateMissionCoordinateFromGround(index, groundPoint, options = {}) {
    if (!groundPoint || !Number.isInteger(index)) {
      return;
    }
    const coordinate = sceneMetersToCoordinate(groundPoint.x, groundPoint.z, currentBaseCoordinateRef.current);
    onUpdateWaypointFromMap(index, coordinate.latitude_deg, coordinate.longitude_deg, options);
  }

  function redrawMissionLineFromCurrentMarkers() {
    const line = missionLineRef.current;
    if (!line) {
      return;
    }

    const points = markerPositionsRef.current.map((marker) => new THREE.Vector3(marker.x, marker.y, marker.z));
    if (points.length <= 1) {
      return;
    }

    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.05);
    line.geometry.dispose();
    line.geometry = new THREE.TubeGeometry(
      curve,
      Math.max(2, points.length * 12),
      MISSION_PATH_LINE_THICKNESS_M,
      8,
      false,
    );
  }

  function buildMissionInfoData(index, override = {}) {
    if (!Number.isInteger(index)) {
      return null;
    }

    const entry = missionObjectByIndexRef.current.get(index);
    const item = missionItems[index];
    if (!entry || !item || !itemCanInteractOnMap(item)) {
      return null;
    }

    const coordinate = Number.isFinite(Number(override.latitude_deg)) && Number.isFinite(Number(override.longitude_deg))
      ? { latitude_deg: Number(override.latitude_deg), longitude_deg: Number(override.longitude_deg) }
      : sceneMetersToCoordinate(entry.group.position.x, entry.group.position.z, currentBaseCoordinateRef.current);

    const altitudeM = Number.isFinite(Number(override.altitude_m))
      ? Number(override.altitude_m)
      : (Number.isFinite(Number(item.altitude_m)) ? Number(item.altitude_m) : Number(entry.altitudeY || 0));

    return {
      index,
      name: entry.markerInfo?.label || item.name || item.type || `Step ${index + 1}`,
      latitude_deg: coordinate.latitude_deg,
      longitude_deg: coordinate.longitude_deg,
      altitude_m: altitudeM,
      dragMode: override.dragMode || "hover",
    };
  }

  function hideMissionInfoSprite(index = activeInfoSpriteIndexRef.current) {
    if (!Number.isInteger(index)) {
      return;
    }

    const entry = missionObjectByIndexRef.current.get(index);
    if (entry?.infoSprite) {
      entry.group.remove(entry.infoSprite);
      disposeThreeObject(entry.infoSprite);
      entry.infoSprite = null;
    }

    if (activeInfoSpriteIndexRef.current === index) {
      activeInfoSpriteIndexRef.current = null;
      activeInfoSpriteSignatureRef.current = "";
    }
  }

  function showMissionInfoSprite(index, infoData, mode = "hover") {
    const entry = missionObjectByIndexRef.current.get(index);
    if (!entry || !infoData) {
      return;
    }

    const text = [
      `${infoData.name}  #${index + 1}`,
      `Lat ${formatCoordinate(infoData.latitude_deg)}`,
      `Lon ${formatCoordinate(infoData.longitude_deg)}`,
      `Alt ${formatAltitudeLabel(infoData.altitude_m)}`,
    ].join("\n");
    const signature = `${index}|${mode}|${text}`;

    if (activeInfoSpriteIndexRef.current !== index) {
      hideMissionInfoSprite(activeInfoSpriteIndexRef.current);
    }

    if (entry.infoSprite && activeInfoSpriteSignatureRef.current === signature) {
      return;
    }

    hideMissionInfoSprite(index);

    const sprite = createTextSprite(THREE, text, {
      color: mode === "drag" ? "#fef3c7" : "#ecfeff",
      subColor: "#dbeafe",
      background: mode === "drag" ? "rgba(20, 16, 4, 0.76)" : "rgba(2, 6, 23, 0.72)",
      border: mode === "drag" ? "rgba(251, 191, 36, 0.55)" : "rgba(34, 211, 238, 0.34)",
      scale: 0.032,
      fontSize: 30,
    });
    sprite.position.set(0, 5.2, 0);
    sprite.renderOrder = 30;
    sprite.userData = { type: "mission-info", index };
    entry.infoSprite = sprite;
    entry.group.add(sprite);

    activeInfoSpriteIndexRef.current = index;
    activeInfoSpriteSignatureRef.current = signature;
  }

  function updateHoverMissionInfo(event) {
    const pointer = pointerRef.current;
    if (pointer.mode !== "idle") {
      return;
    }

    const markerHit = screenPointToMissionMarker(event);
    const nextIndex = Number.isInteger(markerHit?.userData?.index) ? markerHit.userData.index : null;
    const item = Number.isInteger(nextIndex) ? missionItems[nextIndex] : null;

    if (!Number.isInteger(nextIndex) || !itemCanInteractOnMap(item)) {
      if (Number.isInteger(hoveredMissionIndexRef.current)) {
        hideMissionInfoSprite(hoveredMissionIndexRef.current);
      }
      hoveredMissionIndexRef.current = null;
      return;
    }

    hoveredMissionIndexRef.current = nextIndex;
    showMissionInfoSprite(nextIndex, buildMissionInfoData(nextIndex), "hover");
  }

  function previewMissionCoordinateFromGround(index, groundPoint, dragMode = "xy") {
    if (!groundPoint || !Number.isInteger(index)) {
      return null;
    }

    const entry = missionObjectByIndexRef.current.get(index);
    const markerInfo = markerPositionsRef.current.find((marker) => marker.index === index);
    if (!entry || !markerInfo) {
      return null;
    }

    entry.group.position.x = groundPoint.x;
    entry.group.position.z = groundPoint.z;
    markerInfo.x = groundPoint.x;
    markerInfo.z = groundPoint.z;
    redrawMissionLineFromCurrentMarkers();

    const coordinate = sceneMetersToCoordinate(groundPoint.x, groundPoint.z, currentBaseCoordinateRef.current);
    const item = missionItems[index];
    const overlay = {
      index,
      name: item?.name || item?.type || `Step ${index + 1}`,
      latitude_deg: coordinate.latitude_deg,
      longitude_deg: coordinate.longitude_deg,
      altitude_m: item?.altitude_m,
      dragMode,
    };
    showMissionInfoSprite(index, overlay, "drag");
    return overlay;
  }

  function previewMissionAltitude(index, altitudeM, dragMode = "altitude") {
    if (!Number.isInteger(index) || !Number.isFinite(Number(altitudeM))) {
      return null;
    }

    const entry = missionObjectByIndexRef.current.get(index);
    const markerInfo = markerPositionsRef.current.find((marker) => marker.index === index);
    if (!entry || !markerInfo) {
      return null;
    }

    const nextAltitude = clamp(Number(altitudeM), 0, 500);
    const nextY = Math.max(0.65, nextAltitude);
    entry.group.position.y = nextY;
    entry.altitudeY = nextY;
    markerInfo.y = nextY;
    redrawMissionLineFromCurrentMarkers();

    const coordinate = sceneMetersToCoordinate(entry.group.position.x, entry.group.position.z, currentBaseCoordinateRef.current);
    const item = missionItems[index];
    const overlay = {
      index,
      name: item?.name || item?.type || `Step ${index + 1}`,
      latitude_deg: coordinate.latitude_deg,
      longitude_deg: coordinate.longitude_deg,
      altitude_m: Number(nextAltitude.toFixed(2)),
      dragMode,
    };
    showMissionInfoSprite(index, overlay, "drag");
    return overlay;
  }

  useEffect(() => {
    if (!mountRef.current || !canvasHostRef.current) {
      return undefined;
    }

    const mount = mountRef.current;
    const canvasHost = canvasHostRef.current;
    const width = Math.max(320, mount.clientWidth);
    const height = Math.max(360, mount.clientHeight);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06131a);
    scene.fog = new THREE.Fog(0x06131a, 420, 1300);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2500);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    canvasHost.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xdffbff, 0x0f172a, 1.25);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
    directionalLight.position.set(120, 220, 90);
    scene.add(hemiLight, directionalLight);

    const helperGroup = new THREE.Group();
    const tileGroup = new THREE.Group();
    const objectGroup = new THREE.Group();
    const trackGroup = new THREE.Group();
    const droneGroup = new THREE.Group();
    scene.add(tileGroup, helperGroup, objectGroup, trackGroup, droneGroup);

    const grid = new THREE.GridHelper(520, 52, 0x22d3ee, 0x1e3a48);
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    helperGroup.add(grid);

    const axes = new THREE.AxesHelper(32);
    axes.position.set(-220, 0.6, -220);
    helperGroup.add(axes);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    tileGroupRef.current = tileGroup;
    objectGroupRef.current = objectGroup;
    helperGroupRef.current = helperGroup;
    trackGroupRef.current = trackGroup;
    droneGroupRef.current = droneGroup;
    textureLoaderRef.current = new THREE.TextureLoader();
    textureLoaderRef.current.setCrossOrigin("anonymous");
    raycasterRef.current = new THREE.Raycaster();
    setSceneReadyVersion((version) => version + 1);

    updateCameraView();

    function animate(timestampMs = performance.now()) {
      animationFrameRef.current = window.requestAnimationFrame(animate);
      updateDroneAnimatedFrame(timestampMs);
      renderer.render(scene, camera);
    }
    animate();

    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(() => resizeThreeRenderer());
      resizeObserverRef.current.observe(mount);
    }

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      disposeThreeObject(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === canvasHost) {
        canvasHost.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      tileGroupRef.current = null;
      objectGroupRef.current = null;
      helperGroupRef.current = null;
      trackGroupRef.current = null;
      droneGroupRef.current = null;
      textureLoaderRef.current = null;
      raycasterRef.current = null;
    };
  }, []);

  useEffect(() => {
    const baseCoordinate = sceneBaseCoordinate;
    currentBaseCoordinateRef.current = baseCoordinate;
    const tileGroup = tileGroupRef.current;
    const objectGroup = objectGroupRef.current;
    const textureLoader = textureLoaderRef.current;
    if (!tileGroup || !objectGroup || !textureLoader) {
      return;
    }

    objectGroup.children.forEach((child) => disposeThreeObject(child));
    objectGroup.clear();

    const colorByType = {
      takeoff: 0x34d399,
      waypoint: 0x22d3ee,
      hold: 0xfacc15,
      land: 0xa78bfa,
      rtl: 0xfb7185,
    };

    const tileCoordinates = [baseCoordinate];
    if (hasLivePosition) {
      tileCoordinates.push({
        latitude_deg: Number(livePosition.latitude_deg),
        longitude_deg: Number(livePosition.longitude_deg),
      });
    }
    missionItems.forEach((item, index) => {
      const coordinate = getMissionMarkerCoordinate(item, index, missionItems, livePosition, homeCoordinate);
      if (coordinate && hasValidCoordinate(coordinate.latitude_deg, coordinate.longitude_deg)) {
        tileCoordinates.push(coordinate);
      }
    });

    const tileWorlds = tileCoordinates.map((coordinate) => latLonToWorld(coordinate.latitude_deg, coordinate.longitude_deg, tileZoom));
    const centerWorld = latLonToWorld(baseCoordinate.latitude_deg, baseCoordinate.longitude_deg, tileZoom);
    const rawMinTileX = Math.floor(Math.min(...tileWorlds.map((point) => point.x)) / TILE_SIZE) - 2;
    const rawMaxTileX = Math.floor(Math.max(...tileWorlds.map((point) => point.x)) / TILE_SIZE) + 2;
    const rawMinTileY = Math.floor(Math.min(...tileWorlds.map((point) => point.y)) / TILE_SIZE) - 2;
    const rawMaxTileY = Math.floor(Math.max(...tileWorlds.map((point) => point.y)) / TILE_SIZE) + 2;
    const centerTileX = Math.floor(centerWorld.x / TILE_SIZE);
    const centerTileY = Math.floor(centerWorld.y / TILE_SIZE);
    const minTileX = clamp(rawMinTileX, centerTileX - 4, centerTileX + 4);
    const maxTileX = clamp(rawMaxTileX, centerTileX - 4, centerTileX + 4);
    const minTileY = clamp(rawMinTileY, centerTileY - 4, centerTileY + 4);
    const maxTileY = clamp(rawMaxTileY, centerTileY - 4, centerTileY + 4);
    const tileCount = 2 ** tileZoom;
    const tileBuildKey = `${tileZoom}:${minTileX}:${maxTileX}:${minTileY}:${maxTileY}:${baseCoordinate.latitude_deg.toFixed(7)}:${baseCoordinate.longitude_deg.toFixed(7)}`;

    if (tileBuildKeyRef.current !== tileBuildKey) {
      tileBuildKeyRef.current = tileBuildKey;
      tileGroup.children.forEach((child) => disposeThreeObject(child));
      tileGroup.clear();

      for (let x = minTileX; x <= maxTileX; x += 1) {
      for (let y = minTileY; y <= maxTileY; y += 1) {
        if (y < 0 || y >= tileCount) {
          continue;
        }
        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        const topLeft = worldToLatLon(x * TILE_SIZE, y * TILE_SIZE, tileZoom);
        const bottomRight = worldToLatLon((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE, tileZoom);
        const sceneTopLeft = coordinateToSceneMeters(topLeft, baseCoordinate);
        const sceneBottomRight = coordinateToSceneMeters(bottomRight, baseCoordinate);
        const widthM = Math.max(1, Math.abs(sceneBottomRight.x - sceneTopLeft.x));
        const depthM = Math.max(1, Math.abs(sceneBottomRight.z - sceneTopLeft.z));
        const texture = textureLoader.load(buildMapTileUrl(tileZoom, wrappedX, y));
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: false, toneMapped: false });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(widthM, depthM), material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set((sceneTopLeft.x + sceneBottomRight.x) / 2, -0.04, (sceneTopLeft.z + sceneBottomRight.z) / 2);
        tileGroup.add(plane);
      }
    }

    const groundFallback = new THREE.Mesh(
      new THREE.PlaneGeometry(900, 900),
      new THREE.MeshBasicMaterial({ color: 0x0b1720, transparent: true, opacity: 0.42 }),
    );
      groundFallback.rotation.x = -Math.PI / 2;
      groundFallback.position.y = -0.08;
      tileGroup.add(groundFallback);
    }

    const markerPositions = [];
    let waypointOrder = 0;
    const nextMissionObjects = new Map();
    const { summaryByWaypointIndex, parentByActionIndex } = buildWaypointActionSummary(missionItems);

    function addGroundActionBadge(actionIndex, coordinate, kind, parentLocal = null) {
      if (!coordinate || !hasValidCoordinate(coordinate.latitude_deg, coordinate.longitude_deg)) {
        return;
      }
      const local = parentLocal ?? coordinateToSceneMeters(coordinate, baseCoordinate);
      const isActiveRuntimeItem = currentMissionItemIndex === actionIndex || activeMissionDisplayIndex === actionIndex;
      const isSelected = selectedIndex === actionIndex || isActiveRuntimeItem;
      const item = missionItems[actionIndex];
      const badgeGroup = new THREE.Group();
      badgeGroup.position.set(local.x, 0.92, local.z);
      badgeGroup.userData = { type: "mission", index: actionIndex, altitudeY: 0.92 };
      objectGroup.add(badgeGroup);

      const isLand = kind === "land";
      const badge = createCircleActionSprite(THREE, isLand ? "↓" : "↩", {
        background: isLand ? "rgba(76, 29, 149, 0.94)" : "rgba(136, 19, 55, 0.94)",
        border: isSelected ? "rgba(255,255,255,0.96)" : (isLand ? "rgba(221,214,254,0.78)" : "rgba(254,205,211,0.78)"),
        color: "#ffffff",
        scale: 0.030,
        fontSize: isLand ? 72 : 66,
      });
      badge.userData = { type: "mission", index: actionIndex };
      badge.renderOrder = 45;
      badgeGroup.add(badge);

      if (isSelected) {
        const selectedDisk = new THREE.Mesh(
          new THREE.CylinderGeometry(2.85, 2.85, 0.05, 48),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthTest: false }),
        );
        selectedDisk.position.y = -0.42;
        selectedDisk.userData = { type: "mission", index: actionIndex };
        badgeGroup.add(selectedDisk);
      }

      nextMissionObjects.set(actionIndex, {
        group: badgeGroup,
        altitudeY: 0.92,
        markerInfo: { x: local.x, y: 0.92, z: local.z, index: actionIndex, item, label: MISSION_LABEL[item?.type] ?? kind.toUpperCase(), waypointOrder },
        infoSprite: null,
      });
    }

    missionItems.forEach((item, index) => {
      if (item.type === "hold" || item.type === "land") {
        return;
      }

      if (item.type === "waypoint") {
        waypointOrder += 1;
      }
      const coordinate = getMissionMarkerCoordinate(item, index, missionItems, livePosition, homeCoordinate);
      if (!coordinate || !hasValidCoordinate(coordinate.latitude_deg, coordinate.longitude_deg)) {
        return;
      }
      const local = coordinateToSceneMeters(coordinate, baseCoordinate);

      if (item.type === "rtl") {
        addGroundActionBadge(index, coordinate, "rtl", local);
        markerPositions.push({ x: local.x, y: 0.92, z: local.z, index, item, label: "RTL", waypointOrder });
        return;
      }

      const baseAltitudeM = getBaseVisualAltitudeM(item, livePosition);
      let altitudeM = getVisualAltitudeM(item, livePosition, missionAltitudeOffsetM);
      if (item.type === "takeoff") {
        altitudeM = Number.isFinite(Number(item.altitude_m)) ? Math.max(0, Number(item.altitude_m)) : 0;
      }
      const altitudeY = Math.max(0.65, altitudeM);
      const attachedSummary = summaryByWaypointIndex.get(index);
      const attachedActionSelected = parentByActionIndex.get(selectedIndex) === index;
      const isActiveRuntimeItem = activeMissionDisplayIndex === index;
      const waypointHasHold = Boolean(item.type === "waypoint" && attachedSummary?.hasHold);
      const waypointHasLand = Boolean(item.type === "waypoint" && attachedSummary?.hasLand);
      const label = item.type === "waypoint" ? `WP${waypointOrder}` : MISSION_LABEL[item.type] ?? item.type.toUpperCase();
      const labelAltitudeText = item.type === "takeoff" && Number.isFinite(Number(item.altitude_m))
        ? `target ${formatAltitudeLabel(item.altitude_m)}`
        : (item.type === "waypoint" && missionAltitudeOffsetActive
          ? `${formatAltitudeLabel(altitudeM)} (${missionAltitudeOffsetM > 0 ? "+" : ""}${missionAltitudeOffsetM.toFixed(1)} m)`
          : formatAltitudeLabel(altitudeM));
      let color = colorByType[item.type] ?? colorByType.waypoint;
      if (item.type === "waypoint") {
        if (waypointHasHold && waypointHasLand) {
          color = 0xfb923c;
        } else if (waypointHasHold) {
          color = 0xfacc15;
        } else if (waypointHasLand) {
          color = 0xa78bfa;
        }
      }
      const isSelected = selectedIndex === index || attachedActionSelected;
      const isHighlighted = isSelected || index === activeMapPickIndex || isActiveRuntimeItem;
      const radius = item.type === "takeoff" ? 1.22 : (isActiveRuntimeItem ? 1.22 : 1.05);

      const markerGroup = new THREE.Group();
      markerGroup.position.set(local.x, altitudeY, local.z);
      markerGroup.userData = { type: "mission", index, altitudeY };
      objectGroup.add(markerGroup);

      const markerMaterial = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.28,
        metalness: 0.16,
        emissive: color,
        emissiveIntensity: isActiveRuntimeItem ? ACTIVE_MISSION_MARKER_EMISSIVE_INTENSITY : (isSelected || index === activeMapPickIndex ? 0.58 : 0.18),
      });
      const marker = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.46, 36), markerMaterial);
      marker.userData = { type: "mission", index };
      markerGroup.add(marker);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius + (isActiveRuntimeItem ? ACTIVE_MISSION_MARKER_RING_RADIUS_EXTRA_M : 0.30), isActiveRuntimeItem ? 0.085 : 0.055, 8, 42),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: isHighlighted ? 0.98 : 0.55 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.userData = { type: "mission", index };
      markerGroup.add(ring);

      if (altitudeY > 1.2) {
        const tower = new THREE.Mesh(
          new THREE.CylinderGeometry(0.075, 0.075, altitudeY, 8),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.32 }),
        );
        tower.position.set(0, -altitudeY / 2, 0);
        markerGroup.add(tower);
      }

      const labelLines = [`${label}`, `${labelAltitudeText}`];
      if (isActiveRuntimeItem && currentMissionActionLabel) {
        labelLines.push(currentMissionActionLabel);
      }
      if (waypointHasHold) {
        labelLines.push(formatHoldTimeLabel(attachedSummary.totalHoldTimeS));
      }
      if (waypointHasLand) {
        labelLines.push("LAND");
      }
      const waypointActionBackground = waypointHasHold && waypointHasLand
        ? "rgba(251, 146, 60, 0.94)"
        : (waypointHasHold ? "rgba(250, 204, 21, 0.94)" : "rgba(34, 211, 238, 0.94)");
      const labelSprite = createTextSprite(THREE, labelLines.join("\n"), {
        color: item.type === "waypoint" ? "#020617" : "#f8fafc",
        subColor: item.type === "waypoint" ? "#0f172a" : "#e2e8f0",
        background: item.type === "waypoint" ? waypointActionBackground : "rgba(2, 6, 23, 0.88)",
        border: isActiveRuntimeItem ? "rgba(255,255,255,0.98)" : (isSelected || index === activeMapPickIndex ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.24)"),
        scale: 0.056,
        fontSize: 32,
      });
      labelSprite.position.set(0, 3.1, 0);
      labelSprite.userData = { type: "mission", index };
      markerGroup.add(labelSprite);

      if (isActiveRuntimeItem) {
        const activeGlow = new THREE.Mesh(
          new THREE.CylinderGeometry(radius + ACTIVE_MISSION_MARKER_GLOW_RADIUS_EXTRA_M, radius + ACTIVE_MISSION_MARKER_GLOW_RADIUS_EXTRA_M, 0.10, 64),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: ACTIVE_MISSION_MARKER_GLOW_OPACITY, depthTest: false }),
        );
        activeGlow.position.y = -0.40;
        activeGlow.renderOrder = 24;
        activeGlow.userData = { type: "mission", index };
        markerGroup.add(activeGlow);
      }

      if (coordinate.fromFallback) {
        const fallbackDot = new THREE.Mesh(
          new THREE.SphereGeometry(0.36, 12, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff }),
        );
        fallbackDot.position.set(-radius - 0.42, 0.65, -radius - 0.42);
        markerGroup.add(fallbackDot);
      }

      if (isHighlighted && itemCanInteractOnMap(item)) {
        const selectedGlow = new THREE.Mesh(
          new THREE.CylinderGeometry(radius + 0.62, radius + 0.62, 0.08, 48),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14, depthTest: false }),
        );
        selectedGlow.position.y = -0.34;
        selectedGlow.renderOrder = 18;
        selectedGlow.userData = { type: "mission", index };
        markerGroup.add(selectedGlow);
      }

      const markerInfo = { x: local.x, y: altitudeY, z: local.z, index, item, label, waypointOrder };
      markerPositions.push(markerInfo);
      nextMissionObjects.set(index, { group: markerGroup, altitudeY, markerInfo, infoSprite: null });

      if (waypointHasLand) {
        attachedSummary.landItems.forEach((landInfo) => addGroundActionBadge(landInfo.index, coordinate, "land", local));
      }
    });

    missionObjectByIndexRef.current = nextMissionObjects;
    markerPositionsRef.current = markerPositions;
    missionLineRef.current = null;

    if (markerPositions.length > 1) {
      const pathPoints = markerPositions.map((marker) => new THREE.Vector3(marker.x, marker.y, marker.z));
      const lineCurve = new THREE.CatmullRomCurve3(pathPoints, false, "catmullrom", 0.05);
      const lineGeometry = new THREE.TubeGeometry(
        lineCurve,
        Math.max(2, pathPoints.length * 12),
        MISSION_PATH_LINE_THICKNESS_M,
        8,
        false,
      );
      const lineMaterial = new THREE.MeshBasicMaterial({
        color: MISSION_PATH_LINE_COLOR,
        transparent: true,
        opacity: MISSION_PATH_LINE_OPACITY,
        depthWrite: false,
      });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.renderOrder = 8;
      objectGroup.add(line);
      missionLineRef.current = line;
    }


  }, [
    sceneReadyVersion,
    sceneBaseCoordinate,
    missionItems,
    selectedIndex,
    activeMapPickIndex,
    hasLivePosition,
    livePosition.latitude_deg,
    livePosition.longitude_deg,
    livePosition.relative_altitude_m,
    homeCoordinate?.latitude_deg,
    homeCoordinate?.longitude_deg,
    missionAltitudeOffsetM,
    missionAltitudeOffsetActive,
    currentMissionItemIndex,
    activeMissionDisplayIndex,
    currentMissionActionLabel,
  ]);

  useEffect(() => {
    const trackGroup = trackGroupRef.current;
    if (!trackGroup) {
      return;
    }

    trackGroup.children.forEach((child) => disposeThreeObject(child));
    trackGroup.clear();

    const validTrackPoints = (flightTrack ?? [])
      .filter((point) => hasValidCoordinate(point.latitude_deg, point.longitude_deg))
      .map((point) => {
        const local = coordinateToSceneMeters(point, currentBaseCoordinateRef.current);
        const altitudeM = Math.max(0.65, firstFiniteNumber(point.altitude_amsl_m, point.relative_altitude_m) ?? 0.65);
        return new THREE.Vector3(local.x, altitudeM, local.z);
      });

    if (validTrackPoints.length > 1) {
      const trackGeometry = new THREE.BufferGeometry().setFromPoints(validTrackPoints);
      const trackMaterial = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.90 });
      trackGroup.add(new THREE.Line(trackGeometry, trackMaterial));
    }
  }, [sceneReadyVersion, flightTrack]);

  useEffect(() => {
    const droneGroup = droneGroupRef.current;
    const droneVisual = droneVisualRef.current;
    if (!droneGroup) {
      return;
    }

    if (!hasLivePosition) {
      droneVisual.visible = false;
      return;
    }

    const visualGroup = ensureDroneVisual();
    if (!visualGroup) {
      return;
    }

    const local = coordinateToSceneMeters(livePosition, currentBaseCoordinateRef.current);
    const altitudeM = Math.max(0.65, getDroneDisplayAltitudeM(livePosition));
    const headingDeg = Number.isFinite(Number(droneTelemetry.headingDeg)) ? Number(droneTelemetry.headingDeg) : 0;

    droneVisual.visible = true;
    droneVisual.targetPosition.set(local.x, altitudeM, local.z);
    droneVisual.targetHeadingRad = (headingDeg * Math.PI) / 180;

    // Lần đầu hoặc khi map bị rebase thì snap marker vào đúng vị trí mới,
    // sau đó animation loop sẽ nội suy mượt giữa các gói telemetry tiếp theo.
    if (!droneVisual.initialized || droneVisual.currentPosition.distanceTo(droneVisual.targetPosition) > 160) {
      droneVisual.currentPosition.copy(droneVisual.targetPosition);
      droneVisual.currentHeadingRad = droneVisual.targetHeadingRad;
      droneVisual.initialized = true;
      droneVisual.forceSnap = false;
      visualGroup.position.copy(droneVisual.currentPosition);
    }

    updateDroneLabel(altitudeM);
    updateDroneTower(altitudeM);
  }, [
    sceneReadyVersion,
    sceneBaseCoordinate.latitude_deg,
    sceneBaseCoordinate.longitude_deg,
    hasLivePosition,
    livePosition.latitude_deg,
    livePosition.longitude_deg,
    livePosition.relative_altitude_m,
    livePosition.altitude_amsl_m,
    droneTelemetry.headingDeg,
  ]);





  function centerOnLivePosition() {
    if (!hasLivePosition) {
      return;
    }
    const local = coordinateToSceneMeters(livePosition, currentBaseCoordinateRef.current);
    setCameraTarget(new THREE.Vector3(local.x, 0, local.z), 170);
  }

  // Camera is intentionally manual.
  // Live telemetry only moves the UAV marker; it must not force the 3D camera
  // to follow/zoom because that locks the operator out of planning and dragging.

  useEffect(() => {
    if (!hasLivePosition) {
      return;
    }

    // Rebase map tiles if the UAV gets far from the current map origin.
    // This changes only the local coordinate frame/tile origin; it does not
    // move or zoom the 3D camera. Use the Center UAV button for manual centering.
    const oldBase = currentBaseCoordinateRef.current;
    const local = coordinateToSceneMeters(livePosition, oldBase);
    const distanceFromBase = Math.hypot(local.x, local.z);
    if (!baseInitializedRef.current || distanceFromBase > 80) {
      const previousCameraTargetCoordinate = sceneMetersToCoordinate(
        cameraControlRef.current.target.x,
        cameraControlRef.current.target.z,
        oldBase,
      );
      const nextBase = {
        latitude_deg: Number(livePosition.latitude_deg),
        longitude_deg: Number(livePosition.longitude_deg),
      };
      const preservedCameraTarget = coordinateToSceneMeters(previousCameraTargetCoordinate, nextBase);
      baseInitializedRef.current = true;
      currentBaseCoordinateRef.current = nextBase;
      cameraControlRef.current.target.set(preservedCameraTarget.x, cameraControlRef.current.target.y, preservedCameraTarget.z);
      updateCameraView();
      setSceneBaseCoordinate(nextBase);
    }
  }, [hasLivePosition, livePosition.latitude_deg, livePosition.longitude_deg]);

  function fitWaypoints() {
    const points = [...markerPositionsRef.current];
    if (hasLivePosition) {
      const local = coordinateToSceneMeters(livePosition, currentBaseCoordinateRef.current);
      points.push({ x: local.x, y: getDroneDisplayAltitudeM(livePosition), z: local.z });
    }
    if (points.length === 0) {
      resetThreeCamera();
      return;
    }
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minZ = Math.min(...points.map((point) => point.z));
    const maxZ = Math.max(...points.map((point) => point.z));
    const center = new THREE.Vector3((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
    const span = Math.max(maxX - minX, maxZ - minZ, 80);
    setCameraTarget(center, clamp(span * 1.55, 90, 850));
  }

  function handlePointerDown(event) {
    if (event.button !== 0 && event.button !== 1 && event.button !== 2) {
      return;
    }

    const markerHit = event.button === 0 ? screenPointToMissionMarker(event) : null;
    if (markerHit) {
      event.stopPropagation();
      const index = markerHit.userData.index;
      const item = missionItems[index];
      const entry = missionObjectByIndexRef.current.get(index);
      const groundPoint = screenPointToGround(event);
      const canDragMap = itemCanUseMapCoordinate(item);
      const canDragAltitude = itemCanDragAltitude(item);
      const dragMode = canDragMap || canDragAltitude ? "marker-combo-drag" : "marker-select";
      const currentAltitude = Number.isFinite(Number(item?.altitude_m)) ? Number(item.altitude_m) : (entry?.altitudeY ?? 0);

      pointerRef.current = {
        mode: dragMode,
        pointerId: event.pointerId,
        lastX: event.clientX,
        lastY: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        selectedIndex: index,
        draftCoordinate: null,
        dragOffsetX: entry && groundPoint ? entry.group.position.x - groundPoint.x : 0,
        dragOffsetZ: entry && groundPoint ? entry.group.position.z - groundPoint.z : 0,
        startAltitudeM: currentAltitude,
        dragGesture: null,
      };

      if ((canDragMap || canDragAltitude) && entry) {
        hoveredMissionIndexRef.current = index;
        const coordinate = sceneMetersToCoordinate(entry.group.position.x, entry.group.position.z, currentBaseCoordinateRef.current);
        showMissionInfoSprite(index, {
          index,
          name: entry.markerInfo?.label || item?.name || item?.type || `Step ${index + 1}`,
          latitude_deg: coordinate.latitude_deg,
          longitude_deg: coordinate.longitude_deg,
          altitude_m: currentAltitude,
          dragMode: "auto",
        }, "drag");
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }

    pointerRef.current = {
      mode: hasActiveMapPick && event.button === 0 ? "pick" : (event.shiftKey || event.button === 1 || event.button === 2 ? "pan" : "orbit"),
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      selectedIndex: null,
      draftCoordinate: null,
      dragOffsetX: 0,
      dragOffsetZ: 0,
      startAltitudeM: 0,
      dragGesture: null,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const pointer = pointerRef.current;
    if (pointer.mode === "idle") {
      updateHoverMissionInfo(event);
      return;
    }
    if (pointer.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - pointer.lastX;
    const dy = event.clientY - pointer.lastY;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    const totalDx = event.clientX - pointer.startX;
    const totalDy = event.clientY - pointer.startY;
    if (pointer.mode === "marker-combo-drag") {
      if (Math.abs(totalDx) + Math.abs(totalDy) > 7) {
        pointer.moved = true;
      }
    } else if (Math.abs(dx) + Math.abs(dy) > 3) {
      pointer.moved = true;
    }

    if (pointer.mode === "marker-combo-drag" && Number.isInteger(pointer.selectedIndex)) {
      const totalAbsX = Math.abs(totalDx);
      const totalAbsY = Math.abs(totalDy);

      const draggedItem = missionItems[pointer.selectedIndex];
      const canMoveOnMap = itemCanUseMapCoordinate(draggedItem);
      const canDragAltitude = itemCanDragAltitude(draggedItem);

      if (!pointer.dragGesture && totalAbsX + totalAbsY > 7) {
        pointer.dragGesture = !canMoveOnMap && canDragAltitude
          ? "altitude"
          : (totalAbsY > totalAbsX * 1.15 ? "altitude" : "xy");
      }

      if (pointer.dragGesture === "altitude") {
        const altitudeScale = clamp(cameraControlRef.current.distance * 0.00020, 0.015, 0.080);
        const nextAltitude = pointer.startAltitudeM - totalDy * altitudeScale;
        const preview = previewMissionAltitude(pointer.selectedIndex, nextAltitude, "altitude");
        if (preview) {
          pointer.draftCoordinate = preview;
        }
        return;
      }

      if (!canMoveOnMap) {
        return;
      }

      const groundPoint = screenPointToGround(event);
      if (groundPoint) {
        groundPoint.x += pointer.dragOffsetX || 0;
        groundPoint.z += pointer.dragOffsetZ || 0;
      }
      const preview = previewMissionCoordinateFromGround(pointer.selectedIndex, groundPoint, pointer.dragGesture === "xy" ? "xy" : "auto");
      if (preview) {
        pointer.draftCoordinate = preview;
        setOverlayAnchorFromCursor(event);
      }
      return;
    }

    if (pointer.mode === "orbit") {
      cameraControlRef.current.azimuth += dx * 0.007;
      cameraControlRef.current.elevation = clamp(cameraControlRef.current.elevation + dy * 0.0045, 0.18, 1.45);
      updateCameraView();
      return;
    }

    if (pointer.mode === "pan") {
      const camera = cameraRef.current;
      if (!camera) {
        return;
      }
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const panScale = cameraControlRef.current.distance * 0.0026;
      cameraControlRef.current.target.add(right.multiplyScalar(-dx * panScale));
      cameraControlRef.current.target.add(forward.multiplyScalar(dy * panScale));
      updateCameraView();
    }
  }

  function handlePointerUp(event) {
    const pointer = pointerRef.current;
    if (pointer.mode === "idle" || pointer.pointerId !== event.pointerId) {
      return;
    }

    if (pointer.mode === "pick" && !pointer.moved && Number.isInteger(activeMapPickIndex)) {
      const groundPoint = screenPointToGround(event);
      updateMissionCoordinateFromGround(activeMapPickIndex, groundPoint);
    }

    if (pointer.mode === "marker-combo-drag" && pointer.moved && Number.isInteger(pointer.selectedIndex) && pointer.draftCoordinate) {
      const selectedItem = missionItems[pointer.selectedIndex];
      const updateOptions = pointer.dragGesture === "altitude"
        ? {
            altitude_m: pointer.draftCoordinate.altitude_m,
            onlyAltitude: !itemCanUseMapCoordinate(selectedItem),
            silent: false,
          }
        : { silent: false };
      onUpdateWaypointFromMap(
        pointer.selectedIndex,
        pointer.draftCoordinate.latitude_deg,
        pointer.draftCoordinate.longitude_deg,
        updateOptions,
      );
      onSelectItem(pointer.selectedIndex);
    }

    if ((pointer.mode === "marker-select" || pointer.mode === "marker-combo-drag") && !pointer.moved && Number.isInteger(pointer.selectedIndex)) {
      onSelectItem(pointer.selectedIndex);
    }

    if (Number.isInteger(pointer.selectedIndex)) {
      hideMissionInfoSprite(pointer.selectedIndex);
    }
    window.requestAnimationFrame(() => updateHoverMissionInfo(event));
    pointerRef.current = {
      mode: "idle",
      pointerId: null,
      lastX: 0,
      lastY: 0,
      startX: 0,
      startY: 0,
      moved: false,
      selectedIndex: null,
      draftCoordinate: null,
      dragOffsetX: 0,
      dragOffsetZ: 0,
      startAltitudeM: 0,
      dragGesture: null,
    };
  }

  function handleWheel(event) {
    event.preventDefault();
    zoomThreeCamera(event.deltaY * 0.18);
  }

  return (
    <div
      ref={mountRef}
      role="application"
      aria-label="True Three.js 3D mission map planner with direct waypoint drag"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => {
        if (Number.isInteger(hoveredMissionIndexRef.current)) {
          hideMissionInfoSprite(hoveredMissionIndexRef.current);
        }
        hoveredMissionIndexRef.current = null;
      }}
      onWheel={handleWheel}
      onContextMenu={(event) => event.preventDefault()}
      className={`relative h-full w-full touch-none select-none overflow-hidden bg-[#06131a] ${hasActiveMapPick ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}
    >
      <div ref={canvasHostRef} className="pointer-events-none absolute inset-0 z-0" />
      <div className="pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-cyan-300/20 bg-zinc-950/62 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-cyan-100 shadow-xl backdrop-blur-sm">
        <Icon name="deployed_code" className="text-[17px]" />
        3D Mission Map
      </div>
      <div className="pointer-events-none absolute left-5 top-[56px] z-10 grid gap-1 rounded-2xl border border-emerald-300/20 bg-zinc-950/62 px-3 py-2 text-[11px] font-bold text-zinc-200 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 text-emerald-100">
          <Icon name="my_location" className="text-[16px]" />
          <span>UAV {hasLivePosition ? livePosition.source : "no position"}</span>
        </div>
        <div className="font-mono text-zinc-300">
          Lat {formatCoordinate(livePosition.latitude_deg)} · Lon {formatCoordinate(livePosition.longitude_deg)}
        </div>
        <div className="font-mono text-zinc-400">
          AMSL {formatSmallNumber(livePosition.altitude_amsl_m, 2, " m")}
        </div>
      </div>
      {hasActiveMapPick ? (
        <div className="pointer-events-none absolute left-5 top-[145px] z-10 rounded-2xl border border-amber-300/35 bg-amber-400/12 px-3 py-2 text-xs font-bold text-amber-50 shadow-xl backdrop-blur-sm">
          Chọn vị trí step #{activeMapPickIndex + 1}: click mặt sàn hoặc kéo marker.
        </div>
      ) : null}

      <div className="pointer-events-auto absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-3xl border border-white/15 bg-zinc-950/82 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.40)] backdrop-blur-sm">
        <MiniIconButton icon="add" label="Zoom in" onClick={() => zoomThreeCamera(-28)} />
        <MiniIconButton icon="remove" label="Zoom out" onClick={() => zoomThreeCamera(28)} />
        <MiniIconButton icon="my_location" label="Center UAV" disabled={!hasLivePosition} onClick={centerOnLivePosition} />
        <MiniIconButton icon="route" label="Fit mission" onClick={fitWaypoints} />
        <MiniIconButton icon="center_focus_strong" label="Reset camera" onClick={resetThreeCamera} />
        {hasActiveMapPick ? <MiniIconButton icon="close" label="Tắt chọn vị trí" onClick={onClearMapPick} /> : null}
      </div>
    </div>
  );
}, (previous, next) => (
  previous.status === next.status
  && previous.missionItems === next.missionItems
  && previous.selectedIndex === next.selectedIndex
  && previous.activeMapPickIndex === next.activeMapPickIndex
  && previous.flightTrack === next.flightTrack
));

function MissionItemRow({
  item,
  index,
  expanded,
  dragOver,
  activeRuntimeItem,
  currentRuntimeActionLabel,
  compactInputClass,
  onSelect,
  onChange,
  onRemove,
  onApplyLivePosition,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const hasMapCoordinate = itemCanUseMapCoordinate(item);
  const isHold = item.type === "hold";
  const isTakeoff = item.type === "takeoff";
  const isLand = item.type === "land";
  const isRtl = item.type === "rtl";
  const isChangeSettings = item.type === "changeSettings";
  const isPickup = item.type === "pickup";
  const isServoPulse = item.type === "servoPulse";
  const isCustomAction = item.type === "customAction";

  return (
    <div
      onDragOver={(event) => onDragOver(event, index)}
      onDrop={(event) => onDrop(event, index)}
      onDragEnd={onDragEnd}
      className={`overflow-hidden rounded-3xl border transition ${
        activeRuntimeItem
          ? "border-emerald-200/80 bg-emerald-400/[0.13] shadow-[0_18px_50px_rgba(52,211,153,0.16)]"
          : expanded
            ? "border-cyan-300/60 bg-cyan-400/[0.10] shadow-[0_18px_45px_rgba(34,211,238,0.10)]"
            : dragOver
              ? "border-amber-300/70 bg-amber-400/[0.10]"
              : "border-white/10 bg-zinc-950/62 hover:bg-white/[0.08]"
      }`}
    >
      <button type="button" onClick={() => onSelect(index)} className="w-full px-3 py-3 text-left">
        <div className="flex items-center gap-3">
          <span
            draggable
            onPointerDown={(event) => event.stopPropagation()}
            onDragStart={(event) => onDragStart(event, index)}
            onDragEnd={onDragEnd}
            className="grid h-9 w-9 shrink-0 cursor-grab place-items-center rounded-2xl border border-white/10 bg-white/8 text-zinc-300 active:cursor-grabbing"
            title="Kéo để đổi thứ tự"
          >
            <Icon name={MISSION_ICON[item.type] ?? "radio_button_checked"} className="text-[21px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <strong className="truncate text-sm text-zinc-100">{item.name || item.type}</strong>
              <span className={`rounded-full px-2 py-1 text-[10px] font-black ${activeRuntimeItem ? "bg-emerald-300 text-zinc-950" : "bg-white/8 text-zinc-300"}`}>{activeRuntimeItem ? "RUN" : `#${index + 1}`}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
              <Icon name="drag_indicator" className="text-[16px]" />
              <span>{item.type.toUpperCase()}</span>
              {hasMapCoordinate ? <span className="truncate">· {formatCoordinate(item.latitude_deg)}, {formatCoordinate(item.longitude_deg)}</span> : null}
              {isTakeoff ? <span className="truncate">· target {formatAltitudeLabel(item.altitude_m)} AMSL</span> : null}
              {isHold ? <span className="truncate">· {formatHoldTimeLabel(item.hold_time_s)} sau WP trước</span> : null}
              {isLand ? <span className="truncate">· gắn dưới WP trước</span> : null}
              {isPickup ? <span className="truncate">· payload {item.custom_json || "{}"}</span> : null}
              {isServoPulse ? <span className="truncate">· CH {item.servo_channel ?? "--"} PWM {item.servo_pwm_on_us ?? "--"}</span> : null}
              {isCustomAction ? <span className="truncate">· {item.custom_type || "customAction"}</span> : null}
            </div>
            {activeRuntimeItem ? (
              <div className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-200/50 bg-emerald-300/18 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-50">
                <Icon name="play_arrow" className="text-[14px]" />
                <span className="truncate">{currentRuntimeActionLabel || "ĐANG THỰC HIỆN"}</span>
              </div>
            ) : null}
          </div>
          <Icon name="keyboard_arrow_down" className={`text-[26px] text-zinc-400 transition ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded ? (
        <div className="grid gap-3 border-t border-white/10 px-3 pb-4 pt-3">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Field label="Name">
              <input value={item.name} onChange={(event) => onChange(index, "name", event.target.value)} className={compactInputClass} />
            </Field>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onRemove(index);
              }}
              className="mt-[22px] grid h-[42px] w-[42px] place-items-center rounded-2xl border border-rose-300/30 bg-rose-400/10 text-rose-100 transition hover:bg-rose-400/20"
              title="Xóa step này"
            >
              <Icon name="delete" className="text-[21px]" />
            </button>
          </div>

          {isTakeoff ? (
            <>
              <Field label="Target Altitude (m AMSL)">
                <input value={item.altitude_m} onChange={(event) => onChange(index, "altitude_m", event.target.value)} className={compactInputClass} />
              </Field>
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-3 text-xs font-semibold text-emerald-100">
                Takeoff hiển thị/điều chỉnh theo độ cao AMSL trên UI; payload takeoff vẫn tối giản theo mode ROS.
              </div>
            </>
          ) : hasMapCoordinate ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Lat">
                  <input value={item.latitude_deg} onChange={(event) => onChange(index, "latitude_deg", event.target.value)} className={compactInputClass} />
                </Field>
                <Field label="Lon">
                  <input value={item.longitude_deg} onChange={(event) => onChange(index, "longitude_deg", event.target.value)} className={compactInputClass} />
                </Field>
              </div>
              <Field label="Altitude (m AMSL)">
                <input value={item.altitude_m} onChange={(event) => onChange(index, "altitude_m", event.target.value)} className={compactInputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <GlassButton icon="my_location" label="Use UAV" tone="cyan" onClick={() => onApplyLivePosition(index)} />
                <GlassButton icon="open_with" label="Drag on map" tone="amber" onClick={() => onSelect(index)} />
              </div>
            </>
          ) : isHold ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-3 py-3 text-xs font-semibold leading-5 text-amber-100">
              Hold là action gắn vào waypoint đứng ngay trước nó. Trên map, waypoint đó sẽ đổi màu và hiển thị thời gian hold; không vẽ Hold như một waypoint độc lập.
            </div>
          ) : isLand ? (
            <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 px-3 py-3 text-xs font-semibold leading-5 text-violet-100">
              Land là action gắn vào waypoint đứng ngay trước nó. Trên map chỉ hiện icon tròn 2D ở dưới waypoint đó, không vẽ label 3D riêng.
            </div>
          ) : isRtl ? (
            <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-3 py-3 text-xs font-semibold text-rose-100">
              RTL không cần nhập tọa độ. Trên map chỉ hiện icon tròn 2D tại HOME/local reference, không chạy theo vị trí hoặc độ cao UAV đang bay.
            </div>
          ) : isChangeSettings ? (
            <>
              <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-3 text-xs font-bold text-zinc-200">
                <input
                  type="checkbox"
                  checked={Boolean(item.reset_all)}
                  onChange={(event) => onChange(index, "reset_all", event.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />
                Reset all settings before applying values
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Field label="H Vel">
                  <input value={item.horizontal_velocity_m_s ?? ""} onChange={(event) => onChange(index, "horizontal_velocity_m_s", event.target.value)} className={compactInputClass} />
                </Field>
                <Field label="V Vel">
                  <input value={item.vertical_velocity_m_s ?? ""} onChange={(event) => onChange(index, "vertical_velocity_m_s", event.target.value)} className={compactInputClass} />
                </Field>
                <Field label="Yaw">
                  <input value={item.max_heading_rate_deg_s ?? ""} onChange={(event) => onChange(index, "max_heading_rate_deg_s", event.target.value)} className={compactInputClass} />
                </Field>
              </div>
            </>
          ) : isPickup ? (
            <>
              <Field label="Pickup Payload JSON">
                <textarea value={item.custom_json ?? "{}"} onChange={(event) => onChange(index, "custom_json", event.target.value)} className={`${compactInputClass} min-h-[96px] resize-y font-mono text-xs`} />
              </Field>
              <div className="rounded-2xl border border-orange-300/20 bg-orange-400/10 px-3 py-3 text-xs font-semibold text-orange-100">
                ROS mode mới chỉ đăng ký custom action pickup. Payload này sẽ được publish ra /adaptive_mission_mode/pickup khi executor chạy tới step.
              </div>
            </>
          ) : isServoPulse ? (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Channel">
                <input value={item.servo_channel ?? 1} onChange={(event) => onChange(index, "servo_channel", event.target.value)} className={compactInputClass} />
              </Field>
              <Field label="PWM On">
                <input value={item.servo_pwm_on_us ?? 1900} onChange={(event) => onChange(index, "servo_pwm_on_us", event.target.value)} className={compactInputClass} />
              </Field>
              <Field label="PWM Off">
                <input value={item.servo_pwm_off_us ?? 1500} onChange={(event) => onChange(index, "servo_pwm_off_us", event.target.value)} className={compactInputClass} />
              </Field>
              <Field label="Period (s)">
                <input value={item.servo_period_s ?? 0.5} onChange={(event) => onChange(index, "servo_period_s", event.target.value)} className={compactInputClass} />
              </Field>
              <Field label="On Time (s)">
                <input value={item.servo_on_duration_s ?? 0.2} onChange={(event) => onChange(index, "servo_on_duration_s", event.target.value)} className={compactInputClass} />
              </Field>
            </div>
          ) : isCustomAction ? (
            <>
              <Field label="Action Type">
                <input value={item.custom_type ?? "customAction"} onChange={(event) => onChange(index, "custom_type", event.target.value)} className={compactInputClass} />
              </Field>
              <Field label="Action JSON">
                <textarea value={item.custom_json ?? "{}"} onChange={(event) => onChange(index, "custom_json", event.target.value)} className={`${compactInputClass} min-h-[96px] resize-y font-mono text-xs`} />
              </Field>
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-semibold text-zinc-300">
              Item này không cần tham số bổ sung.
            </div>
          )}

          {isHold ? (
            <Field label="Hold Time (s)">
              <input value={item.hold_time_s} onChange={(event) => onChange(index, "hold_time_s", event.target.value)} className={compactInputClass} />
            </Field>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function MissionPanel({
  open,
  busyAction,
  missionName,
  setMissionName,
  defaults,
  setDefaults,
  missionItems,
  waypointCount,
  selectedMissionIndex,
  activeMapPickIndex,
  dragOverIndex,
  draggedIndex,
  compactInputClass,
  livePositionForStatus,
  onClose,
  onClearMapPick,
  onClearMissionItems,
  onSave,
  onRun,
  onPauseContinue,
  onAbort,
  onAppendItem,
  onAppendWaypointFromMap,
  onUpdateMissionItem,
  onRemoveMissionItem,
  onApplyLivePosition,
  onSelectMissionIndex,
  onItemDragStart,
  onItemDragOver,
  onItemDrop,
  onItemDragEnd,
  missionRuntime,
  pauseControl,
  currentMissionItemIndex,
  activeMissionDisplayIndex,
  currentMissionActionLabel,
}) {
  if (!open) {
    return (
      <div className="pointer-events-auto absolute left-4 top-4 z-40">
        <MiniIconButton icon="route" label="Open mission planner" onClick={onClose} />
      </div>
    );
  }

  const pauseButtonLabel = pauseControl?.isPausedWorkflow ? "Continue" : "Pause-RTL";
  const pauseButtonIcon = pauseControl?.isPausedWorkflow ? "play_circle" : "keyboard_return";
  const pauseButtonBusy = busyAction === "pause-rtl" || busyAction === "continue";

  return (
    <aside className="pointer-events-auto absolute bottom-4 left-4 top-4 z-40 flex w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[34px] border border-white/15 bg-zinc-950/[0.84] shadow-[0_28px_85px_rgba(0,0,0,0.55)] backdrop-blur-sm">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-cyan-400/15 text-cyan-100">
              <Icon name="route" className="text-[28px]" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-[-0.04em] text-zinc-50">Mission</h1>
              <p className="text-xs text-zinc-400">{missionItems.length} steps · {waypointCount} WP</p>
            </div>
          </div>
          <MiniIconButton icon="keyboard_double_arrow_left" label="Collapse" onClick={onClose} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-white/[0.045] p-1.5">
          <GlassButton className="min-h-[44px] w-full" icon="upload" label={busyAction === "save" ? "Uploading" : "Upload"} tone="cyan" disabled={busyAction !== "" || missionItems.length === 0} onClick={onSave} />
          <GlassButton className="min-h-[44px] w-full" icon="rocket_launch" label={busyAction === "run" ? "Running" : "Run"} tone="emerald" disabled={busyAction !== "" || missionItems.length === 0} onClick={onRun} />
          <GlassButton className="min-h-[48px] w-full" icon={pauseButtonIcon} label={pauseButtonBusy ? "Sending" : pauseButtonLabel} tone={pauseControl?.isPausedWorkflow ? "emerald" : "amber"} disabled={busyAction !== ""} onClick={onPauseContinue} />
          <GlassButton className="min-h-[48px] w-full" icon="stop_circle" label={busyAction === "abort" ? "Stopping" : "Stop"} tone="rose" disabled={busyAction !== ""} onClick={onAbort} />
          <div className="col-span-2 flex justify-end">
            <MiniIconButton icon="delete_sweep" label="Xóa toàn bộ danh sách mission" disabled={missionItems.length === 0 || busyAction !== ""} onClick={onClearMissionItems} />
          </div>
        </div>
        {Number.isInteger(activeMapPickIndex) ? (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-amber-300/35 bg-amber-400/12 px-3 py-3 text-sm font-bold text-amber-50">
            <Icon name="edit_location_alt" className="text-[22px]" />
            <span>Đang chọn vị trí cho step #{activeMapPickIndex + 1}. Dùng nút X trên map để tắt.</span>
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-3 text-xs font-semibold leading-5 text-zinc-300">
            Nhấn WP để tạo waypoint rồi click lên map 3D để đặt tọa độ. Hold/Land là action gắn vào waypoint đứng trước; RTL hiện bằng icon 2D tại HOME.
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-3">
          <section className="rounded-[26px] border border-white/10 bg-white/[0.045] p-3">
            <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2">
                <p className="text-zinc-500">Runtime</p>
                <p className="mt-1 font-bold text-zinc-100">{missionRuntime.runtime_state ?? "--"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2">
                <p className="text-zinc-500">Mission Active</p>
                <p className="mt-1 font-bold text-zinc-100">{missionRuntime.mission_active ? "YES" : "NO"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2">
                <p className="text-zinc-500">Ready</p>
                <p className="mt-1 font-bold text-zinc-100">{missionRuntime.mission_ready ? "YES" : "NO"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2">
                <p className="text-zinc-500">Start</p>
                <p className="mt-1 font-bold text-zinc-100">{missionRuntime.mission_start_in_progress ? "PENDING" : "IDLE"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2">
                <p className="text-zinc-500">Current Item</p>
                <p className="mt-1 truncate font-bold text-zinc-100">#{missionRuntime.current_item_index ?? "--"} {missionRuntime.current_item_type ?? ""}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2">
                <p className="text-zinc-500">Nav State</p>
                <p className="mt-1 font-bold text-zinc-100">{missionRuntime.vehicle?.nav_state ?? "--"}</p>
              </div>
            </div>

            <Field label="Mission Name">
              <input value={missionName} onChange={(event) => setMissionName(event.target.value)} className={compactInputClass} />
            </Field>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Field label="H Vel">
                <input value={defaults.horizontal_velocity_m_s} onChange={(event) => setDefaults((previous) => ({ ...previous, horizontal_velocity_m_s: event.target.value }))} className={compactInputClass} />
              </Field>
              <Field label="V Vel">
                <input value={defaults.vertical_velocity_m_s} onChange={(event) => setDefaults((previous) => ({ ...previous, vertical_velocity_m_s: event.target.value }))} className={compactInputClass} />
              </Field>
              <Field label="Yaw">
                <input value={defaults.max_heading_rate_deg_s} onChange={(event) => setDefaults((previous) => ({ ...previous, max_heading_rate_deg_s: event.target.value }))} className={compactInputClass} />
              </Field>
            </div>
          </section>

          <section className="rounded-[26px] border border-white/10 bg-white/[0.045] p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-500">Add step</p>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onAppendWaypointFromMap(livePositionForStatus.latitude_deg, livePositionForStatus.longitude_deg)}
                disabled={!hasValidCoordinate(livePositionForStatus.latitude_deg, livePositionForStatus.longitude_deg)}
                className="inline-flex items-center gap-1 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-[11px] font-black text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="my_location" className="text-[16px]" />
                WP tại UAV
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                ["takeoff", "flight_takeoff", "TO"],
                ["waypoint", "add_location_alt", "WP"],
                ["hold", "pause_circle", "Hold"],
                ["changeSettings", "tune", "Set"],
                ["land", "flight_land", "Land"],
                ["rtl", "home_pin", "RTL"],
                ["pickup", "inventory_2", "Pickup"],
              ].map(([type, icon, label]) => (
                <button key={type} type="button" onClick={() => onAppendItem(type)} className="grid gap-1 rounded-2xl border border-white/10 bg-zinc-900/70 px-1.5 py-2 text-center text-[10px] font-black text-zinc-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10">
                  <Icon name={icon} className="mx-auto text-[20px]" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-2">
            {missionItems.length === 0 ? (
              <div className="rounded-[26px] border border-dashed border-white/15 bg-zinc-950/45 px-4 py-6 text-center">
                <p className="text-sm font-bold text-zinc-100">Chưa có mission local trên UI</p>
                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  Thêm step bằng các nút phía trên hoặc đặt waypoint trực tiếp trên map.
                </p>
              </div>
            ) : (
              missionItems.map((item, index) => (
                <MissionItemRow
                  key={`${item.type}-${index}`}
                  item={item}
                  index={index}
                  expanded={selectedMissionIndex === index}
                  dragOver={dragOverIndex === index && draggedIndex !== index}
                  activeRuntimeItem={activeMissionDisplayIndex === index || currentMissionItemIndex === index}
                  currentRuntimeActionLabel={currentMissionActionLabel}
                  compactInputClass={compactInputClass}
                  onSelect={onSelectMissionIndex}
                  onChange={onUpdateMissionItem}
                  onRemove={onRemoveMissionItem}
                  onApplyLivePosition={onApplyLivePosition}
                  onDragStart={onItemDragStart}
                  onDragOver={onItemDragOver}
                  onDrop={onItemDrop}
                  onDragEnd={onItemDragEnd}
                />
              ))
            )}
          </section>
        </div>
      </div>
    </aside>
  );
}

function DroneStatCard({ icon, value, caption, tone = "zinc" }) {
  const toneMap = {
    zinc: "bg-white/[0.055] text-zinc-100",
    emerald: "bg-emerald-400/12 text-emerald-50",
    cyan: "bg-cyan-400/12 text-cyan-50",
    amber: "bg-amber-400/12 text-amber-50",
    rose: "bg-rose-400/12 text-rose-50",
  };

  return (
    <div className={`rounded-[24px] border border-white/10 p-3 ${toneMap[tone]}`}>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-zinc-950/42">
          <Icon name={icon} className="text-[25px]" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-black tracking-[-0.03em]">{value}</p>
          <p className="truncate text-[11px] font-semibold text-zinc-400">{caption}</p>
        </div>
      </div>
    </div>
  );
}

function DroneStatusPanel({
  open,
  loading,
  status,
  drone,
  droneOptions,
  selectedDroneId,
  setSelectedDroneId,
  livePositionForStatus,
  logs,
  onClose,
}) {
  const topMessageCounts = Object.entries(drone.messageCounts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 8);

  if (!open) {
    return (
      <div className="pointer-events-auto absolute right-4 top-4 z-40 grid gap-2">
        <MiniIconButton icon="sensors" label="Open drone status" onClick={onClose} />
        <div className={`grid h-11 w-11 place-items-center rounded-2xl border border-white/10 ${drone.connected ? "bg-emerald-400/20 text-emerald-50" : "bg-rose-400/20 text-rose-50"}`}>
          <Icon name={drone.connected ? "link" : "link_off"} className="text-[22px]" />
        </div>
      </div>
    );
  }

  const connectionTone = drone.connected ? "emerald" : "rose";
  const batteryTone = Number(drone.batteryPercent) > 30 ? "emerald" : "amber";

  return (
    <aside className="pointer-events-auto absolute bottom-4 right-4 top-4 z-40 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[34px] border border-white/15 bg-zinc-950/[0.84] shadow-[0_28px_85px_rgba(0,0,0,0.55)] backdrop-blur-sm">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`grid h-12 w-12 place-items-center rounded-3xl ${drone.connected ? "bg-emerald-400/15 text-emerald-100" : "bg-rose-400/15 text-rose-100"}`}>
              <Icon name="flight" className="text-[29px]" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black tracking-[-0.04em] text-zinc-50">{drone.armed ? "ARMED" : "DISARMED"}</h2>
              <p className="text-xs text-zinc-400">{loading ? "Polling..." : drone.connected ? `${drone.source} live` : `${drone.source} stale`}</p>
            </div>
          </div>
          <MiniIconButton icon="keyboard_double_arrow_right" label="Collapse" onClick={onClose} />
        </div>

        <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-2">
          <div className="mb-2 flex items-center gap-2 px-2 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500">
            <Icon name="groups" className="text-[17px]" />
            Drone list
          </div>
          <div className="grid gap-2">
            {droneOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setSelectedDroneId(option.id)}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
                  selectedDroneId === option.id
                    ? "border-cyan-300/60 bg-cyan-400/12"
                    : "border-white/10 bg-zinc-950/45 hover:bg-white/[0.08]"
                }`}
              >
                <div className={`grid h-9 w-9 place-items-center rounded-xl ${option.connected ? "bg-emerald-400/16 text-emerald-100" : "bg-zinc-800 text-zinc-400"}`}>
                  <Icon name="flight" className="text-[20px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="truncate text-sm text-zinc-100">{option.name}</strong>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black ${option.connected ? "bg-emerald-400/15 text-emerald-100" : "bg-zinc-700/70 text-zinc-300"}`}>
                      {option.connected ? "LIVE" : "STALE"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">{option.mode} · {option.batteryPercent ?? "--"}%</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          <DroneStatCard icon="link" value={drone.connected ? "LIVE" : "STALE"} caption="Connection" tone={connectionTone} />
          <DroneStatCard icon="mode_standby" value={drone.mode} caption="Mode" tone="cyan" />
          <DroneStatCard icon="battery_full" value={drone.batteryPercent == null ? "--" : `${drone.batteryPercent}%`} caption={formatSmallNumber(drone.voltage, 2, " V")} tone={batteryTone} />
          <DroneStatCard icon="warning" value={drone.failsafe ? "YES" : "NO"} caption="Failsafe" tone={drone.failsafe ? "rose" : "emerald"} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <DroneStatCard icon="explore" value={drone.headingDeg == null ? "--" : `${Number(drone.headingDeg).toFixed(0)}°`} caption="Heading" tone="cyan" />
          <DroneStatCard icon="height" value={formatSmallNumber(livePositionForStatus.altitude_amsl_m, 2, " m")} caption="AMSL" tone="zinc" />
          <DroneStatCard icon="schedule" value={formatAge(drone.heartbeatAge)} caption="Heartbeat" tone="zinc" />
        </div>

        <section className="mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center gap-3">
            <Icon name="gps_fixed" className="text-[24px] text-emerald-100" />
            <div>
              <h3 className="text-sm font-black text-zinc-100">Position</h3>
              <p className="text-xs text-zinc-500">{livePositionForStatus.source}</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2 font-mono text-sm text-zinc-100">
            <div className="flex justify-between gap-3"><span className="text-zinc-500">Lat</span><span>{formatCoordinate(livePositionForStatus.latitude_deg)}</span></div>
            <div className="flex justify-between gap-3"><span className="text-zinc-500">Lon</span><span>{formatCoordinate(livePositionForStatus.longitude_deg)}</span></div>
            <div className="flex justify-between gap-3"><span className="text-zinc-500">AMSL</span><span>{formatSmallNumber(livePositionForStatus.altitude_amsl_m, 2, " m")}</span></div>
          </div>
        </section>

        <section className="mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Icon name="settings_input_antenna" className="text-[24px] text-cyan-100" />
              <h3 className="text-sm font-black text-zinc-100">MAVLink</h3>
            </div>
            <span className="rounded-full bg-white/8 px-2 py-1 text-[11px] text-zinc-400">{drone.id}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-xs text-zinc-500">Base</p><strong>{drone.baseMode ?? "--"}</strong></div>
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-xs text-zinc-500">Custom</p><strong>{drone.customMode ?? "--"}</strong></div>
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-xs text-zinc-500">Sys</p><strong>{drone.systemStatus ?? "--"}</strong></div>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/45 px-3 py-1.5 text-[11px] font-bold text-zinc-300">
            <Icon name="settings_ethernet" className="text-[16px]" />
            {formatLinkSummary(drone.connectionUrl)}
          </div>
        </section>

        <section className="mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Icon name="topic" className="text-[23px] text-amber-100" />
              <div>
                <h3 className="text-sm font-black text-zinc-100">Mission Bridge</h3>
                <p className="text-xs text-zinc-500">{status.mission_runtime?.available ? "ROS mission runtime live" : "Waiting mission runtime status"}</p>
              </div>
            </div>
            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${status.mission_runtime?.mission_active ? "bg-emerald-400/12 text-emerald-100" : "bg-zinc-700/70 text-zinc-300"}`}>
              {status.mission_runtime?.runtime_state ?? "--"}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-zinc-500">Ready</p><strong>{status.mission_runtime?.mission_ready ? "YES" : "NO"}</strong></div>
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-zinc-500">Start</p><strong>{status.mission_runtime?.mission_start_in_progress ? "PENDING" : "IDLE"}</strong></div>
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-zinc-500">Step</p><strong>{status.mission_runtime?.current_item_index ?? "--"}</strong></div>
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-zinc-500">Item</p><strong>{status.mission_runtime?.current_item_type ?? "--"}</strong></div>
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-zinc-500">Armed</p><strong>{status.mission_runtime?.vehicle?.armed ? "YES" : "NO"}</strong></div>
            <div className="rounded-2xl bg-zinc-950/55 p-2"><p className="text-zinc-500">Landed</p><strong>{status.mission_runtime?.vehicle?.landed ? "YES" : "NO"}</strong></div>
          </div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-3 text-xs">
            <p className="text-zinc-500">State vehicle coordinate</p>
            <p className="mt-1 font-semibold text-zinc-100">
              Lat {formatCoordinate(status.mission_runtime?.vehicle?.lat ?? status.mission_runtime?.vehicle?.latitude_deg)} · Lon {formatCoordinate(status.mission_runtime?.vehicle?.lon ?? status.mission_runtime?.vehicle?.longitude_deg)}
            </p>
            <p className="mt-1 font-semibold text-zinc-100">
              AMSL {formatSmallNumber(status.mission_runtime?.vehicle?.alt_msl ?? status.mission_runtime?.vehicle?.altitude_amsl_m, 2, " m")}
            </p>
            {status.mission_runtime?.last_error ? <p className="mt-2 text-rose-200">{status.mission_runtime.last_error}</p> : null}
          </div>
        </section>

        <section className="mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Icon name="dns" className="text-[23px] text-zinc-200" />
              <h3 className="text-sm font-black text-zinc-100">Messages</h3>
            </div>
            <span className="text-xs text-zinc-500">top {topMessageCounts.length}</span>
          </div>
          <div className="grid max-h-[155px] gap-1.5 overflow-y-auto pr-1 font-mono text-[11px]">
            {topMessageCounts.length === 0 ? (
              <p className="text-sm text-zinc-500">No messages.</p>
            ) : (
              topMessageCounts.map(([name, count]) => (
                <div key={name} className="flex justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-950/50 px-3 py-2">
                  <span className="truncate text-zinc-400">{name}</span>
                  <span className="text-zinc-100">{count}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4">
          <div className="mb-3 flex items-center gap-3">
            <Icon name="history" className="text-[23px] text-zinc-200" />
            <h3 className="text-sm font-black text-zinc-100">Log</h3>
          </div>
          <div className="grid max-h-[180px] gap-2 overflow-y-auto pr-1">
            {drone.lastError ? <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 p-3 text-xs text-rose-100">{drone.lastError}</div> : null}
            {drone.lastStatustext ? <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-3 text-xs text-amber-100">{drone.lastStatustext}</div> : null}
            {logs.length === 0 ? (
              <p className="text-sm text-zinc-500">No action yet.</p>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-zinc-950/55 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="truncate text-sm text-zinc-100">{entry.title}</strong>
                    <span className="font-mono text-[10px] text-zinc-500">{entry.timestamp}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">{entry.detail}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}


export default function App() {
  const [status, setStatus] = useState(EMPTY_STATUS);
  const [missionName, setMissionName] = useState("adaptive-run");
  const [defaults, setDefaults] = useState(DEFAULT_DEFAULTS);
  const [missionItems, setMissionItems] = useState([]);
  const [busyAction, setBusyAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [missionPanelOpen, setMissionPanelOpen] = useState(true);
  const [dronePanelOpen, setDronePanelOpen] = useState(true);
  const [selectedDroneId, setSelectedDroneId] = useState("1:1");
  const [activeMapPickIndex, setActiveMapPickIndex] = useState(null);
  const [flightTrack, setFlightTrack] = useState([]);
  const [pauseWorkflowLocalActive, setPauseWorkflowLocalActive] = useState(() => {
    try {
      return window.localStorage.getItem("missionUiPauseWorkflowLocalActive") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("missionUiPauseWorkflowLocalActive", pauseWorkflowLocalActive ? "true" : "false");
    } catch {
      // localStorage may be unavailable in private/browser-restricted mode.
    }
  }, [pauseWorkflowLocalActive]);

  useEffect(() => {
    let active = true;

    async function refreshStatus() {
      try {
        const snapshot = await request("/api/status");
        try {
          if (!snapshot.mavlink) {
            snapshot.mavlink = await request("/api/mavlink/status");
          }
        } catch {
          // Backend ROS-only vẫn chạy bình thường.
        }
        if (!active) {
          return;
        }
        setStatus(snapshot);
      } catch (error) {
        if (active) {
          pushLog("error", "Status poll failed", error.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    refreshStatus();
    const timer = window.setInterval(refreshStatus, 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const position = getLivePosition(status);

    // Chỉ ghi vệt bay khi UAV đang ARM. Khi DISARMED thì xoá trail để tránh xuất hiện
    // đường thẳng giả từ các mẫu GPS cũ / nhảy nguồn ROS-MAVLink.
    if (!isDroneArmed(status)) {
      setFlightTrack((previous) => (previous.length > 0 ? [] : previous));
      return;
    }

    if (!hasValidCoordinate(position.latitude_deg, position.longitude_deg)) {
      return;
    }

    setFlightTrack((previous) => {
      const nextPoint = {
        latitude_deg: Number(position.latitude_deg),
        longitude_deg: Number(position.longitude_deg),
        altitude_amsl_m: normalizeNumber(position.altitude_amsl_m),
        relative_altitude_m: normalizeNumber(position.relative_altitude_m),
        timestamp: Date.now(),
      };
      const lastPoint = previous[previous.length - 1];
      if (lastPoint) {
        const movedMeters = haversineDistanceMeters(lastPoint, nextPoint);
        const elapsed = nextPoint.timestamp - lastPoint.timestamp;

        // Nếu GPS/source bị nhảy xa bất thường thì reset trail, không nối thành đường dài qua bản đồ.
        if (movedMeters > MAX_FLIGHT_TRACK_JUMP_M && elapsed < 10000) {
          return [nextPoint];
        }

        if (movedMeters < 0.35 && elapsed < 4500) {
          return previous;
        }
      }
      return [...previous, nextPoint].slice(-450);
    });
  }, [status]);

  function pushLog(level, title, detail) {
    setLogs((previous) => [
      {
        id: crypto.randomUUID(),
        level,
        title,
        detail,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...previous,
    ].slice(0, 12));
  }

  const payload = useMemo(
    () => missionPayload(missionName, defaults, missionItems),
    [missionName, defaults, missionItems],
  );

  async function runAction(key, action, successTitle) {
    setBusyAction(key);
    try {
      const response = await action();
      pushLog("success", successTitle, response.detail);
      const snapshot = await request("/api/status");
      setStatus(snapshot);
    } catch (error) {
      pushLog("error", `${successTitle} failed`, error.message);
    } finally {
      setBusyAction("");
    }
  }

  function updateMissionItem(index, field, value) {
    setMissionItems((previous) => previous.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  }

  function selectMissionItem(index) {
    setSelectedMissionIndex(index);
    setMissionPanelOpen(true);
    const item = missionItems[index];
    if (itemCanUseMapCoordinate(item)) {
      setActiveMapPickIndex(index);
    } else {
      setActiveMapPickIndex(null);
    }
  }

  function appendMissionItem(type) {
    setMissionItems((previous) => {
      const nextItem = createMissionItem(type, status, previous);
      const next = [...previous, nextItem];
      const nextIndex = next.length - 1;
      setSelectedMissionIndex(nextIndex);
      setMissionPanelOpen(true);
      setActiveMapPickIndex(itemCanUseMapCoordinate(nextItem) ? nextIndex : null);
      return next;
    });
  }

  function appendWaypointFromMap(latitude, longitude) {
    if (!hasValidCoordinate(latitude, longitude)) {
      pushLog("warn", "Không có tọa độ map hợp lệ", "Không thể thêm waypoint vì lat/lon không hợp lệ.");
      return;
    }

    setMissionItems((previous) => {
      const takeoffAltitude = getTakeoffAltitude(previous, status);
      const nextWaypoint = {
        type: "waypoint",
        name: `Waypoint ${previous.filter((item) => item.type === "waypoint").length + 1}`,
        latitude_deg: Number(latitude),
        longitude_deg: Number(longitude),
        altitude_m: takeoffAltitude,
        hold_time_s: 0,
      };
      const next = [...previous, nextWaypoint];
      setSelectedMissionIndex(next.length - 1);
      setMissionPanelOpen(true);
      setActiveMapPickIndex(next.length - 1);
      return next;
    });
    pushLog("success", "Waypoint added", `${Number(latitude).toFixed(7)}, ${Number(longitude).toFixed(7)}`);
  }

  function updateWaypointFromMap(index, latitude, longitude, options = {}) {
    const hasAltitudeUpdate = Number.isFinite(Number(options.altitude_m));
    const nextAltitude = hasAltitudeUpdate ? Number(Number(options.altitude_m).toFixed(2)) : null;

    setMissionItems((previous) =>
      previous.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        const shouldUpdateCoordinate = itemCanUseMapCoordinate(item) && !options.onlyAltitude;
        if (shouldUpdateCoordinate && !hasValidCoordinate(latitude, longitude)) {
          return item;
        }

        return {
          ...item,
          ...(shouldUpdateCoordinate
            ? { latitude_deg: Number(latitude), longitude_deg: Number(longitude) }
            : {}),
          ...(hasAltitudeUpdate ? { altitude_m: nextAltitude } : {}),
        };
      }),
    );

    if (!options.silent) {
      const coordinateText = !options.onlyAltitude && hasValidCoordinate(latitude, longitude)
        ? `${Number(latitude).toFixed(7)}, ${Number(longitude).toFixed(7)}`
        : "altitude only";
      const altitudeText = hasAltitudeUpdate ? `, alt ${nextAltitude.toFixed(2)} m` : "";
      pushLog("success", "Mission item updated", `Step ${index + 1}: ${coordinateText}${altitudeText}`);
    }
  }

  function clearMissionItems() {
    setMissionItems([]);
    setSelectedMissionIndex(null);
    setActiveMapPickIndex(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
    pushLog("warn", "Mission list cleared", "Đã xóa toàn bộ danh sách mission local trên UI.");
  }

  function removeMissionItem(index) {
    setMissionItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
    setSelectedMissionIndex((previous) => {
      if (previous == null) {
        return null;
      }
      if (previous === index) {
        const nextIndex = index - 1;
        return nextIndex >= 0 ? nextIndex : null;
      }
      return previous > index ? previous - 1 : previous;
    });
    setActiveMapPickIndex((previous) => {
      if (previous == null) {
        return null;
      }
      if (previous === index) {
        return null;
      }
      return previous > index ? previous - 1 : previous;
    });
    pushLog("warn", "Mission step removed", `Đã xóa step #${index + 1} khỏi danh sách local.`);
  }

  function applyLivePosition(index) {
    const position = getLivePosition(status);
    if (!hasValidCoordinate(position.latitude_deg, position.longitude_deg)) {
      pushLog("warn", "No live position", "Backend chưa có global position hợp lệ từ MAVLink/ROS.");
      return;
    }

    setMissionItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              latitude_deg: position.latitude_deg,
              longitude_deg: position.longitude_deg,
              altitude_m: getTakeoffAltitude(previous, status),
            }
          : item,
      ),
    );
  }

  function reorderMissionItem(fromIndex, toIndex) {
    if (fromIndex === toIndex || fromIndex == null || toIndex == null) {
      return;
    }

    setMissionItems((previous) => {
      const next = [...previous];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

    setSelectedMissionIndex(toIndex);
    setActiveMapPickIndex((previous) => {
      if (previous == null) {
        return null;
      }
      if (previous === fromIndex) {
        return toIndex;
      }
      if (fromIndex < toIndex && previous > fromIndex && previous <= toIndex) {
        return previous - 1;
      }
      if (fromIndex > toIndex && previous >= toIndex && previous < fromIndex) {
        return previous + 1;
      }
      return previous;
    });
  }

  function handleItemDragStart(event, index) {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleItemDragOver(event, index) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }

  function handleItemDrop(event, index) {
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer.getData("text/plain"));
    reorderMissionItem(Number.isFinite(fromIndex) ? fromIndex : draggedIndex, index);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleItemDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  const drone = getDroneTelemetry(status);
  const livePositionForStatus = getLivePosition(status);
  const mapStatus = useMemo(() => ({
    vehicle: {
      position: status?.vehicle?.position ?? {},
      runtime_vehicle: status?.mission_runtime?.vehicle ?? {},
      last_local_position_age_s: status?.vehicle?.last_local_position_age_s ?? null,
    },
    state: status?.state ?? null,
    active: status?.active ?? null,
    altitude: status?.altitude ?? {},
    mission_runtime: {
      vehicle: status?.mission_runtime?.vehicle ?? {},
      runtime_state: status?.mission_runtime?.runtime_state ?? status?.state ?? null,
      mission_active: status?.mission_runtime?.mission_active ?? status?.active ?? null,
      active: status?.mission_runtime?.active ?? status?.active ?? null,
      altitude_offset_m: status?.mission_runtime?.altitude_offset_m ?? status?.altitude?.offset_m ?? null,
      manual_altitude_active: status?.mission_runtime?.manual_altitude_active ?? status?.altitude?.offset_active ?? null,
      target: status?.mission_runtime?.target ?? {},
    },
    mavlink: {
      connected: Boolean(status?.mavlink?.connected),
      latitude_deg: status?.mavlink?.latitude_deg ?? null,
      longitude_deg: status?.mavlink?.longitude_deg ?? null,
      altitude_amsl_m: status?.mavlink?.altitude_amsl_m ?? null,
      relative_altitude_m: status?.mavlink?.relative_altitude_m ?? null,
      global_origin_lat_deg: status?.mavlink?.global_origin_lat_deg ?? null,
      global_origin_lon_deg: status?.mavlink?.global_origin_lon_deg ?? null,
      global_origin_alt_msl_m: status?.mavlink?.global_origin_alt_msl_m ?? null,
      local_x_ned_m: status?.mavlink?.local_x_ned_m ?? null,
      local_y_ned_m: status?.mavlink?.local_y_ned_m ?? null,
      local_z_ned_m: status?.mavlink?.local_z_ned_m ?? null,
      heading_deg: status?.mavlink?.heading_deg ?? null,
      yaw_deg: status?.mavlink?.yaw_deg ?? null,
    },
  }), [
    status?.vehicle?.position,
    status?.state,
    status?.active,
    status?.altitude,
    status?.mission_runtime?.vehicle,
    status?.mission_runtime?.runtime_state,
    status?.mission_runtime?.mission_active,
    status?.mission_runtime?.active,
    status?.mission_runtime?.altitude_offset_m,
    status?.mission_runtime?.manual_altitude_active,
    status?.mission_runtime?.target,
    status?.vehicle?.last_local_position_age_s,
    status?.mavlink?.connected,
    status?.mavlink?.latitude_deg,
    status?.mavlink?.longitude_deg,
    status?.mavlink?.altitude_amsl_m,
    status?.mavlink?.relative_altitude_m,
    status?.mavlink?.global_origin_lat_deg,
    status?.mavlink?.global_origin_lon_deg,
    status?.mavlink?.global_origin_alt_msl_m,
    status?.mavlink?.local_x_ned_m,
    status?.mavlink?.local_y_ned_m,
    status?.mavlink?.local_z_ned_m,
    status?.mavlink?.heading_deg,
    status?.mavlink?.yaw_deg,
  ]);
  const missionPause = status?.mission_runtime?.pause ?? {};
  const missionPausePhase = String(missionPause?.phase ?? "").toLowerCase();
  const missionRuntimeState = String(
    status?.mission_runtime?.runtime_state ??
    status?.mission_runtime?.state ??
    status?.state ??
    "",
  ).toLowerCase();
  const pauseWorkflowStates = [
    "pause_rtl",
    "rtl_landing",
    "landed_wait_continue",
    "resume_arm",
    "return_pause_point",
  ];
  const pauseWorkflowFromRuntime = Boolean(
    missionPause?.paused ||
    missionPause?.has_pause_point ||
    pauseWorkflowStates.includes(missionPausePhase) ||
    pauseWorkflowStates.includes(missionRuntimeState),
  );
  const isPausedWorkflow = Boolean(pauseWorkflowFromRuntime || pauseWorkflowLocalActive);
  const pauseControl = {
    phase: missionPausePhase || missionRuntimeState || null,
    isPausedWorkflow,
    source: pauseWorkflowFromRuntime ? "runtime" : (pauseWorkflowLocalActive ? "local" : "idle"),
  };
  const waypointCount = missionItems.filter((item) => item.type === "waypoint").length;
  const currentMissionItemIndex = getCurrentMissionItemIndex(status);
  const activeMissionDisplayIndex = getActiveMissionDisplayIndex(missionItems, currentMissionItemIndex);
  const currentMissionActionLabel = getCurrentMissionActionLabel(status, missionItems, currentMissionItemIndex);
  const compactInputClass = "w-full rounded-2xl border border-white/10 bg-zinc-950/75 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-400/70";
  const droneOptions = useMemo(() => getDroneOptions(status), [status]);

  useEffect(() => {
    if (!droneOptions.some((option) => option.id === selectedDroneId)) {
      setSelectedDroneId(droneOptions[0]?.id ?? "1:1");
    }
  }, [droneOptions, selectedDroneId]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 [contain:layout_paint_style]">
      <MissionMap
        status={mapStatus}
        missionItems={missionItems}
        selectedIndex={selectedMissionIndex}
        activeMapPickIndex={activeMapPickIndex}
        flightTrack={flightTrack}
        onSelectItem={selectMissionItem}
        onUpdateWaypointFromMap={updateWaypointFromMap}
        onClearMapPick={() => setActiveMapPickIndex(null)}
        onClearFlightTrack={() => setFlightTrack([])}
      />


      <div className="pointer-events-none absolute inset-0 z-30">
        <MissionPanel
          open={missionPanelOpen}
          busyAction={busyAction}
          missionName={missionName}
          setMissionName={setMissionName}
          defaults={defaults}
          setDefaults={setDefaults}
          missionItems={missionItems}
          waypointCount={waypointCount}
          selectedMissionIndex={selectedMissionIndex}
          activeMapPickIndex={activeMapPickIndex}
          dragOverIndex={dragOverIndex}
          draggedIndex={draggedIndex}
          compactInputClass={compactInputClass}
          livePositionForStatus={livePositionForStatus}
          onClose={() => setMissionPanelOpen((previous) => !previous)}
          onClearMapPick={() => setActiveMapPickIndex(null)}
          onClearMissionItems={clearMissionItems}
          onSave={() => runAction("save", () => request("/api/mission", { method: "POST", body: JSON.stringify(payload) }), "Mission saved")}
          onRun={() => runAction("run", async () => {
            setPauseWorkflowLocalActive(false);
            return request("/api/mission/run", { method: "POST", body: JSON.stringify(payload) });
          }, "Mission uploaded and activated")}
          onPauseContinue={() => (pauseControl.isPausedWorkflow
            ? runAction("continue", async () => {
                const response = await request("/api/mission/continue", { method: "POST" });
                setPauseWorkflowLocalActive(false);
                return response;
              }, "Continue mission sent")
            : runAction("pause-rtl", async () => {
                const response = await request("/api/mission/pause-rtl", { method: "POST" });
                setPauseWorkflowLocalActive(true);
                return response;
              }, "Pause RTL sent"))}
          onAbort={() => runAction("abort", async () => {
            setPauseWorkflowLocalActive(false);
            return request("/api/mission/abort", { method: "POST" });
          }, "Mission stop sent")}
          onAppendItem={appendMissionItem}
          onAppendWaypointFromMap={appendWaypointFromMap}
          onUpdateMissionItem={updateMissionItem}
          onRemoveMissionItem={removeMissionItem}
          onApplyLivePosition={applyLivePosition}
          onSelectMissionIndex={selectMissionItem}
          onItemDragStart={handleItemDragStart}
          onItemDragOver={handleItemDragOver}
          onItemDrop={handleItemDrop}
          onItemDragEnd={handleItemDragEnd}
          missionRuntime={status.mission_runtime ?? EMPTY_STATUS.mission_runtime}
          pauseControl={pauseControl}
          currentMissionItemIndex={currentMissionItemIndex}
          activeMissionDisplayIndex={activeMissionDisplayIndex}
          currentMissionActionLabel={currentMissionActionLabel}
        />

        <DroneStatusPanel
          open={dronePanelOpen}
          loading={loading}
          status={status}
          drone={drone}
          droneOptions={droneOptions}
          selectedDroneId={selectedDroneId}
          setSelectedDroneId={setSelectedDroneId}
          livePositionForStatus={livePositionForStatus}
          logs={logs}
          onClose={() => setDronePanelOpen((previous) => !previous)}
        />
      </div>
    </div>
  );
}
