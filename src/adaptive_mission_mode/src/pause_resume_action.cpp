/****************************************************************************
 * Adaptive Mission Mode - onResume action
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/pause_resume_action.hpp"

#include <utility>

#include <px4_ros2/mission/mission_executor.hpp>

namespace adaptive_mission_mode
{

PauseResumeAction::PauseResumeAction(px4_ros2::ModeBase & mode, std::shared_ptr<PauseResume> pause)
: node_(mode.node()), pause_resume_(std::move(pause))
{
}

void PauseResumeAction::run(
  const std::shared_ptr<px4_ros2::ActionHandler> & handler,
  const px4_ros2::ActionArguments & args,
  const std::function<void()> & done)
{
  const std::string action = args.contains("action") ? args.at<std::string>("action") : std::string{};
  if (action != "resume") {
    return;
  }
  if (!pause_resume_ || !pause_resume_->returning() || !pause_resume_->hasPoint()) {
    done();
    return;
  }

  const Eigen::Vector3d point = pause_resume_->point();
  const auto resumeIndex = pause_resume_->index();

  px4_ros2::NavigationItem item{px4_ros2::Waypoint(point)};
  item.id = "__return_pause_point";
  std::vector<px4_ros2::MissionItem> items;
  items.emplace_back(item);

  RCLCPP_WARN(
    node_.get_logger(), "Return pause point lat=%.7f lon=%.7f alt=%.2f", point.x(), point.y(), point.z());

  handler->runTrajectory(
    std::make_shared<px4_ros2::Mission>(std::move(items), px4_ros2::MissionDefaults{}),
    [this, handler, resumeIndex, done]() {
      if (pause_resume_) {
        pause_resume_->done();
      }
      if (resumeIndex && handler->mission().indexValid(*resumeIndex)) {
        handler->setCurrentMissionIndex(*resumeIndex);
      }
      RCLCPP_WARN(node_.get_logger(), "Pause point reached, resume mission");
      done();
    },
    true);
}

}  // namespace adaptive_mission_mode
