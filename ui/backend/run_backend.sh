#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="$ROOT_DIR/ui/backend"

set +u
source /opt/ros/humble/setup.bash

if [[ -f "$ROOT_DIR/install/setup.bash" ]]; then
  source "$ROOT_DIR/install/setup.bash"
fi
set -u

cd "$BACKEND_DIR"

if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi

source .venv/bin/activate

if ! python3 -c "import fastapi, uvicorn, pydantic" >/dev/null 2>&1; then
  python3 -m pip install -r requirements.txt
fi

exec python3 -m uvicorn app.main:app --reload --host "${MISSION_UI_API_HOST:-0.0.0.0}" --port "${MISSION_UI_API_PORT:-8000}"
