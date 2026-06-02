/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>
#include <optional>
#include <string>

#include <rclcpp/rclcpp.hpp>
#include <px4_ros2/mission/mission.hpp>

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_items/action_items/hold_action_item_builder.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_items/action_items/rtl_action_item_builder.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_items/waypoint_items/waypoint_mission_item_builder.hpp"

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
{

class BuiltinMissionProvider
{
public:
  explicit BuiltinMissionProvider(std::shared_ptr<rclcpp::Node> node);

  std::optional<px4_ros2::Mission> buildMission() const;
  bool autoStart() const {return autoStart_;}
  std::string missionType() const {return missionType_;}

private:
  px4_ros2::Mission buildTakeoffRtlMission() const;
  px4_ros2::Mission buildTakeoffHoldRtlMission() const;
  px4_ros2::Mission buildTakeoffWaypointRtlMission() const;
  px4_ros2::MissionDefaults buildDefaults() const;

  std::string missionType_{"takeoff_rtl"};
  bool autoStart_{false};
  double horizontalVelocityMps_{5.0};
  double verticalVelocityMps_{2.0};
  double maxHeadingRateRadps_{1.0};
  std::unique_ptr<mission_items::action_items::HoldActionItemBuilder> holdActionItemBuilder_;
  std::unique_ptr<mission_items::action_items::RtlActionItemBuilder> rtlActionItemBuilder_;
  std::unique_ptr<mission_items::waypoint_items::WaypointMissionItemBuilder> waypointMissionItemBuilder_;
};

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
