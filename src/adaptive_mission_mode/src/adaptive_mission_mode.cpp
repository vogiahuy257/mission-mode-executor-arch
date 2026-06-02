/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/adaptive_mission_mode.hpp"

#include <algorithm>
#include <cctype>
#include <sstream>

#include <px4_ros2/third_party/nlohmann/json.hpp>

#include "adaptive_mission_mode/core/mission_json.hpp"

namespace adaptive_mission_mode
{

namespace
{

constexpr char kDefaultModeName[] = "Adaptive Mission";
constexpr char kMissionJsonTopic[] = "~/mission_json";
constexpr char kActivateJsonTopic[] = "~/activate_json";
constexpr std::size_t kMaxModeNameLength = 24;

std::string normalizeTopicNamespacePrefix(std::string prefix)
{
  if (prefix.empty()) 
  {
    return "";
  }
  if (prefix.front() != '/') 
  {
    prefix.insert(prefix.begin(), '/');
  }
  if (prefix.back() != '/') 
  {
    prefix.push_back('/');
  }
  return prefix;
}

}  // namespace

AdaptiveMissionModeApp::AdaptiveMissionModeApp(std::shared_ptr<rclcpp::Node> node) : node_(std::move(node)), blackboard_(std::make_shared<MissionBlackboard>())
{
  modeName_ = node_->declare_parameter<std::string>("mode_name", kDefaultModeName);
  px4TopicNamespacePrefix_ = normalizeTopicNamespacePrefix(node_->declare_parameter<std::string>("px4_topic_namespace_prefix", ""));
  const auto persistenceFile = node_->declare_parameter<std::string>("persistence_file", "");

  if (modeName_.size() > kMaxModeNameLength) 
  {
    throw std::runtime_error("Parameter 'mode_name' must be 24 characters or fewer");
  }

  setupMissionExecutor(modeName_, persistenceFile, px4TopicNamespacePrefix_);
  setupRuntimeModules();
  setupCallbacks();
  setupRuntimeInterfaces();
  setupStartupMission();

  statusPublisher_->start();
  btMissionRunner_->start();
}

void AdaptiveMissionModeApp::setupMissionExecutor(const std::string & modeName,const std::string & persistenceFile,const std::string & topicNamespacePrefix)
{
  auto configuration = px4_ros2::MissionExecutor::Configuration{};

  if (!persistenceFile.empty()) 
  {
    configuration.withPersistenceFile(persistenceFile);
  }

  missionExecutor_ = std::make_unique<AdaptiveMissionExecutor>(modeName,configuration,*node_,topicNamespacePrefix);

  if (!missionExecutor_->doRegister()) 
  {
    throw std::runtime_error("Failed to register adaptive mission executor");
  }
}

void AdaptiveMissionModeApp::setupRuntimeModules()
{
  vehicleInterface_ = std::make_unique<VehicleInterface>( node_,blackboard_,px4TopicNamespacePrefix_);
  manualAltitudeAssist_ =std::make_unique<tree::mission_root::manual_control_layer::ManualAltitudeAssist>(node_,blackboard_);
  lifecycleManager_ = std::make_unique<tree::mission_root::normal_mission_layer::MissionLifecycleManager>(node_, blackboard_,*missionExecutor_,*vehicleInterface_);
  builtinMissionProvider_ = std::make_unique<tree::mission_root::normal_mission_layer::BuiltinMissionProvider>(node_);
  statusPublisher_ = std::make_unique<MissionStatusPublisher>(node_, blackboard_);
  btMissionRunner_ = std::make_unique<BtMissionRunner>( node_, blackboard_, *lifecycleManager_,*manualAltitudeAssist_);
}

void AdaptiveMissionModeApp::setupCallbacks()
{
  missionExecutor_->onActivated([this]() { lifecycleManager_->setMissionActive(true);});

  missionExecutor_->onDeactivated([this]() { lifecycleManager_->setMissionActive(false);});

  missionExecutor_->onProgressUpdate([this](int currentIndex) 
  {
    lifecycleManager_->setCurrentItemIndex(currentIndex);
    RCLCPP_INFO(node_->get_logger(), "Adaptive mission progress: item %d", currentIndex);
  });

  missionExecutor_->onCompleted([this]() 
  {
    lifecycleManager_->notifyMissionCompleted();
  });

  missionExecutor_->onReadynessUpdate([this](bool ready, const std::vector<std::string> & errors) 
  {
    reportMissionReadiness(ready, errors);
  });
}

void AdaptiveMissionModeApp::setupRuntimeInterfaces()
{
  missionJsonSub_ = node_->create_subscription<std_msgs::msg::String>(
    kMissionJsonTopic,
    rclcpp::QoS(1).reliable(),
    [this](const std_msgs::msg::String::SharedPtr message) {
      if (!message) {
        return;
      }

      if (!loadMissionFromJson(message->data, "topic mission_json")) {
        return;
      }

      RCLCPP_INFO(node_->get_logger(), "Runtime mission accepted from topic mission_json");
    });

  activateJsonSub_ = node_->create_subscription<std_msgs::msg::String>(
    kActivateJsonTopic,
    rclcpp::QoS(1).reliable(),
    [this](const std_msgs::msg::String::SharedPtr message) {
      if (!message) {
        return;
      }

      bool activate = false;
      if (!parseActivateRequest(message->data, &activate)) {
        RCLCPP_ERROR(node_->get_logger(), "Activate JSON rejected: %s", message->data.c_str());
        return;
      }

      if (!activate) {
        RCLCPP_INFO(node_->get_logger(), "Activate request was false, nothing to do");
        return;
      }

      lifecycleManager_->requestStart("topic activate_json");
    });
}

void AdaptiveMissionModeApp::setupStartupMission()
{
  const auto mission = builtinMissionProvider_->buildMission();
  if (!mission) {
    RCLCPP_WARN(node_->get_logger(), "No built-in mission selected. Set mission.builtin_type to enable one.");
    return;
  }

  missionExecutor_->setMission(*mission);
  lifecycleManager_->setMissionStartRequiresTakeoff(
    builtinMissionProvider_->missionType().rfind("takeoff_", 0) == 0);
  lifecycleManager_->setMissionStartTakeoffAltitudeRelativeM(std::nullopt);
  lifecycleManager_->setMissionStartTakeoffAltitudeAmsl(std::nullopt);

  RCLCPP_INFO(
    node_->get_logger(),
    "Built-in mission '%s' loaded with %zu items",
    builtinMissionProvider_->missionType().c_str(),
    mission->items().size());

  if (builtinMissionProvider_->autoStart()) {
    lifecycleManager_->requestStart("mission.auto_start");
  }
}

bool AdaptiveMissionModeApp::loadMissionFromJson(
  const std::string & missionJson,
  const std::string & source)
{
  try {
    const auto normalizedMission = parseStandardMissionJson(missionJson);
    missionExecutor_->setMission(normalizedMission.mission);
    lifecycleManager_->setMissionStartRequiresTakeoff(
      normalizedMission.leading_takeoff_items > 0U);
    lifecycleManager_->setMissionStartTakeoffAltitudeRelativeM(
      normalizedMission.leading_takeoff_altitude_relative_m);
    lifecycleManager_->setMissionStartTakeoffAltitudeAmsl(
      normalizedMission.leading_takeoff_altitude_amsl);
    blackboard_->setLastError("");

    if (normalizedMission.leading_takeoff_items > 0U) {
      if (normalizedMission.leading_takeoff_altitude_relative_m.has_value()) {
        RCLCPP_INFO(
          node_->get_logger(),
          "Mission from %s declared %zu leading takeoff item(s) with target relative altitude %.2f m. "
          "They will be executed during mission start before the remaining mission items.",
          source.c_str(),
          normalizedMission.leading_takeoff_items,
          static_cast<double>(*normalizedMission.leading_takeoff_altitude_relative_m));
      } else if (normalizedMission.leading_takeoff_altitude_amsl.has_value()) {
        RCLCPP_INFO(
          node_->get_logger(),
          "Mission from %s declared %zu leading takeoff item(s) with target AMSL altitude %.2f m. "
          "They will be executed during mission start before the remaining mission items.",
          source.c_str(),
          normalizedMission.leading_takeoff_items,
          static_cast<double>(*normalizedMission.leading_takeoff_altitude_amsl));
      } else {
        RCLCPP_INFO(
          node_->get_logger(),
          "Mission from %s declared %zu leading takeoff item(s). They will be executed during "
          "mission start before the remaining mission items.",
          source.c_str(),
          normalizedMission.leading_takeoff_items);
      }
    }
    RCLCPP_INFO(
      node_->get_logger(),
      "Mission updated from %s with %zu items",
      source.c_str(),
      normalizedMission.mission.items().size());
    return true;
  } catch (const std::exception & exception) {
    blackboard_->setLastError(exception.what());
    RCLCPP_ERROR(
      node_->get_logger(),
      "Mission JSON update rejected from %s: %s",
      source.c_str(),
      exception.what());
    return false;
  }
}

bool AdaptiveMissionModeApp::parseActivateRequest(
  const std::string & activateJson,
  bool * activate) const
{
  try {
    const auto json = nlohmann::json::parse(activateJson);

    if (json.is_boolean()) {
      if (activate) {
        *activate = json.get<bool>();
      }
      return true;
    }

    if (json.is_object() && json.contains("activate")) {
      if (activate) {
        *activate = json.at("activate").get<bool>();
      }
      return true;
    }

    if (json.is_string()) {
      auto value = json.get<std::string>();
      std::transform(value.begin(), value.end(), value.begin(), [](unsigned char ch) {
        return static_cast<char>(std::tolower(ch));
      });
      if (activate) {
        *activate = (value == "true" || value == "start" || value == "activate");
      }
      return true;
    }
  } catch (const std::exception &) {
  }

  return false;
}

void AdaptiveMissionModeApp::reportMissionReadiness(
  bool ready,
  const std::vector<std::string> & errors)
{
  if (lastReadyState_.has_value() && *lastReadyState_ == ready && lastReadinessErrors_ == errors) {
    return;
  }

  lastReadyState_ = ready;
  lastReadinessErrors_ = errors;
  lifecycleManager_->setMissionReady(ready, errors);
}

std::string AdaptiveMissionModeApp::joinErrors(const std::vector<std::string> & errors) const
{
  std::ostringstream stream;
  for (std::size_t index = 0; index < errors.size(); ++index) {
    if (index > 0) {
      stream << "; ";
    }
    stream << errors[index];
  }
  return stream.str();
}

}  // namespace adaptive_mission_mode
