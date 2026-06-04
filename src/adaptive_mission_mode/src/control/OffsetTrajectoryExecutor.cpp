#include "adaptive_mission_mode/control/OffsetTrajectoryExecutor.hpp"

#include <algorithm>
#include <cmath>
#include <utility>
#include <variant>

#include <px4_ros2/mission/mission.hpp>

namespace adaptive_mission_mode
{
namespace
{
constexpr double kEarthRadiusM = 6371000.0;
constexpr double kPi = 3.14159265358979323846;

double toRadians(double degree)
{
  return degree * kPi / 180.0;
}

float distance2dM(const Eigen::Vector3d & a, const Eigen::Vector3d & b)
{
  const double latA = toRadians(a.x());
  const double latB = toRadians(b.x());

  const double deltaLat = latB - latA;
  const double deltaLon = toRadians(b.y() - a.y());

  const double sinLat = std::sin(deltaLat * 0.5);
  const double sinLon = std::sin(deltaLon * 0.5);

  const double haversine =
    sinLat * sinLat +
    std::cos(latA) * std::cos(latB) * sinLon * sinLon;

  return static_cast<float>(
    2.0 * kEarthRadiusM *
    std::atan2(std::sqrt(haversine), std::sqrt(std::max(0.0, 1.0 - haversine))));
}

float distance3dM(const Eigen::Vector3d & a, const Eigen::Vector3d & b)
{
  const double deltaAltitude = b.z() - a.z();

  return static_cast<float>(
    std::hypot(static_cast<double>(distance2dM(a, b)), deltaAltitude));
}

float headingRad(const Eigen::Vector3d & from, const Eigen::Vector3d & to)
{
  const double latA = toRadians(from.x());
  const double latB = toRadians(to.x());
  const double deltaLon = toRadians(to.y() - from.y());

  const double y = std::sin(deltaLon) * std::cos(latB);
  const double x =
    std::cos(latA) * std::sin(latB) -
    std::sin(latA) * std::cos(latB) * std::cos(deltaLon);

  return static_cast<float>(std::atan2(y, x));
}
}  // namespace

OffsetTrajectoryExecutor::OffsetTrajectoryExecutor(
  px4_ros2::ModeBase & mode,
  std::function<float()> altitudeOffsetProvider,
  std::function<bool()> holdProvider)
: node_(mode.node()),
  altitudeOffsetProvider_(std::move(altitudeOffsetProvider)),
  holdProvider_(std::move(holdProvider))
{
  globalGotoSetpoint_ = std::make_shared<px4_ros2::MulticopterGotoGlobalSetpointType>(mode);
  globalPosition_ = std::make_shared<px4_ros2::OdometryGlobalPosition>(mode);
}

bool OffsetTrajectoryExecutor::navigationItemTypeSupported(px4_ros2::NavigationItemType type)
{
  return type == px4_ros2::NavigationItemType::Waypoint;
}

bool OffsetTrajectoryExecutor::frameSupported(px4_ros2::MissionFrame frame)
{
  return frame == px4_ros2::MissionFrame::Global;
}

void OffsetTrajectoryExecutor::runTrajectory(const TrajectoryConfig & config)
{
  trajectoryConfig_ = config;
  activeIndex_ = config.start_index;
}

void OffsetTrajectoryExecutor::updateSetpoint()
{
  if (!activeIndex_) {
    return;
  }

  if (holdProvider_ && holdProvider_()) {
    return;
  }

  const auto * navigationItem = std::get_if<px4_ros2::NavigationItem>(
    &trajectoryConfig_.trajectory->items()[*activeIndex_]);

  if (!navigationItem) {
    advanceToNextItem();
    return;
  }

  if (!globalPosition_->positionValid()) {
    RCLCPP_ERROR_THROTTLE(
      node_.get_logger(),
      *node_.get_clock(),
      1000,
      "No valid global position");

    trajectoryConfig_.on_failure();
    return;
  }

  Eigen::Vector3d target = std::get<px4_ros2::Waypoint>(navigationItem->data).coordinate;
  target.z() += static_cast<double>(altitudeOffsetProvider_());

  const Eigen::Vector3d current = globalPosition_->position();

  std::optional<float> yawRad{};
  if (distance2dM(current, target) > 0.1F) {
    yawRad = headingRad(current, target);
  }

  globalGotoSetpoint_->update(
    target,
    yawRad,
    trajectoryConfig_.options.horizontal_velocity,
    trajectoryConfig_.options.vertical_velocity,
    trajectoryConfig_.options.max_heading_rate);

  const bool finalItem = *activeIndex_ == trajectoryConfig_.end_index &&
    trajectoryConfig_.stop_at_last;

  const float acceptanceRadiusM = finalItem ? 1.0F : 2.0F;

  if (isNearTarget(target, acceptanceRadiusM)) {
    advanceToNextItem();
  }
}

void OffsetTrajectoryExecutor::advanceToNextItem()
{
  const int reachedIndex = *activeIndex_;

  activeIndex_ = reachedIndex + 1;

  if (*activeIndex_ > trajectoryConfig_.end_index) {
    activeIndex_.reset();
  }

  trajectoryConfig_.on_index_reached(reachedIndex);
}

bool OffsetTrajectoryExecutor::isNearTarget(const Eigen::Vector3d & target, float radiusM) const
{
  return globalPosition_->positionValid() &&
    distance3dM(globalPosition_->position(), target) < radiusM;
}

}  // namespace adaptive_mission_mode
