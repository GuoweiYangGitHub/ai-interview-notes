# Vanna Text-to-SQL（Python）

下次要用官方 Vanna 训 DDL / 文档 / 问-SQL 再生成 SQL 时看这里。

Vanna 的 SDK 是 Python。提问时召回训练样本拼 prompt，再让模型写 SQL。本目录用 `vanna` + 本地 Chroma，不启 Flask。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.py`
- Python 3.10+，先装依赖：`pip install -r exampleAgentFramework/04.textToSql示例/vanna/requirements.txt`（首次会下载 Chroma 的 MiniLM 模型）
- 演示库由 `db.py` 每次重建 sqlite，表结构与上级 `db.ts` 对齐

## 使用方法

```bash
npm run text-to-sql:vanna
```

会做：`connect_to_sqlite` → `train` DDL/文档 → `ask`（含 auto_train）→ `generate_summary` → `generate_followup_questions` → `generate_question`。控制台打印 SQL 和结果。

## 常用方法

官方 0.x API（`vanna<2`）。本示例都会跑一遍，查阅时对这个表即可。

| 方法                                                 | 作用                                             |
| ---------------------------------------------------- | ------------------------------------------------ |
| `vn.connect_to_sqlite(path)`                         | 绑定 sqlite，内部设置 `run_sql`                  |
| `vn.train(ddl=...)`                                  | 训练建表语句                                     |
| `vn.train(documentation=...)`                        | 训练业务说明（表/字段含义）                      |
| `vn.train(question=..., sql=...)`                    | 训练成功的「问-SQL」对                           |
| `vn.get_training_data()`                             | 查看已训练样本                                   |
| `vn.remove_training_data(id)`                        | 删一条样本（本示例未演示）                       |
| `vn.generate_sql(question)`                          | 只生成 SQL，不执行                               |
| `vn.run_sql(sql)`                                    | 执行 SQL，返回 DataFrame                         |
| `vn.ask(question, auto_train=True, visualize=False)` | `generate_sql` + `run_sql`；成功后可写回训练数据 |
| `vn.generate_summary(question, df)`                  | 把结果写成中文结论                               |
| `vn.generate_followup_questions(question, sql, df)`  | 根据当前结果建议下一步问题                       |
| `vn.generate_question(sql)`                          | 用 SQL 反推业务问题，用来扩样本                  |

工作流：用户问题 → 检索 DDL / 文档 / SQL → 组装 Prompt → `generate_sql` → `run_sql`。

`ask(..., visualize=True)` 还会走 Plotly，本示例关掉以免多装图表依赖。不要在本机 `vn.run_sql` 上执行非 SELECT。

## 目录架构

```text
vanna/
  client.py           OpenAI 兼容客户端
  db.py               sqlite 种子（与 db.ts 同表）
  main.py             CLI：初始化 + 常用方法
  requirements.txt    vanna<2、openai、chromadb
  demo.sqlite         跑完生成，不入库
```

Chroma 目录写在系统临时目录，不进仓库。上级 `db.ts` 只给 LangChain 用。

## 查阅要点

- does: 官方 Python Vanna；训 DDL / 文档 / 问-SQL；ask、摘要、追问、反向出题
- not: 不启 Flask Web；不连 Vanna 托管向量库；不连远程 MySQL；不用 Vanna 2 Agent
- ref: 课 11 `vanna-mysql.py`、`vanna-mysql-advanced.py`；https://github.com/vanna-ai/vanna
