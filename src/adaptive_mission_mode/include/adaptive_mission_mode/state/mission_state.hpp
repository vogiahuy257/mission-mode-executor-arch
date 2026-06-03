/****************************************************************************
 * Adaptive Mission Mode - MissionState
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include "adaptive_mission_mode/state/state.hpp"

namespace adaptive_mission_mode
{

class MissionState final : public State
{
public:
  MissionState(StateMachine & sm, MissionRuntime & rt) : State(sm, rt) {}
  const char * name() const override;
  void pause() override;
  void stop() override;
  void inactive() override;
  void done() override;
};

}  // namespace adaptive_mission_mode
