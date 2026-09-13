"""手写 sigmoid / tanh / relu，打印固定点。运行：npm run nn:activation"""
from __future__ import annotations

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import numpy as np

POINTS = np.array([-2.0, 0.0, 2.0, 4.0])


def sigmoid(x: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-x))


def sigmoid_derivative(x: np.ndarray) -> np.ndarray:
    s = sigmoid(x)
    return s * (1.0 - s)


def tanh(x: np.ndarray) -> np.ndarray:
    return (np.exp(x) - np.exp(-x)) / (np.exp(x) + np.exp(-x))


def relu(x: np.ndarray) -> np.ndarray:
    return np.maximum(x, 0.0)


def main() -> None:
    print("=== 激活函数（固定点）===\n")
    dsigmoid = "dsigmoid"
    print(f"{'x':>6}  {'sigmoid':>10}  {dsigmoid:>10}  {'tanh':>10}  {'relu':>8}")
    for x, s, ds, t, r in zip(
        POINTS,
        sigmoid(POINTS),
        sigmoid_derivative(POINTS),
        tanh(POINTS),
        relu(POINTS),
    ):
        print(f"{x:6.1f}  {s:10.4f}  {ds:10.4f}  {t:10.4f}  {r:8.1f}")


if __name__ == "__main__":
    main()
