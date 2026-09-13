# dify-api

## Purpose

用 TypeScript + fetch 调用 Dify 开放 API：对话流、文本生成、工作流、会话消息。对应课 8 `CASE-Dify API使用`。默认打本地 Dify。

## ADDED Requirements

### Requirement: Isolated Dify client

`exampleAgentFramework/01.Dify API使用/client.ts` SHALL 提供 `createDifyClient()`，从 `DIFY_API_KEY`、`DIFY_BASE_URL`、`DIFY_USER_ID` 读取配置。缺 API Key 时 MUST 抛错。默认 Base URL SHALL 为 `http://localhost/v1`。

#### Scenario: Missing key

- **WHEN** 环境没有 `DIFY_API_KEY`
- **THEN** `createDifyClient()` 抛出错误，提示配置该变量

#### Scenario: Local default

- **WHEN** 未设置 `DIFY_BASE_URL`
- **THEN** 请求打到 `http://localhost/v1`

### Requirement: Chat messages blocking and stream

客户端 SHALL 提供 `chat(query, options)`，请求 `POST /chat-messages`。blocking 返回 `answer` 与 `conversation_id`；stream 为 true 时解析 SSE `message` / `message_end` 后返回拼接结果。传入 `conversationId` 时 MUST 写进 payload 以续聊。

#### Scenario: First chat turn

- **WHEN** 不带 conversationId 调用 blocking chat
- **THEN** 成功结果含 `answer` 与新的 `conversation_id`

#### Scenario: Stream chat

- **WHEN** `stream: true`
- **THEN** 客户端按 `data: ` 行解析事件，并把 `event=message` 的 answer 拼起来

### Requirement: Completion and workflow

客户端 SHALL 提供 `completion(inputs)` 请求 `POST /completion-messages`，以及 `runWorkflow(inputs)` 请求 `POST /workflows/run`。工作流成功时 MUST 从 outputs 里取出可读文本放到 `answer`。

#### Scenario: Workflow outputs

- **WHEN** 工作流 blocking 返回 `data.outputs`
- **THEN** 结果包含 `outputs`、`workflow_run_id`，并尽量填 `answer`

### Requirement: List conversation messages

客户端 SHALL 提供 `getConversationMessages(conversationId)`，请求 `GET /messages?conversation_id=&user=`。

#### Scenario: After a chat

- **WHEN** 已有 conversation_id
- **THEN** 返回该会话的消息列表数据
