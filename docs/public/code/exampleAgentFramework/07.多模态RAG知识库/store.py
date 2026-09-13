"""FAISS IndexFlatL2：建库、保存、加载、L2 检索。Windows 中文路径经临时 ASCII 目录中转。"""
from __future__ import annotations

import json
import shutil
import tempfile
from pathlib import Path
from typing import Any

import faiss
import numpy as np

HERE = Path(__file__).resolve().parent
VECTOR_DIR = HERE / "vector_db"
INDEX_NAME = "index.faiss"
META_NAME = "metadata.json"


def index_paths(path: Path | None = None) -> tuple[Path, Path]:
    root = path or VECTOR_DIR
    return root / INDEX_NAME, root / META_NAME


def index_exists(path: Path | None = None) -> bool:
    index_file, meta_file = index_paths(path)
    return index_file.is_file() and meta_file.is_file()


def _write_via_ascii(index: faiss.Index, index_file: Path) -> None:
    tmp = Path(tempfile.mkdtemp(prefix="faiss_mm_"))
    try:
        tmp_index = tmp / INDEX_NAME
        faiss.write_index(index, str(tmp_index))
        index_file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(tmp_index, index_file)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def _read_via_ascii(index_file: Path) -> faiss.Index:
    tmp = Path(tempfile.mkdtemp(prefix="faiss_mm_"))
    try:
        tmp_index = tmp / INDEX_NAME
        shutil.copy2(index_file, tmp_index)
        return faiss.read_index(str(tmp_index))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def save_index(
    vectors: list[list[float]],
    metadata: list[dict[str, Any]],
    path: Path | None = None,
) -> Path:
    if not vectors:
        raise ValueError("没有向量可写入")
    root = path or VECTOR_DIR
    root.mkdir(parents=True, exist_ok=True)
    index_file, meta_file = index_paths(root)

    dim = len(vectors[0])
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(vectors, dtype=np.float32))
    _write_via_ascii(index, index_file)
    meta_file.write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")
    return root


def load_index(path: Path | None = None) -> tuple[faiss.Index, list[dict[str, Any]]]:
    index_file, meta_file = index_paths(path)
    if not index_file.is_file() or not meta_file.is_file():
        raise FileNotFoundError(
            f"未找到索引。请先运行 build_index.py 生成 {index_file.name} 与 {meta_file.name}"
        )
    index = _read_via_ascii(index_file)
    metadata = json.loads(meta_file.read_text(encoding="utf-8"))
    return index, metadata


def search(
    index: faiss.Index,
    query_vec: list[float],
    k: int | None = None,
) -> tuple[np.ndarray, np.ndarray]:
    top_k = index.ntotal if k is None else min(k, index.ntotal)
    query = np.array([query_vec], dtype=np.float32)
    distances, indices = index.search(query, top_k)
    return distances, indices
