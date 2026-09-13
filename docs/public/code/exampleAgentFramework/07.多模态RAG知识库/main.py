"""完整多模态 RAG：无索引则建库，再跑三条演示问句。运行：npm run multimodal-rag"""
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

from build_index import build
from query import run_demos
from store import index_exists


def main() -> None:
    rebuild = os.getenv("MULTIMODAL_REBUILD", "").strip() in {"1", "true", "yes"}
    if rebuild or not index_exists():
        build(force=True)
    else:
        print("使用已有向量库（重建请设 MULTIMODAL_REBUILD=1）")
    run_demos()


if __name__ == "__main__":
    main()
