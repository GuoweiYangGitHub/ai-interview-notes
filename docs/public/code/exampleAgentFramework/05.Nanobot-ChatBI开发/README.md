# 05.Nanobot-ChatBI开发

下次要用 nanobot 做完整 ChatBI（SQL 出图、ARIMA / MACD / 布林 / Prophet、新闻）时看这里。官方 nanobot 是 Python SDK，没有官方 TypeScript。

工作区就是本目录：`AGENTS.md`、`skills/`、`memory/` 会被自动加载。分析脚本走 `exec`，新闻走内置 `web_search`（Tavily）。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 新闻可选 `TAVILY_API_KEY`；用 Tushare 灌库可选 `TUSHARE_TOKEN`
- 密钥只进 `client.py`
- Python 3.11+（本机 `py -3.12`）。包名是 `nanobot-ai`，不要装 PyPI 上的 `nanobot`
- 本目录虚拟环境：

```bash
py -3.12 -m venv exampleAgentFramework/05.Nanobot-ChatBI开发/.venv
exampleAgentFramework/05.Nanobot-ChatBI开发/.venv/Scripts/python.exe -m pip install -r exampleAgentFramework/05.Nanobot-ChatBI开发/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

- Prophet 可选：`pip install prophet`
- 缺密钥会报错退出；缺库会自动跑 `seed_db.py`

## 使用方法

```bash
npm run chatbi:seed
npm run chatbi -- -m "查询贵州茅台最近一个月的股价走势"
npm run chatbi
npm run chatbi:web
```

- `chatbi:seed`：生成本地 `stock_data.db`（有 Tushare token 就拉日线，否则演示数据）
- `chatbi -m`：单次提问，控制台打印工具名和终答
- `chatbi`：交互输入，`quit` 退出
- `chatbi:web`：官方 WebUI（`nanobot webui`，内部起 gateway），终端会打印浏览器地址

可问：茅台近一个月走势、对比两只股票涨跌幅、ARIMA 预测、MACD、布林带、Prophet、最近新闻。

## nanobot 怎么接

- `config.json`：`providers.custom` 接 OpenAI 兼容网关；`exec.enable` 跑技能脚本；`web.search.provider=tavily`
- `restrict_to_workspace` 为 false，因为 `python` 解释器不在工作区里
- CLI：`agent.py` 写 `.runtime-config.json` 后 `Nanobot.from_config`
- WebUI：`web.py` 调用本目录 `.venv` 里的 `nanobot webui`（官方界面，内部起 gateway）

## ChatBI 注意点

- 日线日期是 `TEXT YYYY-MM-DD`；`DATE('now','-1 month')` 必须在工具里改成字面量
- 涨跌幅取区间首末日收盘，算法写在 `faq.txt`
- 中文列名要双引号（`"股票简称"`）；只读 SELECT
- 图表：多于 10 行折线，2–10 行柱状，1 行不出图；回复必须带上 `chart` markdown
- 不要让模型手写 ARIMA / MACD，去 `exec` 对应技能
- 不要把 API Key 写进 `config.json`

## 目录架构

```text
05.Nanobot-ChatBI开发/
  client.py           读 .env，写 .runtime-config.json
  run.cjs             用本目录 .venv 跑 Python
  agent.py            CLI
  web.py              nanobot webui
  seed_db.py          sqlite 种子
  config.json         无密钥
  AGENTS.md           技能路由
  faq.txt             涨跌幅 few-shot
  lib/                SQL 出图 / ARIMA / MACD / 布林 / Prophet
  skills/             SKILL.md + scripts
  memory/             运行时写入当天日期
  .venv/              本机虚拟环境，不入库
  stock_data.db       跑完生成，不入库
  charts/             跑完生成，不入库
  .runtime-config.json WebUI 用，不入库
```

## 查阅要点

- does: Python nanobot-ai；CLI 与官方 WebUI；SQL 出图 + 四个分析技能 + Tavily
- not: 不拷 nanobot 源码进仓库；不用 Gradio；不连远程 MySQL；不把密钥写进 config
