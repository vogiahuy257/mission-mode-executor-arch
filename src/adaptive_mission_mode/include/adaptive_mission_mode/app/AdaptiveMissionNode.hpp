#pragma once

#include <memory>
#include <optional>
#include <string>
#include <vector>

#include <px4_msgs/msg/vehicle_command_ack.hpp>
#include <px4_msgs/msg/vehicle_land_detected.hpp>
#include <px4_msgs/msg/vehicle_status.hpp>

#include <Eigen/Eigen>

#include <px4_ros2/components/manual_control_input.hpp>
#include <px4_ros2/control/setpoint_types/multicopter/goto.hpp>
#include <px4_ros2/odometry/global_position.hpp>

#include <rclcpp/rclcpp.hpp>

#include <std_msgs/msg/bool.hpp>
#include <std_msgs/msg/string.hpp>

#include "adaptive_mission_mode/control/AltitudeOffsetController.hpp"
#include "adaptive_mission_mode/control/Px4CommandClient.hpp"
#include "adaptive_mission_mode/mission/MissionModel.hpp"
#include "adaptive_mission_mode/runtime/AdaptiveMissionExecutor.hpp"
#include "adaptive_mission_mode/runtime/PauseResumeController.hpp"

namespace adaptive_mission_mode
{

class AdaptiveMissionNode
{
public:
  explicit AdaptiveMissionNode(std::shared_ptr<rclcpp::Node> node);

private:
  struct MissionSnapshot
  {
    bool valid{false};
    Eigen::Vector3d position{};
    int missionIndex{-1};
    float altitudeOffsetM{0.0F};
    std::string missionHash{};
  };

  enum class ResumeFlowState
  {
    None,
    InterruptedWaitSelection,
    ResumeTakeoff,
    WaitAdaptiveActivation,
    ReturnToSnapshot
  };

  void loadParameters();

  void createRuntimeObjects();

  void createRosInterfaces();

  void createTimers();

  void mainLoop();

  void registerModeIfNeeded();

  void cacheMissionText(const std::string & text);

  bool loadCachedMissionForExecution(const char * reason);

  void clearMissionMemory(bool clearCachedMission);

  void retryPendingMissionIfReady();

  void requestStart(bool enabled);

  void requestStop();

  void requestPauseRtl();

  void requestContinueMission();

  void requestReset();

  void updatePauseResume();

  void updateMissionSnapshot();

  void beginReturnToSnapshot(const char * reason);

  void updateReturnToSnapshot();

  void settleExternalInterruptionIfNeeded();

  bool saveResumeMission();

  bool applyResumeMission();

  void handleVehicleStatus(const px4_msgs::msg::VehicleStatus & message);

  void handleCommandAck(const px4_msgs::msg::VehicleCommandAck & message);

  void handleVehicleLandDetected(const px4_msgs::msg::VehicleLandDetected & message);

  void beginPreTakeoff(const char * reason);

  void updateAltitudeOffset();

  void updatePreTakeoff();

  void publishState();

  void publishStateThrottled();

  bool fmuTopicsVisible() const;

  bool needPreTakeoff() const;

  bool shouldUseSnapshotTakeoff() const;

  bool missionControlBlocked() const;

  const char * resumeFlowStateName() const;

  double currentAltitudeMsl() const;

  double targetTakeoffAltitudeMsl() const;

  nlohmann::json buildResumeStateJson() const;

  nlohmann::json buildMissionItemStateJson(int index) const;

  nlohmann::json buildMissionItemsStateJson() const;

  nlohmann::json buildMissionSummaryJson() const;

  nlohmann::json buildStateJson() const;

  std::shared_ptr<rclcpp::Node> node_{};

  std::unique_ptr<AdaptiveMissionExecutor> executor_{};

  std::unique_ptr<px4_ros2::ManualControlInput> manualControl_{};

  std::unique_ptr<px4_ros2::OdometryGlobalPosition> globalPosition_{};

  std::unique_ptr<Px4CommandClient> px4Command_{};

  std::shared_ptr<px4_ros2::MulticopterGotoGlobalSetpointType> snapshotGotoSetpoint_{};

  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr statePublisher_{};

  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr missionSubscriber_{};
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr fcMissionSubscriber_{};

  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr activateSubscriber_{};
  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr pauseSubscriber_{};
  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr continueSubscriber_{};
  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr resetSubscriber_{};

  rclcpp::Subscription<px4_msgs::msg::VehicleStatus>::SharedPtr vehicleStatusSubscriber_{};
  rclcpp::Subscription<px4_msgs::msg::VehicleCommandAck>::SharedPtr commandAckSubscriber_{};
  rclcpp::Subscription<px4_msgs::msg::VehicleLandDetected>::SharedPtr landDetectedSubscriber_{};

  rclcpp::TimerBase::SharedPtr mainLoopTimer_{};

  AltitudeOffsetController altitudeOffset_{};

  PauseResumeController pauseResume_{};

  PlanInfo plan_{};

  std::string missionTopic_{};
  std::string fcMissionTopic_{};

  std::string cachedMissionText_{};
  std::string cachedMissionKey_{};

  std::string sourceMissionKey_{};
  std::string pendingMissionText_{};
  std::string pendingMissionKey_{};

  bool pendingMission_{};

  std::string runtimeState_{"idle"};

  bool allowActivateTopicStart_{};
  bool autoArm_{};
  bool autoTakeoff_{};
  bool publishFullItemList_{};

  double takeoffAcceptanceM_{};
  double snapshotReturnAcceptanceM_{};
  float snapshotReturnHorizontalVelocity_{};
  float snapshotReturnVerticalVelocity_{};
  float snapshotReturnMaxHeadingRate_{};
  double statePublishPeriodS_{};

  Px4CommandTarget commandTarget_{};

  bool cachedMissionAvailable_{};
  bool missionLoaded_{};
  bool missionReady_{};
  bool runtimeMissionLoaded_{};
  bool modeRegistered_{};
  bool active_{};
  bool resumePending_{};
  bool preTakeoffActive_{};
  bool preTakeoffSent_{};
  bool preModeSent_{};
  bool missionFinished_{};
  bool externalInterrupted_{};
  bool returnToSnapshotActive_{};
  bool noCachedMissionRejectActive_{};
  bool lastAdaptiveNavActive_{};
  bool externalInterruptionNeutralModeSent_{};

  ResumeFlowState resumeFlowState_{ResumeFlowState::None};

  bool armed_{};
  bool landed_{};
  bool failsafe_{};

  uint8_t navState_{};
  uint8_t userIntentNavState_{};
  uint8_t armingState_{};
  uint8_t executorInCharge_{};

  int currentMissionIndex_{-1};
  int resumeIndex_{};

  float resumeAltitudeOffsetM_{};

  nlohmann::json resumeMissionJson_{nlohmann::json::object()};
  nlohmann::json resumeInfoJson_{nlohmann::json::object()};

  MissionSnapshot missionSnapshot_{};
  std::optional<double> preTakeoffOverrideAltitudeMsl_{};

  rclcpp::Time lastRegisterLog_{};
  rclcpp::Time lastRegisterTry_{};
  rclcpp::Time lastAltitudeOffsetLog_{};
  rclcpp::Time lastArmCommand_{};
  rclcpp::Time lastTakeoffCommand_{};
  rclcpp::Time lastModeCommand_{};
  rclcpp::Time lastSelectWatchLog_{};
  rclcpp::Time lastStatePublish_{};
  rclcpp::Time lastSnapshotLog_{};
  rclcpp::Time lastReturnToSnapshotLog_{};
};

}  // namespace adaptive_mission_mode
