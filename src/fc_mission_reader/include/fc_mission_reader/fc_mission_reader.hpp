#pragma once

#if defined(__GNUC__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wpedantic"
#pragma GCC diagnostic ignored "-Waddress-of-packed-member"
#endif
#include <mavlink/v2.0/common/mavlink.h>
#if defined(__GNUC__)
#pragma GCC diagnostic pop
#endif

#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

#include <cstdint>
#include <optional>
#include <string>
#include <vector>

#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/bool.hpp>
#include <std_msgs/msg/string.hpp>

namespace fc_mission_reader
{

struct MissionItem
{
  bool ok{false};
  bool is_int{false};
  uint16_t seq{0};
  uint8_t frame{0};
  uint16_t command{0};
  uint8_t current{0};
  uint8_t autocontinue{0};
  uint8_t mission_type{MAV_MISSION_TYPE_MISSION};
  float p1{0.0F};
  float p2{0.0F};
  float p3{0.0F};
  float p4{0.0F};
  double x{0.0};
  double y{0.0};
  float z{0.0F};
};

struct PassiveTransfer
{
  bool active{false};
  bool upload_to_fc{false};
  uint8_t peer_sysid{0};
  uint8_t peer_compid{0};
  uint16_t expected_count{0};
  uint32_t opaque_id{0};
  uint8_t mission_type{MAV_MISSION_TYPE_MISSION};
  std::vector<std::optional<MissionItem>> items;
  rclcpp::Time last_update{};
  std::string reason;
};

class FcMissionReader : public rclcpp::Node
{
public:
  explicit FcMissionReader(const rclcpp::NodeOptions & options = rclcpp::NodeOptions());
  ~FcMissionReader() override;

private:
  bool openSocket();
  void poll();
  bool readDatagram(int timeout_ms);
  void observeMessage(const mavlink_message_t & msg, const sockaddr_in & src);

  bool isFlightControllerHeartbeat(const mavlink_message_t & msg, mavlink_heartbeat_t & heartbeat) const;
  bool isTargetFlightControllerMessage(const mavlink_message_t & msg) const;
  bool isDirectedToFlightController(uint8_t target_system, uint8_t target_component) const;
  bool isDirectedFromFlightController(const mavlink_message_t & msg) const;
  bool missionTypeMatches(uint8_t mission_type) const;

  void handleHeartbeat(const mavlink_message_t & msg);
  void handleMissionCurrent(const mavlink_message_t & msg);
  void handleMissionCount(const mavlink_message_t & msg);
  void handleMissionItemInt(const mavlink_message_t & msg);
  void handleMissionItem(const mavlink_message_t & msg);
  void handleMissionClearAll(const mavlink_message_t & msg);
  void handleMissionAck(const mavlink_message_t & msg);

  void beginTransfer(
    bool upload_to_fc,
    uint8_t peer_sysid,
    uint8_t peer_compid,
    uint16_t expected_count,
    uint32_t opaque_id,
    const std::string & reason);
  void resetTransfer(const std::string & reason);
  bool transferMatches(const PassiveTransfer & transfer, const mavlink_message_t & msg) const;
  void captureMissionItem(const MissionItem & item, const mavlink_message_t & msg);
  bool transferComplete() const;
  std::vector<MissionItem> completedTransferItems() const;
  void finalizeTransfer(const std::string & reason, bool allow_reset);
  void checkTransferTimeout();

  void markPendingClear(const mavlink_message_t & msg, const std::string & reason);
  void finalizeClear(uint32_t opaque_id, const std::string & reason);
  void handleRemoteEmpty(const std::string & reason, bool allow_reset);
  void handleUnknownRemoteMission(const std::string & reason, bool allow_reset);

  std::string buildJson(
    const std::vector<MissionItem> & items,
    uint16_t count,
    uint32_t opaque_id,
    const std::string & status,
    const std::string & note) const;
  std::string buildCustomMission(const std::vector<MissionItem> & items) const;
  std::string buildRawItems(const std::vector<MissionItem> & items) const;
  std::string convertItem(const MissionItem & item) const;
  std::string commandName(uint16_t command) const;
  std::string frameName(uint8_t frame) const;
  std::string jsonString(const std::string & text) const;
  std::string hashText(const std::string & text) const;
  std::string defaultOutputFile() const;

  void loadCache();
  void updateCache(
    const std::string & json,
    uint16_t count,
    uint32_t opaque_id,
    const std::string & hash,
    const std::string & status);
  void publishJsonIfChanged(
    const std::string & json,
    const std::string & signature,
    const std::string & reason);
  void publishResetIfNeeded(
    const std::string & reason,
    const std::string & signature,
    bool allow_reset);
  void saveJson(const std::string & json);
  std::string extractString(const std::string & json, const std::string & key) const;
  std::optional<uint64_t> extractNumber(const std::string & json, const std::string & key) const;

  std::string bind_ip_;
  std::string output_file_;
  int bind_port_{14551};
  double poll_period_s_{0.02};
  int read_budget_ms_{50};
  double transfer_timeout_s_{8.0};
  bool publish_reset_on_mission_change_{true};
  bool publish_reset_on_startup_change_{false};
  double reset_publish_min_interval_s_{1.0};
  std::string adaptive_reset_topic_{"/adaptive_mission_mode/reset"};
  bool publish_unknown_on_remote_change_{true};
  bool publish_empty_from_mission_current_{true};

  int sock_{-1};
  uint8_t own_sysid_{250};
  uint8_t own_compid_{190};
  uint8_t target_sysid_{1};
  uint8_t target_compid_{1};
  uint8_t mission_type_{MAV_MISSION_TYPE_MISSION};

  bool has_fc_heartbeat_{false};
  rclcpp::Time last_fc_heartbeat_{};
  sockaddr_in last_fc_addr_{};

  bool remote_mission_id_valid_{false};
  uint32_t remote_mission_id_{0};
  bool remote_total_valid_{false};
  uint16_t remote_total_{0};
  bool mission_current_total_supported_{false};
  bool startup_phase_{true};

  PassiveTransfer transfer_;
  bool pending_clear_{false};
  uint8_t pending_clear_peer_sysid_{0};
  uint8_t pending_clear_peer_compid_{0};
  rclcpp::Time pending_clear_time_{};

  bool has_cache_{false};
  uint16_t cached_count_{0};
  uint32_t cached_opaque_id_{0};
  std::string cached_hash_;
  std::string cached_json_;
  std::string cached_status_;

  std::string last_published_signature_;
  std::string last_reset_signature_;
  rclcpp::Time last_reset_publish_{};

  rclcpp::TimerBase::SharedPtr timer_;
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr pub_;
  rclcpp::Publisher<std_msgs::msg::Bool>::SharedPtr reset_pub_;
};

}  // namespace fc_mission_reader
