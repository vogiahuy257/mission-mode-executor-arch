#include "fc_mission_reader/fc_mission_reader.hpp"

#include <ament_index_cpp/get_package_share_directory.hpp>

#include <fcntl.h>
#include <sys/select.h>

#include <algorithm>
#include <cctype>
#include <filesystem>
#include <functional>
#include <fstream>
#include <iomanip>
#include <limits>
#include <sstream>
#include <thread>

namespace fc_mission_reader
{

using namespace std::chrono_literals;

FcMissionReader::FcMissionReader(const rclcpp::NodeOptions & options)
: Node("fc_mission_reader", options)
{
  bind_ip_ = declare_parameter<std::string>("bind_ip", "0.0.0.0");
  bind_port_ = declare_parameter<int>("bind_port", 14551);
  target_ip_ = declare_parameter<std::string>("target_ip", "127.0.0.1");
  target_port_ = declare_parameter<int>("target_port", 14550);
  auto_target_ = declare_parameter<bool>("auto_target", true);
  poll_period_s_ = declare_parameter<double>("poll_period_s", 1.0);
  enable_fallback_count_poll_ = declare_parameter<bool>("enable_fallback_count_poll", true);
  fallback_count_poll_s_ = declare_parameter<double>("fallback_count_poll_s", 5.0);
  publish_cached_mission_continuously_ = declare_parameter<bool>("publish_cached_mission_continuously", true);
  timeout_ms_ = declare_parameter<int>("timeout_ms", 3000);
  retries_ = declare_parameter<int>("retries", 3);
  output_file_ = declare_parameter<std::string>("output_file", "");

  if (output_file_.empty()) {
    output_file_ = defaultOutputFile();
  }

  pub_ = create_publisher<std_msgs::msg::String>("~/mission_json", rclcpp::QoS(1).transient_local());
  loadCache();
  requestMissionSync("startup initial sync");

  if (!openSocket()) {
    RCLCPP_ERROR(get_logger(), "Cannot open UDP socket. Reader will still run but cannot download mission.");
  }

  const auto period = std::chrono::duration<double>(std::max(0.5, poll_period_s_));
  timer_ = create_wall_timer(std::chrono::duration_cast<std::chrono::milliseconds>(period),
    std::bind(&FcMissionReader::poll, this));

  RCLCPP_INFO(get_logger(), "FC mission reader ready: bind %s:%d, auto_target=%s, fallback target %s:%d, output %s",
    bind_ip_.c_str(), bind_port_, auto_target_ ? "true" : "false", target_ip_.c_str(), target_port_, output_file_.c_str());
  RCLCPP_INFO(get_logger(), "Event-sync v4 mode: publish_cached_mission_continuously=%s, poll %.2fs, fallback_count_poll=%s %.2fs",
    publish_cached_mission_continuously_ ? "true" : "false", poll_period_s_,
    enable_fallback_count_poll_ ? "true" : "false", fallback_count_poll_s_);
}

FcMissionReader::~FcMissionReader()
{
  if (sock_ >= 0) {
    close(sock_);
  }
}

bool FcMissionReader::openSocket()
{
  sock_ = socket(AF_INET, SOCK_DGRAM, 0);
  if (sock_ < 0) {
    return false;
  }

  int opt = 1;
  setsockopt(sock_, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

  sockaddr_in bind_addr{};
  bind_addr.sin_family = AF_INET;
  bind_addr.sin_port = htons(static_cast<uint16_t>(bind_port_));
  bind_addr.sin_addr.s_addr = inet_addr(bind_ip_.c_str());

  if (bind(sock_, reinterpret_cast<sockaddr *>(&bind_addr), sizeof(bind_addr)) < 0) {
    RCLCPP_ERROR(get_logger(), "bind(%s:%d) failed", bind_ip_.c_str(), bind_port_);
    close(sock_);
    sock_ = -1;
    return false;
  }

  target_addr_.sin_family = AF_INET;
  target_addr_.sin_port = htons(static_cast<uint16_t>(target_port_));
  target_addr_.sin_addr.s_addr = inet_addr(target_ip_.c_str());
  return true;
}

void FcMissionReader::poll()
{
  if (busy_ || sock_ < 0) {
    return;
  }

  busy_ = true;
  drainEvents(20);

  const bool due_count_poll = shouldPollMissionInfo();
  if (!force_download_ && !shouldInitialDownload() && !due_count_poll) {
    publishCachedMissionContinuously();
    busy_ = false;
    return;
  }

  const bool was_initial_sync = !initial_sync_done_;
  const std::string reason = force_download_ ? sync_reason_ :
    (was_initial_sync ? "startup initial sync" : "fallback mission count poll");

  uint16_t count = 0;
  uint32_t opaque_id = 0;
  bool info_ok = false;
  for (int attempt = 0; attempt < retries_ && !info_ok; ++attempt) {
    info_ok = readMissionInfo(count, opaque_id);
  }
  last_count_poll_ = now();

  if (!info_ok) {
    // Không publish lỗi lặp lại lên mission_json, vì topic này được dùng như dữ liệu mission.
    // Nếu node đã thấy MISSION_CURRENT thì rõ ràng FC có telemetry; lỗi thường là sai endpoint
    // gửi MISSION_REQUEST_LIST, không phải mission rỗng. Giữ cache hiện tại và chỉ log cảnh báo.
    if (!initial_sync_done_ && !has_cache_ && !startup_failure_published_ && !remote_total_valid_) {
      publishFailure("failed to read mission count from FC");
      startup_failure_published_ = true;
    }
    RCLCPP_WARN_THROTTLE(get_logger(), *get_clock(), 5000,
      "Mission sync skipped, cannot read MISSION_COUNT from FC. reason=%s observed_total_valid=%s observed_total=%u observed_peer=%s",
      reason.c_str(), remote_total_valid_ ? "true" : "false", remote_total_,
      has_observed_peer_ ? addrText(observed_peer_addr_).c_str() : "none");
    if (!force_download_ && initial_sync_done_) {
      publishCachedMissionContinuously();
    }
    busy_ = false;
    return;
  }

  startup_failure_published_ = false;
  initial_sync_done_ = true;
  remote_total_valid_ = true;
  remote_total_ = count;
  remote_reported_empty_ = (count == 0U);
  if (opaque_id != 0U) {
    remote_mission_id_valid_ = true;
    remote_mission_id_ = opaque_id;
  }

  if (count == 0U) {
    handleEmptyMission(opaque_id, reason, was_initial_sync);
    force_download_ = false;
    sync_reason_.clear();
    busy_ = false;
    return;
  }

  if (!force_download_ && !shouldDownload(count, opaque_id)) {
    RCLCPP_DEBUG(get_logger(),
      "Mission unchanged: count=%u opaque=%u cached_hash=%s", count, opaque_id, cached_hash_.c_str());
    publishCachedMissionContinuously();
    busy_ = false;
    return;
  }

  RCLCPP_WARN(get_logger(), "Mission sync required (%s), downloading full mission once", reason.c_str());

  std::vector<MissionItem> items;
  bool items_ok = false;
  for (int attempt = 0; attempt < retries_ && !items_ok; ++attempt) {
    items_ok = readMissionItems(count, items);
  }

  if (!items_ok) {
    RCLCPP_WARN(get_logger(),
      "Mission item download failed, not publishing cached mission to avoid replaying stale mission");
    busy_ = false;
    return;
  }

  sendAck();

  const std::string json = buildJson(items, count, opaque_id);
  const std::string hash = extractString(json, "hash");
  const bool changed = !has_cache_ || hash != cached_hash_ || count != cached_count_ ||
    (opaque_id != 0U && opaque_id != cached_opaque_id_);

  if (changed || was_initial_sync) {
    updateCache(json, count, opaque_id, hash);
    publishAndSave(cached_json_);
    if (changed) {
      RCLCPP_INFO(get_logger(), "Mission JSON updated: count=%u opaque=%u hash=%s", count, opaque_id, hash.c_str());
    } else {
      RCLCPP_INFO(get_logger(), "Mission JSON verified and published once at startup: count=%u opaque=%u hash=%s",
        count, opaque_id, hash.c_str());
    }
  } else {
    last_full_download_ = now();
    publishCachedMissionContinuously();
    RCLCPP_INFO(get_logger(), "Mission sync completed but content unchanged: count=%u opaque=%u hash=%s",
      count, opaque_id, cached_hash_.c_str());
  }

  force_download_ = false;
  sync_reason_.clear();
  busy_ = false;
}

void FcMissionReader::drainEvents(int timeout_ms)
{
  const auto start = now();
  while ((now() - start).nanoseconds() / 1000000 < timeout_ms) {
    mavlink_message_t msg;
    if (!readMessage(msg, 1)) {
      return;
    }
  }
}

void FcMissionReader::observeMessage(const mavlink_message_t & msg)
{
  if (msg.sysid == own_sysid_) {
    return;
  }

  if (msg.msgid == MAVLINK_MSG_ID_MISSION_CURRENT) {
    mavlink_mission_current_t cur;
    mavlink_msg_mission_current_decode(&msg, &cur);
    target_sysid_ = msg.sysid;
    target_compid_ = msg.compid;

    remote_total_valid_ = true;

    if (cur.total > 0U) {
      mission_current_total_supported_ = true;
      remote_total_ = cur.total;
      remote_reported_empty_ = false;

      if (has_cache_ && cur.total != cached_count_) {
        RCLCPP_WARN(get_logger(), "Mission total changed from %u to %u", cached_count_, cur.total);
        requestMissionSync("MISSION_CURRENT total changed");
        return;
      }
    } else if (mission_current_total_supported_) {
      remote_total_ = 0;
      if (!remote_reported_empty_) {
        RCLCPP_WARN(get_logger(), "FC reports no mission in MISSION_CURRENT total=0");
      }
      remote_reported_empty_ = true;
      requestMissionSync("FC reports mission total=0");
      return;
    }

    if (cur.mission_id != 0U) {
      if (!remote_mission_id_valid_) {
        remote_mission_id_valid_ = true;
        remote_mission_id_ = cur.mission_id;
        if (has_cache_ && cached_opaque_id_ != 0U && cached_opaque_id_ != cur.mission_id) {
          requestMissionSync("MISSION_CURRENT mission_id differs from cache");
        }
        RCLCPP_INFO(get_logger(), "MissionCurrent mission_id=%u total=%u", cur.mission_id, cur.total);
        return;
      }

      if (cur.mission_id != remote_mission_id_) {
        RCLCPP_WARN(get_logger(), "Mission id changed: %u -> %u", remote_mission_id_, cur.mission_id);
        remote_mission_id_ = cur.mission_id;
        requestMissionSync("MISSION_CURRENT mission_id changed");
      }
    }
    return;
  }

  if (msg.msgid == MAVLINK_MSG_ID_MISSION_ACK) {
    mavlink_mission_ack_t ack;
    mavlink_msg_mission_ack_decode(&msg, &ack);
    if (ack.mission_type == mission_type_ && ack.type == MAV_MISSION_ACCEPTED) {
      if (ack.opaque_id != 0U) {
        if (!remote_mission_id_valid_ || ack.opaque_id != remote_mission_id_) {
          RCLCPP_WARN(get_logger(), "Mission ACK accepted with new opaque_id=%u", ack.opaque_id);
          remote_mission_id_valid_ = true;
          remote_mission_id_ = ack.opaque_id;
          requestMissionSync("MISSION_ACK opaque_id changed");
        }
      } else {
        requestMissionSync("MISSION_ACK accepted without opaque_id");
      }
    }
  }
}

void FcMissionReader::requestMissionSync(const std::string & reason)
{
  force_download_ = true;
  if (sync_reason_.empty() || sync_reason_ == "startup") {
    sync_reason_ = reason;
  }
}

void FcMissionReader::handleEmptyMission(uint32_t opaque_id, const std::string & reason, bool publish_even_if_unchanged)
{
  std::vector<MissionItem> items;
  const std::string json = buildJson(items, 0, opaque_id);
  const std::string hash = extractString(json, "hash");
  const bool changed = !has_cache_ || cached_count_ != 0U || cached_hash_ != hash ||
    (opaque_id != 0U && cached_opaque_id_ != opaque_id);

  updateCache(json, 0, opaque_id, hash);
  if (opaque_id == 0U) {
    remote_mission_id_valid_ = false;
    remote_mission_id_ = 0;
  }

  if (changed || publish_even_if_unchanged) {
    publishAndSave(cached_json_);
    if (changed) {
      RCLCPP_WARN(get_logger(), "Mission JSON cleared because FC has no mission. reason=%s opaque=%u hash=%s",
        reason.c_str(), opaque_id, hash.c_str());
    } else {
      RCLCPP_INFO(get_logger(), "Empty mission JSON verified and published once at startup");
    }
  } else {
    last_full_download_ = now();
    RCLCPP_DEBUG(get_logger(), "FC still has no mission, empty JSON unchanged");
  }
}

bool FcMissionReader::missionIdChanged() const
{
  return remote_mission_id_valid_ && cached_opaque_id_ != 0U && remote_mission_id_ != cached_opaque_id_;
}

bool FcMissionReader::readMissionInfo(uint16_t & count, uint32_t & opaque_id)
{
  if (readMissionInfoFromCurrentEndpoint(count, opaque_id)) {
    return true;
  }

  // Khi auto_target=false, người dùng có thể cấu hình nhầm target_port là cổng telemetry
  // của GCS/router. Trường hợp này node vẫn nhìn thấy MISSION_CURRENT nhưng FC không nhận
  // được MISSION_REQUEST_LIST. Nếu đã quan sát được peer đang gửi MAVLink vào bind_port,
  // thử gửi request ngược về đúng peer đó một lần để tự phục hồi.
  if (!auto_target_ && has_observed_peer_ && !prefer_observed_peer_for_requests_) {
    RCLCPP_WARN(get_logger(),
      "MISSION_COUNT not received from manual target %s:%d. Retrying via observed MAVLink peer %s",
      target_ip_.c_str(), target_port_, addrText(observed_peer_addr_).c_str());

    prefer_observed_peer_for_requests_ = true;
    const bool ok = readMissionInfoFromCurrentEndpoint(count, opaque_id);
    if (ok) {
      RCLCPP_WARN(get_logger(),
        "Mission requests will keep using observed MAVLink peer %s. Manual target was probably not the FC input port.",
        addrText(observed_peer_addr_).c_str());
      return true;
    }

    prefer_observed_peer_for_requests_ = false;
  }

  return false;
}

bool FcMissionReader::readMissionInfoFromCurrentEndpoint(uint16_t & count, uint32_t & opaque_id)
{
  if (!waitHeartbeat()) {
    RCLCPP_WARN_THROTTLE(get_logger(), *get_clock(), 5000,
      "No MAVLink heartbeat. Using target sys=%u comp=%u", target_sysid_, target_compid_);
  }

  for (int attempt = 0; attempt < retries_; ++attempt) {
    sendRequestList();
    if (waitCount(count, opaque_id)) {
      return true;
    }
  }

  return false;
}

bool FcMissionReader::readMissionItems(uint16_t count, std::vector<MissionItem> & items)
{
  items.clear();
  items.resize(count);

  for (uint16_t seq = 0; seq < count; ++seq) {
    MissionItem item;
    bool got = false;
    for (int retry = 0; retry < retries_ && !got; ++retry) {
      sendRequestItem(seq);
      got = waitItem(seq, item);
    }

    if (!got) {
      RCLCPP_WARN(get_logger(), "Missing mission item seq=%u", seq);
      return false;
    }

    items[seq] = item;
  }

  return true;
}

bool FcMissionReader::readMission(std::vector<MissionItem> & items, uint16_t & count, uint32_t & opaque_id)
{
  if (!readMissionInfo(count, opaque_id)) {
    return false;
  }

  if (!readMissionItems(count, items)) {
    return false;
  }

  sendAck();
  return true;
}

bool FcMissionReader::waitHeartbeat()
{
  const auto start = now();
  while ((now() - start).seconds() < 1.0) {
    mavlink_message_t msg;
    if (!readMessage(msg, 200)) {
      continue;
    }

    if (msg.msgid == MAVLINK_MSG_ID_HEARTBEAT) {
      mavlink_heartbeat_t hb;
      mavlink_msg_heartbeat_decode(&msg, &hb);
      if (hb.type != MAV_TYPE_GCS) {
        target_sysid_ = msg.sysid;
        target_compid_ = msg.compid;
        return true;
      }
    }
  }

  return false;
}

bool FcMissionReader::waitCount(uint16_t & count, uint32_t & opaque_id)
{
  const auto start = now();
  while ((now() - start).nanoseconds() / 1000000 < timeout_ms_) {
    mavlink_message_t msg;
    if (!readMessage(msg, 200)) {
      continue;
    }

    if (msg.msgid == MAVLINK_MSG_ID_MISSION_COUNT) {
      mavlink_mission_count_t c;
      mavlink_msg_mission_count_decode(&msg, &c);
      if (c.mission_type == mission_type_) {
        count = c.count;
        opaque_id = c.opaque_id;
        target_sysid_ = msg.sysid;
        target_compid_ = msg.compid;
        return true;
      }
    }
  }

  return false;
}

bool FcMissionReader::waitItem(uint16_t seq, MissionItem & item)
{
  const auto start = now();
  while ((now() - start).nanoseconds() / 1000000 < timeout_ms_) {
    mavlink_message_t msg;
    if (!readMessage(msg, 200)) {
      continue;
    }

    if (msg.msgid == MAVLINK_MSG_ID_MISSION_ITEM_INT) {
      mavlink_mission_item_int_t it;
      mavlink_msg_mission_item_int_decode(&msg, &it);
      if (it.seq != seq || it.mission_type != mission_type_) {
        continue;
      }

      item.ok = true;
      item.is_int = true;
      item.seq = it.seq;
      item.frame = it.frame;
      item.command = it.command;
      item.current = it.current;
      item.autocontinue = it.autocontinue;
      item.mission_type = it.mission_type;
      item.p1 = it.param1;
      item.p2 = it.param2;
      item.p3 = it.param3;
      item.p4 = it.param4;
      item.x = static_cast<double>(it.x) / 1.0e7;
      item.y = static_cast<double>(it.y) / 1.0e7;
      item.z = it.z;
      return true;
    }

    if (msg.msgid == MAVLINK_MSG_ID_MISSION_ITEM) {
      mavlink_mission_item_t it;
      mavlink_msg_mission_item_decode(&msg, &it);
      if (it.seq != seq || it.mission_type != mission_type_) {
        continue;
      }

      item.ok = true;
      item.is_int = false;
      item.seq = it.seq;
      item.frame = it.frame;
      item.command = it.command;
      item.current = it.current;
      item.autocontinue = it.autocontinue;
      item.mission_type = it.mission_type;
      item.p1 = it.param1;
      item.p2 = it.param2;
      item.p3 = it.param3;
      item.p4 = it.param4;
      item.x = it.x;
      item.y = it.y;
      item.z = it.z;
      return true;
    }
  }

  return false;
}

bool FcMissionReader::readMessage(mavlink_message_t & msg, int timeout_ms)
{
  fd_set fds;
  FD_ZERO(&fds);
  FD_SET(sock_, &fds);

  timeval tv{};
  tv.tv_sec = timeout_ms / 1000;
  tv.tv_usec = (timeout_ms % 1000) * 1000;

  const int ret = select(sock_ + 1, &fds, nullptr, nullptr, &tv);
  if (ret <= 0 || !FD_ISSET(sock_, &fds)) {
    return false;
  }

  uint8_t buffer[2048];
  sockaddr_in src{};
  socklen_t src_len = sizeof(src);
  const ssize_t len = recvfrom(sock_, buffer, sizeof(buffer), 0,
    reinterpret_cast<sockaddr *>(&src), &src_len);
  if (len <= 0) {
    return false;
  }

  mavlink_status_t status{};
  for (ssize_t i = 0; i < len; ++i) {
    if (mavlink_parse_char(MAVLINK_COMM_0, buffer[i], &msg, &status)) {
      rememberSender(src, msg);
      observeMessage(msg);
      return true;
    }
  }

  return false;
}

void FcMissionReader::rememberSender(const sockaddr_in & src, const mavlink_message_t & msg)
{
  if (msg.sysid == own_sysid_) {
    return;
  }

  if (msg.msgid == MAVLINK_MSG_ID_HEARTBEAT) {
    mavlink_heartbeat_t hb;
    mavlink_msg_heartbeat_decode(&msg, &hb);
    if (hb.type == MAV_TYPE_GCS) {
      return;
    }
  }

  if (!has_observed_peer_ || src.sin_addr.s_addr != observed_peer_addr_.sin_addr.s_addr ||
    src.sin_port != observed_peer_addr_.sin_port)
  {
    observed_peer_addr_ = src;
    has_observed_peer_ = true;
    RCLCPP_INFO(get_logger(), "Observed MAVLink peer %s from msgid=%u sys=%u comp=%u",
      addrText(observed_peer_addr_).c_str(), msg.msgid, msg.sysid, msg.compid);
  }

  if (!auto_target_) {
    return;
  }

  if (!has_learned_target_ || src.sin_addr.s_addr != learned_addr_.sin_addr.s_addr ||
    src.sin_port != learned_addr_.sin_port)
  {
    learned_addr_ = src;
    has_learned_target_ = true;
    RCLCPP_INFO(get_logger(), "Learned MAVLink peer %s from msgid=%u sys=%u comp=%u",
      addrText(learned_addr_).c_str(), msg.msgid, msg.sysid, msg.compid);
  }
}

std::string FcMissionReader::addrText(const sockaddr_in & addr) const
{
  char ip[INET_ADDRSTRLEN]{};
  inet_ntop(AF_INET, &addr.sin_addr, ip, sizeof(ip));
  std::ostringstream ss;
  ss << ip << ":" << ntohs(addr.sin_port);
  return ss.str();
}

void FcMissionReader::sendMessage(const mavlink_message_t & msg)
{
  uint8_t buffer[MAVLINK_MAX_PACKET_LEN];
  const uint16_t len = mavlink_msg_to_send_buffer(buffer, &msg);

  // Gửi request tới tất cả endpoint MAVLink hợp lệ đã biết.
  // Lý do: trong mô hình mavlink-router/QGC/PX4, port nhận telemetry và port nhận command
  // có thể khác nhau. Nếu cấu hình manual target sai, node vẫn tự phục hồi bằng observed peer.
  // Trường hợp target_port == bind_port trên loopback được bỏ qua để tránh tự gửi request vào chính node.
  auto is_loopback = [](const sockaddr_in & addr) -> bool {
    return (ntohl(addr.sin_addr.s_addr) >> 24) == 127U;
  };

  auto same_endpoint = [](const sockaddr_in & a, const sockaddr_in & b) -> bool {
    return a.sin_addr.s_addr == b.sin_addr.s_addr && a.sin_port == b.sin_port;
  };

  auto target_is_self = [&]() -> bool {
    return ntohs(target_addr_.sin_port) == static_cast<uint16_t>(bind_port_) &&
      (is_loopback(target_addr_) || target_ip_ == "0.0.0.0");
  };

  std::vector<sockaddr_in> destinations;
  auto add_destination = [&](const sockaddr_in & addr) {
    for (const auto & existing : destinations) {
      if (same_endpoint(existing, addr)) {
        return;
      }
    }
    destinations.push_back(addr);
  };

  if (auto_target_ && has_learned_target_) {
    add_destination(learned_addr_);
  }

  if (has_observed_peer_ && (prefer_observed_peer_for_requests_ || !auto_target_ || target_is_self())) {
    add_destination(observed_peer_addr_);
  }

  if (!target_is_self()) {
    add_destination(target_addr_);
  } else {
    RCLCPP_WARN_THROTTLE(get_logger(), *get_clock(), 5000,
      "Manual target %s:%d equals local bind port. Skipping self-loop target and using observed MAVLink peer if available.",
      target_ip_.c_str(), target_port_);
  }

  if (destinations.empty() && has_observed_peer_) {
    add_destination(observed_peer_addr_);
  }

  for (const auto & dst : destinations) {
    sendto(sock_, buffer, len, 0, reinterpret_cast<const sockaddr *>(&dst), sizeof(dst));
  }
}

void FcMissionReader::sendRequestList()
{
  mavlink_message_t msg;
  mavlink_msg_mission_request_list_pack(
    own_sysid_, own_compid_, &msg, target_sysid_, target_compid_, mission_type_);
  sendMessage(msg);
}

void FcMissionReader::sendRequestItem(uint16_t seq)
{
  mavlink_message_t msg;
  mavlink_msg_mission_request_int_pack(
    own_sysid_, own_compid_, &msg, target_sysid_, target_compid_, seq, mission_type_);
  sendMessage(msg);
}

void FcMissionReader::sendAck()
{
  mavlink_message_t msg;
  mavlink_msg_mission_ack_pack(
    own_sysid_, own_compid_, &msg, target_sysid_, target_compid_, MAV_MISSION_ACCEPTED,
    mission_type_, 0);
  sendMessage(msg);
}

std::string FcMissionReader::buildJson(
  const std::vector<MissionItem> & items, uint16_t count, uint32_t opaque_id) const
{
  const std::string custom = buildCustomMission(items);
  const std::string raw = buildRawItems(items);
  const std::string hash = hashText(raw);

  std::ostringstream ss;
  ss << "{\"ok\":true,\"source\":\"mavlink_mission_protocol\","
     << "\"item_count\":" << count << ","
     << "\"downloaded_items\":" << items.size() << ","
     << "\"remote_opaque_id\":" << opaque_id << ","
     << "\"hash\":" << jsonString(hash) << ","
     << "\"target\":{\"sysid\":" << static_cast<int>(target_sysid_)
     << ",\"compid\":" << static_cast<int>(target_compid_) << "},"
     << "\"mission\":" << custom << ","
     << "\"raw_items\":" << raw << "}";
  return ss.str();
}

std::string FcMissionReader::buildCustomMission(const std::vector<MissionItem> & items) const
{
  std::ostringstream ss;
  ss << "{\"version\":1,\"mission\":{\"defaults\":{"
     << "\"horizontalVelocity\":5.0,\"verticalVelocity\":2.0,\"maxHeadingRate\":60.0},"
     << "\"items\":[";

  bool first = true;
  for (const auto & item : items) {
    const std::string converted = convertItem(item);
    if (converted.empty()) {
      continue;
    }
    if (!first) {
      ss << ",";
    }
    first = false;
    ss << converted;
  }

  ss << "]}}";
  return ss.str();
}

std::string FcMissionReader::buildRawItems(const std::vector<MissionItem> & items) const
{
  std::ostringstream ss;
  ss << "[";
  for (size_t i = 0; i < items.size(); ++i) {
    const auto & item = items[i];
    if (i > 0) {
      ss << ",";
    }

    ss << "{\"seq\":" << item.seq
       << ",\"message\":" << jsonString(item.is_int ? "MISSION_ITEM_INT" : "MISSION_ITEM")
       << ",\"frame\":" << static_cast<int>(item.frame)
       << ",\"frame_name\":" << jsonString(frameName(item.frame))
       << ",\"command\":" << item.command
       << ",\"command_name\":" << jsonString(commandName(item.command))
       << ",\"current\":" << static_cast<int>(item.current)
       << ",\"autocontinue\":" << static_cast<int>(item.autocontinue)
       << ",\"mission_type\":" << static_cast<int>(item.mission_type)
       << ",\"param1\":" << item.p1
       << ",\"param2\":" << item.p2
       << ",\"param3\":" << item.p3
       << ",\"param4\":" << item.p4
       << ",\"x\":" << std::fixed << std::setprecision(7) << item.x
       << ",\"y\":" << std::fixed << std::setprecision(7) << item.y
       << ",\"z\":" << std::setprecision(3) << item.z << "}";
  }
  ss << "]";
  return ss.str();
}

std::string FcMissionReader::convertItem(const MissionItem & item) const
{
  std::ostringstream ss;
  const std::string id = "fc_seq_" + std::to_string(item.seq);

  switch (item.command) {
    case MAV_CMD_NAV_TAKEOFF:
      ss << "{\"type\":\"takeoff\",\"id\":" << jsonString(id)
         << ",\"altitude\":" << item.z << "}";
      return ss.str();

    case MAV_CMD_NAV_WAYPOINT:
      ss << "{\"type\":\"navigation\",\"navigationType\":\"waypoint\","
         << "\"frame\":\"global\",\"id\":" << jsonString(id)
         << ",\"x\":" << std::fixed << std::setprecision(7) << item.x
         << ",\"y\":" << std::fixed << std::setprecision(7) << item.y
         << ",\"z\":" << std::setprecision(3) << item.z << "}";
      return ss.str();

    case MAV_CMD_NAV_LOITER_TIME:
    case MAV_CMD_NAV_DELAY:
      ss << "{\"type\":\"hold\",\"id\":" << jsonString(id)
         << ",\"duration\":" << std::max(0.0F, item.p1) << "}";
      return ss.str();

    case MAV_CMD_NAV_RETURN_TO_LAUNCH:
      ss << "{\"type\":\"rtl\",\"id\":" << jsonString(id) << "}";
      return ss.str();

    case MAV_CMD_NAV_LAND:
      ss << "{\"type\":\"land\",\"id\":" << jsonString(id) << "}";
      return ss.str();

    default:
      ss << "{\"type\":\"mavlink_action\",\"id\":" << jsonString(id)
         << ",\"command\":" << item.command
         << ",\"command_name\":" << jsonString(commandName(item.command))
         << ",\"param1\":" << item.p1
         << ",\"param2\":" << item.p2
         << ",\"param3\":" << item.p3
         << ",\"param4\":" << item.p4
         << ",\"x\":" << std::fixed << std::setprecision(7) << item.x
         << ",\"y\":" << std::fixed << std::setprecision(7) << item.y
         << ",\"z\":" << std::setprecision(3) << item.z << "}";
      return ss.str();
  }
}

std::string FcMissionReader::commandName(uint16_t command) const
{
  switch (command) {
    case MAV_CMD_NAV_WAYPOINT: return "MAV_CMD_NAV_WAYPOINT";
    case MAV_CMD_NAV_LOITER_TIME: return "MAV_CMD_NAV_LOITER_TIME";
    case MAV_CMD_NAV_RETURN_TO_LAUNCH: return "MAV_CMD_NAV_RETURN_TO_LAUNCH";
    case MAV_CMD_NAV_LAND: return "MAV_CMD_NAV_LAND";
    case MAV_CMD_NAV_TAKEOFF: return "MAV_CMD_NAV_TAKEOFF";
    case MAV_CMD_NAV_DELAY: return "MAV_CMD_NAV_DELAY";
    default: return "MAV_CMD_" + std::to_string(command);
  }
}

std::string FcMissionReader::frameName(uint8_t frame) const
{
  switch (frame) {
    case MAV_FRAME_GLOBAL: return "MAV_FRAME_GLOBAL";
    case MAV_FRAME_GLOBAL_RELATIVE_ALT: return "MAV_FRAME_GLOBAL_RELATIVE_ALT";
    case MAV_FRAME_GLOBAL_INT: return "MAV_FRAME_GLOBAL_INT";
    case MAV_FRAME_GLOBAL_RELATIVE_ALT_INT: return "MAV_FRAME_GLOBAL_RELATIVE_ALT_INT";
    case MAV_FRAME_GLOBAL_TERRAIN_ALT_INT: return "MAV_FRAME_GLOBAL_TERRAIN_ALT_INT";
    case MAV_FRAME_MISSION: return "MAV_FRAME_MISSION";
    default: return "MAV_FRAME_" + std::to_string(frame);
  }
}

std::string FcMissionReader::jsonString(const std::string & text) const
{
  std::ostringstream ss;
  ss << '"';
  for (const char c : text) {
    switch (c) {
      case '\\': ss << "\\\\"; break;
      case '"': ss << "\\\""; break;
      case '\n': ss << "\\n"; break;
      case '\r': ss << "\\r"; break;
      case '\t': ss << "\\t"; break;
      default: ss << c; break;
    }
  }
  ss << '"';
  return ss.str();
}

std::string FcMissionReader::hashText(const std::string & text) const
{
  uint64_t hash = 1469598103934665603ULL;
  for (const unsigned char c : text) {
    hash ^= static_cast<uint64_t>(c);
    hash *= 1099511628211ULL;
  }

  std::ostringstream ss;
  ss << std::hex << hash;
  return ss.str();
}

std::string FcMissionReader::defaultOutputFile() const
{
  try {
    const auto share = ament_index_cpp::get_package_share_directory("fc_mission_reader");
    return share + "/data.json";
  } catch (...) {
    return "/tmp/fc_mission_reader_data.json";
  }
}

void FcMissionReader::loadCache()
{
  std::ifstream file(output_file_);
  if (!file.good()) {
    return;
  }

  std::ostringstream ss;
  ss << file.rdbuf();
  cached_json_ = ss.str();
  cached_hash_ = extractString(cached_json_, "hash");

  if (const auto n = extractNumber(cached_json_, "item_count")) {
    cached_count_ = static_cast<uint16_t>(*n);
  }
  if (const auto n = extractNumber(cached_json_, "remote_opaque_id")) {
    cached_opaque_id_ = static_cast<uint32_t>(*n);
  }

  has_cache_ = !cached_json_.empty() && !cached_hash_.empty();
  if (has_cache_) {
    last_full_download_ = now();
    RCLCPP_INFO(get_logger(), "Loaded mission cache: count=%u opaque=%u hash=%s",
      cached_count_, cached_opaque_id_, cached_hash_.c_str());
  }
}

void FcMissionReader::updateCache(
  const std::string & json, uint16_t count, uint32_t opaque_id, const std::string & hash)
{
  cached_json_ = json;
  cached_count_ = count;
  cached_opaque_id_ = opaque_id;
  cached_hash_ = hash;
  has_cache_ = true;
  last_full_download_ = now();
}

void FcMissionReader::publishJson(const std::string & json)
{
  std_msgs::msg::String msg;
  msg.data = json;
  pub_->publish(msg);
}

bool FcMissionReader::canPublishCachedMissionContinuously() const
{
  if (!publish_cached_mission_continuously_) {
    return false;
  }

  if (!initial_sync_done_ || !has_cache_ || cached_json_.empty()) {
    return false;
  }

  // Chỉ spam khi FC thật sự đang có mission. Không spam cache cũ trước khi sync,
  // và không spam JSON rỗng để tránh adaptive/backend hiểu nhầm là có nhiệm vụ.
  if (!remote_total_valid_ || remote_total_ == 0U || remote_reported_empty_) {
    return false;
  }

  return cached_count_ > 0U;
}

void FcMissionReader::publishCachedMissionContinuously()
{
  if (!canPublishCachedMissionContinuously()) {
    return;
  }

  publishJson(cached_json_);
}

void FcMissionReader::saveJson(const std::string & json)
{
  try {
    const std::filesystem::path path(output_file_);
    if (path.has_parent_path()) {
      std::filesystem::create_directories(path.parent_path());
    }
    std::ofstream file(output_file_, std::ios::trunc);
    file << json << std::endl;
  } catch (const std::exception & e) {
    RCLCPP_WARN(get_logger(), "Failed to write %s: %s", output_file_.c_str(), e.what());
  }
}

void FcMissionReader::publishAndSave(const std::string & json)
{
  publishJson(json);
  saveJson(json);
}

void FcMissionReader::publishFailure(const std::string & note)
{
  std::ostringstream ss;
  ss << "{\"ok\":false,\"source\":\"mavlink_mission_protocol\",";
  ss << "\"note\":" << jsonString(note) << ",";
  ss << "\"target\":{\"sysid\":" << static_cast<int>(target_sysid_)
     << ",\"compid\":" << static_cast<int>(target_compid_) << "},";
  ss << "\"mission\":{\"version\":1,\"mission\":{\"defaults\":{";
  ss << "\"horizontalVelocity\":5.0,\"verticalVelocity\":2.0,\"maxHeadingRate\":60.0},";
  ss << "\"items\":[]}}}";
  publishJson(ss.str());
}

bool FcMissionReader::shouldDownload(uint16_t count, uint32_t opaque_id) const
{
  if (!has_cache_) {
    return true;
  }

  if (count != cached_count_) {
    return true;
  }

  if (opaque_id != 0U && cached_opaque_id_ != 0U) {
    return opaque_id != cached_opaque_id_;
  }

  if (opaque_id != 0U && cached_opaque_id_ == 0U) {
    return true;
  }

  return missionIdChanged();
}

bool FcMissionReader::shouldInitialDownload() const
{
  if (initial_sync_done_) {
    return false;
  }

  if (last_count_poll_.nanoseconds() == 0) {
    return true;
  }

  return (now() - last_count_poll_).seconds() >= fallback_count_poll_s_;
}

bool FcMissionReader::shouldPollMissionInfo() const
{
  if (!enable_fallback_count_poll_) {
    return false;
  }

  if (!initial_sync_done_) {
    return true;
  }

  return last_count_poll_.nanoseconds() == 0 ||
    (now() - last_count_poll_).seconds() >= fallback_count_poll_s_;
}

std::string FcMissionReader::extractString(const std::string & json, const std::string & key) const
{
  const std::string pattern = "\"" + key + "\":";
  const size_t key_pos = json.find(pattern);
  if (key_pos == std::string::npos) {
    return {};
  }

  size_t pos = key_pos + pattern.size();
  while (pos < json.size() && std::isspace(static_cast<unsigned char>(json[pos]))) {
    ++pos;
  }
  if (pos >= json.size() || json[pos] != '"') {
    return {};
  }
  ++pos;

  std::string out;
  bool esc = false;
  for (; pos < json.size(); ++pos) {
    const char c = json[pos];
    if (esc) {
      out.push_back(c);
      esc = false;
      continue;
    }
    if (c == '\\') {
      esc = true;
      continue;
    }
    if (c == '"') {
      return out;
    }
    out.push_back(c);
  }

  return {};
}

std::optional<uint64_t> FcMissionReader::extractNumber(const std::string & json, const std::string & key) const
{
  const std::string pattern = "\"" + key + "\":";
  const size_t key_pos = json.find(pattern);
  if (key_pos == std::string::npos) {
    return std::nullopt;
  }

  size_t pos = key_pos + pattern.size();
  while (pos < json.size() && std::isspace(static_cast<unsigned char>(json[pos]))) {
    ++pos;
  }

  uint64_t value = 0;
  bool any = false;
  for (; pos < json.size() && std::isdigit(static_cast<unsigned char>(json[pos])); ++pos) {
    any = true;
    value = value * 10U + static_cast<uint64_t>(json[pos] - '0');
  }

  if (!any) {
    return std::nullopt;
  }
  return value;
}


}  // namespace fc_mission_reader
