from launch import LaunchDescription
from launch_ros.actions import Node


def generate_launch_description():
    return LaunchDescription([
        Node(
            package='adaptive_mission_mode',
            executable='adaptive_mission_mode_node',
            name='adaptive_mission_mode',
            output='screen',
        ),
    ])
