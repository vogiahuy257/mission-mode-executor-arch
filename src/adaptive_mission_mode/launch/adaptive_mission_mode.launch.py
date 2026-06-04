from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare


def generate_launch_description():
    params_file = LaunchConfiguration("params_file")

    default_params_file = PathJoinSubstitution(
        [
            FindPackageShare("adaptive_mission_mode"),
            "config",
            "adaptive_mission_mode.yaml",
        ]
    )

    return LaunchDescription(
        [
            DeclareLaunchArgument(
                "params_file",
                default_value=default_params_file,
                description="Path to adaptive mission mode YAML parameters.",
            ),
            Node(
                package="adaptive_mission_mode",
                executable="adaptive_mission_mode_node",
                name="adaptive_mission_mode",
                output="screen",
                parameters=[params_file],
            ),
        ]
    )
