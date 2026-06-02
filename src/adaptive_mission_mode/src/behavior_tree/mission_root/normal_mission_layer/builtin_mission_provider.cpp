/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/builtin_mission_provider.hpp"

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
{

BuiltinMissionProvider::BuiltinMissionProvider(std::shared_ptr<rclcpp::Node> node)
{
  missionType_ = node->declare_parameter<std::string>("mission.builtin_type", "takeoff_rtl");
  autoStart_ = node->declare_parameter<bool>("mission.auto_start", false);
  horizontalVelocityMps_ = node->declare_parameter<double>("mission.horizontal_velocity_m_s", 5.0);
  verticalVelocityMps_ = node->declare_parameter<double>("mission.vertical_velocity_m_s", 2.0);
  maxHeadingRateRadps_ = node->declare_parameter<double>("mission.max_heading_rate_rad_s", 1.0);
  holdActionItemBuilder_ =
    std::make_unique<mission_items::action_items::HoldActionItemBuilder>(node);
  rtlActionItemBuilder_ =
    std::make_unique<mission_items::action_items::RtlActionItemBuilder>(node);
  waypointMissionItemBuilder_ =
    std::make_unique<mission_items::waypoint_items::WaypointMissionItemBuilder>(node);
}

std::optional<px4_ros2::Mission> BuiltinMissionProvider::buildMission() const
{
  if (missionType_ == "none" || missionType_.empty()) {
    return std::nullopt;
  }

  if (missionType_ == "takeoff_hold_rtl") {
    return buildTakeoffHoldRtlMission();
  }

  if (missionType_ == "takeoff_waypoint_rtl") {
    return buildTakeoffWaypointRtlMission();
  }

  return buildTakeoffRtlMission();
}

px4_ros2::Mission BuiltinMissionProvider::buildTakeoffRtlMission() const
{
  std::vector<px4_ros2::MissionItem> items;
  items.emplace_back(rtlActionItemBuilder_->build());
  return px4_ros2::Mission(items, buildDefaults());
}

px4_ros2::Mission BuiltinMissionProvider::buildTakeoffHoldRtlMission() const
{
  std::vector<px4_ros2::MissionItem> items;
  items.emplace_back(holdActionItemBuilder_->build());
  items.emplace_back(rtlActionItemBuilder_->build());
  return px4_ros2::Mission(items, buildDefaults());
}

px4_ros2::Mission BuiltinMissionProvider::buildTakeoffWaypointRtlMission() const
{
  std::vector<px4_ros2::MissionItem> items;
  for (const auto & waypointItem : waypointMissionItemBuilder_->build()) {
    items.emplace_back(waypointItem);
  }

  items.emplace_back(rtlActionItemBuilder_->build());
  return px4_ros2::Mission(items, buildDefaults());
}

px4_ros2::MissionDefaults BuiltinMissionProvider::buildDefaults() const
{
  px4_ros2::MissionDefaults defaults{};
  defaults.trajectory_options.horizontal_velocity = static_cast<float>(horizontalVelocityMps_);
  defaults.trajectory_options.vertical_velocity = static_cast<float>(verticalVelocityMps_);
  defaults.trajectory_options.max_heading_rate = static_cast<float>(maxHeadingRateRadps_);
  return defaults;
}

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
