#include "adaptive_mission_mode/runtime/AdaptiveMissionExecutor.hpp"

#include <memory>
#include <utility>

#include "adaptive_mission_mode/control/OffsetTrajectoryExecutor.hpp"

namespace adaptive_mission_mode
{
namespace
{
constexpr char kModeName[] = "Adaptive Mission Mode";

px4_ros2::MissionExecutor::Configuration buildExecutorConfig(
  std::function<float()> altitudeOffsetProvider,
  std::function<bool()> holdProvider)
{
  px4_ros2::MissionExecutor::Configuration config;

  config.default_actions = {
    "rtl",
    "land",
    "takeoff",
    "onFailure",
    "hold",
    "changeSettings"};

  config.trajectory_executor_factory =
    [
      altitudeOffsetProvider = std::move(altitudeOffsetProvider),
      holdProvider = std::move(holdProvider)](px4_ros2::ModeBase & mode)
    {
      return std::make_shared<OffsetTrajectoryExecutor>(
        mode,
        altitudeOffsetProvider,
        holdProvider);
    };

  return config;
}
}  // namespace

AdaptiveMissionExecutor::AdaptiveMissionExecutor(
  rclcpp::Node & node,
  std::function<float()> altitudeOffsetProvider,
  std::function<bool()> holdProvider)
: px4_ros2::MissionExecutor(
    kModeName,
    buildExecutorConfig(std::move(altitudeOffsetProvider), std::move(holdProvider)),
    node)
{
}

px4_ros2::ModeBase::ModeID AdaptiveMissionExecutor::id() const
{
  return modeId();
}

px4_ros2::ModeExecutorBase & AdaptiveMissionExecutor::base()
{
  return modeExecutor();
}

}  // namespace adaptive_mission_mode
