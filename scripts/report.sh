#!/usr/bin/env bash
set -euo pipefail

# report.sh — standardized entrypoint for generating HTML reports
#
# Usage:
#   ./scripts/report.sh --bag /path/to/rosbag2_dir
#   ./scripts/report.sh                         # auto-pick: newest log/sim/session_*/rosbag/* with metadata.yaml
#
# Environment:
#   ROS_DISTRO (default: jazzy)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROS_DISTRO="${ROS_DISTRO:-jazzy}"

bag=""
output=""

die(){ echo "ERROR: $*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bag) bag="${2:-}"; shift 2;;
    --output) output="${2:-}"; shift 2;;
    -h|--help)
      cat <<'EOF'
report.sh — generate pipeline HTML report

Options:
  --bag <dir>        Analyze an existing rosbag2 directory (or: make report BAG=<dir>)
  --output <file>    Output HTML path (optional)

Auto-pick uses **only** the newest log/sim/session_* folder: it must contain
rosbag/*/metadata.yaml. No fallback to older sessions (set BAG=… explicitly if needed).
EOF
      exit 0;;
    *) die "Unknown arg: $1";;
  esac
done

# Source ROS env (best-effort).
# ROS setup scripts may reference unset variables, which breaks under `set -u`.
set +u
if [[ -f "/opt/ros/${ROS_DISTRO}/setup.bash" ]]; then
  # shellcheck disable=SC1090
  source "/opt/ros/${ROS_DISTRO}/setup.bash"
fi
if [[ -f "${WS_DIR}/install/setup.bash" ]]; then
  # shellcheck disable=SC1090
  source "${WS_DIR}/install/setup.bash"
fi
set -u

# Newest sim session only — no reuse of older session bags (avoids silent stale reports).
pick_latest_bag() {
  local newest_sid="" newest_dir="" d sid
  shopt -s nullglob
  for d in "${WS_DIR}/log/sim/session_"*; do
    [[ -d "$d" ]] || continue
    [[ "$d" =~ session_([0-9]{8}_[0-9]{6})$ ]] || continue
    sid="${BASH_REMATCH[1]}"
    if [[ -z "$newest_sid" || "$sid" > "$newest_sid" ]]; then
      newest_sid="$sid"
      newest_dir="$d"
    fi
  done
  shopt -u nullglob

  if [[ -n "$newest_dir" ]]; then
    local meta="" picked=""
    shopt -s nullglob
    for meta in "${newest_dir}/rosbag/"*/metadata.yaml; do
      if [[ -f "$meta" ]]; then
        picked="$(dirname "$meta")"
        break
      fi
    done
    shopt -u nullglob
    # Force-killed recorder may leave *.mcap without metadata.yaml; pl_report can repair.
    if [[ -z "$picked" ]]; then
      shopt -s nullglob
      local d m
      for d in "${newest_dir}/rosbag/"*/; do
        [[ -d "$d" ]] || continue
        for m in "${d}"*.mcap; do
          if [[ -f "$m" ]]; then
            picked="${d%/}"
            break 2
          fi
        done
      done
      shopt -u nullglob
    fi
    if [[ -n "$picked" ]]; then
      echo "$picked"
      return 0
    fi
    echo "ERROR: No rosbag in newest sim session ${newest_sid}." >&2
    echo "       Expected: ${newest_dir}/rosbag/*/metadata.yaml or *.mcap under rosbag/*/" >&2
    echo "       Recorder log: ${newest_dir}/bg_rosbag.log" >&2
    echo "       Common causes: SKIP_BAG=1, ros2 bag record failed, or sim stopped before metadata was written." >&2
    echo "       Fix: make sim → fly → make sim-stop; or make report BAG=<rosbag2_dir>" >&2
    return 1
  fi

  # No log/sim/session_* — search rest of log/ for any rosbag metadata
  local p=""
  p="$(find "${WS_DIR}/log/" -name "metadata.yaml" \
    ! -path "*/.cache/*" -printf '%T@ %h\n' 2>/dev/null \
    | sort -rn | head -1 | cut -d" " -f2 || true)"
  if [[ -n "$p" ]]; then echo "$p"; return 0; fi
  local mcap=""
  mcap="$(find "${WS_DIR}/log/" -name "*.mcap" \
    ! -path "*/.cache/*" -printf '%T@ %p\n' 2>/dev/null \
    | sort -rn | head -1 | cut -d" " -f2 || true)"
  if [[ -n "$mcap" ]]; then dirname "$mcap"; return 0; fi
  echo "ERROR: No rosbag metadata under ${WS_DIR}/log/." >&2
  echo "       Expected either:" >&2
  echo "         - log/sim/session_*/rosbag/*/metadata.yaml (simulation), or" >&2
  echo "         - log/hw_run_*/metadata.yaml (hardware), or any other metadata.yaml under log/" >&2
  return 1
}

args=()
if [[ -n "$bag" ]]; then
  args+=(--bag "$bag")
else
  latest="$(pick_latest_bag)"
  echo "[report] Using bag: ${latest}" >&2
  args+=(--bag "$latest")
fi
if [[ -n "$output" ]]; then
  args+=(--output "$output")
fi

export PYTHONPATH="${WS_DIR}/scripts${PYTHONPATH:+:${PYTHONPATH}}"
exec python3 -m pl_report.cli "${args[@]}"

