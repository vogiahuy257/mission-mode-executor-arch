#include "adaptive_mission_mode/runtime/PauseResumeController.hpp"

namespace adaptive_mission_mode
{
namespace
{
constexpr double kRtlCommandIntervalSec = 3.0;
constexpr double kDisarmCommandIntervalSec = 1.0;

const char * phaseToString(PauseResumePhase phase)
{
  switch (phase) {
    case PauseResumePhase::None:
      return "none";

    case PauseResumePhase::ReturningRtl:
      return "pause_rtl";

    case PauseResumePhase::Disarming:
      return "pause_rtl_disarming";

    case PauseResumePhase::WaitingContinue:
      return "pause_wait_continue";

    case PauseResumePhase::ResumeRequested:
      return "pause_resume_requested";
  }

  return "unknown";
}
}  // namespace

void PauseResumeController::reset()
{
  phase_ = PauseResumePhase::None;
  lastRtlCommand_ = rclcpp::Time{};
  lastDisarmCommand_ = rclcpp::Time{};
}

void PauseResumeController::startPauseRtl(const rclcpp::Time & now)
{
  phase_ = PauseResumePhase::ReturningRtl;
  lastRtlCommand_ = now;
  lastDisarmCommand_ = rclcpp::Time{};
}

bool PauseResumeController::requestContinue()
{
  if (phase_ != PauseResumePhase::WaitingContinue) {
    return false;
  }

  phase_ = PauseResumePhase::ResumeRequested;
  return true;
}

PauseResumeAction PauseResumeController::update(const PauseResumeUpdate & input)
{
  PauseResumeAction action;

  if (phase_ == PauseResumePhase::None || phase_ == PauseResumePhase::ResumeRequested) {
    return action;
  }

  if (!input.resumeMissionPending && phase_ != PauseResumePhase::WaitingContinue) {
    reset();
    return action;
  }

  if (phase_ == PauseResumePhase::ReturningRtl) {
    if (!input.armed) {
      phase_ = PauseResumePhase::WaitingContinue;
      return action;
    }

    if (input.landed) {
      phase_ = PauseResumePhase::Disarming;
      action.sendDisarm = true;
      lastDisarmCommand_ = input.now;
      return action;
    }

    if (shouldSend(input.now, lastRtlCommand_, kRtlCommandIntervalSec)) {
      action.sendRtl = true;
    }

    return action;
  }

  if (phase_ == PauseResumePhase::Disarming) {
    if (!input.armed) {
      phase_ = PauseResumePhase::WaitingContinue;
      return action;
    }

    if (shouldSend(input.now, lastDisarmCommand_, kDisarmCommandIntervalSec)) {
      action.sendDisarm = true;
    }
  }

  return action;
}

void PauseResumeController::markResumeStarted()
{
  reset();
}

PauseResumePhase PauseResumeController::phase() const
{
  return phase_;
}

bool PauseResumeController::running() const
{
  return phase_ != PauseResumePhase::None;
}

bool PauseResumeController::waitingContinue() const
{
  return phase_ == PauseResumePhase::WaitingContinue;
}

bool PauseResumeController::resumeRequested() const
{
  return phase_ == PauseResumePhase::ResumeRequested;
}

std::string PauseResumeController::stateName() const
{
  return phaseToString(phase_);
}

nlohmann::json PauseResumeController::toJson() const
{
  return {
    {"active", running()},
    {"phase", phaseToString(phase_)},
    {"waiting_continue", waitingContinue()},
    {"resume_requested", resumeRequested()}};
}

bool PauseResumeController::shouldSend(
  const rclcpp::Time & now,
  rclcpp::Time & lastCommandTime,
  double intervalSec)
{
  if (lastCommandTime.nanoseconds() == 0) {
    lastCommandTime = now;
    return true;
  }

  if ((now - lastCommandTime).seconds() < intervalSec) {
    return false;
  }

  lastCommandTime = now;
  return true;
}

}  // namespace adaptive_mission_mode
