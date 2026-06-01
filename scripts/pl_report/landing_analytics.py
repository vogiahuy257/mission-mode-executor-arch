"""High-level analytics façade over bag-derived structs."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .analytics_engine import compute_accuracy, recommended_analysis_window


@dataclass
class BagData:
    """Everything produced by :meth:`pl_report.data_provider.DataProvider.read_bag`."""

    topic_stats: dict
    latency: Any
    kf: Any
    det: Any
    ctrl: Any
    traj: Any
    vlp: Any
    vstatus: Any
    events: list


class LandingAnalytics:
    """Deep analytics entry point (Kalman health, control, vibration proxies)."""

    def __init__(self, data: BagData):
        self.data = data

    def compute_kalman_metrics(self, use_recommended_window: bool = True) -> dict[str, Any]:
        d = self.data
        t0 = t1 = None
        if use_recommended_window:
            t0, t1 = recommended_analysis_window(d.vstatus, d.ctrl)
        return compute_accuracy(d.det, d.kf, d.vlp, d.ctrl, d.traj, analysis_t0=t0, analysis_t1=t1)

    def compute_control_metrics(self, use_recommended_window: bool = True) -> dict[str, Any]:
        """Same bundle as Kalman path; control-specific keys live inside the dict."""
        return self.compute_kalman_metrics(use_recommended_window=use_recommended_window)
