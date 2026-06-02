from pathlib import Path

from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    share_dir = Path(get_package_share_directory("adaptive_mission_mode"))
    config_file = share_dir / "config" / "adaptive_mission_mode.yaml"
    drone_namespace = LaunchConfiguration("drone_namespace")

    return LaunchDescription(
        [
            DeclareLaunchArgument("drone_namespace", default_value=""),
            Node(
                package="adaptive_mission_mode",
                executable="adaptive_mission_mode_node",
                name="adaptive_mission_mode",
                namespace=drone_namespace,
                output="screen",
                parameters=[
                    str(config_file),
                    {"px4_topic_namespace_prefix": drone_namespace},
                ],
            ),
        ]
    )
