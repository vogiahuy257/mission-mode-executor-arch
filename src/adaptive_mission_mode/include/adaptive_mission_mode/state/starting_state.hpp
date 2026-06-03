/****************************************************************************
 * Adaptive Mission Mode - StartingState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class StartingState final : public State
{
public:
  StartingState(StateMachine & sm, MissionRuntime & rt, bool resume);
  const char * name() const override;
  void enter() override;
  void status() override;
  void readyArm(px4_ros2::Result result) override;
  void armTimeout() override;
  void modeTimeout() override;
  void active() override;

private:
  void chooseMode();
  bool resume_{};
  int mode_try_{};
  static constexpr int kMaxModeTry = 6;
};

}  // namespace adaptive_mission_mode
