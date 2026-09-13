"""SelectorGroupChat：天气助手查模拟天气，顾问给出行建议。"""
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.conditions import MaxMessageTermination, TextMentionTermination
from autogen_agentchat.teams import SelectorGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient

from client import create_model_client


def get_weather(city: str) -> str:
    """查询指定城市的天气。"""
    return f"{city}：晴，26°C"


def create_weather_agent(model_client: OpenAIChatCompletionClient) -> AssistantAgent:
    return AssistantAgent(
        name="weather",
        model_client=model_client,
        tools=[get_weather],
        description="查询城市天气。",
        system_message=(
            "你负责查天气。问到城市天气就调用 get_weather，只用工具结果，不要编造。"
            "用中文简述实况，不要写 TERMINATE。"
        ),
        reflect_on_tool_use=True,
    )


def create_advisor_agent(model_client: OpenAIChatCompletionClient) -> AssistantAgent:
    return AssistantAgent(
        name="advisor",
        model_client=model_client,
        description="根据天气给出出行建议。",
        system_message=(
            "你根据天气助手提供的实况，用中文给简短出行建议。"
            "完成后最后一行只写 TERMINATE。"
        ),
    )


def create_team(model_client: OpenAIChatCompletionClient) -> SelectorGroupChat:
    return SelectorGroupChat(
        [create_weather_agent(model_client), create_advisor_agent(model_client)],
        model_client=model_client,
        termination_condition=TextMentionTermination("TERMINATE", sources=["advisor"])
        | MaxMessageTermination(8),
        allow_repeated_speaker=True,
    )


def format_turns(result) -> list[str]:
    lines: list[str] = []
    for message in getattr(result, "messages", None) or []:
        source = getattr(message, "source", None) or "unknown"
        content = getattr(message, "content", None)
        if content is None:
            continue
        if not isinstance(content, str):
            content = str(content)
        content = content.strip()
        if not content:
            continue
        lines.append(f"[{source}] {content}")
    return lines


async def run_group_chat(question: str) -> list[str]:
    model_client = create_model_client()
    try:
        team = create_team(model_client)
        result = await team.run(task=question)
        return format_turns(result)
    finally:
        await model_client.close()
