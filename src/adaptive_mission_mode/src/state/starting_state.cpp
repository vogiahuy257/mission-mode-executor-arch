/****************************************************************************
 * Adaptive Mission Mode - StartingState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/starting_state.hpp"

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

StartingState::StartingState(StateMachine & sm, MissionRuntime & rt, bool resume)
: State(sm, rt), resume_(resume)
{
}

const char * StartingState::name() const {return resume_ ? "resume_start" : "starting";}

void StartingState::enter()
{
  RCLCPP_INFO(rt_.node().get_logger(), resume_ ? "Resume start" : "Starting mission");
  if (rt_.armed()) {
    if (!resume_ && rt_.preTakeoff()) {
      sm_.goStartTakeoff();
      return;
    }
    chooseMode();
    return;
  }

  RCLCPP_INFO(rt_.node().get_logger(), "Sending arm command");
  rt_.arm();
  rt_.armTimer([machine = &sm_]() {machine->armTimeout();});
}

void StartingState::readyArm(px4_ros2::Result result)
{
  if (result != px4_ros2::Result::Success) {
    RCLCPP_ERROR(rt_.node().get_logger(), "waitReadyToArm failed: %d", static_cast<int>(result));
    sm_.goIdle();
    return;
  }
  RCLCPP_INFO(rt_.node().get_logger(), "Sending arm command");
  rt_.arm();
  rt_.armTimer([machine = &sm_]() {machine->armTimeout();});
}

void StartingState::status()
{
  if (rt_.waitingArm() && rt_.armed()) {
    rt_.waitingArm(false);
    rt_.stopTimers();
    RCLCPP_INFO(rt_.node().get_logger(), "Vehicle armed");
    if (!resume_ && rt_.preTakeoff()) {
      sm_.goStartTakeoff();
      return;
    }
    chooseMode();
  }
}

void StartingState::chooseMode()
{
  ++mode_try_;
  RCLCPP_INFO(rt_.node().get_logger(), "Selecting Adaptive Mission Mode, try %d", mode_try_);
  rt_.mode();
  rt_.modeTimer([machine = &sm_]() {machine->modeTimeout();});
}

void StartingState::armTimeout()
{
  rt_.waitingArm(false);
  RCLCPP_ERROR(rt_.node().get_logger(), "Arm timeout");
  sm_.goIdle();
}

void StartingState::modeTimeout()
{
  if (mode_try_ < kMaxModeTry) {
    RCLCPP_WARN(rt_.node().get_logger(), "Mode activation not active yet, retry");
    chooseMode();
    return;
  }
  RCLCPP_ERROR(rt_.node().get_logger(), "Mode activation timeout");
  sm_.goIdle();
}

void StartingState::active()
{
  sm_.goMission();
}

}  // namespace adaptive_mission_mode
