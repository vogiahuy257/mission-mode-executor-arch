/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/behavior_tree/mission_root/manual_control_layer/manual_altitude_assist.hpp"

#include <algorithm>
#include <cmath>

namespace adaptive_mission_mode::tree::mission_root::manual_control_layer
{

ManualAltitudeAssist::ManualAltitudeAssist(
  std::shared_ptr<rclcpp::Node> node,
  std::shared_ptr<MissionBlackboard> blackboard)
: node_(std::move(node)),
  blackboard_(std::move(blackboard))
{
  enabled_ = node_->declare_parameter<bool>("manual_altitude_assist.enabled", true);
  throttleNeutral_ = node_->declare_parameter<double>("manual_altitude_assist.throttle_neutral", 0.5);
  stickDeadzone_ = node_->declare_parameter<double>("manual_altitude_assist.stick_deadzone", 0.15);
  positiveThrottleOnly_ = node_->declare_parameter<bool>("manual_altitude_assist.positive_throttle_only", true);
  maxClimbRateMps_ = node_->declare_parameter<double>("manual_altitude_assist.max_climb_rate_m_s", 0.5);
  maxOffsetM_ = node_->declare_parameter<double>("manual_altitude_assist.max_offset_m", 3.0);

  ManualAltitudeAssistState state{};
  state.enabled = enabled_;
  blackboard_->setManualAltitudeAssistState(state);
}

void ManualAltitudeAssist::update(double dtSec)
{
  auto state = blackboard_->manualAltitudeAssistState();
  state.enabled = enabled_;

  if (!enabled_ || dtSec <= 0.0) {
    state.active = false;
    state.climbRateCommandMps = 0.0F;
    state.altitudeOffsetM = altitudeOffsetM_;
    blackboard_->setManualAltitudeAssistState(state);
    return;
  }

  const auto manual = blackboard_->manualControlState();
  if (!manual.valid) {
    state.active = false;
    state.climbRateCommandMps = 0.0F;
    state.altitudeOffsetM = altitudeOffsetM_;
    blackboard_->setManualAltitudeAssistState(state);
    return;
  }

  const float stickCommand = computeStickCommand(manual.throttle);
  const float climbRate = stickCommand * maxClimbRateMps_;
  altitudeOffsetM_ += climbRate * static_cast<float>(dtSec);
  altitudeOffsetM_ = clamp(altitudeOffsetM_, 0.0F, maxOffsetM_);

  state.active = std::abs(stickCommand) > 1.0e-4F;
  state.throttleInput = manual.throttle;
  state.climbRateCommandMps = climbRate;
  state.altitudeOffsetM = altitudeOffsetM_;
  blackboard_->setManualAltitudeAssistState(state);
}

void ManualAltitudeAssist::reset()
{
  altitudeOffsetM_ = 0.0F;
  ManualAltitudeAssistState state{};
  state.enabled = enabled_;
  blackboard_->setManualAltitudeAssistState(state);
}

float ManualAltitudeAssist::computeStickCommand(float throttle) const
{
  float command = throttle - throttleNeutral_;

  if (positiveThrottleOnly_) {
    command = std::max(0.0F, command);
  }

  if (std::abs(command) < stickDeadzone_) {
    return 0.0F;
  }

  const float sign = command >= 0.0F ? 1.0F : -1.0F;
  const float magnitude = (std::abs(command) - stickDeadzone_) / std::max(1.0e-3F, 1.0F - stickDeadzone_);
  return sign * clamp(magnitude, 0.0F, 1.0F);
}

float ManualAltitudeAssist::clamp(float value, float minValue, float maxValue) const
{
  return std::max(minValue, std::min(value, maxValue));
}

}  // namespace adaptive_mission_mode::tree::mission_root::manual_control_layer
