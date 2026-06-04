cmake_minimum_required(VERSION 3.5)
project(adaptive_mission_mode)

if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 17)
endif()

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic -Wno-unused-parameter)
endif()

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(ament_cmake REQUIRED)
find_package(eigen3_cmake_module REQUIRED)
find_package(Eigen3 REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)
find_package(px4_msgs REQUIRED)
find_package(px4_ros2_cpp REQUIRED)

add_executable(adaptive_mission_mode_node
  src/main.cpp

  src/app/AdaptiveMissionNode.cpp

  src/control/AltitudeOffsetController.cpp
  src/control/OffsetTrajectoryExecutor.cpp
  src/control/Px4CommandClient.cpp

  src/mission/MissionParser.cpp
  src/runtime/AdaptiveMissionExecutor.cpp
)

target_include_directories(adaptive_mission_mode_node
  PRIVATE
    include
    ${Eigen3_INCLUDE_DIRS}
)

ament_target_dependencies(adaptive_mission_mode_node
  rclcpp
  std_msgs
  px4_msgs
)

target_link_libraries(adaptive_mission_mode_node
  Eigen3::Eigen
  px4_ros2_cpp::px4_ros2_cpp
)

install(
  TARGETS adaptive_mission_mode_node
  DESTINATION lib/${PROJECT_NAME}
)

install(
  DIRECTORY include/
  DESTINATION include
)

install(
  DIRECTORY launch config
  DESTINATION share/${PROJECT_NAME}
)

ament_package()
