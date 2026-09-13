# -*- coding: utf-8 -*-
"""MACD 买卖点与简易回测。"""
from __future__ import annotations

import sqlite3
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams["font.sans-serif"] = ["SimHei", "Microsoft YaHei", "SimSun", "Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False


def calculate_macd(data: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9):
    exp1 = data.ewm(span=fast).mean()
    exp2 = data.ewm(span=slow).mean()
    macd_line = exp1 - exp2
    signal_line = macd_line.ewm(span=signal).mean()
    return macd_line, signal_line, macd_line - signal_line


def generate_macd_chart(df, ts_code: str, save_path: Path, buy_signals, sell_signals) -> None:
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10), gridspec_kw={"height_ratios": [3, 1]})
    ax1.plot(df["trade_date"], df["close"], label="收盘价", color="black", linewidth=1)
    if buy_signals:
        ax1.scatter(
            [pd.to_datetime(item["date"]) for item in buy_signals],
            [item["price"] for item in buy_signals],
            color="red",
            s=50,
            label="买入点",
            marker="^",
            zorder=5,
        )
    if sell_signals:
        ax1.scatter(
            [pd.to_datetime(item["date"]) for item in sell_signals],
            [item["price"] for item in sell_signals],
            color="green",
            s=50,
            label="卖出点",
            marker="v",
            zorder=5,
        )
    ax1.set_title(f"{ts_code} MACD 交易信号")
    ax1.set_ylabel("价格")
    ax1.legend()
    ax1.grid(True, linestyle="--", alpha=0.6)
    ax2.plot(df["trade_date"], df["macd"], label="MACD", color="blue", linewidth=1)
    ax2.plot(df["trade_date"], df["signal"], label="信号线", color="orange", linewidth=1)
    ax2.bar(df["trade_date"], df["histogram"], label="柱状图", alpha=0.3)
    ax2.set_xlabel("日期")
    ax2.set_ylabel("MACD")
    ax2.legend()
    ax2.grid(True, linestyle="--", alpha=0.6)
    for axis in (ax1, ax2):
        plt.setp(axis.xaxis.get_majorticklabels(), rotation=45)
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.close()


def run_macd_analysis(ts_code: str, db_path: Path, workspace_root: Path) -> dict[str, Any]:
    if not db_path.is_file():
        return {"ok": False, "error": f"数据库不存在: {db_path}"}
    if not ts_code:
        return {"ok": False, "error": "股票代码(ts_code)是必填参数"}

    charts_dir = workspace_root / "charts"
    charts_dir.mkdir(parents=True, exist_ok=True)
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
            return {"ok": False, "error": f"找不到股票 {ts_code} 过去一年的数据"}

        df = pd.DataFrame(result, columns=["trade_date", "close"])
        df["trade_date"] = pd.to_datetime(df["trade_date"])
        if len(df) < 50:
            return {"ok": False, "error": f"股票 {ts_code} 历史数据不足，无法做 MACD"}

        df["macd"], df["signal"], df["histogram"] = calculate_macd(df["close"])
        buy_signals: list[dict[str, Any]] = []
        sell_signals: list[dict[str, Any]] = []
        for i in range(1, len(df)):
            if df["macd"].iloc[i - 1] <= df["signal"].iloc[i - 1] and df["macd"].iloc[i] > df["signal"].iloc[i]:
                buy_signals.append(
                    {
                        "date": df["trade_date"].iloc[i].strftime("%Y-%m-%d"),
                        "price": float(df["close"].iloc[i]),
                        "type": "BUY",
                    }
                )
            elif df["macd"].iloc[i - 1] >= df["signal"].iloc[i - 1] and df["macd"].iloc[i] < df["signal"].iloc[i]:
                sell_signals.append(
                    {
                        "date": df["trade_date"].iloc[i].strftime("%Y-%m-%d"),
                        "price": float(df["close"].iloc[i]),
                        "type": "SELL",
                    }
                )

        if buy_signals and (not sell_signals or buy_signals[-1]["date"] > sell_signals[-1]["date"]):
            sell_signals.append(
                {
                    "date": df["trade_date"].iloc[-1].strftime("%Y-%m-%d"),
                    "price": float(df["close"].iloc[-1]),
                    "type": "SELL",
                }
            )

        initial_amount = 10000.0
        current_amount = initial_amount
        transactions = []
        for i, buy_signal in enumerate(buy_signals):
            if i < len(sell_signals):
                sell_signal = sell_signals[i]
                sold_amount = current_amount / buy_signal["price"] * sell_signal["price"]
                transactions.append(
                    {
                        "buy_date": buy_signal["date"],
                        "buy_price": buy_signal["price"],
                        "sell_date": sell_signal["date"],
                        "sell_price": sell_signal["price"],
                        "initial_amount": round(current_amount, 2),
                        "final_amount": round(sold_amount, 2),
                        "profit_rate": round((sold_amount - current_amount) / current_amount * 100, 2),
                    }
                )
                current_amount = sold_amount

        filename = f"macd_{ts_code}_{int(time.time() * 1000)}.png"
        generate_macd_chart(df, ts_code, charts_dir / filename, buy_signals, sell_signals)
        return {
            "ok": True,
            "stock_code": ts_code,
            "total_transactions": len(transactions),
            "buy_signals": buy_signals,
            "sell_signals": sell_signals,
            "transactions": transactions,
            "initial_amount": initial_amount,
            "final_amount": round(current_amount, 2),
            "total_return_rate": round((current_amount - initial_amount) / initial_amount * 100, 2),
            "chart": f"![MACD股票分析图](charts/{filename})",
        }
    except Exception as exc:
        return {"ok": False, "error": f"执行MACD分析时出错: {exc}"}
    finally:
        if connection:
            connection.close()
