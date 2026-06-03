/****************************************************
 * Adaptive Mission Mode - StartTakeoffState
 ****************************************************/

#include "adaptive_mission_mode/state/start_takeoff_state.hpp"

#include <cmath>

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

const char * StartTakeoffState::name() const {return "start_takeoff";}

void StartTakeoffState::enter()
{
  const double alt = rt_.preTakeoffAltMsl();
  if (!std::isfinite(alt)) {
    RCLCPP_ERROR(rt_.node().get_logger(), "Start takeoff failed: invalid target altitude");
    sm_.goIdle();
    return;
  }

  const double cur = rt_.altMsl();
  if (std::isfinite(cur) && cur >= alt - kAltTolM) {
    RCLCPP_INFO(rt_.node().get_logger(), "Already above takeoff altitude");
    chooseMode();
    return;
  }

  RCLCPP_WARN(rt_.node().get_logger(), "Start takeoff to %.2f m MSL", alt);
  rt_.takeoff(static_cast<float>(alt));
}

void StartTakeoffState::status()
{
  if (!rt_.armed()) {
    RCLCPP_WARN(rt_.node().get_logger(), "Start takeoff interrupted: disarmed");
    rt_.stopTimers();
    sm_.goIdle();
    return;
  }

  if (mode_sent_) {
    return;
  }

  const double target = rt_.preTakeoffAltMsl();
  const double alt = rt_.altMsl();
  if (std::isfinite(target) && std::isfinite(alt) && alt >= target - kAltTolM) {
    RCLCPP_WARN(rt_.node().get_logger(), "Start takeoff done");
    chooseMode();
  }
}

void StartTakeoffState::chooseMode()
{
  mode_sent_ = true;
  ++mode_try_;
  RCLCPP_WARN(rt_.node().get_logger(), "Selecting Adaptive Mission Mode after takeoff, try %d", mode_try_);
  rt_.mode();
  rt_.modeTimer([machine = &sm_]() {machine->modeTimeout();});
}

void StartTakeoffState::modeTimeout()
{
  if (mode_try_ < kMaxModeTry) {
    RCLCPP_WARN(rt_.node().get_logger(), "Mission mode not active after takeoff, retry");
    chooseMode();
    return;
  }
  rt_.stopTimers();
  RCLCPP_ERROR(rt_.node().get_logger(), "Start takeoff mode activation timeout");
  sm_.goIdle();
}

void StartTakeoffState::active()
{
  rt_.stopTimers();
  sm_.goMission();
}

void StartTakeoffState::stop()
{
  rt_.abort();
  sm_.goIdle();
}

}  // namespace adaptive_mission_mode
