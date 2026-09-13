"""三路入库：DOCX 切块、图片、视频 URL → FAISS + metadata。运行：python build_index.py"""
from __future__ import annotations

import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from embed import get_image_embedding, get_text_embedding, get_video_embedding
from ingest import CHUNK_OVERLAP, CHUNK_SIZE, load_items
from store import VECTOR_DIR, index_exists, save_index


def build(force: bool = False) -> Path:
    if index_exists() and not force:
        print(f"已有索引，跳过建库: {VECTOR_DIR}")
        print("强制重建请设 MULTIMODAL_REBUILD=1")
        return VECTOR_DIR

    items = load_items()
    print("--- 构建多模态知识库 ---")
    print(f"切分参数: chunk_size={CHUNK_SIZE}, overlap={CHUNK_OVERLAP}")
    print(f"待入库: {len(items)} 条")

    vectors: list[list[float]] = []
    metadata: list[dict] = []

    for doc_id, item in enumerate(items):
        if item.type == "text":
            print(f"  [{doc_id}] 文本 {item.source}: {item.content[:40].replace(chr(10), ' ')}…")
            vector = get_text_embedding(item.content)
        elif item.type == "image":
            print(f"  [{doc_id}] 图片 {item.source}")
            vector = get_image_embedding(item.path or "")
        elif item.type == "video":
            print(f"  [{doc_id}] 视频 {item.description}")
            vector = get_video_embedding(item.url or "")
        else:
            raise ValueError(f"未知类型: {item.type}")

        row = {
            "id": doc_id,
            "source": item.source,
            "type": item.type,
            "content": item.content,
        }
        if item.path:
            row["path"] = item.path
        if item.url:
            row["url"] = item.url
        if item.description:
            row["description"] = item.description

        vectors.append(vector)
        metadata.append(row)

    save_index(vectors, metadata)
    text_count = sum(1 for m in metadata if m["type"] == "text")
    image_count = sum(1 for m in metadata if m["type"] == "image")
    video_count = sum(1 for m in metadata if m["type"] == "video")
    print(f"向量维度: {len(vectors[0])}")
    print(f"已保存: {VECTOR_DIR}")
    print(f"完成! 文本:{text_count}, 图片:{image_count}, 视频:{video_count}")
    return VECTOR_DIR


if __name__ == "__main__":
    rebuild = os.getenv("MULTIMODAL_REBUILD", "").strip() in {"1", "true", "yes"}
    build(force=rebuild)
