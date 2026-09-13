"""微调示例共用路径：模型 / 数据可通过环境变量覆盖。"""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA_ROOT = Path(os.environ.get("FT_DATA_ROOT", str(ROOT / "data"))).resolve()

# AutoDL 常见本地路径（存在则优先）
_LOCAL_7B_CANDIDATES = (
    Path("/root/autodl-tmp/models/Qwen/Qwen2___5-7B-Instruct"),
    Path("/root/autodl-tmp/models/Qwen/Qwen2.5-7B-Instruct"),
)
_LOCAL_VL_CANDIDATES = (
    Path("/root/autodl-tmp/models/Qwen/Qwen2.5-VL-3B-Instruct"),
)


def _first_existing(paths: tuple[Path, ...]) -> Path | None:
    for p in paths:
        if p.is_dir():
            return p
    return None


def model_7b() -> str:
    env = os.environ.get("FT_MODEL_7B", "").strip()
    if env:
        return env
    local = _first_existing(_LOCAL_7B_CANDIDATES)
    if local is not None:
        return str(local)
    return "Qwen/Qwen2.5-7B-Instruct"


def model_vl() -> str:
    env = os.environ.get("FT_MODEL_VL", "").strip()
    if env:
        return env
    local = _first_existing(_LOCAL_VL_CANDIDATES)
    if local is not None:
        return str(local)
    return "Qwen/Qwen2.5-VL-3B-Instruct"


def alpaca_dir() -> Path:
    return DATA_ROOT / "alpaca-cleaned"


def gsm8k_dir() -> Path:
    return DATA_ROOT / "gsm8k"


def ensure_utf8_stdout() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
