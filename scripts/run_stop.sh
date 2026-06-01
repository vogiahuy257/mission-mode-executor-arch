#!/usr/bin/env bash
# =============================================================================
# run_stop.sh – Kill ALL real-world (hardware) precision_landing processes
#
# Properly cleans up:
#   - ros2 launch (precision_landing stack)
#   - ros2 bag record processes
#   - camera_ros pipeline
#   - MicroXRCEAgent serial bridge
#   - Any stray ros2 nodes from precision_landing
#
# Usage:
#   bash scripts/run_stop.sh           # Kill everything
#   bash scripts/run_stop.sh --quiet   # Suppress per-process output
# =============================================================================
set -euo pipefail

QUIET=false
[[ "${1:-}" == "--quiet" ]] && QUIET=true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
killed=0

kill_pattern() {
  local label="$1"
  local pattern="$2"
  local pids
  pids=$(pgrep -f "$pattern" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    $QUIET || echo "  kill: ${label}  ($(echo "$pids" | wc -w) proc)"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    ((killed += $(echo "$pids" | wc -w))) || true
  fi
}

echo "Stopping precision_landing HARDWARE processes..."

# ── 1. Gracefully stop rosbag recorder (SIGINT → SIGTERM → SIGKILL) ──────────
# If the process was started via exec_default_signals.py, SIGINT = graceful flush.
bag_pids=$(pgrep -f "ros2 bag record" 2>/dev/null || true)
if [[ -n "$bag_pids" ]]; then
  $QUIET || echo "  stop: ros2 bag record  ($(echo "$bag_pids" | wc -w) proc) — flushing..."
  echo "$bag_pids" | xargs kill -INT 2>/dev/null || true
  for _i in $(seq 1 240); do
    remaining_bag=$(pgrep -f "ros2 bag record" 2>/dev/null || true)
    [[ -z "$remaining_bag" ]] && break
    sleep 0.5
  done
  remaining_bag=$(pgrep -f "ros2 bag record" 2>/dev/null || true)
  if [[ -n "$remaining_bag" ]]; then
    $QUIET || echo "  stop: ros2 bag record — SIGTERM (large cache flush)..."
    echo "$remaining_bag" | xargs kill -TERM 2>/dev/null || true
    for _i in $(seq 1 120); do
      remaining_bag=$(pgrep -f "ros2 bag record" 2>/dev/null || true)
      [[ -z "$remaining_bag" ]] && break
      sleep 0.5
    done
  fi
  remaining_bag=$(pgrep -f "ros2 bag record" 2>/dev/null || true)
  if [[ -n "$remaining_bag" ]]; then
    echo "$remaining_bag" | xargs kill -9 2>/dev/null || true
    $QUIET || echo "  kill: ros2 bag record (force-killed, bag may be incomplete)"
  else
    $QUIET || echo "  stop: ros2 bag record — flushed OK"
  fi
  ((killed += $(echo "$bag_pids" | wc -w))) || true
fi

# ── 2. Kill ROS2 launch and precision_landing components ────────────────────
kill_pattern "precision_landing"  "precision_landing"
kill_pattern "landing_controller" "landing_controller"
kill_pattern "aruco_detector"     "aruco_detector"
kill_pattern "target_estimator"   "target_estimator"
kill_pattern "state_tf_bridge"    "state_tf_bridge"

# ── 3. Kill camera_ros pipeline ──────────────────────────────────────────────
kill_pattern "camera_ros"         "camera_ros"
kill_pattern "image_transport"    "image_transport"

# ── 4. Kill MicroXRCEAgent serial bridge ─────────────────────────────────────
kill_pattern "MicroXRCEAgent"     "MicroXRCEAgent"

# ── 5. Kill any stray component containers ───────────────────────────────────
kill_pattern "component_container" "component_container"

# ── 6. Kill ros2 launch processes (fallback, if setsid was used) ─────────────
# Note: This is less common but included for safety on hardware
kill_pattern "ros2 launch"        "ros2.*launch.*precision_landing"

echo ""
if [[ $killed -gt 0 ]]; then
  echo "✓ Stopped $killed process(es). Hardware stack cleaned up."
else
  echo "ℹ No precision_landing processes running."
fi

# ── 7. Optional: Give time for kernel to clean up resources ──────────────────
sleep 0.5

echo "Done."
