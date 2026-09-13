# 06.Faiss使用

下次要把文档切块、做成 FAISS 向量库、再按问题检索并问答时看这里。

官方 FAISS 是 C++/Python。本示例走课 14 ChatPDF 同一条链路：切块 → Embedding → `FAISS.from_documents` → `save_local` / `load_local` → `similarity_search` → 把命中片段交给模型。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`（问答用）
- Token Plan **没有** embedding。真向量化再配 `DASHSCOPE_API_KEY`（或 `EMBEDDING_API_KEY`），可选 `EMBEDDING_BASE_URL`（默认百炼兼容接口）、`EMBEDDING_MODEL`（默认 `text-embedding-v3`）
- 没配 embedding 密钥时走本地 n-gram，FAISS 保存 / 加载 / 检索仍能跑
- 密钥只进 `client.py`
- Python 3.10+：`pip install -r exampleAgentFramework/06.Faiss使用/requirements.txt`
- 本机演示用 `sample.txt`。要换课上那种 PDF，设环境变量 `FAISS_DOC` 为 pdf 路径

## 使用方法

```bash
npm run faiss
```

控制台会打印切块数、保存路径、检索到的片段、问答结果和来源页。向量库写在 `vector_db/`（不入库）。第二次若只想加载，看 `store.load_index`。

## 常用方法

| 方法                                                                       | 作用                                                                 |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `RecursiveCharacterTextSplitter.split_documents`                           | 按分隔符切块，保留页码 metadata                                      |
| `FAISS.from_documents(chunks, embeddings)`                                 | 向量化并建库（也可用 `from_texts`）                                  |
| `store.save_local(path)`                                                   | 写出 `index.faiss` + `index.pkl`（Windows 中文路径会经临时目录中转） |
| `FAISS.load_local(path, embeddings, allow_dangerous_deserialization=True)` | 从磁盘加载；pkl 反序列化必须显式允许                                 |
| `store.similarity_search(query, k=2)`                                      | 取最相似的 k 个块                                                    |
| `store.similarity_search_with_score(query, k)`                             | 同时返回距离分数（本示例未打印）                                     |
| `store.add_documents(docs)`                                                | 向已有库追加（本示例未演示）                                         |
| `store.as_retriever()`                                                     | 交给 LangChain retriever / Agent 用                                  |

课上的 `load_qa_chain(..., chain_type="stuff")` 就是把检索块塞进提示词。这里改成直接 chat completions，避免旧 chain API。页码写在 Document.metadata 里，不再单独 pickle。

## 目录架构

```text
06.Faiss使用/
  client.py           密钥与 embedding / chat 模型名
  ingest.py           PDF/文本抽页
  store.py            切块、FAISS 建库/保存/加载/检索
  main.py             跑完整链路
  sample.txt          演示文档（不搬课上银行 PDF）
  requirements.txt
  vector_db/          跑完生成，不入库
```

## 查阅要点

- does: LangChain FAISS；切块带页码；save/load；相似度检索后问答；有 `DASHSCOPE_API_KEY` 时用 OpenAI 兼容 embedding（关掉 tiktoken 校验）
- not: 不搬课上 PDF；不上 Streamlit；不用 DashScopeEmbeddings 类名；不把 Token Plan 密钥拿去调 dashscope embedding
- ref: 课14 `chatpdf-faiss.py`；Windows 下 FAISS 写盘不认中文路径，本示例经临时 ASCII 目录中转
