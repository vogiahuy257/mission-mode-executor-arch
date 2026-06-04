#include "adaptive_mission_mode/app/AdaptiveMissionNode.hpp"

#include <algorithm>
#include <chrono>
#include <cmath>
#include <limits>
#include <utility>

#include <px4_ros2/mission/mission.hpp>
#include <px4_ros2/utils/message_version.hpp>

#include "adaptive_mission_mode/mission/MissionParser.hpp"
#include "adaptive_mission_mode/mission/ResumeMissionBuilder.hpp"

using namespace std::chrono_literals;

namespace adaptive_mission_mode
{
namespace
{
constexpr char kDefaultMissionTopic[] = "~/mission_json";
constexpr char kDefaultFcMissionTopic[] = "/fc_mission_reader/mission_json";

bool hasValidNumber(double value)
{
  return std::isfinite(value);
}

constexpr double kEarthRadiusM = 6371000.0;
constexpr double kPi = 3.14159265358979323846;

double toRadians(double degree)
{
  return degree * kPi / 180.0;
}

float distance2dM(const Eigen::Vector3d & a, const Eigen::Vector3d & b)
{
  const double latA = toRadians(a.x());
  const double latB = toRadians(b.x());

  const double deltaLat = latB - latA;
  const double deltaLon = toRadians(b.y() - a.y());

  const double sinLat = std::sin(deltaLat * 0.5);
  const double sinLon = std::sin(deltaLon * 0.5);

  const double haversine =
    sinLat * sinLat +
    std::cos(latA) * std::cos(latB) * sinLon * sinLon;

  return static_cast<float>(
    2.0 * kEarthRadiusM *
    std::atan2(std::sqrt(haversine), std::sqrt(std::max(0.0, 1.0 - haversine))));
}

float distance3dM(const Eigen::Vector3d & a, const Eigen::Vector3d & b)
{
  return static_cast<float>(std::hypot(
    static_cast<double>(distance2dM(a, b)),
    b.z() - a.z()));
}

float headingRad(const Eigen::Vector3d & from, const Eigen::Vector3d & to)
{
  const double latA = toRadians(from.x());
  const double latB = toRadians(to.x());
  const double deltaLon = toRadians(to.y() - from.y());

  const double y = std::sin(deltaLon) * std::cos(latB);
  const double x =
    std::cos(latA) * std::sin(latB) -
    std::sin(latA) * std::cos(latB) * std::cos(deltaLon);

  return static_cast<float>(std::atan2(y, x));
}
}  // namespace

AdaptiveMissionNode::AdaptiveMissionNode(std::shared_ptr<rclcpp::Node> node)
: node_(std::move(node))
{
  loadParameters();
  createRuntimeObjects();
  createRosInterfaces();
  createTimers();

  RCLCPP_INFO(
    node_->get_logger(),
    "Ready. Mission JSON will be cached from %s or %s, and loaded only when Adaptive Mission Mode is selected.",
    missionTopic_.c_str(),
    fcMissionTopic_.c_str());
}

void AdaptiveMissionNode::loadParameters()
{
  missionTopic_ = node_->declare_parameter<std::string>("mission_topic", kDefaultMissionTopic);
  fcMissionTopic_ = node_->declare_parameter<std::string>("fc_mission_topic", kDefaultFcMissionTopic);

  allowActivateTopicStart_ = node_->declare_parameter<bool>("allow_activate_topic_start", false);
  autoArm_ = node_->declare_parameter<bool>("auto_arm_on_activate", true);
  autoTakeoff_ = node_->declare_parameter<bool>("auto_takeoff_on_activate", true);
  publishFullItemList_ = node_->declare_parameter<bool>("publish_full_item_list", false);

  takeoffAcceptanceM_ = node_->declare_parameter<double>("takeoff_acceptance_m", 0.7);

  snapshotReturnAcceptanceM_ = node_->declare_parameter<double>("snapshot_return_acceptance_m", 1.5);
  snapshotReturnHorizontalVelocity_ = static_cast<float>(
    node_->declare_parameter<double>("snapshot_return_horizontal_velocity", 3.0));
  snapshotReturnVerticalVelocity_ = static_cast<float>(
    node_->declare_parameter<double>("snapshot_return_vertical_velocity", 2.0));
  snapshotReturnMaxHeadingRate_ = static_cast<float>(
    node_->declare_parameter<double>("snapshot_return_max_heading_rate", 60.0));
  statePublishPeriodS_ = node_->declare_parameter<double>("state_publish_period_s", 1.0);

  commandTarget_.targetSystem = node_->declare_parameter<int>("target_system", 1);
  commandTarget_.targetComponent = node_->declare_parameter<int>("target_component", 1);
  commandTarget_.sourceSystem = node_->declare_parameter<int>("source_system", 1);
  commandTarget_.sourceComponent = node_->declare_parameter<int>("source_component", 1);
}

void AdaptiveMissionNode::createRuntimeObjects()
{
  executor_ = std::make_unique<AdaptiveMissionExecutor>(
    *node_,
    [this]() { return altitudeOffset_.offsetM(); },
    [this]() { return missionControlBlocked(); });

  manualControl_ = std::make_unique<px4_ros2::ManualControlInput>(
    executor_->base().ownedMode(),
    true);

  globalPosition_ = std::make_unique<px4_ros2::OdometryGlobalPosition>(
    executor_->base().ownedMode());

  snapshotGotoSetpoint_ = std::make_shared<px4_ros2::MulticopterGotoGlobalSetpointType>(
    executor_->base().ownedMode());

  px4Command_ = std::make_unique<Px4CommandClient>(*node_, commandTarget_);

  executor_->onReadynessUpdate(
    [this](bool ready, const std::vector<std::string> & errors)
    {
      missionReady_ = ready;

      if (!ready && runtimeMissionLoaded_) {
        for (const auto & error : errors) {
          RCLCPP_WARN_THROTTLE(
            node_->get_logger(),
            *node_->get_clock(),
            3000,
            "Runtime mission not ready: %s",
            error.c_str());
        }
      }

      publishState();
    });

  executor_->onActivated(
    [this]()
    {
      active_ = true;

      /*
       * Case resume sau khi user rời Adaptive Mode giữa chuyến bay.
       *
       * Đây là state machine rõ ràng, không để onActivated() tự quyết định
       * lặp lại ARM/TAKEOFF. Khi đang resume, onActivated() chỉ có hai việc:
       * - Nếu đã qua giai đoạn takeoff/wait activation: bắt đầu return_to_snapshot.
       * - Nếu đã ở return_to_snapshot: giữ nguyên, không làm gì thêm.
       */
      if (externalInterrupted_ && missionLoaded_ && runtimeMissionLoaded_) {
        if (resumeFlowState_ == ResumeFlowState::ResumeTakeoff ||
          resumeFlowState_ == ResumeFlowState::WaitAdaptiveActivation ||
          preTakeoffActive_)
        {
          preTakeoffActive_ = false;
          preTakeoffSent_ = false;
          preModeSent_ = false;
          preTakeoffOverrideAltitudeMsl_.reset();

          beginReturnToSnapshot("Adaptive mode activated after resume takeoff");
          return;
        }

        if (resumeFlowState_ == ResumeFlowState::ReturnToSnapshot) {
          runtimeState_ = "return_to_snapshot";
          publishState();
          return;
        }

        beginReturnToSnapshot("Adaptive mode activated again");
        return;
      }

      altitudeOffset_.reset();
      missionFinished_ = false;

      if (!runtimeMissionLoaded_) {
        loadCachedMissionForExecution("mode activated");
      }

      if (!missionLoaded_ || !missionReady_) {
        /*
         * User có thể chọn Adaptive Mission Mode khi chưa nạp mission.
         * Đây không phải lỗi chết node.
         *
         * Không gửi POSCTL ở đây vì khi vừa thoát custom mode, px4_ros2 có thể
         * không còn nhận request từ FMU và ném timeout. Thay vào đó node đứng
         * chờ mission_json; khi mission được cache, handleVehicleStatus() sẽ
         * load mission và tiếp tục nếu Adaptive vẫn đang được chọn.
         */
        active_ = false;
        runtimeState_ = "wait_mission_cache";
        noCachedMissionRejectActive_ = true;

        RCLCPP_WARN(
          node_->get_logger(),
          "Adaptive mode is active but no runtime mission is ready. Waiting for mission_json instead of leaving the mode.");

        publishState();
        return;
      }

      if (autoTakeoff_ && needPreTakeoff()) {
        beginPreTakeoff("mode activated on ground");
        return;
      }

      preTakeoffActive_ = false;
      preTakeoffOverrideAltitudeMsl_.reset();
      runtimeState_ = "mission";

      publishState();
    });

  executor_->onDeactivated(
    [this]()
    {
      const bool resumeTakeoffInProgress =
        resumeFlowState_ == ResumeFlowState::ResumeTakeoff ||
        resumeFlowState_ == ResumeFlowState::WaitAdaptiveActivation;

      const bool shouldKeepMissionForReturn =
        missionLoaded_ &&
        runtimeMissionLoaded_ &&
        !missionFinished_ &&
        !preTakeoffActive_ &&
        !resumeTakeoffInProgress &&
        !pauseResume_.running() &&
        !resumePending_ &&
        missionSnapshot_.valid;

      active_ = false;

      if (!resumeTakeoffInProgress) {
        returnToSnapshotActive_ = false;
      }

      /*
       * Không reset preTakeoffOverrideAltitudeMsl_ khi đang pre-takeoff để
       * resume về snapshot. Nếu reset ở đây, target takeoff sẽ rơi về altitude
       * takeoff ban đầu của mission, gây log nhảy giữa 50 m và 10 m.
       */
      if (!preTakeoffActive_ && !resumeTakeoffInProgress) {
        preTakeoffOverrideAltitudeMsl_.reset();
      }

      /*
       * Nếu Adaptive Mode bị rời giữa chuyến bay do user chọn mode khác,
       * không xóa mission và không build resume mission. Chỉ đánh dấu bị
       * gián đoạn. Khi user chọn lại Adaptive Mode, node sẽ bay về snapshot.
       */
      if (shouldKeepMissionForReturn) {
        externalInterrupted_ = true;
        externalInterruptionNeutralModeSent_ = false;
        resumeFlowState_ = ResumeFlowState::InterruptedWaitSelection;
        runtimeState_ = "external_interrupted_wait_mode";

        RCLCPP_WARN(
          node_->get_logger(),
          "Adaptive mode interrupted. Snapshot kept at lat=%.7f lon=%.7f alt=%.2f index=%d. Select Adaptive Mode again to return and continue.",
          missionSnapshot_.position.x(),
          missionSnapshot_.position.y(),
          missionSnapshot_.position.z(),
          missionSnapshot_.missionIndex);

        publishState();
        return;
      }

      if (resumeTakeoffInProgress) {
        runtimeState_ = resumeFlowStateName();
        publishState();
        return;
      }

      if (pauseResume_.running()) {
        runtimeState_ = pauseResume_.stateName();
      } else if (resumePending_) {
        runtimeState_ = "pause_wait_continue";
      } else if (!preTakeoffActive_ && !missionLoaded_) {
        currentMissionIndex_ = -1;
        runtimeState_ = "idle";
        altitudeOffset_.reset();
      }

      publishState();
    });

  executor_->onProgressUpdate(
    [this](int index)
    {
      currentMissionIndex_ = index;
      publishState();
    });

  executor_->onCompleted(
    [this]()
    {
      missionFinished_ = true;
      active_ = false;
      preTakeoffActive_ = false;
      returnToSnapshotActive_ = false;
      externalInterrupted_ = false;
      resumeFlowState_ = ResumeFlowState::None;
      runtimeState_ = "done";

      clearMissionMemory(true);
      runtimeState_ = "done";

      /*
       * Mission hoàn thành thì mới xóa cache/runtime mission.
       * Sau đó rời Adaptive Mission Mode để tránh vòng lặp auto arm/takeoff lại.
       */
      px4Command_->posctl();

      RCLCPP_WARN(
        node_->get_logger(),
        "Mission completed. Cached mission/runtime state cleared and PX4 switched to POSCTL.");

      publishState();
    });
}

void AdaptiveMissionNode::createRosInterfaces()
{
  statePublisher_ = node_->create_publisher<std_msgs::msg::String>(
    "~/state",
    rclcpp::QoS(1).reliable());

  const std::string statusTopic =
    "fmu/out/vehicle_status" +
    px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleStatus>();

  vehicleStatusSubscriber_ = node_->create_subscription<px4_msgs::msg::VehicleStatus>(
    statusTopic,
    rclcpp::QoS(1).best_effort(),
    [this](px4_msgs::msg::VehicleStatus::SharedPtr message)
    {
      if (message) {
        handleVehicleStatus(*message);
      }
    });

  const std::string ackTopic =
    "fmu/out/vehicle_command_ack" +
    px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleCommandAck>();

  commandAckSubscriber_ = node_->create_subscription<px4_msgs::msg::VehicleCommandAck>(
    ackTopic,
    rclcpp::QoS(10).best_effort(),
    [this](px4_msgs::msg::VehicleCommandAck::SharedPtr message)
    {
      if (message) {
        handleCommandAck(*message);
      }
    });

  const std::string landDetectedTopic =
    "fmu/out/vehicle_land_detected" +
    px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleLandDetected>();

  landDetectedSubscriber_ = node_->create_subscription<px4_msgs::msg::VehicleLandDetected>(
    landDetectedTopic,
    rclcpp::QoS(1).best_effort(),
    [this](px4_msgs::msg::VehicleLandDetected::SharedPtr message)
    {
      if (message) {
        handleVehicleLandDetected(*message);
      }
    });

  missionSubscriber_ = node_->create_subscription<std_msgs::msg::String>(
    missionTopic_,
    rclcpp::QoS(1).reliable(),
    [this](std_msgs::msg::String::SharedPtr message)
    {
      if (message) {
        cacheMissionText(message->data);
      }
    });

  if (fcMissionTopic_ != missionTopic_) {
    fcMissionSubscriber_ = node_->create_subscription<std_msgs::msg::String>(
      fcMissionTopic_,
      rclcpp::QoS(1).reliable(),
      [this](std_msgs::msg::String::SharedPtr message)
      {
        if (message) {
          cacheMissionText(message->data);
        }
      });
  }

  activateSubscriber_ = node_->create_subscription<std_msgs::msg::Bool>(
    "~/activate",
    rclcpp::QoS(1).reliable(),
    [this](std_msgs::msg::Bool::SharedPtr message)
    {
      if (message) {
        requestStart(message->data);
      }
    });

  resetSubscriber_ = node_->create_subscription<std_msgs::msg::Bool>(
    "~/reset",
    rclcpp::QoS(1).reliable(),
    [this](std_msgs::msg::Bool::SharedPtr message)
    {
      if (message && message->data) {
        requestReset();
      }
    });
}

void AdaptiveMissionNode::createTimers()
{
  mainLoopTimer_ = node_->create_wall_timer(
    50ms,
    [this]() { mainLoop(); });
}

/**
 * @brief Vòng lặp runtime chính của node.
 *
 * Logic:
 * - Thử đăng ký Adaptive Mission Mode khi FMU DDS đã sẵn sàng.
 * - Cập nhật offset độ cao theo cần ga.
 * - Lưu snapshot liên tục khi mission đang chạy.
 * - Nếu đang return_to_snapshot thì gửi setpoint bay về snapshot.
 * - Retry mission nếu trước đó thiếu altitude reference.
 * - Xử lý state machine auto ARM/TAKEOFF.
 * - Xử lý state machine pause/continue cũ nếu còn dùng.
 * - Publish state định kỳ cho backend/UI.
 */
void AdaptiveMissionNode::mainLoop()
{
  registerModeIfNeeded();
  updateAltitudeOffset();
  updateMissionSnapshot();
  updateReturnToSnapshot();
  settleExternalInterruptionIfNeeded();
  retryPendingMissionIfReady();
  updatePreTakeoff();
  updatePauseResume();
  publishStateThrottled();
}

/**
 * @brief Publish state với throttle để main loop 50 ms không spam topic state.
 */
void AdaptiveMissionNode::publishStateThrottled()
{
  const auto now = node_->now();

  if (lastStatePublish_.nanoseconds() != 0 &&
    (now - lastStatePublish_).seconds() < statePublishPeriodS_)
  {
    return;
  }

  lastStatePublish_ = now;
  publishState();
}

/**
 * @brief Lưu snapshot vị trí mission đang bay.
 *
 * Logic:
 * - Chỉ lưu khi mission cũ đang active và không bị block bởi pre-takeoff/return.
 * - Snapshot gồm lat/lon/alt, current mission index, altitude offset và hash mission.
 * - Nếu user bất ngờ chọn mode khác, snapshot này sẽ là điểm để quay lại.
 */
void AdaptiveMissionNode::updateMissionSnapshot()
{
  if (!active_ || !missionLoaded_ || !runtimeMissionLoaded_) {
    return;
  }

  if (preTakeoffActive_ || returnToSnapshotActive_) {
    return;
  }

  if (!globalPosition_ || !globalPosition_->positionValid()) {
    return;
  }

  missionSnapshot_.valid = true;
  missionSnapshot_.position = globalPosition_->position();
  missionSnapshot_.missionIndex = currentMissionIndex_;
  missionSnapshot_.altitudeOffsetM = altitudeOffset_.offsetM();
  missionSnapshot_.missionHash = plan_.hash;

  const auto now = node_->now();

  if (lastSnapshotLog_.nanoseconds() == 0 ||
    (now - lastSnapshotLog_).seconds() > 5.0)
  {
    lastSnapshotLog_ = now;

    RCLCPP_INFO(
      node_->get_logger(),
      "Mission snapshot lat=%.7f lon=%.7f alt=%.2f index=%d offset=%.2f",
      missionSnapshot_.position.x(),
      missionSnapshot_.position.y(),
      missionSnapshot_.position.z(),
      missionSnapshot_.missionIndex,
      missionSnapshot_.altitudeOffsetM);
  }
}

/**
 * @brief Bắt đầu bay về snapshot sau khi user chọn lại Adaptive Mission Mode.
 *
 * Logic:
 * - Không parse lại mission.
 * - Không setMission lại.
 * - Không build resume mission.
 * - Chỉ bật returnToSnapshotActive_ để block executor mission cũ.
 */
void AdaptiveMissionNode::beginReturnToSnapshot(const char * reason)
{
  if (!missionSnapshot_.valid) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot return to snapshot on %s: no valid snapshot", reason);
    return;
  }

  preTakeoffActive_ = false;
  preTakeoffOverrideAltitudeMsl_.reset();
  returnToSnapshotActive_ = true;
  externalInterruptionNeutralModeSent_ = false;
  resumeFlowState_ = ResumeFlowState::ReturnToSnapshot;
  runtimeState_ = "return_to_snapshot";

  RCLCPP_WARN(
    node_->get_logger(),
    "Return to snapshot on %s: lat=%.7f lon=%.7f alt=%.2f index=%d",
    reason,
    missionSnapshot_.position.x(),
    missionSnapshot_.position.y(),
    missionSnapshot_.position.z(),
    missionSnapshot_.missionIndex);

  publishState();
}

/**
 * @brief Gửi setpoint global để bay về snapshot.
 *
 * Logic:
 * - Khi còn xa snapshot thì update global goto setpoint.
 * - Khi đã gần hơn snapshotReturnAcceptanceM_ thì tắt return_to_snapshot.
 * - Khi return_to_snapshot tắt, missionControlBlocked() trả false và executor tiếp tục mission cũ.
 */
void AdaptiveMissionNode::updateReturnToSnapshot()
{
  if (!returnToSnapshotActive_) {
    return;
  }

  if (!active_) {
    return;
  }

  if (!missionSnapshot_.valid || !snapshotGotoSetpoint_) {
    RCLCPP_ERROR_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      1000,
      "Cannot return to snapshot: snapshot or goto setpoint is invalid");
    return;
  }

  if (!globalPosition_ || !globalPosition_->positionValid()) {
    RCLCPP_ERROR_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      1000,
      "Cannot return to snapshot: no valid global position");
    return;
  }

  const Eigen::Vector3d current = globalPosition_->position();
  const Eigen::Vector3d target = missionSnapshot_.position;
  const float distanceM = distance3dM(current, target);

  if (distanceM <= static_cast<float>(snapshotReturnAcceptanceM_)) {
    returnToSnapshotActive_ = false;
    externalInterrupted_ = false;
    resumeFlowState_ = ResumeFlowState::None;
    preTakeoffOverrideAltitudeMsl_.reset();
    runtimeState_ = "mission";

    RCLCPP_WARN(
      node_->get_logger(),
      "Returned to mission snapshot. Unblocking old mission executor from index=%d",
      missionSnapshot_.missionIndex);

    publishState();
    return;
  }

  std::optional<float> yawRad{};

  if (distance2dM(current, target) > 0.1F) {
    yawRad = headingRad(current, target);
  }

  snapshotGotoSetpoint_->update(
    target,
    yawRad,
    snapshotReturnHorizontalVelocity_,
    snapshotReturnVerticalVelocity_,
    snapshotReturnMaxHeadingRate_);

  const auto now = node_->now();

  if (lastReturnToSnapshotLog_.nanoseconds() == 0 ||
    (now - lastReturnToSnapshotLog_).seconds() > 1.0)
  {
    lastReturnToSnapshotLog_ = now;

    RCLCPP_INFO(
      node_->get_logger(),
      "Returning to snapshot: distance=%.2f m",
      distanceM);
  }
}

/**
 * @brief Đưa PX4 về mode trung tính sau khi external interruption đã hạ cánh.
 *
 * Logic:
 * - Khi user chọn RTL/LAND/HOME, node chỉ lưu snapshot và chờ.
 * - Sau khi PX4 đã landed/disarmed, gửi POSCTL một lần để xóa user-intention
 *   Adaptive cũ còn sót lại trong PX4/QGC.
 * - Nhờ vậy node không tự resume do trạng thái cũ, mà chỉ resume khi user
 *   thật sự chọn Adaptive Mode lại sau đó.
 */
void AdaptiveMissionNode::settleExternalInterruptionIfNeeded()
{
  if (!externalInterrupted_ ||
    resumeFlowState_ != ResumeFlowState::InterruptedWaitSelection ||
    externalInterruptionNeutralModeSent_)
  {
    return;
  }

  if (!landed_ || armed_) {
    return;
  }

  externalInterruptionNeutralModeSent_ = true;
  lastAdaptiveNavActive_ = false;

  RCLCPP_WARN(
    node_->get_logger(),
    "External interruption settled after landed/disarmed. Switching PX4 to POSCTL and waiting for a fresh Adaptive Mode selection.");

  px4Command_->posctl();
  publishState();
}

/**
 * @brief Kiểm tra pre-takeoff riêng cho case quay lại snapshot.
 */
bool AdaptiveMissionNode::shouldUseSnapshotTakeoff() const
{
  if (!missionSnapshot_.valid) {
    return false;
  }

  if (autoArm_ && !armed_) {
    return true;
  }

  const double currentAltitude = currentAltitudeMsl();
  const double targetAltitude = missionSnapshot_.position.z();

  return !hasValidNumber(currentAltitude) ||
    currentAltitude < targetAltitude - takeoffAcceptanceM_;
}

/**
 * @brief Trả về true khi executor mission cũ phải tạm ngưng gửi setpoint.
 */
bool AdaptiveMissionNode::missionControlBlocked() const
{
  return preTakeoffActive_ ||
    returnToSnapshotActive_ ||
    resumeFlowState_ == ResumeFlowState::ResumeTakeoff ||
    resumeFlowState_ == ResumeFlowState::WaitAdaptiveActivation ||
    resumeFlowState_ == ResumeFlowState::ReturnToSnapshot;
}

const char * AdaptiveMissionNode::resumeFlowStateName() const
{
  switch (resumeFlowState_) {
    case ResumeFlowState::None:
      return "none";

    case ResumeFlowState::InterruptedWaitSelection:
      return "interrupted_wait_selection";

    case ResumeFlowState::ResumeTakeoff:
      return "resume_takeoff";

    case ResumeFlowState::WaitAdaptiveActivation:
      return "wait_adaptive_activation";

    case ResumeFlowState::ReturnToSnapshot:
      return "return_to_snapshot";
  }

  return "unknown";
}

/**
 * @brief Reset toàn bộ mission/cache/snapshot bằng topic ~/reset.
 */
void AdaptiveMissionNode::requestReset()
{
  missionFinished_ = false;
  externalInterrupted_ = false;
  returnToSnapshotActive_ = false;
  noCachedMissionRejectActive_ = false;
  resumeFlowState_ = ResumeFlowState::None;
  missionSnapshot_ = MissionSnapshot{};
  preTakeoffOverrideAltitudeMsl_.reset();

  clearMissionMemory(true);
  runtimeState_ = "idle";

  px4Command_->posctl();

  RCLCPP_WARN(node_->get_logger(), "Mission memory reset by ~/reset topic");

  publishState();
}

bool AdaptiveMissionNode::fmuTopicsVisible() const
{
  const std::string statusTopic =
    "fmu/out/vehicle_status" +
    px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleStatus>();

  return node_->count_publishers(statusTopic) > 0;
}

void AdaptiveMissionNode::registerModeIfNeeded()
{
  if (modeRegistered_) {
    return;
  }

  const auto now = node_->now();
  const bool allowLog = lastRegisterLog_.nanoseconds() == 0 ||
    (now - lastRegisterLog_).seconds() > 3.0;

  if (!fmuTopicsVisible()) {
    if (allowLog) {
      lastRegisterLog_ = now;
      RCLCPP_WARN(node_->get_logger(), "Waiting FMU DDS before registering custom mode");
    }

    return;
  }

  if (lastRegisterTry_.nanoseconds() != 0 &&
    (now - lastRegisterTry_).seconds() < 5.0)
  {
    return;
  }

  lastRegisterTry_ = now;

  RCLCPP_INFO(node_->get_logger(), "Registering Adaptive Mission Mode...");

  modeRegistered_ = executor_->doRegister();

  if (modeRegistered_) {
    RCLCPP_INFO(node_->get_logger(), "Adaptive Mission Mode registered");
  } else {
    RCLCPP_ERROR(
      node_->get_logger(),
      "Register failed. Check PX4 / px4_msgs / px4_ros2_cpp version match.");
  }
}

void AdaptiveMissionNode::cacheMissionText(const std::string & text)
{
  if (active_ || runtimeMissionLoaded_ || resumePending_ || pauseResume_.running() ||
    externalInterrupted_ || returnToSnapshotActive_)
  {
    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      3000,
      "Mission message cached later is ignored while a mission/resume flow is running");

    return;
  }

  const auto key = missionKey(text);

  if (cachedMissionAvailable_ && key == cachedMissionKey_) {
    return;
  }

  cachedMissionText_ = text;
  cachedMissionKey_ = key;
  cachedMissionAvailable_ = true;

  pendingMission_ = false;
  pendingMissionText_.clear();
  pendingMissionKey_.clear();

  missionLoaded_ = false;
  runtimeMissionLoaded_ = false;
  missionReady_ = false;
  noCachedMissionRejectActive_ = false;
  sourceMissionKey_.clear();
  plan_ = PlanInfo{};
  currentMissionIndex_ = -1;
  runtimeState_ = "mission_cached_wait_mode";

  missionFinished_ = false;
  externalInterrupted_ = false;
  externalInterruptionNeutralModeSent_ = false;
  returnToSnapshotActive_ = false;
  resumeFlowState_ = ResumeFlowState::None;
  missionSnapshot_ = MissionSnapshot{};
  preTakeoffOverrideAltitudeMsl_.reset();

  altitudeOffset_.reset();

  RCLCPP_INFO(
    node_->get_logger(),
    "Cached mission hash=%s. It will be parsed and loaded only after Adaptive Mission Mode is selected.",
    cachedMissionKey_.c_str());

  publishState();
}

bool AdaptiveMissionNode::loadCachedMissionForExecution(const char * reason)
{
  if (runtimeMissionLoaded_ && missionLoaded_) {
    return true;
  }

  if (!cachedMissionAvailable_ && pendingMissionText_.empty()) {
    runtimeState_ = "reject_no_cached_mission";

    RCLCPP_ERROR_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      3000,
      "Cannot load mission on %s: no cached mission from %s or %s",
      reason,
      missionTopic_.c_str(),
      fcMissionTopic_.c_str());

    publishState();
    return false;
  }

  const std::string text = pendingMissionText_.empty() ? cachedMissionText_ : pendingMissionText_;
  const std::string key = pendingMissionKey_.empty() ? cachedMissionKey_ : pendingMissionKey_;

  try {
    plan_ = parsePlan(text, currentAltitudeMsl());
    executor_->setMission(px4_ros2::Mission(plan_.json));

    sourceMissionKey_ = key;
    pendingMission_ = false;
    pendingMissionText_.clear();
    pendingMissionKey_.clear();

    missionLoaded_ = true;
    runtimeMissionLoaded_ = true;
    missionFinished_ = false;
    externalInterrupted_ = false;
    returnToSnapshotActive_ = false;
    resumeFlowState_ = ResumeFlowState::None;
    currentMissionIndex_ = -1;
    runtimeState_ = "mission_loaded_on_mode_select";

    missionSnapshot_ = MissionSnapshot{};
    preTakeoffOverrideAltitudeMsl_.reset();
    altitudeOffset_.reset();

    RCLCPP_INFO(
      node_->get_logger(),
      "Loaded mission on %s: src=%d exec=%d skip=%d hash=%s",
      reason,
      plan_.sourceItemCount,
      plan_.executableItemCount,
      plan_.skippedItemCount,
      plan_.hash.c_str());

    publishState();
    return true;
  } catch (const std::exception & error) {
    const std::string errorText = error.what();

    if (!hasValidNumber(currentAltitudeMsl()) && errorText.find("altitude") != std::string::npos) {
      pendingMission_ = true;
      pendingMissionText_ = text;
      pendingMissionKey_ = key;
      runtimeState_ = "waiting_alt_ref";

      RCLCPP_WARN(
        node_->get_logger(),
        "Mission waits for valid global/home MSL altitude after mode select: %s",
        error.what());

      publishState();
      return false;
    }

    missionLoaded_ = false;
    runtimeMissionLoaded_ = false;
    missionReady_ = false;
    runtimeState_ = "mission_rejected";

    RCLCPP_ERROR(node_->get_logger(), "Mission rejected on %s: %s", reason, error.what());

    publishState();
    return false;
  }
}

void AdaptiveMissionNode::clearMissionMemory(bool clearCachedMission)
{
  if (executor_) {
    executor_->abort();
  }

  resumePending_ = false;
  externalInterrupted_ = false;
  externalInterruptionNeutralModeSent_ = false;
  returnToSnapshotActive_ = false;
  resumeFlowState_ = ResumeFlowState::None;
  missionSnapshot_ = MissionSnapshot{};
  preTakeoffOverrideAltitudeMsl_.reset();

  pauseResume_.reset();
  resumeMissionJson_ = nlohmann::json::object();
  resumeInfoJson_ = nlohmann::json::object();

  pendingMission_ = false;
  pendingMissionText_.clear();
  pendingMissionKey_.clear();

  sourceMissionKey_.clear();
  plan_ = PlanInfo{};

  missionLoaded_ = false;
  runtimeMissionLoaded_ = false;
  missionReady_ = false;

  currentMissionIndex_ = -1;
  resumeIndex_ = 0;
  resumeAltitudeOffsetM_ = 0.0F;

  preTakeoffActive_ = false;
  preTakeoffSent_ = false;
  preModeSent_ = false;

  altitudeOffset_.reset();

  if (clearCachedMission) {
    cachedMissionAvailable_ = false;
    cachedMissionText_.clear();
    cachedMissionKey_.clear();
  }
}

void AdaptiveMissionNode::retryPendingMissionIfReady()
{
  if (!pendingMission_ || active_) {
    return;
  }

  if (!hasValidNumber(currentAltitudeMsl())) {
    return;
  }

  loadCachedMissionForExecution("valid altitude reference became available");
}

void AdaptiveMissionNode::requestStart(bool enabled)
{
  if (!enabled) {
    requestStop();
    return;
  }

  if (!allowActivateTopicStart_) {
    RCLCPP_WARN(
      node_->get_logger(),
      "activate=true ignored. Switch PX4 to Adaptive Mission Mode to start.");
    return;
  }

  if (!runtimeMissionLoaded_) {
    loadCachedMissionForExecution("activate topic start");
  }

  if (!missionLoaded_ || !missionReady_) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot start: mission not ready");
    return;
  }

  px4Command_->arm();
  px4Command_->setMode(static_cast<float>(executor_->id()));

  runtimeState_ = "start_request";
  publishState();
}

void AdaptiveMissionNode::requestStop()
{
  if (executor_) {
    executor_->abort();
  }

  active_ = false;
  runtimeState_ = cachedMissionAvailable_ ? "mission_cached_wait_mode" : "idle";

  clearMissionMemory(false);

  publishState();
}

bool AdaptiveMissionNode::saveResumeMission()
{
  if (!missionLoaded_) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot pause: no mission to resume");
    return false;
  }

  if (!globalPosition_ || !globalPosition_->positionValid()) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot pause: no valid global position");
    return false;
  }

  const auto position = globalPosition_->position();

  ResumeMissionRequest request;
  request.currentPlan = &plan_;
  request.pauseGlobalPosition = position;
  request.currentMissionIndex = currentMissionIndex_;
  request.altitudeOffsetM = altitudeOffset_.offsetM();

  try {
    const auto result = ResumeMissionBuilder::build(request);

    resumeMissionJson_ = result.resumeMissionJson;
    resumeInfoJson_ = result.resumeInfoJson;
    resumeIndex_ = result.resumeIndex;
    resumeAltitudeOffsetM_ = request.altitudeOffsetM;
    resumePending_ = true;

    RCLCPP_WARN(
      node_->get_logger(),
      "Pause saved resume point lat=%.7f lon=%.7f alt=%.2f m, next index=%d, baked offset=%.2f m",
      position.x(),
      position.y(),
      position.z(),
      resumeIndex_,
      resumeAltitudeOffsetM_);

    return true;
  } catch (const std::exception & error) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot save resume mission: %s", error.what());
    return false;
  }
}

bool AdaptiveMissionNode::applyResumeMission()
{
  if (!resumePending_) {
    return false;
  }

  try {
    px4_ros2::Mission mission(resumeMissionJson_);
    executor_->setMission(mission);

    plan_.json = resumeMissionJson_;
    plan_.hash = mission.checksum();
    plan_.sourceItemCount = resumeIndex_;
    plan_.executableItemCount = static_cast<int>(
      resumeMissionJson_.at("mission").at("items").size());
    plan_.skippedItemCount = 0;
    plan_.hasPreTakeoff = true;
    plan_.takeoffAltitudeMsl = resumeMissionJson_.at("pre_takeoff_alt_msl").get<double>();

    resumePending_ = false;
    altitudeOffset_.reset();
    currentMissionIndex_ = -1;
    missionLoaded_ = true;
    runtimeState_ = "continue_request";

    RCLCPP_WARN(
      node_->get_logger(),
      "Continue mission loaded resume route: return to pause point, then continue with %d remaining items",
      plan_.executableItemCount - 1);

    return true;
  } catch (const std::exception & error) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot apply resume mission: %s", error.what());
    return false;
  }
}

void AdaptiveMissionNode::requestPauseRtl()
{
  if (pauseResume_.running()) {
    RCLCPP_WARN(node_->get_logger(), "Pause request ignored: pause/continue flow is already active");
    publishState();
    return;
  }

  if (!saveResumeMission()) {
    return;
  }

  if (executor_) {
    executor_->abort();
  }

  preTakeoffActive_ = false;
  active_ = false;

  pauseResume_.startPauseRtl(node_->now());
  runtimeState_ = pauseResume_.stateName();

  RCLCPP_WARN(node_->get_logger(), "Pause RTL requested: return home, disarm after landed, then wait continue");

  px4Command_->rtl();
  publishState();
}

void AdaptiveMissionNode::requestContinueMission()
{
  if (pauseResume_.waitingContinue()) {
    if (!resumePending_) {
      RCLCPP_ERROR(node_->get_logger(), "Cannot continue: no saved resume mission");
      publishState();
      return;
    }

    if (!applyResumeMission()) {
      publishState();
      return;
    }

    if (!pauseResume_.requestContinue()) {
      RCLCPP_ERROR(node_->get_logger(), "Cannot continue: pause state is not waiting_continue");
      publishState();
      return;
    }

    pauseResume_.markResumeStarted();

    if (autoTakeoff_) {
      beginPreTakeoff("continue mission after pause RTL");
    } else {
      px4Command_->arm();
      px4Command_->setMode(static_cast<float>(executor_->id()));
      runtimeState_ = "continue_request";
      publishState();
    }

    return;
  }

  if (pauseResume_.running()) {
    RCLCPP_WARN(
      node_->get_logger(),
      "Continue ignored: pause flow is not ready yet, current phase=%s",
      pauseResume_.stateName().c_str());

    publishState();
    return;
  }

  if (resumePending_ && !applyResumeMission()) {
    publishState();
    return;
  }

  if (!missionLoaded_) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot continue: no mission loaded");
    publishState();
    return;
  }

  if (autoTakeoff_ && (needPreTakeoff() || (autoArm_ && !armed_))) {
    beginPreTakeoff("continue mission from inactive state");
    return;
  }

  px4Command_->setMode(static_cast<float>(executor_->id()));

  runtimeState_ = "continue_request";
  publishState();
}

void AdaptiveMissionNode::updatePauseResume()
{
  if (!pauseResume_.running()) {
    return;
  }

  const std::string oldState = runtimeState_;
  const bool wasWaitingContinue = pauseResume_.waitingContinue();

  PauseResumeUpdate input;
  input.armed = armed_;
  input.landed = landed_;
  input.resumeMissionPending = resumePending_;
  input.now = node_->now();

  const auto action = pauseResume_.update(input);

  if (pauseResume_.running()) {
    runtimeState_ = pauseResume_.stateName();
  }

  const bool enteredWaitingContinue = pauseResume_.waitingContinue() && !wasWaitingContinue;

  if (action.sendRtl) {
    RCLCPP_WARN(node_->get_logger(), "Pause RTL flow: resend RTL command");
    px4Command_->rtl();
  }

  if (action.sendDisarm) {
    RCLCPP_WARN(node_->get_logger(), "Pause RTL flow: landed detected, sending DISARM");
    px4Command_->disarm();
  }

  if (enteredWaitingContinue) {
    /*
     * RTL đã hạ cánh/disarm xong. Lúc này phải rời Adaptive Mission Mode
     * và đứng yên ở POSCTL cho tới khi người dùng gửi continue_mission.
     */
    RCLCPP_WARN(
      node_->get_logger(),
      "Pause RTL flow: landed/disarmed, switching to POSCTL and waiting continue_mission");

    px4Command_->posctl();
  }

  if (oldState != runtimeState_ || action.sendRtl || action.sendDisarm || enteredWaitingContinue) {
    publishState();
  }
}

void AdaptiveMissionNode::handleVehicleStatus(const px4_msgs::msg::VehicleStatus & message)
{
  navState_ = message.nav_state;
  userIntentNavState_ = message.nav_state_user_intention;
  armingState_ = message.arming_state;
  executorInCharge_ = message.executor_in_charge;
  failsafe_ = message.failsafe;

  armed_ = message.arming_state == px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED;

  registerModeIfNeeded();

  const auto modeId = executor_ ? static_cast<uint8_t>(executor_->id()) : uint8_t{};

  const bool adaptiveNavActive =
    modeRegistered_ &&
    executor_ &&
    navState_ == modeId;

  const bool adaptiveNavRisingEdge = adaptiveNavActive && !lastAdaptiveNavActive_;

  /*
   * Cập nhật edge detector ở cuối hàm, kể cả khi có return sớm.
   * Đây là điểm quan trọng để không bị resume tự động bởi nav_state_user_intention
   * hoặc trạng thái Adaptive cũ còn sót lại sau RTL/LAND.
   */
  struct LastAdaptiveNavGuard
  {
    bool & storage;
    bool value;

    ~LastAdaptiveNavGuard()
    {
      storage = value;
    }
  } lastAdaptiveNavGuard{lastAdaptiveNavActive_, adaptiveNavActive};

  /*
   * Resume sau external interruption chỉ được khởi động bằng cạnh lên thật sự
   * của nav_state Adaptive: false -> true.
   *
   * Không dùng nav_state_user_intention để resume vì PX4/QGC có thể giữ
   * user_intention cũ sau RTL/LAND. Nếu dùng user_intention, node sẽ tự ARM
   * và TAKEOFF lại dù người dùng chưa chọn Adaptive Mode lần nữa.
   */
  if (externalInterrupted_ && resumeFlowState_ == ResumeFlowState::InterruptedWaitSelection) {
    if (!adaptiveNavRisingEdge) {
      return;
    }

    if (!missionLoaded_ || !runtimeMissionLoaded_) {
      RCLCPP_ERROR_THROTTLE(
        node_->get_logger(),
        *node_->get_clock(),
        3000,
        "Cannot resume external interruption: old runtime mission is not loaded");
      return;
    }

    if (autoTakeoff_ && shouldUseSnapshotTakeoff()) {
      preTakeoffOverrideAltitudeMsl_ = missionSnapshot_.position.z();
      resumeFlowState_ = ResumeFlowState::ResumeTakeoff;
      beginPreTakeoff("selected again after external mode interruption");
      return;
    }

    beginReturnToSnapshot("selected again after external mode interruption");
    return;
  }

  const bool blockedByPauseOrFinish =
    pauseResume_.running() ||
    resumePending_ ||
    returnToSnapshotActive_ ||
    resumeFlowState_ == ResumeFlowState::ResumeTakeoff ||
    resumeFlowState_ == ResumeFlowState::WaitAdaptiveActivation ||
    resumeFlowState_ == ResumeFlowState::ReturnToSnapshot ||
    runtimeState_ == "done" ||
    runtimeState_ == "pause_wait_continue";

  if (adaptiveNavActive && blockedByPauseOrFinish && !preTakeoffActive_) {
    return;
  }

  if (!adaptiveNavActive) {
    noCachedMissionRejectActive_ = false;
  }

  if (adaptiveNavActive && !externalInterrupted_ && !active_ && !preTakeoffActive_ &&
    !runtimeMissionLoaded_)
  {
    const bool hasMissionToLoad = cachedMissionAvailable_ || !pendingMissionText_.empty();

    if (!hasMissionToLoad) {
      if (!noCachedMissionRejectActive_) {
        noCachedMissionRejectActive_ = true;
        runtimeState_ = "wait_mission_cache";

        RCLCPP_WARN(
          node_->get_logger(),
          "Adaptive Mission Mode selected but no mission is cached. Waiting for mission_json; node will stay alive and will not force POSCTL.");

        /*
         * Không gửi POSCTL khi thiếu mission.
         *
         * Lý do:
         * - Drone không phải lúc nào cũng có mission để cache sẵn.
         * - Nếu ép rời custom mode tại đây, px4_ros2 có thể không nhận request
         *   từ FMU nữa và ném exception: "Timeout, no request received from FMU".
         * - Giữ node ở trạng thái wait_mission_cache giúp mission_json tới sau
         *   vẫn được cache và load bình thường.
         */
        publishState();
      }

      return;
    }

    noCachedMissionRejectActive_ = false;
    loadCachedMissionForExecution("Adaptive Mission Mode selected");
  }

  if (adaptiveNavActive && !externalInterrupted_ && !active_ && !preTakeoffActive_ &&
    missionLoaded_ && missionReady_ && autoTakeoff_ &&
    (needPreTakeoff() || (autoArm_ && !armed_)))
  {
    beginPreTakeoff("selected by nav_state before activation");
  }

  if (adaptiveNavActive && !active_ && !preTakeoffActive_) {
    const auto now = node_->now();

    if (lastSelectWatchLog_.nanoseconds() == 0 ||
      (now - lastSelectWatchLog_).seconds() > 2.0)
    {
      lastSelectWatchLog_ = now;

      RCLCPP_WARN(
        node_->get_logger(),
        "Adaptive selected but executor is not active yet: armed=%d nav_state=%u user_intention=%u executor=%u mode_id=%u resume_flow=%s",
        armed_ ? 1 : 0,
        navState_,
        userIntentNavState_,
        executorInCharge_,
        modeId,
        resumeFlowStateName());
    }
  }
}

void AdaptiveMissionNode::handleCommandAck(const px4_msgs::msg::VehicleCommandAck & message)
{
  const bool isCommandMine =
    message.command == px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM ||
    message.command == px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_TAKEOFF ||
    message.command == px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_LAND ||
    message.command == px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE;

  if (!isCommandMine) {
    return;
  }

  const char * level = message.result == 0 ? "ACK" : "NACK";

  if (message.result == 0) {
    RCLCPP_INFO(
      node_->get_logger(),
      "%s command=%u result=%u",
      level,
      message.command,
      message.result);
  } else {
    RCLCPP_ERROR(
      node_->get_logger(),
      "%s command=%u result=%u",
      level,
      message.command,
      message.result);
  }
}

void AdaptiveMissionNode::handleVehicleLandDetected(
  const px4_msgs::msg::VehicleLandDetected & message)
{
  landed_ = message.landed;
}

void AdaptiveMissionNode::beginPreTakeoff(const char * reason)
{
  preTakeoffActive_ = true;
  preTakeoffSent_ = false;
  preModeSent_ = false;
  runtimeState_ = "pre_takeoff";

  if (!externalInterrupted_) {
    currentMissionIndex_ = -1;
  }

  lastArmCommand_ = rclcpp::Time{};
  lastTakeoffCommand_ = rclcpp::Time{};
  lastModeCommand_ = rclcpp::Time{};

  RCLCPP_WARN(
    node_->get_logger(),
    "Adaptive %s: auto ARM + MAV_CMD_NAV_TAKEOFF first",
    reason);

  publishState();
}

void AdaptiveMissionNode::updateAltitudeOffset()
{
  const bool offsetEnabled =
    active_ &&
    !returnToSnapshotActive_ &&
    armed_ &&
    manualControl_ &&
    manualControl_->isValid();

  const float oldOffset = altitudeOffset_.offsetM();

  altitudeOffset_.update(
    offsetEnabled ? manualControl_->throttle() : 0.0F,
    offsetEnabled,
    std::chrono::steady_clock::now());

  const auto now = node_->now();

  if ((altitudeOffset_.active() || oldOffset != altitudeOffset_.offsetM()) &&
    (lastAltitudeOffsetLog_.nanoseconds() == 0 ||
    (now - lastAltitudeOffsetLog_).seconds() > 1.0))
  {
    lastAltitudeOffsetLog_ = now;

    RCLCPP_INFO(
      node_->get_logger(),
      "Altitude offset %.2f m, rate %.2f m/s",
      altitudeOffset_.offsetM(),
      altitudeOffset_.rateMps());
  }
}

void AdaptiveMissionNode::updatePreTakeoff()
{
  if (!preTakeoffActive_ || !missionLoaded_ || !missionReady_) {
    return;
  }

  const auto now = node_->now();

  if (autoArm_ && !armed_) {
    if (lastArmCommand_.nanoseconds() == 0 || (now - lastArmCommand_).seconds() > 1.0) {
      lastArmCommand_ = now;
      runtimeState_ = "arming";

      RCLCPP_WARN(node_->get_logger(), "Sending arm before MAV takeoff");

      px4Command_->arm();
      publishState();
    }

    return;
  }

  const double targetAltitude = targetTakeoffAltitudeMsl();
  const double currentAltitude = currentAltitudeMsl();

  if (!hasValidNumber(targetAltitude)) {
    RCLCPP_ERROR(node_->get_logger(), "Pre-takeoff failed: no valid takeoff altitude MSL");

    preTakeoffActive_ = false;
    runtimeState_ = "idle";
    publishState();
    return;
  }

  if (hasValidNumber(currentAltitude) && currentAltitude >= targetAltitude - takeoffAcceptanceM_) {
    if (!preModeSent_ || lastModeCommand_.nanoseconds() == 0 ||
      (now - lastModeCommand_).seconds() > 1.0)
    {
      preModeSent_ = true;
      lastModeCommand_ = now;

      if (externalInterrupted_ && resumeFlowState_ == ResumeFlowState::ResumeTakeoff) {
        resumeFlowState_ = ResumeFlowState::WaitAdaptiveActivation;
      }

      runtimeState_ = "select_adaptive_after_takeoff";

      RCLCPP_WARN(node_->get_logger(), "Takeoff done, selecting Adaptive Mission Mode again");

      px4Command_->setMode(static_cast<float>(executor_->id()));
      publishState();
    }

    return;
  }

  if (!preTakeoffSent_ || lastTakeoffCommand_.nanoseconds() == 0 ||
    (now - lastTakeoffCommand_).seconds() > 2.0)
  {
    float latitude = Px4CommandClient::nan();
    float longitude = Px4CommandClient::nan();

    if (globalPosition_ && globalPosition_->positionValid()) {
      const auto position = globalPosition_->position();
      latitude = static_cast<float>(position.x());
      longitude = static_cast<float>(position.y());
    }

    preTakeoffSent_ = true;
    lastTakeoffCommand_ = now;
    runtimeState_ = "mav_takeoff";

    RCLCPP_WARN(
      node_->get_logger(),
      "Sending MAV_CMD_NAV_TAKEOFF to %.2f m AMSL",
      targetAltitude);

    px4Command_->takeoff(static_cast<float>(targetAltitude), latitude, longitude);
    publishState();
  }
}

bool AdaptiveMissionNode::needPreTakeoff() const
{
  if (preTakeoffOverrideAltitudeMsl_) {
    const double currentAltitude = currentAltitudeMsl();

    return !hasValidNumber(currentAltitude) ||
      currentAltitude < *preTakeoffOverrideAltitudeMsl_ - takeoffAcceptanceM_;
  }

  if (!plan_.hasPreTakeoff) {
    return false;
  }

  const double targetAltitude = targetTakeoffAltitudeMsl();
  const double currentAltitude = currentAltitudeMsl();

  return hasValidNumber(targetAltitude) &&
    (!hasValidNumber(currentAltitude) || currentAltitude < targetAltitude - takeoffAcceptanceM_);
}

double AdaptiveMissionNode::targetTakeoffAltitudeMsl() const
{
  if (preTakeoffOverrideAltitudeMsl_) {
    return *preTakeoffOverrideAltitudeMsl_;
  }

  if (plan_.takeoffAltitudeMsl) {
    return *plan_.takeoffAltitudeMsl;
  }

  if (plan_.json.contains("mission") && plan_.json.at("mission").contains("items")) {
    for (const auto & item : plan_.json.at("mission").at("items")) {
      if (item.value("type", "") == "navigation" &&
        item.contains("z") &&
        item.at("z").is_number())
      {
        return item.at("z").get<double>();
      }
    }
  }

  return std::numeric_limits<double>::quiet_NaN();
}

double AdaptiveMissionNode::currentAltitudeMsl() const
{
  if (globalPosition_ && globalPosition_->positionValid()) {
    return globalPosition_->position().z();
  }

  return std::numeric_limits<double>::quiet_NaN();
}

nlohmann::json AdaptiveMissionNode::buildResumeStateJson() const
{
  if (!resumePending_) {
    return {{"pending", false}};
  }

  auto resume = resumeInfoJson_;
  resume["pending"] = true;

  return resume;
}

nlohmann::json AdaptiveMissionNode::buildMissionItemStateJson(int index) const
{
  nlohmann::json output{
    {"index", index},
    {"active", index == currentMissionIndex_},
    {"done", currentMissionIndex_ >= 0 && index < currentMissionIndex_}};

  if (!plan_.json.contains("mission") || !plan_.json.at("mission").contains("items")) {
    output["valid"] = false;
    return output;
  }

  const auto & items = plan_.json.at("mission").at("items");

  if (!items.is_array() || index < 0 || index >= static_cast<int>(items.size())) {
    output["valid"] = false;
    return output;
  }

  const auto & item = items.at(index);

  output["valid"] = true;
  output["type"] = item.value("type", "unknown");

  if (item.contains("id")) {
    output["id"] = item.at("id");
  }

  if (item.value("type", "") == "navigation") {
    const double altitude = item.value("z", 0.0);

    output["target"] = {
      {"lat", item.value("x", 0.0)},
      {"lon", item.value("y", 0.0)},
      {"z_msl", altitude},
      {"z_with_offset_msl", altitude + altitudeOffset_.offsetM()},
      {"altitude_offset_m", altitudeOffset_.offsetM()}};
  }

  if (item.contains("altitude")) {
    const double altitude = item.at("altitude").get<double>();

    output["target"] = {
      {"z_msl", altitude},
      {"z_with_offset_msl", altitude + altitudeOffset_.offsetM()},
      {"altitude_offset_m", altitudeOffset_.offsetM()}};
  }

  return output;
}

nlohmann::json AdaptiveMissionNode::buildMissionItemsStateJson() const
{
  nlohmann::json output = nlohmann::json::array();

  const int itemCount = plan_.json.contains("executable_item_count") ?
    plan_.json.at("executable_item_count").get<int>() :
    0;

  for (int index = 0; index < itemCount; ++index) {
    output.push_back(buildMissionItemStateJson(index));
  }

  return output;
}

nlohmann::json AdaptiveMissionNode::buildMissionSummaryJson() const
{
  nlohmann::json mission{
    {"hash", plan_.hash},
    {"source_format", plan_.json.value("source_format", "none")},
    {"source_item_count", plan_.sourceItemCount},
    {"executable_item_count", plan_.executableItemCount},
    {"skipped_item_count", plan_.skippedItemCount},
    {"pre_takeoff", plan_.hasPreTakeoff},
    {"current_item", buildMissionItemStateJson(currentMissionIndex_)}};

  if (publishFullItemList_) {
    mission["items"] = buildMissionItemsStateJson();
  } else {
    mission["items_omitted"] = true;
  }

  return mission;
}

nlohmann::json AdaptiveMissionNode::buildStateJson() const
{
  nlohmann::json state;

  state["state"] = runtimeState_;
  state["mission_cached"] = cachedMissionAvailable_;
  state["mission_cached_hash"] = cachedMissionAvailable_ ?
    nlohmann::json(cachedMissionKey_) :
    nlohmann::json(nullptr);
  state["mission_loaded"] = missionLoaded_;
  state["mission_runtime_loaded"] = runtimeMissionLoaded_;
  state["mission_ready"] = missionLoaded_ && missionReady_;
  state["mission_pending_alt_ref"] = pendingMission_;

  state["px4_mode_registered"] = modeRegistered_;
  state["px4_mode_id"] = static_cast<int>(executor_->id());
  state["fmu_topics_visible"] = fmuTopicsVisible();

  state["mavlink_target"] = {
    {"target_system", commandTarget_.targetSystem},
    {"target_component", commandTarget_.targetComponent},
    {"source_system", commandTarget_.sourceSystem},
    {"source_component", commandTarget_.sourceComponent}};

  state["active"] = active_;
  state["mission_finished"] = missionFinished_;
  state["external_interrupted"] = externalInterrupted_;
  state["resume_flow_state"] = resumeFlowStateName();
  state["return_to_snapshot_active"] = returnToSnapshotActive_;
  state["mission_control_blocked"] = missionControlBlocked();
  state["selected_by_status"] = modeRegistered_ && executor_ &&
    executorInCharge_ == static_cast<uint8_t>(executor_->id());
  state["selected_by_user_intention"] = modeRegistered_ && executor_ &&
    userIntentNavState_ == static_cast<uint8_t>(executor_->id());
  state["selected_by_nav_state"] = modeRegistered_ && executor_ &&
    navState_ == static_cast<uint8_t>(executor_->id());

  state["armed"] = armed_;
  state["landed"] = landed_;
  state["nav_state"] = navState_;
  state["nav_state_user_intention"] = userIntentNavState_;
  state["arming_state"] = armingState_;
  state["executor_in_charge"] = executorInCharge_;
  state["failsafe"] = failsafe_;

  state["pre_takeoff_active"] = preTakeoffActive_;
  state["pre_takeoff_sent"] = preTakeoffSent_;
  state["pre_takeoff_alt_msl"] = hasValidNumber(targetTakeoffAltitudeMsl()) ?
    nlohmann::json(targetTakeoffAltitudeMsl()) :
    nlohmann::json(nullptr);
  state["pre_takeoff_override_alt_msl"] = preTakeoffOverrideAltitudeMsl_ ?
    nlohmann::json(*preTakeoffOverrideAltitudeMsl_) :
    nlohmann::json(nullptr);

  state["pause_resume"] = pauseResume_.toJson();
  state["pause_rtl_resume"] = buildResumeStateJson();

  state["mission_snapshot"] = {
    {"valid", missionSnapshot_.valid},
    {"mission_index", missionSnapshot_.missionIndex},
    {"mission_hash", missionSnapshot_.missionHash},
    {"altitude_offset_m", missionSnapshot_.altitudeOffsetM}};

  if (missionSnapshot_.valid) {
    state["mission_snapshot"]["lat"] = missionSnapshot_.position.x();
    state["mission_snapshot"]["lon"] = missionSnapshot_.position.y();
    state["mission_snapshot"]["alt_msl"] = missionSnapshot_.position.z();
  }

  state["current_index"] = currentMissionIndex_;
  state["altitude_offset_m"] = altitudeOffset_.offsetM();
  state["altitude_offset_rate_m_s"] = altitudeOffset_.rateMps();
  state["altitude_offset_active"] = altitudeOffset_.active();

  state["mission"] = buildMissionSummaryJson();

  if (plan_.json.contains("remote_opaque_id")) {
    state["mission"]["remote_opaque_id"] = plan_.json.at("remote_opaque_id");
  }

  if (plan_.json.contains("source_hash")) {
    state["mission"]["source_hash"] = plan_.json.at("source_hash");
  }

  if (plan_.json.contains("skipped_source_items")) {
    state["mission"]["skipped_source_items"] = plan_.json.at("skipped_source_items");
  }

  if (globalPosition_ && globalPosition_->positionValid()) {
    const auto position = globalPosition_->position();

    state["vehicle"] = {
      {"global_position_valid", true},
      {"lat", position.x()},
      {"lon", position.y()},
      {"alt_msl", position.z()}};
  } else {
    state["vehicle"] = {{"global_position_valid", false}};
  }

  return state;
}

void AdaptiveMissionNode::publishState()
{
  if (!statePublisher_) {
    return;
  }

  std_msgs::msg::String message;

  try {
    message.data = buildStateJson().dump();
  } catch (const std::exception & error) {
    message.data = nlohmann::json{
      {"state", runtimeState_},
      {"state_error", error.what()}}.dump();
  }

  statePublisher_->publish(message);
}

}  // namespace adaptive_mission_mode
