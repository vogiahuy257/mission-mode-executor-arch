# Adaptive Mission UI Frontend

React + Vite dashboard styled with Tailwind CSS.

What it does:

- polls backend mission and vehicle status
- builds MissionExecutor JSON missions
- saves missions through the backend
- starts missions through `/adaptive_mission_mode/start`
- supports one-click `Save + Start` for testing
- sends return-home/pause through `/adaptive_mission_mode/return_home`

## Run

```bash
cd ui/frontend
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:8000`.

## Tailwind

This frontend uses Tailwind CSS via `@tailwindcss/vite` and `src/index.css`.
