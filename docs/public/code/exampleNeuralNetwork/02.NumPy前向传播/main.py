"""三层前向传播，权重放 dict。运行：npm run nn:forward"""
from __future__ import annotations

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import numpy as np

INPUT = np.array([1.0, 0.8])


def sigmoid(x: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-x))


def identity(x: np.ndarray) -> np.ndarray:
    return x


def init_network() -> dict[str, np.ndarray]:
    return {
        "W1": np.array([[0.15, 0.25, 0.35], [0.20, 0.30, 0.40]]),
        "b1": np.array([0.10, 0.15, 0.20]),
        "W2": np.array([[0.15, 0.25], [0.20, 0.30], [0.25, 0.35]]),
        "b2": np.array([0.10, 0.15]),
        "W3": np.array([[0.15, 0.25], [0.20, 0.30]]),
        "b3": np.array([0.10, 0.15]),
    }


def forward(network: dict[str, np.ndarray], x: np.ndarray) -> np.ndarray:
    z1 = sigmoid(x @ network["W1"] + network["b1"])
    z2 = sigmoid(z1 @ network["W2"] + network["b2"])
    return identity(z2 @ network["W3"] + network["b3"])


def main() -> None:
    print("=== NumPy 前向传播 ===\n")
    print(f"输入: {INPUT}")
    y = forward(init_network(), INPUT)
    print(f"输出: {y}")


if __name__ == "__main__":
    main()
