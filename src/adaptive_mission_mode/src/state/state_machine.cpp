/****************************************************************************
 * Adaptive Mission Mode - state machine
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/state_machine.hpp"

#include "adaptive_mission_mode/state/idle_state.hpp"
#include "adaptive_mission_mode/state/landed_wait_state.hpp"
#include "adaptive_mission_mode/state/mission_state.hpp"
#include "adaptive_mission_mode/state/pause_rtl_state.hpp"
#include "adaptive_mission_mode/state/resume_arm_state.hpp"
#include "adaptive_mission_mode/state/resume_takeoff_state.hpp"
#include "adaptive_mission_mode/state/return_pause_state.hpp"
#include "adaptive_mission_mode/state/starting_state.hpp"
#include "adaptive_mission_mode/state/start_takeoff_state.hpp"

namespace adaptive_mission_mode
{

StateMachine::StateMachine(MissionRuntime & rt) : rt_(rt)
{
  set(std::make_unique<IdleState>(*this, rt_));
}

void StateMachine::start() {state_->start();}
void StateMachine::stop() {state_->stop();}
void StateMachine::pause() {state_->pause();}
void StateMachine::cont() {state_->cont();}
void StateMachine::status() {state_->status();}
void StateMachine::active() {state_->active();}
void StateMachine::inactive() {state_->inactive();}
void StateMachine::done() {RCLCPP_INFO(rt_.node().get_logger(), "Mission completed"); goIdle();}
void StateMachine::readyArm(px4_ros2::Result result) {state_->readyArm(result);}
void StateMachine::armTimeout() {state_->armTimeout();}
void StateMachine::modeTimeout() {state_->modeTimeout();}

void StateMachine::ready(bool ok, const std::vector<std::string> & errors)
{
  if (ok) {
    RCLCPP_INFO(rt_.node().get_logger(), "Mission is ready");
    return;
  }
  for (const auto & err : errors) {
    RCLCPP_WARN(rt_.node().get_logger(), "Mission not ready: %s", err.c_str());
  }
}

void StateMachine::progress(int index)
{
  RCLCPP_INFO(rt_.node().get_logger(), "Current mission index: %d", index);
}

void StateMachine::returnDone()
{
  goMission();
}

std::string StateMachine::name() const
{
  return state_ ? state_->name() : "none";
}

void StateMachine::goIdle() {set(std::make_unique<IdleState>(*this, rt_));}
void StateMachine::goStart(bool resume) {set(std::make_unique<StartingState>(*this, rt_, resume));}
void StateMachine::goMission() {set(std::make_unique<MissionState>(*this, rt_));}
void StateMachine::goPauseRtl() {set(std::make_unique<PauseRtlState>(*this, rt_));}
void StateMachine::goLanded() {set(std::make_unique<LandedWaitState>(*this, rt_));}
void StateMachine::goResumeArm() {set(std::make_unique<ResumeArmState>(*this, rt_));}
void StateMachine::goResumeTakeoff() {set(std::make_unique<ResumeTakeoffState>(*this, rt_));}
void StateMachine::goStartTakeoff() {set(std::make_unique<StartTakeoffState>(*this, rt_));}
void StateMachine::goReturn() {set(std::make_unique<ReturnPauseState>(*this, rt_));}

void StateMachine::set(std::unique_ptr<State> next)
{
  if (state_) {
    state_->exit();
  }
  state_ = std::move(next);
  RCLCPP_INFO(rt_.node().get_logger(), "State -> %s", state_->name());
  state_->enter();
}

}  // namespace adaptive_mission_mode
