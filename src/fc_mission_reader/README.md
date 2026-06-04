# fc_mission_reader - passive MAVLink mission observer

Node này chạy trên ROS 2 C++ và quan sát MAVLink Mission Protocol theo kiểu **passive sniffer**.
Nó không gửi `MISSION_REQUEST_LIST`, không gửi `MISSION_REQUEST_INT`, không gửi `MISSION_ACK`, nên không chen vào transaction mission của QGC/backend với FC.

## Mục tiêu

- QGC/backend upload mission mới lên FC -> node nghe các gói `MISSION_COUNT` + `MISSION_ITEM_INT/ITEM` + `MISSION_ACK ACCEPTED` -> build JSON -> publish một lần.
- QGC/backend xóa mission trên FC -> node nghe `MISSION_CLEAR_ALL` + `MISSION_ACK ACCEPTED` hoặc `MISSION_CURRENT.total=0` -> publish JSON rỗng một lần.
- Nếu node thấy FC báo mission metadata đổi qua `MISSION_CURRENT.mission_id/total` nhưng không bắt được full transfer -> ghi/publish trạng thái `unknown_remote_mission` để tránh dùng lại mission cache cũ.
- Không publish cache cũ liên tục.
- Publish reset `/adaptive_mission_mode/reset` chỉ khi mission thật sự đổi/xóa/unknown, có chống spam bằng signature + min interval.

## Giới hạn của passive mode

Passive observer chỉ biết full waypoint khi nó nhìn thấy full MAVLink transfer đi qua router.
Nếu node khởi động sau khi FC đã có sẵn mission và không có ai upload/download lại, node chỉ biết metadata từ `MISSION_CURRENT`, không thể biết full waypoint nếu không chủ động hỏi FC.
Trong trường hợp đó, node không replay cache cũ. Nếu metadata khác cache, node ghi trạng thái `unknown_remote_mission`.

## Luồng MAVLink nên dùng

Ví dụ mavlink-router đang nhận MAVLink ở port 14550 và QGC ở `10.5.10.25`:

```bash
mavlink-routerd \
  -e 10.5.10.25:14550 \
  -e 127.0.0.1:14551 \
  0.0.0.0:14550
```

`127.0.0.1:14551` là endpoint nội bộ cho node nếu node chạy cùng máy với mavlink-routerd.

## Build

```bash
cd ~/mission-mode-executor-arch/src
rm -rf fc_mission_reader
unzip /path/to/fc_mission_reader_passive_observer.zip
mv fc_mission_reader_passive_observer fc_mission_reader

cd ~/mission-mode-executor-arch
source /opt/ros/humble/setup.bash
colcon build --symlink-install --packages-select fc_mission_reader
source install/setup.bash
```

## Run

```bash
ros2 launch fc_mission_reader fc_mission_reader.launch.py \
  bind_ip:=0.0.0.0 \
  bind_port:=14551 \
  publish_reset_on_mission_change:=true \
  adaptive_reset_topic:=/adaptive_mission_mode/reset
```

## Topics

### Publish

- `~/mission_json` (`std_msgs/msg/String`)
  - Thực tế: `/fc_mission_reader/mission_json`
  - QoS: transient local, depth 1.
  - Chỉ publish khi có event cần thiết, không publish timer spam.

- `/adaptive_mission_mode/reset` (`std_msgs/msg/Bool`)
  - Chỉ publish `true` một lần khi mission đổi/xóa/unknown và signature mới.

## JSON status

### Mission sẵn sàng

```json
{
  "ok": true,
  "source": "mavlink_passive_observer",
  "status": "ready",
  "item_count": 3,
  "mission": {"version": 1, "mission": {"items": []}},
  "raw_items": []
}
```

### Mission rỗng / đã xóa

```json
{
  "ok": true,
  "source": "mavlink_passive_observer",
  "status": "empty",
  "item_count": 0,
  "mission": {"version": 1, "mission": {"items": []}},
  "raw_items": []
}
```

### Mission không rõ full waypoint

```json
{
  "ok": false,
  "source": "mavlink_passive_observer",
  "status": "unknown_remote_mission",
  "item_count": 7,
  "mission": {"version": 1, "mission": {"items": []}},
  "raw_items": []
}
```

Trạng thái `unknown_remote_mission` dùng để tránh replay mission cũ khi FC báo mission đã đổi nhưng node không nhìn thấy đầy đủ waypoint.

## Parameters

- `bind_ip`: mặc định `0.0.0.0`.
- `bind_port`: mặc định `14551`.
- `poll_period_s`: mặc định `0.02`.
- `read_budget_ms`: mặc định `50`.
- `transfer_timeout_s`: mặc định `8.0`.
- `publish_reset_on_mission_change`: mặc định `true`.
- `publish_reset_on_startup_change`: mặc định `false`.
- `reset_publish_min_interval_s`: mặc định `1.0`.
- `adaptive_reset_topic`: mặc định `/adaptive_mission_mode/reset`.
- `publish_unknown_on_remote_change`: mặc định `true`.
- `publish_empty_from_mission_current`: mặc định `true`.
- `output_file`: nếu rỗng sẽ dùng `share/fc_mission_reader/data.json`.

## Kiểm tra

```bash
ros2 topic echo /fc_mission_reader/mission_json
ros2 topic echo /adaptive_mission_mode/reset
```

Khi QGC upload mission mới, node sẽ log `observed mission upload count`, sau đó `FC accepted observed mission upload`, rồi publish JSON một lần.
