/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_items/waypoint_items/waypoint_mission_item_builder.hpp"

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::waypoint_items
{

WaypointMissionItemBuilder::WaypointMissionItemBuilder(std::shared_ptr<rclcpp::Node> node)
: node_(std::move(node))
{
  waypointId_ = node_->declare_parameter<std::string>("mission.waypoint.id", "waypoint");
  waypointCoordinate_.x() = node_->declare_parameter<double>(
    "mission.waypoint.latitude_deg",
    waypointCoordinate_.x());
  waypointCoordinate_.y() = node_->declare_parameter<double>(
    "mission.waypoint.longitude_deg",
    waypointCoordinate_.y());
  waypointCoordinate_.z() = node_->declare_parameter<double>(
    "mission.waypoint.altitude_m",
    waypointCoordinate_.z());
}

std::vector<px4_ros2::MissionItem> WaypointMissionItemBuilder::build() const
{
  return {buildNavigationItem()};
}

px4_ros2::NavigationItem WaypointMissionItemBuilder::buildNavigationItem() const
{
  px4_ros2::NavigationItem item{px4_ros2::Waypoint{waypointCoordinate_, px4_ros2::MissionFrame::Global}};
  item.id = waypointId_;
  return item;
}

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::waypoint_items
