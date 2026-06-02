#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to run the frontend." >&2
  exit 1
fi

cd "$FRONTEND_DIR"

if [[ ! -d node_modules ]]; then
  npm install
fi

exec npm run dev -- --host "${MISSION_UI_FRONTEND_HOST:-0.0.0.0}" --port "${MISSION_UI_FRONTEND_PORT:-5173}"
