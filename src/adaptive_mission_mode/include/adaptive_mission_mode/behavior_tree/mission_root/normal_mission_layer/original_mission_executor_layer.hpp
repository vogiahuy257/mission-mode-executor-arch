/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>

#include "adaptive_mission_mode/behavior_tree/core/behavior_tree.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_lifecycle_manager.hpp"

namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
{

class OriginalMissionExecutorLayer final : public bt::TreeNode
{
public:
  explicit OriginalMissionExecutorLayer(MissionLifecycleManager & lifecycleManager);

  bt::NodeStatus tick() override;

private:
  MissionLifecycleManager & lifecycleManager_;
};

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
