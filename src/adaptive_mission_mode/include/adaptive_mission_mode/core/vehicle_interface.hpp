/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <cstdint>
#include <memory>
#include <optional>
#include <string>

#include <rclcpp/rclcpp.hpp>
#include <px4_msgs/msg/manual_control_setpoint.hpp>
#include <px4_msgs/msg/mode_completed.hpp>
#include <px4_msgs/msg/vehicle_command.hpp>
#include <px4_msgs/msg/vehicle_command_ack.hpp>
#include <px4_msgs/msg/vehicle_local_position.hpp>
#include <px4_msgs/msg/vehicle_status.hpp>
#include <px4_ros2/components/mode.hpp>
#include <px4_ros2/vehicle_state/land_detected.hpp>
#include <px4_ros2/vehicle_state/vehicle_status.hpp>

#include "adaptive_mission_mode/core/mission_blackboard.hpp"

namespace adaptive_mission_mode
{

class VehicleInterface
{
public:
  VehicleInterface(
    std::shared_ptr<rclcpp::Node> node,
    std::shared_ptr<MissionBlackboard> blackboard,
    std::string topicNamespacePrefix);

  bool hasRecentVehicleStatus(double maxAgeSec) const;
  bool hasRecentLandDetected(double maxAgeSec) const;
  bool armed() const;
  bool landed() const;
  std::uint8_t navState() const;
  std::optional<float> currentAltitudeAmslM() const;
  bool modeCompletedSince(std::uint8_t modeId, double sinceSec) const;

  px4_ros2::Result sendVehicleCommandSync(
    std::uint32_t command,
    float param1 = NAN,
    float param2 = NAN,
    float param3 = NAN,
    float param4 = NAN,
    float param5 = NAN,
    float param6 = NAN,
    float param7 = NAN);

  void sendVehicleCommand(
    std::uint32_t command,
    float param1 = NAN,
    float param2 = NAN,
    float param3 = NAN,
    float param4 = NAN,
    float param5 = NAN,
    float param6 = NAN,
    float param7 = NAN);

private:
  void handleVehicleStatus(const px4_msgs::msg::VehicleStatus & message);
  void handleModeCompleted(const px4_msgs::msg::ModeCompleted::SharedPtr message);
  void handleLocalPosition(const px4_msgs::msg::VehicleLocalPosition::SharedPtr message);
  void handleManualControl(const px4_msgs::msg::ManualControlSetpoint::SharedPtr message);
  double nowSec() const;
  std::string px4Topic(const std::string & relativeTopic) const;

  std::shared_ptr<rclcpp::Node> node_;
  std::shared_ptr<MissionBlackboard> blackboard_;
  std::string topicNamespacePrefix_;

  std::unique_ptr<px4_ros2::VehicleStatus> vehicleStatusMonitor_;
  std::unique_ptr<px4_ros2::LandDetected> landDetectedMonitor_;
  std::uint8_t lastCompletedModeId_{0U};
  double lastCompletedModeSec_{0.0};
  rclcpp::Publisher<px4_msgs::msg::VehicleCommand>::SharedPtr vehicleCommandPub_;
  rclcpp::Subscription<px4_msgs::msg::ModeCompleted>::SharedPtr modeCompletedSub_;
  rclcpp::Subscription<px4_msgs::msg::VehicleLocalPosition>::SharedPtr localPositionSub_;
  rclcpp::Subscription<px4_msgs::msg::ManualControlSetpoint>::SharedPtr manualControlSub_;
};

}  // namespace adaptive_mission_mode
