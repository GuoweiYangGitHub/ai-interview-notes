"""生成最小中文示例 PDF（不依赖课盘大文件）。"""
from __future__ import annotations

from pathlib import Path

HERE = Path(__file__).resolve().parent
SAMPLE = HERE / "sample.pdf"


def ensure_sample_pdf(path: Path = SAMPLE) -> Path:
    if path.exists() and path.stat().st_size > 0:
        return path

    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.cidfonts import UnicodeCIDFont
        from reportlab.pdfgen import canvas
    except ImportError as exc:
        raise SystemExit(
            "缺少 reportlab，无法生成 sample.pdf。请: pip install reportlab"
        ) from exc

    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4
    c.setFont("STSong-Light", 16)
    c.drawString(72, height - 72, "MinerU 私有化解析示例")
    c.setFont("STSong-Light", 12)
    lines = [
        "本文档用于本地 MinerU pipeline 后端演示。",
        "目标：把 PDF 解析成 Markdown，不调用云端 API。",
        "步骤：下载模型 → 运行 main.py → 查看 output/ 下的 md。",
        "公式示例：E = mc^2",
        "表格提示：第二页可继续扩展表格与图片。",
    ]
    y = height - 120
    for line in lines:
        c.drawString(72, y, line)
        y -= 24
    c.showPage()
    c.save()
    return path


if __name__ == "__main__":
    out = ensure_sample_pdf()
    print(f"已生成: {out}")
