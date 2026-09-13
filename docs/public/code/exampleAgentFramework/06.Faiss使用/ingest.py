"""读入文档。PDF 按页抽文本并记下页码；txt/md 整篇算第 1 页。"""
from pathlib import Path

from langchain_core.documents import Document
from pypdf import PdfReader


def load_pages(path: Path) -> list[Document]:
    if not path.exists():
        raise FileNotFoundError(f"找不到文档：{path}")

    suffix = path.suffix.lower()
    if suffix == ".pdf":
        reader = PdfReader(str(path))
        pages: list[Document] = []
        for index, page in enumerate(reader.pages, start=1):
            text = (page.extract_text() or "").strip()
            if text:
                pages.append(Document(page_content=text, metadata={"page": index, "source": path.name}))
        if not pages:
            raise ValueError("PDF 没有抽出文本")
        return pages

    text = path.read_text(encoding="utf-8").strip()
    if not text:
        raise ValueError("文档是空的")
    return [Document(page_content=text, metadata={"page": 1, "source": path.name})]
