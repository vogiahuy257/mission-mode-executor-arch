/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/core/mission_status_publisher.hpp"

#include <algorithm>
#include <chrono>

#include <px4_ros2/third_party/nlohmann/json.hpp>

namespace adaptive_mission_mode
{

MissionStatusPublisher::MissionStatusPublisher(
  std::shared_ptr<rclcpp::Node> node,
  std::shared_ptr<MissionBlackboard> blackboard)
: node_(std::move(node)),
  blackboard_(std::move(blackboard))
{
  publishRateHz_ = node_->declare_parameter<double>("status.publish_rate_hz", 5.0);
  publishRateHz_ = std::max(1.0, publishRateHz_);
  statusPub_ = node_->create_publisher<std_msgs::msg::String>("~/status", rclcpp::QoS(1).reliable());
}

void MissionStatusPublisher::start()
{
  const auto period = std::chrono::duration<double>(1.0 / publishRateHz_);
  timer_ = node_->create_wall_timer(
    std::chrono::duration_cast<std::chrono::nanoseconds>(period),
    [this]() {
      std_msgs::msg::String message{};
      message.data = buildStatusJson();
      statusPub_->publish(message);
    });
}

void MissionStatusPublisher::stop()
{
  if (timer_) {
    timer_->cancel();
  }
}

std::string MissionStatusPublisher::buildStatusJson() const
{
  const auto status = blackboard_->status();
  nlohmann::json json;
  json["runtime_state"] = toString(status.runtimeState);
  json["active_bt_branch"] = status.activeBtBranch;
  json["mission_ready"] = status.missionReady;
  json["mission_active"] = status.missionActive;
  json["mission_start_in_progress"] = status.missionStartInProgress;
  json["current_item_index"] = status.currentItemIndex;
  json["manual_altitude_active"] = status.manualAltitudeAssistState.active;
  json["altitude_offset_m"] = status.manualAltitudeAssistState.altitudeOffsetM;
  json["throttle_input"] = status.manualAltitudeAssistState.throttleInput;
  json["last_error"] = status.lastError;
  return json.dump();
}

}  // namespace adaptive_mission_mode
