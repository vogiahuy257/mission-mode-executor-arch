/****************************************************************************
 * Adaptive Mission Mode - ROS node
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/mission_node.hpp"

#include <stdexcept>
#include <utility>

#include <px4_ros2/utils/message_version.hpp>

using namespace std::chrono_literals;

namespace adaptive_mission_mode
{
namespace
{
constexpr char kMissionTopic[] = "~/mission_json";
constexpr char kActTopic[] = "~/activate";
constexpr char kPauseTopic[] = "~/pause_rtl";
constexpr char kContTopic[] = "~/continue_mission";
constexpr char kStateTopic[] = "~/state";
}

MissionNode::MissionNode(std::shared_ptr<rclcpp::Node> node)
: node_(std::move(node)), rt_(node_), sm_(rt_)
{
  RuntimeCb cb;
  cb.ready = [this](bool ok, const std::vector<std::string> & errors) {sm_.ready(ok, errors); pubState();};
  cb.active = [this]() {sm_.active(); pubState();};
  cb.inactive = [this]() {sm_.inactive(); pubState();};
  cb.progress = [this](int index) {sm_.progress(index); pubState();};
  cb.done = [this]() {sm_.done(); pubState();};
  rt_.pause().setDoneCb([this]() {sm_.returnDone(); pubState();});
  rt_.init(cb);
  bind();
  alt_timer_ = node_->create_wall_timer(50ms, [this]() {tickAlt();});
  state_timer_ = node_->create_wall_timer(200ms, [this]() {pubState();});
  RCLCPP_INFO(node_->get_logger(), "Ready. Load %s, start %s=true", kMissionTopic, kActTopic);
}

void MissionNode::bind()
{
  state_pub_ = node_->create_publisher<std_msgs::msg::String>(kStateTopic, rclcpp::QoS(1).reliable());
  status_sub_ = node_->create_subscription<px4_msgs::msg::VehicleStatus>(
    "fmu/out/vehicle_status" + px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleStatus>(),
    rclcpp::QoS(1).best_effort(), [this](const px4_msgs::msg::VehicleStatus::SharedPtr msg) {
      if (msg) {status(*msg);}
    });
  mission_sub_ = node_->create_subscription<std_msgs::msg::String>(
    kMissionTopic, rclcpp::QoS(1).reliable(), [this](const std_msgs::msg::String::SharedPtr msg) {
      if (msg) {load(msg->data);}
    });
  act_sub_ = node_->create_subscription<std_msgs::msg::Bool>(
    kActTopic, rclcpp::QoS(1).reliable(), [this](const std_msgs::msg::Bool::SharedPtr msg) {
      if (msg) {act(msg->data);}
    });
  pause_sub_ = node_->create_subscription<std_msgs::msg::Bool>(
    kPauseTopic, rclcpp::QoS(1).reliable(), [this](const std_msgs::msg::Bool::SharedPtr msg) {
      if (msg) {pause(msg->data);}
    });
  cont_sub_ = node_->create_subscription<std_msgs::msg::Bool>(
    kContTopic, rclcpp::QoS(1).reliable(), [this](const std_msgs::msg::Bool::SharedPtr msg) {
      if (msg) {cont(msg->data);}
    });
}

void MissionNode::load(const std::string & text)
{
  if (rt_.active()) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot load mission while active");
    return;
  }
  try {
    rt_.load(text);
    sm_.goIdle();
    pubState();
    RCLCPP_INFO(node_->get_logger(), "Mission JSON accepted");
  } catch (const std::exception & err) {
    rt_.loaded(false);
    rt_.ready(false);
    pubState();
    RCLCPP_ERROR(node_->get_logger(), "Mission JSON rejected: %s", err.what());
  }
}

void MissionNode::act(bool value)
{
  if (value) {
    sm_.start();
  } else {
    sm_.stop();
  }
  pubState();
}

void MissionNode::pause(bool value)
{
  if (value) {
    sm_.pause();
    pubState();
  }
}

void MissionNode::cont(bool value)
{
  if (value) {
    sm_.cont();
    pubState();
  }
}

void MissionNode::status(const px4_msgs::msg::VehicleStatus & msg)
{
  rt_.updateStatus(msg);
  if (rt_.takeDisarmEvent()) {
    RCLCPP_WARN(node_->get_logger(), "Vehicle disarmed, switching to Position mode");
    rt_.posctl();
  }
  sm_.status();
  pubState();
}

void MissionNode::tickAlt()
{
  rt_.tickAlt();
}

void MissionNode::pubState()
{
  if (!state_pub_) {
    return;
  }
  std_msgs::msg::String msg;
  msg.data = rt_.json(sm_.name()).dump();
  state_pub_->publish(msg);
}

}  // namespace adaptive_mission_mode
