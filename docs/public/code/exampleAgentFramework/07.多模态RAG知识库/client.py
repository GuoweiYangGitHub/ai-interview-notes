"""读仓库根目录 .env。密钥不进业务代码。

对话走 Token Plan；多模态 embedding 必须用普通百炼 Key（sk-），不能用 Token Plan 的 sk-sp-。
"""
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
import os

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

HERE = Path(__file__).resolve().parent
MULTIMODAL_EMBEDDING_MODEL = "tongyi-embedding-vision-plus"


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


def embedding_api_key() -> str:
    key = os.getenv("DASHSCOPE_API_KEY") or os.getenv("EMBEDDING_API_KEY") or ""
    if not key:
        raise RuntimeError(
            "多模态 embedding 需要仓库根目录 .env 中的 DASHSCOPE_API_KEY（普通百炼 sk-，不要用 Token Plan 的 sk-sp-）"
        )
    if key.startswith("sk-sp-"):
        raise RuntimeError(
            "Token Plan 的 sk-sp- 不能调 tongyi-embedding-vision-plus。请另配 DASHSCOPE_API_KEY"
        )
    return key


def embedding_model() -> str:
    return os.getenv("MULTIMODAL_EMBEDDING_MODEL", MULTIMODAL_EMBEDDING_MODEL)


def create_chat_client() -> tuple[OpenAI, str]:
    return OpenAI(api_key=chat_api_key(), base_url=chat_base_url()), chat_model()


def configure_dashscope() -> str:
    import dashscope

    key = embedding_api_key()
    dashscope.api_key = key
    return key
