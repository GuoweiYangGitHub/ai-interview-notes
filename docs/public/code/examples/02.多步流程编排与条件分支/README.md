# 02.多步流程编排与条件分支

下次一次请求会漏项、要用程序记住走到哪一步、并按条件分支时看这里。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量

## 使用方法

```bash
npm run 02
```

跑完会先打短文本单次提取，再打长文本分段调度。看缺截止日期的项是否标成「待确认」，而不是被丢掉。

## 目录架构

```text
02.多步流程编排与条件分支/
  schema.ts    ActionItem / ActionExtraction
  state.ts     已处理段落、已提取待办、当前步
  steps.ts     分段、提取、过滤、合并
  branch.ts    缺负责人或截止日期时标待确认
  client.ts    模型接入
  index.ts     短文本走单步，长文本走调度
```

## 查阅要点

- does: 短文本单次提取；长文本按段落分段提取、过滤纯讨论、合并待办；缺截止日期标「待确认」不丢弃
- not: 不写 LangGraph/TriggerFlow；不做 Instant 字段流式
- ref: 课04 `common.py`、`01_single_request.py`（分段+状态主旨，不搬框架）
