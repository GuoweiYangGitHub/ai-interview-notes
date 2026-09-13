"""读仓库根目录 .env。密钥不进业务代码。

对话走 Token Plan；embedding 走百炼通用兼容接口（Token Plan 不含向量模型）。
"""
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
import os

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

DASHSCOPE_COMPAT_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"


def chat_api_key() -> str:
    key = (
        os.getenv("BAILIAN_TOKEN_PLAN_API_KEY")
        or os.getenv("DASHSCOPE_API_KEY")
        or os.getenv("DEEPSEEK_API_KEY")
        or os.getenv("OPENAI_API_KEY")
    )
    if not key:
        raise RuntimeError(
            "请先在仓库根目录 .env 中配置 BAILIAN_TOKEN_PLAN_API_KEY 或 DASHSCOPE_API_KEY"
        )
    return key


def chat_base_url() -> str:
    return os.getenv(
        "CHAT_BASE_URL",
        "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
    )


def chat_model() -> str:
    return os.getenv("CHAT_MODEL", "qwen3.8-flash")


def embedding_api_key() -> str | None:
    # Token Plan 的 sk-sp- 不能拿去调 dashscope embedding。
    return os.getenv("DASHSCOPE_API_KEY") or os.getenv("EMBEDDING_API_KEY") or None


def embedding_base_url() -> str:
    return os.getenv("EMBEDDING_BASE_URL", DASHSCOPE_COMPAT_URL)


def embedding_model() -> str:
    return os.getenv("EMBEDDING_MODEL", "text-embedding-v3")


def create_chat_client() -> tuple[OpenAI, str]:
    return OpenAI(api_key=chat_api_key(), base_url=chat_base_url()), chat_model()
