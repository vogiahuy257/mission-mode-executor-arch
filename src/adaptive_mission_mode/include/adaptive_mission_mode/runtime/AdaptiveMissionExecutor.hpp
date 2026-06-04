#pragma once

#include <functional>

#include <px4_ros2/mission/mission_executor.hpp>

namespace adaptive_mission_mode
{

class AdaptiveMissionExecutor final : public px4_ros2::MissionExecutor
{
public:
  AdaptiveMissionExecutor(
    rclcpp::Node & node,
    std::function<float()> altitudeOffsetProvider,
    std::function<bool()> holdProvider);

  px4_ros2::ModeBase::ModeID id() const;

  px4_ros2::ModeExecutorBase & base();
};

}  // namespace adaptive_mission_mode
