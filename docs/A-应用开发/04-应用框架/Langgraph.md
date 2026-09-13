# LangGraph

链（LangChain）是写死的流水线；图（LangGraph）带状态、能循环、能按条件走不同边。适合要重试、分支、多 Agent 的工作流。

## [重点] LangGraph 的使用步骤

1. **定义状态** — 用 `TypedDict` 声明工作流里要流转的字段（如 `messages`、`next`）。节点读写的都是这份状态。
2. **创建 StateGraph** — `StateGraph(State)`，把状态类型传进去。
3. **定义节点函数** — 函数签名：接收当前状态，返回要 **更新** 的字段（不是每次都重写整份状态）。
4. **添加节点** — `add_node("名字", 函数)`。
5. **设置入口点** — 兼容写法是 `set_entry_point("起始节点")`；当前 Graph API 也常用 `add_edge(START, "起始节点")`，条件入口则从 `START` 添加条件边。
6. **添加边** — 固定走向用 `add_edge()`；按状态选下一跳用 `add_conditional_edges()`。需要在同一节点同时更新状态和路由时用 `Command`。结束接到 `END`。
7. **编译** — `compile()` 得到可执行图（可在这里挂 checkpointer 做持久化，编译即可）。
8. **执行** — `invoke(初始状态)`；流式可用 `stream`。

顺序：状态 → 图画板 → 节点函数 → 挂点 → 入口 → 连边 → 编译 → invoke。

机制上的环和停止条件看 [Agent 知识点](../03-Agent与工具调用/知识点)。

---

## 相关代码示例

- [规划转任务，任务转 Loop](/E-代码示例/view?p=examples%2F07.%E8%A7%84%E5%88%92%E8%BD%AC%E4%BB%BB%E5%8A%A1%EF%BC%8C%E4%BB%BB%E5%8A%A1%E8%BD%ACLoop)
