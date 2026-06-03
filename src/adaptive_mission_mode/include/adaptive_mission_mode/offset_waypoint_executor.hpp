/****************************************************************************
 * Adaptive Mission Mode - waypoint executor with altitude offset
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <functional>
#include <memory>
#include <optional>

#include <Eigen/Eigen>
#include <px4_ros2/components/mode.hpp>
#include <px4_ros2/control/setpoint_types/multicopter/goto.hpp>
#include <px4_ros2/mission/trajectory/trajectory_executor.hpp>
#include <px4_ros2/odometry/global_position.hpp>
#include <rclcpp/rclcpp.hpp>

namespace adaptive_mission_mode
{

class OffsetWaypointExecutor final : public px4_ros2::TrajectoryExecutorInterface
{
public:
  OffsetWaypointExecutor(
    px4_ros2::ModeBase & mode,
    std::function<float()> offset_getter);

  bool navigationItemTypeSupported(px4_ros2::NavigationItemType type) override;
  bool frameSupported(px4_ros2::MissionFrame frame) override;
  void runTrajectory(const TrajectoryConfig & config) override;
  void updateSetpoint() override;

private:
  void nextItem();
  bool reached(const Eigen::Vector3d & target_position_m, float acceptance_radius) const;

  static constexpr float kAcceptanceRadiusM = 2.0F;

  rclcpp::Node & node_;
  std::function<float()> offset_getter_;
  px4_ros2::TrajectoryExecutorInterface::TrajectoryConfig trajectory_{};
  std::optional<int> index_;
  std::shared_ptr<px4_ros2::OdometryGlobalPosition> global_pos_;
  std::shared_ptr<px4_ros2::MulticopterGotoGlobalSetpointType> setpoint_;
};

}  // namespace adaptive_mission_mode
