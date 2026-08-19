from __future__ import annotations

import pandas as pd
import streamlit as st

from data import NSE_UNIVERSE, download_daily
from engine import TARGET, STOP, MAX_HOLD_DAYS, rank_candidates, walk_forward_report

st.set_page_config(page_title="Stock Radar", page_icon="📈", layout="wide")

st.title("📈 Stock Radar")
st.caption("Private/local research prototype • 5+ years of historical analysis • paper-trading only")

with st.sidebar:
    st.header("Research controls")
    years = st.slider("Historical years to download", 5, 10, 6)
    selected = st.multiselect("Universe", NSE_UNIVERSE, default=NSE_UNIVERSE)
    run = st.button("Run research scan", type="primary")
    st.divider()
    st.write(f"Target: **+{TARGET:.1%}**")
    st.write(f"Stop: **-{STOP:.1%}**")
    st.write(f"Maximum hold: **{MAX_HOLD_DAYS} sessions**")

st.info(
    "The dashboard ranks setups by historical target-before-stop probability and expected value. "
    "It will show fewer than three candidates when the evidence is insufficient."
)

if run:
    with st.spinner("Downloading historical data and running the research engine…"):
        data = download_daily(selected, years=years)
        candidates = rank_candidates(data)

    st.session_state["data"] = data
    st.session_state["candidates"] = candidates

if "data" not in st.session_state:
    st.warning("Choose the universe and click **Run research scan**.")
    st.stop()

data = st.session_state["data"]
candidates = st.session_state["candidates"]

col1, col2, col3 = st.columns(3)
col1.metric("Symbols downloaded", len(data))
col2.metric("Qualified setups", len(candidates))
col3.metric("Requested picks", 3)

st.subheader("Today's highest-ranked setups")

if not candidates:
    st.error("No setup currently clears the research thresholds. Do not force a trade.")
else:
    top = candidates[:3]
    rows = []
    for rank, c in enumerate(top, 1):
        rows.append({
            "Rank": rank,
            "Stock": c.ticker.replace(".NS", ""),
            "Entry": round(c.entry, 2),
            "Target (+2%)": round(c.target_price, 2),
            "Stop (-1%)": round(c.stop_price, 2),
            "Historical target-before-stop": f"{c.probability:.1%}",
            "Expected value": f"{c.expected_value:.2%}",
            "Similar setups": c.samples,
            "Why": "; ".join(c.rationale),
        })
    st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)

st.subheader("Five-year / walk-forward evidence")

reports = []
for ticker, df in data.items():
    try:
        r = walk_forward_report(df)
        reports.append({
            "Stock": ticker.replace(".NS", ""),
            "Out-of-sample setups": r["samples"],
            "Target-before-stop": None if pd.isna(r["win_rate"]) else f"{r['win_rate']:.1%}",
            "Gross expectancy/setup": None if pd.isna(r["expectancy"]) else f"{r['expectancy']:.2%}",
        })
    except Exception:
        pass

report_df = pd.DataFrame(reports)
if not report_df.empty:
    report_df = report_df.sort_values(["Out-of-sample setups", "Target-before-stop"], ascending=False)
    st.dataframe(report_df, use_container_width=True, hide_index=True)

st.subheader("Methodology")
st.markdown(
    """
- Signal is evaluated at the close of day **t**; entry is the next session open.
- Target is **+2%** and stop is **-1%** from entry.
- Maximum holding period is **3 sessions**.
- If target and stop are both touched in the same daily candle, the prototype assumes the **stop happened first**.
- Historical comparisons only use signals from dates before the current signal.
- The walk-forward report evaluates signals after an initial 504-session training/warm-up window.
- Results shown here are **before calibrated brokerage, exchange fees, taxes and slippage**.
- The current universe is intentionally small for a prototype and has survivorship-bias limitations.
"""
)

st.warning(
    "Research prototype only. A five-year backtest cannot guarantee future returns. "
    "Do not treat the displayed probability as a promise of profit."
)
