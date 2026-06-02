/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>

#include <rclcpp/rclcpp.hpp>

#include "adaptive_mission_mode/behavior_tree/core/behavior_tree.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/manual_control_layer/manual_altitude_assist.hpp"
#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_lifecycle_manager.hpp"
#include "adaptive_mission_mode/core/mission_blackboard.hpp"

namespace adaptive_mission_mode
{

class BtMissionRunner
{
public:
  BtMissionRunner(
    std::shared_ptr<rclcpp::Node> node,
    std::shared_ptr<MissionBlackboard> blackboard,
    tree::mission_root::normal_mission_layer::MissionLifecycleManager & lifecycleManager,
    tree::mission_root::manual_control_layer::ManualAltitudeAssist & manualAltitudeAssist);

  void start();
  void stop();

private:
  std::unique_ptr<bt::TreeNode> buildTree();
  void tick();

  std::shared_ptr<rclcpp::Node> node_;
  std::shared_ptr<MissionBlackboard> blackboard_;
  tree::mission_root::normal_mission_layer::MissionLifecycleManager & lifecycleManager_;
  tree::mission_root::manual_control_layer::ManualAltitudeAssist & manualAltitudeAssist_;

  std::unique_ptr<bt::TreeNode> root_;
  rclcpp::TimerBase::SharedPtr tickTimer_;
  double tickRateHz_{20.0};
  double lastDtSec_{0.0};
  rclcpp::Time lastTickTime_;
};

}  // namespace adaptive_mission_mode
