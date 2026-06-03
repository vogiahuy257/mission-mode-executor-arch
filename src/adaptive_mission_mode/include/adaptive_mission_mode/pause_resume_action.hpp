/****************************************************************************
 * Adaptive Mission Mode - onResume action
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>
#include <string>
#include <vector>

#include <px4_ros2/components/mode.hpp>
#include <px4_ros2/mission/actions/action.hpp>
#include <px4_ros2/mission/mission.hpp>
#include <rclcpp/rclcpp.hpp>

#include "adaptive_mission_mode/pause_resume.hpp"

namespace adaptive_mission_mode
{

class PauseResumeAction final : public px4_ros2::ActionInterface
{
public:
  PauseResumeAction(px4_ros2::ModeBase & mode, std::shared_ptr<PauseResume> pause);
  std::string name() const override {return "onResume";}
  void run(
    const std::shared_ptr<px4_ros2::ActionHandler> & handler,
    const px4_ros2::ActionArguments & args,
    const std::function<void()> & done) override;

private:
  rclcpp::Node & node_;
  std::shared_ptr<PauseResume> pause_resume_;
};

}  // namespace adaptive_mission_mode
