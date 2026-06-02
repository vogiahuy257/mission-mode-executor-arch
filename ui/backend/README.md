# Adaptive Mission UI Backend

FastAPI backend that bridges the web UI to ROS 2 topics used by `adaptive_mission_mode`.

What it does:

- publishes mission payloads to `/adaptive_mission_mode/mission_json`
- publishes activation payloads to `/adaptive_mission_mode/activate_json`
- reads PX4 vehicle status, global position, and battery state from DDS
- exposes a simple REST API for the frontend

## Prerequisites

- ROS 2 Humble sourced
- this workspace built so Python can import `px4_msgs`
- `adaptive_mission_mode` running

## Install

```bash
cd ui/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
source /opt/ros/humble/setup.bash
source install/setup.bash
cd ui/backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API

- `GET /api/health`
- `GET /api/status`
- `POST /api/mission`
- `POST /api/activate`
- `POST /api/mission/run`

## Environment

```bash
export MISSION_UI_CORS_ORIGINS=http://localhost:5173
export MISSION_UI_MISSION_TOPIC=/adaptive_mission_mode/mission_json
export MISSION_UI_ACTIVATE_TOPIC=/adaptive_mission_mode/activate_json
```
