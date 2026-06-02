/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_items/action_items/hold_action_item_builder.hpp"

#include <px4_ros2/third_party/nlohmann/json.hpp>

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::action_items
{

HoldActionItemBuilder::HoldActionItemBuilder(std::shared_ptr<rclcpp::Node> node)
{
  itemId_ = node->declare_parameter<std::string>("mission.action_items.hold.id", "hold");
  durationS_ = static_cast<float>(
    node->declare_parameter<double>("mission.action_items.hold.duration_s", 5.0));
}

px4_ros2::ActionItem HoldActionItemBuilder::build() const
{
  nlohmann::json arguments = nlohmann::json::object();
  arguments["duration"] = durationS_;

  px4_ros2::ActionItem item{"hold", px4_ros2::ActionArguments(arguments)};
  item.id = itemId_;
  return item;
}

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::action_items
