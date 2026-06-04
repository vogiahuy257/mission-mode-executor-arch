# adaptive_mission_mode

ROS 2/PX4 custom mission executor. Bản này đã clean lại theo hướng **một runtime FSM duy nhất** để tránh lỗi vá chồng vá.

## Nguyên tắc vận hành

- Callback ROS chỉ cập nhật dữ liệu hoặc event.
- `mainLoop()` là nơi duy nhất quyết định state tiếp theo.
- Command PX4 (`ARM`, `TAKEOFF`, `SET_MODE`, `POSCTL`) chỉ được gửi từ FSM trong `mainLoop()`.
- Không dùng `nav_state_user_intention` để tự start/resume mission, vì field này có thể còn giữ mode cũ sau RTL/LAND.
- Mission chỉ bị xóa khi:
  - mission completed, hoặc
  - publish `~/reset = true`.

## Luồng chính

```text
mission_json tới
→ cache raw text
→ chưa parse, chưa bay

user chọn Adaptive Mission Mode
→ parse/cache mission
→ setMission vào executor
→ nếu cần thì ARM + MAV_CMD_NAV_TAKEOFF
→ SET_MODE Adaptive
→ RUNNING

đang RUNNING mà user chọn mode khác / RTL / LAND
→ lưu snapshot cuối cùng
→ giữ mission cũ trong executor
→ state = external_interrupted_wait_selection

user chọn Adaptive lại
→ nếu cần thì takeoff tới altitude snapshot
→ vào Adaptive Mode
→ bay về snapshot
→ tới snapshot thì unblock executor
→ mission cũ chạy tiếp

mission completed hoặc ~/reset
→ clear cache/runtime/snapshot
→ POSCTL một lần
```

## Topic quan trọng

### Nạp mission

```bash
ros2 topic pub --once /adaptive_mission_mode/mission_json std_msgs/msg/String \
"{data: '{\"version\":1,\"mission\":{\"items\":[{\"type\":\"takeoff\"},{\"type\":\"rtl\"}]}}'}"
```

Hoặc chạy `fc_mission_reader` để publish:

```text
/fc_mission_reader/mission_json
```

### Reset mission/cache/snapshot

```bash
ros2 topic pub --once /adaptive_mission_mode/reset std_msgs/msg/Bool "{data: true}"
```

### Xem state

```bash
ros2 topic echo /adaptive_mission_mode/state
```

State chính:

```text
idle
no_mission_standby
mission_cached_wait_mode
loading_mission
pre_takeoff
wait_adaptive_activation
running
external_interrupted_wait_selection
resume_takeoff
wait_adaptive_activation_for_resume
return_to_snapshot
completed
error
```

## Build

```bash
cd ~/mission-mode-executor-arch
source /opt/ros/humble/setup.bash
colcon build --symlink-install --packages-select adaptive_mission_mode
```
