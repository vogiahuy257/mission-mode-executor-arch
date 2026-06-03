/****************************************************************************
 * Adaptive Mission Mode - LandedWaitState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/landed_wait_state.hpp"

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

const char * LandedWaitState::name() const {return "landed_wait_continue";}

void LandedWaitState::cont()
{
  if (!rt_.loaded() || !rt_.ready()) {
    RCLCPP_WARN(rt_.node().get_logger(), "Continue ignored: mission is not ready");
    return;
  }
  if (!rt_.pause().cont(true)) {
    RCLCPP_WARN(rt_.node().get_logger(), "Continue ignored: no paused mission");
    return;
  }
  sm_.goResumeArm();
}

void LandedWaitState::stop()
{
  rt_.abort();
  sm_.goIdle();
}

}  // namespace adaptive_mission_mode
