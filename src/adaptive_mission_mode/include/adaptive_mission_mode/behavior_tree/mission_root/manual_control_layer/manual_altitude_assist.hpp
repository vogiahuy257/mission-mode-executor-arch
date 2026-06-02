/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>

#include <rclcpp/rclcpp.hpp>

#include "adaptive_mission_mode/core/mission_blackboard.hpp"

namespace adaptive_mission_mode::tree::mission_root::manual_control_layer
{

class ManualAltitudeAssist
{
public:
  ManualAltitudeAssist(
    std::shared_ptr<rclcpp::Node> node,
    std::shared_ptr<MissionBlackboard> blackboard);

  void update(double dtSec);
  void reset();

private:
  float computeStickCommand(float throttle) const;
  float clamp(float value, float minValue, float maxValue) const;

  std::shared_ptr<rclcpp::Node> node_;
  std::shared_ptr<MissionBlackboard> blackboard_;

  bool enabled_{true};
  float throttleNeutral_{0.5F};
  float stickDeadzone_{0.15F};
  bool positiveThrottleOnly_{true};
  float maxClimbRateMps_{0.5F};
  float maxOffsetM_{3.0F};
  float altitudeOffsetM_{0.0F};
};

}  // namespace adaptive_mission_mode::tree::mission_root::manual_control_layer
