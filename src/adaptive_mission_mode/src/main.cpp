/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/adaptive_mission_mode.hpp"

#include <memory>

#include <rclcpp/rclcpp.hpp>
#include <rcutils/error_handling.h>
#include <rcutils/logging.h>

namespace
{

constexpr char kNodeName[] = "adaptive_mission_mode";

void setDebugLogging(rclcpp::Node & node)
{
  const auto enableDebugOutput = node.declare_parameter<bool>("debug_output", true);
  if (!enableDebugOutput) {
    return;
  }

  const auto ret =
    rcutils_logging_set_logger_level(node.get_logger().get_name(), RCUTILS_LOG_SEVERITY_DEBUG);
  if (ret != RCUTILS_RET_OK) {
    RCLCPP_ERROR(
      node.get_logger(),
      "Failed to enable debug logging: %s",
      rcutils_get_error_string().str);
    rcutils_reset_error();
  }
}

}  // namespace

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);

  auto node = std::make_shared<rclcpp::Node>(kNodeName);

  try {
    setDebugLogging(*node);
    adaptive_mission_mode::AdaptiveMissionModeApp app(node);
    rclcpp::spin(node);
  } catch (const std::exception & exception) {
    RCLCPP_FATAL(node->get_logger(), "adaptive_mission_mode startup failed: %s", exception.what());
    rclcpp::shutdown();
    return 1;
  }

  rclcpp::shutdown();
  return 0;
}
