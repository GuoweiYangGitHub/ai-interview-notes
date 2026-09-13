# 02.NumPy前向传播

下次要看「权重放 dict、只做一次前向、不训练」时看这里。

结构：输入 2 → sigmoid 隐层 → sigmoid 隐层 → 恒等输出。输入写死为 `[1.0, 0.8]`。

## 前置条件

- Python 3.10+，先 `pip install -r exampleNeuralNetwork/requirements.txt`（只要 numpy）
- 不读 `.env`，不调模型

## 使用方法

```bash
npm run nn:forward
```

控制台打印输入向量和一次前向得到的 `y`。

```mermaid
flowchart LR
  x[input_2] --> h1[sigmoid]
  h1 --> h2[sigmoid]
  h2 --> y[identity]
```

## 目录架构

```text
02.NumPy前向传播/
  main.py    init_network + forward
```

## 查阅要点

- does: 三层前向；固定权重；无反传
- not: 不训练；不是 03 手写梯度
