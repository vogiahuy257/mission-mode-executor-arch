/****************************************************************************
 * Adaptive Mission Mode - Manual altitude offset
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/altitude_offset.hpp"

#include <algorithm>

namespace adaptive_mission_mode
{

void AltitudeOffset::reset()
{
  offset_m_ = 0.0F;
  rate_m_s_ = 0.0F;
  active_ = false;
  last_update_ = {};
}

void AltitudeOffset::update(float throttle, bool enabled, std::chrono::steady_clock::time_point now)
{
  if (last_update_ == std::chrono::steady_clock::time_point{}) {
    last_update_ = now;
  }

  const float dt_s = std::clamp(
    std::chrono::duration<float>(now - last_update_).count(),
    0.0F,
    0.5F);
  last_update_ = now;

  rate_m_s_ = 0.0F;
  active_ = false;

  if (!enabled) {
    return;
  }

  const float stick = std::clamp(throttle, -1.0F, 1.0F);
  if (stick <= kDeadband) {
    return;
  }

  const float scale = (stick - kDeadband) / std::max(1.0F - kDeadband, 0.01F);
  rate_m_s_ = std::clamp(scale, 0.0F, 1.0F) * kMaxRateMps;
  offset_m_ = std::clamp(offset_m_ + rate_m_s_ * dt_s, 0.0F, kLimitM);
  active_ = true;
}

}  // namespace adaptive_mission_mode
