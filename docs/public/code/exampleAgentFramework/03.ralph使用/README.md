# 03.ralph使用

下次要看帽子循环、测试背压、文件记忆，或对照 `ralph_demo.py` 做 Harness 时看这里。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量
- 不需要 Docker / pytest；测试由 Host 跑 `node --test`

## 使用方法

```bash
npm run ralph
```

控制台按 Planner → Builder → Critic → Finalizer 换帽。测试不过会停在 Builder 修复，不进下一顶帽子。完整记录在 `ralph_output/scratchpad.md`。

## 目录架构

```text
03.ralph使用/
  hats.ts        Planner / Builder / Critic / Finalizer
  scratchpad.ts  仓库即记录
  harness.ts     抽文件块、落盘、node --test
  prompt.ts      默认计算器任务
  client.ts      模型接入
  index.ts       换帽顺序和背压
  ralph_output/  生成物（不入库）：代码、测试、scratchpad
```

## 查阅要点

- does: 同一条循环换四顶帽子。Host 跑测试做背压；帽子之间只读写 scratchpad.md
- not: 不 1:1 复刻 Python 的 iteration 编号；不跑 pytest；生成物不入库
- ref: `stock-research/ralph_demo.py`
