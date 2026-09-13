---
name: stock-sql
description: '对本地 SQLite 股票库执行 SELECT 并自动生成走势图。查历史行情、对比股票、统计涨跌幅时使用。'
keywords: SQL, 查询, 历史数据, 股价, 对比, 日线, stock_data, 成交量
---

# stock-sql

## 执行命令（工作区根目录）

```text
python skills/stock-sql/scripts/run_sql.py --sql "YOUR_SELECT_HERE"
```

可用 `DATE('now', '-1 month')`，脚本会改成 `YYYY-MM-DD` 字面量。

## 表 stock_data

`ts_code`, `trade_date`, `open`, `high`, `low`, `close`, `pre_close`, `change`, `pct_chg`, `vol`, `amount`, `"股票简称"`

中文列名必须双引号。只允许 SELECT。涨跌幅要取区间首末日收盘，不要随便抽几行。

## 返回

JSON：`table`、`chart`（markdown 图片，须原样展示）。一行结果不出图。
