#pragma once

#include <chrono>

namespace adaptive_mission_mode
{

struct AltitudeOffsetConfig
{
  float deadband{0.18F};

  float maxRateMps{2.0F};

  float limitM{50.0F};
};

class AltitudeOffsetController
{
public:
  explicit AltitudeOffsetController(AltitudeOffsetConfig config = {});

  // Reset toàn bộ offset và trạng thái điều khiển độ cao.
  void reset();

  // Cập nhật offset từ stick throttle, chỉ hoạt động khi node được phép điều khiển.
  void update(float throttleStick, bool enabled, std::chrono::steady_clock::time_point now);

  float offsetM() const;

  float rateMps() const;

  bool active() const;

private:
  AltitudeOffsetConfig config_{};

  float offsetM_{};

  float rateMps_{};

  bool active_{};

  std::chrono::steady_clock::time_point lastUpdate_{};
};

}  // namespace adaptive_mission_mode
