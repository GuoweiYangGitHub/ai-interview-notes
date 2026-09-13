# -*- coding: utf-8 -*-
"""Prophet 趋势 / 周 / 年季节性。未安装 prophet 时返回明确错误。"""
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


def analyze_trend_change(forecast_df) -> dict[str, Any]:
    trend_values = forecast_df["trend"].dropna()
    if len(trend_values) < 2:
        return {"message": "数据不足，无法分析趋势变化"}
    start_trend = trend_values.iloc[0]
    end_trend = trend_values.iloc[-1]
    change = ((end_trend - start_trend) / start_trend) * 100 if start_trend else 0
    direction = "上升" if change > 0 else "下降" if change < 0 else "平稳"
    return {
        "direction": direction,
        "change_percentage": round(change, 2),
        "start_value": round(start_trend, 2),
        "end_value": round(end_trend, 2),
    }


def analyze_weekly_effect(forecast_df) -> dict[str, Any]:
    if "weekly" not in forecast_df.columns:
        return {"message": "Prophet 未包含 weekly 分量"}
    weekly_effects = forecast_df["weekly"].dropna()
    if weekly_effects.empty:
        return {"message": "周季节性无有效数据"}
    return {
        "max_effect": round(float(weekly_effects.max()), 2),
        "min_effect": round(float(weekly_effects.min()), 2),
    }


def analyze_yearly_effect(original_df) -> dict[str, Any]:
    work = original_df.copy()
    work["month"] = work["trade_date"].dt.month
    monthly_avg = work.groupby("month")["close"].mean()
    return {
        "highest_month": int(monthly_avg.idxmax()),
        "highest_month_avg_price": round(float(monthly_avg.max()), 2),
        "lowest_month": int(monthly_avg.idxmin()),
        "lowest_month_avg_price": round(float(monthly_avg.min()), 2),
    }


def run_prophet_analysis(
    ts_code: str,
    db_path: Path,
    workspace_root: Path,
    start_date_str: Optional[str] = None,
    end_date_str: Optional[str] = None,
) -> dict[str, Any]:
    if not db_path.is_file():
        return {"ok": False, "error": f"数据库不存在: {db_path}"}
    if not ts_code:
        return {"ok": False, "error": "股票代码(ts_code)是必填参数"}
    try:
        from prophet import Prophet
    except ImportError:
        return {"ok": False, "error": '未安装 Prophet。请执行 pip install prophet'}

    charts_dir = workspace_root / "charts"
    charts_dir.mkdir(parents=True, exist_ok=True)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    if start_date_str:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    if end_date_str:
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

    connection = None
    try:
        connection = sqlite3.connect(str(db_path))
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT trade_date, close FROM stock_data
            WHERE ts_code = ? AND trade_date >= ? AND trade_date <= ?
            ORDER BY trade_date ASC
            """,
            (ts_code, start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")),
        )
        result = cursor.fetchall()
        if not result:
            return {"ok": False, "error": f"找不到股票 {ts_code} 在指定日期范围内的数据"}

        df = pd.DataFrame(result, columns=["trade_date", "close"])
        df["trade_date"] = pd.to_datetime(df["trade_date"])
        if len(df) < 30:
            return {"ok": False, "error": f"股票 {ts_code} 数据不足，无法做 Prophet"}

        df = df.sort_values("trade_date").reset_index(drop=True)
        prophet_df = df[["trade_date", "close"]].rename(columns={"trade_date": "ds", "close": "y"})
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=True,
            interval_width=0.95,
        )
        model.add_seasonality(name="monthly", period=30.5, fourier_order=5)
        model.fit(prophet_df)
        forecast = model.predict(model.make_future_dataframe(periods=0))

        filename = f"prophet_components_{ts_code}_{int(time.time() * 1000)}.png"
        fig = model.plot_components(forecast)
        fig.savefig(charts_dir / filename, dpi=150, bbox_inches="tight")
        plt.close(fig)
        trend_filename = f"prophet_trend_{ts_code}_{int(time.time() * 1000)}.png"
        fig2 = model.plot(forecast)
        fig2.savefig(charts_dir / trend_filename, dpi=150, bbox_inches="tight")
        plt.close(fig2)

        return {
            "ok": True,
            "stock_code": ts_code,
            "analysis_period": f"{start_date.strftime('%Y-%m-%d')} 至 {end_date.strftime('%Y-%m-%d')}",
            "data_points_count": len(df),
            "trend_analysis": analyze_trend_change(forecast),
            "weekly_analysis": analyze_weekly_effect(forecast),
            "yearly_analysis": analyze_yearly_effect(df),
            "components_chart": f"![Prophet组件分析图](charts/{filename})",
            "trend_chart": f"![Prophet趋势图](charts/{trend_filename})",
        }
    except Exception as exc:
        return {"ok": False, "error": f"执行Prophet分析时出错: {exc}"}
    finally:
        if connection:
            connection.close()
