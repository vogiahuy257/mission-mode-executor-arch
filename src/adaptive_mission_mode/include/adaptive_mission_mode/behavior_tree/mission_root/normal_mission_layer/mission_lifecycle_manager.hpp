/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <cstdint>
#include <memory>
#include <optional>
#include <string>
#include <vector>

#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/bool.hpp>
#include <px4_ros2/mission/mission_executor.hpp>

#include "adaptive_mission_mode/core/adaptive_mission_executor.hpp"
#include "adaptive_mission_mode/core/mission_blackboard.hpp"
#include "adaptive_mission_mode/core/vehicle_interface.hpp"

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
{

enum class MissionTickResult : std::uint8_t
{
  Failure,
  Success,
  Running,
};

class MissionLifecycleManager
{
public:
  MissionLifecycleManager(
    std::shared_ptr<rclcpp::Node> node,
    std::shared_ptr<MissionBlackboard> blackboard,
    AdaptiveMissionExecutor & missionExecutor,
    VehicleInterface & vehicleInterface);

  void setMissionReady(bool ready, const std::vector<std::string> & errors);
  void setMissionActive(bool active);
  void setCurrentItemIndex(int currentIndex);
  void setMissionStartRequiresTakeoff(bool required);
  void setMissionStartTakeoffAltitudeRelativeM(std::optional<float> altitudeRelativeM);
  void setMissionStartTakeoffAltitudeAmsl(std::optional<float> altitudeAmsl);
  void notifyMissionCompleted();
  void requestStart(const std::string & source);

  MissionTickResult tickOriginalMissionExecutor();

private:
  enum class AutoStartStage : std::uint8_t
  {
    Idle,
    WaitingForReadyToArm,
    Arming,
    TakingOff,
    WaitingForMissionActivation,
  };

  void handleStartTopic(const std_msgs::msg::Bool::SharedPtr message);
  void startOrContinueAutoStart();
  void waitUntilReadyToArmAndExecute();
  void sendArmCommand();
  void startTakeoffBeforeMission();
  void activateMissionMode();
  void rejectPendingStart(const std::string & reason);
  void finishAutoStartAttempt(const std::string & stage, px4_ros2::Result result);
  bool missionModeSelected() const;
  bool shouldRunStartTakeoff() const;
  bool stageTimedOut(double timeoutSec) const;
  void setStage(AutoStartStage stage);
  double nowSec() const;
  std::string joinErrors(const std::vector<std::string> & errors) const;

  std::shared_ptr<rclcpp::Node> node_;
  std::shared_ptr<MissionBlackboard> blackboard_;
  AdaptiveMissionExecutor & missionExecutor_;
  VehicleInterface & vehicleInterface_;

  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr startSub_;

  bool runPreflightChecks_{true};
  bool takeoffIfLanded_{true};
  bool missionStartRequiresTakeoff_{false};
  std::optional<float> missionStartTakeoffAltitudeRelativeM_;
  std::optional<float> missionStartTakeoffAltitudeAmsl_;
  bool pendingStart_{false};
  double stageStartSec_{0.0};
  double startStageTimeoutSec_{8.0};
  double takeoffStageTimeoutSec_{45.0};
  AutoStartStage autoStartStage_{AutoStartStage::Idle};
  std::string autoStartSource_;
};

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
