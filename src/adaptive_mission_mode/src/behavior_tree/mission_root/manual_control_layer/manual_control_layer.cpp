/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/manual_control_layer/manual_control_layer.hpp"

#include <utility>

namespace adaptive_mission_mode::tree::mission_root::manual_control_layer
{

ManualControlLayerNode::ManualControlLayerNode(
  ManualAltitudeAssist & manualAltitudeAssist,
  DeltaTimeProvider deltaTimeProvider,
  std::unique_ptr<bt::TreeNode> child)
: bt::TreeNode("ManualControlLayer"),
  manualAltitudeAssist_(manualAltitudeAssist),
  deltaTimeProvider_(std::move(deltaTimeProvider)),
  child_(std::move(child))
{
}

bt::NodeStatus ManualControlLayerNode::tick()
{
  manualAltitudeAssist_.update(deltaTimeProvider_());

  if (!child_) {
    return bt::NodeStatus::Success;
  }

  return child_->tick();
}

void ManualControlLayerNode::halt()
{
  if (child_) {
    child_->halt();
  }
}

ManualControlLayer::ManualControlLayer(
  ManualAltitudeAssist & manualAltitudeAssist,
  DeltaTimeProvider deltaTimeProvider)
: manualAltitudeAssist_(manualAltitudeAssist),
  deltaTimeProvider_(std::move(deltaTimeProvider))
{
}

std::unique_ptr<bt::TreeNode> ManualControlLayer::build(std::unique_ptr<bt::TreeNode> child) const
{
  return std::make_unique<ManualControlLayerNode>(
    manualAltitudeAssist_,
    deltaTimeProvider_,
    std::move(child));
}

}  // namespace adaptive_mission_mode::tree::mission_root::manual_control_layer
