/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/core/vehicle_interface.hpp"

#include <chrono>

#include <px4_ros2/common/context.hpp>
#include <px4_ros2/utils/message_version.hpp>

using namespace std::chrono_literals;

namespace adaptive_mission_mode
{

VehicleInterface::VehicleInterface(
  std::shared_ptr<rclcpp::Node> node,
  std::shared_ptr<MissionBlackboard> blackboard,
  std::string topicNamespacePrefix)
: node_(std::move(node)),
  blackboard_(std::move(blackboard)),
  topicNamespacePrefix_(std::move(topicNamespacePrefix))
{
  px4_ros2::Context context(*node_, topicNamespacePrefix_);
  vehicleStatusMonitor_ = std::make_unique<px4_ros2::VehicleStatus>(context);
  landDetectedMonitor_ = std::make_unique<px4_ros2::LandDetected>(context);
  vehicleStatusMonitor_->onUpdate([this](const px4_msgs::msg::VehicleStatus & status) {
    handleVehicleStatus(status);
  });

  vehicleCommandPub_ = node_->create_publisher<px4_msgs::msg::VehicleCommand>(
    px4Topic(
      "fmu/in/vehicle_command" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleCommand>()),
    1);

  modeCompletedSub_ = node_->create_subscription<px4_msgs::msg::ModeCompleted>(
    px4Topic(
      "fmu/out/mode_completed" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::ModeCompleted>()),
    rclcpp::QoS(1).best_effort(),
    [this](const px4_msgs::msg::ModeCompleted::SharedPtr message) {
      handleModeCompleted(message);
    });

  localPositionSub_ = node_->create_subscription<px4_msgs::msg::VehicleLocalPosition>(
    px4Topic(
      "fmu/out/vehicle_local_position" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleLocalPosition>()),
    rclcpp::QoS(1).best_effort(),
    [this](const px4_msgs::msg::VehicleLocalPosition::SharedPtr message) {
      handleLocalPosition(message);
    });

  manualControlSub_ = node_->create_subscription<px4_msgs::msg::ManualControlSetpoint>(
    px4Topic(
      "fmu/out/manual_control_setpoint" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::ManualControlSetpoint>()),
    rclcpp::QoS(1).best_effort(),
    [this](const px4_msgs::msg::ManualControlSetpoint::SharedPtr message) {
      handleManualControl(message);
    });
}

bool VehicleInterface::hasRecentVehicleStatus(double maxAgeSec) const
{
  return vehicleStatusMonitor_ && vehicleStatusMonitor_->lastValid(
    std::chrono::duration_cast<std::chrono::nanoseconds>(
      std::chrono::duration<double>(maxAgeSec)));
}

bool VehicleInterface::hasRecentLandDetected(double maxAgeSec) const
{
  return landDetectedMonitor_ && landDetectedMonitor_->lastValid(
    std::chrono::duration_cast<std::chrono::nanoseconds>(
      std::chrono::duration<double>(maxAgeSec)));
}

bool VehicleInterface::armed() const
{
  return vehicleStatusMonitor_ && vehicleStatusMonitor_->armed();
}

bool VehicleInterface::landed() const
{
  return landDetectedMonitor_ && landDetectedMonitor_->lastValid(3s) && landDetectedMonitor_->landed();
}

std::uint8_t VehicleInterface::navState() const
{
  if (!vehicleStatusMonitor_) {
    return 0U;
  }

  return vehicleStatusMonitor_->navState();
}

std::optional<float> VehicleInterface::currentAltitudeAmslM() const
{
  const auto state = blackboard_->vehicleState();
  if (!state.valid || !state.globalAltitudeAmslValid) {
    return std::nullopt;
  }

  return state.globalAltitudeAmslM;
}

bool VehicleInterface::modeCompletedSince(std::uint8_t modeId, double sinceSec) const
{
  return lastCompletedModeId_ == modeId && lastCompletedModeSec_ >= sinceSec;
}

px4_ros2::Result VehicleInterface::sendVehicleCommandSync(
  std::uint32_t command,
  float param1,
  float param2,
  float param3,
  float param4,
  float param5,
  float param6,
  float param7)
{
  px4_ros2::Result result{px4_ros2::Result::Rejected};

  px4_msgs::msg::VehicleCommand message{};
  message.timestamp = static_cast<std::uint64_t>(node_->now().nanoseconds() / 1000ULL);
  message.command = command;
  message.param1 = param1;
  message.param2 = param2;
  message.param3 = param3;
  message.param4 = param4;
  message.param5 = param5;
  message.param6 = param6;
  message.param7 = param7;
  message.target_system = 1;
  message.target_component = 1;
  message.source_system = 1;
  message.source_component = 1;
  message.from_external = true;

  const auto vehicleCommandAckSub =
    node_->create_subscription<px4_msgs::msg::VehicleCommandAck>(
    px4Topic(
      "fmu/out/vehicle_command_ack" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleCommandAck>()),
    rclcpp::QoS(1).best_effort(),
    [](px4_msgs::msg::VehicleCommandAck::UniquePtr) {});

  auto startTime = std::chrono::steady_clock::now();
  while (vehicleCommandAckSub->get_publisher_count() == 0) {
    const auto timeout = 3s;
    const auto now = std::chrono::steady_clock::now();
    if (now >= startTime + timeout) {
      RCLCPP_WARN(node_->get_logger(), "Timeout waiting for vehicle_command_ack publisher");
      break;
    }
  }

  rclcpp::WaitSet waitSet;
  waitSet.add_subscription(vehicleCommandAckSub);

  bool gotReply = false;

  for (int attempt = 0; attempt < 3 && !gotReply; ++attempt) {
    vehicleCommandPub_->publish(message);
    startTime = std::chrono::steady_clock::now();
    const auto timeout = 300ms;

    while (!gotReply) {
      const auto now = std::chrono::steady_clock::now();
      if (now >= startTime + timeout) {
        break;
      }

      const auto waitResult = waitSet.wait(timeout - (now - startTime));
      if (waitResult.kind() != rclcpp::WaitResultKind::Ready) {
        continue;
      }

      px4_msgs::msg::VehicleCommandAck ack{};
      rclcpp::MessageInfo info;
      if (!vehicleCommandAckSub->take(ack, info)) {
        continue;
      }

      if (ack.command != message.command || ack.target_component != message.source_component) {
        continue;
      }

      if (ack.result == px4_msgs::msg::VehicleCommandAck::VEHICLE_CMD_RESULT_ACCEPTED) {
        result = px4_ros2::Result::Success;
      }

      gotReply = true;
    }
  }

  waitSet.remove_subscription(vehicleCommandAckSub);

  if (!gotReply) {
    RCLCPP_WARN(node_->get_logger(), "Cmd %u: timeout, no ack received", command);
    return px4_ros2::Result::Timeout;
  }

  return result;
}

void VehicleInterface::sendVehicleCommand(
  std::uint32_t command,
  float param1,
  float param2,
  float param3,
  float param4,
  float param5,
  float param6,
  float param7)
{
  px4_msgs::msg::VehicleCommand message{};
  message.timestamp = static_cast<std::uint64_t>(node_->now().nanoseconds() / 1000ULL);
  message.command = command;
  message.param1 = param1;
  message.param2 = param2;
  message.param3 = param3;
  message.param4 = param4;
  message.param5 = param5;
  message.param6 = param6;
  message.param7 = param7;
  message.target_system = 1;
  message.target_component = 1;
  message.source_system = 1;
  message.source_component = 1;
  message.from_external = true;

  vehicleCommandPub_->publish(message);
}

void VehicleInterface::handleVehicleStatus(const px4_msgs::msg::VehicleStatus & message)
{
  auto state = blackboard_->vehicleState();
  state.valid = true;
  state.armed = message.arming_state == px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED;
  state.navState = message.nav_state;
  state.lastUpdateSec = nowSec();
  blackboard_->setVehicleState(state);
}

void VehicleInterface::handleModeCompleted(const px4_msgs::msg::ModeCompleted::SharedPtr message)
{
  if (!message) {
    return;
  }

  if (message->result != px4_msgs::msg::ModeCompleted::RESULT_SUCCESS) {
    return;
  }

  lastCompletedModeId_ = message->nav_state;
  lastCompletedModeSec_ = nowSec();
}

void VehicleInterface::handleLocalPosition(
  const px4_msgs::msg::VehicleLocalPosition::SharedPtr message)
{
  auto state = blackboard_->vehicleState();
  state.valid = true;
  state.localPositionNed = {message->x, message->y, message->z};
  state.localVelocityNed = {message->vx, message->vy, message->vz};
  state.globalAltitudeAmslValid = message->z_global;
  state.globalAltitudeAmslM = message->ref_alt - message->z;
  state.headingRad = message->heading;
  state.distBottomM = message->dist_bottom;
  state.distBottomValid = message->dist_bottom_valid;
  state.lastUpdateSec = nowSec();
  blackboard_->setVehicleState(state);
}

void VehicleInterface::handleManualControl(
  const px4_msgs::msg::ManualControlSetpoint::SharedPtr message)
{
  ManualControlState state{};
  state.valid = true;
  state.roll = message->roll;
  state.pitch = message->pitch;
  state.throttle = message->throttle;
  state.yaw = message->yaw;
  state.lastUpdateSec = nowSec();
  blackboard_->setManualControlState(state);
}

double VehicleInterface::nowSec() const
{
  return static_cast<double>(node_->now().nanoseconds()) * 1.0e-9;
}

std::string VehicleInterface::px4Topic(const std::string & relativeTopic) const
{
  return topicNamespacePrefix_ + relativeTopic;
}

}  // namespace adaptive_mission_mode
