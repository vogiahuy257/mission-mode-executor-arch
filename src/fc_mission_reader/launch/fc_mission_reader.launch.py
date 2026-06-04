from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    return LaunchDescription([
        DeclareLaunchArgument('bind_ip', default_value='0.0.0.0'),
        DeclareLaunchArgument('bind_port', default_value='14551'),
        DeclareLaunchArgument('auto_target', default_value='true'),
        DeclareLaunchArgument('target_ip', default_value='127.0.0.1'),
        DeclareLaunchArgument('target_port', default_value='14550'),
        DeclareLaunchArgument('poll_period_s', default_value='1.0'),
        DeclareLaunchArgument('timeout_ms', default_value='3000'),
        DeclareLaunchArgument('enable_fallback_count_poll', default_value='true'),
        DeclareLaunchArgument('publish_cached_mission_continuously', default_value='true'),
        DeclareLaunchArgument('fallback_count_poll_s', default_value='5.0'),
        DeclareLaunchArgument('retries', default_value='3'),
        DeclareLaunchArgument('output_file', default_value=''),
        Node(
            package='fc_mission_reader',
            executable='fc_mission_reader_node',
            name='fc_mission_reader',
            output='screen',
            parameters=[{
                'bind_ip': LaunchConfiguration('bind_ip'),
                'bind_port': LaunchConfiguration('bind_port'),
                'auto_target': LaunchConfiguration('auto_target'),
                'target_ip': LaunchConfiguration('target_ip'),
                'target_port': LaunchConfiguration('target_port'),
                'poll_period_s': LaunchConfiguration('poll_period_s'),
                'timeout_ms': LaunchConfiguration('timeout_ms'),
                'enable_fallback_count_poll': LaunchConfiguration('enable_fallback_count_poll'),
                'publish_cached_mission_continuously': LaunchConfiguration('publish_cached_mission_continuously'),
                'fallback_count_poll_s': LaunchConfiguration('fallback_count_poll_s'),
                'retries': LaunchConfiguration('retries'),
                'output_file': LaunchConfiguration('output_file'),
            }]
        )
    ])
