/****************************************************************************
 * Adaptive Mission Mode - pause RTL helper
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <functional>
#include <optional>
#include <string>

#include <Eigen/Eigen>

namespace adaptive_mission_mode
{

enum class PausePhase
{
  Mission,
  Rtl,
  Landed,
  Return,
};

class PauseResume
{
public:
  void reset();
  bool pauseRtl(const Eigen::Vector3d & pos, int index);
  bool cont(bool need_takeoff);
  void landed();
  void done();
  void setDoneCb(std::function<void()> cb);
  void markTakeoffDone();

  bool paused() const;
  bool mission() const {return phase_ == PausePhase::Mission;}
  bool rtl() const {return phase_ == PausePhase::Rtl;}
  bool landedWait() const {return phase_ == PausePhase::Landed;}
  bool returning() const {return phase_ == PausePhase::Return;}
  bool hasPoint() const {return point_.has_value();}
  bool hasIndex() const {return index_.has_value();}
  bool needTakeoff() const {return need_takeoff_;}

  std::string phaseName() const;
  Eigen::Vector3d point() const;
  std::optional<int> index() const {return index_;}

private:
  PausePhase phase_{PausePhase::Mission};
  std::optional<Eigen::Vector3d> point_{};
  std::optional<int> index_{};
  bool need_takeoff_{false};
  std::function<void()> done_cb_{};
};

}  // namespace adaptive_mission_mode
