# coze-api

## Purpose

用 TypeScript 调用 Coze 中国区已发布 Bot：阻塞拿完整回复、流式吐增量、带历史、查 Bot 元数据。对应课 8 `CASE-Coze API使用`。

## ADDED Requirements

### Requirement: Isolated Coze client

`exampleAgentFramework/02.Coze API使用/client.ts` SHALL 提供 `createCozeClient()`，从 `COZE_API_TOKEN`、`COZE_BOT_ID`、`COZE_BASE_URL`、`COZE_USER_ID` 读取配置。缺 token 或 bot id 时 MUST 抛错且不发请求。

#### Scenario: Missing token

- **WHEN** 环境没有 `COZE_API_TOKEN`
- **THEN** `createCozeClient()` 抛出错误，提示配置该变量

### Requirement: Blocking chat

客户端 SHALL 提供 `chat(message)`，内部使用 `createAndPoll`。聊天完成后 MUST 返回助手文本；未完成 MUST 返回带状态的说明。

#### Scenario: Completed reply

- **WHEN** Bot 正常结束一轮对话
- **THEN** `chat()` 返回助手 `content` 字符串

### Requirement: Streaming chat

客户端 SHALL 提供 `chatStream(message)`，对 `CONVERSATION_MESSAGE_DELTA` 逐段 yield 文本。

#### Scenario: Stream deltas

- **WHEN** 调用 `chatStream("你好")`
- **THEN** 调用方能按增量拼接出完整回复

### Requirement: Chat with history

客户端 SHALL 提供 `chatWithHistory(messages)`，把 `{ role, content }` 转成 user / assistant 附加消息再 `createAndPoll`。

#### Scenario: Follow-up with prior turn

- **WHEN** 传入一条 user 与一条 assistant 历史后再问新问题
- **THEN** 请求带上这些 additional_messages

### Requirement: Retrieve bot info

客户端 SHALL 提供 `getBotInfo()`，返回 `bot_id`、`name`、`description`、`create_time`、`update_time`。

#### Scenario: Published bot

- **WHEN** `COZE_BOT_ID` 指向已发布 Bot
- **THEN** `getBotInfo()` 返回上述字段
