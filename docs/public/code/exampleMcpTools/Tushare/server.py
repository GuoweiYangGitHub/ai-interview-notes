"""Tushare Pro 的 stdio MCP。密钥只读环境变量 TUSHARE_TOKEN。"""
from __future__ import annotations

import os

import tushare as ts
from mcp.server.fastmcp import FastMCP

TOKEN = os.environ.get("TUSHARE_TOKEN", "").strip()
if not TOKEN:
    raise SystemExit("请先在仓库根目录 .env 中配置 TUSHARE_TOKEN")

pro = ts.pro_api(TOKEN)
mcp = FastMCP("tushare")


@mcp.tool()
def stock_basic(list_status: str = "L") -> str:
    """A 股基础列表。list_status: L 上市 D 退市 P 暂停。"""
    df = pro.stock_basic(
        exchange="",
        list_status=list_status,
        fields="ts_code,symbol,name,area,industry,list_date",
    )
    return df.head(30).to_csv(index=False)


@mcp.tool()
def daily(ts_code: str, start_date: str, end_date: str) -> str:
    """日线行情。日期 YYYYMMDD，如 20240101。"""
    df = pro.daily(ts_code=ts_code, start_date=start_date, end_date=end_date)
    return df.to_csv(index=False)


@mcp.tool()
def daily_basic(ts_code: str, trade_date: str) -> str:
    """每日指标：PE / PB / 换手率等。"""
    df = pro.daily_basic(
        ts_code=ts_code,
        trade_date=trade_date,
        fields="ts_code,trade_date,close,pe,pb,turnover_rate,total_mv",
    )
    return df.to_csv(index=False)


@mcp.tool()
def trade_cal(exchange: str = "SSE", start_date: str = "", end_date: str = "") -> str:
    """交易所交易日历。exchange: SSE 上交所 SZSE 深交所。"""
    df = pro.trade_cal(
        exchange=exchange,
        start_date=start_date or None,
        end_date=end_date or None,
    )
    return df.head(40).to_csv(index=False)


if __name__ == "__main__":
    mcp.run(transport="stdio")
