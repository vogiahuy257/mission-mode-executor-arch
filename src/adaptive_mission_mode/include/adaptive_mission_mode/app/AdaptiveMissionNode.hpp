#pragma once

#include <memory>
#include <optional>
#include <string>

#include <Eigen/Eigen>

#include <px4_msgs/msg/vehicle_command_ack.hpp>
#include <px4_msgs/msg/vehicle_land_detected.hpp>
#include <px4_msgs/msg/vehicle_status.hpp>

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

namespace adaptive_mission_mode
{

class AdaptiveMissionNode
{
public:
  explicit AdaptiveMissionNode(std::shared_ptr<rclcpp::Node> node);

private:
  enum class RuntimeState
  {
    Idle,
    NoMissionStandby,
    MissionCachedWaitMode,
    LoadingMission,
    PreTakeoff,
    WaitAdaptiveActivation,
    Running,
    ExternalInterruptedWaitSelection,
    ResumeTakeoff,
    WaitAdaptiveActivationForResume,
    ReturnToSnapshot,
    Completed,
    Error
  };

  struct MissionSnapshot
  {
    bool valid{false};
    Eigen::Vector3d position{};
    int missionIndex{-1};
    float altitudeOffsetM{0.0F};
    std::string missionHash{};
  };

  void loadParameters();

  void createRuntimeObjects();

  void createRosInterfaces();

  void createTimers();

  void mainLoop();

  void processRuntimeEvents();

  void updateRuntimeState();

  void registerModeIfNeeded();

  void cacheMissionText(const std::string & text);

  bool loadCachedMissionForExecution(const char * reason);

  void clearMissionMemory(bool clearCachedMission);

  void requestStart(bool enabled);

  void requestStop();

  void requestReset();

  void handleVehicleStatus(const px4_msgs::msg::VehicleStatus & message);

  void handleCommandAck(const px4_msgs::msg::VehicleCommandAck & message);

  void handleVehicleLandDetected(const px4_msgs::msg::VehicleLandDetected & message);

  void updateMissionSnapshot();

  void updateAltitudeOffset();

  void updatePreTakeoff();

  void updateWaitAdaptiveActivation();

  void updateExternalInterruptedWaitSelection();

  void updateReturnToSnapshot();

  void enterState(RuntimeState nextState, const char * reason);

  void enterPreTakeoff(const char * reason, std::optional<double> overrideAltitudeMsl = std::nullopt);

  void enterReturnToSnapshot(const char * reason);

  void handleMissionCompleted();

  void sendArmThrottled();

  void sendDisarmThrottled();

  void sendTakeoffThrottled(double targetAltitudeMsl);

  void sendAdaptiveModeThrottled();

  void sendPosctlOnce();

  void resetCommandTimers();

  void publishState();

  void publishStateThrottled();

  bool fmuTopicsVisible() const;

  bool canAcceptNewMission() const;

  bool missionControlBlocked() const;

  bool needPreTakeoff(double targetAltitudeMsl) const;

  bool adaptiveModeSelected() const;

  bool adaptiveModeRisingEdge() const;

  bool adaptiveModeFallingEdge() const;

  bool hasValidCurrentAltitude() const;

  double currentAltitudeMsl() const;

  double targetTakeoffAltitudeMsl() const;

  double activePreTakeoffTargetAltitudeMsl() const;

  const char * runtimeStateName() const;

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
  rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr resetSubscriber_{};

  rclcpp::Subscription<px4_msgs::msg::VehicleStatus>::SharedPtr vehicleStatusSubscriber_{};
  rclcpp::Subscription<px4_msgs::msg::VehicleCommandAck>::SharedPtr commandAckSubscriber_{};
  rclcpp::Subscription<px4_msgs::msg::VehicleLandDetected>::SharedPtr landDetectedSubscriber_{};

  rclcpp::TimerBase::SharedPtr mainLoopTimer_{};

  AltitudeOffsetController altitudeOffset_{};

  PlanInfo plan_{};

  MissionSnapshot missionSnapshot_{};

  RuntimeState state_{RuntimeState::Idle};

  std::string missionTopic_{};
  std::string fcMissionTopic_{};

  std::string cachedMissionText_{};
  std::string cachedMissionKey_{};

  std::string pendingMissionText_{};
  std::string pendingMissionKey_{};

  bool pendingMission_{false};
  bool cachedMissionAvailable_{false};
  bool missionLoaded_{false};
  bool runtimeMissionLoaded_{false};
  bool missionReady_{false};
  bool missionFinished_{false};
  bool resumeRequiresFreshAdaptiveSelection_{false};
  bool externalLandingPosctlSent_{false};
  bool externalLandingParked_{false};

  bool modeRegistered_{false};
  bool adaptiveModeActive_{false};
  bool adaptiveSelectedLast_{false};
  bool adaptiveSelectedNow_{false};
  bool adaptiveRisingEdge_{false};
  bool adaptiveFallingEdge_{false};

  bool modeActivatedEvent_{false};
  bool modeDeactivatedEvent_{false};
  bool missionCompletedEvent_{false};

  bool allowActivateTopicStart_{false};
  bool autoArm_{true};
  bool autoTakeoff_{true};
  bool publishFullItemList_{false};

  bool armed_{false};
  bool landed_{false};
  bool failsafe_{false};

  uint8_t navState_{0};
  uint8_t userIntentNavState_{0};
  uint8_t armingState_{0};
  uint8_t executorInCharge_{0};

  int currentMissionIndex_{-1};

  double takeoffAcceptanceM_{0.7};
  double snapshotReturnAcceptanceM_{1.5};
  float snapshotReturnHorizontalVelocity_{3.0F};
  float snapshotReturnVerticalVelocity_{2.0F};
  float snapshotReturnMaxHeadingRate_{60.0F};
  double statePublishPeriodS_{1.0};

  Px4CommandTarget commandTarget_{};

  std::optional<double> preTakeoffOverrideAltitudeMsl_{};

  rclcpp::Time lastRegisterLog_{};
  rclcpp::Time lastRegisterTry_{};
  rclcpp::Time lastAltitudeOffsetLog_{};
  rclcpp::Time lastArmCommand_{};
  rclcpp::Time lastDisarmCommand_{};
  rclcpp::Time lastTakeoffCommand_{};
  rclcpp::Time lastModeCommand_{};
  rclcpp::Time lastStatePublish_{};
  rclcpp::Time lastSnapshotLog_{};
  rclcpp::Time lastReturnToSnapshotLog_{};
  rclcpp::Time lastSelectLog_{};
  rclcpp::Time lastNoMissionLog_{};
  rclcpp::Time lastStateLog_{};

  bool posctlSentForCurrentState_{false};
};

}  // namespace adaptive_mission_mode
