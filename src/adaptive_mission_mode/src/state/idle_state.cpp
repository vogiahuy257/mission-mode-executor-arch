/****************************************************************************
 * Adaptive Mission Mode - IdleState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/idle_state.hpp"

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

const char * IdleState::name() const {return "idle";}

void IdleState::start()
{
  if (!rt_.loaded()) {
    RCLCPP_ERROR(rt_.node().get_logger(), "Cannot start: no mission JSON loaded");
    return;
  }
  if (!rt_.ready()) {
    RCLCPP_ERROR(rt_.node().get_logger(), "Cannot start: mission is not ready");
    return;
  }
  rt_.alt().reset();
  rt_.pause().reset();
  rt_.index(-1);
  sm_.goStart(false);
}

}  // namespace adaptive_mission_mode
