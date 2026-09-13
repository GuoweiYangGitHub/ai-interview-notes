"""两层 ReLU 网络，手写反传。运行：npm run nn:numpy-train"""
from __future__ import annotations

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import numpy as np

N_SAMPLES = 32
D_IN = 8
HIDDEN = 16
D_OUT = 1
STEPS = 200
LEARNING_RATE = 1e-2
SEED = 7


def mse(pred: np.ndarray, target: np.ndarray) -> float:
    return float(np.mean(np.square(pred - target)))


def train() -> tuple[float, float]:
    rng = np.random.default_rng(SEED)
    x = rng.normal(size=(N_SAMPLES, D_IN))
    true_w = rng.normal(size=(D_IN, D_OUT))
    y = x @ true_w + 0.05 * rng.normal(size=(N_SAMPLES, D_OUT))

    w1 = rng.normal(size=(D_IN, HIDDEN)) * 0.3
    w2 = rng.normal(size=(HIDDEN, D_OUT)) * 0.3
    first_loss = 0.0

    for step in range(STEPS):
        hidden = np.maximum(x @ w1, 0.0)
        pred = hidden @ w2
        loss = mse(pred, y)
        if step == 0:
            first_loss = loss

        grad_pred = 2.0 * (pred - y) / N_SAMPLES
        grad_w2 = hidden.T @ grad_pred
        grad_hidden = grad_pred @ w2.T
        grad_hidden[x @ w1 < 0] = 0.0
        grad_w1 = x.T @ grad_hidden

        w1 = w1 - LEARNING_RATE * grad_w1
        w2 = w2 - LEARNING_RATE * grad_w2

    last_hidden = np.maximum(x @ w1, 0.0)
    last_loss = mse(last_hidden @ w2, y)
    return first_loss, last_loss


def main() -> None:
    print("=== NumPy 手写训练 ===\n")
    print(f"规模: n={N_SAMPLES}, d_in={D_IN}, hidden={HIDDEN}, steps={STEPS}")
    first_loss, last_loss = train()
    print(f"第 0 步 MSE: {first_loss:.4f}")
    print(f"第 {STEPS - 1} 步 MSE: {last_loss:.4f}")


if __name__ == "__main__":
    main()
