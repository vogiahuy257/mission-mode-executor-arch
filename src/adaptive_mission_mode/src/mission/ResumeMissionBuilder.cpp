#include "adaptive_mission_mode/mission/ResumeMissionBuilder.hpp"

#include <algorithm>
#include <stdexcept>

namespace adaptive_mission_mode
{
namespace
{
bool isNavigationItemWithAltitude(const nlohmann::json & item)
{
  return item.value("type", "") == "navigation" &&
    item.contains("z") &&
    item.at("z").is_number();
}

void applyAltitudeOffset(nlohmann::json & item, float altitudeOffsetM)
{
  if (altitudeOffsetM == 0.0F) {
    return;
  }

  if (isNavigationItemWithAltitude(item)) {
    item["z"] = item.at("z").get<double>() + static_cast<double>(altitudeOffsetM);
  }

  if (item.contains("altitude") && item.at("altitude").is_number()) {
    item["altitude"] = item.at("altitude").get<double>() + static_cast<double>(altitudeOffsetM);
  }
}
}  // namespace

ResumeMissionResult ResumeMissionBuilder::build(const ResumeMissionRequest & request)
{
  if (!request.currentPlan) {
    throw std::runtime_error("resume builder needs a valid mission plan");
  }

  const auto & planJson = request.currentPlan->json;

  if (!planJson.contains("mission") || !planJson.at("mission").contains("items")) {
    throw std::runtime_error("resume builder needs mission.items");
  }

  const auto & oldItems = planJson.at("mission").at("items");

  if (!oldItems.is_array()) {
    throw std::runtime_error("resume builder needs mission.items array");
  }

  const int itemCount = static_cast<int>(oldItems.size());
  const int resumeIndex = std::clamp(request.currentMissionIndex + 1, 0, itemCount);

  nlohmann::json resumeMission = planJson;
  nlohmann::json newItems = nlohmann::json::array();

  newItems.push_back({
    {"type", "navigation"},
    {"navigationType", "waypoint"},
    {"frame", "global"},
    {"id", "pause_rtl_resume_point"},
    {"x", request.pauseGlobalPosition.x()},
    {"y", request.pauseGlobalPosition.y()},
    {"z", request.pauseGlobalPosition.z()}});

  for (int index = resumeIndex; index < itemCount; ++index) {
    auto item = oldItems.at(index);
    applyAltitudeOffset(item, request.altitudeOffsetM);
    newItems.push_back(item);
  }

  resumeMission["mission"]["items"] = newItems;
  resumeMission["source_format"] = "adaptive_pause_rtl_resume";
  resumeMission["pre_takeoff"] = true;
  resumeMission["pre_takeoff_alt_msl"] = request.pauseGlobalPosition.z();
  resumeMission["executable_item_count"] = newItems.size();

  resumeMission["resume"] = {
    {"enabled", true},
    {"resume_index", resumeIndex},
    {"original_current_index", request.currentMissionIndex},
    {"saved_altitude_offset_m", request.altitudeOffsetM},
    {"return_point", {
      {"lat", request.pauseGlobalPosition.x()},
      {"lon", request.pauseGlobalPosition.y()},
      {"alt_msl", request.pauseGlobalPosition.z()}}}};

  ResumeMissionResult result;
  result.resumeMissionJson = resumeMission;
  result.resumeInfoJson = resumeMission.at("resume");
  result.resumeIndex = resumeIndex;

  return result;
}

}  // namespace adaptive_mission_mode
