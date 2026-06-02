/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/core/bt_mission_runner.hpp"

#include <algorithm>
#include <chrono>
#include <utility>

#include "adaptive_mission_mode/behavior_tree/mission_root/mission_root_layer.hpp"

namespace adaptive_mission_mode
{

BtMissionRunner::BtMissionRunner(
  std::shared_ptr<rclcpp::Node> node,
  std::shared_ptr<MissionBlackboard> blackboard,
  tree::mission_root::normal_mission_layer::MissionLifecycleManager & lifecycleManager,
  tree::mission_root::manual_control_layer::ManualAltitudeAssist & manualAltitudeAssist)
: node_(std::move(node)),
  blackboard_(std::move(blackboard)),
  lifecycleManager_(lifecycleManager),
  manualAltitudeAssist_(manualAltitudeAssist)
{
  tickRateHz_ = node_->declare_parameter<double>("behavior_tree.tick_rate_hz", 20.0);
  tickRateHz_ = std::max(1.0, tickRateHz_);
  root_ = buildTree();
}

void BtMissionRunner::start()
{
  const auto period = std::chrono::duration<double>(1.0 / tickRateHz_);
  lastTickTime_ = node_->now();
  tickTimer_ = node_->create_wall_timer(
    std::chrono::duration_cast<std::chrono::nanoseconds>(period),
    [this]() {
      tick();
    });
}

void BtMissionRunner::stop()
{
  if (tickTimer_) {
    tickTimer_->cancel();
  }
}

std::unique_ptr<bt::TreeNode> BtMissionRunner::buildTree()
{
  tree::mission_root::MissionRootLayer missionRootLayer(
    lifecycleManager_,
    manualAltitudeAssist_,
    [this]() {
      return lastDtSec_;
    });

  return missionRootLayer.build();
}

void BtMissionRunner::tick()
{
  const auto now = node_->now();
  lastDtSec_ = std::max(0.0, (now - lastTickTime_).seconds());
  lastTickTime_ = now;

  if (!root_) {
    return;
  }

  const auto status = root_->tick();
  if (status == bt::NodeStatus::Failure) {
    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      2000,
      "Behavior tree root returned FAILURE");
  }
}

}  // namespace adaptive_mission_mode
