"""Kinematics helpers: numerical derivatives and simple NED ↔ altitude helpers."""

from __future__ import annotations

import math
from typing import Sequence


def moving_average(values: Sequence[float], window: int) -> list[float]:
    if window < 1 or not values:
        return list(values)
    w = min(window, len(values))
    out = []
    for i in range(len(values)):
        lo = max(0, i - w // 2)
        hi = min(len(values), i + w // 2 + 1)
        out.append(sum(values[lo:hi]) / (hi - lo))
    return out


def derivative_centered(
    t: Sequence[float], y: Sequence[float],
) -> tuple[list[float], list[float]]:
    """Return (t_mid, dy/dt) with central differences."""
    if len(t) < 3 or len(y) != len(t):
        return [], []
    out_t, out_d = [], []
    for i in range(1, len(t) - 1):
        dt = t[i + 1] - t[i - 1]
        if dt <= 1e-9:
            continue
        out_t.append(t[i])
        out_d.append((y[i + 1] - y[i - 1]) / dt)
    return out_t, out_d


def ned_z_to_altitude_m(z_ned: float) -> float:
    """PX4 NED: positive ``z`` is down; altitude is ``-z``."""
    return -float(z_ned)


class KinematicsEngine:
    """Numerical derivatives, light smoothing, and NED helpers."""

    moving_average = staticmethod(moving_average)
    derivative_centered = staticmethod(derivative_centered)
    ned_z_to_altitude_m = staticmethod(ned_z_to_altitude_m)
