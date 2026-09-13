"""合成小图 + 四 filter → Conv / ReLU / MaxPool，落盘。运行：npm run nn:cnn-viz"""
from __future__ import annotations

import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"


def make_image(size: int = 32) -> np.ndarray:
    """生成带竖条与斜线的小灰度图，归一化到 [0, 1]。"""
    img = np.zeros((size, size), dtype=np.float32)
    img[:, size // 3 : size // 3 + 4] = 1.0
    for i in range(size):
        j = (i * 2) % size
        img[i, j : j + 2] = 0.8
    img[size // 2 : size // 2 + 6, size // 2 : size // 2 + 10] = 0.6
    return img


def make_filters() -> np.ndarray:
    base = np.array(
        [
            [-1, -1, 1, 1],
            [-1, -1, 1, 1],
            [-1, -1, 1, 1],
            [-1, -1, 1, 1],
        ],
        dtype=np.float32,
    )
    return np.stack([base, -base, base.T, -base.T], axis=0)


class Net(nn.Module):
    def __init__(self, weight: torch.Tensor) -> None:
        super().__init__()
        k_h, k_w = weight.shape[2:]
        self.conv = nn.Conv2d(1, 4, kernel_size=(k_h, k_w), bias=False)
        with torch.no_grad():
            self.conv.weight.copy_(weight)
        self.pool = nn.MaxPool2d(2, 2)

    def forward(self, x: torch.Tensor):
        conv_x = self.conv(x)
        activated_x = F.relu(conv_x)
        pooled_x = self.pool(activated_x)
        return conv_x, activated_x, pooled_x


def save_maps(tensor: torch.Tensor, title: str, path: Path) -> None:
    n = tensor.shape[1]
    fig, axes = plt.subplots(1, n, figsize=(3 * n, 3))
    if n == 1:
        axes = [axes]
    for i, ax in enumerate(axes):
        ax.imshow(tensor[0, i].detach().numpy(), cmap="gray")
        ax.set_title(f"{title} {i + 1}")
        ax.axis("off")
    fig.tight_layout()
    fig.savefig(path, dpi=120)
    plt.close(fig)


def main() -> None:
    print("=== CNN 特征图 ===\n")
    OUT.mkdir(parents=True, exist_ok=True)

    gray = make_image()
    filters = make_filters()
    weight = torch.from_numpy(filters).unsqueeze(1)
    model = Net(weight)
    x = torch.from_numpy(gray).unsqueeze(0).unsqueeze(0)

    conv_x, activated_x, pooled_x = model(x)
    print(f"输入 shape: {tuple(x.shape)}")
    print(f"卷积后: {tuple(conv_x.shape)}")
    print(f"ReLU 后: {tuple(activated_x.shape)}")
    print(f"池化后: {tuple(pooled_x.shape)}")

    plt.imsave(OUT / "input.png", gray, cmap="gray")
    save_maps(conv_x, "conv", OUT / "conv.png")
    save_maps(activated_x, "relu", OUT / "relu.png")
    save_maps(pooled_x, "pool", OUT / "pool.png")
    print(f"已写入: {OUT}")


if __name__ == "__main__":
    main()
