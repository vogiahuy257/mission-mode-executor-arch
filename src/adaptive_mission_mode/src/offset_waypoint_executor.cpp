/****************************************************************************
 * Adaptive Mission Mode - waypoint executor with altitude offset
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/offset_waypoint_executor.hpp"

#include <utility>
#include <variant>

#include <px4_ros2/mission/mission.hpp>
#include <px4_ros2/utils/geodesic.hpp>

namespace adaptive_mission_mode
{

OffsetWaypointExecutor::OffsetWaypointExecutor(
  px4_ros2::ModeBase & mode,
  std::function<float()> offset_getter)
: node_(mode.node()),
  offset_getter_(std::move(offset_getter))
{
  setpoint_ = std::make_shared<px4_ros2::MulticopterGotoGlobalSetpointType>(mode);
  global_pos_ = std::make_shared<px4_ros2::OdometryGlobalPosition>(mode);
}

bool OffsetWaypointExecutor::navigationItemTypeSupported(px4_ros2::NavigationItemType type)
{
  return type == px4_ros2::NavigationItemType::Waypoint;
}

bool OffsetWaypointExecutor::frameSupported(px4_ros2::MissionFrame frame)
{
  return frame == px4_ros2::MissionFrame::Global;
}

void OffsetWaypointExecutor::runTrajectory(const TrajectoryConfig & config)
{
  trajectory_ = config;
  index_ = config.start_index;
}

void OffsetWaypointExecutor::updateSetpoint()
{
  if (!index_) {
    return;
  }

  const auto * nav = std::get_if<px4_ros2::NavigationItem>(
    &trajectory_.trajectory->items()[*index_]);
  if (!nav) {
    nextItem();
    return;
  }

  if (!global_pos_->positionValid()) {
    RCLCPP_ERROR(node_.get_logger(), "Global position is not valid, aborting mission trajectory");
    trajectory_.on_failure();
    return;
  }

  const auto & waypoint = std::get<px4_ros2::Waypoint>(nav->data);
  Eigen::Vector3d target = waypoint.coordinate;
  const bool is_return_point = nav->id == "__return_pause_point";
  if (!is_return_point) {
    target.z() += static_cast<double>(offset_getter_());
  }

  const Eigen::Vector3d current = global_pos_->position();
  std::optional<float> heading{};
  if (px4_ros2::horizontalDistanceToGlobalPosition(current, target) > 0.1F) {
    heading = px4_ros2::headingToGlobalPosition(current, target);
  }

  const auto & options = trajectory_.options;
  setpoint_->update(
    target,
    heading,
    options.horizontal_velocity,
    options.vertical_velocity,
    options.max_heading_rate);

  float acceptance = kAcceptanceRadiusM;
  if (*index_ == trajectory_.end_index && trajectory_.stop_at_last) {
    acceptance *= 0.5F;
  }

  if (reached(target, acceptance)) {
    nextItem();
  }
}

void OffsetWaypointExecutor::nextItem()
{
  const int reached_index = *index_;
  index_ = *index_ + 1;
  if (*index_ > trajectory_.end_index) {
    index_.reset();
  }
  trajectory_.on_index_reached(reached_index);
}

bool OffsetWaypointExecutor::reached(
  const Eigen::Vector3d & target_position_m,
  float acceptance_radius) const
{
  const float error_m = px4_ros2::distanceToGlobalPosition(
    global_pos_->position(),
    target_position_m);
  return error_m < acceptance_radius;
}

}  // namespace adaptive_mission_mode
