# =============================================================================
# Makefile – colcon build for packages under src/ (precision_landing + deps)
#
# Resource-constrained build variables (override on Raspberry Pi 5 / laptop):
#   make build-safe PARALLEL_WORKERS=1 MAKE_JOBS=1
#
# GZ_VERSION controls which Gazebo version colcon passes to dependent packages.
#
# CORE_PACKAGES  – minimal flight stack (no simulation)
# ALL_PACKAGES   – full set
# =============================================================================

PARALLEL_WORKERS ?= 1
MAKE_JOBS        ?= 1
GZ_VERSION       ?= harmonic
COLCON_FLAGS     ?= --cmake-args -DCMAKE_BUILD_TYPE=Release

CORE_PACKAGES := precision_landing_msgs precision_landing
ALL_PACKAGES  := precision_landing_msgs precision_landing

# ── Default target ─────────────────────────────────────────────────────────
# Build flight packages + deps via --packages-up-to (skips e.g. vision_opencv).
.DEFAULT_GOAL := build-safe

# ─────────────────────────────────────────────────────────────────────────────
# Build with explicit resource limits (suitable for embedded targets or CI)
# ─────────────────────────────────────────────────────────────────────────────
build-safe:
	@echo "Building with constrained resources: workers=$(PARALLEL_WORKERS), make_jobs=$(MAKE_JOBS), gz=$(GZ_VERSION)"
	@GZ_VERSION=$(GZ_VERSION) MAKEFLAGS=-j$(MAKE_JOBS) \
		colcon build \
		--base-paths src \
		--parallel-workers $(PARALLEL_WORKERS) \
		--executor sequential \
		--event-handlers console_direct+ \
		--symlink-install \
		--packages-up-to $(ALL_PACKAGES) \
		$(COLCON_FLAGS)

# ─────────────────────────────────────────────────────────────────────────────
# Build only core flight packages + their dependencies
# (px4_msgs, px4_ros2_cpp, precision_landing_msgs → precision_landing)
# ─────────────────────────────────────────────────────────────────────────────
build-core-safe:
	@echo "Building core packages with constrained resources: workers=$(PARALLEL_WORKERS), make_jobs=$(MAKE_JOBS)"
	@GZ_VERSION=$(GZ_VERSION) MAKEFLAGS=-j$(MAKE_JOBS) \
		colcon build \
		--base-paths src \
		--parallel-workers $(PARALLEL_WORKERS) \
		--executor sequential \
		--event-handlers console_direct+ \
		--packages-up-to $(CORE_PACKAGES) \
		$(COLCON_FLAGS)

# ─────────────────────────────────────────────────────────────────────────────
# Build with testing enabled (runs colcon test after build)
# ─────────────────────────────────────────────────────────────────────────────
build-test:
	@echo "Building with BUILD_TESTING=ON: workers=$(PARALLEL_WORKERS), make_jobs=$(MAKE_JOBS)"
	@GZ_VERSION=$(GZ_VERSION) MAKEFLAGS=-j$(MAKE_JOBS) \
		colcon build \
		--base-paths src \
		--parallel-workers $(PARALLEL_WORKERS) \
		--executor sequential \
		--event-handlers console_direct+ \
		--packages-up-to $(CORE_PACKAGES) \
		--cmake-args -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON

# ─────────────────────────────────────────────────────────────────────────────
# Run unit tests (requires build-test first)
# ─────────────────────────────────────────────────────────────────────────────
test:
	@colcon test \
		--base-paths src \
		--packages-select $(CORE_PACKAGES) \
		--event-handlers console_direct+
	@colcon test-result --verbose

# ─────────────────────────────────────────────────────────────────────────────
# Start SITL simulation (see scripts/sim_launch.sh).
# Requires a built PX4 tree: export PX4_DIR=/path/to/PX4-Autopilot
#   (default ~/Dev/Autopilot). Build once: cd $PX4_DIR && make px4_sitl_default
# ─────────────────────────────────────────────────────────────────────────────
sim:
	@AUTO_CLEAN=$(AUTO_CLEAN) CLEAN_KEEP=$(CLEAN_KEEP) CLEAN_BUILD_ON_START=$(CLEAN_BUILD_ON_START) \
		bash scripts/sim_launch.sh

# ─────────────────────────────────────────────────────────────────────────────
# Stop all simulation processes
# ─────────────────────────────────────────────────────────────────────────────
sim-stop:
	@bash scripts/sim_stop.sh

# ─────────────────────────────────────────────────────────────────────────────
# Stop all 
# ─────────────────────────────────────────────────────────────────────────────
stop:
	@bash scripts/run_stop.sh

# ─────────────────────────────────────────────────────────────────────────────
# Run stack on real hardware (camera_ros + vision + controller).
# Prerequisites: source /opt/ros/jazzy/setup.bash, Micro-XRCE-DDS agent, camera working.
# Optional: PARAMS_OVERRIDE=/path/to/override.yaml make run
# ─────────────────────────────────────────────────────────────────────────────
PARAMS_OVERRIDE ?=
RUN_RECORD ?= 0
RUN_LOG_LEVEL ?= info
XRCE_START ?= 0
XRCE_DEV ?= /dev/ttyAMA0
XRCE_BAUD ?= 921600
XRCE_CMD ?= MicroXRCEAgent serial --dev $(XRCE_DEV) -b $(XRCE_BAUD)
RUN_BAG_TOPICS ?= \
	/pl/camera/camera_info \
	/pl/detector/target \
	/pl/estimator/target \
	/pl/controller/status \
	/tf /tf_static \
	/fmu/in/trajectory_setpoint \
	/fmu/out/vehicle_odometry
RUN_BAG_DIR ?= log/hw_run_$$(date +%Y%m%d_%H%M%S)
run:
	@bash -c 'set -euo pipefail; \
	  WS_DIR="$$(pwd)"; \
	  ROS_DISTRO="$${ROS_DISTRO:-jazzy}"; \
	  set +u; \
	  if [ -f "/opt/ros/$${ROS_DISTRO}/setup.bash" ]; then . "/opt/ros/$${ROS_DISTRO}/setup.bash"; fi; \
	  if [ -f "$${WS_DIR}/install/setup.bash" ]; then . "$${WS_DIR}/install/setup.bash"; fi; \
	  set -u; \
	  EXTRA=(); \
	  if [ -n "$(PARAMS_OVERRIDE)" ]; then \
	    EXTRA+=(params_override:="$(PARAMS_OVERRIDE)"); \
	  fi; \
	  XRCE_PID=""; \
	  REC_PID=""; \
	  LAUNCH_PID=""; \
	  stop_group() { \
	    NAME="$$1"; \
	    PID="$$2"; \
	    USE_SUDO="$${3:-0}"; \
	    if [ -z "$$PID" ]; then \
	      return 0; \
	    fi; \
	    if ! kill -0 -- "-$$PID" 2>/dev/null; then \
	      return 0; \
	    fi; \
	    echo "[run] Stopping $$NAME process group (pgid=$$PID)"; \
	    send_signal() { \
	      SIG="$$1"; \
	      if [ "$$USE_SUDO" = "1" ]; then \
	        sudo kill -s "$$SIG" -- "-$$PID" 2>/dev/null || true; \
	      else \
	        kill -s "$$SIG" -- "-$$PID" 2>/dev/null || true; \
	      fi; \
	    }; \
	    send_signal INT; \
	    for _i in $$(seq 1 30); do \
	      if ! kill -0 -- "-$$PID" 2>/dev/null; then \
	        wait "$$PID" 2>/dev/null || true; \
	        return 0; \
	      fi; \
	      sleep 0.1; \
	    done; \
	    echo "[run] $$NAME did not stop after SIGINT, sending SIGTERM"; \
	    send_signal TERM; \
	    for _i in $$(seq 1 20); do \
	      if ! kill -0 -- "-$$PID" 2>/dev/null; then \
	        wait "$$PID" 2>/dev/null || true; \
	        return 0; \
	      fi; \
	      sleep 0.1; \
	    done; \
	    echo "[run] $$NAME still alive, sending SIGKILL"; \
	    send_signal KILL; \
	    wait "$$PID" 2>/dev/null || true; \
	  }; \
	  cleanup() { \
	    trap - INT TERM EXIT; \
	    stop_group "ros2 launch" "$$LAUNCH_PID" 0; \
	    stop_group "rosbag recorder" "$$REC_PID" 0; \
	    stop_group "MicroXRCEAgent" "$$XRCE_PID" 1; \
	  }; \
	  trap cleanup INT TERM EXIT; \
	  if [ "$(XRCE_START)" = "1" ]; then \
	    echo "[run] Starting MicroXRCEAgent: $(XRCE_CMD)"; \
	    setsid sudo -n $(XRCE_CMD) & \
	    XRCE_PID="$$!"; \
	  fi; \
	  if [ "$(RUN_RECORD)" = "1" ]; then \
	    BAG_DIR="$(RUN_BAG_DIR)"; \
	    case "$$BAG_DIR" in /*) ;; *) BAG_DIR="$$WS_DIR/$$BAG_DIR";; esac; \
	    mkdir -p "$$(dirname "$$BAG_DIR")"; \
	    echo "[run] Recording rosbag to: $$BAG_DIR"; \
	    ROSBAG_QOS="$$WS_DIR/install/precision_landing/share/precision_landing/config/sim/rosbag_qos_overrides.yaml"; \
	    [ -f "$$ROSBAG_QOS" ] || ROSBAG_QOS="$$WS_DIR/src/precision_landing/config/sim/rosbag_qos_overrides.yaml"; \
	    setsid python3 "$$WS_DIR/scripts/exec_default_signals.py" ros2 bag record --output "$$BAG_DIR" --max-cache-size 40000000 \
	      --qos-profile-overrides-path "$$ROSBAG_QOS" \
	      --include-unpublished-topics \
	      --topics $(RUN_BAG_TOPICS) & \
	    REC_PID="$$!"; \
	  fi; \
	  RCUTILS_LOGGING_SEVERITY_THRESHOLD=$(RUN_LOG_LEVEL) \
	    setsid ros2 launch precision_landing system.launch.py use_camera:=true "$${EXTRA[@]}" & \
	  LAUNCH_PID="$$!"; \
	  wait "$$LAUNCH_PID" 2>/dev/null || true; \
	  LAUNCH_PID=""; \
	  cleanup'

run-debug:
	@$(MAKE) run RUN_RECORD=1 RUN_LOG_LEVEL=debug

# ─────────────────────────────────────────────────────────────────────────────
# Generate report from latest (or specified) rosbag
#   make report            → auto-find latest bag
#   make report BAG=path/  → use explicit bag path
# ─────────────────────────────────────────────────────────────────────────────
BAG ?=
report:
	@./scripts/report.sh $(if $(BAG),--bag "$(BAG)",)

# ─────────────────────────────────────────────────────────────────────────────
# Open the latest report in the default browser
# ─────────────────────────────────────────────────────────────────────────────
report-open:
	@bash -c '\
	  REPORT=$$(find log/ -name "report.html" -printf "%T@ %p\n" 2>/dev/null \
	    | sort -rn | head -1 | cut -d" " -f2); \
	  if [ -z "$$REPORT" ]; then echo "ERROR: No report found in log/"; exit 1; fi; \
	  echo "📄 Opening: $$REPORT"; \
	  xdg-open "$$REPORT" 2>/dev/null || echo "Cannot open browser — file: $$(realpath $$REPORT)"'

# ─────────────────────────────────────────────────────────────────────────────
# Tidy: remove old sim sessions (keep 1), build logs, and temp files
#   make tidy             → keep latest 1 session
#   make tidy KEEP=5      → keep latest 5
#   make tidy KEEP=0      → remove all sessions
# ─────────────────────────────────────────────────────────────────────────────
KEEP ?= 1
tidy:
	@bash scripts/cleanup.sh --keep $(KEEP)
	@find . -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
	@find . -name '*.pyc' -delete 2>/dev/null || true
	@find . -name '*~' -delete 2>/dev/null || true

# ─────────────────────────────────────────────────────────────────────────────
# Remove ALL build artefacts (build + install + logs)
# ─────────────────────────────────────────────────────────────────────────────
clean:
	@rm -rf build install log
	@find . -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
	@echo "All build artefacts removed."

.PHONY: build-safe build-core-safe build-test test run sim sim-stop report report-open tidy clean
