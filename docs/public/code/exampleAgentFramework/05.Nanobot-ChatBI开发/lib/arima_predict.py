# -*- coding: utf-8 -*-
"""ARIMA(5,1,5) 收盘价预测。"""
from __future__ import annotations

import sqlite3
import time
import warnings
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

plt.rcParams["font.sans-serif"] = ["SimHei", "Microsoft YaHei", "SimSun", "Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False


def generate_arima_chart(df, ts_code: str, save_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(12, 6))
    historical_data = df[df["type"] == "historical"]
    if not historical_data.empty:
        ax.plot(
            historical_data["trade_date"],
            historical_data["actual_price"],
            label="历史价格",
            color="#1f77b4",
            linewidth=2,
        )
    predicted_data = df[df["type"] == "predicted"]
    if not predicted_data.empty:
        ax.plot(
            predicted_data["trade_date"],
            predicted_data["predicted_price"],
            label="预测价格",
            color="#ff7f0e",
            linestyle="--",
            linewidth=2,
            marker="o",
        )
    ax.set_xlabel("日期")
    ax.set_ylabel("价格")
    ax.set_title(f"{ts_code} ARIMA 预测")
    ax.legend()
    ax.grid(True, linestyle="--", alpha=0.6)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.close()


def run_arima_predict(ts_code: str, n: int, db_path: Path, workspace_root: Path) -> dict[str, Any]:
    if not db_path.is_file():
        return {"ok": False, "error": f"数据库不存在: {db_path}"}
    if not ts_code:
        return {"ok": False, "error": "股票代码(ts_code)是必填参数"}
    if not n or n <= 0:
        return {"ok": False, "error": "预测天数(n)必须是正整数"}

    charts_dir = workspace_root / "charts"
    charts_dir.mkdir(parents=True, exist_ok=True)
    warnings.filterwarnings("ignore")
    connection = None
    try:
        connection = sqlite3.connect(str(db_path))
        cursor = connection.cursor()
        start_date = (datetime.now().date() - timedelta(days=365)).strftime("%Y-%m-%d")
        cursor.execute(
            """
            SELECT trade_date, close FROM stock_data
            WHERE ts_code = ? AND trade_date >= ?
            ORDER BY trade_date ASC
            """,
            (ts_code, start_date),
        )
        result = cursor.fetchall()
        if not result:
            return {"ok": False, "error": f"找不到股票 {ts_code} 的数据"}

        df = pd.DataFrame(result, columns=["trade_date", "close"])
        df["trade_date"] = pd.to_datetime(df["trade_date"])
        if len(df) < 10:
            return {"ok": False, "error": f"股票 {ts_code} 历史数据不足，无法做 ARIMA"}

        df = df.sort_values("trade_date").reset_index(drop=True)
        close_prices = df["close"].values
        fitted = ARIMA(close_prices, order=(5, 1, 5)).fit()
        forecast_result = fitted.forecast(steps=n)
        forecast_conf_int = fitted.get_forecast(steps=n).conf_int()

        last_date = df["trade_date"].iloc[-1]
        future_dates = [
            (last_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, n + 1)
        ]
        predictions = [
            {
                "date": future_dates[i],
                "predicted_price": round(float(forecast_result[i]), 2),
                "lower_bound": round(float(forecast_conf_int[i, 0]), 2),
                "upper_bound": round(float(forecast_conf_int[i, 1]), 2),
            }
            for i in range(n)
        ]

        historical_data = df[["trade_date", "close"]].rename(columns={"close": "actual_price"})
        historical_data["predicted_price"] = np.nan
        historical_data["type"] = "historical"
        predicted_df = pd.DataFrame(
            {
                "trade_date": pd.to_datetime(future_dates),
                "actual_price": np.nan,
                "predicted_price": forecast_result,
                "type": "predicted",
            }
        )
        combined = pd.concat([historical_data, predicted_df], ignore_index=True)
        filename = f"arima_{ts_code}_{int(time.time() * 1000)}.png"
        generate_arima_chart(combined, ts_code, charts_dir / filename)
        return {
            "ok": True,
            "stock_code": ts_code,
            "prediction_days": n,
            "predictions": predictions,
            "chart": f"![ARIMA股票预测图](charts/{filename})",
        }
    except Exception as exc:
        return {"ok": False, "error": f"执行ARIMA预测时出错: {exc}"}
    finally:
        if connection:
            connection.close()
