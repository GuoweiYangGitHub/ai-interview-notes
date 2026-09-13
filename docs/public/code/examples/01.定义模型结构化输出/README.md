# 01.定义模型结构化输出

下次要定义模型结果长什么样、并用同一份契约验收时看这里。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量

## 使用方法

```bash
npm run 01
```

跑完先看控制台的 `=== inspection ===`：`parseCheck` 是 JSON 能不能解析，`shapeCheck` 是过不过 Zod。只有形状通过才会打印 typed data。

## 目录架构

```text
01.定义模型结构化输出/
  schema.ts    唯一契约 + 给模型看的字段说明
  client.ts    模型接入
  inspect.ts   语法与形状分开报，不修补原文
  index.ts     编排请求与验收
```

## 查阅要点

- does: 用 Zod 定义会议纪要契约，请求只返回 JSON；先 parse 再 safeParse，形状通过才把 typed data 给下游
- not: 不对照 Agently/LangChain；不做 loose/detailed 实验；失败不修补原文；不在这里做业务真实性校验
- ref: 课03 `00_direct_json_request.py`
