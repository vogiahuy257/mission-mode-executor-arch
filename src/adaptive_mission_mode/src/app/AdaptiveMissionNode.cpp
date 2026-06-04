#include "adaptive_mission_mode/app/AdaptiveMissionNode.hpp"

#include <algorithm>
#include <chrono>
#include <cmath>
#include <limits>
#include <optional>
#include <utility>
#include <vector>

#include <px4_ros2/mission/mission.hpp>
#include <px4_ros2/utils/message_version.hpp>

#include "adaptive_mission_mode/mission/MissionParser.hpp"

using namespace std::chrono_literals;

namespace adaptive_mission_mode
{
namespace
{
constexpr char kDefaultMissionTopic[] = "~/mission_json";
constexpr char kDefaultFcMissionTopic[] = "/fc_mission_reader/mission_json";

constexpr double kEarthRadiusM = 6371000.0;
constexpr double kPi = 3.14159265358979323846;

bool hasValidNumber(double value)
{
  return std::isfinite(value);
}

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

/**
 * @brief Đọc toàn bộ cấu hình ROS param của node.
 *
 * Logic:
 * - Mission chỉ được cache từ mission_topic/fc_mission_topic.
 * - Mission chỉ được parse/load khi user chọn Adaptive Mode hoặc activate topic được bật.
 * - Các tham số snapshot_return_* giữ lại cho luồng legacy/fallback, resume chính dùng waypoint chèn.
 */
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

/**
 * @brief Tạo các object runtime chính.
 *
 * Logic:
 * - AdaptiveMissionExecutor chạy mission px4_ros2.
 * - Mission executor nhận callback missionControlBlocked() để dừng setpoint mission trong PRE_TAKEOFF/RETURN_TO_SNAPSHOT.
 * - snapshotGotoSetpoint_ chỉ giữ cho luồng legacy/fallback; resume chính tạo mission mới có waypoint chèn.
 */
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
      adaptiveModeActive_ = true;
      modeActivatedEvent_ = true;
    });

  executor_->onDeactivated(
    [this]()
    {
      adaptiveModeActive_ = false;
      modeDeactivatedEvent_ = true;
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
      missionCompletedEvent_ = true;
    });
}

/**
 * @brief Tạo publisher/subscriber ROS2.
 *
 * Logic:
 * - Callback chỉ cập nhật dữ liệu hoặc đẩy event.
 * - Không gửi ARM/TAKEOFF/SET_MODE trực tiếp trong callback.
 * - Quyết định điều khiển được gom trong mainLoop()/RuntimeState.
 */
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

/**
 * @brief Tạo một main loop duy nhất.
 *
 * Logic:
 * - Chỉ có mainLoop() được quyết định gửi command PX4.
 * - Callback chỉ cập nhật dữ liệu/event.
 */
void AdaptiveMissionNode::createTimers()
{
  mainLoopTimer_ = node_->create_wall_timer(
    50ms,
    [this]() { mainLoop(); });
}

/**
 * @brief Vòng lặp runtime chính.
 *
 * Thứ tự xử lý cố định:
 * 1. Register custom mode nếu FMU sẵn sàng.
 * 2. Cập nhật altitude offset.
 * 3. Lưu snapshot khi đang RUNNING.
 * 4. Xử lý event từ callback.
 * 5. Cập nhật state machine và gửi command nếu cần.
 * 6. Publish state có throttle.
 */
void AdaptiveMissionNode::mainLoop()
{
  registerModeIfNeeded();
  updateAltitudeOffset();
  updateMissionSnapshot();
  processRuntimeEvents();
  updateRuntimeState();
  publishStateThrottled();
}

/**
 * @brief Xử lý các event đã được callback ghi lại.
 */
void AdaptiveMissionNode::processRuntimeEvents()
{
  if (missionCompletedEvent_) {
    missionCompletedEvent_ = false;
    handleMissionCompleted();
    return;
  }

  if (resumeRequiresFreshAdaptiveSelection_ &&
    (modeActivatedEvent_ || adaptiveRisingEdge_ || adaptiveModeSelected() || adaptiveModeActive_))
  {
    modeActivatedEvent_ = false;
    adaptiveRisingEdge_ = false;

    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      3000,
      "Adaptive activation ignored after external RTL/LAND completion. Holding POSCTL until a fresh Adaptive selection.");

    if (landed_ && armed_) {
      sendDisarmThrottled();
    }

    posctlSentForCurrentState_ = false;
    sendPosctlOnce();
    externalLandingPosctlSent_ = true;
    return;
  }

  if (modeDeactivatedEvent_) {
    modeDeactivatedEvent_ = false;
    adaptiveFallingEdge_ = false;

    if (state_ == RuntimeState::Running || state_ == RuntimeState::ReturnToSnapshot) {
      if (missionLoaded_ && runtimeMissionLoaded_ && !missionFinished_) {
        if (!prepareResumeMissionFromInterruptPoint()) {
          enterState(RuntimeState::Error, "Cannot prepare resume mission from interrupt point");
          return;
        }

        enterState(RuntimeState::ExternalInterruptedWaitSelection, "Adaptive Mode deactivated during mission");
      }
    }
  }

  if (modeActivatedEvent_) {
    modeActivatedEvent_ = false;

    if (state_ == RuntimeState::WaitAdaptiveActivation) {
      enterState(RuntimeState::Running, "Adaptive Mode activated");
      return;
    }

    if (state_ == RuntimeState::WaitAdaptiveActivationForResume) {
      enterState(RuntimeState::Running, "Adaptive Mode activated, resume mission starts from inserted interrupt waypoint");
      return;
    }

    if (state_ == RuntimeState::ExternalInterruptedWaitSelection) {
      adaptiveRisingEdge_ = true;
    }

    if (state_ == RuntimeState::NoMissionStandby) {
      RCLCPP_WARN_THROTTLE(
        node_->get_logger(),
        *node_->get_clock(),
        3000,
        "Adaptive Mode is active but no mission is cached. Waiting for mission_json.");
    }
  }

  if (!adaptiveRisingEdge_) {
    return;
  }

  adaptiveRisingEdge_ = false;

  if (state_ == RuntimeState::ExternalInterruptedWaitSelection) {
    resumeRequiresFreshAdaptiveSelection_ = false;
    externalLandingPosctlSent_ = false;
    externalLandingParked_ = false;

    if (!missionSnapshot_.valid) {
      enterState(RuntimeState::Error, "Cannot resume: no inserted interrupt waypoint");
      return;
    }

    const double resumeTakeoffAltitudeMsl = missionSnapshot_.position.z();

    if (!missionReady_) {
      enterState(RuntimeState::LoadingMission, "Waiting inserted resume mission readiness");
      return;
    }

    if (autoTakeoff_ && needPreTakeoff(resumeTakeoffAltitudeMsl)) {
      enterPreTakeoff("Adaptive selected again after external interruption", resumeTakeoffAltitudeMsl);
    } else if (adaptiveModeActive_ || adaptiveModeSelected()) {
      enterState(RuntimeState::Running, "Adaptive selected again, resume mission starts from inserted interrupt waypoint");
    } else {
      enterState(RuntimeState::WaitAdaptiveActivationForResume, "Waiting Adaptive activation for inserted resume mission");
      sendAdaptiveModeThrottled();
    }

    return;
  }

  if (!cachedMissionAvailable_ && pendingMissionText_.empty() && !runtimeMissionLoaded_) {
    enterState(RuntimeState::NoMissionStandby, "Adaptive selected without cached mission");

    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      3000,
      "Adaptive Mode selected but no mission is cached. Publish mission_json or run fc_mission_reader.");

    return;
  }

  if (!runtimeMissionLoaded_) {
    enterState(RuntimeState::LoadingMission, "Adaptive selected with cached mission");

    if (!loadCachedMissionForExecution("Adaptive Mode selected")) {
      return;
    }
  }

  /*
   * MissionExecutor có thể cập nhật missionReady_ trễ hơn setMission().
   * Vì vậy không coi missionReady=false ngay sau setMission là lỗi.
   * State LoadingMission sẽ tự chuyển tiếp khi onReadynessUpdate báo ready.
   */
  enterState(RuntimeState::LoadingMission, "Waiting mission readiness");
}

/**
 * @brief Cập nhật state machine và gửi command PX4 nếu state cần command.
 */
void AdaptiveMissionNode::updateRuntimeState()
{
  switch (state_) {
    case RuntimeState::NoMissionStandby:
      /*
       * Không có mission thì không giữ UAV trong custom mode.
       * Chỉ gửi POSCTL một lần để rời Adaptive an toàn, không spam command.
       */
      sendPosctlOnce();
      break;

    case RuntimeState::LoadingMission:
      if (missionLoaded_ && missionReady_) {
        double takeoffAltitudeMsl = targetTakeoffAltitudeMsl();

        if (plan_.json.contains("resume_from_interrupt") &&
          plan_.json.at("resume_from_interrupt").is_object() &&
          plan_.json.at("resume_from_interrupt").contains("alt_msl") &&
          plan_.json.at("resume_from_interrupt").at("alt_msl").is_number())
        {
          takeoffAltitudeMsl = plan_.json.at("resume_from_interrupt").at("alt_msl").get<double>();
        }

        if (autoTakeoff_ && ((autoArm_ && !armed_) || needPreTakeoff(takeoffAltitudeMsl))) {
          enterPreTakeoff("Mission ready", std::nullopt);
        } else if (adaptiveModeActive_ || adaptiveModeSelected()) {
          enterState(RuntimeState::Running, "Mission ready and Adaptive Mode active");
        } else {
          enterState(RuntimeState::WaitAdaptiveActivation, "Mission ready, waiting Adaptive activation");
          sendAdaptiveModeThrottled();
        }
      }
      break;

    case RuntimeState::PreTakeoff:
    case RuntimeState::ResumeTakeoff:
      updatePreTakeoff();
      break;

    case RuntimeState::WaitAdaptiveActivation:
    case RuntimeState::WaitAdaptiveActivationForResume:
      updateWaitAdaptiveActivation();
      break;

    case RuntimeState::ExternalInterruptedWaitSelection:
      updateExternalInterruptedWaitSelection();
      break;

    case RuntimeState::ReturnToSnapshot:
      updateReturnToSnapshot();
      break;

    default:
      break;
  }
}

/**
 * @brief Đổi state runtime có log và reset throttle command cần thiết.
 */
void AdaptiveMissionNode::enterState(RuntimeState nextState, const char * reason)
{
  if (state_ == nextState) {
    return;
  }

  state_ = nextState;
  posctlSentForCurrentState_ = false;

  if (state_ != RuntimeState::PreTakeoff && state_ != RuntimeState::ResumeTakeoff) {
    preTakeoffOverrideAltitudeMsl_.reset();
  }

  if (state_ != RuntimeState::ReturnToSnapshot) {
    lastReturnToSnapshotLog_ = rclcpp::Time{};
  }

  RCLCPP_WARN(
    node_->get_logger(),
    "Runtime state -> %s (%s)",
    runtimeStateName(),
    reason);

  publishState();
}

/**
 * @brief Bắt đầu auto ARM/TAKEOFF.
 *
 * Nếu overrideAltitudeMsl có giá trị, đây là resume/takeoff tới độ cao cần khôi phục.
 * Nếu không có, dùng altitude takeoff của mission.
 */
void AdaptiveMissionNode::enterPreTakeoff(
  const char * reason,
  std::optional<double> overrideAltitudeMsl)
{
  preTakeoffOverrideAltitudeMsl_ = overrideAltitudeMsl;
  resetCommandTimers();

  if (overrideAltitudeMsl) {
    enterState(RuntimeState::ResumeTakeoff, reason);
  } else {
    enterState(RuntimeState::PreTakeoff, reason);
  }
}

/**
 * @brief Bắt đầu bay về snapshot.
 */
void AdaptiveMissionNode::enterReturnToSnapshot(const char * reason)
{
  if (!missionSnapshot_.valid) {
    enterState(RuntimeState::Error, "Cannot return to snapshot: no valid snapshot");
    return;
  }

  resetCommandTimers();
  enterState(RuntimeState::ReturnToSnapshot, reason);
}


/**
 * @brief Lấy vị trí global hiện tại của UAV theo MSL.
 */
std::optional<Eigen::Vector3d> AdaptiveMissionNode::currentGlobalPositionMsl() const
{
  if (globalPosition_ && globalPosition_->positionValid()) {
    return globalPosition_->position();
  }

  return std::nullopt;
}

/**
 * @brief Tạo mission resume bằng cách chèn waypoint tại điểm bị ngắt.
 *
 * Logic:
 * - Gọi ngay khi phát hiện nav_state rời Adaptive trong lúc mission đang chạy.
 * - Lấy tọa độ UAV hiện tại tại thời điểm bị ngắt.
 * - Tạo mission runtime mới: [điểm_bị_ngắt] + [item đang làm dở] + [các item còn lại].
 * - Không đụng cache mission gốc, chỉ thay mission runtime của executor.
 *
 * Output:
 * - true nếu đã setMission thành công.
 * - false nếu thiếu global position hoặc mission hiện tại không hợp lệ.
 */
bool AdaptiveMissionNode::prepareResumeMissionFromInterruptPoint()
{
  const auto interruptPosition = currentGlobalPositionMsl();

  if (!interruptPosition && !missionSnapshot_.valid) {
    RCLCPP_ERROR(
      node_->get_logger(),
      "Cannot prepare resume mission: no valid global position and no last mission snapshot");
    return false;
  }

  const Eigen::Vector3d resumePosition = interruptPosition.value_or(missionSnapshot_.position);

  if (!plan_.json.contains("mission") ||
    !plan_.json.at("mission").is_object() ||
    !plan_.json.at("mission").contains("items") ||
    !plan_.json.at("mission").at("items").is_array())
  {
    RCLCPP_ERROR(node_->get_logger(), "Cannot prepare resume mission: invalid mission JSON");
    return false;
  }

  const auto & oldItems = plan_.json.at("mission").at("items");

  if (oldItems.empty()) {
    RCLCPP_ERROR(node_->get_logger(), "Cannot prepare resume mission: empty mission items");
    return false;
  }

  const int originalIndex = currentMissionIndex_ < 0 ? 0 : currentMissionIndex_;
  int startIndex = originalIndex;

  if (startIndex < 0) {
    startIndex = 0;
  }

  if (startIndex >= static_cast<int>(oldItems.size())) {
    startIndex = static_cast<int>(oldItems.size()) - 1;
  }

  const float resumeAltitudeOffsetM = altitudeOffset_.offsetM();
  const double resumeWaypointAltitudeMsl =
    resumePosition.z() - static_cast<double>(resumeAltitudeOffsetM);

  nlohmann::json resumeWaypoint = {
    {"type", "navigation"},
    {"navigationType", "waypoint"},
    {"frame", "global"},
    {"id", std::string("resume_interrupt_point_") + std::to_string(node_->now().nanoseconds())},
    {"x", resumePosition.x()},
    {"y", resumePosition.y()},
    {"z", resumeWaypointAltitudeMsl},
    {"resume_inserted", true},
    {"resume_original_index", originalIndex},
    {"resume_original_hash", plan_.hash}
  };

  nlohmann::json newItems = nlohmann::json::array();
  newItems.push_back(resumeWaypoint);

  for (int index = startIndex; index < static_cast<int>(oldItems.size()); ++index) {
    newItems.push_back(oldItems.at(index));
  }

  nlohmann::json resumeJson = plan_.json;
  resumeJson["mission"]["items"] = newItems;
  resumeJson["source_format"] = "adaptive_resume_inserted_interrupt_waypoint";
  resumeJson["source_item_count"] = newItems.size();
  resumeJson["resume_from_interrupt"] = {
    {"enabled", true},
    {"original_hash", plan_.hash},
    {"original_index", originalIndex},
    {"resume_start_index", startIndex},
    {"lat", resumePosition.x()},
    {"lon", resumePosition.y()},
    {"alt_msl", resumePosition.z()},
    {"waypoint_z_msl_without_offset", resumeWaypointAltitudeMsl},
    {"altitude_offset_m", resumeAltitudeOffsetM},
    {"used_live_global_position", interruptPosition.has_value()}
  };

  try {
    plan_ = parsePlan(resumeJson.dump(), resumePosition.z());
    executor_->setMission(px4_ros2::Mission(plan_.json));

    missionLoaded_ = true;
    runtimeMissionLoaded_ = true;
    missionReady_ = false;
    missionFinished_ = false;
    currentMissionIndex_ = -1;

    missionSnapshot_.valid = true;
    missionSnapshot_.position = resumePosition;
    missionSnapshot_.missionIndex = originalIndex;
    missionSnapshot_.altitudeOffsetM = resumeAltitudeOffsetM;
    missionSnapshot_.missionHash = plan_.hash;

    preTakeoffOverrideAltitudeMsl_.reset();

    RCLCPP_WARN(
      node_->get_logger(),
      "Resume mission prepared: inserted interrupt waypoint lat=%.7f lon=%.7f alt=%.2f before old index=%d, new_exec_count=%d",
      resumePosition.x(),
      resumePosition.y(),
      resumePosition.z(),
      startIndex,
      plan_.executableItemCount);

    publishState();
    return true;
  } catch (const std::exception & error) {
    RCLCPP_ERROR(
      node_->get_logger(),
      "Failed to prepare resume mission from interrupt point: %s",
      error.what());
    return false;
  }
}

/**
 * @brief Mission hoàn thành: xóa cache/runtime/snapshot và chuyển POSCTL một lần.
 */
void AdaptiveMissionNode::handleMissionCompleted()
{
  missionFinished_ = true;
  clearMissionMemory(true);
  enterState(RuntimeState::Completed, "Mission completed");
  sendPosctlOnce();

  RCLCPP_WARN(
    node_->get_logger(),
    "Mission completed. Mission cache/runtime/snapshot cleared.");
}

/**
 * @brief Register Adaptive Mission Mode khi FMU DDS đã xuất hiện.
 */
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

/**
 * @brief Cache mission JSON thô.
 *
 * Logic:
 * - Nếu mission đang chạy thì bỏ qua mission mới; reset bằng ~/reset trước nếu muốn thay mission.
 * - Nếu mission chưa chạy thì lưu text, chưa parse, chưa setMission.
 */
void AdaptiveMissionNode::cacheMissionText(const std::string & text)
{
  if (!canAcceptNewMission()) {
    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      3000,
      "Mission message ignored because a runtime mission is active. Use ~/reset before loading a new mission.");
    return;
  }

  const std::string key = missionKey(text);

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
  missionFinished_ = false;
  resumeRequiresFreshAdaptiveSelection_ = false;
  externalLandingPosctlSent_ = false;
  externalLandingParked_ = false;

  plan_ = PlanInfo{};
  currentMissionIndex_ = -1;
  missionSnapshot_ = MissionSnapshot{};

  altitudeOffset_.reset();

  enterState(RuntimeState::MissionCachedWaitMode, "Mission JSON cached");

  RCLCPP_INFO(
    node_->get_logger(),
    "Cached mission hash=%s. Select Adaptive Mission Mode to load and execute it.",
    cachedMissionKey_.c_str());
}

/**
 * @brief Parse mission cache và set vào executor.
 */
bool AdaptiveMissionNode::loadCachedMissionForExecution(const char * reason)
{
  if (runtimeMissionLoaded_ && missionLoaded_) {
    return true;
  }

  if (!cachedMissionAvailable_ && pendingMissionText_.empty()) {
    enterState(RuntimeState::NoMissionStandby, "Cannot load mission: no cache");
    return false;
  }

  const std::string text = pendingMissionText_.empty() ? cachedMissionText_ : pendingMissionText_;
  const std::string key = pendingMissionKey_.empty() ? cachedMissionKey_ : pendingMissionKey_;

  try {
    plan_ = parsePlan(text, currentAltitudeMsl());
    executor_->setMission(px4_ros2::Mission(plan_.json));

    pendingMission_ = false;
    pendingMissionText_.clear();
    pendingMissionKey_.clear();

    missionLoaded_ = true;
    runtimeMissionLoaded_ = true;
    missionFinished_ = false;
    resumeRequiresFreshAdaptiveSelection_ = false;
    externalLandingPosctlSent_ = false;
    externalLandingParked_ = false;
    currentMissionIndex_ = -1;
    cachedMissionKey_ = key;

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

    if (!hasValidCurrentAltitude() && errorText.find("altitude") != std::string::npos) {
      pendingMission_ = true;
      pendingMissionText_ = text;
      pendingMissionKey_ = key;

      enterState(RuntimeState::MissionCachedWaitMode, "Waiting valid altitude reference");

      RCLCPP_WARN(
        node_->get_logger(),
        "Mission waits for valid global/home MSL altitude: %s",
        error.what());

      return false;
    }

    missionLoaded_ = false;
    runtimeMissionLoaded_ = false;
    missionReady_ = false;

    enterState(RuntimeState::Error, "Mission rejected");

    RCLCPP_ERROR(node_->get_logger(), "Mission rejected on %s: %s", reason, error.what());
    return false;
  }
}

/**
 * @brief Xóa mission runtime/cache/snapshot.
 */
void AdaptiveMissionNode::clearMissionMemory(bool clearCachedMission)
{
  if (executor_) {
    executor_->abort();
  }

  pendingMission_ = false;
  pendingMissionText_.clear();
  pendingMissionKey_.clear();

  plan_ = PlanInfo{};
  missionLoaded_ = false;
  runtimeMissionLoaded_ = false;
  missionReady_ = false;
  currentMissionIndex_ = -1;
  resumeRequiresFreshAdaptiveSelection_ = false;
  externalLandingPosctlSent_ = false;
  externalLandingParked_ = false;

  missionSnapshot_ = MissionSnapshot{};
  preTakeoffOverrideAltitudeMsl_.reset();
  altitudeOffset_.reset();

  if (clearCachedMission) {
    cachedMissionAvailable_ = false;
    cachedMissionText_.clear();
    cachedMissionKey_.clear();
  }
}

/**
 * @brief Start bằng topic ~/activate nếu được bật trong config.
 */
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

  adaptiveRisingEdge_ = true;
}

/**
 * @brief Stop runtime mission nhưng giữ cache mission.
 */
void AdaptiveMissionNode::requestStop()
{
  clearMissionMemory(false);

  if (cachedMissionAvailable_) {
    enterState(RuntimeState::MissionCachedWaitMode, "Stop requested, mission cache kept");
  } else {
    enterState(RuntimeState::Idle, "Stop requested");
  }
}

/**
 * @brief Reset toàn bộ bằng topic ~/reset.
 */
void AdaptiveMissionNode::requestReset()
{
  missionFinished_ = false;
  clearMissionMemory(true);
  enterState(RuntimeState::Idle, "Reset requested");
  sendPosctlOnce();

  RCLCPP_WARN(node_->get_logger(), "Mission memory reset by ~/reset topic");
}

/**
 * @brief Cập nhật VehicleStatus và phát hiện cạnh lên/cạnh xuống Adaptive Mode.
 *
 * Lưu ý:
 * - Không dùng nav_state_user_intention để auto start/resume.
 * - user_intention chỉ publish ra state để debug.
 */
void AdaptiveMissionNode::handleVehicleStatus(const px4_msgs::msg::VehicleStatus & message)
{
  navState_ = message.nav_state;
  userIntentNavState_ = message.nav_state_user_intention;
  armingState_ = message.arming_state;
  executorInCharge_ = message.executor_in_charge;
  failsafe_ = message.failsafe;
  armed_ = message.arming_state == px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED;

  const bool selectedNow = adaptiveModeSelected();
  const bool risingEdge = selectedNow && !adaptiveSelectedLast_;
  const bool fallingEdge = !selectedNow && adaptiveSelectedLast_;

  adaptiveSelectedNow_ = selectedNow;
  adaptiveRisingEdge_ = adaptiveRisingEdge_ || risingEdge;
  adaptiveFallingEdge_ = adaptiveFallingEdge_ || fallingEdge;
  adaptiveSelectedLast_ = selectedNow;

  if (fallingEdge) {
    modeDeactivatedEvent_ = true;
  }
}

/**
 * @brief Log ACK/NACK các command do node gửi.
 */
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

/**
 * @brief Cập nhật landed flag từ PX4.
 */
void AdaptiveMissionNode::handleVehicleLandDetected(
  const px4_msgs::msg::VehicleLandDetected & message)
{
  landed_ = message.landed;

  if (landed_ &&
    state_ == RuntimeState::ExternalInterruptedWaitSelection &&
    !externalLandingParked_)
  {
    resumeRequiresFreshAdaptiveSelection_ = true;
    externalLandingPosctlSent_ = false;
    posctlSentForCurrentState_ = false;
    adaptiveRisingEdge_ = false;
    modeActivatedEvent_ = false;
  }
}

/**
 * @brief Lưu snapshot vị trí khi mission đang RUNNING.
 */
void AdaptiveMissionNode::updateMissionSnapshot()
{
  if (state_ != RuntimeState::Running) {
    return;
  }

  if (!adaptiveModeSelected()) {
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
 * @brief Cập nhật offset độ cao theo cần ga.
 */
void AdaptiveMissionNode::updateAltitudeOffset()
{
  const bool offsetEnabled =
    state_ == RuntimeState::Running &&
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

/**
 * @brief State PRE_TAKEOFF/RESUME_TAKEOFF.
 */
void AdaptiveMissionNode::updatePreTakeoff()
{
  if (!missionLoaded_ || !missionReady_) {
    return;
  }

  if (autoArm_ && !armed_) {
    sendArmThrottled();
    return;
  }

  const double targetAltitudeMsl = activePreTakeoffTargetAltitudeMsl();

  if (!hasValidNumber(targetAltitudeMsl)) {
    enterState(RuntimeState::Error, "Pre-takeoff failed: invalid target altitude");
    return;
  }

  if (needPreTakeoff(targetAltitudeMsl)) {
    sendTakeoffThrottled(targetAltitudeMsl);
    return;
  }

  if (state_ == RuntimeState::ResumeTakeoff) {
    enterState(RuntimeState::WaitAdaptiveActivationForResume, "Resume takeoff reached target altitude");
  } else {
    enterState(RuntimeState::WaitAdaptiveActivation, "Pre-takeoff reached target altitude");
  }

  sendAdaptiveModeThrottled();
}

/**
 * @brief State WAIT_ADAPTIVE_ACTIVATION*.
 */
void AdaptiveMissionNode::updateWaitAdaptiveActivation()
{
  if (adaptiveModeActive_ || adaptiveModeSelected()) {
    if (state_ == RuntimeState::WaitAdaptiveActivationForResume) {
      enterState(RuntimeState::Running, "Adaptive Mode active, resume mission starts from inserted interrupt waypoint");
    } else {
      enterState(RuntimeState::Running, "Adaptive Mode active while waiting mission activation");
    }

    return;
  }

  sendAdaptiveModeThrottled();
}

/**
 * @brief State EXTERNAL_INTERRUPTED_WAIT_SELECTION.
 *
 * Nếu user chọn RTL/LAND trong lúc mission đang chạy, PX4 có thể quay lại custom mode
 * theo user_intention cũ sau khi land. Khi đã landed, coi mission là parked: ép POSCTL
 * và yêu cầu một lần chọn Adaptive mới thay vì tự arm/takeoff resume.
 */
void AdaptiveMissionNode::updateExternalInterruptedWaitSelection()
{
  if (!landed_) {
    return;
  }

  /*
   * Sau khi đã ép PX4 về POSCTL thành công, state này chỉ đứng yên chờ
   * một cạnh lên Adaptive mới. Không reset lại cờ parking ở mỗi vòng lặp,
   * nếu không node sẽ spam POSCTL và không bao giờ resume được.
   */
  if (externalLandingParked_) {
    return;
  }

  if (!resumeRequiresFreshAdaptiveSelection_) {
    resumeRequiresFreshAdaptiveSelection_ = true;
    externalLandingPosctlSent_ = false;
    posctlSentForCurrentState_ = false;
    adaptiveRisingEdge_ = false;
    modeActivatedEvent_ = false;

    RCLCPP_WARN(
      node_->get_logger(),
      "External interruption landed. Parking mission in POSCTL; select Adaptive again to resume.");
  }

  if (armed_) {
    sendDisarmThrottled();
  }

  if (!externalLandingPosctlSent_) {
    sendPosctlOnce();
    externalLandingPosctlSent_ = true;
    return;
  }

  if (!adaptiveModeSelected() &&
    navState_ == px4_msgs::msg::VehicleStatus::NAVIGATION_STATE_POSCTL)
  {
    resumeRequiresFreshAdaptiveSelection_ = false;
    externalLandingPosctlSent_ = false;
    externalLandingParked_ = true;

    RCLCPP_WARN(
      node_->get_logger(),
      "Mission parked after external RTL/LAND. Waiting for a fresh Adaptive selection.");
  }
}

/**
 * @brief State RETURN_TO_SNAPSHOT.
 */
void AdaptiveMissionNode::updateReturnToSnapshot()
{
  if (!missionSnapshot_.valid || !snapshotGotoSetpoint_) {
    enterState(RuntimeState::Error, "Cannot return to snapshot: invalid snapshot/goto setpoint");
    return;
  }

  if (!globalPosition_ || !globalPosition_->positionValid()) {
    RCLCPP_WARN_THROTTLE(
      node_->get_logger(),
      *node_->get_clock(),
      1000,
      "Waiting valid global position before returning to snapshot");
    return;
  }

  const Eigen::Vector3d current = globalPosition_->position();
  const Eigen::Vector3d target = missionSnapshot_.position;
  const float distanceM = distance3dM(current, target);

  if (distanceM <= static_cast<float>(snapshotReturnAcceptanceM_)) {
    enterState(RuntimeState::Running, "Returned to snapshot, old mission executor unblocked");
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

void AdaptiveMissionNode::sendArmThrottled()
{
  const auto now = node_->now();

  if (lastArmCommand_.nanoseconds() != 0 &&
    (now - lastArmCommand_).seconds() < 1.0)
  {
    return;
  }

  lastArmCommand_ = now;
  RCLCPP_WARN(node_->get_logger(), "Sending ARM");
  px4Command_->arm();
}

void AdaptiveMissionNode::sendDisarmThrottled()
{
  const auto now = node_->now();

  if (lastDisarmCommand_.nanoseconds() != 0 &&
    (now - lastDisarmCommand_).seconds() < 1.0)
  {
    return;
  }

  lastDisarmCommand_ = now;
  RCLCPP_WARN(node_->get_logger(), "Sending DISARM");
  px4Command_->disarm();
}

void AdaptiveMissionNode::sendTakeoffThrottled(double targetAltitudeMsl)
{
  const auto now = node_->now();

  if (lastTakeoffCommand_.nanoseconds() != 0 &&
    (now - lastTakeoffCommand_).seconds() < 2.0)
  {
    return;
  }

  float latitude = Px4CommandClient::nan();
  float longitude = Px4CommandClient::nan();

  if (globalPosition_ && globalPosition_->positionValid()) {
    const auto position = globalPosition_->position();
    latitude = static_cast<float>(position.x());
    longitude = static_cast<float>(position.y());
  }

  lastTakeoffCommand_ = now;

  RCLCPP_WARN(
    node_->get_logger(),
    "Sending MAV_CMD_NAV_TAKEOFF to %.2f m AMSL",
    targetAltitudeMsl);

  px4Command_->takeoff(static_cast<float>(targetAltitudeMsl), latitude, longitude);
}

void AdaptiveMissionNode::sendAdaptiveModeThrottled()
{
  if (!executor_) {
    return;
  }

  const auto now = node_->now();

  if (lastModeCommand_.nanoseconds() != 0 &&
    (now - lastModeCommand_).seconds() < 1.0)
  {
    return;
  }

  lastModeCommand_ = now;

  RCLCPP_WARN(node_->get_logger(), "Selecting Adaptive Mission Mode");
  px4Command_->setMode(static_cast<float>(executor_->id()));
}

void AdaptiveMissionNode::sendPosctlOnce()
{
  if (posctlSentForCurrentState_) {
    return;
  }

  posctlSentForCurrentState_ = true;
  px4Command_->posctl();
}

void AdaptiveMissionNode::resetCommandTimers()
{
  lastArmCommand_ = rclcpp::Time{};
  lastDisarmCommand_ = rclcpp::Time{};
  lastTakeoffCommand_ = rclcpp::Time{};
  lastModeCommand_ = rclcpp::Time{};
}

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

bool AdaptiveMissionNode::fmuTopicsVisible() const
{
  const std::string statusTopic =
    "fmu/out/vehicle_status" +
    px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleStatus>();

  return node_->count_publishers(statusTopic) > 0;
}

bool AdaptiveMissionNode::canAcceptNewMission() const
{
  return !runtimeMissionLoaded_ &&
    state_ != RuntimeState::PreTakeoff &&
    state_ != RuntimeState::WaitAdaptiveActivation &&
    state_ != RuntimeState::Running &&
    state_ != RuntimeState::ExternalInterruptedWaitSelection &&
    state_ != RuntimeState::ResumeTakeoff &&
    state_ != RuntimeState::WaitAdaptiveActivationForResume &&
    state_ != RuntimeState::ReturnToSnapshot;
}

bool AdaptiveMissionNode::missionControlBlocked() const
{
  return state_ == RuntimeState::PreTakeoff ||
    state_ == RuntimeState::ResumeTakeoff ||
    state_ == RuntimeState::WaitAdaptiveActivation ||
    state_ == RuntimeState::WaitAdaptiveActivationForResume ||
    state_ == RuntimeState::ExternalInterruptedWaitSelection ||
    state_ == RuntimeState::ReturnToSnapshot;
}

bool AdaptiveMissionNode::needPreTakeoff(double targetAltitudeMsl) const
{
  const double currentAltitude = currentAltitudeMsl();

  return !hasValidNumber(currentAltitude) ||
    currentAltitude < targetAltitudeMsl - takeoffAcceptanceM_;
}

bool AdaptiveMissionNode::adaptiveModeSelected() const
{
  if (!modeRegistered_ || !executor_) {
    return false;
  }

  return navState_ == static_cast<uint8_t>(executor_->id());
}

bool AdaptiveMissionNode::adaptiveModeRisingEdge() const
{
  return adaptiveRisingEdge_;
}

bool AdaptiveMissionNode::adaptiveModeFallingEdge() const
{
  return adaptiveFallingEdge_;
}

bool AdaptiveMissionNode::hasValidCurrentAltitude() const
{
  return hasValidNumber(currentAltitudeMsl());
}

double AdaptiveMissionNode::currentAltitudeMsl() const
{
  if (globalPosition_ && globalPosition_->positionValid()) {
    return globalPosition_->position().z();
  }

  return std::numeric_limits<double>::quiet_NaN();
}

double AdaptiveMissionNode::targetTakeoffAltitudeMsl() const
{
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

double AdaptiveMissionNode::activePreTakeoffTargetAltitudeMsl() const
{
  if (preTakeoffOverrideAltitudeMsl_) {
    return *preTakeoffOverrideAltitudeMsl_;
  }

  return targetTakeoffAltitudeMsl();
}

const char * AdaptiveMissionNode::runtimeStateName() const
{
  switch (state_) {
    case RuntimeState::Idle:
      return "idle";

    case RuntimeState::NoMissionStandby:
      return "no_mission_standby";

    case RuntimeState::MissionCachedWaitMode:
      return "mission_cached_wait_mode";

    case RuntimeState::LoadingMission:
      return "loading_mission";

    case RuntimeState::PreTakeoff:
      return "pre_takeoff";

    case RuntimeState::WaitAdaptiveActivation:
      return "wait_adaptive_activation";

    case RuntimeState::Running:
      return "running";

    case RuntimeState::ExternalInterruptedWaitSelection:
      return "external_interrupted_wait_selection";

    case RuntimeState::ResumeTakeoff:
      return "resume_takeoff";

    case RuntimeState::WaitAdaptiveActivationForResume:
      return "wait_adaptive_activation_for_resume";

    case RuntimeState::ReturnToSnapshot:
      return "return_to_snapshot";

    case RuntimeState::Completed:
      return "completed";

    case RuntimeState::Error:
      return "error";
  }

  return "unknown";
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

  if (item.contains("altitude") && item.at("altitude").is_number()) {
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

  const int itemCount = plan_.executableItemCount;

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

  if (plan_.json.contains("remote_opaque_id")) {
    mission["remote_opaque_id"] = plan_.json.at("remote_opaque_id");
  }

  if (plan_.json.contains("source_hash")) {
    mission["source_hash"] = plan_.json.at("source_hash");
  }

  if (plan_.json.contains("resume_from_interrupt")) {
    mission["resume_from_interrupt"] = plan_.json.at("resume_from_interrupt");
  }

  if (plan_.json.contains("skipped_source_items")) {
    mission["skipped_source_items"] = plan_.json.at("skipped_source_items");
  }

  return mission;
}

nlohmann::json AdaptiveMissionNode::buildStateJson() const
{
  nlohmann::json state;

  state["state"] = runtimeStateName();
  state["mission_cached"] = cachedMissionAvailable_;
  state["mission_cached_hash"] = cachedMissionAvailable_ ?
    nlohmann::json(cachedMissionKey_) :
    nlohmann::json(nullptr);
  state["mission_loaded"] = missionLoaded_;
  state["mission_runtime_loaded"] = runtimeMissionLoaded_;
  state["mission_ready"] = missionLoaded_ && missionReady_;
  state["mission_pending_alt_ref"] = pendingMission_;
  state["mission_finished"] = missionFinished_;

  state["px4_mode_registered"] = modeRegistered_;
  state["px4_mode_id"] = executor_ ? static_cast<int>(executor_->id()) : -1;
  state["fmu_topics_visible"] = fmuTopicsVisible();

  state["active"] = adaptiveModeActive_;
  state["selected_by_nav_state"] = adaptiveModeSelected();
  state["selected_by_user_intention"] = modeRegistered_ && executor_ &&
    userIntentNavState_ == static_cast<uint8_t>(executor_->id());

  state["armed"] = armed_;
  state["landed"] = landed_;
  state["nav_state"] = navState_;
  state["nav_state_user_intention"] = userIntentNavState_;
  state["arming_state"] = armingState_;
  state["executor_in_charge"] = executorInCharge_;
  state["failsafe"] = failsafe_;

  state["mission_control_blocked"] = missionControlBlocked();
  state["pre_takeoff_alt_msl"] = hasValidNumber(activePreTakeoffTargetAltitudeMsl()) ?
    nlohmann::json(activePreTakeoffTargetAltitudeMsl()) :
    nlohmann::json(nullptr);

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
      {"state", runtimeStateName()},
      {"state_error", error.what()}}.dump();
  }

  statePublisher_->publish(message);
}

}  // namespace adaptive_mission_mode
