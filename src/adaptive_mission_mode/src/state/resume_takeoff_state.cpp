/****************************************************************************
 * Adaptive Mission Mode - ResumeTakeoffState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/resume_takeoff_state.hpp"

#include <cmath>

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

const char * ResumeTakeoffState::name() const {return "resume_takeoff";}

void ResumeTakeoffState::enter()
{
  if (!rt_.pause().hasPoint()) {
    RCLCPP_WARN(rt_.node().get_logger(), "Resume takeoff ignored: no pause point");
    sm_.goLanded();
    return;
  }
  const float alt = static_cast<float>(rt_.pause().point().z());
  RCLCPP_WARN(rt_.node().get_logger(), "Resume takeoff to pause altitude %.2f m MSL", alt);
  rt_.takeoff(alt);
}

void ResumeTakeoffState::status()
{
  if (!rt_.armed()) {
    RCLCPP_WARN(rt_.node().get_logger(), "Resume takeoff interrupted: disarmed");
    rt_.stopTimers();
    sm_.goLanded();
    return;
  }
  if (!rt_.pause().hasPoint() || mode_sent_) {
    return;
  }
  const double target = rt_.pause().point().z();
  const double alt = rt_.altMsl();
  if (std::isfinite(alt) && alt >= target - kAltTolM) {
    rt_.pause().markTakeoffDone();
    RCLCPP_WARN(rt_.node().get_logger(), "Resume takeoff done");
    chooseMode();
  }
}

void ResumeTakeoffState::chooseMode()
{
  mode_sent_ = true;
  ++mode_try_;
  RCLCPP_WARN(rt_.node().get_logger(), "Selecting Adaptive Mission Mode after resume takeoff, try %d", mode_try_);
  rt_.mode();
  rt_.modeTimer([machine = &sm_]() {machine->modeTimeout();});
}

void ResumeTakeoffState::active()
{
  rt_.stopTimers();
  sm_.goReturn();
}

void ResumeTakeoffState::modeTimeout()
{
  if (mode_try_ < kMaxModeTry) {
    RCLCPP_WARN(rt_.node().get_logger(), "Resume mode not active after takeoff, retry");
    chooseMode();
    return;
  }
  rt_.stopTimers();
  RCLCPP_ERROR(rt_.node().get_logger(), "Resume takeoff mode activation timeout");
  sm_.goLanded();
}

void ResumeTakeoffState::stop()
{
  rt_.abort();
  sm_.goIdle();
}

}  // namespace adaptive_mission_mode
