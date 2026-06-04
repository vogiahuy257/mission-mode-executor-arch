cmake_minimum_required(VERSION 3.8)
project(fc_mission_reader)

if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 17)
endif()

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra)
endif()

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)
find_package(ament_index_cpp REQUIRED)
find_package(mavlink REQUIRED)

add_executable(fc_mission_reader_node
  src/main.cpp
  src/fc_mission_reader.cpp
)

target_include_directories(fc_mission_reader_node PUBLIC
  include
)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  target_compile_options(fc_mission_reader_node PRIVATE
    -Wno-error
    -Wno-pedantic
    -Wno-address-of-packed-member
    -Wno-error=pedantic
    -Wno-error=address-of-packed-member
  )
endif()

ament_target_dependencies(fc_mission_reader_node
  rclcpp
  std_msgs
  ament_index_cpp
  mavlink
)

install(TARGETS fc_mission_reader_node
  DESTINATION lib/${PROJECT_NAME}
)

install(DIRECTORY launch
  DESTINATION share/${PROJECT_NAME}
)

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  ament_lint_auto_find_test_dependencies()
endif()

ament_package()
