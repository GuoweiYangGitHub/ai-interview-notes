"""Keras Sequential 合成回归。运行：npm run nn:keras"""
from __future__ import annotations

import os
import sys

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import numpy as np
import tensorflow as tf

N_SAMPLES = 64
EPOCHS = 40
SEED = 7


def make_data() -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(SEED)
    x = rng.normal(size=(N_SAMPLES, 2)).astype(np.float32)
    noise = 0.05 * rng.normal(size=(N_SAMPLES, 1)).astype(np.float32)
    y = (2.0 * x[:, :1] + 0.5 * x[:, 1:2] + noise).astype(np.float32)
    return x, y


def main() -> None:
    print("=== Keras 最小回归 ===\n")
    tf.keras.utils.set_random_seed(SEED)
    x, y = make_data()
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(2,)),
            tf.keras.layers.Dense(8, activation="relu"),
            tf.keras.layers.Dense(1),
        ]
    )
    model.compile(optimizer=tf.keras.optimizers.Adam(0.05), loss="mse")
    history = model.fit(x, y, epochs=EPOCHS, verbose=0)
    first = float(history.history["loss"][0])
    last = float(history.history["loss"][-1])
    print(f"目标: y = 2*x0 + 0.5*x1 + 噪声")
    print(f"第 1 个 epoch MSE: {first:.4f}")
    print(f"第 {EPOCHS} 个 epoch MSE: {last:.4f}")


if __name__ == "__main__":
    main()
