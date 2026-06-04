#include "fc_mission_reader/fc_mission_reader.hpp"

#include <rclcpp/rclcpp.hpp>

int main(int argc, char ** argv)
{
  rclcpp::init(argc, argv);
  auto node = std::make_shared<fc_mission_reader::FcMissionReader>();
  rclcpp::spin(node);
  rclcpp::shutdown();
  return 0;
}
