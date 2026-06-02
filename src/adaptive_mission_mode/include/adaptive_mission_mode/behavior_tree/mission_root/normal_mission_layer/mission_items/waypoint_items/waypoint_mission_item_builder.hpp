/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>
#include <vector>

#include <Eigen/Eigen>
#include <rclcpp/rclcpp.hpp>
#include <px4_ros2/mission/mission.hpp>

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::waypoint_items
{

class WaypointMissionItemBuilder
{
public:
  explicit WaypointMissionItemBuilder(std::shared_ptr<rclcpp::Node> node);

  std::vector<px4_ros2::MissionItem> build() const;

private:
  px4_ros2::NavigationItem buildNavigationItem() const;

  std::shared_ptr<rclcpp::Node> node_;
  std::string waypointId_;
  Eigen::Vector3d waypointCoordinate_{47.3977419, 8.5455939, 10.0};
};

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::waypoint_items
