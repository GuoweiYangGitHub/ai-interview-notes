"""yolov8n 对示例图做检测。运行：npm run nn:yolo-predict"""
from __future__ import annotations

import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from ultralytics import YOLO

HERE = Path(__file__).resolve().parent
SAMPLE = HERE / "sample.jpg"
OUT = HERE / "out"


def main() -> None:
    print("=== YOLO 预测 ===\n")
    if not SAMPLE.exists():
        raise FileNotFoundError(f"缺少示例图: {SAMPLE}")

    OUT.mkdir(parents=True, exist_ok=True)
    model = YOLO("yolov8n.pt")
    results = model.predict(
        source=str(SAMPLE),
        save=True,
        project=str(OUT),
        name="predict",
        exist_ok=True,
        verbose=False,
    )
    result = results[0]
    names = result.names
    boxes = result.boxes
    print(f"图片: {SAMPLE.name}")
    print(f"检出 {len(boxes)} 个框:\n")
    if len(boxes) == 0:
        print("(无)")
    else:
        for i, box in enumerate(boxes):
            cls_id = int(box.cls.item())
            conf = float(box.conf.item())
            xyxy = [round(float(v), 1) for v in box.xyxy[0].tolist()]
            print(f"{i + 1:2d}. {names[cls_id]:12s}  conf={conf:.3f}  xyxy={xyxy}")
    print(f"\n标注图目录: {OUT / 'predict'}")


if __name__ == "__main__":
    main()
