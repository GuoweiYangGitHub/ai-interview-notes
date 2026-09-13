# Qwen-Agent · 知识点

Qwen-Agent 是阿里通义侧的轻量 Agent 框架：Tool Use 和 Code Interpreter 是长项，适合快速搭工具调用型 Agent。仓库：`QwenLM/Qwen-Agent`。

## [重点] Qwen-Agent 的定位是怎样的？

阿里生态里的亲儿子。绑千问时，工具调用和代码解释器比硬套 LangChain 顺。轻量、灵活，主场是**工具型 Agent**，不是海量索引，也不是多人编排。

1. **本业是工具** — `@register_tool` 显式登记；本机跑代码、调 MCP、喂 `files` 做文档，都短。  
2. **不是检索专家** — 长期知识靠 `files` 加载，没有 LlamaIndex 那套 `VectorStoreIndex`。海量 PDF 精准问答先检索框架。  
3. **不是编排中枢** — 短期记忆自己维护 `messages` 列表。有环、审批、多角色，交给 LangGraph。

## [重点] Qwen-Agent 的核心概念是什么？

两件事——**指令跟千问、代码能在沙箱里跑**。抽象不如 LangChain 厚，所以更轻、更快。

1. **指令跟随** — 专门为 Qwen 的 Tool Calling 定制，schema 和模型对得齐。少一层通用适配，换非千问模型不一定更香。  
2. **Code Interpreter（杀手锏）** — 内置代码沙箱，不只能调外部 API。模型自己写 Python：画图、算数、改报错再跑。分析型任务别把算术交给模型口算。  
3. **适用** — 要快速搭工具调用或数据分析 Agent，又不想啃厚抽象层。Qwen 长文本也是强项，长文档可以直接 `files` 喂，不必先上向量库。

## `@register_tool` 装饰器怎么用？

自定义工具走**类 + 装饰器**。继承 `BaseTool`，`@register_tool('名字')` 一行登记。模型只看见 `description` 和 `parameters`；真正干活在 `call`，入参是 LLM 吐出的 **JSON 字符串**。

```python
from qwen_agent.tools.base import BaseTool, register_tool

@register_tool("my_image_gen")
class MyImageGen(BaseTool):
    description = "AI 绘画服务，输入文本描述，返回图像 URL"
    parameters = [{
        "name": "prompt",
        "type": "string",
        "description": "期望的图像内容的详细描述",
        "required": True,
    }]

    def call(self, params: str, **kwargs) -> str:
        prompt = json.loads(params)["prompt"]
        prompt = urllib.parse.quote(prompt)
        return json.dumps({"image_url": f"https://.../{prompt}"}, ensure_ascii=False)
```

1. **`@register_tool('name')`** — 一行完成注册，名字给模型点。  
2. **`description`** — 自动变成工具说明，写糊了模型会乱调。  
3. **`parameters`** — 参数约束（类型、必填），比 LangChain `@tool` 靠 type hints 更死，复杂参数不容易漂。  
4. **`call`** — `params` 是 JSON 字符串，自己 `json.loads`；返回也建议 JSON。

## Code Interpreter 沙箱怎么用？

框架内置 `code_interpreter`，工具列表里写上名字就能用。模型**自己写 Python**，在隔离沙箱里跑，不是只调外部 API。算术、画图、改报错再试，都走这里。

```python
tools = ["my_image_gen", "code_interpreter"]
system_instruction = """你是一个乐于助人的AI助手。
收到请求后：先调绘画拿到图像 url，再 requests.get 下载，最后做图像处理并用 plt.show() 展示。"""
```

自带能力：下文件（`requests`）、处理图像（PIL）、数据分析（pandas）、绑图（matplotlib）。自定义工具和沙箱可以并列挂，先后步写在 `system_instruction` 里。

| 能力 | 说明 |
| --- | --- |
| 代码生成 | LLM 自动写 Python |
| 沙箱执行 | 隔离环境跑，不直接砸宿主机 |
| 结果获取 | 捕获输出、图像、文件 |
| 错误修复 | 执行失败把 traceback 喂回去，自动改再试 |

## 文件处理和多文档怎么接？

长期知识不走向量库，把路径列表塞进 `Assistant` 的 `files`。Qwen 长文本是强项，文档不多时直接喂；海量 PDF 精准检索仍交给 LlamaIndex。

```python
from qwen_agent.agents import Assistant

files = [
    os.path.join("./docs", name)
    for name in os.listdir("./docs")
    if os.path.isfile(os.path.join("./docs", name))
]
bot = Assistant(
    llm=llm_cfg,
    system_message=system_instruction,
    function_list=tools,
    files=files,
)
```

1. **扫目录** — 收集文件路径，不是把正文自己拼进 Prompt。  
2. **创建 Agent** — `function_list` 挂工具，`files` 挂文档，两者可以同时有。  
3. **边界** — 窗口再长也装不下整库；文件一多、要按条款名搜，改走索引。

## Qwen-Agent 适合什么场景？

主场是**动手**——跑代码、串工具、处理图、把不太多的文档直接喂进长窗口。不想啃厚抽象、绑千问时最顺。

| 场景 | 说明 |
| --- | --- |
| 数据分析 | 沙箱跑代码、绑图、出报表 |
| 复杂工具链 | 多个自定义工具协同 |
| 图像处理 | 生成、编辑、分析（自研工具 + `code_interpreter`） |
| 文档问答 | 吃 Qwen 长 Context，`files` 直喂 |

海量精准检索用 LlamaIndex；有环、审批、多角色用 LangGraph。

---

## 相关代码示例

- [Qwen-Agent](/E-代码示例/view?p=exampleAgentFramework%2F17.Qwen-Agent)

