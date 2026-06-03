/****************************************************************************
 * Adaptive Mission Mode - state machine
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <memory>
#include <string>
#include <vector>

#include <px4_ros2/components/mode_executor.hpp>
#include <rclcpp/rclcpp.hpp>

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class StateMachine
{
public:
  explicit StateMachine(MissionRuntime & rt);

  void start();
  void stop();
  void pause();
  void cont();
  void status();
  void ready(bool ok, const std::vector<std::string> & errors);
  void progress(int index);
  void active();
  void inactive();
  void done();
  void readyArm(px4_ros2::Result result);
  void armTimeout();
  void modeTimeout();
  void returnDone();

  std::string name() const;
  void goIdle();
  void goStart(bool resume);
  void goMission();
  void goPauseRtl();
  void goLanded();
  void goResumeArm();
  void goResumeTakeoff();
  void goStartTakeoff();
  void goReturn();

private:
  void set(std::unique_ptr<State> next);
  MissionRuntime & rt_;
  std::unique_ptr<State> state_;
};

}  // namespace adaptive_mission_mode
