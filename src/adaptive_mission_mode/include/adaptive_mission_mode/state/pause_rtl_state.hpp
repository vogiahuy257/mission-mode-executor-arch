/****************************************************************************
 * Adaptive Mission Mode - PauseRtlState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class PauseRtlState final : public State
{
public:
  PauseRtlState(StateMachine & sm, MissionRuntime & rt) : State(sm, rt) {}
  const char * name() const override;
  void status() override;
  void cont() override;
  void stop() override;
};

}  // namespace adaptive_mission_mode
