# LlamaIndex · 知识点

LlamaIndex 是 **数据 / RAG 框架**：给 LLM 接上私有文档、库表，把「怎么切、怎么建索引、怎么捞」做好。严格说不是 Agent 编排框架。

## [重点] LlamaIndex 的定位是怎样的？

一句话——**给 LLM 装上私有数据的接口**。不搞复杂多人协作、只做文档问答，它是首选。

1. **本业是数据** — 加载、切分、`VectorStoreIndex`、检索。长期记忆、海量 PDF 问答走这里。  
2. **不是编排中枢** — 多 Agent 接力、审批、工具链，交给 LangChain / LangGraph。检索完还要写报告、发邮件：它管数据，编排交给链。  
3. **和 LangChain 怎么搭** — 检索 Node 转成 LangChain Document，换向量库改数据层，加审批改编排层。

## [重点] 什么是 Index 优先？

LlamaIndex 的哲学是 **Index-First**。LangChain 关注流程（链怎么串），它关注**数据结构**（私有数据怎么被索引）。它认为 LLM 应用的核心瓶颈不是编排，而是**怎么让模型检索到私有数据**。

```text
文档 → SimpleDirectoryReader → 分块 → Embedding → VectorStoreIndex → Query Engine → LLM 回答
```

1. **加载** — `SimpleDirectoryReader` 把目录里的文件读成 Document。  
2. **切 + 向量化** — 分块后 Embedding，写入 `VectorStoreIndex`。  
3. **问** — Query Engine 按问题捞相关块，再交给 LLM 生成。  
4. **持久化** — `storage_context.persist` 落到盘上；下次 `load_index_from_storage`，别每次重新 Embedding。

```python
import os
from llama_index.core import (
    VectorStoreIndex, SimpleDirectoryReader,
    StorageContext, load_index_from_storage,
)

documents = SimpleDirectoryReader("./docs").load_data()
index = VectorStoreIndex.from_documents(documents)
index.storage_context.persist(persist_dir="./storage")

persist_dir = "./storage"
if os.path.exists(persist_dir):
    storage_context = StorageContext.from_defaults(persist_dir=persist_dir)
    index = load_index_from_storage(storage_context)
else:
    index = VectorStoreIndex.from_documents(documents)
```

## ReAct Agent 怎么挂检索工具？

纯问答用 Query Engine 直问。要模型**自己决定何时检索**，把检索封成函数，用 `FunctionTool` 插到 `ReActAgent` 上。Index 还是本业，Agent 只是把检索当一只手。

```python
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool

query_engine = index.as_query_engine(similarity_top_k=5)

def retrieve_documents(query: str) -> str:
    """从文档中检索相关信息"""
    return str(query_engine.query(query))

retrieve_tool = FunctionTool.from_defaults(fn=retrieve_documents)
agent = ReActAgent.from_tools(
    tools=[retrieve_tool],
    llm=llm,
    verbose=True,
    system_prompt="你是一个乐于助人的AI助手，可以从文档中检索信息",
)
```

1. **Query Engine** — `as_query_engine(similarity_top_k=5)`，一次捞 5 段。  
2. **函数** — `retrieve_documents` 的 docstring 就是工具说明，模型靠它决定调不调。  
3. **插拔** — `FunctionTool.from_defaults` 包一层，`ReActAgent.from_tools` 挂上；`verbose=True` 能看见思考过程。

## LlamaIndex 的核心优势是什么？

优势在**数据这条线做完**，不是编排更强。文档进得去、索引留得住、检索策略能换、需要时再把查询引擎封成工具。

1. **一站式文档** — 加载、分块、向量化、索引、检索一条龙。  
2. **索引持久化** — `persist` 后启动直接加载，避免重复 Embedding。  
3. **多种检索** — 向量、关键词、混合，专名漏检时上混合。  
4. **和 Agent 衔接** — `FunctionTool` 封装 Query Engine，ReAct 按需调检索。

| 场景 | 说明 |
| --- | --- |
| 企业知识库 | 内部文档、FAQ、操作手册问答 |
| 合同审查 | 条款检索与解读 |
| 学术论文 | 摘要、引用、知识图谱类分析 |
| 客服机器人 | 产品手册、服务政策实时检索 |

---

## 相关代码示例

- [LlamaIndex](/E-代码示例/view?p=exampleAgentFramework%2F16.LlamaIndex)

