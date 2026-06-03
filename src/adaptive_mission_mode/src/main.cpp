/****************************************************************************
 * Adaptive Mission Mode - main
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/mission_node.hpp"

#include <cstdio>
#include <exception>
#include <memory>

#include <rclcpp/rclcpp.hpp>

namespace
{
constexpr char kNodeName[] = "adaptive_mission_mode";
}

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);

  try {
    auto node = std::make_shared<rclcpp::Node>(kNodeName);
    adaptive_mission_mode::MissionNode app(node);
    rclcpp::spin(node);
  } catch (const std::exception & error) {
    std::fprintf(stderr, "adaptive_mission_mode failed: %s\n", error.what());
  }

  rclcpp::shutdown();
  return 0;
}
