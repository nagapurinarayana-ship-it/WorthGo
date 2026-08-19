# Stock Radar — 5Y Research Prototype

A private/local Indian-equity research dashboard designed to rank up to three liquid NSE stock setups for a roughly +2% upside target.

## Important

This is a research and paper-trading prototype. It does **not** guarantee profits or provide personalized investment advice.

The engine deliberately refuses to force three picks when the evidence is weak.

## What it does

- Downloads at least five years of daily OHLCV data.
- Builds trend, momentum, volatility and volume features.
- Evaluates historical setups with a target-before-stop test.
- Uses time-ordered walk-forward splits rather than random train/test shuffling.
- Scans a configurable NSE universe and ranks candidates.
- Shows target probability, expected value, sample size and risk metrics.
- Keeps the daily decision reproducible from data available at the decision date.

## Run locally

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

The prototype uses `yfinance` for research data. For a public/production deployment, replace the adapter with a licensed market-data provider such as an Indian broker/data vendor and preserve the same normalized schema.

## Next production steps

1. Replace the research data adapter with licensed NSE/broker data.
2. Add corporate-action and delisting handling.
3. Add transaction-cost/slippage calibration.
4. Add a true out-of-sample holdout and live paper-trading ledger.
5. Add sector/index/VIX regime features.
6. Validate the strategy over multiple market regimes before any live use.
