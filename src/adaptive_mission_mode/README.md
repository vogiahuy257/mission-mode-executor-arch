# adaptive_mission_mode

ROS 2 / PX4 custom mission mode package.

## Logic chính của bản này

Bản này dùng logic **external mode interruption resume**:

```text
mission_json
→ chỉ cache mission text
→ chưa parse/chạy

User chọn Adaptive Mission Mode
→ parse mission cache
→ set mission vào executor
→ auto ARM/TAKEOFF nếu cần
→ chạy mission

Trong khi đang bay
→ main loop lưu snapshot liên tục: lat/lon/alt/current_index/altitude_offset

User chọn mode khác bất ngờ, ví dụ POSCTL/ALTCTL/RTL/LAND
→ onDeactivated chỉ đánh dấu externalInterrupted
→ KHÔNG xóa mission
→ KHÔNG build resume mission
→ KHÔNG setMission lại

User chọn lại Adaptive Mission Mode
→ dùng mission cũ còn trong bộ nhớ
→ nếu cần thì ARM/TAKEOFF lại đến altitude snapshot
→ bay về snapshot
→ return_to_snapshot xong thì unblock executor
→ executor tiếp tục mission cũ

Mission chỉ bị xóa khi:
→ mission completed
→ hoặc nhận topic /adaptive_mission_mode/reset
```

## Cấu trúc code

```text
include/adaptive_mission_mode/
├── app/        # ROS node wiring, main loop, state JSON
├── control/    # PX4 command, altitude offset, trajectory executor
├── mission/    # mission model, parser
└── runtime/    # PX4 MissionExecutor

src/
├── app/
├── control/
├── mission/
└── runtime/
```

## Build

```bash
cd ~/mission-mode-executor-arch
source /opt/ros/humble/setup.bash

colcon build --symlink-install \
  --packages-select px4_msgs px4_ros2_cpp adaptive_mission_mode

source install/setup.bash
```

## Run

```bash
ros2 launch adaptive_mission_mode adaptive_mission_mode.launch.py
```

## Topic vào

### Nạp mission

```bash
ros2 topic pub --once /adaptive_mission_mode/mission_json std_msgs/msg/String \
  "{data: '{\"version\":1,\"mission\":{\"items\":[{\"type\":\"takeoff\",\"altitude\":20.0},{\"type\":\"rtl\"}]}}'}"
```

Node cũng nghe mission từ:

```text
/fc_mission_reader/mission_json
```

Mission mới chỉ được cache. Mission chỉ load thật khi user chọn Adaptive Mission Mode.

### Reset mission/cache/snapshot

```bash
ros2 topic pub --once /adaptive_mission_mode/reset std_msgs/msg/Bool "{data: true}"
```

Reset sẽ:

```text
abort executor
xóa mission cache
xóa runtime mission
xóa snapshot
xóa externalInterrupted
chuyển PX4 về POSCTL
```

## Topic trạng thái

```bash
ros2 topic echo /adaptive_mission_mode/state
```

Các trường quan trọng:

```text
state
mission_cached
mission_loaded
mission_runtime_loaded
mission_ready
external_interrupted
return_to_snapshot_active
mission_control_blocked
mission_snapshot
current_index
altitude_offset_m
vehicle
```

## State chính

```text
idle
mission_cached_wait_mode
mission_loaded_on_mode_select
pre_takeoff
mav_takeoff
select_adaptive_after_takeoff
mission
external_interrupted_wait_mode
return_to_snapshot
done
```

## Param mới

```yaml
snapshot_return_acceptance_m: 1.5
snapshot_return_horizontal_velocity: 3.0
snapshot_return_vertical_velocity: 2.0
snapshot_return_max_heading_rate: 60.0
state_publish_period_s: 1.0
```
