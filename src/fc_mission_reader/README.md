# fc_mission_reader

ROS 2 C++ node đọc mission đang lưu trong FC bằng MAVLink Mission Protocol, convert sang JSON, publish lên topic ROS 2 và lưu file cache.

Bản này đã đổi sang **event-sync + verified cache + continuous publish khi FC có mission**:

- Node **không publish cache cũ trước khi xác nhận với FC**.
- Sau khi đã sync thành công và FC có mission, node sẽ publish lại JSON mission hiện tại liên tục theo `poll_period_s`.
- Khi khởi động, node luôn hỏi FC trước để xác nhận trạng thái mission hiện tại.
- Khi FC nhận mission mới, node tự phát hiện qua `MISSION_CURRENT.mission_id`, `MISSION_CURRENT.total` hoặc `MISSION_ACK.opaque_id` rồi tải lại full mission một lần.
- Nếu mission trên FC bị xóa hoặc FC báo không có mission (`MISSION_COUNT.count = 0`), node sẽ ghi/publish JSON mission rỗng để không giữ mission cũ.
- Fallback mặc định bật: node gửi `MISSION_REQUEST_LIST` nhẹ mỗi `fallback_count_poll_s` giây để bắt trường hợp firmware không stream mission id, hoặc khi mission bị xóa mà `MISSION_CURRENT` không đủ thông tin.

## Luồng hoạt động

```text
Start node
  ↓
Load cache file nếu có, nhưng chưa publish ngay
  ↓
Request MISSION_COUNT từ FC để sync trạng thái thật
  ↓
Nếu count = 0:
    publish/save JSON mission rỗng
Nếu count > 0:
    download full mission
    build JSON
    publish/save, sau đó publish lại liên tục theo poll_period_s
  ↓
Trong lúc chạy:
    nghe MISSION_CURRENT / MISSION_ACK
    nếu mission id, opaque id hoặc total đổi → sync lại
    nếu không có event → fallback MISSION_COUNT mỗi 5s
```

## Output topic

```bash
/fc_mission_reader/mission_json
```

Topic dùng QoS `transient_local`. Với bản này:

1. Startup chưa sync FC xong thì **không spam cache cũ**.
2. Nếu FC có mission (`MISSION_COUNT.count > 0`) và JSON đã được tải thành công, node publish `/fc_mission_reader/mission_json` liên tục theo `poll_period_s`.
3. Nếu mission trên FC đổi, node tải lại full mission, update JSON/cache, rồi tiếp tục publish JSON mới.
4. Nếu mission trên FC bị xóa / `count = 0`, node publish/save JSON rỗng một lần để xóa trạng thái cũ, sau đó không spam mission cũ nữa.

## Tham số quan trọng

```text
publish_cached_mission_continuously=true  # publish JSON mission liên tục nếu FC đang có mission
poll_period_s=1.0                         # chu kỳ publish khi mission không đổi
enable_fallback_count_poll=true           # vẫn kiểm tra MISSION_COUNT để bắt xóa mission
fallback_count_poll_s=5.0                 # chu kỳ hỏi nhẹ MISSION_COUNT
```

## Build

```bash
cd ~/mission-mode-executor-arch/src
rm -rf fc_mission_reader
unzip /path/to/fc_mission_reader_event_sync_v3.zip

cd ~/mission-mode-executor-arch
source /opt/ros/humble/setup.bash
colcon build --symlink-install --packages-select fc_mission_reader
source install/setup.bash
```

Nếu trước đó install còn file cache cũ, có thể xóa để test sạch:

```bash
rm -f ~/mission-mode-executor-arch/install/fc_mission_reader/share/fc_mission_reader/data.json
rm -f ~/mission-mode-executor-arch/src/fc_mission_reader/data.json
```

Không bắt buộc xóa, vì node sẽ tự overwrite khi sync được FC.

## Run

Ví dụ dùng `mavlink-router` forward MAVLink tới port 14551:

```bash
mavlink-routerd \
  -e 127.0.0.1:14550 \
  -e 127.0.0.1:14551 \
  0.0.0.0:14550
```

Chạy node:

```bash
ros2 launch fc_mission_reader fc_mission_reader.launch.py \
  bind_ip:=0.0.0.0 \
  bind_port:=14551 \
  auto_target:=true \
  poll_period_s:=1.0 \
  publish_cached_mission_continuously:=true \
  enable_fallback_count_poll:=true \
  fallback_count_poll_s:=5.0
```

Nếu `auto_target:=true`, node tự học peer MAVLink từ packet nhận được. Nếu muốn chỉ định cứng:

```bash
ros2 launch fc_mission_reader fc_mission_reader.launch.py \
  auto_target:=false \
  target_ip:=127.0.0.1 \
  target_port:=14550
```

```bash
ros2 launch fc_mission_reader fc_mission_reader.launch.py \
  auto_target:=true \
  bind_port:=14550 \
  publish_cached_mission_continuously:=true \
  enable_fallback_count_poll:=true \
  fallback_count_poll_s:=0.5
```

## Kiểm tra

Echo JSON:

```bash
ros2 topic echo /fc_mission_reader/mission_json
```

Xem file cache:

```bash
cat ~/mission-mode-executor-arch/install/fc_mission_reader/share/fc_mission_reader/data.json | jq .
```

Nếu dùng `--symlink-install`, file có thể nằm ở source package:

```bash
cat ~/mission-mode-executor-arch/src/fc_mission_reader/data.json | jq .
```

## Test xóa mission trên FC

Sau khi xóa mission bằng QGC hoặc backend, node sẽ nhận `MISSION_COUNT.count = 0` ở lần fallback poll kế tiếp và publish JSON dạng rỗng:

```json
{
  "ok": true,
  "item_count": 0,
  "mission": {
    "version": 1,
    "mission": {
      "items": []
    }
  },
  "raw_items": []
}
```

Nhờ vậy adaptive/backend sẽ không còn đọc nhầm mission cũ trong `data.json`.

## Gợi ý dùng với adaptive_mission_mode

Không nên để adaptive tự chạy ngay khi topic có message. Flow an toàn hơn:

```text
fc_mission_reader chỉ giữ JSON mission hiện tại của FC
adaptive_mission_mode chỉ load JSON khi user chọn active mode
mission hoàn thành → adaptive tự clear runtime mission của nó
mission bị xóa trên FC → fc_mission_reader publish mission rỗng
```

## v4 note

- Request MAVLink mission is sent to all valid known endpoints: configured target, learned/observed MAVLink peer.
- If `target_port` equals `bind_port` on localhost, the node skips that self-loop target and uses the observed MAVLink peer instead.
- This avoids the common case where the node can see `MISSION_CURRENT` but cannot receive `MISSION_COUNT` because the manual target port is the local listening port.
