#include "adaptive_mission_mode/control/AltitudeOffsetController.hpp"

#include <algorithm>
#include <cmath>

namespace adaptive_mission_mode
{

AltitudeOffsetController::AltitudeOffsetController(AltitudeOffsetConfig config)
: config_(config)
{
}

// Reset toàn bộ offset và trạng thái điều khiển độ cao.
void AltitudeOffsetController::reset()
{
  offsetM_ = 0.0F;
  rateMps_ = 0.0F;
  active_ = false;
  lastUpdate_ = {};
}

// Cập nhật offset độ cao theo cần ga.
void AltitudeOffsetController::update(
  float throttleStick,
  bool enabled,
  std::chrono::steady_clock::time_point now)
{
  if (lastUpdate_ == std::chrono::steady_clock::time_point{}) {
    lastUpdate_ = now;
  }

  const float dt = std::clamp(
    std::chrono::duration<float>(now - lastUpdate_).count(),
    0.0F,
    0.5F);

  lastUpdate_ = now;
  rateMps_ = 0.0F;
  active_ = false;

  if (!enabled) {
    return;
  }

  const float stick = std::clamp(throttleStick, -1.0F, 1.0F);
  const float absStick = std::abs(stick);

  if (absStick <= config_.deadband) {
    return;
  }

  const float normalizedStick =
    (absStick - config_.deadband) / std::max(1.0F - config_.deadband, 0.01F);

  const float direction = stick > 0.0F ? 1.0F : -1.0F;

  const float commandedRateMps =
    direction * std::clamp(normalizedStick, 0.0F, 1.0F) * config_.maxRateMps;

  const float oldOffsetM = offsetM_;

  offsetM_ = std::clamp(
    offsetM_ + commandedRateMps * dt,
    0.0F,
    config_.limitM);

  if (dt > 0.0001F) {
    rateMps_ = (offsetM_ - oldOffsetM) / dt;
  }

  active_ = std::abs(rateMps_) > 0.0001F;
}

// Lấy offset độ cao hiện tại, đơn vị mét.
float AltitudeOffsetController::offsetM() const
{
  return offsetM_;
}

// Lấy tốc độ thay đổi offset, đơn vị m/s.
float AltitudeOffsetController::rateMps() const
{
  return rateMps_;
}

// Kiểm tra bộ điều khiển offset có đang tác động hay không.
bool AltitudeOffsetController::active() const
{
  return active_;
}

}  // namespace adaptive_mission_mode
