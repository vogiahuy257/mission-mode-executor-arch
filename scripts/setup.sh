#!/usr/bin/env bash
set -euo pipefail

# Install runtime + build dependencies for precision-land on:
# - Ubuntu 24.04 (noble)
# - ROS 2 Jazzy (deb packages from packages.ros.org)
#
# This script is intentionally idempotent (safe to re-run).
#
# Profiles:
#   core / hardware / flight — onboard / real vehicle (no Gazebo, no gz_bridge, no xterm)
#   sim              — core + ros_gz_bridge + xterm for scripts/sim_launch.sh + make sim
#   sim-report       — sim + rosbag2 for make report
#
# PX4 firmware + Gazebo Harmonic (gz) are separate; see README (PX4_DIR, gz-harmonic).

sudo apt update

PROFILE="${1:-core}"
case "${PROFILE}" in
  hardware|flight) PROFILE=core ;;
  core|sim|sim-report) ;;
  *)
    echo "Usage: $0 [core|hardware|flight|sim|sim-report]" >&2
    echo "  core, hardware, flight — flight stack only (default: core)" >&2
    echo "  sim                    — + ros_gz_bridge, xterm for SITL / make sim" >&2
    echo "  sim-report             — sim + rosbag2 (make report)" >&2
    exit 2
    ;;
esac

# ── Baseline: build + runtime for real hardware and sim (shared) ───────────
# tf2-* required by StateTfBridge on vehicle and in sim; not simulation-only.
sudo apt install -y \
  ros-jazzy-ros-base \
  ros-jazzy-ros2cli \
  ros-jazzy-rclpy \
  ros-jazzy-cv-bridge \
  ros-jazzy-image-transport \
  ros-jazzy-camera-info-manager \
  ros-jazzy-tf2-ros \
  ros-jazzy-tf2-geometry-msgs \
  ros-jazzy-eigen3-cmake-module \
  python3-colcon-common-extensions \
  python3-plotly \
  ros-jazzy-rosbag2 \
  ros-jazzy-rosbag2-storage-mcap

# ── Simulation only (Gazebo ↔ ROS bridge + terminals for sim_launch.sh) ───
if [[ "${PROFILE}" != "core" ]]; then
  sudo apt install -y \
    ros-jazzy-ros-gz-bridge \
    xterm
fi

# ── Native libs used at build time ─────────────────────────────────────────
sudo apt install -y \
  libcamera-dev \
  libopencv-dev \
  libeigen3-dev \
  python3-yaml

echo ""
echo "OK. Open a new terminal (or re-source ROS):"
echo "  source /opt/ros/jazzy/setup.bash"
echo "  source install/setup.bash"
echo ""
if [[ "${PROFILE}" != "core" ]]; then
  echo "Sim profile: for make sim, install gz (e.g. gz-harmonic), build PX4 SITL, set PX4_DIR — README."
  echo ""
fi
