"""ChatPDF + FAISS 查阅演示。运行：npm run faiss

切块 → 向量化 → save_local → load_local → similarity_search → 用命中片段问答。
课上用银行考核 PDF；本示例用 sample.txt，换成 PDF 时设 FAISS_DOC。
"""
from __future__ import annotations

import os
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from client import create_chat_client
from ingest import load_pages
from store import build_index, embeddings_label, load_index, save_index, search, split_pages

VECTOR_DIR = HERE / "vector_db"
QUERY = "客户经理被投诉了，投诉一次扣多少分"


def answer(query: str, docs) -> str:
    client, model = create_chat_client()
    context = "\n\n".join(
        f"[页 {doc.metadata.get('page', '?')}]\n{doc.page_content}" for doc in docs
    )
    response = client.chat.completions.create(
        model=model,
        temperature=0.2,
        messages=[
            {
                "role": "system",
                "content": "只根据给定片段回答。片段没有的信息就说不知道。用中文。",
            },
            {"role": "user", "content": f"片段：\n{context}\n\n问题：{query}"},
        ],
    )
    return response.choices[0].message.content or ""


def main() -> None:
    doc = Path(os.getenv("FAISS_DOC", HERE / "sample.txt"))
    pages = load_pages(doc)
    chunks = split_pages(pages)
    print(f"文档: {doc.name}")
    print(f"页数: {len(pages)}；切成 {len(chunks)} 块")
    print(f"向量化: {embeddings_label()}")

    store = build_index(chunks)
    save_index(store, VECTOR_DIR)
    print(f"已保存: {VECTOR_DIR}")

    loaded = load_index(VECTOR_DIR)
    print("已从磁盘加载向量库")

    hits = search(loaded, QUERY, k=2)
    print(f"\n=== similarity_search: {QUERY} ===")
    for hit in hits:
        print(f"- 页 {hit.metadata.get('page')}：{hit.page_content[:80].replace(chr(10), ' ')}…")

    print("\n=== QA ===")
    print(answer(QUERY, hits))
    print("来源页:", sorted({hit.metadata.get("page") for hit in hits}))


if __name__ == "__main__":
    main()
