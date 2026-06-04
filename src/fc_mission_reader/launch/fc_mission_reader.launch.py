from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    return LaunchDescription([
        DeclareLaunchArgument('bind_ip', default_value='0.0.0.0'),
        DeclareLaunchArgument('bind_port', default_value='14551'),
        DeclareLaunchArgument('poll_period_s', default_value='0.02'),
        DeclareLaunchArgument('read_budget_ms', default_value='50'),
        DeclareLaunchArgument('transfer_timeout_s', default_value='8.0'),
        DeclareLaunchArgument('publish_reset_on_mission_change', default_value='true'),
        DeclareLaunchArgument('publish_reset_on_startup_change', default_value='false'),
        DeclareLaunchArgument('reset_publish_min_interval_s', default_value='1.0'),
        DeclareLaunchArgument('adaptive_reset_topic', default_value='/adaptive_mission_mode/reset'),
        DeclareLaunchArgument('publish_unknown_on_remote_change', default_value='true'),
        DeclareLaunchArgument('publish_empty_from_mission_current', default_value='true'),
        DeclareLaunchArgument('output_file', default_value=''),
        Node(
            package='fc_mission_reader',
            executable='fc_mission_reader_node',
            name='fc_mission_reader',
            output='screen',
            parameters=[{
                'bind_ip': LaunchConfiguration('bind_ip'),
                'bind_port': LaunchConfiguration('bind_port'),
                'poll_period_s': LaunchConfiguration('poll_period_s'),
                'read_budget_ms': LaunchConfiguration('read_budget_ms'),
                'transfer_timeout_s': LaunchConfiguration('transfer_timeout_s'),
                'publish_reset_on_mission_change': LaunchConfiguration('publish_reset_on_mission_change'),
                'publish_reset_on_startup_change': LaunchConfiguration('publish_reset_on_startup_change'),
                'reset_publish_min_interval_s': LaunchConfiguration('reset_publish_min_interval_s'),
                'adaptive_reset_topic': LaunchConfiguration('adaptive_reset_topic'),
                'publish_unknown_on_remote_change': LaunchConfiguration('publish_unknown_on_remote_change'),
                'publish_empty_from_mission_current': LaunchConfiguration('publish_empty_from_mission_current'),
                'output_file': LaunchConfiguration('output_file'),
            }]
        )
    ])
