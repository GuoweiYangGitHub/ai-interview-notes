"""AutoGen SelectorGroupChat 演示。运行：npm run autogen-agent"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from agent import run_group_chat

QUESTION = "杭州今天天气怎么样？"


async def main() -> None:
    print("=== AutoGen SelectorGroupChat ===\n")
    print(f"问: {QUESTION}\n")
    for turn in await run_group_chat(QUESTION):
        print(turn)
        print()


if __name__ == "__main__":
    asyncio.run(main())
