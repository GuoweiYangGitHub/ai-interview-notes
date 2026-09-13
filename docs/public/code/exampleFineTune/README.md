# LLM 微调与 GRPO 查阅

先看总览，再进对应目录。01–03 需 NVIDIA GPU + Unsloth；04 可用模拟数据无 GPU 跑。数据集在 `data/`（不入库），权重与 `outputs/` 不入库。

| id  | 目录             | run                                            | when                                |
| --- | ---------------- | ---------------------------------------------- | ----------------------------------- |
| 01  | 01.Alpaca-SFT/   | [`npm run ft:sft`](01.Alpaca-SFT/README.md)    | 下次要做 Qwen2.5 Alpaca LoRA SFT 时 |
| 02  | 02.GRPO-R1/      | [`npm run ft:grpo`](02.GRPO-R1/README.md)      | 下次要做 GSM8K GRPO / R1 式推理时   |
| 03  | 03.QwenVL微调/   | [`npm run ft:vl`](03.QwenVL微调/README.md)     | 下次要微调 Qwen2.5-VL 里程表任务时  |
| 04  | 04.效果对比评估/ | [`npm run ft:eval`](04.效果对比评估/README.md) | 下次要对比基座/SFT/GRPO 评分时      |
