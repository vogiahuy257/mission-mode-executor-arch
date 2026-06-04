#pragma once

#include <cstdint>
#include <limits>

#include <px4_msgs/msg/vehicle_command.hpp>

#include <rclcpp/rclcpp.hpp>

namespace adaptive_mission_mode
{

struct Px4CommandTarget
{
  int targetSystem{1};

  int targetComponent{1};

  int sourceSystem{1};

  int sourceComponent{1};
};

class Px4CommandClient
{
public:
  explicit Px4CommandClient(rclcpp::Node & node, Px4CommandTarget target = {});

  void setTarget(Px4CommandTarget target);

  // Gửi lệnh arm.
  void arm();

  // Gửi lệnh disarm.
  void disarm();

  // Gửi lệnh LAND tại vị trí hiện tại.
  void land();

  // Gửi lệnh set nav state/custom mode theo mode id.
  void setMode(float modeId);

  // Chuyển về POSCTL bằng nav-state id chuẩn PX4 hiện tại của project.
  void posctl();

  // Chuyển về RTL bằng mode id của px4_ros2.
  void rtl();

  // Gửi MAV_CMD_NAV_TAKEOFF tới altitude MSL.
  void takeoff(float altitudeMsl, float latitude = nan(), float longitude = nan());

  // Gửi một VehicleCommand thô khi cần mở rộng logic.
  void send(
    uint32_t command,
    float param1 = nan(),
    float param2 = nan(),
    float param3 = nan(),
    float param4 = nan(),
    float param5 = nan(),
    float param6 = nan(),
    float param7 = nan());

  static float nan();

private:
  rclcpp::Node & node_;

  Px4CommandTarget target_{};

  rclcpp::Publisher<px4_msgs::msg::VehicleCommand>::SharedPtr commandPublisher_{};
};

}  // namespace adaptive_mission_mode
