#pragma once

#include <string>

#include "adaptive_mission_mode/mission/MissionModel.hpp"

namespace adaptive_mission_mode
{

// Chuyển JSON mission từ backend/fc_mission_reader về format px4_ros2::Mission dùng được.
PlanInfo parsePlan(const std::string & text, double referenceAltitudeMsl);

// Tạo khóa ổn định để tránh nạp lại cùng một mission nhiều lần.
std::string missionKey(const std::string & text);

}  // namespace adaptive_mission_mode
