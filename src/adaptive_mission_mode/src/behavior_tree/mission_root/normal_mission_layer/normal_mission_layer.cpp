/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/normal_mission_layer.hpp"

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/original_mission_executor_layer.hpp"

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
{

NormalMissionLayer::NormalMissionLayer(MissionLifecycleManager & lifecycleManager)
: lifecycleManager_(lifecycleManager)
{
}

std::unique_ptr<bt::TreeNode> NormalMissionLayer::build() const
{
  return std::make_unique<OriginalMissionExecutorLayer>(lifecycleManager_);
}

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
