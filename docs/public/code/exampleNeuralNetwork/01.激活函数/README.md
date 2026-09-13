# 01.激活函数

下次要看 sigmoid / tanh / relu 在几个固定点上的取值时看这里。

手写三个激活函数，再打印 sigmoid 导数。不画图。

## 前置条件

- Python 3.10+，先 `pip install -r exampleNeuralNetwork/requirements.txt`（只要 numpy）
- 不读 `.env`，不调模型

## 使用方法

```bash
npm run nn:activation
```

控制台打印 `x = -2, 0, 2, 4` 时的 sigmoid、sigmoid 导数、tanh、relu。

## 目录架构

```text
01.激活函数/
  main.py    三个激活函数 + 固定点表
```

## 查阅要点

- does: 手写公式；只打控制台
- not: 不画曲线；不是前向传播（那是 02）
