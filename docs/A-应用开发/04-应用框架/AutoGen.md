# AutoGen · 知识点

AutoGen 是微软开源的**多智能体对话框架**：多个 AI Agent 协作完成复杂任务。仓库：`microsoft/autogen`。

## [重点] AutoGen 的定位是怎样的？

核心理念是让 Agent **用自然语言对聊**来协作，而不是把流程写成硬编码的函数调用。一个人干不完、要多角色吵出结果，才轮到它。

1. **本业是多角色** — 原生 GroupChat，记忆跟着群聊走。研究员、写手、审稿人各说各的，聊到收敛。
2. **不是检索专家** — RAG 要自己集成，知识库别拿它当底座。
3. **不是通用编排** — 线性流水线、换模型、单 Agent 调工具，LangChain 更合适；要图、要审批用 LangGraph。

## AutoGen 里一个 Agent 怎么定义？

Agent 是基本单元。群聊里靠 **name** 区分谁在说话；人设靠 **system_message**；模型靠 **llm_config**；手靠 **tools**。少一个都能聊，但缺 name 会串声，缺 system_message 会抢戏。

| 属性             | 说明                          |
| ---------------- | ----------------------------- |
| `name`           | 名称标识，对话里区分发言者    |
| `system_message` | 角色设定 / 提示词，职责和行为 |
| `llm_config`     | 模型、API Key、温度等         |
| `tools`          | 可调的外部函数，扩展能力      |

## ConversableAgent 怎么写？

最常用的是 `ConversableAgent`。四属性对上构造函数；再加 `human_input_mode` 决定要不要人插话。下面用投委会分析师当示例角色。

```python
from autogen import ConversableAgent

agent = ConversableAgent(
    name="AnalystAgent",
    system_message="你是投资委员会的分析师 ...",
    llm_config={
        "config_list": [{
            "model": "gemini-2.5-flash",
            "api_key": "your_api_key",
            "api_type": "google",
        }]
    },
    human_input_mode="NEVER",
)
```

`config_list` 可以备多个模型做降级。`NEVER` = 全自动；要人审改 `ALWAYS` / `TERMINATE`。

## 常用 Agent 有哪几种？

| 类型               | 用途     | 特点                             |
| ------------------ | -------- | -------------------------------- |
| `ConversableAgent` | 基础对话 | 最灵活，可完全自定义             |
| `AssistantAgent`   | 助手     | 默认 LLM 驱动，适合生成内容      |
| `UserProxyAgent`   | 用户代理 | 可执行代码、调工具、请求人工输入 |

示例里用 `ConversableAgent` 建多个角色，差别主要是**挂不挂 tools**。要跑代码、当人的手，用 `UserProxyAgent`。

## [重点] GroupChat（群聊）是什么？

GroupChat 是把多个 Agent **放进同一场对话**的容器。谁能说话、说几轮、下一个轮到谁，都在这里定。真正开聊要再套一层 `GroupChatManager`，由某个 Agent `initiate_chat`。

```python
from autogen import GroupChat, GroupChatManager

group_chat = GroupChat(
    agents=[data_agent, analyst_agent, risk_agent, trader_agent],
    messages=[],
    max_round=8,
    speaker_selection_method="round_robin",
)
manager = GroupChatManager(groupchat=group_chat, llm_config=llm_config)
result = data_agent.initiate_chat(manager, message="用户查询: ...")
```

示例角色链：数据员 → 分析师 → 风控 → 交易员，顺序固定、用轮流。`max_round` 是硬顶，防止聊死。

## 群聊对话流程是怎样的？

1. 用户发起查询。
2. `GroupChatManager` 按策略选出第一个发言者。
3. 被选中的 Agent 生成回复（可调工具）。
4. 回复写入**共享对话历史**，全员可见。
5. Manager 再选下一个发言者。
6. 重复 3–5，直到 `max_round` 或终止条件，返回结果。

## 发言者怎么选？

| 策略          | 说明                     | 适用                                  |
| ------------- | ------------------------ | ------------------------------------- |
| `round_robin` | 按 `agents` 列表顺序轮流 | 流程明确（数据 → 分析 → 风控 → 决策） |
| `random`      | 随机下一个               | 头脑风暴                              |
| `auto`        | LLM 判断谁最适合接话     | 开放讨论、问答                        |
| 自定义函数    | 自己写选择逻辑           | 复杂分支                              |

顺序写死用 `round_robin`；要灵活讨论用 `auto`。

---

## 相关代码示例

- [AutoGen](/E-代码示例/view?p=exampleAgentFramework%2F18.AutoGen)
