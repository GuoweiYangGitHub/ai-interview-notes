# framework-cookbook

## Purpose

平台 API（Coze、Dify）的 TypeScript 查阅示例集中在 `exampleAgentFramework/`，与 `examples/01-07` 的 Agent 内核课序分开。

## ADDED Requirements

### Requirement: Cookbook layout

仓库 SHALL 把 Coze 与 Dify 查阅示例写进已有目录 `exampleAgentFramework/02.Coze API使用/` 与 `exampleAgentFramework/01.Dify API使用/`，不得另建 `coze/`、`dify/` 这类目录。每个平台一个 `client.ts` 和一个可运行的 `index.ts`。

#### Scenario: Lookup entry

- **WHEN** 下次要查 Coze 或 Dify 怎么调
- **THEN** 先看 `exampleAgentFramework/README.md`，再进对应目录

### Requirement: Runnable scripts

`package.json` SHALL 提供 `npm run coze` 与 `npm run dify`，用 `tsx` 跑各自 `index.ts`。

#### Scenario: Run Coze demo

- **WHEN** 已配置 Coze 环境变量并执行 `npm run coze`
- **THEN** 进程演示查 Bot、阻塞聊天、流式、带历史中的可用步骤
