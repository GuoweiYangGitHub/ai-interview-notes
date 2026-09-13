"""加载索引，按意图检索并 RAG 问答。运行：python query.py"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from client import create_chat_client
from embed import get_text_embedding
from store import load_index, search

IMAGE_KEYWORDS = ["图片", "海报", "照片", "看看", "长什么样", "图"]
VIDEO_KEYWORDS = ["视频", "录像", "影片", "看一下", "播放"]
MEDIA_DISTANCE_THRESHOLD = 3.0

DEMO_QUERIES = [
    ("文本查询", "我想了解一下门票的退款流程"),
    ("图片查询", "最近万圣节的活动海报是什么"),
    ("视频查询", "我的汽车被剐蹭了，你能看到视频么？"),
]


def distance_to_similarity(distance: float) -> float:
    return 1 / (1 + distance)


def detect_media_intent(query: str) -> tuple[bool, bool]:
    want_image = any(kw in query for kw in IMAGE_KEYWORDS)
    want_video = any(kw in query for kw in VIDEO_KEYWORDS)
    return want_image, want_video


def search_with_details(query: str, index, metadata: list[dict[str, Any]]) -> list[dict[str, Any]]:
    print(f"\n{'=' * 60}")
    print(f"Query: {query}")
    print("=" * 60)

    query_vec = get_text_embedding(query)
    distances, indices = search(index, query_vec)

    print("\n相似度排名 (越大越相似):")
    print("-" * 80)
    print(f"{'排名':4s} {'ID':4s} {'类型':6s} {'相似度':8s} {'距离':8s} 内容")
    print("-" * 80)

    results: list[dict[str, Any]] = []
    for rank, (idx, dist) in enumerate(zip(indices[0], distances[0])):
        if idx == -1:
            continue
        m = metadata[int(idx)]
        sim = distance_to_similarity(float(dist))
        content_preview = m["content"][:45].replace("\n", " ")
        marker = ""
        if m["type"] == "image":
            marker = " <-- 图片"
        elif m["type"] == "video":
            marker = " <-- 视频"
        print(
            f"{rank + 1:4d} {int(idx):4d} [{m['type']:5s}] {sim:6.4f}  {float(dist):8.4f}  {content_preview}...{marker}"
        )
        results.append(
            {"idx": int(idx), "distance": float(dist), "similarity": sim, "metadata": m}
        )
    return results


def rag_ask(query: str, index, metadata: list[dict[str, Any]], k: int = 3) -> str:
    results = search_with_details(query, index, metadata)
    want_image, want_video = detect_media_intent(query)
    print(f"\n意图检测: 需要图片={want_image}, 需要视频={want_video}")

    top_results = [r for r in results if r["metadata"]["type"] == "text"][:k]

    matched_image = None
    if want_image:
        image_results = [
            r
            for r in results
            if r["metadata"]["type"] == "image" and r["distance"] < MEDIA_DISTANCE_THRESHOLD
        ]
        if image_results:
            image_results.sort(key=lambda x: x["distance"])
            matched_image = image_results[0]
            print(
                f"  -> 匹配到图片: {matched_image['metadata'].get('path')} "
                f"(距离: {matched_image['distance']:.4f}, 相似度: {matched_image['similarity']:.4f})"
            )

    matched_video = None
    if want_video:
        video_results = [
            r
            for r in results
            if r["metadata"]["type"] == "video" and r["distance"] < MEDIA_DISTANCE_THRESHOLD
        ]
        if video_results:
            video_results.sort(key=lambda x: x["distance"])
            matched_video = video_results[0]
            print(
                f"  -> 匹配到视频: {matched_video['metadata'].get('url')} "
                f"(距离: {matched_video['distance']:.4f}, 相似度: {matched_video['similarity']:.4f})"
            )

    print(f"\n选取 Top-{k} 文本构建 Prompt:")
    for r in top_results:
        print(f"  - {r['metadata']['content'][:50].replace(chr(10), ' ')}... (相似度: {r['similarity']:.4f})")

    context_str = ""
    for i, r in enumerate(top_results):
        m = r["metadata"]
        context_str += (
            f"背景知识 {i + 1} (来源: {m['source']}, 相似度: {r['similarity']:.4f}):\n{m['content']}\n\n"
        )

    client, model = create_chat_client()
    print("\n调用 LLM 生成答案...")
    completion = client.chat.completions.create(
        model=model,
        temperature=0.2,
        messages=[
            {"role": "system", "content": "你是乐园客服助手。只根据给定背景知识回答，没有的信息就说不知道。用中文。"},
            {
                "role": "user",
                "content": f"[背景知识]\n{context_str}\n[用户问题]\n{query}",
            },
        ],
    )
    answer = completion.choices[0].message.content or ""

    if matched_image:
        answer += f"\n\n[相关图片]: {matched_image['metadata'].get('path')}"
    if matched_video:
        answer += f"\n\n[相关视频]: {matched_video['metadata'].get('url')}"

    print(f"\n最终答案:\n{answer}")
    return answer


def run_demos() -> None:
    index, metadata = load_index()
    print(f"已加载索引: {index.ntotal} 条记录")
    has_video = any(m["type"] == "video" for m in metadata)
    for title, query in DEMO_QUERIES:
        if "视频" in title and not has_video:
            print(f"\n跳过 {title}：库中没有视频")
            continue
        print("\n" + "=" * 60)
        print(title)
        rag_ask(query, index, metadata, k=3)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        index, metadata = load_index()
        rag_ask(" ".join(sys.argv[1:]), index, metadata, k=3)
    else:
        run_demos()
