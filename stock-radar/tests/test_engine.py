import numpy as np
import pandas as pd

from engine import TARGET, STOP, outcome_for_signal


def test_target_before_stop():
    idx = pd.date_range("2026-01-01", periods=5, freq="D")
    df = pd.DataFrame(
        {
            "Open": [100, 100, 100, 100, 100],
            "High": [100, 103, 101, 101, 101],
            "Low": [99, 99.5, 99, 99, 99],
            "Close": [100, 102, 100, 100, 100],
            "Volume": np.ones(5) * 1000,
        },
        index=idx,
    )
    assert outcome_for_signal(df, 0) == 1


def test_stop_before_target():
    idx = pd.date_range("2026-01-01", periods=5, freq="D")
    df = pd.DataFrame(
        {
            "Open": [100, 100, 100, 100, 100],
            "High": [100, 100.5, 100.5, 100.5, 100.5],
            "Low": [99, 98, 99, 99, 99],
            "Close": [100, 98.5, 100, 100, 100],
            "Volume": np.ones(5) * 1000,
        },
        index=idx,
    )
    assert outcome_for_signal(df, 0) == 0
