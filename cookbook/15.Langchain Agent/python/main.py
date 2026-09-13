"""最小 LangChain Agent 演示。运行：npm run langchain-agent:py"""
from __future__ import annotations

import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from agent import ask_weather

QUESTION = "杭州今天天气怎么样？"


def main() -> None:
    print("=== LangChain Agent（Python）===\n")
    print(f"问: {QUESTION}")
    print(f"答: {ask_weather(QUESTION)}")


if __name__ == "__main__":
    main()
