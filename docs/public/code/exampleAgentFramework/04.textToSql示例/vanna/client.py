"""读仓库根目录 .env，给出 OpenAI 兼容客户端。密钥不进业务代码。"""
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
import os

ROOT = Path(__file__).resolve().parents[3]
load_dotenv(ROOT / ".env")


def create_client() -> tuple[OpenAI, str]:
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
    base_url = os.getenv(
        "CHAT_BASE_URL",
        "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
    )
    model = os.getenv("CHAT_MODEL", "qwen3.8-flash")
    return OpenAI(api_key=api_key, base_url=base_url), model
