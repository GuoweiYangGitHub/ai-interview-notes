"""MinerU 本地解析 PDF → Markdown。运行：npm run mineru

优先使用示例目录内 modelscope_models（课盘拷贝）；缺失时提示先跑 mineru:download。
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from download_models import ensure_models, models_ready
from make_sample_pdf import ensure_sample_pdf

OUTPUT_DIR = HERE / "output"
SAMPLE = HERE / "sample.pdf"


def parse_with_api(pdf_path: Path, output_dir: Path) -> None:
    from mineru.cli.common import do_parse

    pdf_bytes = pdf_path.read_bytes()
    do_parse(
        output_dir=str(output_dir),
        pdf_file_names=[pdf_path.stem],
        pdf_bytes_list=[pdf_bytes],
        p_lang_list=["ch"],
        backend="pipeline",
        parse_method="auto",
        formula_enable=True,
        table_enable=True,
    )


def parse_with_cli(pdf_path: Path, output_dir: Path) -> None:
    import subprocess

    output_dir.mkdir(parents=True, exist_ok=True)
    cmd = [
        "mineru",
        "-p",
        str(pdf_path),
        "-o",
        str(output_dir),
        "-b",
        "pipeline",
    ]
    print("执行:", " ".join(cmd))
    subprocess.run(cmd, check=True)


def find_markdown(output_dir: Path) -> Path | None:
    mds = sorted(output_dir.rglob("*.md"))
    return mds[0] if mds else None


def main() -> None:
    print("=== MinerU 本地解析 ===\n")

    if models_ready():
        ensure_models()  # 写配置 + MINERU_MODEL_SOURCE=local
    else:
        print("本地 modelscope_models 未就绪，尝试 ensure（课盘拷贝或下载）…")
        ensure_models()
        if not models_ready():
            print(
                "仍无本地模型。请先: npm run mineru:download\n"
                "或设置 MINERU_COURSE_MODELS 指向课盘 modelscope_models。"
            )

    print(f"MINERU_MODEL_SOURCE={os.environ.get('MINERU_MODEL_SOURCE')}")

    pdf_path = ensure_sample_pdf(SAMPLE)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"输入: {pdf_path}")
    print(f"输出目录: {OUTPUT_DIR}\n")

    try:
        parse_with_api(pdf_path, OUTPUT_DIR)
    except Exception as api_err:
        print(f"do_parse 失败（{api_err}），回退到 mineru CLI…")
        parse_with_cli(pdf_path, OUTPUT_DIR)

    md = find_markdown(OUTPUT_DIR)
    if md is None:
        raise SystemExit("未找到生成的 Markdown，请检查模型是否已就绪。")

    text = md.read_text(encoding="utf-8", errors="replace")
    preview = text.strip().splitlines()[:12]
    print(f"\nMarkdown: {md}")
    print("--- 预览 ---")
    for line in preview:
        print(line)
    print("-----------")
    print(f"全文约 {len(text)} 字符；完整结果在 {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
