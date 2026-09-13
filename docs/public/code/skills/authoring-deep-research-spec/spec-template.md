# Deep Research -- 通用规格模板

> 本文档是项目的一等公民。所有实现都是本规格的可执行表达。
> 改本文档必须同步测试和实现。
>
> 使用：复制到领域项目的 `spec/research_spec.md`，替换全部 `{{...}}`，删掉本说明块。

## 领域填空

| 占位符                     | 含义                 | 股票实例           |
| -------------------------- | -------------------- | ------------------ |
| `{{subject_type}}`         | 研究对象类型         | 股票               |
| `{{subject_id_field}}`     | 标识字段名           | stock_code         |
| `{{subject_id_example}}`   | 标识示例             | 600519             |
| `{{subject_name_field}}`   | 名称字段名           | stock_name         |
| `{{subject_name_example}}` | 名称示例             | 贵州茅台           |
| `{{verdict_field}}`        | 结论字段名           | overall_rating     |
| `{{verdict_values}}`       | 结论枚举（逗号分隔） | buy, hold, sell    |
| `{{min_summary_length}}`   | 每维摘要最小字符数   | 100                |
| `{{min_sources}}`          | 最少来源 URL 数      | 3                  |
| `{{model_provider}}`       | 模型接入方式         | DashScope / Qwen   |
| `{{search_capability}}`    | 联网搜索开关         | enable_search=True |
| `{{api_key_env}}`          | 密钥环境变量         | DASHSCOPE_API_KEY  |

维度表（至少 2 维；每维一行）：

| 中文名       | 英文标识 `{{dim_id}}` | 采集内容 `{{dim_collect}}` |
| ------------ | --------------------- | -------------------------- |
| {{dim_name}} | {{dim_id}}            | {{dim_collect}}            |

---

## 功能目标

输入一个 {{subject_type}} 标识（如 "{{subject_id_example}}"），按声明维度采集信息，
经模型分析后生成结构化深度研究报告。

## 系统架构

```
用户输入({{subject_id_field}})
      |
      v
  Client              -- API 客户端层：唯一对外调用模型 / 搜索的地方
      |
      v
  Collector           -- 数据采集层：按维度并行采集
      |
      v
  Analyzer            -- 分析层：汇总评分 + 风险识别
      |
      v
  Reporter            -- 报告层：生成结构化报告 + validate_report
      |
      v
  结构化 JSON 报告
```

依赖方向：`client → collector → analyzer → reporter`。禁止反向依赖。

采集策略（可选）：先用领域数据源打底，再交给模型补全；数据源不可用时，仅模型搜索也必须能产出该维结果（失败则该维 `confidence=0.0`，不得删维）。

## 数据采集维度

| 维度         | 英文标识   | 采集内容        |
| ------------ | ---------- | --------------- |
| {{dim_name}} | {{dim_id}} | {{dim_collect}} |

每维输出固定为：

```json
{
  "summary": "不少于 {{min_summary_length}} 字的分析",
  "confidence": 0.85
}
```

## 输出格式

报告必须严格遵循以下 JSON 结构（字段名按领域表替换）：

```json
{
  "{{subject_id_field}}": "{{subject_id_example}}",
  "{{subject_name_field}}": "{{subject_name_example}}",
  "report_date": "2026-04-12",
  "dimensions": {
    "{{dim_id}}": {
      "summary": "不少于 {{min_summary_length}} 字的分析...",
      "confidence": 0.85
    }
  },
  "{{verdict_field}}": "<{{verdict_values}} 之一>",
  "risk_factors": ["风险因素1"],
  "sources": ["https://...", "https://...", "https://..."]
}
```

`dimensions` 必须包含维度表中的全部标识，不得增删。

## 约束条件 (Constraints)

以下约束直接转化为测试用例和 linter 规则。阈值与字段名来自领域表。

### C1: 维度完整性

- 报告必须包含维度表中的全部 `{{dim_id}}`
- 缺少任一维度视为不合格
- 采集失败不得删维，该维 `confidence` 必须为 `0.0`

### C2: 摘要最小长度

- 每个维度的 `summary` 不少于 `{{min_summary_length}}` 个字符
- 空摘要或过短摘要说明采集不充分

### C3: 置信度范围

- 每个维度的 `confidence` 必须在 `[0.0, 1.0]` 闭区间
- 必须是数值，不能是 `"high"` 这类字符串
- 缺字段单独报错（类型 `missing_confidence`）

### C4: 结论有效值

- `{{verdict_field}}` 只能取：`{{verdict_values}}`
- 大小写变体、未声明别名一律拒绝

### C5: 来源数量

- `sources` 至少 `{{min_sources}}` 个 URL
- 来源过少说明研究深度不够

### C6: 风险因素

- `risk_factors` 不能为空
- 任何研究对象都有风险，空列表说明分析不完整

### C7: 必填字段

- `{{subject_id_field}}`、`{{subject_name_field}}`、`report_date` 为必填且非空
- 缺任一视为结构不完整

## 校验入口

- 唯一入口：`validate_report(report: dict) -> list[dict]`
- 空列表 = 通过
- 每条错误必须含 `type`、`detail`、`fix`
- `fix` 写明改哪个键、建议调用哪个函数、对照本 spec 哪一节

建议 `type`：`missing_field` / `missing_dimension` / `summary_too_short` / `missing_confidence` / `confidence_out_of_range` / `invalid_rating` / `insufficient_sources` / `empty_risk_factors` / `invalid_dimension_format`

实现侧常量必须与本 spec 一致，例如：

```text
REQUIRED_DIMENSIONS = [<全部 dim_id>]
VALID_VERDICTS     = {<verdict_values>}
MIN_SUMMARY_LENGTH = {{min_summary_length}}
MIN_SOURCES        = {{min_sources}}
REQUIRED_FIELDS    = ["{{subject_id_field}}", "{{subject_name_field}}", "report_date"]
```

## API 依赖

- 模型：通过 `{{model_provider}}` 调用
- 联网搜索：`{{search_capability}}`
- 认证：环境变量 `{{api_key_env}}`
- 除 Client 外，任何模块不得直接发起外部 API 调用

## 测试与结构强制

- 每个 `Cn` 对应一个测试类；单元测试禁止调用真实 API
- `src/` 每个模块对应 `tests/test_<同名>`
- Linter 至少检查：本 spec 存在、`validate_report` 存在、`REQUIRED_DIMENSIONS` 与维度表一致、模块有对测
- Linter 错误信息必须带 FIX 指令
