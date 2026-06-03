/****************************************************************************
 * Adaptive Mission Mode - ReturnPauseState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/return_pause_state.hpp"

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

const char * ReturnPauseState::name() const {return "return_pause_point";}

void ReturnPauseState::active()
{
  RCLCPP_INFO(rt_.node().get_logger(), "Return to pause point is handled by onResume action");
}

void ReturnPauseState::inactive()
{
  if (!rt_.pause().returning()) {
    sm_.goMission();
    return;
  }
  RCLCPP_WARN(rt_.node().get_logger(), "Return pause point interrupted");
}

void ReturnPauseState::stop()
{
  rt_.abort();
  sm_.goIdle();
}

}  // namespace adaptive_mission_mode
