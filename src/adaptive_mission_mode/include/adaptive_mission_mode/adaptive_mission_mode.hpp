/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>
#include <optional>
#include <string>
#include <vector>

#include <rclcpp/rclcpp.hpp>
#include <px4_ros2/mission/mission.hpp>
#include <std_msgs/msg/string.hpp>

#include "adaptive_mission_mode/behavior_tree/core/bt_mission_runner.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/manual_control_layer/manual_altitude_assist.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/builtin_mission_provider.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_lifecycle_manager.hpp"
#include "adaptive_mission_mode/core/adaptive_mission_executor.hpp"
#include "adaptive_mission_mode/core/mission_blackboard.hpp"
#include "adaptive_mission_mode/core/mission_status_publisher.hpp"
#include "adaptive_mission_mode/core/vehicle_interface.hpp"

namespace adaptive_mission_mode
{

class AdaptiveMissionModeApp
{
public:
  explicit AdaptiveMissionModeApp(std::shared_ptr<rclcpp::Node> node);

private:
  void setupMissionExecutor(
    const std::string & modeName,
    const std::string & persistenceFile,
    const std::string & topicNamespacePrefix);
  void setupRuntimeModules();
  void setupCallbacks();
  void setupRuntimeInterfaces();
  void setupStartupMission();
  bool loadMissionFromJson(const std::string & missionJson, const std::string & source);
  bool parseActivateRequest(const std::string & activateJson, bool * activate) const;
  void reportMissionReadiness(bool ready, const std::vector<std::string> & errors);
  std::string joinErrors(const std::vector<std::string> & errors) const;

  std::shared_ptr<rclcpp::Node> node_;
  std::shared_ptr<MissionBlackboard> blackboard_;

  std::unique_ptr<AdaptiveMissionExecutor> missionExecutor_;
  std::unique_ptr<VehicleInterface> vehicleInterface_;
  std::unique_ptr<tree::mission_root::manual_control_layer::ManualAltitudeAssist> manualAltitudeAssist_;
  std::unique_ptr<tree::mission_root::normal_mission_layer::MissionLifecycleManager> lifecycleManager_;
  std::unique_ptr<tree::mission_root::normal_mission_layer::BuiltinMissionProvider> builtinMissionProvider_;
  std::unique_ptr<MissionStatusPublisher> statusPublisher_;
  std::unique_ptr<BtMissionRunner> btMissionRunner_;
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr missionJsonSub_;
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr activateJsonSub_;

  std::string modeName_;
  std::string px4TopicNamespacePrefix_;
  std::optional<bool> lastReadyState_;
  std::vector<std::string> lastReadinessErrors_;
};

}  // namespace adaptive_mission_mode
