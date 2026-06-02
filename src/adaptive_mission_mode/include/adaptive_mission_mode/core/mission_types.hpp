/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <array>
#include <cstdint>
#include <string>
#include <vector>

namespace adaptive_mission_mode
{

enum class MissionRuntimeState : std::uint8_t
{
  Idle,
  Ready,
  Starting,
  Running,
  Completed,
  Failed,
};

struct VehicleState
{
  bool valid{false};
  bool armed{false};
  std::uint8_t navState{0U};
  std::array<float, 3> localPositionNed{0.0F, 0.0F, 0.0F};
  std::array<float, 3> localVelocityNed{0.0F, 0.0F, 0.0F};
  bool globalAltitudeAmslValid{false};
  float globalAltitudeAmslM{0.0F};
  float headingRad{0.0F};
  float distBottomM{0.0F};
  bool distBottomValid{false};
  double lastUpdateSec{0.0};
};

struct ManualControlState
{
  bool valid{false};
  float roll{0.0F};
  float pitch{0.0F};
  float throttle{0.0F};
  float yaw{0.0F};
  double lastUpdateSec{0.0};
};

struct ManualAltitudeAssistState
{
  bool enabled{true};
  bool active{false};
  float throttleInput{0.0F};
  float climbRateCommandMps{0.0F};
  float altitudeOffsetM{0.0F};
};

struct MissionStatus
{
  MissionRuntimeState runtimeState{MissionRuntimeState::Idle};
  VehicleState vehicleState{};
  ManualControlState manualControlState{};
  ManualAltitudeAssistState manualAltitudeAssistState{};
  bool missionReady{false};
  bool missionActive{false};
  bool missionStartInProgress{false};
  int currentItemIndex{-1};
  std::string activeBtBranch{"Idle"};
  std::string lastError{};
  std::vector<std::string> readinessErrors{};
};

const char * toString(MissionRuntimeState state);

}  // namespace adaptive_mission_mode
