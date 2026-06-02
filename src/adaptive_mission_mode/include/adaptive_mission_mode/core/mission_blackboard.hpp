/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <mutex>
#include <string>
#include <vector>

#include "adaptive_mission_mode/core/mission_types.hpp"

namespace adaptive_mission_mode
{

class MissionBlackboard
{
public:
  MissionBlackboard() = default;

  void setRuntimeState(MissionRuntimeState state);
  MissionRuntimeState runtimeState() const;

  void setVehicleState(const VehicleState & state);
  VehicleState vehicleState() const;

  void setManualControlState(const ManualControlState & state);
  ManualControlState manualControlState() const;

  void setManualAltitudeAssistState(const ManualAltitudeAssistState & state);
  ManualAltitudeAssistState manualAltitudeAssistState() const;

  void setMissionReady(bool ready, std::vector<std::string> errors);
  bool missionReady() const;
  std::vector<std::string> readinessErrors() const;

  void setMissionActive(bool active);
  bool missionActive() const;

  void setMissionStartInProgress(bool inProgress);
  bool missionStartInProgress() const;

  void setCurrentItemIndex(int index);
  int currentItemIndex() const;

  void setActiveBtBranch(const std::string & branchName);
  std::string activeBtBranch() const;

  void setLastError(const std::string & error);
  std::string lastError() const;

  MissionStatus status() const;

private:
  mutable std::mutex mutex_;
  MissionStatus status_{};
};

}  // namespace adaptive_mission_mode
