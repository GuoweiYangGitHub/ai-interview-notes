"""最小 create_agent：一件模拟天气工具。"""
from langchain.agents import create_agent

from client import create_chat_model


def get_weather(city: str) -> str:
    """查询指定城市的天气。"""
    return f"{city}：晴，26°C"


def create_weather_agent():
    return create_agent(
        model=create_chat_model(),
        tools=[get_weather],
        system_prompt="你是助手。问天气就调用 get_weather，用中文回答。",
    )


def ask_weather(question: str) -> str:
    agent = create_weather_agent()
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    last = result["messages"][-1]
    content = getattr(last, "content", last)
    return content if isinstance(content, str) else str(content)
