/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <px4_ros2/mission/mission_executor.hpp>

namespace adaptive_mission_mode
{

class AdaptiveMissionExecutor : public px4_ros2::MissionExecutor
{
public:
  using MissionExecutor::MissionExecutor;

  px4_ros2::ModeExecutorBase & modeExecutorHandle() {return modeExecutor();}
  px4_ros2::ModeBase::ModeID modeIdHandle() const {return modeId();}
};

}  // namespace adaptive_mission_mode
