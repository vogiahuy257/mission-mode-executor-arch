#include <gtest/gtest.h>

#include <chrono>
#include <cmath>
#include <functional>
#include <memory>
#include <string>
#include <thread>
#include <utility>
#include <vector>

#include <rclcpp/rclcpp.hpp>
#include <px4_msgs/msg/vehicle_command.hpp>
#include <px4_msgs/msg/vehicle_command_ack.hpp>
#include <px4_msgs/msg/mode_completed.hpp>
#include <px4_msgs/msg/vehicle_land_detected.hpp>
#include <px4_msgs/msg/vehicle_local_position.hpp>
#include <px4_msgs/msg/vehicle_status.hpp>
#include <px4_ros2/components/mode.hpp>
#include <px4_ros2/utils/message_version.hpp>

#include <src/components/registration.hpp>

#include "adaptive_mission_mode/behavior_tree/mission_root/normal_mission_layer/mission_lifecycle_manager.hpp"
#include "adaptive_mission_mode/core/adaptive_mission_executor.hpp"
#include "adaptive_mission_mode/core/mission_blackboard.hpp"
#include "adaptive_mission_mode/core/vehicle_interface.hpp"

namespace
{

using adaptive_mission_mode::MissionBlackboard;
using adaptive_mission_mode::MissionRuntimeState;
using adaptive_mission_mode::VehicleInterface;
using adaptive_mission_mode::tree::mission_root::normal_mission_layer::MissionLifecycleManager;

class FakeRegistration : public Registration
{
public:
  explicit FakeRegistration(rclcpp::Node & node)
  : Registration(node)
  {}

  bool doRegister(const RegistrationSettings & settings) override
  {
    setRegistrationDetails(kArmingCheckId, kModeId, kModeExecutorId, settings.name);
    return true;
  }

  void doUnregister() override {}

private:
  static constexpr int kArmingCheckId{1};
  static constexpr px4_ros2::ModeBase::ModeID kModeId{100};
  static constexpr int kModeExecutorId{1};
};

class FakeAutopilot
{
public:
  struct CommandRecord
  {
    std::uint32_t command{};
    float param1{};
    float param7{NAN};
  };

  explicit FakeAutopilot(
    const std::shared_ptr<rclcpp::Node> & /*node*/,
    std::string topicNamespacePrefix)
  : node_(std::make_shared<rclcpp::Node>(
        "fake_autopilot_" + std::to_string(++instanceCounter_))),
    topicNamespacePrefix_(std::move(topicNamespacePrefix))
  {
    executor_.add_node(node_);
    modeCompletedPub_ = node_->create_publisher<px4_msgs::msg::ModeCompleted>(
      topicNamespacePrefix_ + "fmu/out/mode_completed" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::ModeCompleted>(),
      1);
    landDetectedPub_ = node_->create_publisher<px4_msgs::msg::VehicleLandDetected>(
      topicNamespacePrefix_ + "fmu/out/vehicle_land_detected" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleLandDetected>(),
      1);
    vehicleStatusPub_ = node_->create_publisher<px4_msgs::msg::VehicleStatus>(
      topicNamespacePrefix_ + "fmu/out/vehicle_status" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleStatus>(),
      1);
    vehicleLocalPositionPub_ = node_->create_publisher<px4_msgs::msg::VehicleLocalPosition>(
      topicNamespacePrefix_ + "fmu/out/vehicle_local_position" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleLocalPosition>(),
      1);
    vehicleCommandAckPub_ = node_->create_publisher<px4_msgs::msg::VehicleCommandAck>(
      topicNamespacePrefix_ + "fmu/out/vehicle_command_ack" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleCommandAck>(),
      1);
    vehicleCommandSub_ = node_->create_subscription<px4_msgs::msg::VehicleCommand>(
      topicNamespacePrefix_ + "fmu/in/vehicle_command" +
      px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleCommand>(),
      rclcpp::QoS(1).reliable(),
      [this](const px4_msgs::msg::VehicleCommand::SharedPtr message) {
        if (!message) {
          return;
        }

        const bool accepted = processCommand(
          message->command,
          message->param1,
          message->param7,
          missionModeId_,
          missionExecutorId_,
          false);

        px4_msgs::msg::VehicleCommandAck ack{};
        ack.command = message->command;
        ack.target_system = message->source_system;
        ack.target_component = message->source_component;
        ack.result = accepted ?
          px4_msgs::msg::VehicleCommandAck::VEHICLE_CMD_RESULT_ACCEPTED :
          px4_msgs::msg::VehicleCommandAck::VEHICLE_CMD_RESULT_DENIED;
        vehicleCommandAckPub_->publish(ack);
      });

    vehicleStatus_.arming_state = px4_msgs::msg::VehicleStatus::ARMING_STATE_DISARMED;
    vehicleStatus_.nav_state = 0;
    vehicleStatus_.executor_in_charge = 0;
    vehicleStatus_.pre_flight_checks_pass = true;
    vehicleLocalPosition_.z_global = true;
    vehicleLocalPosition_.ref_alt = 500.0F;
    vehicleLocalPosition_.z = 0.0F;

    stateHeartbeatTimer_ = node_->create_wall_timer(
      std::chrono::milliseconds(50),
      [this]() {
        publishVehicleStatus();
        publishLandDetected(landed_);
        publishLocalPosition();
      });
    spinThread_ = std::thread([this]() {
        executor_.spin();
      });
  }

  ~FakeAutopilot()
  {
    executor_.cancel();
    if (spinThread_.joinable()) {
      spinThread_.join();
    }
  }

  void setActivateExecutorOnArm(bool enable)
  {
    activateExecutorOnArm_ = enable;
  }

  void setMissionIdentifiers(std::uint8_t missionModeId, std::uint8_t missionExecutorId)
  {
    missionModeId_ = missionModeId;
    missionExecutorId_ = missionExecutorId;
  }

  void setTakeoffCompletionDelay(std::chrono::milliseconds delay)
  {
    takeoffCompletionDelay_ = delay;
  }

  void setArmed(bool armed, std::uint8_t navState = 0U, std::uint8_t executorInCharge = 0U)
  {
    vehicleStatus_.arming_state =
      armed ? px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED :
      px4_msgs::msg::VehicleStatus::ARMING_STATE_DISARMED;
    vehicleStatus_.nav_state = navState;
    vehicleStatus_.executor_in_charge = executorInCharge;
  }

  void publishVehicleStatus()
  {
    vehicleStatusPub_->publish(vehicleStatus_);
  }

  void publishLandDetected(bool landed)
  {
    landed_ = landed;
    px4_msgs::msg::VehicleLandDetected message{};
    message.landed = landed;
    landDetectedPub_->publish(message);
  }

  void setCurrentAltitudeAmsl(float altitudeAmsl, float referenceAltitudeAmsl = 500.0F)
  {
    vehicleLocalPosition_.z_global = true;
    vehicleLocalPosition_.ref_alt = referenceAltitudeAmsl;
    vehicleLocalPosition_.z = referenceAltitudeAmsl - altitudeAmsl;
  }

  void publishLocalPosition()
  {
    vehicleLocalPositionPub_->publish(vehicleLocalPosition_);
  }

  bool handleCommand(
    std::uint32_t command,
    float param1,
    std::uint8_t missionModeId,
    std::uint8_t missionExecutorId)
  {
    return processCommand(command, param1, NAN, missionModeId, missionExecutorId, true);
  }

  const std::vector<CommandRecord> & commandLog() const {return commandLog_;}
  int rejectedArmCount() const {return rejectedArmCount_;}
  bool landed() const {return landed_;}

private:
  bool processCommand(
    std::uint32_t command,
    float param1,
    float param7,
    std::uint8_t missionModeId,
    std::uint8_t missionExecutorId,
    bool strictModeExecutorRules)
  {
    commandLog_.push_back(CommandRecord{command, param1, param7});

    if (command == px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE) {
      const auto modeId = static_cast<std::uint8_t>(std::lround(param1));
      vehicleStatus_.nav_state = modeId;
      if (modeId == missionModeId) {
        vehicleStatus_.executor_in_charge =
          vehicleStatus_.arming_state == px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED ?
          missionExecutorId : 0U;
      } else if (modeId == px4_ros2::ModeBase::kModeIDRtl) {
        vehicleStatus_.executor_in_charge = missionExecutorId;
      } else {
        vehicleStatus_.executor_in_charge = 0U;
      }
      publishVehicleStatus();

      if (modeId == px4_ros2::ModeBase::kModeIDRtl) {
        publishModeCompleted(modeId);
        scheduleAfter(
          std::chrono::milliseconds(10),
          [this]() {
            vehicleStatus_.arming_state = px4_msgs::msg::VehicleStatus::ARMING_STATE_DISARMED;
            vehicleStatus_.executor_in_charge = 0U;
            publishVehicleStatus();
            publishLandDetected(true);
          });
      }

      return true;
    }

    if (command == px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM) {
      const bool armRequested = std::lround(param1) == 1;
      if (
        strictModeExecutorRules &&
        armRequested &&
        vehicleStatus_.nav_state != missionModeId &&
        vehicleStatus_.nav_state != px4_ros2::ModeBase::kModeIDTakeoff)
      {
        ++rejectedArmCount_;
        return false;
      }

      vehicleStatus_.arming_state =
        armRequested ? px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED :
        px4_msgs::msg::VehicleStatus::ARMING_STATE_DISARMED;
      if (armRequested) {
        vehicleStatus_.executor_in_charge =
          activateExecutorOnArm_ && vehicleStatus_.nav_state == missionModeId ?
          missionExecutorId : 0U;
      } else {
        vehicleStatus_.executor_in_charge = 0U;
      }
      publishVehicleStatus();
      return true;
    }

    if (command == px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_TAKEOFF) {
      if (vehicleStatus_.arming_state != px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED) {
        return false;
      }

      vehicleStatus_.nav_state = px4_ros2::ModeBase::kModeIDTakeoff;
      vehicleStatus_.executor_in_charge = 0U;
      publishVehicleStatus();
      publishLandDetected(false);
      if (std::isfinite(param7) && vehicleLocalPosition_.z_global) {
        vehicleLocalPosition_.z = vehicleLocalPosition_.ref_alt - param7;
        publishLocalPosition();
      }
      if (takeoffCompletionDelay_.count() <= 0) {
        publishModeCompleted(px4_ros2::ModeBase::kModeIDTakeoff);
      } else {
        scheduleAfter(
          takeoffCompletionDelay_,
          [this]() {
            publishModeCompleted(px4_ros2::ModeBase::kModeIDTakeoff);
          });
      }
      return true;
    }

    return true;
  }

  void publishModeCompleted(std::uint8_t modeId)
  {
    px4_msgs::msg::ModeCompleted message{};
    message.nav_state = modeId;
    message.result = px4_msgs::msg::ModeCompleted::RESULT_SUCCESS;
    modeCompletedPub_->publish(message);
  }

  void scheduleAfter(
    std::chrono::milliseconds delay,
    std::function<void()> callback)
  {
    const auto callbackCopy = std::move(callback);
    auto timer = node_->create_wall_timer(
      delay,
      [this, callbackCopy]() {
        callbackCopy();
        if (!timers_.empty()) {
          timers_.front()->cancel();
          timers_.erase(timers_.begin());
        }
      });
    timers_.push_back(timer);
  }

  std::shared_ptr<rclcpp::Node> node_;
  rclcpp::executors::SingleThreadedExecutor executor_;
  std::string topicNamespacePrefix_;
  px4_msgs::msg::VehicleLocalPosition vehicleLocalPosition_{};
  px4_msgs::msg::VehicleStatus vehicleStatus_{};
  std::vector<CommandRecord> commandLog_;
  static inline int instanceCounter_{0};
  std::thread spinThread_;
  std::vector<rclcpp::TimerBase::SharedPtr> timers_;
  bool activateExecutorOnArm_{true};
  bool landed_{true};
  std::uint8_t missionModeId_{0U};
  std::uint8_t missionExecutorId_{0U};
  rclcpp::Publisher<px4_msgs::msg::ModeCompleted>::SharedPtr modeCompletedPub_;
  rclcpp::Publisher<px4_msgs::msg::VehicleLandDetected>::SharedPtr landDetectedPub_;
  int rejectedArmCount_{0};
  rclcpp::TimerBase::SharedPtr stateHeartbeatTimer_;
  std::chrono::milliseconds takeoffCompletionDelay_{0};
  rclcpp::Publisher<px4_msgs::msg::VehicleCommandAck>::SharedPtr vehicleCommandAckPub_;
  rclcpp::Subscription<px4_msgs::msg::VehicleCommand>::SharedPtr vehicleCommandSub_;
  rclcpp::Publisher<px4_msgs::msg::VehicleLocalPosition>::SharedPtr vehicleLocalPositionPub_;
  rclcpp::Publisher<px4_msgs::msg::VehicleStatus>::SharedPtr vehicleStatusPub_;
};

class TestAdaptiveMissionExecutor : public adaptive_mission_mode::AdaptiveMissionExecutor
{
public:
  static constexpr const char * kTopicPrefix = "/test/";

  TestAdaptiveMissionExecutor(rclcpp::Node & node, FakeAutopilot & fakeAutopilot)
  : adaptive_mission_mode::AdaptiveMissionExecutor(
      "Adaptive Mission",
      px4_ros2::MissionExecutor::Configuration{},
      node,
      kTopicPrefix),
    node_(node),
    fakeAutopilot_(fakeAutopilot)
  {
    setCommandHandler(
      [this](std::uint32_t command, float param1) {
        return fakeAutopilot_.handleCommand(command, param1, modeIdValue_, modeExecutorIdValue_);
      });
  }

  std::uint8_t modeIdValue() const {return modeIdValue_;}

protected:
  bool doRegisterImpl(MissionMode & mode, MissionModeExecutor & executor) override
  {
    mode.disableWatchdogTimer();
    executor.setRegistration(std::make_shared<FakeRegistration>(node_));

    const bool success = px4_ros2::MissionExecutor::doRegisterImpl(mode, executor);
    modeIdValue_ = static_cast<std::uint8_t>(executor.ownedMode().id());
    modeExecutorIdValue_ = static_cast<std::uint8_t>(executor.id());
    fakeAutopilot_.setMissionIdentifiers(modeIdValue_, modeExecutorIdValue_);
    return success;
  }

private:
  rclcpp::Node & node_;
  FakeAutopilot & fakeAutopilot_;
  std::uint8_t modeIdValue_{0U};
  std::uint8_t modeExecutorIdValue_{0U};
};

bool spinUntil(
  rclcpp::executors::SingleThreadedExecutor & executor,
  const std::function<bool()> & condition,
  std::chrono::milliseconds timeout = std::chrono::seconds(1))
{
  const auto deadline = std::chrono::steady_clock::now() + timeout;
  while (std::chrono::steady_clock::now() < deadline) {
    executor.spin_some();
    if (condition()) {
      return true;
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(5));
  }
  return condition();
}

class MissionLifecycleManagerTest : public testing::Test
{
protected:
  static void SetUpTestSuite()
  {
    if (!rclcpp::ok()) {
      int argc = 0;
      char ** argv = nullptr;
      rclcpp::init(argc, argv);
    }
  }

  static void TearDownTestSuite()
  {
    if (rclcpp::ok()) {
      rclcpp::shutdown();
    }
  }
};

TEST_F(MissionLifecycleManagerTest, ModeExecutorArmIsRejectedUntilMissionModeIsSelected)
{
  rclcpp::NodeOptions options;
  auto node = std::make_shared<rclcpp::Node>("mode_executor_arm_reject_test", options);
  rclcpp::executors::SingleThreadedExecutor executor;
  executor.add_node(node);

  FakeAutopilot fakeAutopilot(node, TestAdaptiveMissionExecutor::kTopicPrefix);
  TestAdaptiveMissionExecutor missionExecutor(*node, fakeAutopilot);

  ASSERT_TRUE(missionExecutor.doRegister());

  fakeAutopilot.publishVehicleStatus();
  ASSERT_TRUE(spinUntil(executor, [] {return true;}));

  px4_ros2::Result armResult{px4_ros2::Result::Success};
  missionExecutor.modeExecutorHandle().arm(
    [&armResult](px4_ros2::Result result) {
      armResult = result;
    },
    false);

  ASSERT_TRUE(spinUntil(executor, [&armResult] {return armResult != px4_ros2::Result::Success;}));
  EXPECT_EQ(armResult, px4_ros2::Result::Rejected);
  EXPECT_EQ(fakeAutopilot.rejectedArmCount(), 1);
}

TEST_F(MissionLifecycleManagerTest, AutoStartArmsBeforeTakeoffFromGround)
{
  auto node = std::make_shared<rclcpp::Node>("mission_auto_arm_takeoff_test");
  rclcpp::executors::SingleThreadedExecutor executor;
  executor.add_node(node);

  auto blackboard = std::make_shared<MissionBlackboard>();
  FakeAutopilot fakeAutopilot(node, TestAdaptiveMissionExecutor::kTopicPrefix);
  TestAdaptiveMissionExecutor missionExecutor(*node, fakeAutopilot);
  VehicleInterface vehicleInterface(node, blackboard, TestAdaptiveMissionExecutor::kTopicPrefix);
  MissionLifecycleManager lifecycleManager(node, blackboard, missionExecutor, vehicleInterface);

  missionExecutor.onActivated([&lifecycleManager]() {
    lifecycleManager.setMissionActive(true);
  });
  missionExecutor.onDeactivated([&lifecycleManager]() {
    lifecycleManager.setMissionActive(false);
  });

  ASSERT_TRUE(missionExecutor.doRegister());
  missionExecutor.setMission(px4_ros2::Mission({px4_ros2::ActionItem("hold")}));
  lifecycleManager.setMissionReady(true, {});
  lifecycleManager.setMissionStartTakeoffAltitudeRelativeM(10.0F);

  fakeAutopilot.setCurrentAltitudeAmsl(500.0F);
  fakeAutopilot.publishVehicleStatus();
  fakeAutopilot.publishLandDetected(true);
  fakeAutopilot.publishLocalPosition();
  ASSERT_TRUE(spinUntil(executor, [&vehicleInterface]() {
    return vehicleInterface.hasRecentVehicleStatus(0.5) &&
           vehicleInterface.hasRecentLandDetected(0.5) &&
           vehicleInterface.currentAltitudeAmslM().has_value();
  }));

  lifecycleManager.requestStart("unit_test");

  ASSERT_TRUE(spinUntil(
      executor,
      [&]() {
        lifecycleManager.tickOriginalMissionExecutor();
        return fakeAutopilot.commandLog().size() >= 2U;
      },
      std::chrono::seconds(2)));

  const auto & commandLog = fakeAutopilot.commandLog();
  ASSERT_GE(commandLog.size(), 2U);
  EXPECT_EQ(
    commandLog[0].command,
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM);
  EXPECT_FLOAT_EQ(commandLog[0].param1, 1.0F);
  EXPECT_EQ(commandLog[1].command, px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_TAKEOFF);
  EXPECT_FLOAT_EQ(commandLog[1].param7, 510.0F);
  EXPECT_EQ(fakeAutopilot.rejectedArmCount(), 0);
}

TEST_F(MissionLifecycleManagerTest, AutoStartWaitsForTakeoffCompletionBeforeActivatingMission)
{
  auto node = std::make_shared<rclcpp::Node>("mission_wait_for_takeoff_completion_test");
  rclcpp::executors::SingleThreadedExecutor executor;
  executor.add_node(node);

  auto blackboard = std::make_shared<MissionBlackboard>();
  FakeAutopilot fakeAutopilot(node, TestAdaptiveMissionExecutor::kTopicPrefix);
  fakeAutopilot.setTakeoffCompletionDelay(std::chrono::milliseconds(150));
  TestAdaptiveMissionExecutor missionExecutor(*node, fakeAutopilot);
  VehicleInterface vehicleInterface(node, blackboard, TestAdaptiveMissionExecutor::kTopicPrefix);
  MissionLifecycleManager lifecycleManager(node, blackboard, missionExecutor, vehicleInterface);

  missionExecutor.onActivated([&lifecycleManager]() {
    lifecycleManager.setMissionActive(true);
  });
  missionExecutor.onDeactivated([&lifecycleManager]() {
    lifecycleManager.setMissionActive(false);
  });

  ASSERT_TRUE(missionExecutor.doRegister());
  missionExecutor.setMission(px4_ros2::Mission({px4_ros2::ActionItem("hold")}));
  lifecycleManager.setMissionReady(true, {});

  fakeAutopilot.publishVehicleStatus();
  fakeAutopilot.publishLandDetected(true);
  ASSERT_TRUE(spinUntil(executor, [&vehicleInterface]() {
    return vehicleInterface.hasRecentVehicleStatus(0.5) &&
           vehicleInterface.hasRecentLandDetected(0.5);
  }));

  lifecycleManager.requestStart("unit_test");

  ASSERT_TRUE(spinUntil(
      executor,
      [&]() {
        lifecycleManager.tickOriginalMissionExecutor();
        return fakeAutopilot.commandLog().size() >= 2U;
      },
      std::chrono::seconds(2)));

  const auto start = std::chrono::steady_clock::now();
  while (std::chrono::steady_clock::now() - start < std::chrono::milliseconds(80)) {
    lifecycleManager.tickOriginalMissionExecutor();
    executor.spin_some();
    std::this_thread::sleep_for(std::chrono::milliseconds(5));
  }

  ASSERT_EQ(fakeAutopilot.commandLog().size(), 2U);

  ASSERT_TRUE(spinUntil(
      executor,
      [&]() {
        lifecycleManager.tickOriginalMissionExecutor();
        return fakeAutopilot.commandLog().size() >= 3U;
      },
      std::chrono::seconds(2)));

  EXPECT_EQ(
    fakeAutopilot.commandLog()[2].command,
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE);
  EXPECT_FLOAT_EQ(
    fakeAutopilot.commandLog()[2].param1,
    static_cast<float>(missionExecutor.modeIdValue()));
}

TEST_F(MissionLifecycleManagerTest, AutoArmTakeoffAndCompletesRtlMissionFromGround)
{
  auto node = std::make_shared<rclcpp::Node>("mission_auto_start_complete_test");
  rclcpp::executors::SingleThreadedExecutor executor;
  executor.add_node(node);

  auto blackboard = std::make_shared<MissionBlackboard>();
  FakeAutopilot fakeAutopilot(node, TestAdaptiveMissionExecutor::kTopicPrefix);
  TestAdaptiveMissionExecutor missionExecutor(*node, fakeAutopilot);
  VehicleInterface vehicleInterface(node, blackboard, TestAdaptiveMissionExecutor::kTopicPrefix);
  MissionLifecycleManager lifecycleManager(node, blackboard, missionExecutor, vehicleInterface);

  missionExecutor.onActivated([&lifecycleManager]() {
    lifecycleManager.setMissionActive(true);
  });
  missionExecutor.onDeactivated([&lifecycleManager]() {
    lifecycleManager.setMissionActive(false);
  });
  missionExecutor.onCompleted([&lifecycleManager]() {
    lifecycleManager.notifyMissionCompleted();
  });

  ASSERT_TRUE(missionExecutor.doRegister());
  missionExecutor.setMission(px4_ros2::Mission({px4_ros2::ActionItem("rtl")}));
  lifecycleManager.setMissionReady(true, {});
  lifecycleManager.setMissionStartTakeoffAltitudeRelativeM(10.0F);

  fakeAutopilot.setCurrentAltitudeAmsl(500.0F);
  fakeAutopilot.publishVehicleStatus();
  fakeAutopilot.publishLandDetected(true);
  fakeAutopilot.publishLocalPosition();
  ASSERT_TRUE(spinUntil(executor, [&vehicleInterface]() {
    return vehicleInterface.hasRecentVehicleStatus(0.5) &&
           vehicleInterface.hasRecentLandDetected(0.5) &&
           vehicleInterface.currentAltitudeAmslM().has_value();
  }));

  lifecycleManager.requestStart("unit_test");

  ASSERT_TRUE(spinUntil(
      executor,
      [&]() {
        lifecycleManager.tickOriginalMissionExecutor();
        return blackboard->runtimeState() == MissionRuntimeState::Completed;
      },
      std::chrono::seconds(3)));
  ASSERT_TRUE(spinUntil(
      executor,
      [&]() {
        lifecycleManager.tickOriginalMissionExecutor();
        return !blackboard->missionActive();
      },
      std::chrono::seconds(2)));

  const auto & commandLog = fakeAutopilot.commandLog();
  ASSERT_GE(commandLog.size(), 4U);
  EXPECT_EQ(
    commandLog[0].command,
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM);
  EXPECT_FLOAT_EQ(commandLog[0].param1, 1.0F);
  EXPECT_EQ(commandLog[1].command, px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_TAKEOFF);
  EXPECT_FLOAT_EQ(commandLog[1].param7, 510.0F);
  EXPECT_EQ(commandLog[2].command, px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE);
  EXPECT_FLOAT_EQ(commandLog[2].param1, static_cast<float>(missionExecutor.modeIdValue()));
  EXPECT_EQ(commandLog[3].command, px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE);
  EXPECT_FLOAT_EQ(commandLog[3].param1, static_cast<float>(px4_ros2::ModeBase::kModeIDRtl));
  EXPECT_EQ(fakeAutopilot.rejectedArmCount(), 0);
  EXPECT_TRUE(fakeAutopilot.landed());
  EXPECT_TRUE(blackboard->lastError().empty());
  EXPECT_EQ(blackboard->runtimeState(), MissionRuntimeState::Completed);
  EXPECT_FALSE(blackboard->missionActive());
}

}  // namespace
