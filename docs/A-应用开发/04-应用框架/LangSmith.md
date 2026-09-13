# LangSmith

## LangSmith的使用

1. 调试与追踪：实时追踪每个 LLM 调用、工具使用和 Agent 决策过程，帮助快速定位问题。
2. 性能监控：监控响应时间、Token 使用量、成本等关键指标，优化应用性能。
3. 测试与评估：创建测试数据集，评估模型输出质量，持续改进应用效果。
4. 数据分析：分析用户查询模式、错误率、成功率等，为产品优化提供数据支持。

## RunnableConfig在LangSmith中的作用是什么？

- 标记与追踪（LangSmith 核心用途）
  - 通过 tags 和 metadata 为每次运行打上标签（如用户ID、业务类型），方便在 LangSmith 后台进行筛选、分组和故障排查

当 Agent 执行出现问题时，可以在 LangSmith 中查看

- 每个节点的输入和输出
- LLM 的完整 Prompt 和响应
- 工具调用的参数和结果
- 状态转换的详细过程

## ProcessingModeEvaluator 和 ResponseCompletenessEvaluator 是自定义的吗？

是的！根据项目特定需求实现的。

## [重点] LangSmith 如何做好提示词版本管理？

Git 适合把 Prompt 与应用代码一起审查、发布；LangSmith 也能保存 Prompt Commit、比较差异、为提交打标签并提升到 Staging / Production。两者可以协同，不是二选一。

**版本管理**

1. **版本落点明确** — 代码内模板走 Git；托管在 LangSmith 的模板使用 Prompt Commit / tag，并在运行 metadata 中写入实际版本。
2. **控制台对比** — 按提交、tag、metadata、实验名筛 v1 / v2，看哪版更好，再决定留哪个。

**持续优化**

3. **代码里改 + 评估** — 改 Prompt，跑评估脚本（例如 `evaluate(..., experiment_prefix="prompt-v2-...")`）。
4. **控制台找问题** — 看评估和生产数据，定位失败 case，回到代码开下一轮。

不要只改文本不跑评测：无论版本放在 Git 还是 LangSmith，都应把黄金集、提交版本与上线环境关联起来。

## openevals与LangSmith的关系是什么？

- 它不是 LangSmith 的一部分，但与 LangSmith 深度集成
- 两者配合使用，但不是包含关系
  - openevals 提供评估器的实现
  - LangSmith 提供评估的平台和基础设施
  - openevals 的评估器可以在 LangSmith 中使用

## OpenEvals 内置 Prompt 总结

现成评估提示，按任务选，不必从零写裁判 Prompt。

| #   | Prompt                                         | 功能                | 使用场景                   |
| --- | ---------------------------------------------- | ------------------- | -------------------------- |
| 1   | CORRECTNESS_PROMPT                             | 正确性              | 验证答案对不对             |
| 2   | CONCISENESS_PROMPT                             | 简洁性              | 回答是否太啰嗦             |
| 3   | ANSWER_RELEVANCE_PROMPT                        | 相关性              | 答的是不是这个问题         |
| 4   | RAG_HELPFULNESS_PROMPT                         | RAG 帮助性          | RAG 系统整体好不好用       |
| 5   | RAG_GROUNDEDNESS_PROMPT                        | RAG 基础性 / 忠实度 | 是否基于检索内容，有没有编 |
| 6   | RAG_RETRIEVAL_RELEVANCE_PROMPT                 | RAG 检索相关性      | 捞来的文档和问题是否相关   |
| 7   | TOXICITY_PROMPT                                | 毒性 / 有害         | 内容安全                   |
| 8   | HALLUCINATION_PROMPT                           | 幻觉                | 有没有无根据的声明         |
| 9   | CODE_CORRECTNESS_PROMPT                        | 代码正确性          | 代码评估                   |
| 10  | CODE_CORRECTNESS_PROMPT_WITH_REFERENCE_OUTPUTS | 带参考的代码评估    | 有标准答案时比代码         |
| 11  | PLAN_ADHERENCE_PROMPT                          | 计划遵循度          | Agent 有没有按计划执行     |

RAG 题优先 4–6 + 8；通用问答 1–3；代码 9–10；Agent 看 11。业务口径仍可自己写 Evaluator（例如 ProcessingMode / ResponseCompleteness）。

## 什么是DeepEval？

一个开源的 LLM 评估框架，专注于对大语言模型应用进行系统化的质量测试和评估。它就像传统软件开发中的 Pytest/JUnit，为 LLM 应用提供了标准化的测试能力

特点：

- 内置40+评估指标；提供丰富的评估指标，覆盖 RAG、Agent、对话等多种场景，包括幻觉检测、相关性、忠实度等。

## 什么是LangFuse?

LangFuse 是一个开源的 LLM（大语言模型）工程平台，定位是“可观测性 + 调试 + 评估”三合一的 LLMOps 工具
