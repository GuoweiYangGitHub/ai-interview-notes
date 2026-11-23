# 江中智能助手 · 请求链路与LangGraph
> 一轮对话如何从 HTTP 进入主图，经 classify → route → act、计划编译与固定流程子图，再把场景回执和人工确认接回同一条链路。

## HTTP 入口

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| POST | `/chat` | 非流式对话；可选 `Idempotency-Key` 与 `messageId` |
| POST | `/chat/stream` | SSE 流式对话；不支持请求级幂等键，但支持 `messageId` |
| POST | `/scene/receipt` | 提交宿主场景执行回执，继续本轮 |
| POST | `/approval/decision` | 提交人工确认或放弃 |
| POST | `/v1/conversations` | 显式创建会话 |
| GET | `/v1/conversations/:sessionId` | 查询会话与当前流程 |
| POST | `/v1/conversations/:sessionId/abandon-turn` | 放弃中断的轮次 |
| GET | `/session/:sessionId/pending` | 恢复待处理场景/审批 |
| POST | `/v1/runs` | 创建后台运行，返回 202 |
| GET | `/v1/runs?sessionId=` | 列出会话的后台运行 |
| GET | `/v1/runs/:id` | 查询后台运行 |
| POST | `/v1/runs/:id/cancel` | 取消后台运行 |
| POST | `/batch/trace` | 批次追溯直连接口 |
| POST | `/work-orders/:action` | 工单动作直连接口 |
| POST | `/inspections/:action` | 巡检动作直连接口 |
| GET | `/auth/me` | 当前身份 |
| POST | `/auth/local-login` | 本地固定账号登录（仅显式开启） |
| GET | `/v1/review/*` | 链路、评测、标注、校准（独立鉴权） |
| GET | `/health`、`/live`、`/ready` | 探针 |

## 鉴权与会话

- `AUTH_MODE=static`：Bearer token 对应 `AUTH_USERS_JSON`，身份含 `tenant`、`userId`、`role`、`workOrderRoles`。
- `AUTH_MODE=gateway`：调用宿主网关校验，缓存结果，默认 60s；只读用户可单独配置。
- `AUTH_MODE=off`：固定公共运维身份，仅用于受信任内网演示；生产禁止。
- 会话必须属于当前用户与租户；越权、缺失、过期统一 404，避免泄露存在性。
- 同一会话轮次用 PostgreSQL 咨询锁串行；等待超过 `SESSION_LOCK_TIMEOUT_MS`（默认 10s）返回 409 `session_busy`。
- 轮次另有 active turn、心跳（默认 10s）与租约（默认 60s）；中断后需放弃轮次或按提示处理。
- 会话 7 天未更新即过期；清理任务每小时执行。

会话生命周期、租约恢复与身份设计的完整说明见 [/03-项目实战/02-江中智能助手/04-会话、记忆与身份](/03-项目实战/02-江中智能助手/04-会话、记忆与身份)。

## 三阶段理解：classify → route → act

| 阶段 | 输入 | 输出 | 失败处理 |
| --- | --- | --- | --- |
| classify | 当前问题 + 最近 4 条对话 | `reply / clarify / unsupported / single / continue` | 失败按 `single` |
| route | 全量工具目录 + `skills.yaml` + 任务卡 + 最近 6 条 | goals、steps、constraints、unknowns、taskIntent | 解析失败返回 null，本轮按普通路径 |
| act | 当前候选工具或已编译计划 + 上下文预算 | tool_calls 或最终答复 | 工具失败按合同结算，不编造 |

- `reply` 只带当前用户消息，不加载历史、记忆、任务卡与工具。
- `clarify` 只追问，不判断「有没有工具」。
- `single / continue` 才进入 route；route 输出计划后由编译器决定「执行、修复、澄清或交回旧路径」。
- 工具选择只依赖 metadata 与规则，不靠中文关键词；决策来源写入 decision span。

## [重点] 计划编译与执行

编译器校验：

- 工具必须在当前目录且属于允许的只读动作；
- 参数必须命中合同（必填/可选/未知字段）；
- 设备必须已在任务卡接地；
- 绑定来源、条件来源、依赖必须存在且不成环；
- 最多 8 步、3 层依赖、3 个知识库步骤；
- 写步骤、未知工具、越界动作整份拒绝；范围外动作交回既有路径。

执行器：

- `plan_join` 找出依赖已结算、条件命中、绑定源已完成的步骤；
- 每批最多 3 个，同名知识库步骤同一批只取一个；
- `plan_step` 执行后回写 `completed / blocked / waiting`、outcome、证据引用；
- 失败按依赖隔离：后续依赖步骤阻塞，独立步骤继续；
- 只读叶步骤最多重试 1 次；写操作不自动重试。

## LangGraph 主图

完整拓扑图见 [/03-项目实战/02-江中智能助手/01-项目全景与架构](/03-项目实战/02-江中智能助手/01-项目全景与架构) 的「LangGraph 拓扑」一节；这里只列节点职责与路由规则。

### 节点

| 节点 | 作用 |
| --- | --- |
| `assistant` | classify / route / 计划编译 / 模型调用 / 回答 |
| `tools` | 执行 tool_calls；判断审批、回流程或场景 |
| `plan_step` | 执行单个只读计划步骤 |
| `plan_join` | 汇总步骤结果，按依赖派发下一批 |
| `executor` | 顺序/一层并行执行器入口 |
| `executor_branch_sop` / `executor_branch_batch` | 特定动作的并行分支 |
| `executor_join` | 分支汇聚 |
| `scene` | 把场景动作写入 `sceneActions`，等待宿主回执 |
| `approval` | 结束本轮，返回审批卡 |
| `workflow_<kind>` | 三条固定流程的子图入口 |

### 路由规则

- `START`：有 `activeWorkflow` → 对应流程子图；否则看最新用户文本是否命中启动短语；都不命中 → `assistant`。
- `assistant`：`executionPhase=plan` → `plan_join`；`executionPhase=run` → `executor`；最后一条 AI 消息有 tool_calls → `tools`；否则结束。
- `plan_join`：有就绪步骤 → `Send` 到多个 `plan_step`；没有 → 回 `assistant` 收尾。
- `executor`：fanout → 分支节点；否则继续 `executor`；收尾 → `assistant`。
- `tools`：
  - 最后一批 tool_call 是审批提议 → `approval`；
  - 仍有 `activeWorkflow` → 回流程子图；
  - 有场景动作 → `scene`；
  - 否则回 `assistant`。
- `scene` → `assistant`；`approval` → 结束；固定流程子图 → 结束。

## 两条「回传继续」链路

### 场景动作

```text
模型生成 sceneActions（pending=true）
  → 网关返回 result
  → 宿主对话模块调用 handler 执行
  → 成功/失败生成 receipts
  → POST /scene/receipt
  → 网关把 receipts 写回图，继续同一步
  → 最终 result
```

- 回执带 `simulated` 标记时，宿主明确知道这是「仅模拟」。
- 执行前先把 `started:true` 写入本地日志；若断线/重启后状态不明，模块不会自动重放，要求人工核对。
- 服务端不内置场景方法；目录由宿主每次请求上报。

### 人工确认

```text
模型调用提议工具（如 create_maintenance_ticket）
  → tools 节点返回 approval
  → 宿主显示审批卡
  → POST /approval/decision {decision: approve|reject}
  → 服务端执行写操作（或放弃）
  → 继续本轮或返回最终 result
```

- 审批有效期由服务端返回；过期或重复提交会被拒绝。
- 写操作执行结果写入 `assistant_approval_audit`。
- 结果不确定（超时/网络断）时不重试，返回「请人工核对」。

## SSE 契约

事件顺序：若干 `status` / `delta` → 一次 `result` → `done`。

```text
event: status
data: {"phase":"thinking"}

event: status
data: {"phase":"tool","tool":"设备状态","state":"started"}

event: delta
data: {"text":"3 号设备"}

event: result
data: {"reply":"...","sceneActions":[],"pending":false}

event: done
data: {"requestId":"..."}
```

- `phase` 取值 `thinking | tool | approval | scene`；`state` 取值 `started | done | failed`。
- `result` 与 `/chat` 返回对象一致，客户端只认最后一次。
- 终止事件只可能是 `done` 或 `error`；中途断开不会自动重放。
- 服务端每 15s 发 `: ping` 心跳；客户端忽略注释行。

## [重点] LangGraph 适用边界

> 问题：哪些场景需要独立状态图？是不是所有写入都要做成图？

先区分三层：

1. **主图**：每个对话轮次都走 LangGraph 主图（`assistant → tools / plan_step → approval / scene / workflow`）。告警取消、报修提交、知识问答、三维动作都在主图里完成。
2. **只读计划执行器**：普通只读查询由 `assistant` 产出计划，编译器校验后交给 `plan_step / plan_join` 按依赖分批执行；它不是独立子图，但有自己的步骤状态、依赖、条件、重试和证据。
3. **独立流程子图**：只有需要多轮步骤、状态持久、分支/循环的场景才单独编译子图。

当前有 3 个固定流程子图：批次追溯、维修工单、巡检；只读计划覆盖 12 类动作。

### 判断清单

一个场景满足以下 **2 条以上**，才值得做独立子图：

- 需要跨多轮收集/确认多个字段；
- 中途要停下来等用户或审批，之后继续；
- 有分支、循环、回退、重试；
- 状态需要跨请求/重启恢复；
- 步骤间有角色、版本、状态机约束；
- 需要逐步审计「走到哪一步」。

只满足「一次工具调用 + 一次确认」的，不要做子图。

### 场景矩阵

| 场景 | 独立子图 | 原因 | 当前 |
| --- | --- | --- | --- |
| 批次追溯 | 是 | 批号 → 方向 → 查询 → 后续；方向分支、重试、质检追问 | 已有 |
| 巡检 | 是 | 路线 → 多站点循环 → 异常说明 → 提交；任务持久、逐站推进 | 已有 |
| 维修工单（维修角色） | 是 | 选单 → 动作 → 维修人 → 说明 → 确认 → 执行 → 不确定/后续；角色、版本、确认 | 已有，但应移出运维界面 |
| 设备状态查询 | 否 | 单次只读工具 | 主图工具 |
| 知识库问答 | 否 | 单次只读工具 | 主图工具 |
| 业务查询（生产/库存/销售/环境/能耗/组织） | 否 | 单次只读工具 | 主图工具 |
| 告警取消 | 否 | 一次提议 + 人工确认；无多步 | 主图 approval |
| 故障报修提交（运维） | 否 | 一次提议 + 人工确认；设备级去重 | 主图 approval |
| 批次记录（投料/工序/质检/出库） | 否 | 模型一次填参 + 人工确认；无多步 | 主图 approval |
| 三维动作 | 否 | 工具选择 + 场景回执 | 主图 scene |
| 我的报修进度 | 否 | 单次只读查询 | 已实现（`query_my_work_orders`） |
| 告警确认/签收 | 否 | 单次状态写入 | 已实现 |
| 误报/告警抑制 | 否 | 单次状态写入 + 原因 | 未做 |
| 交接班记录 | 视情况 | 如果只是「汇总未闭环事项 + 提交」，用工具；如果要逐项确认/补说明，才做小图 | 待定 |
| 停机/复产申请 | 候选 | 多字段 + 审批 + 可能多步 | 未做 |
| 备件领用申请 | 否 | 当前单明细：一次提议 + 人工确认 | 已实现（approval） |
| 告警处置 SOP | 否 | 只读知识库 + 模型整理步骤；不自动执行 | 已实现（只读） |

### 运维界面的结论

- 运维的写入大多是**单次状态变更 + 确认**：告警取消、告警确认、误报、报修提交。
- 这些不需要独立子图，主图的 `approval` 节点就够了。
- 运维界面**不应该进入维修工单子图**；派工/维修/验收是维修角色的流程。
- 巡检是例外：它天然是多站点、长事务，保留独立子图。
- 批次追溯保留独立子图；批次记录是单次确认，不需要。

### 新增业务先问

```text
主图：classify / route / 计划编译 / act
  ├─ 只读计划：plan_step / plan_join（不是子图）
  ├─ 工具 / 审批 / 场景回执
  ├─ 批次追溯子图
  ├─ 巡检子图
  └─ 维修工单子图（维修角色使用）
```

1. 是否超过一次工具调用？
2. 是否需要中途暂停/恢复？
3. 是否有步骤分支或循环？

都不是 → 工具 + approval；都是 → 再开子图。

### 运维场景的落位

| 场景 | 运维该做 | 独立子图 | 实现方式 | 推荐 |
| --- | --- | --- | --- | --- |
| 设备状态/告警监控 | 是 | 否 | 只读工具 | P0 |
| 告警确认/签收 | 是 | 否 | 单次写入 + 审计 | P0（已实现） |
| 取消告警 | 是 | 否 | 提议 + approval | P0 |
| 误报/告警抑制 | 是 | 否 | 单次写入 + 原因 | P1 |
| 故障报修 | 是 | 否 | 提议 + approval + 设备级去重 | P0 |
| 我的报修/进度 | 是 | 否 | 只读工具 | P0（已实现） |
| 报修撤回/补充 | 是 | 否 | 单次写入 | P1 |
| SOP 知识库 | 是 | 否 | 只读工具（`query_alarm_sop`） | P0（已实现） |
| 交接班 | 是 | 否（除非逐项确认） | 汇总 + 提交 | P1（已实现只读摘要） |
| 巡检 | 是 | **是** | 现有子图 | P1 |
| 批次影响评估 | 是 | 否（用 `query_batch_trace`） | 只读工具 | P1 |
| 备件可用性 | 是 | 否 | 只读工具 | P1 |
| 环境/能耗 | 是 | 否 | 只读工具 | P1 |
| 告警趋势 | 是 | 否 | 只读工具（`alarm.trends`） | P1（已实现） |
| 停机/复产申请 | 是 | **候选** | 多步 + approval 才做图 | P2 |
| 备件领用申请 | 是 | 否 | 提议 + approval + MCP 落库 | P1（已实现） |
| 告警处置 SOP | 是 | 否 | 只读步骤引导；逐步留证未做 | P2（只读已实现） |
| 维修工单派工/维修/验收 | 否 | 是（维修角色） | 移出运维界面 | — |
| 批次录入 | 否 | 否 | 生产/仓储角色 | — |

结论：运维 v1 只需要主图 + 工具 + approval；唯一保留的独立子图是巡检（以及给维修角色的维修工单子图）。批次追溯子图可保留给「引导式追溯」，运维侧做批次影响评估时直接用只读工具。

## 代码入口

- 路由装配：`apps/server/src/app/create-app.ts`
- 各业务域路由：`apps/server/src/modules/chat/routes.ts`
- 轮次入口：`apps/server/src/agent/core/turn.ts`
- 图装配：`apps/server/src/agent/core/graph.ts`
- 分类/规划：`apps/server/src/agent/planning/classification.ts`、`route.ts`
- 计划编译：`apps/server/src/agent/planning/plan-compiler.ts`
- 计划节点：`apps/server/src/agent/nodes/plan-executor.ts`
- 流程子图：`apps/server/src/agent/nodes/workflow.ts`
- 场景节点：`apps/server/src/agent/nodes/scene.ts`
- 审批节点：`apps/server/src/agent/nodes/approval.ts`
- 宿主对话模块：`examples/host-demo/src/assistant/core/chat.ts`
