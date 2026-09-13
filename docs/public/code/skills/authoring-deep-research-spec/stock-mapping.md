# 股票 spec → 通用骨架对照

源：`stock-research/spec/research_spec.md`（及对应测试 / linter / 四层实现）。

## 怎么抽

对源文档每一段问：换成「竞品」「候选人」「产品」后，这句话还成不成立？

- 成立 → 写入 [spec-template.md](spec-template.md) 骨架
- 不成立 → 变成 `{{占位符}}` 或领域表的一行

## 字段映射

| 股票原文                               | 通用占位                                              | 为何抽走                             |
| -------------------------------------- | ----------------------------------------------------- | ------------------------------------ |
| 股票代码 / `stock_code`                | `{{subject_type}}` / `{{subject_id_field}}`           | 研究对象换了字段就换                 |
| `stock_name`                           | `{{subject_name_field}}`                              | 同上                                 |
| `"600519"` / 贵州茅台                  | `{{subject_id_example}}` / `{{subject_name_example}}` | 示例，不是契约                       |
| fundamental / market / news / analyst  | 维度表行                                              | 维随领域变，维的形状不变             |
| `overall_rating`                       | `{{verdict_field}}`                                   | 竞品可能是 `recommendation`          |
| buy / hold / sell                      | `{{verdict_values}}`                                  | 枚举是领域决策，不是流水线           |
| 摘要 ≥ 100、来源 ≥ 3                   | `{{min_summary_length}}` / `{{min_sources}}`          | 阈值可调，约束类型不可删             |
| Qwen / DashScope / `DASHSCOPE_API_KEY` | `{{model_provider}}` / `{{api_key_env}}`              | 厂商可换；「只在 Client 调 API」留下 |
| akshare / 东方财富                     | （领域数据源，模板里标可选）                          | 打底源可无；「失败不删维」留下       |

## 留下的骨架（不要再领域化）

1. 规格是一等公民；改形状先改 spec
2. Client → Collector → Analyzer → Reporter，单向依赖
3. 每维 `summary` + `confidence`；并行采集
4. 失败维保留，`confidence=0.0`
5. C1–C7 七类约束（完整 / 长度 / 值域 / 枚举 / 来源 / 风险非空 / 必填）
6. `validate_report` 唯一入口；错误带 `type` / `detail` / `fix`
7. 一个 `Cn` 一个测试类；`src/x` ↔ `tests/test_x`
8. Linter 卡 spec、校验函数、维度常量、对测文件

## 源文档对应段

| 源章节         | 提取动作                                             |
| -------------- | ---------------------------------------------------- |
| 功能目标       | 保留句式，替换「股票代码」为 `{{subject_type}} 标识` |
| 系统架构 ASCII | 原样保留四层，去掉 Qwen 专名                         |
| 数据采集维度表 | 表头保留，行改成填空                                 |
| 输出 JSON      | 键名参数化，维内形状不动                             |
| C1–C7          | 升级为约束类型目录，阈值改占位                       |
| API 依赖       | 只留「Client 独占 + 环境变量」，厂商改占位           |

## 反例：不要写进通用文档

- 「输入一个股票代码（如 600519）」当死句，不提供占位
- 把 buy/hold/sell 写成所有领域的结论
- 把 Qwen `search_strategy="agent"` 写成通用必选项
- 把「投资都有风险」写成唯一风险理由（换成「研究对象都有风险」）
