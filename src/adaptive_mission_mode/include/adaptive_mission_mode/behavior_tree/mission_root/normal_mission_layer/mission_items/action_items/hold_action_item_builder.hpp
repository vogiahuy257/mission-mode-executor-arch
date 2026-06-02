/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>
#include <string>

#include <rclcpp/rclcpp.hpp>
#include <px4_ros2/mission/mission.hpp>

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::action_items
{

class HoldActionItemBuilder
{
public:
  explicit HoldActionItemBuilder(std::shared_ptr<rclcpp::Node> node);

  px4_ros2::ActionItem build() const;

private:
  std::string itemId_;
  float durationS_{5.0F};
};

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::action_items
