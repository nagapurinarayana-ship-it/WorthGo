from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

import numpy as np
import pandas as pd

TARGET = 0.02
STOP = 0.01
MAX_HOLD_DAYS = 3
MIN_SAMPLES = 80


@dataclass
class Candidate:
    ticker: str
    entry: float
    target_price: float
    stop_price: float
    probability: float
    expected_value: float
    samples: int
    signal_score: float
    rationale: List[str]


def add_features(df: pd.DataFrame) -> pd.DataFrame:
    x = df.copy()
    close = x["Close"]
    high = x["High"]
    low = x["Low"]
    volume = x["Volume"]

    x["ret_1"] = close.pct_change(1)
    x["ret_5"] = close.pct_change(5)
    x["ret_20"] = close.pct_change(20)
    x["sma20"] = close.rolling(20).mean()
    x["sma50"] = close.rolling(50).mean()
    x["sma200"] = close.rolling(200).mean()
    x["atr20"] = (high - low).rolling(20).mean()
    x["vol20"] = close.pct_change().rolling(20).std()
    x["volume_ratio"] = volume / volume.rolling(20).mean()

    delta = close.diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = (-delta.clip(upper=0)).rolling(14).mean()
    rs = gain / loss.replace(0, np.nan)
    x["rsi14"] = 100 - (100 / (1 + rs))

    x["high20"] = high.rolling(20).max().shift(1)
    x["breakout20"] = close > x["high20"]
    x["trend"] = (close > x["sma50"]) & (x["sma50"] > x["sma200"])
    x["momentum"] = (x["ret_5"] > 0) & (x["ret_20"] > 0)

    # Conservative, interpretable signal. It is deliberately selective.
    x["signal"] = (
        x["trend"]
        & x["momentum"]
        & (x["rsi14"].between(50, 72))
        & (x["volume_ratio"] >= 1.15)
        & (x["breakout20"] | (x["ret_5"] >= 0.015))
    )
    return x.dropna().copy()


def outcome_for_signal(df: pd.DataFrame, i: int) -> int | None:
    """Return 1 if target is hit before stop, 0 if stop first, else None."""
    if i + 1 >= len(df):
        return None
    entry = float(df.iloc[i + 1]["Open"])
    target = entry * (1 + TARGET)
    stop = entry * (1 - STOP)
    end = min(i + 1 + MAX_HOLD_DAYS, len(df) - 1)

    for j in range(i + 1, end + 1):
        day_high = float(df.iloc[j]["High"])
        day_low = float(df.iloc[j]["Low"])
        hit_target = day_high >= target
        hit_stop = day_low <= stop
        if hit_target and hit_stop:
            # Same-bar ambiguity: use the conservative assumption.
            return 0
        if hit_target:
            return 1
        if hit_stop:
            return 0
    return 0


def build_history_samples(df: pd.DataFrame) -> pd.DataFrame:
    x = add_features(df)
    rows = []
    for i in range(len(x) - MAX_HOLD_DAYS - 1):
        if not bool(x.iloc[i]["signal"]):
            continue
        outcome = outcome_for_signal(x, i)
        if outcome is None:
            continue
        rows.append({
            "date": x.index[i],
            "outcome": outcome,
            "ret_5": float(x.iloc[i]["ret_5"]),
            "ret_20": float(x.iloc[i]["ret_20"]),
            "rsi14": float(x.iloc[i]["rsi14"]),
            "volume_ratio": float(x.iloc[i]["volume_ratio"]),
            "vol20": float(x.iloc[i]["vol20"]),
        })
    return pd.DataFrame(rows)


def walk_forward_report(df: pd.DataFrame, min_train_days: int = 504) -> dict:
    """Evaluate the fixed signal only on future observations."""
    x = add_features(df)
    start = min_train_days
    test_outcomes = []
    for i in range(start, len(x) - MAX_HOLD_DAYS - 1):
        if not bool(x.iloc[i]["signal"]):
            continue
        outcome = outcome_for_signal(x, i)
        if outcome is not None:
            test_outcomes.append(outcome)
    if not test_outcomes:
        return {"samples": 0, "win_rate": np.nan, "expectancy": np.nan}
    arr = np.asarray(test_outcomes, dtype=float)
    # Uses the fixed +2% / -1% framework before fees/slippage.
    expectancy = arr.mean() * TARGET - (1 - arr.mean()) * STOP
    return {
        "samples": int(len(arr)),
        "win_rate": float(arr.mean()),
        "expectancy": float(expectancy),
    }


def score_latest(ticker: str, df: pd.DataFrame) -> Candidate | None:
    x = add_features(df)
    if len(x) < 260:
        return None
    latest = x.iloc[-1]
    if not bool(latest["signal"]):
        return None

    samples = build_history_samples(x.iloc[:-1])
    if len(samples) < MIN_SAMPLES:
        return None

    # Similarity filter: estimate probability from historically similar setups,
    # using only observations strictly before the latest signal.
    similar = samples[
        samples["rsi14"].between(float(latest["rsi14"]) - 8, float(latest["rsi14"]) + 8)
        & (samples["volume_ratio"] >= max(1.05, float(latest["volume_ratio"]) * 0.70))
    ]
    if len(similar) < 30:
        similar = samples

    probability = float(similar["outcome"].mean())
    expected_value = probability * TARGET - (1 - probability) * STOP

    rationale = []
    if bool(latest["trend"]):
        rationale.append("price > 50D > 200D trend")
    if bool(latest["breakout20"]):
        rationale.append("20-day breakout")
    if float(latest["volume_ratio"]) >= 1.5:
        rationale.append("strong volume confirmation")
    elif float(latest["volume_ratio"]) >= 1.15:
        rationale.append("above-average volume")
    rationale.append(f"RSI {float(latest['rsi14']):.0f}")

    entry = float(latest["Close"])
    return Candidate(
        ticker=ticker,
        entry=entry,
        target_price=entry * (1 + TARGET),
        stop_price=entry * (1 - STOP),
        probability=probability,
        expected_value=expected_value,
        samples=int(len(similar)),
        signal_score=float(probability * 100 + min(float(latest["volume_ratio"]), 3) * 5),
        rationale=rationale,
    )


def rank_candidates(data: Dict[str, pd.DataFrame]) -> List[Candidate]:
    candidates: List[Candidate] = []
    for ticker, df in data.items():
        try:
            c = score_latest(ticker, df)
            if c and c.probability >= 0.55 and c.expected_value > 0:
                candidates.append(c)
        except Exception:
            continue
    return sorted(candidates, key=lambda c: (c.expected_value, c.probability, c.samples), reverse=True)
