"""5×5 合成图 + 固定 3×3 卷积。运行：npm run nn:cnn-conv"""
from __future__ import annotations

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import numpy as np
import torch
import torch.nn as nn


def main() -> None:
    print("=== CNN 卷积演示 ===\n")

    image = np.array(
        [
            [1, 1, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 1, 1],
            [0, 0, 1, 1, 0],
            [0, 1, 1, 0, 0],
        ],
        dtype=np.float32,
    )
    kernel = np.array(
        [
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1],
        ],
        dtype=np.float32,
    )

    x = torch.from_numpy(image).unsqueeze(0).unsqueeze(0)  # NCHW
    weight = torch.from_numpy(kernel).unsqueeze(0).unsqueeze(0)

    conv = nn.Conv2d(1, 1, kernel_size=3, bias=False)
    with torch.no_grad():
        conv.weight.copy_(weight)
        y = conv(x)

    print(f"输入 shape: {tuple(x.shape)}")
    print(f"卷积核:\n{kernel}")
    print(f"输出 shape: {tuple(y.shape)}")
    print(f"输出:\n{y.squeeze().numpy()}")


if __name__ == "__main__":
    main()
