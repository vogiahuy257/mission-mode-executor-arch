#!/usr/bin/env bash
# =============================================================================
# sim_launch.sh  –  MTPL Gazebo SITL multi-terminal launcher
#
# Infrastructure / silent processes run in the background with log capture:
#   BG – Micro-XRCE-DDS Agent      (PX4 ↔ ROS2 bridge)
#   BG – ros_gz_bridge              (camera/clock from Gazebo → ROS2)
#   BG – Gazebo Harmonic server     (physics simulation, headless)
#   BG – ros2 bag record            (→ log/sim/session_*/rosbag/flight_data for make report)
#
# NOTE: sim_tf_publisher.py is no longer used. TF is now managed entirely by
#       StateTfBridge (composable node in pipeline_container). Sim-specific
#       camera_frame and extrinsics are configured via sim_params.yaml.
#
# Xterm windows are opened ONLY for processes with useful live output:
#   Win 0 – PX4 SITL                (px4 console: arm/mode/status)
#   Win 1 – Precision Landing Stack  (composable node container)
#
# Optional:
#   Gazebo GUI                    (enable with GZ_GUI=1)
#
# Environment overrides (export before calling `make sim` or this script):
#   PX4_DIR        – PX4-Autopilot repo root (default: ~/Dev/Autopilot).
#                    Required: build/px4_sitl_default/bin/px4 and Gazebo assets under this tree.
#                    Example: export PX4_DIR=$HOME/PX4-Autopilot
#   ROS_DISTRO     – ROS2 distro          (default: jazzy)
#   XRCE_PORT      – uXRCE-DDS udp port   (default: 8888)
#   WS_DIR         – this workspace        (default: auto-detected)
#   SPAWN_POSE     – gz model spawn pose   (default: 0,0,0,0,0,0)
#   DELAY_BRIDGE_S – delay before bridge   (default: 9)
#   DELAY_STACK_S  – delay before nodes    (default: 14)
#   DELAY_BAG_S    – delay before rosbag   (default: DELAY_STACK_S+5, after vision stack)
#   SKIP_BAG       – set 1 to skip background rosbag (not recommended for make report)
#   GZ_GUI         – open Gazebo GUI       (default: 0 = headless)
#
# If PX4_DIR is missing/incomplete or `gz` is not on PATH, this script still starts
# MicroXRCE + precision_landing (and rosbag unless SKIP_BAG=1); it skips PX4 SITL /
# Gazebo/bridge and prints setup hints (PX4 v1.16 aligned with px4_msgs).
#
# Usage:
#   bash scripts/sim_launch.sh
#   GZ_GUI=1 bash scripts/sim_launch.sh
# =============================================================================
set -euo pipefail

# ── Path resolution ─────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS_DIR="${WS_DIR:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
PX4_DIR="${PX4_DIR:-${HOME}/Dev/Autopilot}"
ROS_DISTRO="${ROS_DISTRO:-jazzy}"
XRCE_PORT="${XRCE_PORT:-8888}"
SPAWN_POSE="${SPAWN_POSE:-0,0,0,0,0,0}"
DELAY_BRIDGE_S="${DELAY_BRIDGE_S:-9}"
DELAY_STACK_S="${DELAY_STACK_S:-20}"
DELAY_BAG_S="${DELAY_BAG_S:-$((DELAY_STACK_S + 5))}"
SKIP_BAG="${SKIP_BAG:-0}"
GZ_GUI="${GZ_GUI:-1}"

# Headless safety: only use xterm if we can actually talk to an X server.
# In some CI/sandbox setups DISPLAY is set but the server is unreachable.
HAS_DISPLAY=0
if [[ -n "${DISPLAY:-}" ]] && command -v xdpyinfo >/dev/null 2>&1; then
    if timeout 1 xdpyinfo >/dev/null 2>&1; then
        HAS_DISPLAY=1
    fi
fi

PX4_BUILD="${PX4_DIR}/build/px4_sitl_default"
PX4_BIN="${PX4_BUILD}/bin/px4"
PX4_GZ_MODELS="${PX4_DIR}/Tools/simulation/gz/models"
PX4_GZ_WORLDS="${PX4_DIR}/Tools/simulation/gz/worlds"
PX4_GZ_PLUGINS="${PX4_BUILD}/src/modules/simulation/gz_plugins"
PX4_GZ_SERVER_CFG="${PX4_DIR}/src/modules/simulation/gz_bridge/server.config"
ARUCO_WORLD_SDF="${PX4_GZ_WORLDS}/aruco.sdf"

# ── PX4 SITL + gz availability (non-fatal: stack still starts; sim pieces skipped) ─
PX4_EXPECT_VERSION="v1.16"
HAVE_PX4_SITL=1
HAVE_GZ=1
PX4_SKIP_REASON=""

if [[ ! -d "${PX4_DIR}" ]]; then
    HAVE_PX4_SITL=0
    PX4_SKIP_REASON="PX4_DIR is not a directory: ${PX4_DIR}"
elif [[ ! -x "${PX4_BIN}" ]]; then
    HAVE_PX4_SITL=0
    PX4_SKIP_REASON="PX4 SITL binary missing (build inside PX4): ${PX4_BIN}"
else
    for _need in "${ARUCO_WORLD_SDF}" "${PX4_GZ_MODELS}/x500_mono_cam_down" "${PX4_GZ_SERVER_CFG}"; do
        if [[ ! -e "${_need}" ]]; then
            HAVE_PX4_SITL=0
            PX4_SKIP_REASON="Missing PX4 file: ${_need}"
            break
        fi
    done
fi

if ! command -v gz >/dev/null 2>&1; then
    HAVE_GZ=0
fi

# ── Config files (precision_landing share/ or source tree) ─────────────────
_PKG_CFG="${WS_DIR}/install/precision_landing/share/precision_landing/config"
_SRC_CFG="${WS_DIR}/src/precision_landing/config"
_SIM_PKG="${_PKG_CFG}/sim"
_SIM_SRC="${_SRC_CFG}/sim"
WS_PARAMS="${_PKG_CFG}/params.yaml"
[[ -f "${WS_PARAMS}" ]] || WS_PARAMS="${_SRC_CFG}/params.yaml"
SIM_PARAMS="${_SIM_PKG}/sim_params.yaml"
[[ -f "${SIM_PARAMS}" ]] || SIM_PARAMS="${_SIM_SRC}/sim_params.yaml"
BRIDGE_YAML="${_SIM_PKG}/gz_bridge.yaml"
[[ -f "${BRIDGE_YAML}" ]] || BRIDGE_YAML="${_SIM_SRC}/gz_bridge.yaml"
ROSBAG_QOS="${_SIM_PKG}/rosbag_qos_overrides.yaml"
[[ -f "${ROSBAG_QOS}" ]] || ROSBAG_QOS="${_SIM_SRC}/rosbag_qos_overrides.yaml"

# ── Session logging ─────────────────────────────────────────────────────────
SESSION_ID="$(date +%Y%m%d_%H%M%S)"
LOG_DIR="${WS_DIR}/log/sim/session_${SESSION_ID}"

# ── Clear old sim logs ──────────────────────────────────────────────────────
# Keep only the last 5 sessions to save disk space.
SIM_LOG_BASE="${WS_DIR}/log/sim"
if [[ -d "${SIM_LOG_BASE}" ]]; then
    echo "Cleaning old sim sessions (keeping last 5)..."
    # Remove old session dirs, keep newest 5
    find "${SIM_LOG_BASE}" -maxdepth 1 -name 'session_*' -type d \
        | sort -r | tail -n +6 | xargs -r rm -rf
    # Remove stale latest symlink
    rm -f "${SIM_LOG_BASE}/latest"
fi

# Clean ROS 2 log cache from previous runs
if [[ -d "${HOME}/.ros/log" ]]; then
    find "${HOME}/.ros/log" -maxdepth 1 -mindepth 1 -type d -mmin +60 \
        | xargs -r rm -rf 2>/dev/null || true
fi

mkdir -p "${LOG_DIR}"
ln -sfn "${LOG_DIR}" "${WS_DIR}/log/sim/latest"

# ── Deferred warnings (after LOG_DIR exists) ────────────────────────────────
WARN_FILE="${LOG_DIR}/sim_setup_warnings.txt"
: > "${WARN_FILE}"
if [[ "${HAVE_PX4_SITL}" -ne 1 ]]; then
    cat >&2 <<EOF

================================================================================
WARNING: PX4 SITL không được khởi động tự động — tiếp tục chạy stack ROS (MicroXRCE + precision_landing).
  Lý do: ${PX4_SKIP_REASON:-unknown}

  Workspace này khớp PX4 Autopilot ${PX4_EXPECT_VERSION} (px4_msgs submodule release/1.16).

  Trên máy dev, cấu hình và build SITL:
    export PX4_DIR=/đường/dẫn/tới/PX4-Autopilot
    cd "\$PX4_DIR" && make px4_sitl_default

  Tài liệu: https://docs.px4.io/main/en/dev_setup/building_px4.html

  Sau đó chạy lại: make sim
  Hoặc mở terminal khác, tự chạy px4 SITL rồi dùng stack đã bật ở đây.
================================================================================

EOF
    {
        echo "PX4 SITL skipped: ${PX4_SKIP_REASON:-unknown}"
        echo "Expected: PX4 ${PX4_EXPECT_VERSION}, export PX4_DIR=... && cd \"\$PX4_DIR\" && make px4_sitl_default"
    } >> "${WARN_FILE}"
fi
if [[ "${HAVE_GZ}" -ne 1 ]]; then
    cat >&2 <<EOF

================================================================================
WARNING: Lệnh Gazebo \`gz\` không có trên PATH — bỏ qua gz-server / gz-bridge / gz GUI.
  Cài (Ubuntu 24.04 ví dụ): sudo apt install gz-harmonic
================================================================================

EOF
    echo "gz not in PATH — skipped Gazebo server/bridge/GUI. Install: sudo apt install gz-harmonic" >> "${WARN_FILE}"
fi

# ── Pre-flight validation (workspace + bridge; PX4 checked above) ───────────
for req in "${WS_PARAMS}" "${SIM_PARAMS}" "${BRIDGE_YAML}" "${ROSBAG_QOS}"; do
    [[ -e "${req}" ]] || { echo "ERROR: missing required file: ${req}" >&2; exit 1; }
done
command -v MicroXRCEAgent >/dev/null 2>&1 || { echo "ERROR: MicroXRCEAgent not in PATH" >&2; exit 1; }
if ss -tulpn 2>/dev/null | grep -q ":${XRCE_PORT} "; then
    echo "ERROR: Port ${XRCE_PORT} already in use. Kill existing MicroXRCEAgent first." >&2; exit 1
fi
if [[ "${HAS_DISPLAY}" == "1" ]]; then
    command -v xterm >/dev/null 2>&1 || { echo "ERROR: xterm not found (apt install xterm)" >&2; exit 1; }
else
    echo "NOTE: No usable X display — running headless (no xterm windows)."
fi
python3 -c "import yaml" 2>/dev/null || { echo "ERROR: PyYAML not found (apt install python3-yaml)" >&2; exit 1; }

# ── ROS sources helper ──────────────────────────────────────────────────────
# Written once, sourced by every per-process script.
ROS_SOURCE="${LOG_DIR}/ros_source.sh"
cat > "${ROS_SOURCE}" << ROSEOF
#!/usr/bin/env bash
set -eo pipefail
export TERM=xterm-256color
source /opt/ros/${ROS_DISTRO}/setup.bash
source "${WS_DIR}/install/setup.bash"   2>/dev/null || true
ROSEOF

# ── Background process launcher ─────────────────────────────────────────────
# make_bg <name> <delay_s>   body via stdin heredoc
# Writes a self-contained script and runs it in the background.
# Output is captured in <LOG_DIR>/<name>.log.
make_bg() {
    local name="$1"
    local delay_s="$2"
    local body; body="$(cat)"

    local ts="${LOG_DIR}/bg_${name}.sh"
    local tl="${LOG_DIR}/bg_${name}.log"

    cat > "${ts}" << BGEOF
#!/usr/bin/env bash
source "${ROS_SOURCE}"
echo "=== [${name}] started \$(date) ===" >> "${tl}"
[[ ${delay_s} -gt 0 ]] && sleep ${delay_s}
${body}
echo "=== [${name}] ended \$(date) ===" >> "${tl}"
BGEOF
    chmod +x "${ts}"
    bash "${ts}" >> "${tl}" 2>&1 &
    echo $! > "${LOG_DIR}/bg_${name}.pid"
    echo "  [bg] ${name}  (delay=${delay_s}s)  log: ${tl}"
}

# ── xterm window launcher ───────────────────────────────────────────────────
# make_win <name> <delay_s> <geometry>   body via stdin heredoc
# Opens a dedicated xterm window.  Stays open after process exits.
WIN_IDX=0
make_win() {
    local name="$1"
    local delay_s="$2"
    local geometry="${3:-140x35}"
    local body; body="$(cat)"

    local ts="${LOG_DIR}/win_${WIN_IDX}_${name}.sh"
    local tl="${LOG_DIR}/win_${WIN_IDX}_${name}.log"
    local ts_bg="${LOG_DIR}/bgwin_${WIN_IDX}_${name}.sh"

    cat > "${ts}" << WINEOF
#!/usr/bin/env bash
source "${ROS_SOURCE}"
echo "=== [${name}] started \$(date) ==="
[[ ${delay_s} -gt 0 ]] && echo "Waiting ${delay_s}s for dependencies..." && sleep ${delay_s}
${body}
echo ""
echo "=== [${name}] process exited \$(date). Press Enter to close. ==="
read -r _x
WINEOF
    chmod +x "${ts}"

    if [[ "${HAS_DISPLAY}" == "1" ]]; then
        xterm -T "[MTPL] ${name}" \
              -fa 'Monospace' -fs 10 \
              -geometry "${geometry}" \
              -e "bash '${ts}' 2>&1 | tee -a '${tl}'; echo ''; read -r _x" &
        echo "  [win] ${name}  (delay=${delay_s}s)"
    else
        # Headless: create a non-interactive variant (no 'read') and run in background.
        cat > "${ts_bg}" << BGEOW
#!/usr/bin/env bash
source "${ROS_SOURCE}"
echo "=== [${name}] started \$(date) ===" >> "${tl}"
[[ ${delay_s} -gt 0 ]] && sleep ${delay_s}
${body}
echo "=== [${name}] ended \$(date) ===" >> "${tl}"
BGEOW
        chmod +x "${ts_bg}"
        bash "${ts_bg}" >> "${tl}" 2>&1 &
        echo "  [bg-win] ${name}  (delay=${delay_s}s)  log: ${tl}"
    fi
    ((WIN_IDX++)) || true
}

# ══════════════════════════════════════════════════════════════════════════════
# BACKGROUND PROCESSES  (infrastructure + silent nodes – no terminal needed)
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo "Starting background processes..."

# ── Micro-XRCE-DDS Agent  (PX4 ↔ ROS2, UDP port 8888) ──────────────────────
make_bg "xrce-dds-agent" 0 << BGEOF
MicroXRCEAgent udp4 -p ${XRCE_PORT}
BGEOF

# Gazebo + bridge need PX4 world/model paths and the `gz` CLI
RUN_GZ_SIM=0
if [[ "${HAVE_PX4_SITL}" -eq 1 && "${HAVE_GZ}" -eq 1 ]]; then
    RUN_GZ_SIM=1
fi

# ── Gazebo Harmonic server  (headless – no GUI) ─────────────────────────────
if [[ "${RUN_GZ_SIM}" -eq 1 ]]; then
make_bg "gz-server" 0 << BGEOF
export GZ_SIM_RESOURCE_PATH="${PX4_GZ_MODELS}:${PX4_GZ_WORLDS}:\${GZ_SIM_RESOURCE_PATH:-}"
export GZ_SIM_SYSTEM_PLUGIN_PATH="${PX4_GZ_PLUGINS}:\${GZ_SIM_SYSTEM_PLUGIN_PATH:-}"
export GZ_SIM_SERVER_CONFIG_PATH="${PX4_GZ_SERVER_CFG}"
export GZ_IP=127.0.0.1
echo "Starting Gazebo Harmonic (-r run, -s server-only)..."
gz sim -r -s "${ARUCO_WORLD_SDF}"
BGEOF

# ── ros_gz_bridge  (camera/clock from gz → ROS2) ────────────────────────────
make_bg "gz-bridge" "${DELAY_BRIDGE_S}" << BGEOF
export GZ_IP=127.0.0.1
ros2 run ros_gz_bridge parameter_bridge --ros-args \
    -p config_file:="${BRIDGE_YAML}"
BGEOF
fi

# ── rosbag2 (minimal topics — scripts/pl_report/config.py RECORD_TOPICS) ───────
# No /pl/camera/image_raw (saves CPU + disk; camera_info keeps frame timestamps for latency).
# No /tf or vehicle_odometry* (unused in HTML report; VLP is enough for trajectory).
# Writes ${LOG_DIR}/rosbag/flight_data/metadata.yaml so make report picks this session.
if [[ "${SKIP_BAG}" != "1" ]]; then
make_bg "rosbag" "${DELAY_BAG_S}" << BGEOF
rm -rf "${LOG_DIR}/rosbag/flight_data"
mkdir -p "${LOG_DIR}/rosbag"
# Do not mkdir flight_data: ros2 bag record refuses a pre-existing output directory.
# --include-unpublished-topics: some topics (e.g. controller/status) appear only after mode engage;
# without this, the recorder may never open the bag or exit early.
# --qos-profile-overrides-path: align subscription with PX4/pl_estimator best_effort
# (field recording needs the same; default reliable would yield 0 msgs).
# exec python wrapper: non-interactive background bash ignores SIGINT; that disposition
# can survive exec, so ros2 bag never flushed. Wrapper resets INT/TERM then execv's ros2.
exec python3 "${WS_DIR}/scripts/exec_default_signals.py" ros2 bag record --output "${LOG_DIR}/rosbag/flight_data" --max-cache-size 40000000 \\
  --qos-profile-overrides-path "${ROSBAG_QOS}" \\
  --include-unpublished-topics \\
  --topics \\
  /pl/camera/camera_info \\
  /pl/detector/target \\
  /pl/estimator/target \\
  /pl/controller/status \\
  /fmu/in/trajectory_setpoint \\
  /fmu/out/vehicle_local_position \\
  /fmu/out/vehicle_local_position_v1 \\
  /fmu/out/vehicle_status_v1
BGEOF
fi

# NOTE: Target estimator now runs inside the composable container (see below)

# ── Gazebo GUI (optional) ───────────────────────────────────────────────────
if [[ "${RUN_GZ_SIM}" -eq 1 && "${GZ_GUI}" == "1" ]]; then
    make_bg "gz-gui" 3 << BGEOF
export GZ_SIM_RESOURCE_PATH="${PX4_GZ_MODELS}:${PX4_GZ_WORLDS}:\${GZ_SIM_RESOURCE_PATH:-}"
export GZ_IP=127.0.0.1
gz sim -g
BGEOF
fi

# ══════════════════════════════════════════════════════════════════════════════
# XTERM WINDOWS  (only nodes with useful live debug output)
# ══════════════════════════════════════════════════════════════════════════════
echo ""
echo "Opening debug terminal windows..."

# ── PX4 SITL  (arm status, mode changes, flight log) ────────────────────────
if [[ "${HAVE_PX4_SITL}" -eq 1 ]]; then
make_win "px4-sitl" 2 "140x35" << WINEOF
export PX4_GZ_STANDALONE=1
export PX4_SIMULATOR=gz
export PX4_SIM_MODEL=gz_x500_mono_cam_down
export PX4_GZ_WORLD=aruco
export PX4_GZ_MODEL_POSE="${SPAWN_POSE}"
export PX4_GZ_MODELS="${PX4_GZ_MODELS}"
export PX4_GZ_WORLDS="${PX4_GZ_WORLDS}"
export PX4_GZ_PLUGINS="${PX4_GZ_PLUGINS}"
export GZ_IP=127.0.0.1
export HEADLESS=1
cd "${PX4_BUILD}/rootfs"
"${PX4_BIN}" -d
WINEOF
else
    echo "  [skip] px4-sitl (see warnings above / ${WARN_FILE})"
fi

# ── Precision Landing Stack  (vision container + standalone controller) ───────
make_win "precision_landing" "${DELAY_STACK_S}" "140x35" << WINEOF
ros2 launch precision_landing system.launch.py \
    use_camera:=false \
    params_override:="${SIM_PARAMS}"
WINEOF

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo "  MTPL SITL launched"
echo "  Session : ${SESSION_ID}"
echo "  Log dir : ${LOG_DIR}/"
if [[ -s "${WARN_FILE}" ]]; then
    echo "  Warnings   : ${WARN_FILE}"
fi
echo ""
echo "  Background (logs):"
echo "    xrce-dds     : ${LOG_DIR}/bg_xrce-dds-agent.log"
if [[ "${RUN_GZ_SIM:-0}" -eq 1 ]]; then
    echo "    gz-server    : ${LOG_DIR}/bg_gz-server.log"
    echo "    gz-bridge    : ${LOG_DIR}/bg_gz-bridge.log"
else
    echo "    gz-server    : (skipped — need PX4 build + gz; see ${WARN_FILE})"
    echo "    gz-bridge    : (skipped)"
fi
echo "    tf_bridge    : inside pipeline_container (see precision_landing log)"
if [[ "${SKIP_BAG}" != "1" ]]; then
    echo "    rosbag       : ${LOG_DIR}/bg_rosbag.log → rosbag/flight_data/"
fi
if [[ "${RUN_GZ_SIM:-0}" -eq 1 && "${GZ_GUI}" == "1" ]]; then
    echo "    gz-gui       : (running)"
elif [[ "${GZ_GUI}" == "1" && "${RUN_GZ_SIM:-0}" -ne 1 ]]; then
    echo "    gz-gui       : (skipped — no Gazebo stack)"
fi
echo ""
echo "  Terminals (${WIN_IDX} windows):"
if [[ "${HAVE_PX4_SITL}" -eq 1 ]]; then
    echo "    px4-sitl            – PX4 console (arm, mode, status)"
else
    echo "    px4-sitl            – (skipped — start PX4 ${PX4_EXPECT_VERSION} manually; see ${WARN_FILE})"
fi
echo "    precision_landing   – Vision container + controller (isolated)"
echo ""
echo "  XRCE    : UDP port ${XRCE_PORT}"
echo "  Spawn   : ${SPAWN_POSE}"
echo "  GZ GUI  : ${GZ_GUI} (set GZ_GUI=0 for headless server+bridge only)"
echo "============================================================"
echo ""
echo "Quick commands:"
echo "  tail -f ${LOG_DIR}/bg_gz-server.log     # Watch Gazebo"
echo "  ros2 topic echo /pl/controller/status       # Watch FSM (LandingState)"
echo "  GZ_GUI=1 gz sim -g &                    # Open GUI later"
echo "  bash scripts/sim_stop.sh                # Kill everything (flushes bag)"
if [[ "${SKIP_BAG}" == "1" ]]; then
    echo "  (SKIP_BAG=1: no rosbag — make report needs BAG=… pointing at a bag dir)"
fi
