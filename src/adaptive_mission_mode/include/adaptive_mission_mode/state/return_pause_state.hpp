/****************************************************************************
 * Adaptive Mission Mode - ReturnPauseState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class ReturnPauseState final : public State
{
public:
  ReturnPauseState(StateMachine & sm, MissionRuntime & rt) : State(sm, rt) {}
  const char * name() const override;
  void stop() override;
  void active() override;
  void inactive() override;
};

}  // namespace adaptive_mission_mode
