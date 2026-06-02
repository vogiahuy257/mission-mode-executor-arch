/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/mission_root_layer.hpp"

#include <utility>

#include "adaptive_mission_mode/behavior_tree/mission_root/manual_control_layer/manual_control_layer.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/normal_mission_layer.hpp"

namespace adaptive_mission_mode::tree::mission_root
{

MissionRootLayer::MissionRootLayer(
  normal_mission_layer::MissionLifecycleManager & lifecycleManager,
  manual_control_layer::ManualAltitudeAssist & manualAltitudeAssist,
  DeltaTimeProvider deltaTimeProvider)
: lifecycleManager_(lifecycleManager),
  manualAltitudeAssist_(manualAltitudeAssist),
  deltaTimeProvider_(std::move(deltaTimeProvider))
{
}

std::unique_ptr<bt::TreeNode> MissionRootLayer::build() const
{
  auto root = std::make_unique<bt::ReactiveSequence>("MissionRootLayer");

  normal_mission_layer::NormalMissionLayer normalMissionLayer(lifecycleManager_);
  auto normalMissionTree = normalMissionLayer.build();

  manual_control_layer::ManualControlLayer manualControlLayer(
    manualAltitudeAssist_,
    deltaTimeProvider_);
  auto manualControlTree = manualControlLayer.build(std::move(normalMissionTree));

  root->addChild(std::move(manualControlTree));
  return root;
}

}  // namespace adaptive_mission_mode::tree::mission_root
