/****************************************************************************
 * Adaptive Mission Mode - IdleState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class IdleState final : public State
{
public:
  IdleState(StateMachine & sm, MissionRuntime & rt) : State(sm, rt) {}
  const char * name() const override;
  void start() override;
};

}  // namespace adaptive_mission_mode
