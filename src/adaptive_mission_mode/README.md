# adaptive_mission_mode

Node mission ROS 2 dùng `px4_ros2_cpp::MissionExecutor`.

Chức năng chính:

- Nhận mission JSON từ topic.
- Tự arm, takeoff trước nếu mission có item `takeoff`, rồi chọn mode `Adaptive Mission Mode`.
- Chạy mission bằng `px4_ros2_cpp`.
- Kéo cần ga lên để tăng độ cao các waypoint mission.
- `pause_rtl`: dừng mission, lưu điểm dừng, RTL về home, land và disarm.
- `continue_mission`: quay lại điểm dừng ở đúng độ cao lúc pause rồi tiếp tục mission. Sau khi drone disarm, node tự gửi về Position mode.
- Tất cả trạng thái publish chung qua một topic `/adaptive_mission_mode/state`.

## Topics

| Topic | Type | Chức năng |
|---|---|---|
| `/adaptive_mission_mode/mission_json` | `std_msgs/msg/String` | Nạp mission JSON |
| `/adaptive_mission_mode/activate` | `std_msgs/msg/Bool` | `true` start, `false` cancel |
| `/adaptive_mission_mode/pause_rtl` | `std_msgs/msg/Bool` | `true` dừng mission, RTL, land, disarm |
| `/adaptive_mission_mode/continue_mission` | `std_msgs/msg/Bool` | `true` quay lại điểm dừng và chạy tiếp |
| `/adaptive_mission_mode/state` | `std_msgs/msg/String` | JSON trạng thái tổng hợp |

## Build

```bash
cd ~/mission-mode-executor-arch
rm -rf build/adaptive_mission_mode install/adaptive_mission_mode log
source /opt/ros/humble/setup.bash
colcon build --symlink-install --packages-select adaptive_mission_mode
source install/setup.bash
```

## Run

```bash
ros2 launch adaptive_mission_mode adaptive_mission_mode.launch.py
```

## Test nhanh

Nạp mission:

```bash
ros2 topic pub --once /adaptive_mission_mode/mission_json std_msgs/msg/String \
"{data: '{\"version\":1,\"mission\":{\"defaults\":{\"horizontalVelocity\":5.0,\"verticalVelocity\":2.0,\"maxHeadingRate\":60.0},\"items\":[{\"type\":\"takeoff\"},{\"type\":\"navigation\",\"navigationType\":\"waypoint\",\"frame\":\"global\",\"id\":\"wp0\",\"x\":47.3977419,\"y\":8.5455939,\"z\":500.0},{\"type\":\"rtl\"}]}}'}"
```

Start:

```bash
ros2 topic pub --once /adaptive_mission_mode/activate std_msgs/msg/Bool "{data: true}"
```

Pause RTL:

```bash
ros2 topic pub --once /adaptive_mission_mode/pause_rtl std_msgs/msg/Bool "{data: true}"
```

Continue:

```bash
ros2 topic pub --once /adaptive_mission_mode/continue_mission std_msgs/msg/Bool "{data: true}"
```

Cancel:

```bash
ros2 topic pub --once /adaptive_mission_mode/activate std_msgs/msg/Bool "{data: false}"
```

Xem state:

```bash
ros2 topic echo /adaptive_mission_mode/state
```

## Logic pause / continue

Khi đang mission và gửi `pause_rtl=true`:

1. Lưu vị trí hiện tại làm `pause.point` gồm `lat`, `lon`, `alt_msl`.
2. Lưu `mission.current_index` làm `pause.resume_index`.
3. Chuyển PX4 sang RTL thật.
4. PX4 tự về home, land và disarm.
5. Node giữ state `landed_wait_continue` để chờ continue.

Khi gửi `continue_mission=true`:

- Nếu drone còn đang RTL trên không: node chọn lại `Adaptive Mission Mode`, bay về `pause.point` ở đúng `pause.point.alt_msl`, rồi tiếp tục mission.
- Nếu drone đã land và disarm: node arm lại, takeoff lên đúng `pause.point.alt_msl`, chọn lại `Adaptive Mission Mode`, bay về `pause.point`, rồi tiếp tục mission.

Altitude offset không reset khi pause/continue. Mission chính vẫn dùng `z + altitude_offset_m` sau khi resume. Riêng waypoint tạm `__return_pause_point` bay về đúng `pause.point.alt_msl`, không cộng offset lần hai.

## State JSON quan trọng cho UI

```json
{
  "state": "mission | pause_rtl | landed_wait_continue | resume_arm | resume_takeoff | return_pause_point",
  "mission_loaded": true,
  "mission_ready": true,
  "current_index": 1,
  "mission": {
    "current_item": {},
    "items": []
  },
  "altitude": {
    "offset_m": 0.0,
    "offset_active": false,
    "target_msl": 500.0
  },
  "pause": {
    "phase": "mission | rtl_landing | landed_wait_continue | return_pause_point",
    "has_pause_point": true,
    "need_takeoff": false,
    "resume_index": 1,
    "point": {
      "lat": 47.3977,
      "lon": 8.5455,
      "alt_msl": 500.0
    }
  }
}
```

Lưu ý với mission JSON `frame: global`: `z` là altitude MSL, không phải relative altitude.
