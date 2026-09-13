# Tushare

下次要用 Python Tushare Pro 当 MCP 工具查 A 股数据时看这里。

Tushare 是 Python 开源库（https://tushare.pro）。本目录用 FastMCP 把常用接口暴露成 stdio 工具，TS 侧只负责 list / call。

## 前置条件

- 仓库根目录 `.env`：`TUSHARE_TOKEN`（在 https://tushare.pro 注册后复制 token）
- 密钥只进 `client.ts`，再传给 Python 子进程；`server.py` 只读环境变量
- Python 3.10+：`pip install -r exampleMcpTools/Tushare/requirements.txt`
- 部分接口按 Tushare 积分权限开放，积分不够会由服务端报错

## 使用方法

```bash
npm run mcp:tushare
```

先 `tools/list`，再查 `600519.SH`（贵州茅台）2024 年 1 月日线。缺 token 会报错退出。

## 常用方法

对应 `server.py` 里的 MCP 工具，底层都是 `tushare.pro_api`：

| MCP 工具      | Tushare API       | 作用                                  |
| ------------- | ----------------- | ------------------------------------- |
| `stock_basic` | `pro.stock_basic` | A 股列表（代码、名称、行业、上市日）  |
| `daily`       | `pro.daily`       | 日线行情（开高低收、成交量）          |
| `daily_basic` | `pro.daily_basic` | 每日指标（PE / PB / 换手率 / 总市值） |
| `trade_cal`   | `pro.trade_cal`   | 交易日历（是否交易日）                |

调用约定：股票代码用 Tushare 格式（上交所 `.SH`、深交所 `.SZ`），日期 `YYYYMMDD`。

## 目录架构

```text
Tushare/
  server.py            Python FastMCP，包装 tushare.pro_api
  client.ts            读 TUSHARE_TOKEN
  index.ts             python server.py → list → daily
  requirements.txt     tushare、mcp、pandas
```

上级 `stdio.ts`：`connectStdioMcp` 拉起 Python。

## 查阅要点

- does: 用开源 `tushare` Python 库做 stdio MCP；列出工具并查茅台日线
- not: 不接社区 npx 包；不启 HTTP MCP；不把 MCP 再桥进 Agent
- ref: https://tushare.pro/document/2
