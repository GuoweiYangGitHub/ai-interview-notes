# Change: 用 TypeScript 复刻 Coze / Dify API 查阅示例

## Why

课 8 的 Python 示例（`CASE-Coze API使用`、`CASE-Dify API使用`）不在本仓库里，回头查接口形状要翻网盘。需要一份和现有 Agent 讲义同一套 TS 习惯的查阅入口，放在 `exampleAgentFramework/`，不挤进 `examples/01-07` 的 Agent 内核课序。

## What Changes

- 写入已有目录 `exampleAgentFramework/02.Coze API使用`：阻塞聊天、流式、带历史、查 Bot 信息（对应 `coze_client.py`）
- 写入已有目录 `exampleAgentFramework/01.Dify API使用`：对话流、文本生成、工作流、拉会话消息（对应 `dify_agent_client.py` 及两个 example）
- `.env.example` 补上 Coze / Dify 变量；`package.json` 增加 `npm run coze` / `npm run dify`
- 查阅 README 用与 `examples/README.md` 相同的字段

## Capabilities

### New Capabilities

- `coze-api`: 用官方 `@coze/api` 调中国区 Bot
- `dify-api`: 用 fetch 调 Dify 开放 API（对话 / 完成 / 工作流 / 消息）
- `framework-cookbook`: `exampleAgentFramework/` 作为平台 API 查阅区

## Impact

- 不影响 `examples/01-07` 的运行方式
- 需要真实 `COZE_*` / `DIFY_*` 才能打到线上或本地 Dify；缺密钥时只报配置错误
- 依赖新增 `@coze/api`；Dify 不引入第三方 SDK
