"""Small numerical helpers for pipeline reports."""

import math


def stats_summary(values, unit="ms"):
    if not values:
        return {"n": 0, "mean": 0, "std": 0, "min": 0, "max": 0, "p50": 0, "p95": 0, "p99": 0}
    n = len(values)
    sv = sorted(values)
    mean = sum(sv) / n
    variance = sum((v - mean) ** 2 for v in sv) / n if n > 1 else 0
    return {
        "n": n,
        "mean": round(mean, 3),
        "std": round(math.sqrt(variance), 3),
        "min": round(sv[0], 3),
        "max": round(sv[-1], 3),
        "p50": round(sv[n // 2], 3),
        "p95": round(sv[int(n * 0.95)], 3),
        "p99": round(sv[int(n * 0.99)], 3),
    }


def _interp_nearest(ts_query, ts_ref, vals_ref):
    """Interpolate vals_ref at ts_query times using nearest-neighbor."""
    if not ts_ref or not vals_ref:
        return []
    result = []
    j = 0
    for tq in ts_query:
        while j < len(ts_ref) - 1 and abs(ts_ref[j+1] - tq) < abs(ts_ref[j] - tq):
            j += 1
        result.append(vals_ref[j])
    return result


def _filter_by_status(statuses, *arrays, valid=(1, 2)):
    """Filter parallel arrays to only include samples where status is in valid set."""
    indices = [i for i, s in enumerate(statuses) if s in valid]
    return tuple([arr[i] for i in indices] for arr in arrays)


def sanitize_controller_xy_error(ctrl, *, startup_s: float = 8.0, startup_max_m: float = 3.0, absurd_max_m: float = 80.0) -> None:
    """In-place: replace bogus ``xy_error`` samples with NaN.

    Filters:
      * Non-finite values
      * Sentinel / invalid readings (e.g. ``999``) via ``>= 990``
      * Absurd magnitudes (``> absurd_max_m``)
      * Strong startup spikes: within the first ``startup_s`` seconds from the first
        controller sample, any ``xy_error > startup_max_m`` is treated as uninitialized noise
    """
    if ctrl is None:
        return
    err = getattr(ctrl, "xy_error", None)
    ts = getattr(ctrl, "timestamps_s", None)
    if not err or not ts or len(err) != len(ts):
        return
    t0 = float(ts[0])
    for i in range(len(err)):
        try:
            e = float(err[i])
        except (TypeError, ValueError):
            err[i] = float("nan")
            continue
        if not math.isfinite(e):
            err[i] = float("nan")
            continue
        if e >= 990.0:
            err[i] = float("nan")
            continue
        if e > absurd_max_m:
            err[i] = float("nan")
            continue
        if (float(ts[i]) - t0) <= startup_s and e > startup_max_m:
            err[i] = float("nan")
            continue

