"""读仓库根目录 .env。密钥只停在这一层。"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv
import os

WORKSPACE = Path(__file__).resolve().parent
REPO_ROOT = WORKSPACE.parents[1]
load_dotenv(REPO_ROOT / ".env")


@dataclass(frozen=True)
class ChatSettings:
    api_key: str
    api_base: str
    model: str
    tavily_key: str
    tushare_token: str


def load_settings() -> ChatSettings:
    api_key = (
        os.getenv("BAILIAN_TOKEN_PLAN_API_KEY")
        or os.getenv("DASHSCOPE_API_KEY")
        or os.getenv("DEEPSEEK_API_KEY")
        or os.getenv("OPENAI_API_KEY")
        or ""
    )
    if not api_key:
        raise RuntimeError(
            "请先在仓库根目录 .env 中配置 BAILIAN_TOKEN_PLAN_API_KEY 或 DASHSCOPE_API_KEY"
        )
    return ChatSettings(
        api_key=api_key,
        api_base=os.getenv(
            "CHAT_BASE_URL",
            "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
        ),
        model=os.getenv("CHAT_MODEL", "qwen3.8-flash"),
        tavily_key=os.getenv("TAVILY_API_KEY", ""),
        tushare_token=os.getenv("TUSHARE_TOKEN", ""),
    )


def write_runtime_config() -> Path:
    """把密钥写进 .runtime-config.json（不入库），给 CLI / WebUI 共用。"""
    import json

    settings = load_settings()
    data = json.loads((WORKSPACE / "config.json").read_text(encoding="utf-8"))
    data["providers"]["custom"]["api_key"] = settings.api_key
    data["providers"]["custom"]["api_base"] = settings.api_base
    data["agents"]["defaults"]["model"] = settings.model
    data["agents"]["defaults"]["workspace"] = str(WORKSPACE)
    if settings.tavily_key:
        data["tools"]["web"]["search"]["api_key"] = settings.tavily_key
    runtime = WORKSPACE / ".runtime-config.json"
    runtime.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return runtime
