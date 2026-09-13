"""解析 knowledge/ 下的 DOCX、图片和视频 URL 清单。"""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from docx import Document as DocxDocument

HERE = Path(__file__).resolve().parent
KNOWLEDGE_DIR = HERE / "knowledge"
DOCS_DIR = KNOWLEDGE_DIR / "docs"
IMG_DIR = KNOWLEDGE_DIR / "images"
VIDEOS_FILE = KNOWLEDGE_DIR / "videos.json"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".bmp"}
NSMAP = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


@dataclass
class KnowledgeItem:
    type: str
    source: str
    content: str
    path: str | None = None
    url: str | None = None
    description: str | None = None


def parse_docx(file_path: Path) -> str:
    doc = DocxDocument(str(file_path))
    all_text: list[str] = []

    for element in doc.element.body:
        tag = element.tag.split("}")[-1] if "}" in element.tag else element.tag
        if tag == "p":
            paragraph_text = ""
            for run in element.findall(".//w:t", NSMAP):
                paragraph_text += run.text or ""
            if paragraph_text.strip():
                all_text.append(paragraph_text.strip())
        elif tag == "tbl":
            table = next((t for t in doc.tables if t._element is element), None)
            if table is None or not table.rows:
                continue
            header = [cell.text.strip() for cell in table.rows[0].cells]
            lines = ["| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
            for row in table.rows[1:]:
                lines.append("| " + " | ".join(cell.text.strip() for cell in row.cells) + " |")
            all_text.append("\n".join(lines))

    return "\n".join(all_text)


def split_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        if end >= len(text):
            break
        start = end - overlap
    return chunks


def load_items() -> list[KnowledgeItem]:
    items: list[KnowledgeItem] = []

    for path in sorted(DOCS_DIR.glob("*.docx")):
        if path.name.startswith("~"):
            continue
        full_text = parse_docx(path)
        for chunk in split_text(full_text):
            items.append(
                KnowledgeItem(type="text", source=path.name, content=chunk)
            )

    if IMG_DIR.is_dir():
        for img in sorted(IMG_DIR.iterdir()):
            if img.suffix.lower() not in IMAGE_EXTS:
                continue
            items.append(
                KnowledgeItem(
                    type="image",
                    source=f"图片: {img.name}",
                    content=f"[图片] {img.name}",
                    path=str(img),
                )
            )

    if VIDEOS_FILE.is_file():
        videos = json.loads(VIDEOS_FILE.read_text(encoding="utf-8"))
        for video in videos:
            desc = video["description"]
            items.append(
                KnowledgeItem(
                    type="video",
                    source=f"视频: {desc}",
                    content=f"[视频] {desc}",
                    url=video["url"],
                    description=desc,
                )
            )

    if not items:
        raise FileNotFoundError(f"knowledge/ 下没有可入库内容: {KNOWLEDGE_DIR}")
    return items
