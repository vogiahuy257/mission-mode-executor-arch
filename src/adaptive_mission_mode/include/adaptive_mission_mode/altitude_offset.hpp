/****************************************************************************
 * Adaptive Mission Mode - Manual altitude offset
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <chrono>

namespace adaptive_mission_mode
{

class AltitudeOffset
{
public:
  void reset();
  void update(float throttle, bool enabled, std::chrono::steady_clock::time_point now);

  float value() const {return offset_m_;}
  float rate() const {return rate_m_s_;}
  bool active() const {return active_;}

private:
  static constexpr float kDeadband = 0.18F;
  static constexpr float kMaxRateMps = 2.0F;
  static constexpr float kLimitM = 50.0F;

  float offset_m_{0.0F};
  float rate_m_s_{0.0F};
  bool active_{false};
  std::chrono::steady_clock::time_point last_update_{};
};

}  // namespace adaptive_mission_mode
