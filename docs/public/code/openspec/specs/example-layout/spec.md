# example-layout

## Purpose

每个主题是一个可独立运行的教学示例。目录名用 `NN.中文主题`，`package.json` 用对应脚本跑入口，方便按序号往下加新讲义。

## Requirements

### Requirement: Numbered example directories

仓库 SHALL 把每个教学主题放在 `examples/NN.中文主题/` 下。`NN` 是两位数字序号，主题名用中文描述该示例要讲的能力。

#### Scenario: First example location

- **WHEN** 仓库中存在结构化输出示例
- **THEN** 它位于 `examples/01.定义模型结构化输出/`，并且可用 `npm run 01` 运行该目录的入口文件

### Requirement: One concern per module

示例目录内 SHALL 按职责拆文件，每个文件只承担一类工作（契约、接入、验收或编排），入口文件只负责把模块串起来。

#### Scenario: Structured output modules

- **WHEN** 查看 `examples/01.定义模型结构化输出/`
- **THEN** 至少包含 `schema.ts`、`client.ts`、`inspect.ts`、`index.ts`，且 `index.ts` 从其余模块导入而不是内联定义契约或校验

### Requirement: Runnable via npm script

`package.json` SHALL 为每个已发布示例提供对应脚本，使用 `tsx` 执行该示例的 `index.ts`。

#### Scenario: Run example 01

- **WHEN** 开发者执行 `npm run 01`
- **THEN** 进程加载环境变量并运行 `examples/01.定义模型结构化输出/index.ts`

### Requirement: Seven numbered themes only

仓库 SHALL 只使用这七个主题目录：`01.定义模型结构化输出`、`02.多步流程编排与条件分支`、`03.模型规划并调用工具`、`04.管理Agent的行动能力-注册、工具池与动态装载`、`05.MCP协议融入Agent`、`06.独立的运行环境设计（沙箱）`、`07.规划转任务，任务转Loop`。

#### Scenario: Theme catalog

- **WHEN** 列出 `examples/` 下的主题目录
- **THEN** 上述七个目录都存在，并且没有另立的 08/09/11 主题目录

### Requirement: Catalog README fields

每个已发布主题 MUST 在 `examples/README.md` 有对应一节。该节 SHALL 包含字段 `id`、`dir`、`run`、`when`、`does`、`modules`、`features`、`not`、`ref`。

#### Scenario: Lookup structured output

- **WHEN** 在 `examples/README.md` 查找 `id: 01`
- **THEN** 能读到 `run: npm run 01`、`dir: 01.定义模型结构化输出/`，以及 `when` / `features` / `not`
