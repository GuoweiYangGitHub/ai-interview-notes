---
name: prophet-cycle
description: '使用 Prophet 分解股价趋势与周/年季节性，生成组件图与趋势图。'
keywords: Prophet, 周期性, 季节性, 趋势分解, 周效应
---

# prophet-cycle

需要先 `pip install prophet`。没装时脚本会报错，不要改用别的库硬凑。

```text
python skills/prophet-cycle/scripts/run_prophet.py --ts-code 600519.SH
```

可选 `--start-date`、`--end-date`。JSON 含 `components_chart`、`trend_chart`，须原样输出。
