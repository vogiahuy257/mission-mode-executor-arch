/****************************************************************************
 * Adaptive Mission Mode - ROS node
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>
#include <string>

#include <px4_msgs/msg/vehicle_status.hpp>
#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/bool.hpp>
#include <std_msgs/msg/string.hpp>

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

class MissionNode
{
public:
  explicit MissionNode(std::shared_ptr<rclcpp::Node> node);

private:
  void bind();
  void load(const std::string & text);
  void act(bool value);
  void pause(bool value);
  void cont(bool value);
  void status(const px4_msgs::msg::VehicleStatus & msg);
  void tickAlt();
  void pubState();

  std::shared_ptr<rclcpp::Node> node_;
  MissionRuntime rt_;
  StateMachine sm_;
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr state_pub_;
  rclcpp::Subscription<px4_msgs::msg::VehicleStatus>::SharedPtr status_sub_;
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr mission_sub_;
  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr act_sub_;
  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr pause_sub_;
  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr cont_sub_;
  rclcpp::TimerBase::SharedPtr alt_timer_;
  rclcpp::TimerBase::SharedPtr state_timer_;
};

}  // namespace adaptive_mission_mode
