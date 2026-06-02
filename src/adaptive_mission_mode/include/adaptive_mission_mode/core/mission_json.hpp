/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/
#pragma once

#include <cstddef>
#include <optional>
#include <string>

#include <px4_ros2/mission/mission.hpp>

namespace adaptive_mission_mode
{

struct MissionJsonNormalizationResult
{
  px4_ros2::Mission mission;
  std::size_t leading_takeoff_items{0U};
  std::optional<float> leading_takeoff_altitude_relative_m;
  std::optional<float> leading_takeoff_altitude_amsl;
};

MissionJsonNormalizationResult normalizeMissionForExecution(const px4_ros2::Mission & mission);

MissionJsonNormalizationResult parseStandardMissionJson(const std::string & missionJson);

}  // namespace adaptive_mission_mode
