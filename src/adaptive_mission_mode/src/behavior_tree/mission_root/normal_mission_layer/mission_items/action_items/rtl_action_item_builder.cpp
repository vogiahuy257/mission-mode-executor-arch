/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_items/action_items/rtl_action_item_builder.hpp"

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::action_items
{

RtlActionItemBuilder::RtlActionItemBuilder(std::shared_ptr<rclcpp::Node> node)
{
  itemId_ = node->declare_parameter<std::string>("mission.action_items.rtl.id", "rtl");
}

px4_ros2::ActionItem RtlActionItemBuilder::build() const
{
  px4_ros2::ActionItem item{"rtl"};
  item.id = itemId_;
  return item;
}

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer::mission_items::action_items
