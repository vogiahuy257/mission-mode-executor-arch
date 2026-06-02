/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/core/mission_json.hpp"

#include <stdexcept>
#include <vector>

#include <px4_ros2/third_party/nlohmann/json.hpp>

namespace adaptive_mission_mode
{

namespace
{

struct ParsedTakeoffArguments
{
  std::optional<float> altitude_relative_m;
  std::optional<float> altitude_amsl;
};

ParsedTakeoffArguments parseTakeoffArguments(const px4_ros2::ActionArguments & arguments)
{
  ParsedTakeoffArguments result;

  if (arguments.contains("altitude_m")) {
    result.altitude_relative_m = arguments.at<float>("altitude_m");
  } else if (arguments.contains("relativeAltitudeM")) {
    result.altitude_relative_m = arguments.at<float>("relativeAltitudeM");
  }

  if (arguments.contains("altitude")) {
    result.altitude_amsl = arguments.at<float>("altitude");
  } else if (arguments.contains("altitudeAmsl")) {
    result.altitude_amsl = arguments.at<float>("altitudeAmsl");
  } else if (arguments.contains("altitude_amsl")) {
    result.altitude_amsl = arguments.at<float>("altitude_amsl");
  } else if (arguments.contains("z")) {
    result.altitude_amsl = arguments.at<float>("z");
  }

  if (result.altitude_relative_m.has_value() && result.altitude_amsl.has_value()) {
    throw std::runtime_error(
            "Takeoff action cannot declare both relative altitude ('altitude_m') and AMSL altitude "
            "('altitude', 'altitudeAmsl', or 'z') at the same time.");
  }

  return result;
}

}  // namespace

MissionJsonNormalizationResult normalizeMissionForExecution(const px4_ros2::Mission & mission)
{
  MissionJsonNormalizationResult result;

  std::vector<px4_ros2::MissionItem> normalizedItems;
  normalizedItems.reserve(mission.items().size());

  bool seenNonTakeoffItem = false;
  for (const auto & item : mission.items()) {
    const auto * actionItem = std::get_if<px4_ros2::ActionItem>(&item);
    const bool isTakeoffAction = actionItem && actionItem->name == "takeoff";

    if (!isTakeoffAction) {
      seenNonTakeoffItem = true;
      normalizedItems.push_back(item);
      continue;
    }

    if (seenNonTakeoffItem) {
      throw std::runtime_error(
              "Mission action 'takeoff' is only supported at the beginning of the mission. "
              "Use standard PX4 order like takeoff -> waypoint/hold/rtl.");
    }

    const auto parsedTakeoffArguments = parseTakeoffArguments(actionItem->arguments);
    const bool hasTakeoffAltitude =
      parsedTakeoffArguments.altitude_relative_m.has_value() ||
      parsedTakeoffArguments.altitude_amsl.has_value();
    if (hasTakeoffAltitude && (
        result.leading_takeoff_altitude_relative_m.has_value() ||
        result.leading_takeoff_altitude_amsl.has_value()))
    {
      throw std::runtime_error(
              "Mission takeoff altitude may only be specified once in the leading takeoff sequence.");
    }

    if (parsedTakeoffArguments.altitude_relative_m.has_value()) {
      result.leading_takeoff_altitude_relative_m = parsedTakeoffArguments.altitude_relative_m;
    }
    if (parsedTakeoffArguments.altitude_amsl.has_value()) {
      result.leading_takeoff_altitude_amsl = parsedTakeoffArguments.altitude_amsl;
    }

    ++result.leading_takeoff_items;
  }

  if (result.leading_takeoff_items > 0U && normalizedItems.empty()) {
    throw std::runtime_error(
            "Mission contains only takeoff actions. Add at least one mission item after takeoff, "
            "such as a waypoint, hold, or rtl.");
  }

  result.mission = px4_ros2::Mission(normalizedItems, mission.defaults());
  return result;
}

MissionJsonNormalizationResult parseStandardMissionJson(const std::string & missionJson)
{
  const auto mission = nlohmann::json::parse(missionJson).get<px4_ros2::Mission>();
  return normalizeMissionForExecution(mission);
}

}  // namespace adaptive_mission_mode
