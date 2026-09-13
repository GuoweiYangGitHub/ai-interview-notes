# 04.效果对比评估

下次要快速对比基座 / SFT / GRPO 输出质量时看这里。

默认 `demo_comparison()` 用模拟回复打分，**无 GPU 可跑**。

## 前置条件

- 仅需标准库；真实模型推理时再装 Unsloth（可选 `inference_base_model`）
- 不读 `.env`

## 使用方法

```bash
npm run ft:eval
```

控制台打印医疗场景多维评分与 GRPO XML 推理质量。

```mermaid
flowchart LR
  mock[mock_responses] --> metrics[EvalMetrics]
  metrics --> report[overall_score]
```

## 目录架构

```text
04.效果对比评估/
  main.py    指标 + compare_models + demo
```

## 查阅要点

- does: 格式/语言/推理质量/综合分；模拟三模型对比
- not: 默认不加载真实 7B；不替代离线评测集
