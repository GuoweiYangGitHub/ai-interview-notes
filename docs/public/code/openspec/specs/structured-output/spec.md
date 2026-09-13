# structured-output

## Purpose

结构化输出先定义契约，再把同一份契约写进 Prompt 并用来验收。模型原文先保留；校验失败只报告，不修补。

## Requirements

### Requirement: Schema is the single contract

结构化输出示例 SHALL 在 `schema.ts` 用 Zod 定义结果形状，并导出 TypeScript 类型以及给模型看的契约说明。Prompt、校验、下游类型 MUST 都源自这一份定义。

#### Scenario: Meeting minutes shape

- **WHEN** 使用会议纪要契约
- **THEN** 结果包含 `evidence`（至少 1 条，每项有 `fact` 与 `sourceExcerpt`）、`actionItems`（`task`、`owner`、`deadline`、`evidenceIndex`）、最多 3 条 `selfCheck`，以及非空 `summary`
- **AND** `owner` / `deadline` 在原文未写明时为 `null`，`evidenceIndex` 从 0 开始

### Requirement: Prompt describes the same contract

发给模型的用户消息 SHALL 包含 `describeOutputContract()` 的说明，并要求只返回 JSON、不要 markdown。系统提示 MUST 约束“只使用原文信息”，不得另写一套字段定义。

#### Scenario: User message includes contract

- **WHEN** 组装会议纪要请求
- **THEN** user 消息同时包含会议原文和 `describeOutputContract()` 的字段说明

### Requirement: Inspect without mutating

`inspect()` SHALL 先 `JSON.parse` 再交给同一份 Schema。语法失败时 `shapeCheck` 为 `not_run`；形状失败时列出路径和原因。验收逻辑 MUST NOT 剥离 markdown、重命名字段、补 `null` 或重试模型。

#### Scenario: Invalid JSON

- **WHEN** 模型返回不能 `JSON.parse` 的文本
- **THEN** 结果为 `jsonParse: fail`、`shapeCheck: not_run`，并带上解析错误详情

#### Scenario: Valid JSON wrong shape

- **WHEN** 文本是合法 JSON 但缺少 `summary` 或 `owner` 不是 `string | null`
- **THEN** 结果为 `jsonParse: pass`、`shapeCheck: fail`，错误列表包含对应路径

### Requirement: Downstream only receives typed data

入口在形状验收通过后才把 `data` 交给下游使用。形状未通过时进程 MUST 以非零退出码结束，且 MUST NOT 把未通过的对象当作纪要输出。

#### Scenario: Shape check fails

- **WHEN** `inspect()` 的 `shapeCheck` 不是 `pass`
- **THEN** 程序打印 raw 与 inspection 后以非零退出码结束，不打印 typed data
