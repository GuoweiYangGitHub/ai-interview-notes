"""确保示例目录内有本地 MinerU 模型并写配置。运行：npm run mineru:download

优先级：已就绪 → 从课盘拷贝 → mineru-models-download 网上下载。
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
MODELS_ROOT = HERE / "modelscope_models"
MODELS_DIR = MODELS_ROOT / "models"

DEFAULT_COURSE_MODELS = Path(
    r"F:\BaiduNetdiskDownload\AI大模型应用第21期"
    r"\48-视觉大模型与多模态理解\CASE-MinerU使用\modelscope_models"
)

# 关键子树：课盘 PDF-Extract-Kit pipeline
REQUIRED_REL = (
    Path("models") / "Layout",
    Path("models") / "MFD",
    Path("models") / "MFR",
    Path("models") / "OCR",
)


def models_ready(root: Path = MODELS_ROOT) -> bool:
    return all((root / rel).is_dir() for rel in REQUIRED_REL)


def course_source() -> Path | None:
    env = os.environ.get("MINERU_COURSE_MODELS", "").strip()
    if env:
        p = Path(env)
        return p if p.is_dir() else None
    if DEFAULT_COURSE_MODELS.is_dir():
        return DEFAULT_COURSE_MODELS
    return None


def copy_from_course(src: Path, dst: Path = MODELS_ROOT) -> None:
    print(f"从课盘拷贝模型:\n  {src}\n  → {dst}")
    dst.mkdir(parents=True, exist_ok=True)
    # robocopy: 排除临时目录；退出码 0–7 均为成功类
    cmd = [
        "robocopy",
        str(src),
        str(dst),
        "/E",
        "/XD",
        "._____temp",
        "/NFL",
        "/NDL",
        "/NJH",
        "/NJS",
        "/nc",
        "/ns",
        "/np",
    ]
    proc = subprocess.run(cmd, check=False)
    if proc.returncode >= 8:
        raise SystemExit(f"robocopy 失败，exit={proc.returncode}")
    if not models_ready(dst):
        raise SystemExit("拷贝后仍缺少 models/Layout|MFD|MFR|OCR，请检查课盘目录。")


def download_via_mineru() -> None:
    os.environ.setdefault("MINERU_MODEL_SOURCE", "modelscope")
    print("课盘源不可用，调用 mineru-models-download（pipeline）…")
    try:
        subprocess.run(
            ["mineru-models-download", "-h"],
            capture_output=True,
            check=True,
        )
    except (FileNotFoundError, subprocess.CalledProcessError):
        print('未找到 mineru-models-download，请先: pip install -U "mineru[pipeline]"')
        sys.exit(1)

    cmd = [
        "mineru-models-download",
        "-s",
        "modelscope",
        "-m",
        "pipeline",
    ]
    print("执行:", " ".join(cmd))
    proc = subprocess.run(cmd, check=False)
    if proc.returncode != 0:
        print("带参数下载失败，尝试无参…")
        fallback = subprocess.run(["mineru-models-download"], check=False)
        if fallback.returncode != 0:
            sys.exit(fallback.returncode)


def write_local_config(
    models_dir: Path = MODELS_DIR,
    layoutreader_dir: Path = MODELS_ROOT,
) -> None:
    """写入用户目录 mineru.json / magic-pdf.json，指向示例内模型。"""
    home = Path.home()
    mods = {
        "models-dir": str(models_dir.resolve()),
        "layoutreader-model-dir": str(layoutreader_dir.resolve()),
    }

    for name in ("mineru.json", "magic-pdf.json"):
        path = home / name
        data: dict = {}
        if path.exists():
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                data = {}
        data.update(mods)
        if "config_version" not in data:
            data["config_version"] = "1.3.1"
        path.write_text(
            json.dumps(data, ensure_ascii=False, indent=4),
            encoding="utf-8",
        )
        print(f"已更新配置: {path}")
        print(f"  models-dir={mods['models-dir']}")
        print(f"  layoutreader-model-dir={mods['layoutreader-model-dir']}")


def ensure_models() -> Path:
    if models_ready():
        print(f"本地模型已就绪: {MODELS_ROOT}")
    else:
        src = course_source()
        if src is not None and models_ready(src):
            copy_from_course(src)
        elif src is not None:
            print(f"课盘目录存在但不完整: {src}，尝试拷贝后再校验…")
            copy_from_course(src)
        else:
            download_via_mineru()
            if not models_ready():
                print(
                    "网上下载通常写入 ~/.cache，请将 pipeline 模型放到:\n"
                    f"  {MODELS_ROOT}\n"
                    "或设置 MINERU_COURSE_MODELS 指向课盘 modelscope_models 后重跑。"
                )
                # 仍写配置可能无效；若 cache 可用则靠 MINERU_MODEL_SOURCE
                return MODELS_ROOT

    write_local_config()
    os.environ["MINERU_MODEL_SOURCE"] = "local"
    return MODELS_ROOT


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    print("=== MinerU 本地模型确保 ===\n")
    ensure_models()
    print(f"\nMINERU_MODEL_SOURCE={os.environ.get('MINERU_MODEL_SOURCE', 'local')}")
    print("完成。接下来可: npm run mineru")


if __name__ == "__main__":
    main()
