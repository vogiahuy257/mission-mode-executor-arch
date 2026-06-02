/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <functional>
#include <memory>

#include "adaptive_mission_mode/behavior_tree/core/behavior_tree.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/manual_control_layer/manual_altitude_assist.hpp"

namespace adaptive_mission_mode::tree::mission_root::manual_control_layer
{

class ManualControlLayerNode final : public bt::TreeNode
{
public:
  using DeltaTimeProvider = std::function<double()>;

  ManualControlLayerNode(
    ManualAltitudeAssist & manualAltitudeAssist,
    DeltaTimeProvider deltaTimeProvider,
    std::unique_ptr<bt::TreeNode> child);

  bt::NodeStatus tick() override;
  void halt() override;

private:
  ManualAltitudeAssist & manualAltitudeAssist_;
  DeltaTimeProvider deltaTimeProvider_;
  std::unique_ptr<bt::TreeNode> child_;
};

class ManualControlLayer final
{
public:
  using DeltaTimeProvider = ManualControlLayerNode::DeltaTimeProvider;

  ManualControlLayer(
    ManualAltitudeAssist & manualAltitudeAssist,
    DeltaTimeProvider deltaTimeProvider);

  std::unique_ptr<bt::TreeNode> build(std::unique_ptr<bt::TreeNode> child) const;

private:
  ManualAltitudeAssist & manualAltitudeAssist_;
  DeltaTimeProvider deltaTimeProvider_;
};

}  // namespace adaptive_mission_mode::tree::mission_root::manual_control_layer
