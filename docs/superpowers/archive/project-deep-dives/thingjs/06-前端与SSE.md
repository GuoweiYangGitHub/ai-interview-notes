# THINGJS 文档 RAG · 前端与 SSE
> 一句话定位：前端只消费 HTTP 契约——用 Vue 3 单页状态机管理会话，用 SSE 做流式预览，用检查器把引用、耗时和实际提示词摊开给用户看。

## 定位与技术栈

前端只做三件事：

1. **问答页**：会话列表 + 对话窗口 + 流式回答 + 引用/耗时/提示词检查器 + 点踩。
2. **检索页**：只检索不生成，展示混合检索命中、分数、丢弃原因。
3. **登录/配额**：网关登录、会话过期处理、配额展示。

不包含检索、生成、评分逻辑；所有能力通过 `/api/*` 获取。响应全部用 Zod 校验，形状不合法直接报「响应格式不符合契约」。

技术栈：Vue 3.5 + TypeScript + Zod + Element Plus + Vite 6 + marked + DOMPurify。

## 目录与状态机

```text
frontend/src/
├─ App.vue                 单页状态机：模式、会话、消息、登录、配额
├─ api.ts                  HTTP/SSE 客户端 + Zod 响应校验
├─ types.ts                ChatEntry / InspectorTab
├─ degraded.ts             降级 code → 用户可读方向
├─ main.ts                 Vue 挂载 + Element Plus
├─ styles.css              全局样式
├─ lib/
│  ├─ sessions.ts          localStorage 会话读写、上限、迁移
│  ├─ history.ts           历史消息窗口（给 /api/chat）
│  └─ markdown.ts          marked + DOMPurify
└─ components/
   ├─ SessionSidebar.vue   会话列表、新建、删除、配额、登录态
   ├─ MessageBubble.vue    消息气泡、置信度、降级提示、点踩/重试/复制
   ├─ MarkdownView.vue     Markdown 安全渲染
   ├─ CitationCard.vue     引用/检索片段卡片
   ├─ InspectorPanel.vue   依据 / 耗时 / 提示词三 tab
   ├─ TimingPanel.vue      阶段耗时瀑布
   ├─ PromptPanel.vue      实际 system/user 消息
   ├─ SearchView.vue       只检索
   └─ LoginView.vue        网关登录
```

没有 Pinia/Vuex；`App.vue` 用 `ref/computed/watch` 管理状态，组件通过 props/emits 通信。项目规模不需要引入状态库。

`App.vue` 主要状态：

| 状态 | 用途 |
| --- | --- |
| `mode` | `chat` / `search` |
| `sessions` | 当前会话列表；每个会话有 `entries` |
| `activeSessionId` | 当前会话 |
| `chatBusy` | 是否在生成 |
| `chatInput` | 输入框 |
| `activeEntryId` | 当前打开检查器的回答 |
| `inspectorTab` | `citations` / `timing` / `prompt` |
| `auth` | `/api/auth/session` 结果 |
| `quota` | 网关配额 |
| `showLogin` | 是否显示登录页 |

派生：

- `activeSession`、`chatEntries`、`activeEntry`；
- `serverHistory = auth.historyAvailable`；
- `healthText / healthClass / healthTitle`。

## [重点] 一次问答的前端流程

`submitChat(text?, retryOf?)`：

```text
1. 取问题；如果服务端历史且会话消息未加载，先拉取会话详情
2. 首次提问用前 24 字生成会话标题
3. 构造 history（给 /api/chat 的多轮上下文）
4. 服务端历史模式：先 createChatSession（幂等）
5. 插入用户消息；插入 pending 的助手消息（重试则复用原气泡）
6. AbortController；滚动到底部
7. streamChat()
   - onDelta：追加到 current.content，pending=false，streaming=true
   - onReset：清空预览，回到 pending
8. 成功：current.content = response.answer，保存 response，打开检查器
9. 失败：
   - AbortError → cancelled=true
   - 其他 → 保留已生成预览，写 error/errorCode，处理登录失效
10. finally：
   - 服务端历史模式：appendChatMessages（用户消息 + 助手消息）
   - 本地模式：persistNow() 写 localStorage
   - 恢复输入框焦点
```

关键细节：

- **重试复用原气泡**：`retryOf` 时不再插入重复用户问题；前端单独保留原始字符串 `clientId`，提交前捕获旧助手 ID，再替换本次尝试的界面 ID；请求带 `retryOfUserClientId` / `retryOfAssistantClientId`，省略新增 `userClientId`。服务端据此排除原用户和旧助手，流式/非流式都生效。
- **单框输入**：问答区只有一个输入框，上限 1000 字；用户可直接写描述、粘贴代码片段和报错，不再单独展开「代码/报错」面板。服务端根据代码围栏、`new THING.`、`const/let/var`、报错/堆栈等特征自动进入 `code_debug`。
- **兼容旧消息**：早期版本的 `code/errorText` 字段仍保留展示；重试旧消息时，前端把这两个字段并回 `question` 再发送。
- **保留中断预览**：服务重启/网络错误时，已收到的预览不清空，用户能看到中断前的内容；错误码区分 `server_shutdown` 和普通失败。
- **保存失败区分**：本轮没跑完 → 「历史未保存」；跑完但存不上 → 「已生成但历史保存失败」。
- **登录失效**：`handleAuthError()` 识别 `login_required / session_expired / invalid_token / unauthorized`，清会话、回登录页。
- **停止**：`controller.abort()`，服务端收到断开信号后停止模型调用。

## [重点] SSE 客户端解析

实现：`frontend/src/api.ts` 的 `streamChat()`：

- `fetch('/api/chat', { stream: true, accept: text/event-stream })`。
- 如果不是 `text/event-stream` 或响应失败，退回普通 JSON 解析，兼容老服务端。
- 用 `ReadableStream` + `TextDecoder` 手动解析 SSE：
  - 按 `\n\n` 分帧；
  - `event` / `data` 字段；
  - 支持多行 data；
  - 处理 `\r\n`。
- 事件：
  - `delta` → `onDelta(text)`
  - `reset` → `onReset(reason)`
  - `phase` → `onPhase({ phase, ms, startMs })`
  - `done` → `ChatResponseSchema.safeParse`，作为权威结果
  - `error` → `ApiError`
- 流结束没收到 `done` → `stream_incomplete`。
- 增量预览永远不会直接当作最终答案；`done` 里的完整响应才是。

服务端事件协议（前端消费的契约）：

| event | data | 前端动作 |
| --- | --- | --- |
| `phase` | `{ phase, ms, startMs? }` | 更新阶段耗时 |
| `delta` | `{ text }` | 追加预览，`pending=false`，`streaming=true` |
| `reset` | `{ reason? }` | 清空预览，回到 pending |
| `done` | `{ ok: true, traceId, ...ChatResponse }` | Zod 校验后作为权威结果 |
| `error` | `{ ok: false, traceId, code, error }` | 写错误态，区分登录失效 |

一个容易讲错的点：服务端模型输出的是结构化 JSON，`delta` 不是原始 token。服务端只解码 `"final_answer"` 的 JSON 字符串（处理 `\" \\ \n \t \uXXXX`，末尾半个转义留到下一块），前端拿到的已经是答案文本增量。最终仍以 `done` 的完整解析结果为准。

## 会话历史：服务端 vs localStorage

### 判定

`/api/auth/session` 返回 `historyAvailable`：

- `true`（登录模式）：历史存服务端 `chat_sessions/chat_messages`，按网关用户名归属。
- `false`（免登录模式）：历史存浏览器 localStorage。

### 本地模式

实现：`frontend/src/lib/sessions.ts`

- key：`thingjs.chat.sessions.v1`、`thingjs.chat.active.v1`。
- 最多 30 个会话、每个 80 条消息（`MAX_ENTRIES`）。
- 未完成的助手消息不落盘（没有 response/error/cancelled），避免刷新后停在「正在生成」。
- 读取时用 Zod 校验，坏数据丢弃/归一化。
- 标题：用户第一条消息前 24 字。

### 服务端模式

- 会话列表只取标题、时间、消息数；选中会话时才拉详情（按需加载）。
- 消息追加按 `clientId` 幂等，重复提交不重复插入；`question` / `code` / `errorText` 一起保存，刷新后用户气泡仍展示代码与报错。
- 删除是软删除；「清空」只清消息并恢复标题。
- 首次登录时，把 localStorage 旧会话导入一次：
  - 标记 `thingjs.chat.imported.v1`；
  - 每 10 条一批 `appendChatMessages`；
  - 导入成功后清本地；
  - 导入失败下次登录重试。

### 点踩同步

- `POST /api/feedback` 后本地标记 `feedback=true`。
- 会话详情按 `response.traceId` 返回 `feedbackDone`，换浏览器仍显示「已反馈」。
- 服务端对同一 `traceId + rating` 幂等，重复提交只更新评论。

## 检查器（Inspector）

`InspectorPanel.vue` 三个 tab：

| tab | 内容 |
| --- | --- |
| 依据 | `retrieved`（没有则 `citations`）+ `discarded`；引用卡片显示类名、成员、来源、分数、正文、图片 |
| 耗时 | `TimingPanel`：阶段瀑布，使用 `timing.phases` 的 `startMs` 和 `ms` |
| 提示词 | `PromptPanel`：`llmPrompt.messages` 的实际 system/user 内容、模型、温度、responseFormat、promptVersion |

「依据」里 `retrieved` 是全部召回，`citations` 是最终引用；`discarded` 单独展示，带 `discarded` 变体样式。

前端视角的价值：用户不需要看服务端日志，就能判断「是没召回、召回了没采纳、采纳了但答错，还是提示词/模型的问题」。这也是面试里讲「可解释」最直观的一页。

## 检索页

`SearchView.vue`：

- 输入问题 → `POST /api/search`。
- 展示：
  - 置信度 `ok/low/empty`；
  - 降级方向（`degraded.ts` 把 code 翻译成「语义检索不可用，已退化为关键词检索」等）；
  - 命中片段、分数（vectorScore/bm25Score/vectorRank/bm25Rank）；
  - 丢弃片段（可折叠）；
  - 别名展开提示；
  - 耗时。
- 支持停止（AbortController）。
- 登录错误 emit 给 `App.vue` 统一处理。

## 登录与配额

- `authRequired=true` 时进入页面先显示登录页；`LoginView` 提交用户名/密码。
- 登录成功后侧栏显示当前用户与实时配额。
- 配额每 60 秒刷新，也可手动刷新；网关不可用时只提示「配额不可用」，不阻塞问答。
- 管理入口（观测台、网关文档）只对 `admin=true` 显示。
- 会话过期/服务端返回 `login_required`/`session_expired` 自动回登录页；已生成的对话已写入服务端历史，重新登录仍可看。
- `WEB_ADMIN_USERS` 控制管理员；前端不自己判断角色，只信 `/api/auth/session` 的 `admin`。

## Markdown 安全

实现：`frontend/src/lib/markdown.ts`

- `marked` 解析 GFM。
- `DOMPurify.sanitize`，禁止 `style/iframe/form/input/button`。
- 外链自动加 `target="_blank" rel="noopener noreferrer"`。
- 模型输出和文档内容都按不可信 HTML 处理，防 XSS。

## 响应式与可用性

- 窄屏：会话列表变抽屉，由顶栏按钮开关。
- 消息区自动滚动；输入框自动增高。
- E2E 检查页面无横向溢出（`scrollWidth - clientWidth ≤ 1`）。
- 空态/错误态明确：服务离线、未登录、配额不可用、流式提前结束都有文案。
- 降级原因只展示方向，不回显服务端原始错误（`degraded.ts`）。

## E2E

`e2e/apps.spec.ts`，4 个场景：

1. 问答页加载、可输入、无横向溢出、无 pageerror；
2. 观测台指标、用户筛选、调用列表；
3. 趋势视图图表与索引版本表；
4. 问题队列、评测历史、回归验证、发布检查可加载。

E2E 只做页面冒烟，不复制业务逻辑；Playwright 复用已启动的 9966/9967/9968，未启动时自动拉起。

## 面试讲法

> 「前端没有把检索逻辑搬过来，只做契约消费。问答走 SSE：delta 只做预览，reset 会清空，done 才是权威结果；服务端历史模式按需拉消息、按 clientId 幂等追加，免登录模式退回 localStorage。重试时复用原气泡，带原用户和旧助手的 clientId，避免历史里出现重复问答。检查器把 retrieved/citations/discarded、阶段耗时和实际 prompt 都展示出来，方便定位问题。响应全部用 Zod 校验，Markdown 用 DOMPurify 消毒，E2E 覆盖了四个页面的加载和横向溢出。」

## 源码入口

- 主页面：`frontend/src/App.vue`
- API/SSE：`frontend/src/api.ts`
- 本地会话：`frontend/src/lib/sessions.ts`
- 历史窗口：`frontend/src/lib/history.ts`
- Markdown：`frontend/src/lib/markdown.ts`
- 组件：`frontend/src/components/`
- E2E：`e2e/apps.spec.ts`
- Vite 配置：`frontend/vite.config.ts`
