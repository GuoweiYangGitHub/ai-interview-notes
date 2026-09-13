# 平台 API / 编排查阅（Coze / Dify / Ralph / Text-to-SQL / ChatBI / RAG / 知识库 / Agent）

先看总览，再进对应目录的 README。

密钥写仓库根目录 `.env`，不要写进代码。新示例的 README 写法见 `.cursor/skills/example-readme/`。

| id  | 目录                        | run                                                                     | when                                                      |
| --- | --------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| 01  | 01.Dify API使用/            | [`npm run dify`](01.Dify API使用/README.md)                             | 下次要调 Dify 对话流、文本生成或工作流                    |
| 02  | 02.Coze API使用/            | [`npm run coze`](02.Coze API使用/README.md)                             | 下次要调 Coze 已发布 Bot（阻塞 / 流式 / 带历史 / 查 Bot） |
| 03  | 03.ralph使用/               | [`npm run ralph`](03.ralph使用/README.md)                               | 下次要看帽子循环、测试背压、文件记忆时                    |
| 04  | 04.textToSql示例/langchain/ | [`npm run text-to-sql:langchain`](04.textToSql示例/langchain/README.md) | 下次要用 LangChain SQL Agent 做 Text-to-SQL               |
| 04  | 04.textToSql示例/vanna/     | [`npm run text-to-sql:vanna`](04.textToSql示例/vanna/README.md)         | 下次要用 Python Vanna 训 DDL / ask / 进阶追问摘要         |
| 05  | 05.Nanobot-ChatBI开发/      | [`npm run chatbi`](05.Nanobot-ChatBI开发/README.md)                     | 下次要用 nanobot 做 ChatBI（CLI / WebUI / SQL 出图）      |
| 06  | 06.Faiss使用/               | [`npm run faiss`](06.Faiss使用/README.md)                               | 下次要把文档做成 FAISS 再检索问答时                       |
| 07  | 07.多模态RAG知识库/         | [`npm run multimodal-rag`](07.多模态RAG知识库/README.md)                | 下次要把文本/图片/视频打进同一 FAISS 再按意图问答时       |
| 08  | 08.知识库健康度检查/        | [`npm run kb-health`](08.知识库健康度检查/README.md)                    | 下次要用 LLM 检查知识库缺知识 / 过期 / 冲突时             |
| 09  | 09.问题生成与BM25检索/      | [`npm run kb-bm25`](09.问题生成与BM25检索/README.md)                    | 下次要给切片预写问题再用 BM25 对比原文/问题检索时         |
| 10  | 10.对话知识沉淀/            | [`npm run kb-extract`](10.对话知识沉淀/README.md)                       | 下次要从客服对话抽知识并合并沉淀时                        |
| 11  | 11.知识库版本管理/          | [`npm run kb-version`](11.知识库版本管理/README.md)                     | 下次要对比两版知识库 diff 和检索准确率时                  |
| 12  | 12.反应式智能体/            | [`npm run agent:reactive`](12.反应式智能体/README.md)                   | 下次要看一问一工具环的反应式 Agent 时                     |
| 13  | 13.混合式智能体/            | [`npm run agent:hybrid`](13.混合式智能体/README.md)                     | 下次要看评估后分流（工具环 / 多步分析）时                 |
| 14  | 14.深思熟虑智能体/          | [`npm run agent:deliberative`](14.深思熟虑智能体/README.md)             | 下次要看感知-建模-推理-决策-报告的投研 Agent 时           |
| 15  | 15.Langchain Agent/node/    | [`npm run langchain-agent`](15.Langchain%20Agent/README.md)             | 下次要用 Node `createAgent` 最小写法时                    |
| 15  | 15.Langchain Agent/python/  | [`npm run langchain-agent:py`](15.Langchain%20Agent/README.md)          | 下次要用 Python `create_agent` 最小写法时                 |
| 16  | 16.LlamaIndex/              | [`npm run llama-index-agent`](16.LlamaIndex/README.md)                  | 下次要用 LlamaIndex FunctionAgent 最小写法时              |
| 17  | 17.Qwen-Agent/              | [`npm run qwen-agent`](17.Qwen-Agent/README.md)                         | 下次要用 Qwen-Agent Assistant 最小写法时                  |
| 18  | 18.AutoGen/                 | [`npm run autogen-agent`](18.AutoGen/README.md)                         | 下次要看 AutoGen 群聊选下一个说话人时                     |
