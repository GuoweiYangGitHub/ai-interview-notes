# LangChain SQL Agent

下次要用 LangChain Agent 把自然语言转成只读 SQL 时看这里。

`createAgent` 配三件只读工具（list / schema / query）。Agent 自己规划：先看有哪些表，再读 DDL，最后跑 SELECT。SQL 报错就按错误改，不要编表。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量
- 演示库是上级 `db.ts` 的 sqlite，启动时灌种子表

## 使用方法

```bash
npm run text-to-sql:langchain
```

会依次问：订单相关表、不存在的 `HeroDetails`、攻击力 Top5、客户姓名电话、未支付保单、理赔金额大于 10000。控制台打印每问的 Agent 回答。

## 怎么跑起来

1. 种子库：`db.ts` 启动时建表并插入演示数据。
2. 模型：`createChatModel()`。
3. 工具：`sql_db_list_tables` / `sql_db_schema` / `sql_db_query`。
4. Agent：`createAgent({ model, tools, systemPrompt })`。
5. 提问：`askLangChain(question)`。

典型路径：list 表 → 看相关 DDL → 跑 SELECT。

- 库里没有对应表（如 HeroDetails）应据实说明，不要编表。
- 多张候选表时会分别试，再判断哪张能回答。
- 相似表名可能让 Agent 多试几次；Prompt 太宽会偏题。本目录不做 RAG（那是 `../vanna`）。

## 目录架构

```text
langchain/
  client.ts    ChatOpenAI
  agent.ts     只读工具 + createAgent
  index.ts     演示问题
```

上级 `db.ts`：sqlite 种子（heros / customerinfo / policyinfo / claiminfo）。

## 查阅要点

- does: tool-calling SQL Agent；只读 SELECT；表不存在就直说
- not: 不启 LangSmith / Studio；不接向量库 few-shot；不连远程 MySQL
