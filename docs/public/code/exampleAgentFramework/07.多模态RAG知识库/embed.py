"""通义视觉 embedding：文本 / 图片 Base64 / 视频 URL。运行：python embed.py text|image|video"""
from __future__ import annotations

import base64
import json
import sys
from http import HTTPStatus
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from client import configure_dashscope, embedding_model


def get_text_embedding(text: str) -> list[float]:
    import dashscope

    configure_dashscope()
    resp = dashscope.MultiModalEmbedding.call(
        model=embedding_model(),
        input=[{"text": text}],
    )
    if resp.status_code != HTTPStatus.OK:
        raise RuntimeError(f"文本 Embedding 失败: {resp.message}")
    return resp.output["embeddings"][0]["embedding"]


def get_image_embedding(image_path: str | Path) -> list[float]:
    import dashscope

    configure_dashscope()
    path = Path(image_path)
    with path.open("rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")
    ext = path.suffix.lower().lstrip(".")
    if ext == "jpg":
        ext = "jpeg"
    image_data = f"data:image/{ext};base64,{b64}"
    resp = dashscope.MultiModalEmbedding.call(
        model=embedding_model(),
        input=[{"image": image_data}],
    )
    if resp.status_code != HTTPStatus.OK:
        raise RuntimeError(f"图片 Embedding 失败: {resp.message}")
    return resp.output["embeddings"][0]["embedding"]


def get_video_embedding(video_url: str) -> list[float]:
    """视频只接受公开 URL；多帧时取平均。"""
    import dashscope

    configure_dashscope()
    resp = dashscope.MultiModalEmbedding.call(
        model=embedding_model(),
        input=[{"video": video_url}],
    )
    if resp.status_code != HTTPStatus.OK:
        raise RuntimeError(f"视频 Embedding 失败: {resp.message}")
    embeddings = resp.output["embeddings"]
    if len(embeddings) > 1:
        vectors = [np.array(e["embedding"], dtype=np.float32) for e in embeddings]
        return np.mean(vectors, axis=0).tolist()
    return embeddings[0]["embedding"]


def _demo_text() -> None:
    text = "乐园门票分为一日票和两日票。距入园日 48 小时内不可退改。"
    vec = get_text_embedding(text)
    print(json.dumps({"type": "text", "dim": len(vec), "preview": vec[:8]}, ensure_ascii=False))


def _demo_image() -> None:
    images = sorted((HERE / "knowledge" / "images").glob("*.png"))
    if not images:
        raise FileNotFoundError("knowledge/images 下没有 png")
    vec = get_image_embedding(images[0])
    print(json.dumps({"type": "image", "file": images[0].name, "dim": len(vec)}, ensure_ascii=False))


def _demo_video() -> None:
    videos = json.loads((HERE / "knowledge" / "videos.json").read_text(encoding="utf-8"))
    if not videos:
        raise FileNotFoundError("knowledge/videos.json 是空的")
    vec = get_video_embedding(videos[0]["url"])
    print(json.dumps({"type": "video", "url": videos[0]["url"], "dim": len(vec)}, ensure_ascii=False))


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "text"
    if mode == "text":
        _demo_text()
    elif mode == "image":
        _demo_image()
    elif mode == "video":
        _demo_video()
    else:
        raise SystemExit("用法: python embed.py text|image|video")
