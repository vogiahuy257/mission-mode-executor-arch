/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <functional>
#include <memory>

#include "adaptive_mission_mode/behavior_tree/core/behavior_tree.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/manual_control_layer/manual_altitude_assist.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_lifecycle_manager.hpp"

namespace adaptive_mission_mode::tree::mission_root
{

class MissionRootLayer final
{
public:
  using DeltaTimeProvider = std::function<double()>;

  MissionRootLayer(
    normal_mission_layer::MissionLifecycleManager & lifecycleManager,
    manual_control_layer::ManualAltitudeAssist & manualAltitudeAssist,
    DeltaTimeProvider deltaTimeProvider);

  std::unique_ptr<bt::TreeNode> build() const;

private:
  normal_mission_layer::MissionLifecycleManager & lifecycleManager_;
  manual_control_layer::ManualAltitudeAssist & manualAltitudeAssist_;
  DeltaTimeProvider deltaTimeProvider_;
};

}  // namespace adaptive_mission_mode::tree::mission_root
