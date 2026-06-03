/****************************************************************************
 * Adaptive Mission Mode - pause RTL helper
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#include "adaptive_mission_mode/pause_resume.hpp"

namespace adaptive_mission_mode
{

void PauseResume::reset()
{
  phase_ = PausePhase::Mission;
  point_.reset();
  index_.reset();
  need_takeoff_ = false;
}

bool PauseResume::pauseRtl(const Eigen::Vector3d & pos, int index)
{
  if (phase_ != PausePhase::Mission) {
    return false;
  }
  point_ = pos;
  index_ = index >= 0 ? index : 0;
  need_takeoff_ = false;
  phase_ = PausePhase::Rtl;
  return true;
}

bool PauseResume::cont(bool need_takeoff)
{
  if ((phase_ != PausePhase::Rtl && phase_ != PausePhase::Landed) || !point_) {
    return false;
  }
  need_takeoff_ = need_takeoff;
  phase_ = PausePhase::Return;
  return true;
}

void PauseResume::markTakeoffDone()
{
  need_takeoff_ = false;
}

void PauseResume::landed()
{
  if (phase_ == PausePhase::Rtl) {
    phase_ = PausePhase::Landed;
  }
}

void PauseResume::done()
{
  if (phase_ != PausePhase::Return) {
    return;
  }
  phase_ = PausePhase::Mission;
  point_.reset();
  index_.reset();
  need_takeoff_ = false;
  if (done_cb_) {
    done_cb_();
  }
}

void PauseResume::setDoneCb(std::function<void()> cb)
{
  done_cb_ = std::move(cb);
}

bool PauseResume::paused() const
{
  return phase_ == PausePhase::Rtl || phase_ == PausePhase::Landed || phase_ == PausePhase::Return;
}

std::string PauseResume::phaseName() const
{
  switch (phase_) {
    case PausePhase::Mission:
      return "mission";
    case PausePhase::Rtl:
      return "rtl_landing";
    case PausePhase::Landed:
      return "landed_wait_continue";
    case PausePhase::Return:
      return "return_pause_point";
  }
  return "unknown";
}

Eigen::Vector3d PauseResume::point() const
{
  return point_.value_or(Eigen::Vector3d::Zero());
}

}  // namespace adaptive_mission_mode
