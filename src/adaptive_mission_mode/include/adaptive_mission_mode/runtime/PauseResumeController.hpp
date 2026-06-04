#pragma once

#include <string>

#include <px4_ros2/third_party/nlohmann/json.hpp>

#include <rclcpp/rclcpp.hpp>

namespace adaptive_mission_mode
{

enum class PauseResumePhase
{
  None,
  ReturningRtl,
  Disarming,
  WaitingContinue,
  ResumeRequested
};

struct PauseResumeUpdate
{
  bool armed{};

  bool landed{};

  bool resumeMissionPending{};

  rclcpp::Time now{};
};

struct PauseResumeAction
{
  bool sendRtl{};

  bool sendDisarm{};
};

class PauseResumeController
{
public:
  // Reset toàn bộ trạng thái pause/continue.
  void reset();

  // Bắt đầu luồng pause_rtl: RTL về home, đợi landed/disarm, rồi chờ continue.
  void startPauseRtl(const rclcpp::Time & now);

  // Ghi nhận lệnh continue khi drone đã RTL xong và đang chờ.
  bool requestContinue();

  // Cập nhật state machine pause/continue và trả về lệnh cần gửi cho PX4.
  PauseResumeAction update(const PauseResumeUpdate & input);

  // Đánh dấu node đã bắt đầu luồng takeoff/resume sau continue.
  void markResumeStarted();

  PauseResumePhase phase() const;

  bool running() const;

  bool waitingContinue() const;

  bool resumeRequested() const;

  std::string stateName() const;

  nlohmann::json toJson() const;

private:
  bool shouldSend(const rclcpp::Time & now, rclcpp::Time & lastCommandTime, double intervalSec);

  PauseResumePhase phase_{PauseResumePhase::None};

  rclcpp::Time lastRtlCommand_{};

  rclcpp::Time lastDisarmCommand_{};
};

}  // namespace adaptive_mission_mode
