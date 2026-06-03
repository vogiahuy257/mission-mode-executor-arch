/****************************************************************************
 * Adaptive Mission Mode - ResumeArmState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/resume_arm_state.hpp"

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

const char * ResumeArmState::name() const {return "resume_arm";}

void ResumeArmState::enter()
{
  if (rt_.armed()) {
    if (rt_.pause().needTakeoff()) {
      sm_.goResumeTakeoff();
      return;
    }
    chooseMode();
    return;
  }

  RCLCPP_INFO(rt_.node().get_logger(), "Resume: sending arm command");
  rt_.arm();
  rt_.armTimer([machine = &sm_]() {machine->armTimeout();});
}

void ResumeArmState::readyArm(px4_ros2::Result result)
{
  if (result != px4_ros2::Result::Success) {
    RCLCPP_ERROR(rt_.node().get_logger(), "resume waitReadyToArm failed: %d", static_cast<int>(result));
    sm_.goLanded();
    return;
  }
  RCLCPP_INFO(rt_.node().get_logger(), "Resume: sending arm command");
  rt_.arm();
  rt_.armTimer([machine = &sm_]() {machine->armTimeout();});
}

void ResumeArmState::status()
{
  if (rt_.waitingArm() && rt_.armed()) {
    rt_.waitingArm(false);
    rt_.stopTimers();
    RCLCPP_INFO(rt_.node().get_logger(), "Resume: vehicle armed");
    if (rt_.pause().needTakeoff()) {
      sm_.goResumeTakeoff();
      return;
    }
    chooseMode();
  }
}

void ResumeArmState::armTimeout()
{
  rt_.waitingArm(false);
  RCLCPP_ERROR(rt_.node().get_logger(), "Resume arm timeout");
  sm_.goLanded();
}

void ResumeArmState::chooseMode()
{
  ++mode_try_;
  RCLCPP_INFO(rt_.node().get_logger(), "Resume: selecting Adaptive Mission Mode, try %d", mode_try_);
  rt_.mode();
  rt_.modeTimer([machine = &sm_]() {machine->modeTimeout();});
}

void ResumeArmState::modeTimeout()
{
  if (mode_try_ < kMaxModeTry) {
    RCLCPP_WARN(rt_.node().get_logger(), "Resume mode not active yet, retry");
    chooseMode();
    return;
  }
  RCLCPP_ERROR(rt_.node().get_logger(), "Resume mode timeout");
  sm_.goLanded();
}

void ResumeArmState::active()
{
  rt_.stopTimers();
  sm_.goReturn();
}

}  // namespace adaptive_mission_mode
