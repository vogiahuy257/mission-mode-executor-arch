#!/usr/bin/env bash
# =============================================================================
# sim_stop.sh – Kill ALL MTPL simulation processes and free resources
#
# Usage:
#   bash scripts/sim_stop.sh           # Kill everything
#   bash scripts/sim_stop.sh --quiet   # Suppress per-process output
# =============================================================================
set -euo pipefail

QUIET=false
[[ "${1:-}" == "--quiet" ]] && QUIET=true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
XRCE_PORT="${XRCE_PORT:-8888}"
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

echo "Stopping MTPL SITL processes..."

# ── 0. Gracefully stop rosbag recorder (SIGINT → SIGTERM → SIGKILL) ──────────
# Prefer PID from sim_launch (bg_rosbag.pid + exec ros2): avoids matching multiple
# unrelated `ros2 bag record` processes and sends signals to the actual recorder.
bag_pid_file="${WS_DIR}/log/sim/latest/bg_rosbag.pid"
bag_stopped=0
if [[ -f "${bag_pid_file}" ]]; then
  bag_pid="$(head -n1 "${bag_pid_file}" | tr -d '[:space:]')"
  if [[ -n "${bag_pid}" ]] && kill -0 "${bag_pid}" 2>/dev/null; then
    $QUIET || echo "  stop: ros2 bag record  (pid=${bag_pid}) — flushing..."
    # SIGINT = graceful flush (works when recorder was started via exec_default_signals.py).
    kill -INT "${bag_pid}" 2>/dev/null || true
    for _i in $(seq 1 240); do
      kill -0 "${bag_pid}" 2>/dev/null || break
      sleep 0.5
    done
    if kill -0 "${bag_pid}" 2>/dev/null; then
      $QUIET || echo "  stop: ros2 bag record — SIGTERM (large cache flush)..."
      kill -TERM "${bag_pid}" 2>/dev/null || true
      for _i in $(seq 1 120); do
        kill -0 "${bag_pid}" 2>/dev/null || break
        sleep 0.5
      done
    fi
    if kill -0 "${bag_pid}" 2>/dev/null; then
      kill -9 "${bag_pid}" 2>/dev/null || true
      $QUIET || echo "  kill: ros2 bag record pid=${bag_pid} (force-killed, bag may be incomplete)"
    else
      $QUIET || echo "  stop: ros2 bag record — flushed OK"
    fi
    ((killed += 1)) || true
    bag_stopped=1
  fi
fi

if [[ "${bag_stopped}" -eq 0 ]]; then
  bag_pids=$(pgrep -f "ros2 bag record" 2>/dev/null || true)
  if [[ -n "$bag_pids" ]]; then
    $QUIET || echo "  stop: ros2 bag record  ($(echo "$bag_pids" | wc -w) proc, no pid file) — flushing..."
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
fi

# ── 1. Kill ROS2 nodes ──────────────────────────────────────────────────────
kill_pattern "precision_landing"  "precision_landing"
kill_pattern "sim_tf_publisher"  "sim_tf_publisher"
kill_pattern "parameter_bridge"  "parameter_bridge"

# ── 2. Kill PX4 SITL ────────────────────────────────────────────────────────
kill_pattern "px4 SITL"          "px4_sitl_default/bin/px4"

# ── 3. Kill Gazebo ───────────────────────────────────────────────────────────
kill_pattern "gz sim"            "gz sim"
kill_pattern "ruby gz"           "ruby.*gz"

# ── 4. Kill MicroXRCEAgent ──────────────────────────────────────────────────
kill_pattern "MicroXRCEAgent"    "MicroXRCEAgent"

# ── 5. Kill xterm windows (MTPL tagged) ─────────────────────────────────────
kill_pattern "xterm [MTPL]"      "xterm.*MTPL"

# ── 6. Free the XRCE UDP port ───────────────────────────────────────────────
if command -v fuser &>/dev/null; then
  fuser -k "${XRCE_PORT}/udp" 2>/dev/null || true
fi

# ── 7. Kill any remaining orphan gzserver processes ──────────────────────────
kill_pattern "gzserver"          "gzserver"

# ── 8. Brief wait then verify ────────────────────────────────────────────────
sleep 0.5
remaining=$(pgrep -f 'px4|gz sim|MicroXRCEAgent|precision_landing' 2>/dev/null | wc -l || true)

echo ""
echo "=========================================="
echo "  MTPL SITL stopped"
echo "  Processes killed : ${killed}"
if (( remaining > 0 )); then
  echo "  WARNING: ${remaining} process(es) may still be running"
  echo "  Try: pkill -9 -f 'px4|gz|MicroXRCE'"
else
  echo "  All processes terminated cleanly"
fi
echo "=========================================="
