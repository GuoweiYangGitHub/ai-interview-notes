#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成本地 stock_data.db。有 TUSHARE_TOKEN 就拉日线，否则灌入演示数据。"""
from __future__ import annotations

import sqlite3
from datetime import datetime, timedelta

from dotenv import load_dotenv
import os

from client import REPO_ROOT, WORKSPACE

load_dotenv(REPO_ROOT / ".env")
DB_PATH = WORKSPACE / "stock_data.db"

STOCKS = [
    ("600519.SH", "贵州茅台", 1450.0),
    ("000858.SZ", "五粮液", 128.0),
    ("000776.SZ", "广发证券", 16.5),
    ("688981.SH", "中芯国际", 92.0),
]


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("DROP TABLE IF EXISTS stock_data")
    conn.execute(
        """
        CREATE TABLE stock_data (
          ts_code TEXT,
          trade_date TEXT,
          open REAL,
          high REAL,
          low REAL,
          close REAL,
          pre_close REAL,
          change REAL,
          pct_chg REAL,
          vol REAL,
          amount REAL,
          "股票简称" TEXT
        )
        """
    )
    return conn


def _weekdays(n: int) -> list[str]:
    days: list[str] = []
    current = datetime.now().date()
    while len(days) < n:
        if current.weekday() < 5:
            days.append(current.strftime("%Y-%m-%d"))
        current -= timedelta(days=1)
    days.reverse()
    return days


def seed_synthetic(conn: sqlite3.Connection) -> None:
    import random

    random.seed(42)
    dates = _weekdays(120)
    rows = []
    for ts_code, name, start_price in STOCKS:
        price = start_price
        for trade_date in dates:
            change = price * random.uniform(-0.018, 0.018)
            close = max(1.0, price + change)
            high = max(price, close) * (1 + random.uniform(0, 0.008))
            low = min(price, close) * (1 - random.uniform(0, 0.008))
            open_px = price
            pct = (close - price) / price * 100
            vol = random.uniform(8000, 40000)
            rows.append(
                (
                    ts_code,
                    trade_date,
                    round(open_px, 2),
                    round(high, 2),
                    round(low, 2),
                    round(close, 2),
                    round(price, 2),
                    round(close - price, 2),
                    round(pct, 2),
                    round(vol, 2),
                    round(vol * close, 2),
                    name,
                )
            )
            price = close
    conn.executemany(
        """INSERT INTO stock_data
        (ts_code, trade_date, open, high, low, close, pre_close, change, pct_chg, vol, amount, "股票简称")
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
        rows,
    )


def seed_tushare(conn: sqlite3.Connection, token: str) -> bool:
    try:
        import tushare as ts
    except ImportError:
        print("未安装 tushare，改用演示数据。需要时 pip install tushare")
        return False

    pro = ts.pro_api(token)
    end = datetime.now().strftime("%Y%m%d")
    start = (datetime.now() - timedelta(days=400)).strftime("%Y%m%d")
    inserted = 0
    for ts_code, name, _ in STOCKS:
        frame = pro.daily(ts_code=ts_code, start_date=start, end_date=end)
        if frame is None or frame.empty:
            continue
        frame = frame.sort_values("trade_date")
        for _, row in frame.iterrows():
            trade_date = str(row["trade_date"])
            if len(trade_date) == 8:
                trade_date = f"{trade_date[:4]}-{trade_date[4:6]}-{trade_date[6:]}"
            conn.execute(
                """INSERT INTO stock_data
                (ts_code, trade_date, open, high, low, close, pre_close, change, pct_chg, vol, amount, "股票简称")
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    ts_code,
                    trade_date,
                    float(row["open"]),
                    float(row["high"]),
                    float(row["low"]),
                    float(row["close"]),
                    float(row["pre_close"]),
                    float(row["change"]),
                    float(row["pct_chg"]),
                    float(row["vol"]),
                    float(row["amount"]),
                    name,
                ),
            )
            inserted += 1
    return inserted > 0


def main() -> None:
    token = os.getenv("TUSHARE_TOKEN", "")
    conn = _connect()
    used = "演示随机日线"
    if token and seed_tushare(conn, token):
        used = "Tushare 日线"
    else:
        seed_synthetic(conn)
    conn.commit()
    count = conn.execute("SELECT COUNT(*) FROM stock_data").fetchone()[0]
    conn.close()
    print(f"已写入 {DB_PATH}，{count} 行（{used}）")
    print("股票: 600519.SH 贵州茅台 / 000858.SZ 五粮液 / 000776.SZ 广发证券 / 688981.SH 中芯国际")


if __name__ == "__main__":
    main()
