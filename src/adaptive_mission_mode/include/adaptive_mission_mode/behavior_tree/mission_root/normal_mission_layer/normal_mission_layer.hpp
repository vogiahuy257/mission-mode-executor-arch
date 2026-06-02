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

class NormalMissionLayer final
{
public:
  explicit NormalMissionLayer(MissionLifecycleManager & lifecycleManager);

  std::unique_ptr<bt::TreeNode> build() const;

private:
  MissionLifecycleManager & lifecycleManager_;
};

}  // namespace adaptive_mission_mode::tree::mission_root::normal_mission_layer
