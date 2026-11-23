# THINGJS 文档 RAG · API 契约与鉴权
> 一句话定位：服务端用 Zod 定义请求/响应，前端和评测平台各自校验响应形状；网页走网关门禁 + HttpOnly Cookie，机器客户端走 Bearer。

## 契约原则

- 请求/响应以 `server/src/schemas/` 的 Zod schema 为准。
- 前端和评测平台各自用 Zod 校验响应形状，不复制服务端实现。
- 失败响应统一 `{ ok: false, code, error, traceId? }`。
- 成功响应统一 `{ ok: true, traceId, ...payload }`。
- 所有响应带 `X-Trace-Id`；客户端可以传 `x-trace-id` 复用。

## HTTP API

### 问答与检索

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/search` | 纯检索，不调用 Chat 模型 |
| POST | `/api/chat` | 检索 + 生成；支持 `history`；`stream: true` 返回 SSE |
| POST | `/api/feedback` | 点踩与评论；当前只接受 `rating: "down"` |

请求 schema：

```ts
SearchRequest = {
  question: string(1..1000),
  // code_debug：贴代码/报错时可选；普通问答不传
  code?: string(max 8000),
  errorText?: string(max 4000)
  // 注意：/api/search 是单轮的，不接受 history
}

ChatRequest = SearchRequest & {
  history?: { role: 'user'|'assistant', content: string(1..4000) }[] (max 12),
  sessionId?: string(max 80),
  clientTurnId?: string(max 120),
  userClientId?: string(max 80),
  assistantClientId?: string(max 80),
  retryOfUserClientId?: string(1..80),
  retryOfAssistantClientId?: string(1..80),
  stream?: boolean
}
```

`code` 或 `errorText` 非空时，服务端标记 `intent=code_debug`，跳过追问改写，使用 code-debug 提示词；响应里的 `intent` 也返回该值。普通问答返回 `intent=docs`。

重试契约：

- 正常提交用 `userClientId`；重试时带原用户和旧助手的原始字符串 ID，并省略新增 `userClientId`。
- 服务端按会话归属、角色、配对校验；格式有效但不存在、已清理、跨会话、角色错误或两个引用无法证实配对，统一 400 `invalid_retry_reference`。
- 新助手消息保存 `source_user_client_id`，历史响应透传 `sourceUserClientId`。
- 同一会话同时只允许一个 running turn；重复 `clientTurnId` 幂等，并发第二路 409 `session_busy`。

### 登录与会话

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/auth/session` | 登录状态；`authRequired` 决定前端是否显示登录页 |
| GET | `/api/auth/quota` | 登录模式用当前用户令牌实时查配额；免登录模式 30s 缓存 |
| POST | `/api/auth/login` | 网关账号密码登录；服务端换令牌并下发 HttpOnly 会话 Cookie |
| POST | `/api/auth/logout` | 销毁服务端会话并清除 Cookie |

### 对话历史

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/chat/sessions` | 当前用户会话列表（不含软删除） |
| POST | `/api/chat/sessions` | 新建会话；201 created / 200 exists / 410 deleted / 409 conflict/quota |
| GET | `/api/chat/sessions/:id` | 会话详情与全部消息；不存在/已删除 404 |
| PATCH | `/api/chat/sessions/:id` | 重命名 |
| DELETE | `/api/chat/sessions/:id` | 软删除（写 `deleted_at`） |
| POST | `/api/chat/sessions/:id/messages` | 幂等追加消息（按 `clientId` 去重，每批最多 30 条） |
| DELETE | `/api/chat/sessions/:id/messages` | 清空消息，标题恢复「新对话」 |
| GET | `/api/chat/sessions/:id/turns` | 轮次/步骤状态（网页账号归属）；评测台走 `/ops/api/sessions/:id/turns` |

消息追加：

- `clientId` 是前端生成的稳定 id；重复提交不会重复插入。
- `code` / `errorText` 也按消息持久化（code ≤8000、errorText ≤4000），会话详情原样返回；跨浏览器刷新仍能看到代码与报错。
- 重试写入的新助手消息保存 `source_user_client_id`；旧记录无法确认配对时只保留在展示层，不进入模型记忆。
- 每轮在 `chat_turns` 记录状态，阶段调用在 `chat_steps`；服务启动时把遗留 running 标记 `interrupted`。
- 单条 `response` JSON 超过 1 MB 返回 413 `message_too_large`。
- 首次用户消息决定会话标题（最多 24 字 + 省略号）。
- 点踩状态按 `response.traceId` 反查 `feedback`，返回 `feedbackDone`，换浏览器仍显示「已反馈」。

### 健康与指标

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/healthz`、`/api/health` | 存活、索引、提示词版本、发布状态、队列、今日统计 |
| GET | `/metrics` | Prometheus 指标 |
| GET | `/api/ready` | 检索器 / 模型就绪；未就绪 503 |
| GET | `/api/docs-assets/*` | 文档图片；限制在 assets 目录与图片扩展名 |

`/api/health` 关键字段：

```ts
{
  ok, service, startedAt, uptimeSeconds, shuttingDown,
  counters,
  index: { version, builtAt, embeddingModel } | null,
  indexReady,
  promptVersion,
  publish: { status, version, error?, gate? },
  chatModel, embeddingModel, embeddingDimensions,
  authMode, authRequired, mcpAuthRequired,
  searchConcurrency, searchQueueDepth, inFlightSearch,
  retrieval: todayStats(),
  sessions: sessionStats(),
  webDailyTokens,
  mcpPath: '/mcp'
}
```

### MCP

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST/GET/DELETE | `/mcp` | MCP Streamable HTTP |

- 工具：
  - `search_thingjs_docs({ query })`：混合检索，返回带 `chunk_id/类名/来源` 的片段。
  - `ask_thingjs_docs({ question })`：检索 + 生成带引用的回答。
- `POST` 初始化时创建 session；后续请求带 `mcp-session-id`。
- session 记录到 SQLite `mcp_sessions`（用户、部门、团队、IP、打开/关闭时间、工具、轮数、在途数）。
- `MCP_AUTH_REQUIRED` 控制是否强制 Bearer；`AUTH_MODE` 决定 resolver（mock/ldap/gateway）。
- 服务关闭时 `closeAll()` 关闭所有传输，在途工具调用收到 shutdown signal。

### 运维 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/ops/` | 运维大屏 |
| GET | `/ops/api/summary` | 索引、计数、队列、模型、发布状态 |
| POST | `/ops/api/reload-index` | 热加载（只允许本机） |
| GET | `/ops/api/daily` | 日报 |
| POST | `/ops/api/prune` | 手动清理审计/会话（只允许本机） |
| GET | `/ops/api/calls/stats` | 调用统计 |
| GET | `/ops/api/calls/series` | 分桶趋势（5m/15m/1h/1d） |
| GET | `/ops/api/calls` | 调用列表 |
| GET | `/ops/api/calls/:traceId` | 调用详情 |
| POST | `/ops/api/calls/:traceId/replay` | 重放（只允许本机） |
| GET | `/ops/api/issues` | 问题列表与计数 |
| GET | `/ops/api/issues/anomalies` | 异常候选预览 |
| POST | `/ops/api/issues/scan` | 扫描建单（只允许本机） |
| POST | `/ops/api/issues/backfill-feedback` | 回填历史点踩 |
| GET | `/ops/api/issues/:id` | 问题详情 + 事件流 |
| POST | `/ops/api/issues` | 创建问题（只允许本机） |
| POST | `/ops/api/issues/import-eval` | 评测失败批量建单 |
| PATCH | `/ops/api/issues/:id` | 更新问题（只允许本机） |
| POST | `/ops/api/issues/:id/verification` | 记录单题回归验证 |
| GET | `/ops/api/kb/health` | KB 健康报告 |
| GET | `/ops/api/kb/health/versions` | KB 报告版本 |
| GET | `/ops/api/quality` | 问题质量指标 |
| GET | `/ops/api/traces` | 最近 live trace |
| GET | `/ops/api/sessions` | MCP 会话 |
| GET | `/ops/api/top-questions` | 高频问题 |

默认 `OPS_READ_LOCAL_ONLY=true`，`/ops/api/*` 只允许回环地址；写操作额外只允许回环。内网读取需显式关闭并自备前置鉴权。

## 关键响应契约

### 检索响应

实现：`server/src/schemas/search.ts`

```ts
SearchResult = {
  question,
  chunks: SearchChunk[],
  discarded: SearchChunk[],
  sources: string[],
  context: string,
  confidence?: 'ok'|'low'|'empty',
  degradedReasons?: string[],
  emptyReason?: string,
  suggestions: { className, fullName, reason }[],
  rewrite: { original, used, retried },
  conflicts: KnowledgeConflict[],
  indexVersion?, indexBuiltAt?,
  effectiveTopK?,
  aliasExpand: { original, expanded, hint, matched },
  timing: { totalMs, phasesMs, phases }
}
```

`SearchChunk` 包含：

```ts
{
  chunkId, sourceType, sourceCorpus, className, memberName,
  filePath, sourceLabel, parentTitle,
  score, vectorScore, bm25Score, vectorRank, bm25Rank, fusionScore,
  evidence: {
    matchMode, className, memberName,
    vectorRank, bm25Rank, fusionScore,
    finalPosition, adoptReason, missReason?
  },
  text, images
}
```

### 问答响应

实现：`server/src/schemas/answer.ts`

```ts
RagAnswer = {
  answer,
  reasoningSummary,
  citations: Citation[],
  retrieved: Citation[],
  discarded: Citation[],
  answerEvidenceIds?: string[],
  excludedAnswerEvidence?: { chunkId, reason }[],
  answerGuard?: {
    status: 'not_applicable'|'first_pass'|'retry_pass'|
            'fallback_violation'|'fallback_error'|'no_answer_evidence',
    modelCallCount,
    retrievalConfidence,
    triggerReasons?
  },
  llmPrompt: {
    promptName, promptVersion?, model, temperature,
    responseFormat: string|null,
    messages: { role: 'system'|'user'|'assistant', content }[]
  },
  usage: { promptTokens, completionTokens, totalTokens },
  degraded?, confidence?, degradedReasons?, emptyReason?,
  suggestions, rewrite, rewriteFallbackReason?,
  conflicts,
  indexVersion?, indexBuiltAt?, promptVersion?,
  timing
}
```

### 错误码

| code | HTTP | 场景 |
| --- | --- | --- |
| `schema` | 400 | Zod 校验失败 |
| `bad_request` | 400 | 请求体不是合法 JSON |
| `unauthorized` | 401 | 缺少/非法 Bearer |
| `login_required` | 401 | 网页未登录 |
| `session_expired` | 401 | 会话/网关 token 过期 |
| `invalid_token` | 401 | 网关 token 无效 |
| `user_disabled` | 403 | 网关账号停用 |
| `model_forbidden` | 403 | 账号无模型权限 |
| `forbidden` | 403 | 运维接口非本机 |
| `quota_exceeded` | 429 | 网关/本地配额用完 |
| `rate_limited` | 429 | 限流 |
| `queue_full` | 429 | 检索队列满 |
| `replay_busy` | 429 | 重放并发超限 |
| `chat_busy` | 503 | 生成队列满 |
| `retrieval_timeout` | 504 | 检索排队超时 |
| `chat_timeout` | 504 | 生成排队超时 |
| `queue_timeout` | 503 | 网关排队超时 |
| `gateway_unavailable` | 503 | 网关不可用 |
| `index_not_ready` | 503 | 没有激活索引 |
| `index_embedding_mismatch` | 503 | 索引模型/维度与配置不一致 |
| `model_not_ready` | 503 | Chat 模型未就绪 |
| `client_aborted` | 499 | 客户端断开（不写响应体） |
| `server_shutdown` | 503 | 服务关闭中 |
| `history_unavailable` | 501 | 免登录模式没有服务端历史 |
| `invalid_retry_reference` | 400 | 重试引用的原用户/旧助手不存在、跨会话、角色错误或配对不符 |
| `session_busy` | 409 | 同一会话已有 running turn，并发第二路被拒绝 |
| `session_conflict` | 409 | 会话 id 被其他用户占用 |
| `session_deleted` | 410 | 会话已删除 |
| `session_quota` | 409 | 单用户会话数上限 |
| `message_too_large` | 413 | 单条 response 超过 1 MB |
| `no_detail` | 409 | 旧调用没有可重放详情 |
| `unsupported_route` | 400 | 只支持 http.chat/search 重放 |
| `internal` | 500 | 未预期异常（对外脱敏） |

## 鉴权

### 两套开关

| 开关 | 取值 | 作用 |
| --- | --- | --- |
| `WEB_AUTH_MODE` | `gateway`（默认）/ `off` | 网页登录：`/api/chat`、`/api/search`、`/api/feedback` 是否需要会话/网关 Bearer |
| `AUTH_MODE` | `off` / `mock` / `ldap` / `gateway` | 机器客户端（MCP/脚本）的 Bearer 解析方式 |

> 别混淆：`WEB_AUTH_MODE=gateway` 是网页登录；`AUTH_MODE=gateway` 是 Bearer 转发到网关 `/account`。两者可以组合。

### 网页登录（gateway）

实现：`server/src/app/auth/webSession.ts`

```text
用户提交用户名/密码
→ POST 网关 /auth/token 换短期令牌
→ 服务端创建 express-session，令牌只存服务端 session
→ 浏览器只拿 thingjs.sid（HttpOnly / SameSite=Lax / Secure 可配）
→ 每轮问答前 preflightWebChat：
   - token 模式：GET /v1/account 查配额、模型权限
   - compat 模式：GET /auth/me 确认 Cookie 有效
→ 生成阶段使用用户令牌（token 模式）或服务端 Key（compat 模式）
```

- 会话存储：`session-file-store` 落盘到 `data/sessions`，文件内容用 `WEB_SESSION_SECRET` 加密；重启后登录态保留（前提是 secret 固定）。
- `gateway` 模式强制要求固定 `WEB_SESSION_SECRET`，否则 env 校验失败；随机 secret 会导致重启掉线、多进程互不认。
- 会话 TTL 默认 8 小时；`rolling: true`，活跃续期。
- 401/403/429/504 等网关致命错误不降级；会话过期清 Cookie，前端回登录页。
- 兼容旧网关：没有 `/auth/token` 时，`GATEWAY_AUTH_ALLOW_LOGIN_FALLBACK=true` 退回 `/auth/login` Cookie，响应标 `compat=true`；模型调用暂用 `OPENAI_API_KEY`，升级网关后自动恢复用户令牌。
- 管理入口（观测台、网关文档）只对 `WEB_ADMIN_USERS` 中的账号显示；网关 `/account` 不返回角色，避免把 dept 当权限位。

### 机器客户端

| `AUTH_MODE` | 行为 |
| --- | --- |
| `off` | 不解析 Bearer；MCP 是否强制由 `MCP_AUTH_REQUIRED` 决定 |
| `mock` | 固定 Bearer token，`GET /mock/auth/token` 获取；只用于联调 |
| `ldap` | `jose` 校验 JWT，`ldapts` 查目录；需要 `AUTH_JWT_SECRET` + `AUTH_USERINFO_URL` 或 `LDAP_URL` |
| `gateway` | Bearer 转发到网关 `/account`，取账号归属与日配额 |

评测平台：

- mock 模式自动取 token；
- ldap 模式需显式 `RAG_TOKEN`；
- 网页网关模式复用 `server/.env` 的 `OPENAI_API_KEY` 作为机器凭据，经 `/v1/account` 校验；
- 评测调用带 `x-thingjs-eval-run` / `x-thingjs-eval-kind`，运维统计按 source 隔离。

## 限流、CORS、安全

### 限流

实现：`server/src/app/http/rateLimit.ts`

- `express-rate-limit` 进程内滑动窗口。
- 检索 120/min，问答 30/min，登录 20/min。
- 触发返回 429 + `Retry-After` + `{ ok:false, code:'rate_limited' }`。
- 拒绝时写 `request_rejections`，并给检索/问答写一条错误 `turns`，避免观测台看不到被限流的请求。
- 多实例部署时这是单实例限流，不是全局限流。

### CORS

- `CORS_ORIGINS` 空或 `*` 反射 Origin；逗号分隔为白名单。
- `credentials: true`，允许 Cookie。
- 允许头：`Content-Type`、`Authorization`、`mcp-session-id`、`mcp-protocol-version`、`Last-Event-ID`、`x-trace-id`、`x-thingjs-client`、`x-thingjs-eval-run`、`x-thingjs-eval-kind`。
- 暴露头：`mcp-session-id`、`mcp-protocol-version`、`X-Trace-Id`。

### 其他

- helmet：CSP 先关闭（静态页有内联脚本）；跨源资源策略允许文档图片。
- `express.json({ limit: '2mb' })`；会话消息单条 response 1 MB。
- `trust proxy` 默认 1；直连设 0。
- 静态文档图片限制在 `assets` 目录与图片扩展名，防目录穿越。
- 运维只读接口默认本机；写操作强制本机。
- 日志脱敏：Authorization、token、API key、JWT secret、LDAP 密码。
- `.env` 不提交、不打印、不写报告/fixture。

## 流式协议细节

完整协议见 [04-生成与会话记忆](/03-项目实战/01-THINGJS文档RAG/04-生成与会话记忆) 的「流式问答（SSE）」。这里只强调契约：

- `phase` 只用于展示；
- `delta` 只是 `final_answer` 预览，可能因重试被 `reset`；
- `done` 里的 `RagAnswer` 是权威结果；
- `error` 在流开始后发生；流开始前的错误走普通 JSON 400/401/429/503。
- 客户端断开后服务端停止模型调用；`done` 不会再来。

## 面试讲法

> 「接口契约我用 Zod 定义在服务端，前端和评测平台各自校验响应，不共享实现。鉴权分两套：网页是网关门禁换短期令牌，令牌只存服务端 session，浏览器只有 HttpOnly Cookie；机器客户端走 Bearer，支持 off/mock/ldap/gateway。每轮问答前会做网关预检，配额/模型权限/登录过期在生成前就拦住。限流、CORS、body 上限、运维本机限制和日志脱敏都是默认打开的。」

## 源码入口

- 路由：`server/src/app/app.ts`
- 契约：`server/src/schemas/`
- 鉴权：`server/src/app/auth/`
- 限流：`server/src/app/http/rateLimit.ts`
- CORS：`server/src/app/http/corsOrigins.ts`
- SSE：`server/src/app/http/sse.ts`
- MCP：`server/src/app/mcp/`
- 运维路由：`server/src/ops/server.ts`
- 环境变量：`server/.env.example`、`server/src/config/env.ts`
