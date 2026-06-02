/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/original_mission_executor_layer.hpp"

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
{

OriginalMissionExecutorLayer::OriginalMissionExecutorLayer(MissionLifecycleManager & lifecycleManager)
: bt::TreeNode("OriginalMissionExecutorLayer"),
  lifecycleManager_(lifecycleManager)
{
}

bt::NodeStatus OriginalMissionExecutorLayer::tick()
{
  const auto result = lifecycleManager_.tickOriginalMissionExecutor();

  if (result == MissionTickResult::Failure) {
    return bt::NodeStatus::Failure;
  }

  if (result == MissionTickResult::Success) {
    return bt::NodeStatus::Success;
  }

  return bt::NodeStatus::Running;
}

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
