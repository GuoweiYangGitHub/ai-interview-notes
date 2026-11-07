# 08.Skills撰写质量验证

下次要判断一份 Skill「会不会被加载」、以及「写得好不好并打分」时看这里。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量

## 使用方法

```bash
npm run 08
```

默认对 `fixtures/skills/docx` + 指令「帮我写一个包含 hello world 的 Word 文档」先 check 再 score。

```bash
# 只问：这条指令会不会加载这个 skill
npm run 08:check

# 只问：这份 skill 写得好不好（七维打分，23/35 通过）
npm run 08:score

# 看失败长什么样
npm run 08:check -- --skill fixtures/skills2/invalid-skill --skills-root fixtures/skills2
npm run 08:check -- --skill fixtures/skills2/pure-guidance-demo --skills-root fixtures/skills2
npm run 08:score -- --skill fixtures/skills2/docx-writer --skills-root fixtures/skills2
```

| 参数 | 默认值 | 含义 |
| --- | --- | --- |
| `--request` | `帮我写一个包含 hello world 的 Word 文档` | 用户指令 |
| `--skill` | `fixtures/skills/docx` | 要校验 / 评审的 skill |
| `--skills-root` | `fixtures/skills` | skills 根目录 |

退出码：`0` 通过，`1` 不通过，`2` 参数或环境错误。check 的 `0` 表示会加载；score 的 `0` 表示总分 ≥ 23。

## 目录架构

```text
08.Skills撰写质量验证/
  schema.ts          路由判断 + 七维打分的 Zod 契约
  frontmatter.ts     读 SKILL.md 的 YAML frontmatter
  catalog.ts         扫描候选 + Anthropic 官方硬规则 + 建议值警告
  select.ts          模型只看决策卡，决定加载谁
  diagnose.ts        未命中时诊断：不相关还是 description 缺口
  check.ts           discover → catalog → select → load
  score.ts           注入评审 skill，结构化打出七维分数
  inspect.ts         JSON.parse 与 Zod 分开报
  report.ts          环节表 / 评分表 / 结论
  client.ts          模型接入
  index.ts           CLI：check | score | 默认两者都跑
  fixtures/          正例、反例、评审尺子
```

## 查阅要点

- does: 两把尺子互不引用对方结论。check 答会不会加载；score 按 skill-semantic-review 七维打分（单维 3 分合格，总分 23 通过）。`docx` 与 `docx-writer` 都能被加载，但后者质量差一截
- not: 不跑 bash / Git Bash / 真写 docx；不对照 Agently；不把 YAML、name 字符范围、正文行数算进七维分数
- ref: 课17 `check_a_skill_v1.py`、`check_a_skill_v2.py`、`skill-semantic-review/SKILL.md`
