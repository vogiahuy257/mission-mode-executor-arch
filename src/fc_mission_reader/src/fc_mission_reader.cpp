#include "fc_mission_reader/fc_mission_reader.hpp"

#include <ament_index_cpp/get_package_share_directory.hpp>

#include <sys/select.h>

#include <algorithm>
#include <chrono>
#include <cctype>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <sstream>

namespace fc_mission_reader
{

FcMissionReader::FcMissionReader(const rclcpp::NodeOptions & options)
: Node("fc_mission_reader", options)
{
  bind_ip_ = declare_parameter<std::string>("bind_ip", "0.0.0.0");
  bind_port_ = declare_parameter<int>("bind_port", 14550);
  poll_period_s_ = declare_parameter<double>("poll_period_s", 0.02);
  read_budget_ms_ = declare_parameter<int>("read_budget_ms", 50);
  transfer_timeout_s_ = declare_parameter<double>("transfer_timeout_s", 8.0);
  publish_reset_on_mission_change_ = declare_parameter<bool>("publish_reset_on_mission_change", true);
  publish_reset_on_startup_change_ = declare_parameter<bool>("publish_reset_on_startup_change", false);
  reset_publish_min_interval_s_ = declare_parameter<double>("reset_publish_min_interval_s", 1.0);
  adaptive_reset_topic_ = declare_parameter<std::string>("adaptive_reset_topic", "/adaptive_mission_mode/reset");
  publish_unknown_on_remote_change_ = declare_parameter<bool>("publish_unknown_on_remote_change", true);
  publish_empty_from_mission_current_ = declare_parameter<bool>("publish_empty_from_mission_current", true);
  output_file_ = declare_parameter<std::string>("output_file", "");

  if (output_file_.empty()) {
    output_file_ = defaultOutputFile();
  }

  pub_ = create_publisher<std_msgs::msg::String>("~/mission_json", rclcpp::QoS(1).transient_local());
  if (publish_reset_on_mission_change_ && !adaptive_reset_topic_.empty()) {
    reset_pub_ = create_publisher<std_msgs::msg::Bool>(adaptive_reset_topic_, rclcpp::QoS(1).reliable());
  }

  loadCache();

  if (!openSocket()) {
    RCLCPP_ERROR(get_logger(), "Cannot open UDP socket. Passive observer cannot receive MAVLink.");
  }

  const auto period = std::chrono::duration<double>(std::max(0.005, poll_period_s_));
  timer_ = create_wall_timer(
    std::chrono::duration_cast<std::chrono::milliseconds>(period),
    std::bind(&FcMissionReader::poll, this));

  RCLCPP_WARN(get_logger(),
    "FC mission reader is running in PASSIVE OBSERVER mode: it never sends MAVLink mission requests or ACKs.");
  RCLCPP_INFO(get_logger(),
    "Listening MAVLink on %s:%d, output=%s, transfer_timeout=%.2fs",
    bind_ip_.c_str(), bind_port_, output_file_.c_str(), transfer_timeout_s_);
  RCLCPP_INFO(get_logger(),
    "Publish policy: mission_json only on observed upload/download/clear/empty/unknown events; reset=%s topic=%s startup_reset=%s",
    (publish_reset_on_mission_change_ && reset_pub_) ? "true" : "false",
    adaptive_reset_topic_.c_str(), publish_reset_on_startup_change_ ? "true" : "false");
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

  return true;
}

void FcMissionReader::poll()
{
  if (sock_ < 0) {
    return;
  }

  const auto start = now();
  while ((now() - start).nanoseconds() / 1000000 < read_budget_ms_) {
    if (!readDatagram(1)) {
      break;
    }
  }

  checkTransferTimeout();
  startup_phase_ = false;
}

bool FcMissionReader::readDatagram(int timeout_ms)
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

  uint8_t buffer[4096];
  sockaddr_in src{};
  socklen_t src_len = sizeof(src);
  const ssize_t len = recvfrom(sock_, buffer, sizeof(buffer), 0,
    reinterpret_cast<sockaddr *>(&src), &src_len);
  if (len <= 0) {
    return false;
  }

  mavlink_message_t msg{};
  mavlink_status_t status{};
  bool parsed_any = false;
  for (ssize_t i = 0; i < len; ++i) {
    if (mavlink_parse_char(MAVLINK_COMM_0, buffer[i], &msg, &status)) {
      parsed_any = true;
      observeMessage(msg, src);
    }
  }

  return parsed_any;
}

void FcMissionReader::observeMessage(const mavlink_message_t & msg, const sockaddr_in & src)
{
  (void)src;

  if (msg.sysid == own_sysid_) {
    return;
  }

  switch (msg.msgid) {
    case MAVLINK_MSG_ID_HEARTBEAT:
      handleHeartbeat(msg);
      break;
    case MAVLINK_MSG_ID_MISSION_CURRENT:
      handleMissionCurrent(msg);
      break;
    case MAVLINK_MSG_ID_MISSION_COUNT:
      handleMissionCount(msg);
      break;
    case MAVLINK_MSG_ID_MISSION_ITEM_INT:
      handleMissionItemInt(msg);
      break;
    case MAVLINK_MSG_ID_MISSION_ITEM:
      handleMissionItem(msg);
      break;
    case MAVLINK_MSG_ID_MISSION_CLEAR_ALL:
      handleMissionClearAll(msg);
      break;
    case MAVLINK_MSG_ID_MISSION_ACK:
      handleMissionAck(msg);
      break;
    default:
      break;
  }
}

bool FcMissionReader::isFlightControllerHeartbeat(
  const mavlink_message_t & msg, mavlink_heartbeat_t & heartbeat) const
{
  if (msg.msgid != MAVLINK_MSG_ID_HEARTBEAT) {
    return false;
  }

  mavlink_msg_heartbeat_decode(&msg, &heartbeat);
  if (heartbeat.type == MAV_TYPE_GCS) {
    return false;
  }
  if (heartbeat.autopilot == MAV_AUTOPILOT_INVALID) {
    return false;
  }
  return true;
}

bool FcMissionReader::isTargetFlightControllerMessage(const mavlink_message_t & msg) const
{
  if (msg.sysid == own_sysid_) {
    return false;
  }

  if (has_fc_heartbeat_) {
    return msg.sysid == target_sysid_;
  }

  return msg.sysid == target_sysid_;
}

bool FcMissionReader::isDirectedToFlightController(uint8_t target_system, uint8_t target_component) const
{
  if (target_system != target_sysid_ && target_system != 0U) {
    return false;
  }

  return target_component == target_compid_ || target_component == 0U;
}

bool FcMissionReader::isDirectedFromFlightController(const mavlink_message_t & msg) const
{
  return isTargetFlightControllerMessage(msg);
}

bool FcMissionReader::missionTypeMatches(uint8_t mission_type) const
{
  return mission_type == mission_type_ || mission_type == MAV_MISSION_TYPE_MISSION;
}

void FcMissionReader::handleHeartbeat(const mavlink_message_t & msg)
{
  mavlink_heartbeat_t hb{};
  if (!isFlightControllerHeartbeat(msg, hb)) {
    return;
  }

  const bool changed = !has_fc_heartbeat_ || target_sysid_ != msg.sysid || target_compid_ != msg.compid;
  target_sysid_ = msg.sysid;
  target_compid_ = msg.compid;
  has_fc_heartbeat_ = true;
  last_fc_heartbeat_ = now();

  if (changed) {
    RCLCPP_INFO(get_logger(),
      "Locked FC target from HEARTBEAT: sys=%u comp=%u type=%u autopilot=%u",
      target_sysid_, target_compid_, hb.type, hb.autopilot);
  }
}

void FcMissionReader::handleMissionCurrent(const mavlink_message_t & msg)
{
  if (!isTargetFlightControllerMessage(msg)) {
    return;
  }

  mavlink_mission_current_t cur{};
  mavlink_msg_mission_current_decode(&msg, &cur);

  const bool had_remote_id = remote_mission_id_valid_;
  const uint32_t old_remote_id = remote_mission_id_;
  const bool had_total = remote_total_valid_;
  const uint16_t old_total = remote_total_;

  if (cur.total > 0U) {
    mission_current_total_supported_ = true;
    remote_total_valid_ = true;
    remote_total_ = cur.total;
  } else if (mission_current_total_supported_) {
    remote_total_valid_ = true;
    remote_total_ = 0U;
  }

  if (cur.mission_id != 0U) {
    remote_mission_id_valid_ = true;
    remote_mission_id_ = cur.mission_id;
  }

  if (transfer_.active || pending_clear_) {
    // Mission metadata may change while another client is uploading/clearing.
    // Wait until the observed transaction finishes, then publish one final JSON.
    return;
  }

  if (mission_current_total_supported_ && cur.total == 0U && publish_empty_from_mission_current_) {
    handleRemoteEmpty("FC MISSION_CURRENT total=0", !startup_phase_ || publish_reset_on_startup_change_);
    return;
  }

  const bool id_changed = had_remote_id && cur.mission_id != 0U && cur.mission_id != old_remote_id;
  const bool total_changed = had_total && cur.total > 0U && cur.total != old_total;
  const bool cache_id_mismatch = cur.mission_id != 0U && cached_opaque_id_ != 0U && cur.mission_id != cached_opaque_id_;
  const bool cache_count_mismatch = cur.total > 0U && has_cache_ && cached_count_ != cur.total;

  if ((id_changed || total_changed || cache_id_mismatch || cache_count_mismatch) && publish_unknown_on_remote_change_) {
    handleUnknownRemoteMission(
      "FC reports mission metadata changed, but passive observer has not seen full mission transfer yet",
      !startup_phase_ || publish_reset_on_startup_change_);
  }
}

void FcMissionReader::handleMissionCount(const mavlink_message_t & msg)
{
  mavlink_mission_count_t count{};
  mavlink_msg_mission_count_decode(&msg, &count);
  if (!missionTypeMatches(count.mission_type)) {
    return;
  }

  if (msg.sysid != target_sysid_ && isDirectedToFlightController(count.target_system, count.target_component)) {
    beginTransfer(true, msg.sysid, msg.compid, count.count, count.opaque_id, "observed mission upload count");
    return;
  }

  if (isDirectedFromFlightController(msg)) {
    beginTransfer(false, count.target_system, count.target_component, count.count, count.opaque_id,
      "observed mission download count from FC");
  }
}

void FcMissionReader::handleMissionItemInt(const mavlink_message_t & msg)
{
  mavlink_mission_item_int_t it{};
  mavlink_msg_mission_item_int_decode(&msg, &it);
  if (!missionTypeMatches(it.mission_type)) {
    return;
  }

  MissionItem item{};
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

  captureMissionItem(item, msg);
}

void FcMissionReader::handleMissionItem(const mavlink_message_t & msg)
{
  mavlink_mission_item_t it{};
  mavlink_msg_mission_item_decode(&msg, &it);
  if (!missionTypeMatches(it.mission_type)) {
    return;
  }

  MissionItem item{};
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

  captureMissionItem(item, msg);
}

void FcMissionReader::handleMissionClearAll(const mavlink_message_t & msg)
{
  mavlink_mission_clear_all_t clear{};
  mavlink_msg_mission_clear_all_decode(&msg, &clear);
  if (!missionTypeMatches(clear.mission_type)) {
    return;
  }

  if (msg.sysid != target_sysid_ && isDirectedToFlightController(clear.target_system, clear.target_component)) {
    markPendingClear(msg, "observed MISSION_CLEAR_ALL to FC");
  }
}

void FcMissionReader::handleMissionAck(const mavlink_message_t & msg)
{
  mavlink_mission_ack_t ack{};
  mavlink_msg_mission_ack_decode(&msg, &ack);
  if (!missionTypeMatches(ack.mission_type)) {
    return;
  }

  if (isTargetFlightControllerMessage(msg)) {
    if (ack.type != MAV_MISSION_ACCEPTED) {
      return;
    }

    if (pending_clear_) {
      const bool target_matches_peer = ack.target_system == pending_clear_peer_sysid_ || ack.target_system == 0U;
      if (target_matches_peer) {
        finalizeClear(ack.opaque_id, "FC accepted observed mission clear");
        return;
      }
    }

    if (transfer_.active && transfer_.upload_to_fc) {
      if (ack.opaque_id != 0U) {
        transfer_.opaque_id = ack.opaque_id;
      }
      finalizeTransfer("FC accepted observed mission upload", true);
    }
    return;
  }

  if (transfer_.active && !transfer_.upload_to_fc && transferComplete()) {
    finalizeTransfer("observed mission download completed", false);
  }
}

void FcMissionReader::beginTransfer(
  bool upload_to_fc,
  uint8_t peer_sysid,
  uint8_t peer_compid,
  uint16_t expected_count,
  uint32_t opaque_id,
  const std::string & reason)
{
  if (expected_count == 0U) {
    if (upload_to_fc) {
      handleRemoteEmpty("observed upload count=0", true);
    }
    return;
  }

  transfer_ = PassiveTransfer{};
  transfer_.active = true;
  transfer_.upload_to_fc = upload_to_fc;
  transfer_.peer_sysid = peer_sysid;
  transfer_.peer_compid = peer_compid;
  transfer_.expected_count = expected_count;
  transfer_.opaque_id = opaque_id;
  transfer_.mission_type = mission_type_;
  transfer_.items.resize(expected_count);
  transfer_.last_update = now();
  transfer_.reason = reason;

  RCLCPP_INFO(get_logger(), "%s: direction=%s peer=%u/%u count=%u opaque=%u",
    reason.c_str(), upload_to_fc ? "upload_to_fc" : "download_from_fc",
    peer_sysid, peer_compid, expected_count, opaque_id);
}

void FcMissionReader::resetTransfer(const std::string & reason)
{
  if (transfer_.active) {
    RCLCPP_DEBUG(get_logger(), "Reset passive mission transfer. reason=%s", reason.c_str());
  }
  transfer_ = PassiveTransfer{};
}

bool FcMissionReader::transferMatches(const PassiveTransfer & transfer, const mavlink_message_t & msg) const
{
  if (!transfer.active) {
    return false;
  }

  if (transfer.upload_to_fc) {
    return msg.sysid == transfer.peer_sysid && msg.compid == transfer.peer_compid;
  }

  return isTargetFlightControllerMessage(msg);
}

void FcMissionReader::captureMissionItem(const MissionItem & item, const mavlink_message_t & msg)
{
  if (!transferMatches(transfer_, msg)) {
    return;
  }

  if (item.seq >= transfer_.items.size()) {
    return;
  }

  transfer_.items[item.seq] = item;
  transfer_.last_update = now();

  if (!transfer_.upload_to_fc && transferComplete()) {
    finalizeTransfer("observed all mission items during download", false);
  }
}

bool FcMissionReader::transferComplete() const
{
  if (!transfer_.active || transfer_.items.size() != transfer_.expected_count) {
    return false;
  }

  for (const auto & item : transfer_.items) {
    if (!item || !item->ok) {
      return false;
    }
  }
  return true;
}

std::vector<MissionItem> FcMissionReader::completedTransferItems() const
{
  std::vector<MissionItem> items;
  if (!transferComplete()) {
    return items;
  }

  items.reserve(transfer_.items.size());
  for (const auto & item : transfer_.items) {
    items.push_back(*item);
  }
  return items;
}

void FcMissionReader::finalizeTransfer(const std::string & reason, bool allow_reset)
{
  if (!transfer_.active) {
    return;
  }

  if (!transferComplete()) {
    RCLCPP_WARN(get_logger(),
      "Cannot finalize passive mission transfer because not all items were observed. reason=%s count=%u",
      reason.c_str(), transfer_.expected_count);
    resetTransfer("incomplete finalize");
    handleUnknownRemoteMission("observed mission transfer completed but item stream was incomplete", allow_reset);
    return;
  }

  const auto items = completedTransferItems();
  const uint32_t opaque_id = transfer_.opaque_id;
  const uint16_t count = transfer_.expected_count;
  const std::string json = buildJson(items, count, opaque_id, "ready", reason);
  const std::string hash = extractString(json, "hash");
  const std::string signature = "mission:" + hash;
  const bool changed = !has_cache_ || cached_hash_ != hash || cached_count_ != count ||
    (opaque_id != 0U && cached_opaque_id_ != opaque_id) || cached_status_ != "ready";

  updateCache(json, count, opaque_id, hash, "ready");
  if (opaque_id != 0U) {
    remote_mission_id_valid_ = true;
    remote_mission_id_ = opaque_id;
  }
  remote_total_valid_ = true;
  remote_total_ = count;

  if (changed) {
    publishResetIfNeeded(reason, signature, allow_reset && (!startup_phase_ || publish_reset_on_startup_change_));
    publishJsonIfChanged(json, signature, reason);
    saveJson(json);
    RCLCPP_WARN(get_logger(), "Passive mission JSON updated: count=%u opaque=%u hash=%s reason=%s",
      count, opaque_id, hash.c_str(), reason.c_str());
  } else {
    RCLCPP_INFO(get_logger(), "Passive mission transfer observed but JSON unchanged: count=%u hash=%s reason=%s",
      count, hash.c_str(), reason.c_str());
  }

  resetTransfer("finalized transfer");
}

void FcMissionReader::checkTransferTimeout()
{
  if (transfer_.active && transfer_.last_update.nanoseconds() != 0 &&
    (now() - transfer_.last_update).seconds() > transfer_timeout_s_)
  {
    RCLCPP_WARN(get_logger(), "Passive mission transfer timed out before all items were observed. reason=%s",
      transfer_.reason.c_str());
    resetTransfer("transfer timeout");
  }

  if (pending_clear_ && pending_clear_time_.nanoseconds() != 0 &&
    (now() - pending_clear_time_).seconds() > transfer_timeout_s_)
  {
    RCLCPP_WARN(get_logger(), "Observed MISSION_CLEAR_ALL but no accepted ACK before timeout");
    pending_clear_ = false;
  }
}

void FcMissionReader::markPendingClear(const mavlink_message_t & msg, const std::string & reason)
{
  pending_clear_ = true;
  pending_clear_peer_sysid_ = msg.sysid;
  pending_clear_peer_compid_ = msg.compid;
  pending_clear_time_ = now();
  resetTransfer("clear command observed");
  RCLCPP_WARN(get_logger(), "%s from peer=%u/%u; waiting FC MISSION_ACK ACCEPTED",
    reason.c_str(), msg.sysid, msg.compid);
}

void FcMissionReader::finalizeClear(uint32_t opaque_id, const std::string & reason)
{
  pending_clear_ = false;
  handleRemoteEmpty(reason, true);
  if (opaque_id != 0U) {
    remote_mission_id_valid_ = true;
    remote_mission_id_ = opaque_id;
  }
}

void FcMissionReader::handleRemoteEmpty(const std::string & reason, bool allow_reset)
{
  std::vector<MissionItem> items;
  const uint32_t opaque_id = remote_mission_id_valid_ ? remote_mission_id_ : 0U;
  const std::string json = buildJson(items, 0, opaque_id, "empty", reason);
  const std::string hash = extractString(json, "hash");
  const std::string signature = "empty:" + hash + ":" + std::to_string(opaque_id);
  const bool changed = !has_cache_ || cached_count_ != 0U || cached_status_ != "empty" || cached_hash_ != hash ||
    (opaque_id != 0U && cached_opaque_id_ != opaque_id);

  updateCache(json, 0, opaque_id, hash, "empty");
  remote_total_valid_ = true;
  remote_total_ = 0U;

  if (changed) {
    publishResetIfNeeded(reason, signature, allow_reset);
    publishJsonIfChanged(json, signature, reason);
    saveJson(json);
    RCLCPP_WARN(get_logger(), "Passive mission JSON cleared: reason=%s opaque=%u", reason.c_str(), opaque_id);
  }
}

void FcMissionReader::handleUnknownRemoteMission(const std::string & reason, bool allow_reset)
{
  if (!publish_unknown_on_remote_change_) {
    return;
  }

  std::vector<MissionItem> items;
  const uint16_t count = remote_total_valid_ ? remote_total_ : 0U;
  const uint32_t opaque_id = remote_mission_id_valid_ ? remote_mission_id_ : 0U;
  const std::string json = buildJson(items, count, opaque_id, "unknown_remote_mission", reason);
  const std::string hash = extractString(json, "hash");
  const std::string signature = "unknown:" + std::to_string(count) + ":" + std::to_string(opaque_id);
  const bool changed = !has_cache_ || cached_status_ != "unknown_remote_mission" || cached_count_ != count ||
    cached_opaque_id_ != opaque_id;

  updateCache(json, count, opaque_id, hash, "unknown_remote_mission");

  if (changed) {
    publishResetIfNeeded(reason, signature, allow_reset);
    publishJsonIfChanged(json, signature, reason);
    saveJson(json);
    RCLCPP_WARN(get_logger(),
      "Remote mission became UNKNOWN for passive observer: count=%u opaque=%u reason=%s. Old mission cache was overwritten to avoid stale replay.",
      count, opaque_id, reason.c_str());
  }
}

std::string FcMissionReader::buildJson(
  const std::vector<MissionItem> & items,
  uint16_t count,
  uint32_t opaque_id,
  const std::string & status,
  const std::string & note) const
{
  const std::string custom = buildCustomMission(items);
  const std::string raw = buildRawItems(items);
  const std::string hash = hashText(status + ":" + raw + ":" + std::to_string(count));
  const bool ok = (status == "ready" || status == "empty");

  std::ostringstream ss;
  ss << "{\"ok\":" << (ok ? "true" : "false")
     << ",\"source\":\"mavlink_passive_observer\""
     << ",\"status\":" << jsonString(status)
     << ",\"note\":" << jsonString(note)
     << ",\"item_count\":" << count
     << ",\"observed_items\":" << items.size()
     << ",\"remote_opaque_id\":" << opaque_id
     << ",\"hash\":" << jsonString(hash)
     << ",\"target\":{\"sysid\":" << static_cast<int>(target_sysid_)
     << ",\"compid\":" << static_cast<int>(target_compid_) << "}"
     << ",\"mission\":" << custom
     << ",\"raw_items\":" << raw << "}";
  return ss.str();
}

std::string FcMissionReader::buildCustomMission(const std::vector<MissionItem> & items) const
{
  std::ostringstream ss;
  ss << "{\"version\":1,\"mission\":{\"defaults\":{";
  ss << "\"horizontalVelocity\":5.0,\"verticalVelocity\":2.0,\"maxHeadingRate\":60.0},";
  ss << "\"items\":[";

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
      ss << "{\"type\":\"navigation\",\"navigationType\":\"waypoint\",";
      ss << "\"frame\":\"global\",\"id\":" << jsonString(id)
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
  cached_status_ = extractString(cached_json_, "status");

  if (const auto n = extractNumber(cached_json_, "item_count")) {
    cached_count_ = static_cast<uint16_t>(*n);
  }
  if (const auto n = extractNumber(cached_json_, "remote_opaque_id")) {
    cached_opaque_id_ = static_cast<uint32_t>(*n);
  }

  has_cache_ = !cached_json_.empty() && !cached_hash_.empty();
  if (has_cache_) {
    RCLCPP_INFO(get_logger(), "Loaded passive mission cache but will not publish it automatically: status=%s count=%u opaque=%u hash=%s",
      cached_status_.c_str(), cached_count_, cached_opaque_id_, cached_hash_.c_str());
  }
}

void FcMissionReader::updateCache(
  const std::string & json,
  uint16_t count,
  uint32_t opaque_id,
  const std::string & hash,
  const std::string & status)
{
  cached_json_ = json;
  cached_count_ = count;
  cached_opaque_id_ = opaque_id;
  cached_hash_ = hash;
  cached_status_ = status;
  has_cache_ = true;
}

void FcMissionReader::publishJsonIfChanged(
  const std::string & json,
  const std::string & signature,
  const std::string & reason)
{
  if (signature == last_published_signature_) {
    RCLCPP_DEBUG(get_logger(), "mission_json publish suppressed because signature unchanged: %s", signature.c_str());
    return;
  }

  std_msgs::msg::String msg;
  msg.data = json;
  pub_->publish(msg);
  last_published_signature_ = signature;
  RCLCPP_INFO(get_logger(), "Published mission_json once. reason=%s signature=%s", reason.c_str(), signature.c_str());
}

void FcMissionReader::publishResetIfNeeded(
  const std::string & reason,
  const std::string & signature,
  bool allow_reset)
{
  if (!publish_reset_on_mission_change_ || !reset_pub_) {
    return;
  }

  if (!allow_reset) {
    RCLCPP_INFO(get_logger(), "Reset event suppressed during startup/passive cache validation. reason=%s", reason.c_str());
    return;
  }

  if (signature.empty() || last_reset_signature_ == signature) {
    return;
  }

  const auto current_time = now();
  if (last_reset_publish_.nanoseconds() != 0) {
    const double dt = (current_time - last_reset_publish_).seconds();
    if (dt < reset_publish_min_interval_s_) {
      RCLCPP_WARN(get_logger(),
        "Reset event suppressed %.3fs after previous reset to avoid reset spam. reason=%s",
        dt, reason.c_str());
      last_reset_signature_ = signature;
      return;
    }
  }

  std_msgs::msg::Bool reset_msg;
  reset_msg.data = true;
  reset_pub_->publish(reset_msg);
  last_reset_signature_ = signature;
  last_reset_publish_ = current_time;
  RCLCPP_WARN(get_logger(), "Published adaptive mission reset event on %s. reason=%s signature=%s",
    adaptive_reset_topic_.c_str(), reason.c_str(), signature.c_str());
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
