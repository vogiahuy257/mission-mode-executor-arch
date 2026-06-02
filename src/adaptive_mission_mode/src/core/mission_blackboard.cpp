/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/core/mission_blackboard.hpp"

namespace adaptive_mission_mode
{

void MissionBlackboard::setRuntimeState(MissionRuntimeState state)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.runtimeState = state;
}

MissionRuntimeState MissionBlackboard::runtimeState() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.runtimeState;
}

void MissionBlackboard::setVehicleState(const VehicleState & state)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.vehicleState = state;
}

VehicleState MissionBlackboard::vehicleState() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.vehicleState;
}

void MissionBlackboard::setManualControlState(const ManualControlState & state)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.manualControlState = state;
}

ManualControlState MissionBlackboard::manualControlState() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.manualControlState;
}

void MissionBlackboard::setManualAltitudeAssistState(const ManualAltitudeAssistState & state)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.manualAltitudeAssistState = state;
}

ManualAltitudeAssistState MissionBlackboard::manualAltitudeAssistState() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.manualAltitudeAssistState;
}

void MissionBlackboard::setMissionReady(bool ready, std::vector<std::string> errors)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.missionReady = ready;
  status_.readinessErrors = std::move(errors);
  if (ready && status_.runtimeState == MissionRuntimeState::Idle) {
    status_.runtimeState = MissionRuntimeState::Ready;
  }
}

bool MissionBlackboard::missionReady() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.missionReady;
}

std::vector<std::string> MissionBlackboard::readinessErrors() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.readinessErrors;
}

void MissionBlackboard::setMissionActive(bool active)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.missionActive = active;
}

bool MissionBlackboard::missionActive() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.missionActive;
}

void MissionBlackboard::setMissionStartInProgress(bool inProgress)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.missionStartInProgress = inProgress;
}

bool MissionBlackboard::missionStartInProgress() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.missionStartInProgress;
}

void MissionBlackboard::setCurrentItemIndex(int index)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.currentItemIndex = index;
}

int MissionBlackboard::currentItemIndex() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.currentItemIndex;
}

void MissionBlackboard::setActiveBtBranch(const std::string & branchName)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.activeBtBranch = branchName;
}

std::string MissionBlackboard::activeBtBranch() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.activeBtBranch;
}

void MissionBlackboard::setLastError(const std::string & error)
{
  std::lock_guard<std::mutex> lock(mutex_);
  status_.lastError = error;
}

std::string MissionBlackboard::lastError() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_.lastError;
}

MissionStatus MissionBlackboard::status() const
{
  std::lock_guard<std::mutex> lock(mutex_);
  return status_;
}

}  // namespace adaptive_mission_mode
