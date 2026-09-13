"""读仓库根目录 .env，给出 OpenAILike。密钥不进业务代码。"""
from pathlib import Path
import os

from dotenv import load_dotenv
from llama_index.llms.openai_like import OpenAILike

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")


def create_llm() -> OpenAILike:
    api_key = (
        os.getenv("BAILIAN_TOKEN_PLAN_API_KEY")
        or os.getenv("DASHSCOPE_API_KEY")
        or os.getenv("DEEPSEEK_API_KEY")
        or os.getenv("OPENAI_API_KEY")
    )
    if not api_key:
        raise RuntimeError(
            "请先在仓库根目录 .env 中配置 BAILIAN_TOKEN_PLAN_API_KEY 或 DASHSCOPE_API_KEY"
        )
    api_base = os.getenv(
        "CHAT_BASE_URL",
        "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
    )
    model = os.getenv("CHAT_MODEL", "qwen3.8-flash")
    return OpenAILike(
        model=model,
        api_base=api_base,
        api_key=api_key,
        is_chat_model=True,
        is_function_calling_model=True,
        temperature=0.01,
    )
