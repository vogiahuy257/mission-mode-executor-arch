# Backend API mapping for `adaptive_mission_mode_simple`

Backend này đã được chuẩn hóa theo ROS mode tối giản:

| Frontend / Backend API | ROS/MAVLink action |
|---|---|
| `POST /api/mission` | publish `std_msgs/String` tới `/adaptive_mission_mode/mission_json` |
| `POST /api/mission/run` | publish mission JSON, đợi `start_delay_s`, rồi publish `std_msgs/Bool true` tới `/adaptive_mission_mode/activate` |
| `POST /api/mission/activate` | publish Bool tới `/adaptive_mission_mode/activate` |
| `POST /api/mission/abort` | publish `std_msgs/Bool false` tới `/adaptive_mission_mode/activate` |
| `POST /api/mission/start` | alias cũ, map sang activate=true |
| `POST /api/mission/return-home` | alias cũ, abort ROS mode rồi gửi MAVLink RTL nếu MAVLink bridge bật |
| `GET /api/status` | trả trạng thái ROS + MAVLink + vị trí để frontend vẽ map |

## Topic ROS đang dùng

Mặc định:

```bash
/adaptive_mission_mode/mission_json
/adaptive_mission_mode/activate
/adaptive_mission_mode/pickup
/fmu/out/vehicle_status
/fmu/out/vehicle_global_position
/fmu/out/vehicle_local_position
/fmu/out/battery_status
```

Có thể override bằng env:

```bash
export MISSION_UI_MISSION_TOPIC=/adaptive_mission_mode/mission_json
export MISSION_UI_ACTIVATE_TOPIC=/adaptive_mission_mode/activate
export MISSION_UI_PICKUP_TOPIC=/adaptive_mission_mode/pickup
export MISSION_UI_VEHICLE_STATUS_TOPIC=/fmu/out/vehicle_status
export MISSION_UI_VEHICLE_GLOBAL_POSITION_TOPIC=/fmu/out/vehicle_global_position
export MISSION_UI_VEHICLE_LOCAL_POSITION_TOPIC=/fmu/out/vehicle_local_position
export MISSION_UI_BATTERY_STATUS_TOPIC=/fmu/out/battery_status
```

## Vị trí drone cho frontend

`/api/status` hiện trả `vehicle.position` theo thứ tự ưu tiên:

1. `/fmu/out/vehicle_global_position` nếu `lat_lon_valid=true`.
2. Nếu global invalid, dùng `/fmu/out/vehicle_local_position` + `ref_lat/ref_lon/ref_alt` để đổi local NED `x/y/z` sang lat/lon/AMSL.
3. Nếu local position có `x/y/z` nhưng không có reference global, backend dùng map origin cấu hình để frontend vẫn vẽ được drone tương đối trên map.

Map origin fallback mặc định trùng với center cũ của frontend. Có thể đổi bằng:

```bash
export MISSION_UI_MAP_ORIGIN_LAT_DEG=10.823099
export MISSION_UI_MAP_ORIGIN_LON_DEG=106.629662
export MISSION_UI_MAP_ORIGIN_ALT_MSL_M=0.0
```

Frontend vẫn hiển thị cả local NED raw:

```json
{
  "vehicle": {
    "position": {
      "latitude_deg": 10.823099,
      "longitude_deg": 106.629662,
      "altitude_amsl_m": 3.8,
      "relative_altitude_m": 3.8,
      "source": "ROS 2 local map origin",
      "local_x_ned_m": 0.0,
      "local_y_ned_m": 0.0,
      "local_z_ned_m": -3.8,
      "local_reference_valid": false
    }
  }
}
```

## Frontend đã clean

- Toolbar mission chỉ còn `Upload`, `Run`, `Abort`, và nút xóa danh sách local.
- Bỏ nút `Start`/`Return` trùng logic với API mới.
- Add step chỉ giữ các action phù hợp mode mới: `TO`, `WP`, `Hold`, `Set`, `Land`, `RTL`, `Pickup`.
- `Pickup` dùng `custom_json` và backend compile thành item `{"type":"pickup", ...}`.
