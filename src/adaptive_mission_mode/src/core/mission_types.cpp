/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/core/mission_types.hpp"

namespace adaptive_mission_mode
{

const char * toString(MissionRuntimeState state)
{
  switch (state) {
    case MissionRuntimeState::Idle:
      return "IDLE";
    case MissionRuntimeState::Ready:
      return "READY";
    case MissionRuntimeState::Starting:
      return "STARTING";
    case MissionRuntimeState::Running:
      return "RUNNING";
    case MissionRuntimeState::Completed:
      return "COMPLETED";
    case MissionRuntimeState::Failed:
      return "FAILED";
  }

  return "UNKNOWN";
}

}  // namespace adaptive_mission_mode
