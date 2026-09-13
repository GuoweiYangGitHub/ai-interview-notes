---
name: authoring-deep-research-spec
description: Use when turning a domain Deep Research spec (stock, competitor, candidate, product) into a reusable research spec, or when writing a new multi-dimension research pipeline with structured JSON, constraints, and validate_report.
---

# Authoring a Generic Deep Research Spec

把领域研报规格拆成「不变骨架 + 领域填空」。规格是一等公民：实现和测试都是它的可执行表达。

详细模板见 [spec-template.md](spec-template.md)。股票对照见 [stock-mapping.md](stock-mapping.md)。

## Extraction method

对已有领域 spec（或实现）逐层问：这句话换一个研究对象还成不成立？

| 层     | 留下（骨架）                                       | 抽走（填空）                          |
| ------ | -------------------------------------------------- | ------------------------------------- |
| 目标   | 输入研究对象 → 多维采集 → 结构化报告               | 股票代码、茅台、Qwen                  |
| 流水线 | Client → Collector → Analyzer → Reporter           | 厂商 SDK、akshare                     |
| 维度   | 每维 `summary` + `confidence`，并行采集            | fundamental / market / news / analyst |
| 输出   | subject、date、dimensions、verdict、risks、sources | `stock_code`、`buy/hold/sell`         |
| 约束   | 完整性、最小长度、值域、枚举、最小来源、非空、必填 | C1–C7 的具体阈值和字段名              |
| 强制   | spec → 测试 → linter；错误带 `fix`                 | 股票专属关键词、DashScope             |

**规则：** 专有名词、枚举值、阈值、数据源进「领域实例」；层名、依赖方向、校验入口、错误形状进「通用模板」。

## When to use

- 要把股票 / 竞品 / 候选人等研报规格提成通用文档
- 新开一个 Deep Research：多维联网搜索 + 结构化 JSON
- 约束要直接变成测试和 linter，而不是散文需求

**不要用：** 单维问答、不需要验收形状的聊天摘要、纯检索无报告。

## Instantiate in one pass

1. 填 [spec-template.md](spec-template.md) 的领域表：研究对象、维度、结论枚举、必填字段、阈值。
2. 写出领域 `spec/research_spec.md`（模板全文，占位符全部替换）。
3. 约束编号 `C1…Cn`，每条都能写成失败测试。
4. 实现单向流水线；`validate_report` 是唯一校验入口。
5. 每个 `Cn` 对应一个测试类；linter 检查 spec 存在、校验函数存在、维度常量与 spec 一致。

## Pipeline (invariant)

```
输入(研究对象标识)
      |
      v
  Client        -- 唯一允许对外调用模型 / 搜索的地方
      |
      v
  Collector     -- 按维度并行采集；失败维保留，confidence=0
      |
      v
  Analyzer      -- 汇总评分 + 风险识别（无 API 时规则兜底）
      |
      v
  Reporter      -- 组装 JSON + validate_report
      |
      v
  结构化报告
```

依赖只许向下：`client → collector → analyzer → reporter`。禁止反向 import。采集可先打底真实数据，再让模型补全；没有真实源时，模型搜索单独也能跑。

## Constraint catalog

每条约束必须能变成断言。类型固定，取值由领域填：

| 类型       | 通用含义                      | 股票实例                            |
| ---------- | ----------------------------- | ----------------------------------- |
| 维度完整   | `dimensions` 含全部声明维     | fundamental, market, news, analyst  |
| 摘要下限   | 每维 `summary` ≥ N 字符       | N=100                               |
| 置信度值域 | `confidence` ∈ [0.0, 1.0]     | 同左                                |
| 结论枚举   | verdict 只能取声明值          | buy / hold / sell                   |
| 来源下限   | `sources` ≥ M 个 URL          | M=3                                 |
| 风险非空   | `risk_factors` 至少 1 条      | 同左                                |
| 标识必填   | subject id / name / date 非空 | stock_code, stock_name, report_date |

采集失败的维度：`summary` 可写失败说明，但 `confidence` 必须是 `0.0`，不能丢维。

## Output shape (invariant)

```json
{
  "<subject_id_field>": "...",
  "<subject_name_field>": "...",
  "report_date": "YYYY-MM-DD",
  "dimensions": {
    "<dim_id>": { "summary": "...", "confidence": 0.0 }
  },
  "<verdict_field>": "<enum>",
  "risk_factors": ["..."],
  "sources": ["https://..."]
}
```

`validate_report(report) -> list[{type, detail, fix}]`。空列表才算通过。`fix` 必须可执行（改哪个键、调哪个函数、对照哪条 spec）。

## Enforcement

- 测试：一个 `Cn` 一个测试类；单元测试禁止打真实 API。
- 结构对称：`src/x` ↔ `tests/test_x`。
- Linter：spec 在、`validate_report` 在、维度常量 = spec、模块有对测。错误里写 FIX，Agent 才能闭环。
- 改报告形状必须先改 spec，再改测试，再改实现。

## Anti-patterns

- 把厂商、数据源、领域枚举写进通用模板当死值
- 约束只写在散文里，没有 `Cn`、没有测试、没有 linter
- Reporter 直接调外部 API
- 缺维就省略该 key，而不是保留维并标 `confidence=0`
- 校验散落在 Collector / Analyzer，而不是唯一入口
