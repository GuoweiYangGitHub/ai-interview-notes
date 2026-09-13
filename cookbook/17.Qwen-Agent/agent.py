"""最小 Assistant：一件模拟天气工具。"""
from __future__ import annotations

import json

from qwen_agent.agents import Assistant
from qwen_agent.tools.base import BaseTool, register_tool

from client import create_llm_cfg


@register_tool("get_weather")
class GetWeather(BaseTool):
    description = "查询指定城市的天气。"
    parameters = [
        {
            "name": "city",
            "type": "string",
            "description": "城市名，例如杭州",
            "required": True,
        }
    ]

    def call(self, params: str | dict, **kwargs) -> str:
        data = json.loads(params) if isinstance(params, str) else params
        city = str(data.get("city", "")).strip()
        return f"{city}：晴，26°C"


def create_weather_agent() -> Assistant:
    return Assistant(
        llm=create_llm_cfg(),
        system_message="你是助手。问天气就调用 get_weather，用中文回答。",
        function_list=["get_weather"],
    )


def _last_text(messages) -> str:
    if not messages:
        return ""
    last = messages[-1]
    content = last.get("content") if isinstance(last, dict) else getattr(last, "content", last)
    if isinstance(content, str):
        return content
    return str(content)


def ask_weather(question: str) -> str:
    bot = create_weather_agent()
    last = None
    for response in bot.run(messages=[{"role": "user", "content": question}]):
        last = response
    return _last_text(last)
