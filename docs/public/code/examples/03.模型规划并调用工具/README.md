# 03.模型规划并调用工具

下次模型要选工具、宿主执行、把 observation 送回，或需要多步 ReAct 时看这里。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量

## 使用方法

```bash
npm run 03
```

跑完先看一轮原生 `tool_calls` 的搜索，再看「先搜再读页」循环。observation 由宿主回传，直到 `finish` 或达到步数上限。

## 目录架构

```text
03.模型规划并调用工具/
  tools.ts           工具声明，Zod 参数转 OpenAI tools
  zodToJsonSchema.ts Zod → JSON Schema
  actions.ts         本地 JSON 上的 search_web / browse_page
  dispatch.ts        只执行已声明 name
  loop.ts            选择 → 执行 → 观察 → 再选择
  client.ts          模型接入
  index.ts           先一轮调用，再跑 ReAct
  data/pages.json    假搜索语料
```

## 查阅要点

- does: 原生 tool_calls 跑一轮搜索；再跑「先搜再读页」循环直到 finish 或达上限
- not: 不接真实搜索 API；不上框架 Agent executor
- ref: 课06 `openai_native_tool_calling.py`、`01_function_calling_once.py`、`02_react_search_browse.py`、`lesson_tools.py`
