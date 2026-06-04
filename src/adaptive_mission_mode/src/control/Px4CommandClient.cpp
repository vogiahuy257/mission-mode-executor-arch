#include "adaptive_mission_mode/control/Px4CommandClient.hpp"

#include <px4_ros2/components/mode.hpp>
#include <px4_ros2/utils/message_version.hpp>

namespace adaptive_mission_mode
{

Px4CommandClient::Px4CommandClient(rclcpp::Node & node, Px4CommandTarget target)
: node_(node), target_(target)
{
  const std::string topic =
    "fmu/in/vehicle_command" +
    px4_ros2::getMessageNameVersion<px4_msgs::msg::VehicleCommand>();

  commandPublisher_ = node_.create_publisher<px4_msgs::msg::VehicleCommand>(
    topic,
    rclcpp::QoS(1));
}

void Px4CommandClient::setTarget(Px4CommandTarget target)
{
  target_ = target;
}

void Px4CommandClient::arm()
{
  send(px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM, 1.0F);
}

void Px4CommandClient::disarm()
{
  send(px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM, 0.0F);
}

void Px4CommandClient::land()
{
  send(px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_LAND);
}

void Px4CommandClient::setMode(float modeId)
{
  send(px4_msgs::msg::VehicleCommand::VEHICLE_CMD_SET_NAV_STATE, modeId);
}

void Px4CommandClient::posctl()
{
  setMode(2.0F);
}

void Px4CommandClient::rtl()
{
  setMode(static_cast<float>(px4_ros2::ModeBase::kModeIDRtl));
}

void Px4CommandClient::takeoff(float altitudeMsl, float latitude, float longitude)
{
  send(
    px4_msgs::msg::VehicleCommand::VEHICLE_CMD_NAV_TAKEOFF,
    nan(),
    nan(),
    nan(),
    nan(),
    latitude,
    longitude,
    altitudeMsl);
}

void Px4CommandClient::send(
  uint32_t command,
  float param1,
  float param2,
  float param3,
  float param4,
  float param5,
  float param6,
  float param7)
{
  px4_msgs::msg::VehicleCommand message{};

  message.timestamp = static_cast<uint64_t>(node_.now().nanoseconds() / 1000);
  message.command = command;

  message.param1 = param1;
  message.param2 = param2;
  message.param3 = param3;
  message.param4 = param4;
  message.param5 = param5;
  message.param6 = param6;
  message.param7 = param7;

  message.target_system = static_cast<uint8_t>(target_.targetSystem);
  message.target_component = static_cast<uint8_t>(target_.targetComponent);
  message.source_system = static_cast<uint8_t>(target_.sourceSystem);
  message.source_component = static_cast<uint8_t>(target_.sourceComponent);
  message.from_external = true;

  commandPublisher_->publish(message);
}

float Px4CommandClient::nan()
{
  return std::numeric_limits<float>::quiet_NaN();
}

}  // namespace adaptive_mission_mode
