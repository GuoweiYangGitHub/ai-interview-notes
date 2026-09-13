# model-client

## Purpose

模型接入集中在各示例的 `client.ts`。业务代码只拿 client 和 model，不读环境变量。
默认走阿里云百炼 Token Plan 的 OpenAI 兼容接口（`sk-sp-` 密钥 + token-plan 北京地址 + `qwen3.8-flash`），不要和普通百炼按量通道混用。

## Requirements

### Requirement: Isolated client factory

每个需要调模型的示例 SHALL 提供 `createClient()`，返回 `{ client, model }`。除 `client.ts` 外，业务代码 MUST NOT 读取 API Key、Base URL 或模型名环境变量。

#### Scenario: Business code uses factory only

- **WHEN** `index.ts` 发起一次聊天补全
- **THEN** 它调用 `createClient()` 取得 client 与 model，并且自身不访问 `process.env` 中的密钥或模型配置

### Requirement: Token Plan compatible endpoint

`createClient()` SHALL 使用 OpenAI 兼容客户端，默认 Base URL 为 `https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1`，默认模型为 `qwen3.8-flash`。API Key SHALL 从 `BAILIAN_TOKEN_PLAN_API_KEY`（或兼容的 Token Plan 密钥变量）读取。

#### Scenario: Missing API key

- **WHEN** 环境中没有 Token Plan API Key
- **THEN** `createClient()` 抛出错误，提示配置 `BAILIAN_TOKEN_PLAN_API_KEY`（`sk-sp-` 开头），并且不发起网络请求

#### Scenario: Env overrides

- **WHEN** `.env` 提供 `CHAT_BASE_URL` 与 `CHAT_MODEL`
- **THEN** 客户端使用这两项覆盖默认地址和模型名

### Requirement: Do not mix billing channels

配置说明 SHALL 写明 Token Plan 的 `sk-sp-` 密钥必须搭配 Token Plan Base URL。文档与示例 MUST NOT 引导把 Token Plan 密钥与 `dashscope.aliyuncs.com` 按量地址混用。

#### Scenario: Example env template

- **WHEN** 阅读仓库根目录的 `.env.example`
- **THEN** 其中包含 `BAILIAN_TOKEN_PLAN_API_KEY`、Token Plan 的 `CHAT_BASE_URL`，以及 `CHAT_MODEL=qwen3.8-flash`
