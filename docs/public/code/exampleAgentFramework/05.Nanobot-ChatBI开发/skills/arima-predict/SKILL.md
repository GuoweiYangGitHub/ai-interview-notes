---
name: arima-predict
description: '使用 ARIMA(5,1,5) 对收盘价做短期预测，并生成历史与预测曲线图。'
keywords: ARIMA, 预测, 未来价格, 时间序列, 走势预测
---

# arima-predict

用户明确要求 ARIMA / 未来 N 天价格时调用。不要自己手写模型。

```text
python skills/arima-predict/scripts/run_arima.py --ts-code 600519.SH --n 7
```

`--ts-code` 与 `--n` 必填。JSON 含 `predictions`、`chart`；回复须原样附带 `chart` markdown。
