#pragma once

#include <Eigen/Eigen>

#include <px4_ros2/third_party/nlohmann/json.hpp>

#include "adaptive_mission_mode/mission/MissionModel.hpp"

namespace adaptive_mission_mode
{

struct ResumeMissionRequest
{
  const PlanInfo * currentPlan{};

  Eigen::Vector3d pauseGlobalPosition{};

  int currentMissionIndex{-1};

  float altitudeOffsetM{};
};

struct ResumeMissionResult
{
  nlohmann::json resumeMissionJson{nlohmann::json::object()};

  nlohmann::json resumeInfoJson{nlohmann::json::object()};

  int resumeIndex{};
};

class ResumeMissionBuilder
{
public:
  // Tạo mission mới gồm điểm quay lại pause point và các item còn lại.
  static ResumeMissionResult build(const ResumeMissionRequest & request);
};

}  // namespace adaptive_mission_mode
