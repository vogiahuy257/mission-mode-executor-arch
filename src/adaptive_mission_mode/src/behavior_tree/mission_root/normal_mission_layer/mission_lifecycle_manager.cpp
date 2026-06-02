/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_lifecycle_manager.hpp"

#include <cmath>
#include <sstream>

#include <px4_msgs/msg/vehicle_command.hpp>

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
{

MissionLifecycleManager::MissionLifecycleManager(
  std::shared_ptr<rclcpp::Node> node,
  std::shared_ptr<MissionBlackboard> blackboard,
  AdaptiveMissionExecutor & missionExecutor,
  VehicleInterface & vehicleInterface)
: node_(std::move(node)),
  blackboard_(std::move(blackboard)),
  missionExecutor_(missionExecutor),
  vehicleInterface_(vehicleInterface)
{
  runPreflightChecks_ = node_->declare_parameter<bool>("bt_lifecycle.run_preflight_checks", true);
  startStageTimeoutSec_ = node_->declare_parameter<double>("bt_lifecycle.start_stage_timeout_sec", 8.0);
  takeoffIfLanded_ = node_->declare_parameter<bool>("mission.start_policy.takeoff_if_landed", true);
  takeoffStageTimeoutSec_ = node_->declare_parameter<double>(
    "mission.start_policy.takeoff_completion_timeout_sec",
    45.0);

  startSub_ = node_->create_subscription<std_msgs::msg::Bool>(
    "~/start",
    rclcpp::QoS(1).reliable(),
    [this](const std_msgs::msg::Bool::SharedPtr message) {
      handleStartTopic(message);
    });
}

void MissionLifecycleManager::setMissionReady(
  bool ready,
  const std::vector<std::string> & errors)
{
  blackboard_->setMissionReady(ready, errors);

  if (ready) {
    RCLCPP_INFO(node_->get_logger(), "Mission executor is ready");
    return;
  }

  RCLCPP_WARN(node_->get_logger(), "Mission executor is not ready: %s", joinErrors(errors).c_str());
}

void MissionLifecycleManager::setMissionActive(bool active)
{
  blackboard_->setMissionActive(active);
  blackboard_->setMissionStartInProgress(false);

  if (active) {
    pendingStart_ = false;
    autoStartStage_ = AutoStartStage::Idle;
    autoStartSource_.clear();
    blackboard_->setRuntimeState(MissionRuntimeState::Running);
    RCLCPP_INFO(node_->get_logger(), "Mission executor activated");
    return;
  }

  if (blackboard_->runtimeState() == MissionRuntimeState::Running) {
    blackboard_->setRuntimeState(MissionRuntimeState::Idle);
  }

  RCLCPP_INFO(node_->get_logger(), "Mission executor deactivated");
}

void MissionLifecycleManager::setCurrentItemIndex(int currentIndex)
{
  blackboard_->setCurrentItemIndex(currentIndex);
}

void MissionLifecycleManager::setMissionStartRequiresTakeoff(bool required)
{
  missionStartRequiresTakeoff_ = required;
}

void MissionLifecycleManager::setMissionStartTakeoffAltitudeRelativeM(
  std::optional<float> altitudeRelativeM)
{
  missionStartTakeoffAltitudeRelativeM_ = altitudeRelativeM;
}

void MissionLifecycleManager::setMissionStartTakeoffAltitudeAmsl(std::optional<float> altitudeAmsl)
{
  missionStartTakeoffAltitudeAmsl_ = altitudeAmsl;
}

void MissionLifecycleManager::notifyMissionCompleted()
{
  pendingStart_ = false;
  blackboard_->setRuntimeState(MissionRuntimeState::Completed);
  RCLCPP_INFO(node_->get_logger(), "Mission completed");
}

void MissionLifecycleManager::requestStart(const std::string & source)
{
  if (pendingStart_ || blackboard_->missionActive()) {
    RCLCPP_WARN(node_->get_logger(), "Mission start request ignored because mission is busy");
    return;
  }

  pendingStart_ = true;
  autoStartSource_ = source;
  autoStartStage_ = AutoStartStage::Idle;
  blackboard_->setRuntimeState(MissionRuntimeState::Starting);
  blackboard_->setMissionStartInProgress(true);
  RCLCPP_INFO(node_->get_logger(), "Mission start requested from %s", source.c_str());
}

MissionTickResult MissionLifecycleManager::tickOriginalMissionExecutor()
{
  blackboard_->setActiveBtBranch("NormalMissionLayer/OriginalMissionExecutorLayer");

  if (blackboard_->missionActive()) {
    if (blackboard_->runtimeState() != MissionRuntimeState::Completed) {
      blackboard_->setRuntimeState(MissionRuntimeState::Running);
    }
    return MissionTickResult::Running;
  }

  if (!pendingStart_) {
    return MissionTickResult::Running;
  }

  startOrContinueAutoStart();
  return MissionTickResult::Running;
}

void MissionLifecycleManager::handleStartTopic(const std_msgs::msg::Bool::SharedPtr message)
{
  if (message && message->data) {
    requestStart("topic ~/start");
  }
}

void MissionLifecycleManager::startOrContinueAutoStart()
{
  if (!blackboard_->missionReady()) {
    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      2000,
      "Mission start is pending but executor is not ready yet");
    return;
  }

  if (blackboard_->missionActive()) {
    pendingStart_ = false;
    return;
  }

  if (!vehicleInterface_.hasRecentVehicleStatus(2.0)) {
    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      2000,
      "Mission start is pending but recent vehicle status is not available");
    return;
  }

  if (!vehicleInterface_.hasRecentLandDetected(2.0)) {
    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      2000,
      "Mission start is pending but recent landed state is not available");
    return;
  }

  if (
    missionStartTakeoffAltitudeRelativeM_.has_value() &&
    !vehicleInterface_.currentAltitudeAmslM().has_value())
  {
    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      2000,
      "Mission start is pending but current AMSL altitude is not available for takeoff altitude_m");
    return;
  }

  if (autoStartStage_ == AutoStartStage::Idle) {
    if (!vehicleInterface_.armed()) {
      waitUntilReadyToArmAndExecute();
      return;
    } else if (shouldRunStartTakeoff()) {
      startTakeoffBeforeMission();
      return;
    } else if (vehicleInterface_.landed()) {
      rejectPendingStart("Mission start requires manual takeoff before activation.");
      return;
    }

    if (missionModeSelected()) {
      setStage(AutoStartStage::WaitingForMissionActivation);
      return;
    }

    activateMissionMode();
    return;
  }

  if (autoStartStage_ == AutoStartStage::WaitingForReadyToArm) {
    if (stageTimedOut(startStageTimeoutSec_)) {
      finishAutoStartAttempt("waitReadyToArm", px4_ros2::Result::Timeout);
    }
    return;
  }

  if (autoStartStage_ == AutoStartStage::Arming) {
    if (vehicleInterface_.armed()) {
      autoStartStage_ = AutoStartStage::Idle;
      return;
    }

    if (stageTimedOut(startStageTimeoutSec_)) {
      finishAutoStartAttempt("arm", px4_ros2::Result::Timeout);
    }
    return;
  }

  if (autoStartStage_ == AutoStartStage::TakingOff) {
    if (vehicleInterface_.modeCompletedSince(px4_ros2::ModeBase::kModeIDTakeoff, stageStartSec_)) {
      activateMissionMode();
      return;
    }

    if (stageTimedOut(takeoffStageTimeoutSec_)) {
      finishAutoStartAttempt("takeoff", px4_ros2::Result::Timeout);
    }
    return;
  }

  if (autoStartStage_ == AutoStartStage::WaitingForMissionActivation) {
    if (blackboard_->missionActive()) {
      pendingStart_ = false;
      autoStartSource_.clear();
      autoStartStage_ = AutoStartStage::Idle;
      return;
    }

    if (stageTimedOut(startStageTimeoutSec_)) {
      finishAutoStartAttempt("activateMission", px4_ros2::Result::Timeout);
    }
    return;
  }
}

void MissionLifecycleManager::waitUntilReadyToArmAndExecute()
{
  setStage(AutoStartStage::WaitingForReadyToArm);
  missionExecutor_.modeExecutorHandle().waitReadyToArm(
    [this](px4_ros2::Result result) {
      if (result != px4_ros2::Result::Success) {
        finishAutoStartAttempt("waitReadyToArm", result);
        return;
      }

      sendArmCommand();
    });
}

void MissionLifecycleManager::sendArmCommand()
{
  setStage(AutoStartStage::Arming);
  const float armParam2 = runPreflightChecks_ ? NAN : 21196.0F;
  const auto result = vehicleInterface_.sendVehicleCommandSync(
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM,
    1.0F,
    armParam2);
  if (result != px4_ros2::Result::Success) {
    finishAutoStartAttempt("arm", result);
  }
}

void MissionLifecycleManager::startTakeoffBeforeMission()
{
  std::optional<float> targetTakeoffAltitudeAmsl = missionStartTakeoffAltitudeAmsl_;
  if (missionStartTakeoffAltitudeRelativeM_.has_value()) {
    const auto currentAltitudeAmsl = vehicleInterface_.currentAltitudeAmslM();
    if (!currentAltitudeAmsl.has_value()) {
      rejectPendingStart(
        "Mission takeoff altitude_m requires a valid global altitude reference from PX4 local position.");
      return;
    }
    targetTakeoffAltitudeAmsl = *currentAltitudeAmsl + *missionStartTakeoffAltitudeRelativeM_;
  }

  if (missionStartTakeoffAltitudeRelativeM_.has_value() && targetTakeoffAltitudeAmsl.has_value()) {
    RCLCPP_INFO(
      node_->get_logger(),
      "Running PX4 takeoff before starting mission from %s with target relative altitude %.2f m "
      "(AMSL %.2f m)",
      autoStartSource_.c_str(),
      static_cast<double>(*missionStartTakeoffAltitudeRelativeM_),
      static_cast<double>(*targetTakeoffAltitudeAmsl));
  } else if (targetTakeoffAltitudeAmsl.has_value()) {
    RCLCPP_INFO(
      node_->get_logger(),
      "Running PX4 takeoff before starting mission from %s with target AMSL altitude %.2f m",
      autoStartSource_.c_str(),
      static_cast<double>(*targetTakeoffAltitudeAmsl));
  } else {
    RCLCPP_INFO(
      node_->get_logger(),
      "Running PX4 takeoff before starting mission from %s",
      autoStartSource_.c_str());
  }

  setStage(AutoStartStage::TakingOff);
  const auto result = vehicleInterface_.sendVehicleCommandSync(
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_TAKEOFF,
    NAN,
    NAN,
    NAN,
    NAN,
    NAN,
    NAN,
    targetTakeoffAltitudeAmsl.value_or(NAN));
  if (result != px4_ros2::Result::Success) {
    finishAutoStartAttempt("takeoff", result);
  }
}

void MissionLifecycleManager::activateMissionMode()
{
  setStage(AutoStartStage::WaitingForMissionActivation);
  const auto result = vehicleInterface_.sendVehicleCommandSync(
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE,
    static_cast<float>(missionExecutor_.modeIdHandle()));
  if (result != px4_ros2::Result::Success) {
    finishAutoStartAttempt("activateMission", result);
  }
}

void MissionLifecycleManager::rejectPendingStart(const std::string & reason)
{
  pendingStart_ = false;
  autoStartSource_.clear();
  autoStartStage_ = AutoStartStage::Idle;
  blackboard_->setMissionStartInProgress(false);
  blackboard_->setRuntimeState(MissionRuntimeState::Failed);
  blackboard_->setLastError(reason);

  RCLCPP_ERROR(node_->get_logger(), "%s", reason.c_str());
}

void MissionLifecycleManager::finishAutoStartAttempt(
  const std::string & stage,
  px4_ros2::Result result)
{
  if (result == px4_ros2::Result::Success) {
    return;
  }

  pendingStart_ = false;
  autoStartSource_.clear();
  autoStartStage_ = AutoStartStage::Idle;
  blackboard_->setMissionStartInProgress(false);
  blackboard_->setRuntimeState(MissionRuntimeState::Failed);
  blackboard_->setLastError(stage + " failed: " + px4_ros2::resultToString(result));

  RCLCPP_ERROR(
    node_->get_logger(),
    "Mission auto-start failed during %s: %s",
    stage.c_str(),
    px4_ros2::resultToString(result));
}

bool MissionLifecycleManager::shouldRunStartTakeoff() const
{
  return (missionStartRequiresTakeoff_ || takeoffIfLanded_) && vehicleInterface_.landed();
}

bool MissionLifecycleManager::missionModeSelected() const
{
  return vehicleInterface_.navState() == static_cast<std::uint8_t>(missionExecutor_.modeIdHandle());
}

bool MissionLifecycleManager::stageTimedOut(double timeoutSec) const
{
  return (nowSec() - stageStartSec_) > timeoutSec;
}

void MissionLifecycleManager::setStage(AutoStartStage stage)
{
  autoStartStage_ = stage;
  stageStartSec_ = nowSec();
}

double MissionLifecycleManager::nowSec() const
{
  return static_cast<double>(node_->now().nanoseconds()) * 1.0e-9;
}

std::string MissionLifecycleManager::joinErrors(const std::vector<std::string> & errors) const
{
  std::ostringstream stream;
  for (std::size_t index = 0; index < errors.size(); ++index) {
    if (index > 0) {
      stream << "; ";
    }
    stream << errors[index];
  }
  return stream.str();
}

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
