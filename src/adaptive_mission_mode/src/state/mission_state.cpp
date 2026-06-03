/****************************************************************************
 * Adaptive Mission Mode - MissionState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/state/mission_state.hpp"

#include "adaptive_mission_mode/mission_runtime.hpp"
#include "adaptive_mission_mode/state/state_machine.hpp"

namespace adaptive_mission_mode
{

const char * MissionState::name() const {return "mission";}

void MissionState::pause()
{
  auto * gps = rt_.global();
  if (!rt_.active() || !rt_.armed()) {
    RCLCPP_WARN(rt_.node().get_logger(), "Pause RTL ignored: mission is not active and armed");
    return;
  }
  if (!gps || !gps->positionValid()) {
    RCLCPP_WARN(rt_.node().get_logger(), "Pause RTL ignored: global position is invalid");
    return;
  }
  if (!rt_.pause().pauseRtl(gps->position(), rt_.execIndex())) {
    RCLCPP_WARN(rt_.node().get_logger(), "Pause RTL ignored: already paused");
    return;
  }
  RCLCPP_WARN(rt_.node().get_logger(), "Pause RTL: save point, return home, land");
  rt_.rtl();
  sm_.goPauseRtl();
}

void MissionState::stop()
{
  rt_.abort();
  sm_.goIdle();
}

void MissionState::inactive()
{
  if (!rt_.pause().paused()) {
    sm_.goIdle();
  }
}

void MissionState::done()
{
  sm_.goIdle();
}

}  // namespace adaptive_mission_mode
