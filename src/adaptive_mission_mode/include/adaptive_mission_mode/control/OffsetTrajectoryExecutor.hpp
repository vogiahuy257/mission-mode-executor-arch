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

class OffsetTrajectoryExecutor final : public px4_ros2::TrajectoryExecutorInterface
{
public:
  OffsetTrajectoryExecutor(
    px4_ros2::ModeBase & mode,
    std::function<float()> altitudeOffsetProvider,
    std::function<bool()> holdProvider);

  // Chỉ hỗ trợ waypoint navigation item.
  bool navigationItemTypeSupported(px4_ros2::NavigationItemType type) override;

  // Chỉ hỗ trợ mission frame global để phù hợp mission MAVLink tải từ FC.
  bool frameSupported(px4_ros2::MissionFrame frame) override;

  // Bắt đầu chạy đoạn trajectory do MissionExecutor giao xuống.
  void runTrajectory(const TrajectoryConfig & config) override;

  // Cập nhật setpoint global, có cộng altitude offset realtime.
  void updateSetpoint() override;

private:
  void advanceToNextItem();

  bool isNearTarget(const Eigen::Vector3d & target, float radiusM) const;

  rclcpp::Node & node_;

  std::function<float()> altitudeOffsetProvider_;

  std::function<bool()> holdProvider_;

  TrajectoryConfig trajectoryConfig_{};

  std::optional<int> activeIndex_{};

  std::shared_ptr<px4_ros2::OdometryGlobalPosition> globalPosition_{};

  std::shared_ptr<px4_ros2::MulticopterGotoGlobalSetpointType> globalGotoSetpoint_{};
};

}  // namespace adaptive_mission_mode
