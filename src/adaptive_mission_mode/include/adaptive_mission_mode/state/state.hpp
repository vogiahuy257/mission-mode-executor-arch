/****************************************************************************
 * Adaptive Mission Mode - state base
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <px4_ros2/components/mode_executor.hpp>

namespace adaptive_mission_mode
{

class MissionRuntime;
class StateMachine;

class State
{
public:
  State(StateMachine & sm, MissionRuntime & rt) : sm_(sm), rt_(rt) {}
  virtual ~State() = default;

  virtual const char * name() const = 0;
  virtual void enter() {}
  virtual void exit() {}
  virtual void start() {}
  virtual void stop() {}
  virtual void pause() {}
  virtual void cont() {}
  virtual void status() {}
  virtual void readyArm(px4_ros2::Result) {}
  virtual void armTimeout() {}
  virtual void modeTimeout() {}
  virtual void active() {}
  virtual void inactive() {}
  virtual void done() {}

protected:
  StateMachine & sm_;
  MissionRuntime & rt_;
};

}  // namespace adaptive_mission_mode
