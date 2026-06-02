cmake_minimum_required(VERSION 3.8)
project(adaptive_mission_mode)

if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 17)
endif()

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

find_package(ament_cmake REQUIRED)
find_package(eigen3_cmake_module REQUIRED)
find_package(Eigen3 REQUIRED)
find_package(std_msgs REQUIRED)
find_package(rclcpp REQUIRED)
find_package(px4_msgs REQUIRED)
find_package(px4_ros2_cpp REQUIRED)

add_library(adaptive_mission_mode_lib
  src/adaptive_mission_mode.cpp
  src/core/mission_blackboard.cpp
  src/core/mission_json.cpp
  src/core/mission_status_publisher.cpp
  src/core/mission_types.cpp
  src/core/vehicle_interface.cpp
  src/behavior_tree/core/bt_mission_runner.cpp
  src/behavior_tree/mission_root/mission_root_layer.cpp
  src/behavior_tree/mission_root/manual_control_layer/manual_altitude_assist.cpp
  src/behavior_tree/mission_root/manual_control_layer/manual_control_layer.cpp
  src/behavior_tree/mission_root/normal_mission_layer/builtin_mission_provider.cpp
  src/behavior_tree/mission_root/normal_mission_layer/mission_items/action_items/hold_action_item_builder.cpp
  src/behavior_tree/mission_root/normal_mission_layer/mission_items/action_items/rtl_action_item_builder.cpp
  src/behavior_tree/mission_root/normal_mission_layer/mission_items/waypoint_items/waypoint_mission_item_builder.cpp
  src/behavior_tree/mission_root/normal_mission_layer/mission_lifecycle_manager.cpp
  src/behavior_tree/mission_root/normal_mission_layer/normal_mission_layer.cpp
  src/behavior_tree/mission_root/normal_mission_layer/original_mission_executor_layer.cpp
)

target_include_directories(adaptive_mission_mode_lib PUBLIC
  include
)

target_link_libraries(adaptive_mission_mode_lib
  Eigen3::Eigen
  px4_ros2_cpp::px4_ros2_cpp
  rclcpp::rclcpp
)

ament_target_dependencies(adaptive_mission_mode_lib
  px4_msgs
  rclcpp
  std_msgs
)

add_executable(adaptive_mission_mode_node
  src/main.cpp
)

target_link_libraries(adaptive_mission_mode_node
  adaptive_mission_mode_lib
)

ament_target_dependencies(adaptive_mission_mode_node
  px4_msgs
  rclcpp
  std_msgs
)

install(TARGETS
  adaptive_mission_mode_lib
  adaptive_mission_mode_node
  DESTINATION lib/${PROJECT_NAME}
)

install(DIRECTORY
  config
  launch
  DESTINATION share/${PROJECT_NAME}
)

install(DIRECTORY include/
  DESTINATION include
)

if(BUILD_TESTING)
  find_package(ament_cmake_gtest REQUIRED)
  find_package(ament_lint_auto REQUIRED)
  set(ament_cmake_copyright_FOUND TRUE)
  set(ament_cmake_cpplint_FOUND TRUE)
  ament_lint_auto_find_test_dependencies()

  ament_add_gtest(adaptive_mission_mode_unit_tests
    test/mission_json_test.cpp
    test/mission_lifecycle_manager_test.cpp
  )

  target_link_libraries(adaptive_mission_mode_unit_tests
    adaptive_mission_mode_lib
  )

  target_include_directories(adaptive_mission_mode_unit_tests PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/../external/px4_ros2_interface_lib/px4_ros2_cpp
  )

  ament_target_dependencies(adaptive_mission_mode_unit_tests
    px4_msgs
    px4_ros2_cpp
    rclcpp
    std_msgs
  )
endif()

ament_export_include_directories(include)

ament_package()
