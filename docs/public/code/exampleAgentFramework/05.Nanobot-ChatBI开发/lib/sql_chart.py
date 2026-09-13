# -*- coding: utf-8 -*-
"""SQL 查询并生成图表。日线日期是 TEXT YYYY-MM-DD，DATE('now') 会改成字面量。"""
from __future__ import annotations

import calendar
import decimal
import re
import sqlite3
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

plt.rcParams["font.sans-serif"] = ["SimHei", "Microsoft YaHei", "SimSun", "Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False


def process_sql_for_standard_date(sql: str) -> str:
    def get_target_date_from_offset(offset_str: str) -> str:
        now = datetime.now()

        if "'-1 month'" in offset_str or '"-1 month"' in offset_str:
            if now.month == 1:
                target_year, target_month = now.year - 1, 12
            else:
                target_year, target_month = now.year, now.month - 1
            _, last_day = calendar.monthrange(target_year, target_month)
            return datetime(target_year, target_month, min(now.day, last_day)).strftime(
                "%Y-%m-%d"
            )
        if "'-1 year'" in offset_str or '"-1 year"' in offset_str:
            return datetime(now.year - 1, now.month, now.day).strftime("%Y-%m-%d")
        if "'+1 day'" in offset_str or '"+1 day"' in offset_str:
            return (now + timedelta(days=1)).strftime("%Y-%m-%d")
        if "'-1 day'" in offset_str or '"-1 day"' in offset_str:
            return (now - timedelta(days=1)).strftime("%Y-%m-%d")
        if "'now'" in offset_str or '"now"' in offset_str:
            return now.strftime("%Y-%m-%d")

        match = re.search(
            r"([+-]\d+)\s*(day|days|week|weeks|month|months|year|years)",
            offset_str.lower(),
        )
        if match:
            amount = int(match.group(1))
            unit = match.group(2)
            if "month" in unit:
                target_month = now.month + amount
                target_year = now.year
                while target_month > 12:
                    target_month -= 12
                    target_year += 1
                while target_month <= 0:
                    target_month += 12
                    target_year -= 1
                _, last_day = calendar.monthrange(target_year, target_month)
                return datetime(
                    target_year, target_month, min(now.day, last_day)
                ).strftime("%Y-%m-%d")
            if "week" in unit:
                return (now + timedelta(weeks=amount)).strftime("%Y-%m-%d")
            if "year" in unit:
                return datetime(now.year + amount, now.month, now.day).strftime(
                    "%Y-%m-%d"
                )
            return (now + timedelta(days=amount)).strftime("%Y-%m-%d")
        return now.strftime("%Y-%m-%d")

    def replace_condition_date_function(match: re.Match) -> str:
        return f"trade_date {match.group(1)} '{get_target_date_from_offset(match.group(2))}'"

    def replace_standalone_date_function(match: re.Match) -> str:
        return f"'{get_target_date_from_offset(match.group(1))}'"

    sql = re.sub(
        r"trade_date\s*(>=|<=|>|<|!=|=)\s*DATE\s*\(\s*(['\"].*)\)",
        replace_condition_date_function,
        sql,
        flags=re.IGNORECASE,
    )
    sql = re.sub(
        r"DATE\s*\(\s*(['\"].*)\)",
        replace_standalone_date_function,
        sql,
        flags=re.IGNORECASE,
    )
    return sql


def df_to_markdown(df: pd.DataFrame) -> str:
    if df.empty:
        return "(空表)"
    cols = [str(c) for c in df.columns]
    lines = [
        "| " + " | ".join(cols) + " |",
        "| " + " | ".join("---" for _ in cols) + " |",
    ]
    for _, row in df.iterrows():
        lines.append("| " + " | ".join(str(v) for v in row.tolist()) + " |")
    return "\n".join(lines)


def generate_chart_png(df_sql: pd.DataFrame, save_path: Path) -> None:
    """行多折线，行少柱状。"""
    date_columns = [col for col in df_sql.columns if "date" in col.lower()]
    close_column = [col for col in df_sql.columns if "close" in col.lower()]
    n = len(df_sql)
    use_bar = n <= 10

    fig, ax = plt.subplots(figsize=(12, 6))

    if date_columns and close_column:
        date_col, close_col = date_columns[0], close_column[0]
        x_values = df_sql[date_col].astype(str)
        y_values = df_sql[close_col]
        if use_bar:
            ax.bar(x_values, y_values, color="#1f77b4", label=f"{close_col}")
        else:
            ax.plot(x_values, y_values, marker="o", label=f"{close_col}", linewidth=2)
        ax.set_xlabel(date_col)
        ax.set_ylabel(str(close_col))
        ax.set_title("收盘价走势")
        if n > 10:
            step = max(1, n // 10)
            ticks = list(range(0, n, step))
            ax.set_xticks(ticks)
            ax.set_xticklabels([x_values.iloc[i] for i in ticks], rotation=45)
        else:
            ax.tick_params(axis="x", rotation=45)
    else:
        numeric_columns = df_sql.select_dtypes(include=[np.number]).columns.tolist()
        if not numeric_columns:
            plt.close()
            raise ValueError("没有可绘制的数值列")
        first_numeric = numeric_columns[0]
        if use_bar:
            ax.bar(range(n), df_sql[first_numeric], color="#1f77b4", label=first_numeric)
        else:
            ax.plot(df_sql[first_numeric], marker="o", label=first_numeric, linewidth=2)
        ax.set_title("数据走势")
        ax.set_xlabel("Index")
        ax.set_ylabel(str(first_numeric))

    ax.legend()
    ax.grid(True, linestyle="--", alpha=0.6)
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.close()


def run_exc_sql(sql: str, db_path: Path, workspace_root: Path) -> dict[str, Any]:
    if not db_path.is_file():
        return {
            "ok": False,
            "error": f"数据库不存在: {db_path}，请先运行 npm run chatbi:seed",
        }

    trimmed = sql.strip().rstrip(";")
    if not re.match(r"(?is)^\s*select\b", trimmed):
        return {"ok": False, "error": "只允许 SELECT"}

    charts_dir = workspace_root / "charts"
    charts_dir.mkdir(parents=True, exist_ok=True)
    connection = None
    try:
        processed_sql = process_sql_for_standard_date(trimmed)
        connection = sqlite3.connect(str(db_path))
        cursor = connection.cursor()
        cursor.execute(processed_sql)
        result = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        rows = []
        for row in result:
            item = {}
            for i, col in enumerate(columns):
                value = row[i]
                if isinstance(value, decimal.Decimal):
                    value = float(value)
                item[col] = value
            rows.append(item)

        df = pd.DataFrame(rows)
        img_md = None
        if len(rows) >= 2:
            filename = f"chart_{int(time.time() * 1000)}.png"
            save_path = charts_dir / filename
            generate_chart_png(df, save_path)
            img_md = f"![股票数据图表](charts/{filename})"

        if len(rows) > 100:
            summary: dict[str, Any] = {"总记录数": len(rows)}
            if "trade_date" in df.columns:
                summary["日期范围"] = f"{df['trade_date'].min()} 至 {df['trade_date'].max()}"
            md = f"数据量较大（{len(rows)} 条），汇总如下：\n\n{df_to_markdown(pd.DataFrame([summary]))}"
        else:
            md = df_to_markdown(df)

        return {
            "ok": True,
            "result": rows,
            "count": len(rows),
            "table": md,
            "chart": img_md,
        }
    except Exception as exc:
        return {"ok": False, "error": f"执行SQL查询时出错: {exc}"}
    finally:
        if connection is not None:
            connection.close()
