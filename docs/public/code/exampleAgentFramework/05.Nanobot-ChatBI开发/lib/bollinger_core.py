# -*- coding: utf-8 -*-
"""布林带超买超卖。"""
from __future__ import annotations

import sqlite3
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Optional

import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams["font.sans-serif"] = ["SimHei", "Microsoft YaHei", "SimSun", "Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False


def calculate_bollinger_bands(data, window: int = 20, num_std: float = 2):
    rolling_mean = data.rolling(window=window).mean()
    rolling_std = data.rolling(window=window).std()
    return rolling_mean, rolling_mean + rolling_std * num_std, rolling_mean - rolling_std * num_std


def detect_bollinger_bands_signals(df, window: int = 20, num_std: float = 2):
    work = df.copy()
    work["ma"], work["upper_band"], work["lower_band"] = calculate_bollinger_bands(
        work["close"], window, num_std
    )
    work["oversold"] = work["close"] <= work["lower_band"]
    work["overbought"] = work["close"] >= work["upper_band"]
    return work[work["oversold"]].copy(), work[work["overbought"]].copy(), work


def calculate_returns_from_signals(initial_amount, oversold_points, overbought_points):
    current_amount = initial_amount
    transactions = []
    oversold_list = oversold_points.sort_values("trade_date").to_dict("records")
    overbought_list = overbought_points.sort_values("trade_date").to_dict("records")
    buy_idx = 0
    sell_idx = 0
    while buy_idx < len(oversold_list) and sell_idx < len(overbought_list):
        buy_point = oversold_list[buy_idx]
        sell_point = overbought_list[sell_idx]
        if buy_point["trade_date"] < sell_point["trade_date"]:
            sold_amount = current_amount / buy_point["close"] * sell_point["close"]
            transactions.append(
                {
                    "buy_date": str(buy_point["trade_date"]),
                    "buy_price": buy_point["close"],
                    "sell_date": str(sell_point["trade_date"]),
                    "sell_price": sell_point["close"],
                    "initial_amount": round(current_amount, 2),
                    "final_amount": round(sold_amount, 2),
                    "profit_rate": round((sold_amount - current_amount) / current_amount * 100, 2),
                }
            )
            current_amount = sold_amount
            buy_idx += 1
            sell_idx += 1
        elif buy_point["trade_date"] > sell_point["trade_date"]:
            sell_idx += 1
        else:
            buy_idx += 1
            sell_idx += 1
    total_return_rate = (current_amount - initial_amount) / initial_amount * 100 if initial_amount else 0
    return transactions, current_amount, total_return_rate


def generate_bollinger_bands_chart(df, oversold_points, overbought_points, ts_code: str, save_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.plot(df["trade_date"], df["close"], label="收盘价", color="black", linewidth=1)
    ax.plot(df["trade_date"], df["ma"], label="中轨(MA20)", color="blue", linestyle="--")
    ax.plot(df["trade_date"], df["upper_band"], label="上轨", color="red", linestyle="--")
    ax.plot(df["trade_date"], df["lower_band"], label="下轨", color="green", linestyle="--")
    if not oversold_points.empty:
        ax.scatter(
            oversold_points["trade_date"],
            oversold_points["close"],
            color="green",
            s=50,
            label="超卖点",
            marker="^",
            zorder=5,
        )
    if not overbought_points.empty:
        ax.scatter(
            overbought_points["trade_date"],
            overbought_points["close"],
            color="red",
            s=50,
            label="超买点",
            marker="v",
            zorder=5,
        )
    ax.set_title(f"{ts_code} 布林带")
    ax.set_xlabel("日期")
    ax.set_ylabel("价格")
    ax.legend()
    ax.grid(True, linestyle="--", alpha=0.6)
    plt.setp(ax.xaxis.get_majorticklabels(), rotation=45)
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.close()


def run_bollinger_analysis(
    ts_code: str,
    db_path: Path,
    workspace_root: Path,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    window: int = 20,
    num_std: float = 2,
    initial_amount: float = 10000,
) -> dict[str, Any]:
    if not db_path.is_file():
        return {"ok": False, "error": f"数据库不存在: {db_path}"}
    if not ts_code:
        return {"ok": False, "error": "股票代码(ts_code)是必填参数"}

    charts_dir = workspace_root / "charts"
    charts_dir.mkdir(parents=True, exist_ok=True)
    if not start_date:
        start_date = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
    if not end_date:
        end_date = datetime.now().strftime("%Y-%m-%d")

    connection = None
    try:
        connection = sqlite3.connect(str(db_path))
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT trade_date, close FROM stock_data
            WHERE ts_code = ? AND trade_date BETWEEN ? AND ?
            ORDER BY trade_date ASC
            """,
            (ts_code, start_date, end_date),
        )
        result = cursor.fetchall()
        if not result:
            return {"ok": False, "error": f"找不到股票 {ts_code} 在指定日期范围内的数据"}

        df = pd.DataFrame(result, columns=["trade_date", "close"])
        df["trade_date"] = pd.to_datetime(df["trade_date"])
        if len(df) < window:
            return {"ok": False, "error": f"数据不足，至少需要 {window} 个交易日"}

        oversold_points, overbought_points, full_df = detect_bollinger_bands_signals(df, window, num_std)
        transactions, final_amount, total_return_rate = calculate_returns_from_signals(
            initial_amount, oversold_points, overbought_points
        )
        filename = f"bollinger_{ts_code}_{int(time.time() * 1000)}.png"
        generate_bollinger_bands_chart(
            full_df, oversold_points, overbought_points, ts_code, charts_dir / filename
        )
        return {
            "ok": True,
            "stock_code": ts_code,
            "period": f"{start_date} 至 {end_date}",
            "window": window,
            "num_std": num_std,
            "total_oversold_signals": len(oversold_points),
            "total_overbought_signals": len(overbought_points),
            "successful_transactions": len(transactions),
            "transactions": transactions,
            "initial_amount": initial_amount,
            "final_amount": round(final_amount, 2),
            "total_return_rate": round(total_return_rate, 2),
            "chart": f"![布林带股票分析图](charts/{filename})",
            "oversold_dates": [str(d) for d in oversold_points["trade_date"]] if not oversold_points.empty else [],
            "overbought_dates": [str(d) for d in overbought_points["trade_date"]] if not overbought_points.empty else [],
        }
    except Exception as exc:
        return {"ok": False, "error": f"执行布林带分析时出错: {exc}"}
    finally:
        if connection:
            connection.close()
