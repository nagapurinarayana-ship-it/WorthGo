from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, Iterable

import pandas as pd
import yfinance as yf

# Research universe only. A production system should build this from a
# survivorship-aware NSE universe and a licensed data feed.
NSE_UNIVERSE = [
    "RELIANCE.NS", "HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "AXISBANK.NS",
    "KOTAKBANK.NS", "BAJFINANCE.NS", "BHARTIARTL.NS", "TCS.NS", "INFY.NS",
    "HCLTECH.NS", "LT.NS", "ITC.NS", "HINDUNILVR.NS", "MARUTI.NS",
    "M&M.NS", "SUNPHARMA.NS", "TITAN.NS", "NTPC.NS", "ONGC.NS",
]


def download_daily(tickers: Iterable[str], years: int = 6) -> Dict[str, pd.DataFrame]:
    """Download enough history to leave >=5 years after warm-up periods."""
    end = datetime.utcnow().date() + timedelta(days=1)
    start = end - timedelta(days=365 * years + 60)
    result: Dict[str, pd.DataFrame] = {}

    for ticker in tickers:
        try:
            df = yf.download(
                ticker,
                start=start.isoformat(),
                end=end.isoformat(),
                interval="1d",
                auto_adjust=True,
                progress=False,
                threads=False,
            )
            if df is None or df.empty:
                continue
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)
            required = ["Open", "High", "Low", "Close", "Volume"]
            if not all(c in df.columns for c in required):
                continue
            df = df[required].dropna().copy()
            df.index = pd.to_datetime(df.index).tz_localize(None)
            result[ticker] = df
        except Exception:
            continue
    return result
