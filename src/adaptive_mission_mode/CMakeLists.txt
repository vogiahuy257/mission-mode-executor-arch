cmake_minimum_required(VERSION 3.5)
project(adaptive_mission_mode)

if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 17)
endif()

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic -Werror -Wno-unused-parameter)
endif()

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(eigen3_cmake_module REQUIRED)
find_package(Eigen3 REQUIRED)
find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)
find_package(px4_msgs REQUIRED)
find_package(px4_ros2_cpp REQUIRED)

include_directories(include ${Eigen3_INCLUDE_DIRS})

add_executable(adaptive_mission_mode_node
  src/main.cpp
  src/altitude_offset.cpp
  src/mission_runtime.cpp
  src/mission_node.cpp
  src/offset_waypoint_executor.cpp
  src/pause_resume.cpp
  src/pause_resume_action.cpp
  src/state/state_machine.cpp
  src/state/idle_state.cpp
  src/state/starting_state.cpp
  src/state/start_takeoff_state.cpp
  src/state/mission_state.cpp
  src/state/pause_rtl_state.cpp
  src/state/landed_wait_state.cpp
  src/state/resume_arm_state.cpp
  src/state/resume_takeoff_state.cpp
  src/state/return_pause_state.cpp)

ament_target_dependencies(adaptive_mission_mode_node rclcpp std_msgs px4_msgs)
target_link_libraries(adaptive_mission_mode_node Eigen3::Eigen px4_ros2_cpp::px4_ros2_cpp)

install(TARGETS adaptive_mission_mode_node DESTINATION lib/${PROJECT_NAME})
install(DIRECTORY launch DESTINATION share/${PROJECT_NAME})

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  ament_lint_auto_find_test_dependencies()
endif()

ament_package()
