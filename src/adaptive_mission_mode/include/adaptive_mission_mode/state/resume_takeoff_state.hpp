/****************************************************************************
 * Adaptive Mission Mode - ResumeTakeoffState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class ResumeTakeoffState final : public State
{
public:
  ResumeTakeoffState(StateMachine & sm, MissionRuntime & rt) : State(sm, rt) {}
  const char * name() const override;
  void enter() override;
  void status() override;
  void modeTimeout() override;
  void active() override;
  void stop() override;

private:
  void chooseMode();
  bool mode_sent_{};
  int mode_try_{};
  static constexpr int kMaxModeTry = 8;
  static constexpr double kAltTolM = 1.0;
};

}  // namespace adaptive_mission_mode
