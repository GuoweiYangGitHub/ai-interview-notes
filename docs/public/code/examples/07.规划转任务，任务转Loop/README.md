# 07.规划转任务，任务转Loop

下次一次生成扛不住、要先 Plan、再任务板、再循环收敛时看这里。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量

## 使用方法

```bash
npm run 07
```

跑完按 `=== brief ===` / `=== plan ===` / `=== board ===` / `=== loop ===` 看三阶段。计划里的 `outline` 必须是字符串；任务 id 和 pending/done/blocked 由程序写，不交给模型改。

## 目录架构

```text
07.规划转任务，任务转Loop/
  brief.ts     需求输入与预设澄清答案
  plan.ts      结构化计划（澄清用预设答案）
  board.ts     id / pending / done / blocked 由程序写
  loop.ts      取任务 → 做 → 检查 → 回填
  client.ts    模型接入
  index.ts     三阶段顺序跑完
```

## 查阅要点

- does: 用预设答案补全澄清后写出计划；程序拆成带状态的任务板；取 pending 执行、检查、回填直到收敛
- not: 不接飞书 IM；不写 Skill；不阻塞真实 stdin
- ref: 课12 `product_plan_patterns.py`；课13 `step_1_plan.py`、`step_2_task_board.py`、`step_3_convergence_loop.py`
