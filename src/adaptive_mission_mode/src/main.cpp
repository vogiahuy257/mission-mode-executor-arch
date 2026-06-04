#include "adaptive_mission_mode/app/AdaptiveMissionNode.hpp"

#include <chrono>
#include <cstdio>
#include <exception>
#include <memory>
#include <thread>

#include <rclcpp/rclcpp.hpp>

using namespace std::chrono_literals;

int main(int argc, char ** argv)
{
  rclcpp::init(argc, argv);

  auto node = std::make_shared<rclcpp::Node>("adaptive_mission_mode");
  adaptive_mission_mode::AdaptiveMissionNode app(node);

  rclcpp::executors::SingleThreadedExecutor executor;
  executor.add_node(node);

  /*
   * Không để một exception từ px4_ros2 làm chết process.
   *
   * Một số trạng thái PX4, ví dụ user chọn custom mode khi chưa có mission
   * hoặc FMU đổi mode/khởi động lại, có thể làm thư viện px4_ros2 ném timeout.
   * Nếu dùng rclcpp::spin(node) trực tiếp, exception sẽ thoát khỏi spin và node
   * kết thúc. Vòng spin_once dưới đây giữ node sống, ghi log lỗi, rồi tiếp tục.
   */
  while (rclcpp::ok()) {
    try {
      executor.spin_once(100ms);
    } catch (const std::exception & error) {
      RCLCPP_ERROR(
        node->get_logger(),
        "Runtime exception caught and ignored to keep node alive: %s",
        error.what());

      std::this_thread::sleep_for(250ms);
    }
  }

  executor.remove_node(node);
  rclcpp::shutdown();
  return 0;
}
