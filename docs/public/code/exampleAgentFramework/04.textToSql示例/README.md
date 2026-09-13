# 04.textToSql示例

下次要用自然语言查 sqlite 时看这里。LangChain 和 Vanna 分两个文件夹。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `langchain/client.ts` 与 `vanna/client.py`
- LangChain：本目录 `db.ts` 的 sqlite
- Vanna：Python 3.10+，`pip install -r exampleAgentFramework/04.textToSql示例/vanna/requirements.txt`；库由 `vanna/db.py` 重建

## 使用方法

```bash
npm run text-to-sql:langchain
npm run text-to-sql:vanna
```

LangChain 连续问几道库内问题并打印 Agent 回答。Vanna 是 Python 官方 SDK：训 DDL 后 ask、摘要、追问、反向出题。

## 目录架构

```text
04.textToSql示例/
  db.ts         LangChain 用的 sqlite 种子
  langchain/    SQL Agent（TypeScript）
  vanna/        官方 Vanna（Python）
```

## 查阅要点

- does: 两个独立示例。LangChain 是 TS Agent；Vanna 是 Python SDK
- not: 不平铺源码；不连远程 MySQL
