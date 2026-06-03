/****************************************************************************
 * Adaptive Mission Mode - ResumeArmState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class ResumeArmState final : public State
{
public:
  ResumeArmState(StateMachine & sm, MissionRuntime & rt) : State(sm, rt) {}
  const char * name() const override;
  void enter() override;
  void status() override;
  void readyArm(px4_ros2::Result result) override;
  void armTimeout() override;
  void modeTimeout() override;
  void active() override;

private:
  void chooseMode();
  int mode_try_{};
  static constexpr int kMaxModeTry = 8;
};

}  // namespace adaptive_mission_mode
