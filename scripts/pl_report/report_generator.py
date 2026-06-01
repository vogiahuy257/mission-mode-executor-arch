"""Interactive Plotly HTML report (self-contained)."""
from __future__ import annotations

import math
import time
from pathlib import Path

import plotly.graph_objects as go
from plotly.subplots import make_subplots

from .interpretation import generate_interpretation
from .utils import _interp_nearest, stats_summary

C_GREEN  = '#3fb950'
C_BLUE   = '#58a6ff'
C_YELLOW = '#d29922'
C_RED    = '#f85149'
C_PURPLE = '#bc8cff'

_DARK = dict(
    paper_bgcolor='#161b22', plot_bgcolor='#161b22',
    font=dict(color='#c9d1d9', size=11),
    margin=dict(l=50, r=30, t=40, b=40),
    xaxis=dict(gridcolor='#21262d', zerolinecolor='#30363d'),
    yaxis=dict(gridcolor='#21262d', zerolinecolor='#30363d'),
    legend=dict(bgcolor='rgba(0,0,0,0)'),
)
_DARK_AXIS = dict(gridcolor='#21262d', zerolinecolor='#30363d')
_DARK_SCENE = dict(
    bgcolor='#161b22',
    xaxis=dict(gridcolor='#21262d', title='East (m)'),
    yaxis=dict(gridcolor='#21262d', title='North (m)'),
    zaxis=dict(gridcolor='#21262d', title='Alt (m)'),
)


def _plotly_script_tag() -> str:
    """
    Return HTML that makes Plotly available.

    Why: On some distros/installs, `plotly` Python ships without `plotly.min.js`,
    and `Figure.to_html(include_plotlyjs=True)` may *not* inline Plotly (it may
    only emit PlotlyConfig). That produces reports that look fine locally (if a
    viewer already has Plotly loaded) but render blank when copied elsewhere.
    """
    # 1) If the repo vendors plotly.min.js, prefer fully-offline reports.
    vendored = Path(__file__).resolve().parent / "vendor" / "plotly.min.js"
    if vendored.exists():
        return f'<script type="text/javascript">{vendored.read_text()}</script>\n'

    # 2) If plotly Python package includes the asset, inline it.
    try:
        import plotly as _plotly
        p = Path(_plotly.__file__).parent / "package_data" / "plotly.min.js"
        if p.exists():
            return f'<script type="text/javascript">{p.read_text()}</script>\n'
    except Exception:
        pass

    # 3) Last resort: use CDN (small file; requires internet).
    # Pinned version to avoid breaking changes.
    return '<script src="https://cdn.plot.ly/plotly-2.29.1.min.js"></script>\n'


def _plotly_card(fig, title="", full_width=False, height=420):
    """Render a Plotly figure as an HTML card div."""
    fig.update_layout(**_DARK, height=height)
    # Apply dark axis styling to ALL axes (yaxis2, yaxis3, etc. for subplots)
    for key in list(fig.layout.to_plotly_json().keys()):
        if key.startswith('xaxis') or key.startswith('yaxis'):
            fig.update_layout(**{key: _DARK_AXIS})
    div = fig.to_html(include_plotlyjs=False, full_html=False,
                      config=dict(responsive=True, displaylogo=False,
                                  modeBarButtonsToRemove=['lasso2d', 'select2d']))
    cls = "card card-full" if full_width else "card"
    h3 = f'<h3>{title}</h3>' if title else ''
    return f'<div class="{cls}">{h3}{div}</div>\n'


## NOTE: we intentionally avoid embedding “How to read” text into each chart.
## The report should be readable by visuals alone (mode shading + aligned timestamps).


def _ds(arr, n=2000):
    """Downsample a list for plotting."""
    if len(arr) <= n:
        return arr
    step = max(1, len(arr) // n)
    return arr[::step]


def generate_html(html_path: Path, topic_stats, latency, kf, det, ctrl, traj, vlp, vstatus, events,
                  accuracy, quality_score=100, quality_warnings=None):
    if quality_warnings is None:
        quality_warnings = []
    cam_det = stats_summary(latency.cam_to_det_ms)
    det_est = stats_summary(latency.det_to_est_ms)
    cam_est = stats_summary(latency.cam_to_est_ms)
    est_ctrl = stats_summary(latency.est_to_ctrl_ms)
    cam_ctrl = stats_summary(latency.cam_to_ctrl_ms)

    # Duration
    all_ts = []
    for key in topic_stats:
        if topic_stats[key].timestamps:
            all_ts.extend([topic_stats[key].timestamps[0], topic_stats[key].timestamps[-1]])
    duration_s = (max(all_ts) - min(all_ts)) / 1e9 if all_ts else 0

    innov = accuracy.get("innovation", {})
    landing = accuracy.get("landing", {})
    approach = accuracy.get("approach", {})
    vel_metrics = accuracy.get("velocity", {})
    phase_metrics = accuracy.get("phase_delay", {})
    motion_resp = accuracy.get("target_motion_response", {})

    # ── Derived series ────────────────────────────────────────────────────
    drone_speed = [math.sqrt(vx**2 + vy**2) for vx, vy in zip(vlp.vx, vlp.vy)]
    vlp_alt_enu = [-z for z in vlp.z]

    det_v_t, det_v_x, det_v_y, det_v_z = [], [], [], []
    for i, s in enumerate(det.statuses):
        if s != 0:
            det_v_t.append(det.timestamps_s[i])
            det_v_x.append(det.position_x[i])
            det_v_y.append(det.position_y[i])
            det_v_z.append(det.position_z[i])

    kf_v_t, kf_v_x, kf_v_y, kf_v_z = [], [], [], []
    for i, s in enumerate(kf.statuses):
        if s != 0:
            kf_v_t.append(kf.timestamps_s[i])
            kf_v_x.append(kf.position_x[i])
            kf_v_y.append(kf.position_y[i])
            kf_v_z.append(kf.position_z[i])

    det_total = sum(det.status_counts.values()) or 1
    det_rate = 100.0 * det.status_counts.get("DETECTED", 0) / det_total
    kf_total = sum(kf.status_counts.values()) or 1
    kf_track = 100.0 * (kf.status_counts.get("DETECTED", 0) + kf.status_counts.get("PREDICTED", 0)) / kf_total
    kf_conf_stats = stats_summary(kf.confidence, "")

    # ══════════════════════════════════════════════════════════════════════
    # Generate all Plotly charts (interactive)
    # ══════════════════════════════════════════════════════════════════════
    charts = {}

    # ── Flight mode shading (PX4 nav_state) ───────────────────────────────
    # Applied to time-series charts so you can “see” when mode changes.
    _NAV_COLORS = {
        0: "rgba(88,166,255,0.08)",   # MANUAL-ish
        2: "rgba(63,185,80,0.08)",    # ALTCTL-ish
        3: "rgba(210,153,34,0.08)",   # POSCTL-ish
        4: "rgba(248,81,73,0.08)",    # AUTO / mission / land-ish
    }
    def _nav_segments():
        if not vstatus or not vstatus.timestamps_s or not vstatus.nav_state:
            return []
        segs = []
        t = vstatus.timestamps_s
        s = vstatus.nav_state
        start = t[0]
        cur = s[0]
        for i in range(1, len(t)):
            if s[i] != cur:
                segs.append((start, t[i], cur))
                start = t[i]
                cur = s[i]
        segs.append((start, t[-1], cur))
        return segs

    def _fsm_ctrl_shapes():
        if not ctrl.timestamps_s:
            return []
        t, s = ctrl.timestamps_s, ctrl.states
        col = {
            0: "rgba(88,166,255,0.10)",
            1: "rgba(210,153,34,0.10)",
            2: "rgba(248,81,73,0.12)",
            3: "rgba(63,185,80,0.10)",
            4: "rgba(188,140,255,0.08)",
        }
        out = []
        t0 = t[0]
        cur = int(s[0])
        for i in range(1, len(t)):
            if int(s[i]) != cur:
                out.append(dict(
                    type="rect", xref="x", yref="paper",
                    x0=t0, x1=t[i], y0=0, y1=1,
                    fillcolor=col.get(cur, "rgba(139,148,158,0.06)"),
                    line=dict(width=0), layer="below",
                ))
                t0 = t[i]
                cur = int(s[i])
        out.append(dict(
            type="rect", xref="x", yref="paper",
            x0=t0, x1=t[-1], y0=0, y1=1,
            fillcolor=col.get(cur, "rgba(139,148,158,0.06)"),
            line=dict(width=0), layer="below",
        ))
        return out

    def _apply_mode_shading(fig):
        segs = _nav_segments()
        if not segs:
            return fig
        shapes = list(fig.layout.shapes) if fig.layout.shapes else []
        for t0, t1, nav in segs:
            col = _NAV_COLORS.get(nav, "rgba(139,148,158,0.06)")
            shapes.append(dict(
                type="rect",
                xref="x", yref="paper",
                x0=t0, x1=t1, y0=0, y1=1,
                fillcolor=col,
                line=dict(width=0),
                layer="below",
            ))
        fig.update_layout(shapes=shapes)
        return fig

    # ── Trajectory: Top-Down XY ───────────────────────────────────────
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=_ds(vlp.y), y=_ds(vlp.x), mode='lines',
                             line=dict(color=C_GREEN, width=2), name='Drone Path (VLP)'))
    if kf_v_y:
        # KF/detector positions are ROS odom ENU (x=east, y=north); match VLP NED→(east,north)=(y,x).
        fig.add_trace(go.Scatter(x=_ds(kf_v_x), y=_ds(kf_v_y), mode='lines',
                                 line=dict(color=C_YELLOW, width=2), name='Target (KF est.)'))
    if det_v_y:
        fig.add_trace(go.Scatter(x=_ds(det_v_x), y=_ds(det_v_y), mode='markers',
                                 marker=dict(color=C_BLUE, size=4, opacity=0.5), name='Target (Detector)'))
    fig.add_trace(go.Scatter(x=[0], y=[0], mode='markers',
                             marker=dict(color=C_RED, size=12, symbol='x'), name='Odom Origin'))
    fig.update_layout(xaxis_title='East (m)', yaxis_title='North (m)',
                      yaxis=dict(scaleanchor='x', scaleratio=1))
    charts['traj_xy'] = fig

    # ── Trajectory: 3D (FSM-colored drone path, pad plane, KF target) ───
    fig = go.Figure()
    STATE_LINE = {0: C_BLUE, 1: C_YELLOW, 2: C_RED, 3: C_GREEN, 4: C_PURPLE}
    if ctrl.timestamps_s and vlp.timestamps_s and len(vlp.timestamps_s) > 2:
        ci = 0
        cur_st = int(ctrl.states[0])
        buf_y, buf_x, buf_z = [], [], []
        for i, t in enumerate(vlp.timestamps_s):
            while ci + 1 < len(ctrl.timestamps_s) and ctrl.timestamps_s[ci + 1] <= t:
                ci += 1
            st = int(ctrl.states[min(ci, len(ctrl.states) - 1)])
            if st != cur_st and buf_y:
                fig.add_trace(
                    go.Scatter3d(
                        x=_ds(buf_y),
                        y=_ds(buf_x),
                        z=_ds(buf_z),
                        mode="lines",
                        line=dict(color=STATE_LINE.get(cur_st, "#8b949e"), width=4),
                        name=f"Drone FSM={cur_st}",
                        showlegend=sum(1 for tr in fig.data if tr.name and tr.name.startswith("Drone")) < 6,
                    )
                )
                buf_y, buf_x, buf_z = [], [], []
                cur_st = st
            buf_y.append(vlp.y[i])
            buf_x.append(vlp.x[i])
            buf_z.append(-vlp.z[i])
        if buf_y:
            fig.add_trace(
                go.Scatter3d(
                    x=_ds(buf_y),
                    y=_ds(buf_x),
                    z=_ds(buf_z),
                    mode="lines",
                    line=dict(color=STATE_LINE.get(cur_st, "#8b949e"), width=4),
                    name=f"Drone FSM={cur_st}",
                    showlegend=sum(1 for tr in fig.data if tr.name and tr.name.startswith("Drone")) < 6,
                )
            )
    else:
        fig.add_trace(
            go.Scatter3d(
                x=_ds(vlp.y),
                y=_ds(vlp.x),
                z=_ds(vlp_alt_enu),
                mode="lines",
                line=dict(color=C_GREEN, width=3),
                name="Drone Path",
            )
        )
    if kf_v_y:
        fig.add_trace(
            go.Scatter3d(
                x=_ds(kf_v_x),
                y=_ds(kf_v_y),
                z=_ds(kf_v_z),
                mode="lines",
                line=dict(color=C_YELLOW, width=3),
                name="Target (KF)",
            )
        )
    pad_r = 2.5
    pad_x = [-pad_r, pad_r, pad_r, -pad_r, -pad_r]
    pad_y = [-pad_r, -pad_r, pad_r, pad_r, -pad_r]
    pad_z = [0.0, 0.0, 0.0, 0.0, 0.0]
    fig.add_trace(
        go.Scatter3d(
            x=pad_y,
            y=pad_x,
            z=pad_z,
            mode="lines",
            line=dict(color="rgba(139,148,158,0.45)", width=3),
            name="Pad plane z=0",
        )
    )
    fig.add_trace(go.Scatter3d(x=[0], y=[0], z=[0], mode="markers",
                               marker=dict(color=C_RED, size=6, symbol='x'), name='Origin'))
    fig.update_layout(scene=_DARK_SCENE)
    charts['traj_3d'] = fig

    # ── Altitude ──────────────────────────────────────────────────────
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=_ds(vlp.timestamps_s), y=_ds(vlp_alt_enu),
                             mode='lines', line=dict(color=C_GREEN, width=2), name='Drone Alt (-z)'))
    fig.add_trace(go.Scatter(x=_ds(vlp.timestamps_s), y=_ds(vlp.dist_bottom),
                             mode='lines', line=dict(color=C_BLUE, width=1, dash='dot'), name='Dist Bottom'))
    fig.update_layout(xaxis_title='Time (s)', yaxis_title='Altitude (m)')
    _apply_mode_shading(fig)
    charts['traj_alt'] = fig

    # ── Heading ───────────────────────────────────────────────────────
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=_ds(vlp.timestamps_s),
                             y=_ds([h * 180 / math.pi for h in vlp.heading]),
                             mode='lines', line=dict(color=C_YELLOW, width=1)))
    fig.update_layout(xaxis_title='Time (s)', yaxis_title='Heading (deg)')
    _apply_mode_shading(fig)
    charts['traj_heading'] = fig

    # ── Speed ─────────────────────────────────────────────────────────
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=_ds(vlp.timestamps_s), y=_ds(drone_speed),
                             mode='lines', fill='tozeroy', line=dict(color=C_BLUE, width=1),
                             fillcolor='rgba(88,166,255,0.3)', name='Ground Speed'))
    fig.add_trace(go.Scatter(x=_ds(vlp.timestamps_s), y=_ds([-vz for vz in vlp.vz]),
                             mode='lines', line=dict(color=C_RED, width=1), name='Vertical Speed'))
    fig.update_layout(xaxis_title='Time (s)', yaxis_title='Speed (m/s)')
    _apply_mode_shading(fig)
    charts['traj_speed'] = fig

    # ── XY Error ──────────────────────────────────────────────────────
    if ctrl.timestamps_s:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(ctrl.timestamps_s), y=_ds(ctrl.xy_error),
                                 mode='lines', fill='tozeroy', line=dict(color=C_RED, width=2),
                                 fillcolor='rgba(248,81,73,0.3)', connectgaps=False))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='XY Distance (m)')
        _apply_mode_shading(fig)
        charts['traj_xyerr'] = fig

    # ── Approach ──────────────────────────────────────────────────────
    if approach:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(approach['timestamps_s']), y=_ds(approach['rel_x']),
                                 mode='lines', line=dict(color=C_BLUE, width=1), name='\u0394East (target\u2212drone)'))
        fig.add_trace(go.Scatter(x=_ds(approach['timestamps_s']), y=_ds(approach['rel_y']),
                                 mode='lines', line=dict(color=C_GREEN, width=1), name='\u0394North (target\u2212drone)'))
        fig.add_trace(go.Scatter(x=_ds(approach['timestamps_s']), y=_ds(approach['rel_xy']),
                                 mode='lines', fill='tozeroy', line=dict(color=C_YELLOW, width=2),
                                 fillcolor='rgba(210,153,34,0.2)', name='|\u0394XY| distance'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Relative Position (m)',
                          title=dict(text='Approach: target_pos \u2212 drone_pos \u2192 converges to 0 during landing',
                                     font=dict(size=11, color='#8b949e')))
        _apply_mode_shading(fig)
        charts['traj_approach'] = fig

    # ── Innovation time series ────────────────────────────────────────
    if innov:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(innov['timestamps_s']), y=_ds(innov['innov_x']),
                                 mode='lines', line=dict(color=C_BLUE, width=1), name='\u0394X'))
        fig.add_trace(go.Scatter(x=_ds(innov['timestamps_s']), y=_ds(innov['innov_y']),
                                 mode='lines', line=dict(color=C_GREEN, width=1), name='\u0394Y'))
        fig.add_trace(go.Scatter(x=_ds(innov['timestamps_s']), y=_ds(innov['innov_z']),
                                 mode='lines', line=dict(color=C_RED, width=1), name='\u0394Z'))
        fig.add_trace(go.Scatter(x=_ds(innov['timestamps_s']), y=_ds(innov['innov_xy']),
                                 mode='lines', line=dict(color=C_YELLOW, width=2), name='|\u0394XY|'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Innovation (m)')
        _apply_mode_shading(fig)
        charts['acc_innov_ts'] = fig

        # Innovation histogram
        fig = go.Figure()
        fig.add_trace(go.Histogram(x=_ds(innov['innov_xy']), nbinsx=50,
                                   marker_color=C_YELLOW, opacity=0.8, name='|\u0394XY|'))
        fig.add_trace(go.Histogram(x=_ds(innov['innov_3d']), nbinsx=50,
                                   marker_color=C_BLUE, opacity=0.5, name='|\u03943D|'))
        fig.update_layout(xaxis_title='Innovation (m)', yaxis_title='Count', barmode='overlay')
        charts['acc_innov_hist'] = fig

        # Innovation scatter
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(innov['innov_x']), y=_ds(innov['innov_y']),
                                 mode='markers', marker=dict(size=4, color=_ds(innov['timestamps_s']),
                                 colorscale='Viridis', opacity=0.7,
                                 colorbar=dict(title='Time (s)'))))
        fig.update_layout(xaxis_title='\u0394X (m)', yaxis_title='\u0394Y (m)',
                          yaxis=dict(scaleanchor='x', scaleratio=1))
        charts['acc_innov_scatter'] = fig

    # ── Detector jitter ───────────────────────────────────────────────
    if "det_noise" in accuracy:
        dn = accuracy["det_noise"]
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(dn['jitter_ts']), y=_ds(dn['jitter_x_ts']),
                                 mode='lines', line=dict(color=C_BLUE, width=1), name='\u03c3_X'))
        fig.add_trace(go.Scatter(x=_ds(dn['jitter_ts']), y=_ds(dn['jitter_y_ts']),
                                 mode='lines', line=dict(color=C_GREEN, width=1), name='\u03c3_Y'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Jitter \u03c3 (m)')
        charts['acc_det_jitter'] = fig

    # ── KF vs Detector: Position X ────────────────────────────────────
    if det_v_t or kf_v_t:
        fig = go.Figure()
        if det_v_t:
            fig.add_trace(go.Scatter(x=_ds(det_v_t), y=_ds(det_v_x), mode='markers',
                                     marker=dict(color=C_BLUE, size=4, opacity=0.5), name='Detector X (valid)'))
        if kf_v_t:
            fig.add_trace(go.Scatter(x=_ds(kf_v_t), y=_ds(kf_v_x), mode='lines',
                                     line=dict(color=C_YELLOW, width=2), name='KF X (valid)'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Target X Position (m)')
        _apply_mode_shading(fig)
        charts['kf_cmp_x'] = fig

        # Position Y
        fig = go.Figure()
        if det_v_t:
            fig.add_trace(go.Scatter(x=_ds(det_v_t), y=_ds(det_v_y), mode='markers',
                                     marker=dict(color=C_GREEN, size=4, opacity=0.5), name='Detector Y (valid)'))
        if kf_v_t:
            fig.add_trace(go.Scatter(x=_ds(kf_v_t), y=_ds(kf_v_y), mode='lines',
                                     line=dict(color=C_YELLOW, width=2), name='KF Y (valid)'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Target Y Position (m)')
        _apply_mode_shading(fig)
        charts['kf_cmp_y'] = fig

    # ── Confidence ────────────────────────────────────────────────────
    fig = go.Figure()
    if kf.timestamps_s:
        fig.add_trace(go.Scatter(x=_ds(kf.timestamps_s), y=_ds(kf.confidence),
                                 mode='lines', fill='tozeroy', line=dict(color=C_YELLOW, width=1),
                                 fillcolor='rgba(210,153,34,0.3)', name='KF Confidence'))
    if det.timestamps_s:
        fig.add_trace(go.Scatter(x=_ds(det.timestamps_s), y=_ds(det.confidence),
                                 mode='markers', marker=dict(color=C_BLUE, size=3), name='Det Confidence'))
    fig.update_layout(xaxis_title='Time (s)', yaxis_title='Confidence', yaxis_range=[-0.05, 1.15])
    _apply_mode_shading(fig)
    charts['kf_conf'] = fig

    # ── KF Velocity ───────────────────────────────────────────────────
    kf_vx_valid = [kf.velocity_x[i] for i, s in enumerate(kf.statuses) if s != 0]
    kf_vy_valid = [kf.velocity_y[i] for i, s in enumerate(kf.statuses) if s != 0]
    kf_vz_valid = [kf.velocity_z[i] for i, s in enumerate(kf.statuses) if s != 0]
    if kf_v_t:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(kf_v_t), y=_ds(kf_vx_valid), mode='lines',
                                 line=dict(color=C_BLUE, width=1), name='Vx (valid)'))
        fig.add_trace(go.Scatter(x=_ds(kf_v_t), y=_ds(kf_vy_valid), mode='lines',
                                 line=dict(color=C_GREEN, width=1), name='Vy (valid)'))
        fig.add_trace(go.Scatter(x=_ds(kf_v_t), y=_ds(kf_vz_valid), mode='lines',
                                 line=dict(color=C_RED, width=1), name='Vz (valid)'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Velocity (m/s)')
        _apply_mode_shading(fig)
        charts['kf_vel'] = fig

    # ── UAV (VLP) vs Kalman target velocity (see coupling when UAV moves) ──
    if vlp.timestamps_s and len(vlp.timestamps_s) > 5 and kf.timestamps_s and len(kf.timestamps_s) > 5:
        kf_t_all = list(kf.timestamps_s)
        kf_spd_xy = [
            math.hypot(float(kf.velocity_x[i]), float(kf.velocity_y[i]))
            for i in range(len(kf.timestamps_s))
        ]
        kf_vz_all = [float(kf.velocity_z[i]) for i in range(len(kf.timestamps_s))]
        vlp_spd_xy = [math.hypot(float(vx), float(vy)) for vx, vy in zip(vlp.vx, vlp.vy)]
        vlp_vz = [float(vz) for vz in vlp.vz]
        kf_sp_interp = _interp_nearest(vlp.timestamps_s, kf_t_all, kf_spd_xy)
        kf_vz_interp = _interp_nearest(vlp.timestamps_s, kf_t_all, kf_vz_all)
        fig = make_subplots(
            rows=2,
            cols=1,
            shared_xaxes=True,
            vertical_spacing=0.1,
            subplot_titles=(
                "Horizontal speed (m/s)",
                "Vertical velocity vz (m/s, NED: down +)",
            ),
        )
        fig.add_trace(
            go.Scatter(
                x=_ds(vlp.timestamps_s),
                y=_ds(vlp_spd_xy),
                mode="lines",
                name="UAV |Vxy| (VLP)",
                line=dict(color=C_GREEN, width=2),
            ),
            row=1,
            col=1,
        )
        fig.add_trace(
            go.Scatter(
                x=_ds(vlp.timestamps_s),
                y=_ds(kf_sp_interp),
                mode="lines",
                name="KF target |Vxy| (interp to UAV time)",
                line=dict(color=C_YELLOW, width=2),
            ),
            row=1,
            col=1,
        )
        fig.add_trace(
            go.Scatter(
                x=_ds(vlp.timestamps_s),
                y=_ds(vlp_vz),
                mode="lines",
                name="UAV vz (VLP)",
                line=dict(color=C_GREEN, width=1),
            ),
            row=2,
            col=1,
        )
        fig.add_trace(
            go.Scatter(
                x=_ds(vlp.timestamps_s),
                y=_ds(kf_vz_interp),
                mode="lines",
                name="KF target vz (interp)",
                line=dict(color=C_YELLOW, width=1),
            ),
            row=2,
            col=1,
        )
        fig.update_xaxes(title_text="Time (s)", row=2, col=1)
        fig.update_yaxes(title_text="m/s", row=1, col=1)
        fig.update_yaxes(title_text="m/s", row=2, col=1)
        fig.update_layout(
            height=520,
            legend=dict(bgcolor="rgba(0,0,0,0)"),
            title=dict(
                text=(
                    "UAV motion vs Kalman target velocity (same time base). "
                    "Fixed tag in world: when the UAV accelerates, the fused target velocity often shows "
                    "correlated transients / lag — useful to check estimator coupling."
                ),
                font=dict(size=11, color="#8b949e"),
            ),
        )
        _apply_mode_shading(fig)
        charts["uav_vs_kf_vel"] = fig

    # ── Target Z vs Drone Altitude ────────────────────────────────────
    fig = go.Figure()
    if kf_v_t:
        fig.add_trace(go.Scatter(x=_ds(kf_v_t), y=_ds(kf_v_z), mode='lines',
                                 line=dict(color=C_YELLOW, width=2), name='Target Z (KF valid)'))
    if det_v_t:
        fig.add_trace(go.Scatter(x=_ds(det_v_t), y=_ds(det_v_z), mode='markers',
                                 marker=dict(color=C_BLUE, size=4), name='Target Z (Det valid)'))
    fig.add_trace(go.Scatter(x=_ds(vlp.timestamps_s), y=_ds(vlp_alt_enu), mode='lines',
                             line=dict(color=C_GREEN, width=1, dash='dot'), name='Drone Alt (-z NED)'))
    fig.update_layout(xaxis_title='Time (s)', yaxis_title='Altitude / Z (m)')
    _apply_mode_shading(fig)
    charts['kf_z'] = fig

    # ── KF XY Phase Plot ──────────────────────────────────────────────
    fig = go.Figure()
    if kf_v_x:
        fig.add_trace(go.Scatter(x=_ds(kf_v_x), y=_ds(kf_v_y),
                                 mode='markers+lines',
                                 marker=dict(size=5, color=_ds(kf_v_t), colorscale='Viridis',
                                             colorbar=dict(title='t (s)')),
                                 line=dict(color=C_YELLOW, width=2),
                                 name='KF Target XY (valid, colored by time)'))
    if det_v_x:
        fig.add_trace(go.Scatter(x=_ds(det_v_x), y=_ds(det_v_y),
                                 mode='markers',
                                 marker=dict(size=4, color=_ds(det_v_t), colorscale='Blues',
                                             opacity=0.45),
                                 name='Detector Target XY (valid, colored by time)'))
    fig.add_trace(go.Scatter(x=[0], y=[0], mode='markers',
                             marker=dict(color=C_RED, size=12, symbol='x'), name='Origin'))
    fig.update_layout(title=dict(text='Target XY trajectory (NOT phase delay). Color = time.',
                                 font=dict(size=11, color='#8b949e')),
                      xaxis_title='Target X (m)', yaxis_title='Target Y (m)',
                      yaxis=dict(scaleanchor='x', scaleratio=1))
    charts['kf_phase'] = fig

    # ── Velocity comparison ───────────────────────────────────────────
    if vel_metrics:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['kf_vel_t']), y=_ds(vel_metrics['kf_vx']),
                                 mode='lines', line=dict(color=C_YELLOW, width=2), name='KF Vx'))
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['kf_vel_t']), y=_ds(vel_metrics['kf_vy']),
                                 mode='lines', line=dict(color=C_GREEN, width=2), name='KF Vy'))
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['det_vel_t']), y=_ds(vel_metrics['det_vx_num']),
                                 mode='markers', marker=dict(color=C_YELLOW, size=3, opacity=0.3), name='Det dX/dt'))
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['det_vel_t']), y=_ds(vel_metrics['det_vy_num']),
                                 mode='markers', marker=dict(color=C_GREEN, size=3, opacity=0.3), name='Det dY/dt'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Velocity (m/s)',
                          title=dict(text='KF velocity (lines) vs detector numerical derivative (dots)',
                                     font=dict(size=11, color='#8b949e')))
        charts['vel_cmp'] = fig

        # Speed magnitude
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['kf_vel_t']), y=_ds(vel_metrics['kf_speed']),
                                 mode='lines', fill='tozeroy', line=dict(color=C_YELLOW, width=2),
                                 fillcolor='rgba(210,153,34,0.2)', name='KF |V_xy|'))
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['det_vel_t']), y=_ds(vel_metrics['det_speed_num']),
                                 mode='markers', marker=dict(color=C_BLUE, size=3, opacity=0.3), name='Det |dXY/dt|'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Speed (m/s)')
        charts['vel_speed'] = fig

        # Velocity error
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['det_vel_t']), y=_ds(vel_metrics['vel_err_x']),
                                 mode='lines', line=dict(color=C_BLUE, width=1), name='\u0394Vx (KF\u2212Det)'))
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['det_vel_t']), y=_ds(vel_metrics['vel_err_y']),
                                 mode='lines', line=dict(color=C_GREEN, width=1), name='\u0394Vy (KF\u2212Det)'))
        fig.add_trace(go.Scatter(x=_ds(vel_metrics['det_vel_t']), y=_ds(vel_metrics['vel_err_xy']),
                                 mode='lines', line=dict(color=C_RED, width=2), name='|\u0394V_xy|'))
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='Velocity Error (m/s)')
        charts['vel_err'] = fig

    # ── Cross-correlation ─────────────────────────────────────────────
    if phase_metrics:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=phase_metrics['xcorr_lags_ms'], y=phase_metrics['xcorr_norm_x'],
                                 mode='lines', line=dict(color=C_BLUE, width=2), name='X-axis'))
        fig.add_trace(go.Scatter(x=phase_metrics['xcorr_lags_ms'], y=phase_metrics['xcorr_norm_y'],
                                 mode='lines', line=dict(color=C_GREEN, width=2), name='Y-axis'))
        fig.add_trace(go.Scatter(x=[phase_metrics['x_ms']], y=[1.0], mode='markers',
                                 marker=dict(color=C_BLUE, size=10, symbol='diamond'),
                                 name=f"Peak X ({phase_metrics['x_ms']}ms)"))
        fig.add_trace(go.Scatter(x=[phase_metrics['y_ms']], y=[1.0], mode='markers',
                                 marker=dict(color=C_GREEN, size=10, symbol='diamond'),
                                 name=f"Peak Y ({phase_metrics['y_ms']}ms)"))
        fig.add_vline(x=0, line=dict(color=C_RED, dash='dash', width=1), opacity=0.5)
        fig.update_layout(xaxis_title='Lag (ms) \u2014 positive = KF lags behind detector',
                          yaxis_title='Normalized Cross-Correlation',
                          title=dict(text='Phase delay: peak at lag = KF delay vs detector',
                                     font=dict(size=11, color='#8b949e')))
        charts['vel_xcorr'] = fig

        # ── Phase delay visual overlay (time domain) ───────────────────────
        # Show detector X and KF X shifted by estimated lag to make phase delay visible.
        # This is a "see it" plot: if lag is real, curves align after shifting.
        try:
            lag_s = float(phase_metrics.get("x_ms", 0.0)) / 1000.0
        except Exception:
            lag_s = 0.0
        if lag_s != 0.0 and det_v_t and kf_v_t:
            # Build uniform time window where both series exist
            t_start = max(det_v_t[0], kf_v_t[0] - lag_s)
            t_end = min(det_v_t[-1], kf_v_t[-1] - lag_s)
            if t_end - t_start > 0.5:
                n = int((t_end - t_start) * 100)
                n = max(50, min(n, 2000))
                t_u = [t_start + (t_end - t_start) * i / (n - 1) for i in range(n)]
                det_x_u = _interp_nearest(t_u, det_v_t, det_v_x)
                kf_x_u = _interp_nearest([t + lag_s for t in t_u], kf_v_t, kf_v_x)
                fig = go.Figure()
                fig.add_trace(go.Scatter(x=_ds(t_u), y=_ds(det_x_u),
                                         mode="lines", line=dict(color=C_BLUE, width=1),
                                         name="Detector X (ref)"))
                fig.add_trace(go.Scatter(x=_ds(t_u), y=_ds(kf_x_u),
                                         mode="lines", line=dict(color=C_YELLOW, width=2),
                                         name=f"KF X shifted by {phase_metrics.get('x_ms',0)} ms"))
                fig.update_layout(xaxis_title="Time (s)", yaxis_title="Target X (m)",
                                  title=dict(text="Phase delay visualization (time-domain alignment)",
                                             font=dict(size=11, color="#8b949e")))
                _apply_mode_shading(fig)
                charts["phase_align_x"] = fig

    # ── Target motion response (moving target readiness) ────────────────
    if motion_resp and motion_resp.get("t_u"):
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(motion_resp["t_u"]), y=_ds(motion_resp["det_speed_u"]),
                                 mode="lines", line=dict(color=C_BLUE, width=1), name="Det speed (smoothed)"))
        fig.add_trace(go.Scatter(x=_ds(motion_resp["t_u"]), y=_ds(motion_resp["kf_speed_u"]),
                                 mode="lines", line=dict(color=C_YELLOW, width=2), name="KF speed"))
        for e in motion_resp.get("events", [])[:20]:
            fig.add_vline(x=e["t_start"], line=dict(color=C_RED, dash="dot", width=1), opacity=0.7)
            if e.get("settle_time_ms") is not None:
                # show settle time as annotation
                fig.add_annotation(
                    x=e["t_start"], y=max(max(motion_resp["det_speed_u"]), 0.1),
                    text=f"{e['settle_time_ms']}ms",
                    showarrow=False, font=dict(size=10, color="#8b949e"),
                    yshift=10
                )
        fig.update_layout(
            xaxis_title="Time (s)",
            yaxis_title="Speed |v_xy| (m/s)",
            title=dict(text="KF reaction to target speed changes (settling time)", font=dict(size=11, color="#8b949e")),
        )
        _apply_mode_shading(fig)
        charts["motion_response"] = fig

    # ── Latency histogram ─────────────────────────────────────────────
    fig = go.Figure()
    if latency.cam_to_det_ms:
        fig.add_trace(go.Histogram(x=_ds(latency.cam_to_det_ms), nbinsx=50,
                                   marker_color=C_BLUE, opacity=0.7, name='Cam\u2192Det'))
    if latency.det_to_est_ms:
        fig.add_trace(go.Histogram(x=_ds(latency.det_to_est_ms), nbinsx=50,
                                   marker_color=C_GREEN, opacity=0.7, name='Det\u2192Est'))
    if latency.cam_to_est_ms:
        fig.add_trace(go.Histogram(x=_ds(latency.cam_to_est_ms), nbinsx=50,
                                   marker_color=C_YELLOW, opacity=0.7, name='Cam\u2192Est'))
    if latency.cam_to_ctrl_ms:
        fig.add_trace(go.Histogram(x=_ds(latency.cam_to_ctrl_ms), nbinsx=50,
                                   marker_color=C_RED, opacity=0.7, name='Cam\u2192Ctrl(E2E)'))
    fig.update_layout(xaxis_title='Latency (ms)', yaxis_title='Count', barmode='overlay')
    charts['lat_hist'] = fig

    # ── Latency timeseries ────────────────────────────────────────────
    fig = go.Figure()
    if latency.cam_to_ctrl_ms and latency.cam_to_ctrl_timestamps_s:
        fig.add_trace(go.Scatter(x=_ds(latency.cam_to_ctrl_timestamps_s), y=_ds(latency.cam_to_ctrl_ms), mode='lines',
                                 line=dict(color=C_RED, width=1), name='Cam\u2192Ctrl(E2E)'))
    if latency.cam_to_est_ms and latency.cam_to_est_timestamps_s:
        fig.add_trace(go.Scatter(x=_ds(latency.cam_to_est_timestamps_s), y=_ds(latency.cam_to_est_ms), mode='lines',
                                 line=dict(color=C_YELLOW, width=1), name='Cam\u2192Est(fresh)'))
    # cam_to_det has no timestamp list (computed on detector messages); show it index-based only if nothing else exists
    if (not latency.cam_to_ctrl_timestamps_s) and (not latency.cam_to_est_timestamps_s) and latency.cam_to_det_ms:
        fig.add_trace(go.Scatter(y=_ds(latency.cam_to_det_ms), mode='lines',
                                 line=dict(color=C_BLUE, width=1), name='Cam\u2192Det'))
        fig.update_layout(xaxis_title='Sample', yaxis_title='ms')
    else:
        fig.update_layout(xaxis_title='Time (s)', yaxis_title='ms')
    charts['lat_ts'] = fig
    _apply_mode_shading(fig)

    # ── Controller charts ─────────────────────────────────────────────
    if ctrl.timestamps_s:
        # FSM + XY Error (dual axis)
        fig = make_subplots(specs=[[{"secondary_y": True}]])
        fig.add_trace(go.Scatter(x=_ds(ctrl.timestamps_s), y=_ds(ctrl.states), mode='lines+markers',
                                 line=dict(color=C_BLUE, width=2), marker=dict(size=3),
                                 name='FSM State'), secondary_y=False)
        fig.add_trace(go.Scatter(x=_ds(ctrl.timestamps_s), y=_ds(ctrl.xy_error), mode='lines',
                                 line=dict(color=C_RED, width=1), name='XY Error (m)', connectgaps=False), secondary_y=True)
        fig.update_yaxes(title_text='State', secondary_y=False,
                         tickvals=[0, 1, 2, 3, 4],
                         ticktext=['SEARCH', 'ALIGN', 'DESCEND', 'LANDED', 'RTL'],
                         range=[-0.3, 4.3], dtick=1)
        fig.update_yaxes(title_text='XY Error (m)', secondary_y=True,
                         rangemode='tozero')
        fig.update_xaxes(title_text='Time (s)')
        _apply_mode_shading(fig)
        charts['ctrl_fsm'] = fig

        # Altitude + Confidence (dual axis)
        fig = make_subplots(specs=[[{"secondary_y": True}]])
        fig.add_trace(go.Scatter(x=_ds(ctrl.timestamps_s), y=_ds(ctrl.altitude), mode='lines',
                                 line=dict(color=C_GREEN, width=2), name='Altitude (m)'), secondary_y=False)
        fig.add_trace(go.Scatter(x=_ds(ctrl.timestamps_s), y=_ds(ctrl.target_confidence), mode='lines',
                                 line=dict(color=C_YELLOW, width=1), name='Confidence'), secondary_y=True)
        fig.update_yaxes(title_text='Altitude (m)', secondary_y=False)
        fig.update_yaxes(title_text='Confidence', range=[-0.05, 1.15], secondary_y=True)
        fig.update_xaxes(title_text='Time (s)')
        _apply_mode_shading(fig)
        charts['ctrl_alt'] = fig

        # Descent profile
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(ctrl.xy_error), y=_ds(ctrl.altitude), mode='lines',
                                 line=dict(color=C_GREEN, width=1), opacity=0.5, showlegend=False,
                                 connectgaps=False))
        fig.add_trace(go.Scatter(x=_ds(ctrl.xy_error), y=_ds(ctrl.altitude), mode='markers',
                                 marker=dict(size=5, color=_ds(ctrl.timestamps_s),
                                             colorscale='Viridis', colorbar=dict(title='Time (s)')),
                                 showlegend=False))
        fig.update_layout(xaxis_title='XY Error (m)', yaxis_title='Altitude (m)',
                          title=dict(text='Descent funnel (sanitized XY error; lower-left = good landing)',
                                     font=dict(size=11, color='#8b949e')))
        charts['ctrl_descent'] = fig

    # ── VLP gaps ──────────────────────────────────────────────────────
    vlp_ts = topic_stats.get("vlp")
    if vlp_ts and vlp_ts.gaps_ms:
        fig = go.Figure()
        fig.add_trace(go.Histogram(x=_ds(vlp_ts.gaps_ms, 5000), nbinsx=50, marker_color=C_BLUE))
        fig.update_layout(xaxis_title='Gap (ms)', yaxis_title='Count')
        charts['vlp_gaps'] = fig

    # ── Node performance proxies: age-at-receive + jitter ─────────────────
    # Age-at-receive: (bag recv time) − (publisher timestamp). Proxy for inter-process queueing + scheduling.
    age_traces = []
    for key in ["camera_info", "detector", "estimator", "controller", "traj_sp", "vlp"]:
        ts = topic_stats.get(key)
        if not ts or not ts.age_at_recv_ms:
            continue
        age_traces.append(go.Histogram(
            x=_ds(ts.age_at_recv_ms, 5000),
            nbinsx=60,
            name=key,
            opacity=0.55,
        ))
    if age_traces:
        fig = go.Figure(data=age_traces)
        fig.update_layout(
            barmode="overlay",
            xaxis_title="Age at receive (ms)  = recv_time − publish_time",
            yaxis_title="Count",
            legend_title="Topic key",
        )
        charts["perf_age_hist"] = fig

    # Jitter / periodic execution proxy: distribution of inter-arrival gaps per critical topics.
    jitter_traces = []
    for key in ["detector", "estimator", "controller", "traj_sp", "vlp"]:
        ts = topic_stats.get(key)
        if not ts or not ts.gaps_ms:
            continue
        jitter_traces.append(go.Histogram(
            x=_ds(ts.gaps_ms, 5000),
            nbinsx=60,
            name=key,
            opacity=0.55,
        ))
    if jitter_traces:
        fig = go.Figure(data=jitter_traces)
        fig.update_layout(
            barmode="overlay",
            xaxis_title="Inter-arrival gap (ms)",
            yaxis_title="Count",
            legend_title="Topic key",
        )
        charts["perf_jitter_hist"] = fig

    # Violin: inter-arrival gaps per node (jitter distribution)
    vio = []
    for key, label in [("detector", "Detector"), ("estimator", "Kalman"), ("controller", "Controller")]:
        ts = topic_stats.get(key)
        if ts and ts.gaps_ms:
            vio.append(
                go.Violin(
                    y=_ds(ts.gaps_ms, 4000),
                    name=label,
                    box_visible=True,
                    meanline_visible=True,
                    opacity=0.85,
                )
            )
    if vio:
        fig = go.Figure(data=vio)
        fig.update_layout(
            xaxis_title="Topic / node",
            yaxis_title="Δt between consecutive messages (ms)",
            title=dict(
                text=(
                    "<b>What this shows:</b> for each topic, time gaps between <i>neighboring</i> samples "
                    "as recorded in the bag (rosbag receive order). "
                    "That reflects publisher cadence + scheduling + kernel jitter — <b>not</b> CPU time per callback. "
                    "Wide violin / long tail ⇒ irregular timing (risk for control/vision)."
                ),
                font=dict(size=11, color="#8b949e"),
            ),
        )
        charts["node_violin_gaps"] = fig

    # Detector XY bias (mean-centered valid positions — camera / bias probe)
    xs, ys = [], []
    if det.statuses:
        idx = [i for i, s in enumerate(det.statuses) if s in (1, 2)]
        if len(idx) > 5:
            px = [det.position_x[i] for i in idx]
            py = [det.position_y[i] for i in idx]
            mx, my = sum(px) / len(px), sum(py) / len(py)
            xs = [p - mx for p in px]
            ys = [p - my for p in py]
    if xs:
        fig = go.Figure()
        fig.add_trace(
            go.Scatter(
                x=_ds(xs),
                y=_ds(ys),
                mode="markers",
                marker=dict(size=5, color=C_BLUE, opacity=0.55),
                name="Det (valid)",
            )
        )
        fig.update_layout(
            xaxis_title="ΔX from mean (m)",
            yaxis_title="ΔY from mean (m)",
            yaxis=dict(scaleanchor="x", scaleratio=1),
            title=dict(text="Detector XY scatter (bias / perspective probe)", font=dict(size=11, color="#8b949e")),
        )
        charts["det_bias_xy"] = fig

    # Camera→detector latency histogram (timestamp_sample anchored)
    if latency.cam_to_det_ms:
        fig = go.Figure()
        fig.add_trace(
            go.Histogram(x=_ds(latency.cam_to_det_ms, 5000), nbinsx=50, marker_color=C_BLUE, name="Cam→Det (ms)")
        )
        fig.update_layout(xaxis_title="Latency (ms)", yaxis_title="Count")
        charts["det_latency_hist"] = fig

    # Phase lag: raw vs KF with translucent band (same timestamps via overlap window)
    if det_v_t and kf_v_t and phase_metrics:
        t0p = max(det_v_t[0], kf_v_t[0])
        t1p = min(det_v_t[-1], kf_v_t[-1])
        if t1p - t0p > 0.5:
            n = min(1500, int((t1p - t0p) * 80))
            dt = (t1p - t0p) / max(n - 1, 1)
            tu = [t0p + i * dt for i in range(n)]
            du = _interp_nearest(tu, det_v_t, det_v_x)
            ku = _interp_nearest(tu, kf_v_t, kf_v_x)
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=tu, y=du, mode="lines", line=dict(color=C_BLUE, width=1), name="Detector X"))
            fig.add_trace(go.Scatter(x=tu, y=ku, mode="lines", line=dict(color=C_YELLOW, width=2), name="KF X"))
            fig.add_trace(
                go.Scatter(
                    x=tu + tu[::-1],
                    y=du + ku[::-1],
                    fill="toself",
                    fillcolor="rgba(248,81,73,0.12)",
                    line=dict(color="rgba(0,0,0,0)"),
                    name="Gap (shaded)",
                    showlegend=True,
                )
            )
            fig.update_layout(
                xaxis_title="Time (s)",
                yaxis_title="Target X (m)",
                title=dict(text="Phase lag: detector vs KF (shaded = disagreement band)", font=dict(size=11, color="#8b949e")),
            )
            _apply_mode_shading(fig)
            charts["phase_lag_band_x"] = fig

    ct = accuracy.get("control_tracking")
    if ct and ct.get("timestamps_s"):
        fig = go.Figure()
        fig.add_trace(
            go.Scatter(
                x=_ds(ct["timestamps_s"]),
                y=_ds(ct["cmd_spd"]),
                mode="lines",
                line=dict(color=C_YELLOW, width=2),
                name="|cmd_xy|",
            )
        )
        fig.add_trace(
            go.Scatter(
                x=_ds(ct["timestamps_s"]),
                y=_ds(ct["fb_spd"]),
                mode="lines",
                line=dict(color=C_GREEN, width=1),
                name="|VLP_xy|",
            )
        )
        fig.update_layout(
            shapes=_fsm_ctrl_shapes(),
            xaxis_title="Time (s)",
            yaxis_title="Horizontal speed (m/s)",
            title=dict(text="Control effort vs feedback (FSM background)", font=dict(size=11, color="#8b949e")),
        )
        _apply_mode_shading(fig)
        charts["ctrl_spd_track"] = fig

    # ── Event timeline ────────────────────────────────────────────────────
    if events:
        kinds = sorted(set(e.kind for e in events))
        kind_to_y = {k: i for i, k in enumerate(kinds)}
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=[e.t_s for e in events],
            y=[kind_to_y[e.kind] for e in events],
            mode="markers",
            marker=dict(size=9, color=[kind_to_y[e.kind] for e in events], colorscale="Turbo"),
            text=[(e.detail or e.kind) for e in events],
            hovertemplate="t=%{x:.3f}s<br>%{text}<extra></extra>",
            showlegend=False,
        ))
        fig.update_layout(
            xaxis_title="Time (s)",
            yaxis_title="Event type",
            yaxis=dict(
                tickmode="array",
                tickvals=list(kind_to_y.values()),
                ticktext=list(kind_to_y.keys()),
            ),
        )
        charts["timeline_events"] = fig

    # ── Controller command output (TrajectorySetpoint) ─────────────────────
    if traj and traj.timestamps_s:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=_ds(traj.timestamps_s), y=_ds(traj.vx),
                                 mode="lines", line=dict(color=C_BLUE, width=1), name="vx"))
        fig.add_trace(go.Scatter(x=_ds(traj.timestamps_s), y=_ds(traj.vy),
                                 mode="lines", line=dict(color=C_GREEN, width=1), name="vy"))
        fig.add_trace(go.Scatter(x=_ds(traj.timestamps_s), y=_ds(traj.vz),
                                 mode="lines", line=dict(color=C_RED, width=1), name="vz (NED down +)"))
        fig.add_trace(go.Scatter(x=_ds(traj.timestamps_s), y=_ds(traj.yawspeed),
                                 mode="lines", line=dict(color=C_YELLOW, width=1), name="yawspeed"))
        fig.update_layout(
            xaxis_title="Time (s)",
            yaxis_title="Command",
            legend_title="trajectory_setpoint",
            shapes=_fsm_ctrl_shapes(),
        )
        _apply_mode_shading(fig)
        charts["ctrl_setpoints"] = fig

    # ══════════════════════════════════════════════════════════════════════
    # Build HTML (self-contained with inline Plotly.js)
    # ══════════════════════════════════════════════════════════════════════
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Flight Log Review — Precision Landing</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
         margin: 0; padding: 20px; background: #0d1117; color: #c9d1d9; }}
  h1 {{ color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 10px; }}
  h2 {{ color: #8b949e; margin-top: 40px; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 16px; }}
  .card {{ background: #161b22; border: 1px solid #30363d; border-radius: 8px;
           padding: 16px; }}
  .card h3 {{ margin-top: 0; color: #58a6ff; font-size: 14px; }}
  .card-full {{ grid-column: 1 / -1; }}
  table {{ border-collapse: collapse; width: 100%; font-size: 13px; }}
  th, td {{ padding: 6px 12px; text-align: left; border-bottom: 1px solid #21262d; }}
  th {{ color: #8b949e; font-weight: 600; }}
  td {{ color: #c9d1d9; }}
  .good {{ color: #3fb950; }}
  .warn {{ color: #d29922; }}
  .bad {{ color: #f85149; }}
  .summary-box {{ display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }}
  .metric {{ background: #21262d; border-radius: 6px; padding: 12px 16px; min-width: 140px; }}
  .metric .label {{ font-size: 11px; color: #8b949e; text-transform: uppercase; }}
  .metric .value {{ font-size: 24px; font-weight: 700; margin-top: 4px; }}
  .metric .sub {{ font-size: 11px; color: #8b949e; }}
  nav {{ background: #161b22; border: 1px solid #30363d; border-radius: 8px;
        padding: 12px 16px; margin-bottom: 20px; display: flex; gap: 16px; flex-wrap: wrap; }}
  nav a {{ color: #58a6ff; text-decoration: none; font-size: 13px; }}
  nav a:hover {{ text-decoration: underline; }}
  .alert {{ padding: 12px 16px; border-radius: 8px; margin: 8px 0; font-size: 13px; }}
  .alert-bad {{ background: #3d1214; border: 1px solid #f85149; color: #f85149; }}
  .alert-warn {{ background: #3d2e00; border: 1px solid #d29922; color: #d29922; }}
  .alert-good {{ background: #0d2818; border: 1px solid #3fb950; color: #3fb950; }}
  /* Compact KPI strip (§4 Kalman) — same card width as Plotly charts, not oversized metric tiles */
  .kpi-table-wrap {{ max-width: 100%; }}
  .kpi-table-wrap table {{ table-layout: fixed; }}
  .kpi-table-wrap th {{ width: 25%; font-size: 11px; text-transform: uppercase; color: #8b949e; }}
  .kpi-table-wrap td {{ font-size: 15px; vertical-align: middle; }}
</style>
{_plotly_script_tag()}
</head>
<body>
<h1>&#9992; Flight Log Review — Precision Landing</h1>
<p style="color:#8b949e">Generated: {time.strftime('%Y-%m-%d %H:%M:%S')} &nbsp;|&nbsp;
   Duration: {duration_s:.1f}s
   &nbsp;|&nbsp; Messages: {sum(ts.count for ts in topic_stats.values())}</p>

<nav>
  <a href="#sec-overview">Overview</a>
  <a href="#sec-trajectory">Trajectory</a>
  <a href="#sec-accuracy">Accuracy</a>
  <a href="#sec-kalman">Kalman Filter</a>
  <a href="#sec-velocity">Velocity</a>
  <a href="#sec-nodeperf">Node Perf</a>
  <a href="#sec-latency">Latency</a>
  <a href="#sec-timeline">Timeline</a>
  <a href="#sec-detector">Detector</a>
  <a href="#sec-controller">Controller</a>
  <a href="#sec-rates">Topic Rates</a>
  <a href="#sec-deep">Deep Analytics</a>
  <a href="#sec-interpretation">Diagnosis</a>
</nav>
"""

    # Helper to insert a plotly chart
    def _img(chart_id, title="", full_width=False, height=420):
        if chart_id not in charts:
            return ''
        return _plotly_card(charts[chart_id], title=title, full_width=full_width, height=height)

    # ── Data Quality Assessment ───────────────────────────────────────────
    if quality_warnings:
        q_cls = "good" if quality_score > 70 else ("warn" if quality_score > 30 else "bad")
        html += f'<h2 id="sec-quality">Data Quality: <span class="{q_cls}">{quality_score}/100</span></h2>\n'
        for level, msg in quality_warnings:
            html += f'<div class="alert alert-{level}">{msg}</div>\n'
        html += '<br>\n'

    # ── SECTION 1: Overview ───────────────────────────────────────────────
    _e2e_p95 = cam_ctrl['p95'] if cam_ctrl['n'] > 0 else cam_est['p95']
    html += '<h2 id="sec-overview">1. Flight Overview</h2>\n<div class="summary-box">\n'
    _ov = [
        ("Duration", f"{duration_s:.0f}", "s", "good"),
        ("Detection Rate", f"{det_rate:.0f}", "%", "good" if det_rate > 70 else "warn" if det_rate > 40 else "bad"),
        ("KF Track Rate", f"{kf_track:.0f}", "%", "good" if kf_track > 80 else "warn" if kf_track > 50 else "bad"),
        ("E2E Latency p95", f"{_e2e_p95:.1f}", "ms",
         "good" if _e2e_p95 < 50 else "warn" if _e2e_p95 < 100 else "bad"),
        ("KF Dropped", f"{kf.dropped}", "", "good" if kf.dropped == 0 else "bad"),
    ]
    if innov:
        _ov.append(("Innovation RMSE", f"{innov['xy']['mean']:.3f}", "m",
                     "good" if innov['xy']['mean'] < 0.1 else "warn" if innov['xy']['mean'] < 0.3 else "bad"))
    if landing:
        _ov.append(("Final XY Error", f"{landing['final_xy_error_m']:.3f}", "m",
                     "good" if landing['final_xy_error_m'] < 0.3 else "warn" if landing['final_xy_error_m'] < 0.5 else "bad"))
        _ov.append(("Min XY Error", f"{landing['min_xy_error_m']:.3f}", "m", "good"))
    for label, val, unit, cls in _ov:
        html += f'''<div class="metric">
  <div class="label">{label}</div>
  <div class="value {cls}">{val}<small>{unit}</small></div>
</div>\n'''
    html += '</div>\n'

    # ── SECTION 2: Trajectory ─────────────────────────────────────────────
    html += '<h2 id="sec-trajectory">2. Trajectory Analysis</h2>\n'
    html += ('<p style="color:#8b949e;font-size:12px">Plots use a common horizontal plane: '
             '<b>East</b> (horizontal axis) and <b>North</b> (vertical). '
             'VLP is PX4 NED (mapped as east=y, north=x); KF/detector are ROS odom ENU from TF '
             '(east=x, north=y). Same origin; different objects.</p>\n')
    html += '<div class="grid">\n'
    html += _img('traj_xy', 'Top-Down (XY): Drone Path vs Target Position', full_width=True)
    html += _img('traj_3d', '3D View: Drone Path vs Target Position', full_width=True)
    html += _img('traj_alt', 'Altitude Profile')
    html += _img('traj_heading', 'Drone Heading (Yaw)')
    html += _img('traj_speed', 'Drone Ground Speed')
    html += _img('traj_xyerr', 'XY Distance to Target')
    html += _img('traj_approach', 'Approach Vector: Target − Drone', full_width=True)
    html += '</div>\n'

    # ── SECTION 3: Accuracy ───────────────────────────────────────────────
    html += '<h2 id="sec-accuracy">3. Algorithm Accuracy</h2>\n'
    vc = accuracy.get("valid_counts", {})
    html += f'<p style="color:#8b949e;font-size:12px">Based on <b>{vc.get("det_valid",0)}</b>/{vc.get("det_total",0)} valid detector samples '
    html += f'and <b>{vc.get("kf_valid",0)}</b>/{vc.get("kf_total",0)} valid KF samples (excluding LOST status).</p>\n'
    if not innov and vc.get("det_valid", 0) < 5:
        html += '<div class="alert alert-bad">Insufficient valid data for accuracy analysis.</div>\n'
    if innov:
        html += '<div class="summary-box">\n'
        for axis, label in [("xy", "Innovation XY"), ("3d", "Innovation 3D"),
                            ("x", "Innov X"), ("y", "Innov Y"), ("z", "Innov Z")]:
            s = innov[axis]
            html += f'''<div class="metric">
  <div class="label">{label}</div>
  <div class="value">{s["mean"]:.4f}<small>m</small></div>
  <div class="sub">std={s["std"]:.4f} max={s["max"]:.4f}</div>
</div>\n'''
        html += '</div>\n'
    html += '<div class="grid">\n'
    html += _img('acc_innov_ts', 'Innovation (Det − KF) Over Time', full_width=True)
    html += _img('acc_innov_hist', 'Innovation Distribution (XY)')
    html += _img('acc_innov_scatter', 'Innovation Scatter (X vs Y)')
    html += _img('acc_det_jitter', 'Detector Jitter (Windowed σ)')
    if "smoothness" in accuracy:
        sm = accuracy["smoothness"]
        html += f'''<div class="card">
<h3>KF Smoothness</h3>
<table>
<tr><th>Metric</th><th>Mean</th><th>Std</th><th>Max</th></tr>
<tr><td>Vel X (m/s)</td><td>{sm["vel_std_x"]["mean"]:.4f}</td><td>{sm["vel_std_x"]["std"]:.4f}</td><td>{sm["vel_std_x"]["max"]:.4f}</td></tr>
<tr><td>Vel Y (m/s)</td><td>{sm["vel_std_y"]["mean"]:.4f}</td><td>{sm["vel_std_y"]["std"]:.4f}</td><td>{sm["vel_std_y"]["max"]:.4f}</td></tr>
<tr><td>Acc XY (m/s²)</td><td>{sm["acc_xy"]["mean"]:.3f}</td><td>{sm["acc_xy"]["std"]:.3f}</td><td>{sm["acc_xy"]["max"]:.3f}</td></tr>
</table></div>\n'''
    html += '</div>\n'

    # ── SECTION 4: Kalman Filter ──────────────────────────────────────────
    html += '<h2 id="sec-kalman">4. Kalman Filter Quality</h2>\n'
    html += '<p style="color:#8b949e;font-size:12px">Summary is a single compact table in one full-width <code>card</code> (same horizontal band as figures 4a–4f). '
    html += 'Charts: one Plotly figure per row, like §3.</p>\n'
    _tr_cls = "good" if kf_track > 80 else ("warn" if kf_track > 50 else "bad")
    _dr_cls = "good" if kf.dropped == 0 else "bad"
    html += '<div class="grid">\n'
    html += f'''<div class="card card-full kpi-table-wrap">
<h3>KF quality summary</h3>
<table>
<tr>
  <th>Track rate</th>
  <th>Mean confidence</th>
  <th>Dropped msgs</th>
  <th>Status mix (L / D / P)</th>
</tr>
<tr>
  <td class="{_tr_cls}"><b>{kf_track:.0f}%</b></td>
  <td><b>{kf_conf_stats["mean"]:.2f}</b></td>
  <td class="{_dr_cls}"><b>{kf.dropped}</b></td>
  <td style="color:#c9d1d9">L={kf.status_counts["LOST"]} &nbsp; D={kf.status_counts["DETECTED"]} &nbsp; P={kf.status_counts["PREDICTED"]}</td>
</tr>
</table>
</div>
</div>\n'''
    html += '<div class="grid">\n'
    html += _img('kf_cmp_x', '4a — Detector vs KF: Position X', full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img('kf_cmp_y', '4b — Detector vs KF: Position Y', full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img('kf_conf', '4c — Confidence over time', full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img('kf_vel', '4d — KF estimated velocity (valid samples)', full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img('kf_z', '4e — Target Z vs vehicle altitude', full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img('kf_phase', '4f — Target XY trajectory (detector vs KF, color=time)', full_width=True)
    html += '</div>\n'

    # ── SECTION 5: Velocity Estimation ────────────────────────────────────
    html += '<h2 id="sec-velocity">5. Velocity Estimation &amp; Phase Delay</h2>\n'
    html += '<p style="color:#8b949e;font-size:12px">KF estimates target velocity from its constant-velocity motion model. '
    html += 'Detector-derived velocity is the numerical derivative of raw detector positions (noisy ground truth). '
    html += 'Phase delay is measured via cross-correlation of detector vs KF position — positive = KF lags behind detector.</p>\n'
    if vel_metrics:
        html += '<div class="summary-box">\n'
        kf_spd_s = vel_metrics["kf_speed_stats"]
        det_spd_s = vel_metrics["det_speed_stats"]
        err_s = vel_metrics["err_xy_stats"]
        _vel_items = [
            ("KF Speed (mean)", f"{kf_spd_s['mean']:.4f}", "m/s", ""),
            ("KF Speed (max)", f"{kf_spd_s['max']:.4f}", "m/s", ""),
            ("Det Deriv Speed (mean)", f"{det_spd_s['mean']:.4f}", "m/s", ""),
            ("Vel Error |ΔXY|", f"{err_s['mean']:.4f}", "m/s",
             "good" if err_s['mean'] < 0.3 else "warn" if err_s['mean'] < 1.0 else "bad"),
        ]
        if phase_metrics:
            pd_mean = phase_metrics["mean_ms"]
            pd_cls = "good" if abs(pd_mean) < 20 else ("warn" if abs(pd_mean) < 50 else "bad")
            _vel_items.append(("Phase Delay (X)", f"{phase_metrics['x_ms']:.1f}", "ms", pd_cls))
            _vel_items.append(("Phase Delay (Y)", f"{phase_metrics['y_ms']:.1f}", "ms", pd_cls))
            _vel_items.append(("Phase Delay (mean)", f"{pd_mean:.1f}", "ms", pd_cls))
        for label, val, unit, cls in _vel_items:
            html += f'''<div class="metric">
  <div class="label">{label}</div>
  <div class="value {cls}">{val}<small>{unit}</small></div>
</div>\n'''
        html += '</div>\n'
    html += '<div class="grid">\n'
    html += _img('vel_cmp', 'KF Velocity vs Detector-Derived Velocity', full_width=True)
    html += _img('vel_speed', 'Velocity XY Speed')
    html += _img('vel_err', 'Velocity Error (KF − Detector Deriv)')
    html += _img('vel_xcorr', 'Phase Delay (cross-correlation, X/Y)', full_width=True)
    html += _img('phase_align_x', 'Phase Delay Visual (time-domain alignment, X)', full_width=True)
    html += _img('motion_response', 'KF Reaction Time to Target Speed Changes (settling)', full_width=True)
    if not vel_metrics and not phase_metrics:
        html += '<div class="card"><p>Insufficient valid data for velocity analysis.</p></div>\n'
    html += '</div>\n'

    # ── SECTION 6: Node Performance & Latency Proxies ─────────────────────
    html += '<h2 id="sec-nodeperf">6. Latency Pipeline &amp; Node Performance (Proxies)</h2>\n'
    html += '<p style="color:#8b949e;font-size:12px">'
    html += 'This section focuses on <b>continuity</b> and <b>timing</b> under embedded constraints. '
    html += '<b>Execution Time</b> and true <b>Inter-node queue time (publish→callback start)</b> require explicit instrumentation. '
    html += 'Without that, we provide strong proxies from the rosbag: '
    html += '(1) <b>Inter-arrival gaps</b> (jitter / scheduling), and '
    html += '(2) <b>Age-at-receive</b> = bag_recv_time − publisher_stamp (middleware + queue + scheduling, when clocks are comparable).</p>\n'

    # Summary table: age-at-receive
    keys = ["camera_info", "detector", "estimator", "controller", "traj_sp", "vlp"]
    html += '<div class="card card-full"><h3>Age-at-Receive Summary</h3>\n'
    html += '<table><tr><th>Topic</th><th>n</th><th>mean (ms)</th><th>p95 (ms)</th><th>p99 (ms)</th><th>max (ms)</th></tr>\n'
    for k in keys:
        ts = topic_stats.get(k)
        if not ts or not ts.age_at_recv_ms:
            continue
        s = stats_summary(ts.age_at_recv_ms)
        cls = "good" if s["p95"] < 20 else ("warn" if s["p95"] < 50 else "bad")
        html += f'<tr><td><code>{ts.name}</code></td><td>{s["n"]}</td>'
        html += f'<td class="{cls}">{s["mean"]:.1f}</td><td>{s["p95"]:.1f}</td><td>{s["p99"]:.1f}</td><td>{s["max"]:.1f}</td></tr>\n'
    html += '</table></div>\n'

    # Summary table: jitter / gaps
    html += '<div class="card card-full"><h3>Jitter / Periodicity (Inter-arrival Gaps)</h3>\n'
    html += '<table><tr><th>Topic</th><th>mean Hz</th><th>gap p95 (ms)</th><th>gap p99 (ms)</th><th>gap max (ms)</th></tr>\n'
    for k in ["detector", "estimator", "controller", "traj_sp", "vlp"]:
        ts = topic_stats.get(k)
        if not ts or not ts.gaps_ms:
            continue
        g = stats_summary(ts.gaps_ms)
        cls = "good" if g["p99"] < 40 else ("warn" if g["p99"] < 120 else "bad")
        html += f'<tr><td><code>{ts.name}</code></td><td>{ts.hz_mean:.1f}</td>'
        html += f'<td>{g["p95"]:.1f}</td><td class="{cls}">{g["p99"]:.1f}</td><td>{g["max"]:.1f}</td></tr>\n'
    html += '</table></div>\n'

    html += '<div class="grid">\n'
    html += _img("perf_age_hist", "Age-at-Receive Distribution (Proxy for Queue/Scheduling)", full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img("perf_jitter_hist", "Jitter: Inter-arrival Gap Distributions", full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img("ctrl_setpoints", "Controller Commands: /fmu/in/trajectory_setpoint", full_width=True)
    html += '</div>\n'

    # ── SECTION 6: Latency ────────────────────────────────────────────────
    html += '<h2 id="sec-latency">7. Pipeline Latency</h2>\n<div class="summary-box">\n'
    for label, data in [
        ("Camera → Detector", cam_det), ("Detector → Estimator", det_est),
        ("Camera → Estimator", cam_est), ("Estimator → Controller", est_ctrl),
        ("Camera → Controller (E2E)", cam_ctrl),
    ]:
        cls = "good" if data["p95"] < 50 else ("warn" if data["p95"] < 100 else "bad")
        html += f'''<div class="metric">
  <div class="label">{label}</div>
  <div class="value {cls}">{data["mean"]:.1f}<small>ms</small></div>
  <div class="sub">p95={data["p95"]:.1f}ms n={data["n"]}</div>
</div>\n'''
    html += '</div>\n'
    html += '<p style="color:#8b949e;font-size:12px">Each chart below is on its own row so histogram and time series '
    html += 'are not squeezed side-by-side.</p>\n'
    html += '<div class="grid">\n'
    html += _img('lat_hist', '7a — Latency distribution (histogram)', full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img('lat_ts', '7b — Latency vs time (camera→controller / camera→estimator when available)', full_width=True)
    html += '</div>\n'

    # ── SECTION 8: Timeline & Anomaly Snapshots ───────────────────────────
    html += '<h2 id="sec-timeline">8. Flight Review Timeline &amp; Runtime Debug</h2>\n'
    html += '<p style="color:#8b949e;font-size:12px">A single time-aligned view of major events. '
    html += 'Use this like a black box to correlate control behavior, vision loss, and estimator stability.</p>\n'
    html += '<div class="grid">\n'
    html += _img("timeline_events", "Event Timeline", full_width=True, height=360)
    html += '</div>\n'

    # ── Anomaly snapshots (best-effort with available signals) ─────────────
    # We highlight spikes that correlate strongly with control quality issues on embedded targets:
    #  - E2E latency spikes (camera→controller or camera→estimator)
    #  - KF speed spikes while pad is assumed stationary (|v| > 1 m/s)
    #  - Innovation spikes (det − KF) when available
    anomalies = []
    # Thresholds (conservative defaults for stationary pad baseline)
    LAT_SPIKE_MS = 150.0
    KF_SPEED_SPIKE = 1.0
    INNOV_SPIKE_M = 0.5

    # Latency spikes: time-aligned using latency timestamps collected during bag parse
    for t_s, v_ms in zip(latency.cam_to_ctrl_timestamps_s, latency.cam_to_ctrl_ms):
        if v_ms is not None and v_ms > LAT_SPIKE_MS:
            anomalies.append((t_s, "LATENCY_SPIKE", f"cam→ctrl={v_ms:.1f}ms"))
    for t_s, v_ms in zip(latency.cam_to_est_timestamps_s, latency.cam_to_est_ms):
        if v_ms is not None and v_ms > LAT_SPIKE_MS:
            anomalies.append((t_s, "LATENCY_SPIKE", f"cam→est={v_ms:.1f}ms"))

    # KF speed spikes (stationary pad baseline)
    if kf.timestamps_s and kf.velocity_x:
        for t_s, vx, vy, vz in zip(kf.timestamps_s, kf.velocity_x, kf.velocity_y, kf.velocity_z):
            sp = math.sqrt(float(vx)**2 + float(vy)**2 + float(vz)**2)
            if sp > KF_SPEED_SPIKE:
                anomalies.append((t_s, "KF_SPEED_SPIKE", f"|v|={sp:.2f}m/s"))

    # Innovation spikes (if computed)
    if innov and innov.get("timestamps_s"):
        for t_s, dxy in zip(innov.get("timestamps_s", []), innov.get("innov_xy", [])):
            try:
                if float(dxy) > INNOV_SPIKE_M:
                    anomalies.append((t_s, "INNOV_SPIKE", f"|Δxy|={float(dxy):.3f}m"))
            except Exception:
                pass

    anomalies = sorted(anomalies, key=lambda x: x[0])
    # De-duplicate bursts (keep first event within 200ms window per type)
    dedup = []
    last_by_kind = {}
    for t_s, kind, detail in anomalies:
        last_t = last_by_kind.get(kind, -1e9)
        if (t_s - last_t) < 0.2:
            continue
        last_by_kind[kind] = t_s
        dedup.append((t_s, kind, detail))
    anomalies = dedup[:60]  # cap output

    def _nearest_idx(ts_list, t_s):
        if not ts_list:
            return None
        j = min(range(len(ts_list)), key=lambda i: abs(ts_list[i] - t_s))
        return j

    if anomalies:
        html += '<div class="card card-full"><h3>Anomaly Snapshots (auto-highlight)</h3>\n'
        html += '<p style="color:#8b949e;font-size:12px">Each row is a best-effort dump of inputs/state/command near the highlighted time. '
        html += 'If a field is missing, record more topics (e.g. /rosout, /fmu/in/trajectory_setpoint) or add estimator instrumentation.</p>\n'
        html += '<table><tr>'
        html += '<th>t (s)</th><th>Kind</th><th>Detail</th>'
        html += '<th>Detector pos (x,y,z)</th><th>KF state (x,y,z | vx,vy,vz)</th>'
        html += '<th>Cmd vel (vx,vy,vz) yawRate</th>'
        html += '</tr>\n'
        for t_s, kind, detail in anomalies:
            di = _nearest_idx(det.timestamps_s, t_s)
            ki = _nearest_idx(kf.timestamps_s, t_s)
            ci = _nearest_idx(traj.timestamps_s, t_s) if traj and traj.timestamps_s else None

            det_xyz = "—"
            if di is not None and di < len(det.position_x):
                det_xyz = f"{det.position_x[di]:.3f}, {det.position_y[di]:.3f}, {det.position_z[di]:.3f}"

            kf_state = "—"
            if ki is not None and ki < len(kf.position_x):
                kf_state = (f"{kf.position_x[ki]:.3f}, {kf.position_y[ki]:.3f}, {kf.position_z[ki]:.3f} | "
                            f"{kf.velocity_x[ki]:.3f}, {kf.velocity_y[ki]:.3f}, {kf.velocity_z[ki]:.3f}")

            cmd = "—"
            if ci is not None and ci < len(traj.vx):
                cmd = f"{traj.vx[ci]:.3f}, {traj.vy[ci]:.3f}, {traj.vz[ci]:.3f}  yr={traj.yawspeed[ci]:.3f}"

            html += f"<tr><td>{t_s:.3f}</td><td><code>{kind}</code></td><td>{detail}</td>"
            html += f"<td>{det_xyz}</td><td>{kf_state}</td><td>{cmd}</td></tr>\n"
        html += "</table></div>\n"

    # ── SECTION 7: Detector ───────────────────────────────────────────────
    html += '<h2 id="sec-detector">9. Detector Quality</h2>\n<div class="summary-box">\n'
    html += f'''<div class="metric">
  <div class="label">Detection Rate</div>
  <div class="value {'good' if det_rate > 70 else 'warn' if det_rate > 40 else 'bad'}">{det_rate:.0f}<small>%</small></div>
</div>
<div class="metric">
  <div class="label">Total Frames</div>
  <div class="value">{det_total}</div>
</div>
<div class="metric">
  <div class="label">Status</div>
  <div class="value" style="font-size:14px">L={det.status_counts["LOST"]} D={det.status_counts["DETECTED"]}</div>
</div>\n'''
    html += '</div>\n'
    html += '<div class="grid">\n'
    html += _img("det_bias_xy", "Detector XY (mean-centered scatter)", full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img("det_latency_hist", "Detector latency: camera frame → /pl/detector/target", full_width=True)
    html += '</div>\n'

    # ── SECTION 8: Controller ─────────────────────────────────────────────
    html += '<h2 id="sec-controller">10. Controller &amp; Landing</h2>\n'
    if ctrl.timestamps_s:
        if landing:
            html += '<div class="summary-box">\n'
            html += f'''<div class="metric">
  <div class="label">Final XY Error</div>
  <div class="value {'good' if landing['final_xy_error_m'] < 0.3 else 'warn'}">{landing["final_xy_error_m"]:.3f}<small>m</small></div>
</div>
<div class="metric">
  <div class="label">Min XY Error</div>
  <div class="value">{landing["min_xy_error_m"]:.3f}<small>m</small></div>
</div>
<div class="metric">
  <div class="label">Final Altitude</div>
  <div class="value">{landing["final_altitude_m"]:.2f}<small>m</small></div>
</div>
<div class="metric">
  <div class="label">Descent Samples</div>
  <div class="value">{landing["descent_samples"]}</div>
</div>\n'''
            html += '</div>\n'
        html += (
            '<p style="color:#8b949e;font-size:12px">Controller / landing plots are stacked vertically '
            "(one chart per row) for readability.</p>\n"
        )
        uav_kf_card = _img("uav_vs_kf_vel", "10a — UAV (VLP) vs Kalman target velocity", full_width=True)
        if uav_kf_card:
            html += '<div class="grid">\n' + uav_kf_card + '</div>\n'
        html += '<div class="grid">\n'
        html += _img('ctrl_fsm', '10b — FSM state & XY error', full_width=True)
        html += '</div>\n<div class="grid">\n'
        html += _img('ctrl_alt', '10c — Altitude & target confidence', full_width=True)
        html += '</div>\n<div class="grid">\n'
        html += _img('ctrl_descent', '10d — Descent funnel (altitude vs XY error)', full_width=True)
        html += '</div>\n'
    else:
        html += '<div class="card"><p>No controller data recorded.</p></div>\n'

    # ── SECTION 9: Topic Rates ────────────────────────────────────────────
    html += '<h2 id="sec-rates">11. Topic Rates</h2>\n<div class="card">\n<table>\n'
    html += '<tr><th>Topic</th><th>Count</th><th>Hz (mean)</th><th>Hz (min)</th><th>Hz (max)</th><th>Jitter (σ ms)</th></tr>\n'
    for key in ["camera_info", "detector", "estimator", "controller", "vlp", "vstatus"]:
        ts = topic_stats.get(key)
        if not ts:
            continue
        hz_class = "good" if ts.hz_mean > 5 else ("warn" if ts.hz_mean > 1 else "bad")
        html += f'<tr><td><code>{ts.name}</code></td><td>{ts.count}</td>'
        html += f'<td class="{hz_class}">{ts.hz_mean:.1f}</td>'
        html += f'<td>{ts.hz_min:.1f}</td><td>{ts.hz_max:.1f}</td>'
        html += f'<td>{ts.hz_std:.2f}</td></tr>\n'
    html += '</table></div>\n'
    html += _img('vlp_gaps', 'VLP Gap Distribution (ms)')

    # ── Deep analytics (extended metrics) ────────────────────────────────
    html += '<h2 id="sec-deep">12. Deep Analytics</h2>\n'
    html += '<p style="color:#8b949e;font-size:12px">Innovation whiteness (lag-1 ACF), global 3σ consistency proxy '
    html += '(TargetState has no covariance P — true NEES needs estimator instrumentation), '
    html += 'dominant frequency on fused target Z, and horizontal speed tracking.</p>\n'
    kw = accuracy.get("kalman_whiteness")
    ic = accuracy.get("innovation_consistency")
    fft = accuracy.get("kf_position_fft")
    dve = accuracy.get("det_vs_kf_errors")
    csr = accuracy.get("control_step_response")
    if kw or ic or fft or dve or csr:
        html += '<div class="summary-box">\n'
        if kw:
            html += f'''<div class="metric"><div class="label">Innov. ACF max</div>
<div class="value">{kw.get("acf_max_abs", 0):.3f}</div><div class="sub">white≈0</div></div>\n'''
        if ic:
            html += f'''<div class="metric"><div class="label">Outside 3σ (XY)</div>
<div class="value">{ic.get("fraction_outside_3sigma_xy", 0)*100:.1f}<small>%</small></div>
<div class="sub">{ic.get("tag", "")}</div></div>\n'''
        if fft:
            html += f'''<div class="metric"><div class="label">KF Z peak FFT</div>
<div class="value">{fft.get("dominant_hz", 0):.2f}<small>Hz</small></div></div>\n'''
        if dve:
            html += f'''<div class="metric"><div class="label">RMSE det−KF XY</div>
<div class="value">{dve.get("rmse_xy_m", 0):.4f}<small>m</small></div></div>\n'''
        if csr and csr.get("settle_ms_stats"):
            st = csr["settle_ms_stats"]
            html += f'''<div class="metric"><div class="label">Ctrl settle p50</div>
<div class="value">{st.get("p50", 0):.0f}<small>ms</small></div></div>\n'''
        html += '</div>\n'
    html += '<div class="grid">\n'
    html += _img(
        "node_violin_gaps",
        "Message spacing per topic (violin) — see title on chart for meaning",
        full_width=True,
    )
    html += '</div>\n<div class="grid">\n'
    html += _img("phase_lag_band_x", "Phase lag band (detector vs KF, X)", full_width=True)
    html += '</div>\n<div class="grid">\n'
    html += _img("ctrl_spd_track", "Horizontal speed: command vs VLP (FSM + PX4 mode)", full_width=True)
    html += '</div>\n'

    html += generate_interpretation(accuracy, latency, kf, det, ctrl, vlp, quality_score)
    html += '\n</body>\n</html>'

    html_path.write_text(html)
    return html_path


class ReportGenerator:
    """Self-contained Plotly HTML report."""

    generate_html = staticmethod(generate_html)
