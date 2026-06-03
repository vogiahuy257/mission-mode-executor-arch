/****************************************************************************
 * Adaptive Mission Mode - runtime shared by states
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <chrono>
#include <functional>
#include <memory>
#include <optional>
#include <string>
#include <vector>

#include <px4_msgs/msg/vehicle_command.hpp>
#include <px4_msgs/msg/vehicle_status.hpp>
#include <px4_ros2/components/manual_control_input.hpp>
#include <px4_ros2/components/mode_executor.hpp>
#include <px4_ros2/mission/mission_executor.hpp>
#include <px4_ros2/odometry/global_position.hpp>
#include <px4_ros2/third_party/nlohmann/json.hpp>
#include <rclcpp/rclcpp.hpp>

#include "adaptive_mission_mode/altitude_offset.hpp"
#include "adaptive_mission_mode/pause_resume.hpp"

namespace adaptive_mission_mode
{

struct RuntimeCb
{
  std::function<void(bool, const std::vector<std::string> &)> ready;
  std::function<void()> active;
  std::function<void()> inactive;
  std::function<void(int)> progress;
  std::function<void()> done;
};

class MissionExec final : public px4_ros2::MissionExecutor
{
public:
  MissionExec(rclcpp::Node & node, std::function<float()> offset, std::shared_ptr<PauseResume> pause);
  px4_ros2::ModeBase::ModeID modeIdValue() const {return modeId();}
  px4_ros2::ModeExecutorBase & exec() {return modeExecutor();}
};

class MissionRuntime
{
public:
  explicit MissionRuntime(std::shared_ptr<rclcpp::Node> node);

  static float nan();

  void init(const RuntimeCb & cb);
  bool load(const std::string & text);
  void updateStatus(const px4_msgs::msg::VehicleStatus & msg);
  void tickAlt();
  void sendCmd(uint32_t cmd, float p1 = nan(), float p2 = nan(), float p3 = nan(), float p4 = nan(), float p5 = nan(), float p6 = nan(), float p7 = nan());
  void arm();
  void mode();
  void rtl();
  void posctl();
  void takeoff(float alt_msl);
  bool preTakeoff() const {return pre_takeoff_;}
  double preTakeoffAltMsl() const;
  void abort();
  void resetRun(bool keep_pause);
  void waitArmReady(const px4_ros2::ModeExecutorBase::CompletedCallback & cb);
  void armTimer(std::function<void()> cb);
  void modeTimer(std::function<void()> cb);
  void stopTimers();

  rclcpp::Node & node() {return *node_;}
  PauseResume & pause() {return *pause_;}
  AltitudeOffset & alt() {return alt_;}
  px4_ros2::OdometryGlobalPosition * global() {return global_.get();}

  bool loaded() const {return loaded_;}
  bool ready() const {return ready_;}
  bool active() const {return active_;}
  bool armed() const {return armed_;}
  bool waitingArm() const {return wait_arm_;}
  int index() const {return index_;}
  int execIndex() const {return exec_index_;}
  uint8_t navState() const {return nav_;}
  uint8_t armState() const {return arm_state_;}
  uint8_t executorId() const {return executor_id_;}
  bool failsafe() const {return failsafe_;}
  bool takeDisarmEvent();
  double altMsl() const;
  void waitingArm(bool value) {wait_arm_ = value;}
  void ready(bool value) {ready_ = value;}
  void loaded(bool value) {loaded_ = value;}
  void index(int value) {index_ = value; exec_index_ = value >= 0 ? value - index_offset_ : -1;}

  nlohmann::json json(const std::string & sm_state) const;

private:
  nlohmann::json itemJson(int idx) const;
  nlohmann::json itemsJson() const;
  nlohmann::json targetJson() const;
  void bindMission(const RuntimeCb & cb);
  void cancel(rclcpp::TimerBase::SharedPtr & timer);
  float offset() const {return alt_.value();}

  std::shared_ptr<rclcpp::Node> node_;
  AltitudeOffset alt_;
  std::shared_ptr<PauseResume> pause_;
  std::unique_ptr<MissionExec> mission_;
  std::unique_ptr<px4_ros2::ManualControlInput> manual_;
  std::unique_ptr<px4_ros2::OdometryGlobalPosition> global_;
  rclcpp::Publisher<px4_msgs::msg::VehicleCommand>::SharedPtr cmd_pub_;
  rclcpp::TimerBase::SharedPtr arm_timer_;
  rclcpp::TimerBase::SharedPtr mode_timer_;
  nlohmann::json mission_json_{};
  nlohmann::json exec_json_{};
  std::string mission_id_{};
  std::string mission_hash_{};
  bool loaded_{false};
  bool ready_{false};
  bool active_{false};
  bool armed_{false};
  bool wait_arm_{false};
  int index_{-1};
  uint8_t nav_{0};
  uint8_t arm_state_{0};
  uint8_t executor_id_{0};
  bool failsafe_{false};
  bool disarm_event_{false};
  bool pre_takeoff_{false};
  std::optional<double> pre_takeoff_alt_msl_{};
  int exec_index_{-1};
  int index_offset_{0};
  rclcpp::Time last_alt_log_{};
};

}  // namespace adaptive_mission_mode
