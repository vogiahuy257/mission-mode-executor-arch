/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>
#include <string>

#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/string.hpp>

#include "adaptive_mission_mode/core/mission_blackboard.hpp"

namespace adaptive_mission_mode
{

class MissionStatusPublisher
{
public:
  MissionStatusPublisher(
    std::shared_ptr<rclcpp::Node> node,
    std::shared_ptr<MissionBlackboard> blackboard);

  void start();
  void stop();

private:
  std::string buildStatusJson() const;

  std::shared_ptr<rclcpp::Node> node_;
  std::shared_ptr<MissionBlackboard> blackboard_;
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr statusPub_;
  rclcpp::TimerBase::SharedPtr timer_;
  double publishRateHz_{5.0};
};

}  // namespace adaptive_mission_mode
