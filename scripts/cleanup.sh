#!/usr/bin/env bash
# =============================================================================
# cleanup.sh – Free disk space by removing old simulation logs / build artifacts
#
# Usage:
#   bash scripts/cleanup.sh              # Remove old sim sessions (keep latest 3)
#   bash scripts/cleanup.sh --all        # Remove ALL sim sessions + colcon build logs
#   bash scripts/cleanup.sh --keep 5     # Keep latest 5 sessions instead of 3
#   bash scripts/cleanup.sh --build      # Also clean build/ and install/ directories
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS_DIR="${WS_DIR:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
KEEP=${KEEP:-1}
CLEAN_BUILD=false
CLEAN_ALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)     CLEAN_ALL=true; shift ;;
    --build)   CLEAN_BUILD=true; shift ;;
    --keep)    KEEP="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: bash scripts/cleanup.sh [--all] [--build] [--keep N]"
      echo "  --all    Remove ALL sim sessions + colcon build logs"
      echo "  --build  Also clean build/ and install/ directories"
      echo "  --keep N Keep latest N sessions/reports (default: 1)"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

freed_bytes=0
count_removed=0

human_size() {
  local bytes=$1
  if (( bytes >= 1073741824 )); then
    printf "%.1f GB" "$(echo "scale=1; $bytes / 1073741824" | bc)"
  elif (( bytes >= 1048576 )); then
    printf "%.1f MB" "$(echo "scale=1; $bytes / 1048576" | bc)"
  elif (( bytes >= 1024 )); then
    printf "%.1f KB" "$(echo "scale=1; $bytes / 1024" | bc)"
  else
    printf "%d B" "$bytes"
  fi
}

# ── 1. Clean old simulation session logs ─────────────────────────────────────
SIM_LOG_DIR="${WS_DIR}/log/sim"
if [[ -d "${SIM_LOG_DIR}" ]]; then
  mapfile -t sessions < <(
    find "${SIM_LOG_DIR}" -maxdepth 1 -type d -name 'session_*' | sort
  )
  total=${#sessions[@]}

  if $CLEAN_ALL; then
    to_remove=("${sessions[@]}")
  elif (( total > KEEP )); then
    to_remove=("${sessions[@]:0:$((total - KEEP))}")
  else
    to_remove=()
  fi

  for sess in "${to_remove[@]}"; do
    sz=$(du -sb "$sess" 2>/dev/null | awk '{print $1}')
    echo "  rm: $(basename "$sess")  ($(human_size "${sz:-0}"))"
    rm -rf "$sess"
    freed_bytes=$((freed_bytes + ${sz:-0}))
    ((count_removed++)) || true
  done

  if (( count_removed > 0 )); then
    echo "[sim logs] Removed ${count_removed} session(s), kept latest ${KEEP}."
  else
    echo "[sim logs] Nothing to clean (${total} sessions, keep=${KEEP})."
  fi
else
  echo "[sim logs] No sim log directory found."
fi

# ── 1b. Clean old report directories ────────────────────────────────────────
REPORT_DIR="${WS_DIR}/log/report"
if [[ -d "${REPORT_DIR}" ]]; then
  mapfile -t reports < <(
    find "${REPORT_DIR}" -maxdepth 1 -type d -regex '.*/[0-9_]+' | sort
  )
  total_rpt=${#reports[@]}

  if $CLEAN_ALL; then
    rpt_remove=("${reports[@]}")
  elif (( total_rpt > KEEP )); then
    rpt_remove=("${reports[@]:0:$((total_rpt - KEEP))}")
  else
    rpt_remove=()
  fi

  for rpt in "${rpt_remove[@]}"; do
    sz=$(du -sb "$rpt" 2>/dev/null | awk '{print $1}')
    echo "  rm: report/$(basename "$rpt")  ($(human_size "${sz:-0}"))"
    rm -rf "$rpt"
    freed_bytes=$((freed_bytes + ${sz:-0}))
    ((count_removed++)) || true
  done

  if (( ${#rpt_remove[@]} > 0 )); then
    echo "[reports] Removed ${#rpt_remove[@]} old report(s), kept latest ${KEEP}."
  else
    echo "[reports] Nothing to clean (${total_rpt} reports, keep=${KEEP})."
  fi
fi

# ── 2. Clean old colcon build logs ───────────────────────────────────────────
COLCON_LOG="${WS_DIR}/log"
if [[ -d "${COLCON_LOG}" ]]; then
  mapfile -t build_logs < <(
    find "${COLCON_LOG}" -maxdepth 1 -type d -name 'build_*' | sort
  )
  mapfile -t list_logs < <(
    find "${COLCON_LOG}" -maxdepth 1 -type d -name 'list_*' | sort
  )
  for old_log in "${build_logs[@]}" "${list_logs[@]}"; do
    [[ -z "$old_log" ]] && continue
    sz=$(du -sb "$old_log" 2>/dev/null | awk '{print $1}')
    echo "  rm: $(basename "$old_log")  ($(human_size "${sz:-0}"))"
    rm -rf "$old_log"
    freed_bytes=$((freed_bytes + ${sz:-0}))
    ((count_removed++)) || true
  done
fi

# ── 3. Clean build/ and install/ directories (optional) ─────────────────────
if $CLEAN_BUILD; then
  for dir in "${WS_DIR}/build" "${WS_DIR}/install"; do
    if [[ -d "$dir" ]]; then
      sz=$(du -sb "$dir" 2>/dev/null | awk '{print $1}')
      echo "  rm: $(basename "$dir")/  ($(human_size "${sz:-0}"))"
      rm -rf "$dir"
      freed_bytes=$((freed_bytes + ${sz:-0}))
      ((count_removed++)) || true
    fi
  done
  echo "[build] Cleaned build/ and install/ directories."
fi

# ── 4. Drop filesystem caches (optional, needs sudo) ────────────────────────
if command -v sync &>/dev/null; then
  sync
fi

echo ""
echo "=========================================="
echo "  Cleanup complete"
echo "  Items removed : ${count_removed}"
echo "  Space freed   : $(human_size ${freed_bytes})"
echo "=========================================="
