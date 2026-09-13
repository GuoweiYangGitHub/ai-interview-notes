"""最小 FunctionAgent：一件模拟天气工具。"""
from llama_index.core.agent.workflow import FunctionAgent

from client import create_llm


def get_weather(city: str) -> str:
    """查询指定城市的天气。"""
    return f"{city}：晴，26°C"


def create_weather_agent() -> FunctionAgent:
    return FunctionAgent(
        name="weather_agent",
        tools=[get_weather],
        llm=create_llm(),
        system_prompt="你是助手。问天气就调用 get_weather，用中文回答。",
    )


async def ask_weather(question: str) -> str:
    agent = create_weather_agent()
    result = await agent.run(question)
    return str(result)
