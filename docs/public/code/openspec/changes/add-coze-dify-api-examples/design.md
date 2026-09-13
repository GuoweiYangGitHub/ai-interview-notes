# Design: Coze / Dify TypeScript 查阅示例

## Context

Python 课里 Coze 走 `cozepy` SDK，Dify 走 `requests` 直打 HTTP。本仓库其余示例是 TS + dotenv + 薄 client。查阅目标是「下次对着文件就能抄」，不是再包一层框架。

## Goals / Non-Goals

**Goals:**

- 课里出现过的功能点都能在 TS 里找到同名职责
- 密钥只在各自 `client.ts` 读
- 默认脚本非交互，避免卡住 stdin

**Non-Goals:**

- 不搬 Python 的交互式 REPL（`quit` / 切换 stream）
- 不做 Dify `app_type=auto` 连续试三个端点
- 不在这里讲 Agent 规划、工具循环（那是 `examples/01-07`）

## Decisions

1. **写入已有的 `01.Dify API使用` / `02.Coze API使用`，不自建目录。** 平台 API 和 `examples/01-07` 的 Agent 内核课序分开。
2. **Coze 用 `@coze/api`。** 对应课里的 `cozepy`（`createAndPoll` / `stream` / `bots.retrieve`）。
3. **Dify 用 `fetch`。** 对应课里的 `requests`，URL 和 payload 写在 client 里方便对照。
4. **Dify 默认 `http://localhost/v1`。** 课是本地化部署；云端改 `DIFY_BASE_URL=https://api.dify.ai/v1`。
5. **显式方法，不自动探测应用类型。** `chat` / `completion` / `workflow` 分开，避免把报错逻辑当成用法。

## Risks / Trade-offs

- 本地 Dify 的路径有时是 `/v1`，有时反代后不同；用 env 覆盖。
- Coze `bots.retrieve` 对未发布 Bot 可能失败；演示里失败只打印，不中断后续聊天。
