"""yolov8n 在 coco8 上训 1 epoch。运行：npm run nn:yolo-train"""
from __future__ import annotations

import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from ultralytics import YOLO

HERE = Path(__file__).resolve().parent
RUNS = HERE / "runs"


def main() -> None:
    print("=== YOLO 训练（coco8 / 1 epoch / CPU）===\n")
    model = YOLO("yolov8n.pt")
    results = model.train(
        data="coco8.yaml",
        epochs=1,
        imgsz=320,
        batch=4,
        device="cpu",
        project=str(RUNS),
        name="detect",
        exist_ok=True,
        verbose=True,
    )
    metrics = getattr(results, "results_dict", None) or {}
    print("\n=== 摘要 ===")
    if metrics:
        for key in (
            "metrics/mAP50(B)",
            "metrics/mAP50-95(B)",
            "train/box_loss",
            "val/box_loss",
        ):
            if key in metrics:
                print(f"{key}: {metrics[key]}")
    else:
        print(results)
    print(f"\n训练产物目录: {RUNS / 'detect'}")


if __name__ == "__main__":
    main()
