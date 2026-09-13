# 05.MCP协议融入Agent

下次工具在另一个进程、需要 list/call 再登记进 Action 给模型时看这里。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量

## 使用方法

```bash
npm run 05
```

跑完看 stdio server 的 `tools/list`、桥接成 Action、模型查一篇本地报告并终答。server 由本示例拉起，不必另开终端。

## 目录架构

```text
05.MCP协议融入Agent/
  data/reports.json    本地报告
  server.ts            stdio 上的搜候选 / 按 id 读详情
  mcpClient.ts         拉起 server、list、call
  bridge.ts            MCP tool → Action 形状
  client.ts            模型接入
  index.ts             list → call → 终答
```

## 查阅要点

- does: 拉起 stdio server，列出并调用本地报告工具，桥接成 Action 后让模型查一篇报告并作答
- not: 不做鉴权透传、Go server
- ref: 课08 `s01_fastmcp_server.py`、`s02_mcp_client.py`；课09 `s03_mcp_action_integration.py`
