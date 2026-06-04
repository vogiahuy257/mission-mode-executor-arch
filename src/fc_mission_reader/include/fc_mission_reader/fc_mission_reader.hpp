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

#include <chrono>
#include <cstddef>
#include <cstdint>
#include <optional>
#include <string>
#include <vector>

#include <rclcpp/rclcpp.hpp>
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
  uint8_t mission_type{0};
  float p1{0.0F};
  float p2{0.0F};
  float p3{0.0F};
  float p4{0.0F};
  double x{0.0};
  double y{0.0};
  float z{0.0F};
};

class FcMissionReader : public rclcpp::Node
{
public:
  explicit FcMissionReader(const rclcpp::NodeOptions & options = rclcpp::NodeOptions());
  ~FcMissionReader() override;

private:
  bool openSocket();
  void poll();
  void drainEvents(int timeout_ms);
  void observeMessage(const mavlink_message_t & msg);
  void requestMissionSync(const std::string & reason);
  void handleEmptyMission(uint32_t opaque_id, const std::string & reason, bool publish_even_if_unchanged);
  bool missionIdChanged() const;
  bool readMissionInfo(uint16_t & count, uint32_t & opaque_id);
  bool readMissionInfoFromCurrentEndpoint(uint16_t & count, uint32_t & opaque_id);
  bool readMissionItems(uint16_t count, std::vector<MissionItem> & items);
  bool readMission(std::vector<MissionItem> & items, uint16_t & count, uint32_t & opaque_id);
  bool waitHeartbeat();
  bool waitCount(uint16_t & count, uint32_t & opaque_id);
  bool waitItem(uint16_t seq, MissionItem & item);
  bool readMessage(mavlink_message_t & msg, int timeout_ms);

  void sendMessage(const mavlink_message_t & msg);
  void rememberSender(const sockaddr_in & src, const mavlink_message_t & msg);
  std::string addrText(const sockaddr_in & addr) const;
  void sendRequestList();
  void sendRequestItem(uint16_t seq);
  void sendAck();

  std::string buildJson(
    const std::vector<MissionItem> & items, uint16_t count, uint32_t opaque_id) const;
  std::string buildCustomMission(const std::vector<MissionItem> & items) const;
  std::string buildRawItems(const std::vector<MissionItem> & items) const;
  std::string convertItem(const MissionItem & item) const;
  std::string commandName(uint16_t command) const;
  std::string frameName(uint8_t frame) const;
  std::string jsonString(const std::string & text) const;
  std::string hashText(const std::string & text) const;
  std::string defaultOutputFile() const;

  void loadCache();
  void updateCache(const std::string & json, uint16_t count, uint32_t opaque_id, const std::string & hash);
  void publishJson(const std::string & json);
  bool canPublishCachedMissionContinuously() const;
  void publishCachedMissionContinuously();
  void saveJson(const std::string & json);
  void publishAndSave(const std::string & json);
  void publishFailure(const std::string & note);
  bool shouldDownload(uint16_t count, uint32_t opaque_id) const;
  bool shouldInitialDownload() const;
  bool shouldPollMissionInfo() const;
  std::string extractString(const std::string & json, const std::string & key) const;
  std::optional<uint64_t> extractNumber(const std::string & json, const std::string & key) const;

  std::string bind_ip_;
  std::string target_ip_;
  std::string output_file_;
  int bind_port_{14551};
  int target_port_{14550};
  int timeout_ms_{3000};
  int retries_{3};
  double poll_period_s_{3.0};
  double fallback_count_poll_s_{60.0};
  bool enable_fallback_count_poll_{false};
  bool publish_cached_mission_continuously_{true};

  int sock_{-1};
  sockaddr_in target_addr_{};
  uint8_t own_sysid_{250};
  uint8_t own_compid_{190};
  uint8_t target_sysid_{1};
  uint8_t target_compid_{1};
  uint8_t mission_type_{MAV_MISSION_TYPE_MISSION};

  bool busy_{false};
  bool force_download_{false};
  bool initial_sync_done_{false};
  bool remote_reported_empty_{false};
  uint32_t remote_mission_id_{0};
  bool remote_mission_id_valid_{false};
  uint16_t remote_total_{0};
  bool remote_total_valid_{false};
  bool mission_current_total_supported_{false};
  std::string sync_reason_{"startup"};
  rclcpp::Time last_count_poll_{};
  bool has_cache_{false};
  uint16_t cached_count_{0};
  uint32_t cached_opaque_id_{0};
  std::string cached_hash_;
  std::string cached_json_;
  rclcpp::Time last_full_download_{};
  bool auto_target_{true};
  bool has_learned_target_{false};
  sockaddr_in learned_addr_{};
  bool has_observed_peer_{false};
  bool prefer_observed_peer_for_requests_{false};
  sockaddr_in observed_peer_addr_{};
  bool startup_failure_published_{false};
  rclcpp::TimerBase::SharedPtr timer_;
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr pub_;
};

}  // namespace fc_mission_reader
