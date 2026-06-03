/****************************************************************************
 * Adaptive Mission Mode - PauseRtlState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/pause_rtl_state.hpp"

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

const char * PauseRtlState::name() const {return "pause_rtl";}

void PauseRtlState::status()
{
  if (rt_.pause().rtl() && !rt_.armed()) {
    rt_.pause().landed();
    RCLCPP_WARN(rt_.node().get_logger(), "RTL landed/disarmed, waiting continue");
    sm_.goLanded();
  }
}

void PauseRtlState::cont()
{
  if (!rt_.pause().cont(false)) {
    RCLCPP_WARN(rt_.node().get_logger(), "Continue ignored: no pause point");
    return;
  }
  RCLCPP_WARN(rt_.node().get_logger(), "Continue during RTL: return to pause point");
  sm_.goResumeArm();
}

void PauseRtlState::stop()
{
  rt_.abort();
  sm_.goIdle();
}

}  // namespace adaptive_mission_mode
