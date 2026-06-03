/****************************************************************************
 * Adaptive Mission Mode - LandedWaitState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class LandedWaitState final : public State
{
public:
  LandedWaitState(StateMachine & sm, MissionRuntime & rt) : State(sm, rt) {}
  const char * name() const override;
  void cont() override;
  void stop() override;
};

}  // namespace adaptive_mission_mode
