#pragma once

#include <optional>
#include <string>

#include <px4_ros2/third_party/nlohmann/json.hpp>

namespace adaptive_mission_mode
{

struct PlanInfo
{
  nlohmann::json json{nlohmann::json::object()};

  std::string hash{};

  int sourceItemCount{};
  int executableItemCount{};
  int skippedItemCount{};

  bool hasPreTakeoff{};

  std::optional<double> takeoffAltitudeMsl{};
};

}  // namespace adaptive_mission_mode
