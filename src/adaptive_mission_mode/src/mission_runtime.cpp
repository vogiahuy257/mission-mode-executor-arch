/****************************************************************************
 * Adaptive Mission Mode - runtime shared by states
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/mission_runtime.hpp"

#include <cmath>
#include <limits>
#include <stdexcept>
#include <utility>

#include <px4_ros2/utils/message_version.hpp>

#include "adaptive_mission_mode/offset_waypoint_executor.hpp"
#include "adaptive_mission_mode/pause_resume_action.hpp"

using namespace std::chrono_literals;

namespace adaptive_mission_mode
{
namespace
{
constexpr char kModeName[] = "Adaptive Mission Mode";

px4_ros2::MissionExecutor::Configuration makeConfig(
  std::function<float()> offset,
  std::shared_ptr<PauseResume> pause)
{
  px4_ros2::MissionExecutor::Configuration cfg;
  cfg.default_actions = {"rtl", "land", "takeoff", "onFailure", "hold", "changeSettings"};
  cfg.addCustomAction<PauseResumeAction>(pause);
  cfg.trajectory_executor_factory = [offset](px4_ros2::ModeBase & mode) {
      return std::make_shared<OffsetWaypointExecutor>(mode, offset);
    };
  return cfg;
}
}  // namespace

MissionExec::MissionExec(rclcpp::Node & node, std::function<float()> offset, std::shared_ptr<PauseResume> pause)
: px4_ros2::MissionExecutor(kModeName, makeConfig(std::move(offset), std::move(pause)), node)
{
}

MissionRuntime::MissionRuntime(std::shared_ptr<rclcpp::Node> node)
: node_(std::move(node)), pause_(std::make_shared<PauseResume>())
{
}

void MissionRuntime::init(const RuntimeCb & cb)
{
  mission_ = std::make_unique<MissionExec>(*node_, [this]() {return offset();}, pause_);
  manual_ = std::make_unique<px4_ros2::ManualControlInput>(mission_->exec().ownedMode(), true);
  global_ = std::make_unique<px4_ros2::OdometryGlobalPosition>(mission_->exec().ownedMode());
  bindMission(cb);
  if (!mission_->doRegister()) {
    throw std::runtime_error("Failed to register PX4 mission executor");
  }
  cmd_pub_ = node_->create_publisher<px4_msgs::msg::VehicleCommand>(
    "fmu/in/vehicle_command" + px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleCommand>(),
    rclcpp::QoS(1));
}

void MissionRuntime::bindMission(const RuntimeCb & cb)
{
  mission_->onReadynessUpdate([this, cb](bool value, const std::vector<std::string> & errors) {
      ready_ = value;
      if (cb.ready) {
        cb.ready(value, errors);
      }
    });

  mission_->onActivated([this, cb]() {
      stopTimers();
      wait_arm_ = false;
      active_ = true;
      if (cb.active) {
        cb.active();
      }
    });

  mission_->onDeactivated([this, cb]() {
      stopTimers();
      wait_arm_ = false;
      active_ = false;
      resetRun(pause_ && pause_->paused());
      if (cb.inactive) {
        cb.inactive();
      }
    });

  mission_->onProgressUpdate([this, cb](int value) {
      exec_index_ = value;
      index_ = value + index_offset_;
      if (cb.progress) {
        cb.progress(index_);
      }
    });

  mission_->onCompleted([this, cb]() {
      stopTimers();
      wait_arm_ = false;
      active_ = false;
      index_ = -1;
      exec_index_ = -1;
      alt_.reset();
      if (pause_) {
        pause_->reset();
      }
      if (cb.done) {
        cb.done();
      }
    });
}

bool MissionRuntime::load(const std::string & text)
{
  const auto json = nlohmann::json::parse(text);
  mission_json_ = json;
  exec_json_ = json;
  pre_takeoff_ = false;
  pre_takeoff_alt_msl_.reset();
  index_offset_ = 0;

  auto & items = exec_json_["mission"]["items"];
  if (items.is_array() && !items.empty() && items.front().value("type", "") == "takeoff") {
    pre_takeoff_ = true;
    const auto & tk = items.front();
    if (tk.contains("altitude") && tk.at("altitude").is_number()) {
      pre_takeoff_alt_msl_ = tk.at("altitude").get<double>();
    } else {
      for (const auto & it : items) {
        if (it.value("type", "") == "navigation" && it.value("frame", "") == "global" &&
          it.contains("z") && it.at("z").is_number())
        {
          pre_takeoff_alt_msl_ = it.at("z").get<double>();
          break;
        }
      }
    }
    items.erase(items.begin());
    index_offset_ = 1;
  }

  const px4_ros2::Mission mission(exec_json_);
  mission_hash_ = mission.checksum();
  mission_id_.clear();
  if (json.contains("id") && json.at("id").is_string()) {
    mission_id_ = json.at("id").get<std::string>();
  } else if (json.contains("name") && json.at("name").is_string()) {
    mission_id_ = json.at("name").get<std::string>();
  } else if (json.contains("mission") && json.at("mission").contains("id") &&
    json.at("mission").at("id").is_string())
  {
    mission_id_ = json.at("mission").at("id").get<std::string>();
  }
  mission_->setMission(mission);
  loaded_ = true;
  index_ = -1;
  exec_index_ = -1;
  alt_.reset();
  if (pause_) {
    pause_->reset();
  }
  return true;
}

void MissionRuntime::updateStatus(const px4_msgs::msg::VehicleStatus & msg)
{
  nav_ = msg.nav_state;
  arm_state_ = msg.arming_state;
  executor_id_ = msg.executor_in_charge;
  failsafe_ = msg.failsafe;
  const bool was_armed = armed_;
  armed_ = msg.arming_state == px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED;
  if (was_armed && !armed_) {
    disarm_event_ = true;
  }
}

void MissionRuntime::tickAlt()
{
  const bool ok = active_ && armed_ && (!pause_ || !pause_->paused()) && manual_ && manual_->isValid();
  const float throttle = ok ? manual_->throttle() : 0.0F;
  const float old = alt_.value();
  alt_.update(throttle, ok, std::chrono::steady_clock::now());
  const bool changed = alt_.active() || alt_.value() != old;
  const auto now = node_->now();
  const bool due = last_alt_log_.nanoseconds() == 0 || (now - last_alt_log_).seconds() > 1.0;
  if (changed && due) {
    last_alt_log_ = now;
    RCLCPP_INFO(node_->get_logger(), "Altitude offset %.2f m, rate %.2f m/s", alt_.value(), alt_.rate());
  }
}

void MissionRuntime::sendCmd(
  uint32_t cmd, float p1, float p2, float p3, float p4, float p5, float p6, float p7)
{
  px4_msgs::msg::VehicleCommand msg{};
  msg.timestamp = static_cast<uint64_t>(node_->get_clock()->now().nanoseconds() / 1000);
  msg.command = cmd;
  msg.param1 = p1;
  msg.param2 = p2;
  msg.param3 = p3;
  msg.param4 = p4;
  msg.param5 = p5;
  msg.param6 = p6;
  msg.param7 = p7;
  msg.target_system = 1;
  msg.target_component = 1;
  msg.source_system = 1;
  msg.source_component = 1;
  msg.from_external = true;
  cmd_pub_->publish(msg);
}

void MissionRuntime::arm()
{
  wait_arm_ = true;
  sendCmd(px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM, 1.0F);
}

void MissionRuntime::mode()
{
  sendCmd(
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE,
    static_cast<float>(mission_->modeIdValue()));
}

void MissionRuntime::rtl()
{
  sendCmd(
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE,
    static_cast<float>(px4_ros2::ModeBase::kModeIDRtl));
}

void MissionRuntime::posctl()
{
  constexpr float kPosctl = 2.0F;
  sendCmd(px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE, kPosctl);
}

void MissionRuntime::takeoff(float alt_msl)
{
  sendCmd(
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_TAKEOFF,
    nan(), nan(), nan(), nan(), nan(), nan(), alt_msl);
}

void MissionRuntime::abort()
{
  stopTimers();
  wait_arm_ = false;
  index_ = -1;
  exec_index_ = -1;
  alt_.reset();
  if (pause_) {
    pause_->reset();
  }
  if (mission_) {
    mission_->abort();
  }
}

void MissionRuntime::resetRun(bool keep_pause)
{
  if (keep_pause) {
    return;
  }
  index_ = -1;
  exec_index_ = -1;
  alt_.reset();
  if (pause_) {
    pause_->reset();
  }
}

void MissionRuntime::waitArmReady(const px4_ros2::ModeExecutorBase::CompletedCallback & cb)
{
  mission_->exec().waitReadyToArm(cb);
}

void MissionRuntime::armTimer(std::function<void()> cb)
{
  cancel(arm_timer_);
  arm_timer_ = node_->create_wall_timer(5s, [this, cb]() {
      cancel(arm_timer_);
      cb();
    });
}

void MissionRuntime::modeTimer(std::function<void()> cb)
{
  cancel(mode_timer_);
  mode_timer_ = node_->create_wall_timer(1s, [this, cb]() {
      cancel(mode_timer_);
      cb();
    });
}

void MissionRuntime::stopTimers()
{
  cancel(arm_timer_);
  cancel(mode_timer_);
}

float MissionRuntime::nan()
{
  return std::numeric_limits<float>::quiet_NaN();
}

void MissionRuntime::cancel(rclcpp::TimerBase::SharedPtr & timer)
{
  if (timer) {
    timer->cancel();
    timer.reset();
  }
}

bool MissionRuntime::takeDisarmEvent()
{
  const bool value = disarm_event_;
  disarm_event_ = false;
  return value;
}

double MissionRuntime::altMsl() const
{
  if (global_ && global_->positionValid()) {
    return global_->position().z();
  }
  return std::numeric_limits<double>::quiet_NaN();
}

nlohmann::json MissionRuntime::itemJson(int idx) const
{
  nlohmann::json out;
  out["index"] = idx;
  out["active"] = idx == index_;
  out["done"] = index_ >= 0 && idx < index_;

  if (!mission_json_.contains("mission") || !mission_json_.at("mission").contains("items")) {
    out["valid"] = false;
    return out;
  }

  const auto & items = mission_json_.at("mission").at("items");
  if (!items.is_array() || idx < 0 || idx >= static_cast<int>(items.size())) {
    out["valid"] = false;
    return out;
  }

  const auto & item = items.at(idx);
  const std::string type = item.value("type", "unknown");
  out["valid"] = true;
  out["type"] = type;
  out["id"] = item.value("id", "");

  if (type == "navigation") {
    out["navigation_type"] = item.value("navigationType", "");
    out["frame"] = item.value("frame", "");
    if (item.contains("x") && item.contains("y") && item.contains("z")) {
      const double z = item.at("z").get<double>();
      out["target"] = {
        {"x", item.at("x").get<double>()},
        {"y", item.at("y").get<double>()},
        {"z_msl", z},
        {"z_with_offset_msl", z + static_cast<double>(alt_.value())},
        {"altitude_offset_m", alt_.value()}
      };
    }
  } else {
    out["action"] = type;
  }

  return out;
}

nlohmann::json MissionRuntime::itemsJson() const
{
  nlohmann::json list = nlohmann::json::array();
  if (!mission_json_.contains("mission") || !mission_json_.at("mission").contains("items")) {
    return list;
  }
  const auto & items = mission_json_.at("mission").at("items");
  if (!items.is_array()) {
    return list;
  }
  for (int i = 0; i < static_cast<int>(items.size()); ++i) {
    list.push_back(itemJson(i));
  }
  return list;
}

nlohmann::json MissionRuntime::targetJson() const
{
  const auto cur = itemJson(index_);
  if (cur.contains("target")) {
    return cur.at("target");
  }
  return nullptr;
}

nlohmann::json MissionRuntime::json(const std::string & sm_state) const
{
  nlohmann::json out;
  out["state"] = sm_state;
  out["mission_loaded"] = loaded_;
  out["mission_ready"] = ready_;
  out["active"] = active_;
  out["armed"] = armed_;
  out["waiting_arm"] = wait_arm_;
  out["current_index"] = index_;
  out["exec_index"] = exec_index_;
  out["index_offset"] = index_offset_;
  out["pre_takeoff"] = pre_takeoff_;
  out["nav_state"] = nav_;
  out["arming_state"] = arm_state_;
  out["executor_in_charge"] = executor_id_;
  out["failsafe"] = failsafe_;
  out["altitude_offset_m"] = alt_.value();
  out["altitude_offset_active"] = alt_.active();
  out["altitude_offset_rate_m_s"] = alt_.rate();

  out["mission"]["id"] = mission_id_.empty() ? nlohmann::json(nullptr) : nlohmann::json(mission_id_);
  out["mission"]["hash"] = mission_hash_;
  out["mission"]["item_count"] = mission_json_.contains("mission") &&
    mission_json_.at("mission").contains("items") && mission_json_.at("mission").at("items").is_array() ?
    mission_json_.at("mission").at("items").size() : 0;
  out["mission"]["current_index"] = index_;
  out["mission"]["exec_index"] = exec_index_;
  out["mission"]["index_offset"] = index_offset_;
  out["mission"]["current_item"] = itemJson(index_);
  out["mission"]["target"] = targetJson();
  out["mission"]["items"] = itemsJson();

  out["vehicle"]["armed"] = armed_;
  out["vehicle"]["nav_state"] = nav_;
  out["vehicle"]["arming_state"] = arm_state_;
  out["vehicle"]["executor_in_charge"] = executor_id_;
  out["vehicle"]["failsafe"] = failsafe_;
  if (global_ && global_->positionValid()) {
    const auto pos = global_->position();
    out["vehicle"]["global_position_valid"] = true;
    out["vehicle"]["lat"] = pos.x();
    out["vehicle"]["lon"] = pos.y();
    out["vehicle"]["alt_msl"] = pos.z();
  } else {
    out["vehicle"]["global_position_valid"] = false;
  }

  out["altitude"]["offset_m"] = alt_.value();
  out["altitude"]["offset_active"] = alt_.active();
  out["altitude"]["offset_rate_m_s"] = alt_.rate();
  const auto target = targetJson();
  out["altitude"]["target_msl"] = target.is_object() && target.contains("z_with_offset_msl") ?
    target.at("z_with_offset_msl") : nlohmann::json(nullptr);

  out["pause"]["phase"] = pause_ ? pause_->phaseName() : "none";
  out["pause"]["paused"] = pause_ && pause_->paused();
  out["pause"]["has_pause_point"] = pause_ && pause_->hasPoint();
  if (pause_ && pause_->hasPoint()) {
    const auto point = pause_->point();
    out["pause"]["point"] = {{"lat", point.x()}, {"lon", point.y()}, {"alt_msl", point.z()}};
  }
  const auto resume_index = pause_ ? pause_->index() : std::optional<int>{};
  out["pause"]["resume_exec_index"] = resume_index ? nlohmann::json(*resume_index) : nlohmann::json(nullptr);
  out["pause"]["resume_index"] = resume_index ? nlohmann::json(*resume_index + index_offset_) : nlohmann::json(nullptr);
  out["pause"]["need_takeoff"] = pause_ && pause_->needTakeoff();
  out["pre_takeoff"] = pre_takeoff_;
  out["pre_takeoff_alt_msl"] = pre_takeoff_ ? nlohmann::json(preTakeoffAltMsl()) : nlohmann::json(nullptr);
  return out;
}

double MissionRuntime::preTakeoffAltMsl() const
{
  if (pre_takeoff_alt_msl_) {
    return *pre_takeoff_alt_msl_;
  }
  const double alt = altMsl();
  if (std::isfinite(alt)) {
    return alt + 5.0;
  }
  return std::numeric_limits<double>::quiet_NaN();
}


}  // namespace adaptive_mission_mode
