"""FAISS 知识库：切块、向量化、保存、加载、相似度检索。"""
from __future__ import annotations

import hashlib
import shutil
import tempfile
from pathlib import Path

import numpy as np
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from client import embedding_api_key, embedding_base_url, embedding_model

SPLITTER = RecursiveCharacterTextSplitter(
    separators=["\n\n", "\n", "。", ".", " ", ""],
    chunk_size=400,
    chunk_overlap=80,
    length_function=len,
)
INDEX_FILES = ("index.faiss", "index.pkl")


class NgramEmbeddings(Embeddings):
    """进程内稳定的字 n-gram 向量。无远程 embedding 时仍能演示 FAISS。"""

    def __init__(self, dim: int = 256, n: int = 2):
        self.dim = dim
        self.n = n

    def _embed(self, text: str) -> list[float]:
        vec = np.zeros(self.dim, dtype=np.float32)
        padded = text or " "
        if len(padded) < self.n:
            padded = padded + " " * (self.n - len(padded))
        for i in range(len(padded) - self.n + 1):
            gram = padded[i : i + self.n]
            h = int(hashlib.md5(gram.encode("utf-8")).hexdigest(), 16)
            vec[h % self.dim] += 1.0
        norm = float(np.linalg.norm(vec))
        if norm:
            vec /= norm
        return vec.tolist()

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self._embed(t) for t in texts]

    def embed_query(self, text: str) -> list[float]:
        return self._embed(text)


def embeddings() -> Embeddings:
    key = embedding_api_key()
    if key:
        # 百炼 embedding 不是 OpenAI 模型名，tiktoken 会对不上并去下 cl100k_base。
        return OpenAIEmbeddings(
            model=embedding_model(),
            api_key=key,
            base_url=embedding_base_url(),
            check_embedding_ctx_length=False,
        )
    return NgramEmbeddings()


def embeddings_label() -> str:
    if embedding_api_key():
        return f"百炼 {embedding_model()}（{embedding_base_url()}）"
    return "本地 n-gram（Token Plan 不含 embedding；配 DASHSCOPE_API_KEY 可改用百炼）"


def split_pages(pages: list[Document]) -> list[Document]:
    return SPLITTER.split_documents(pages)


def build_index(chunks: list[Document]) -> FAISS:
    return FAISS.from_documents(chunks, embeddings())


def save_index(store: FAISS, path: Path) -> None:
    # Windows 上 faiss.write_index 不认含中文的路径，先写到临时 ASCII 目录再拷回。
    path.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="faiss_"))
    try:
        store.save_local(str(tmp))
        for name in INDEX_FILES:
            shutil.copy2(tmp / name, path / name)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def load_index(path: Path) -> FAISS:
    tmp = Path(tempfile.mkdtemp(prefix="faiss_"))
    try:
        for name in INDEX_FILES:
            shutil.copy2(path / name, tmp / name)
        return FAISS.load_local(
            str(tmp),
            embeddings(),
            allow_dangerous_deserialization=True,
        )
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def search(store: FAISS, query: str, k: int = 2) -> list[Document]:
    return store.similarity_search(query, k=k)
