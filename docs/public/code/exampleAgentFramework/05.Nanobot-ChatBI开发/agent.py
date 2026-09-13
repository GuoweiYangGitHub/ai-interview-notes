#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ChatBI 助手 CLI。运行：npm run chatbi  或  python agent.py -m "问题" """
from __future__ import annotations

import argparse
import asyncio
import os
import sys

if sys.platform == "win32":
    os.environ.setdefault("PYTHONUTF8", "1")
    os.environ.setdefault("PYTHONIOENCODING", "utf-8")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from datetime import datetime

from client import WORKSPACE, write_runtime_config
from nanobot.agent.hook import AgentHook, AgentHookContext
from nanobot.nanobot import Nanobot


class PrintHook(AgentHook):
    async def before_execute_tools(self, ctx: AgentHookContext) -> None:
        for call in ctx.tool_calls:
            print(f"  [{call.name}] {str(getattr(call, 'arguments', call))[:160]}")


def inject_time_context() -> None:
    memory_file = WORKSPACE / "memory" / "MEMORY.md"
    memory_file.parent.mkdir(parents=True, exist_ok=True)
    today = datetime.now()
    weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
    memory_file.write_text(
        f"# 当前时间上下文\n\n"
        f"今天是 {today.strftime('%Y年%m月%d日')} {weekdays[today.weekday()]}。\n"
        f"日线 `trade_date` 为已收盘数据；预测与回测仅供参考。\n",
        encoding="utf-8",
    )


def ensure_db() -> None:
    if (WORKSPACE / "stock_data.db").is_file():
        return
    print("未找到 stock_data.db，正在生成演示库…")
    from seed_db import main as seed_main

    seed_main()


def build_bot() -> Nanobot:
    ensure_db()
    inject_time_context()
    runtime = write_runtime_config()
    return Nanobot.from_config(runtime, workspace=WORKSPACE)


async def run_interactive() -> None:
    bot = build_bot()
    print("=" * 60)
    print("  ChatBI 助手 (nanobot CLI)")
    print(f"  工作目录: {WORKSPACE}")
    print("  输入问题，quit 退出")
    print("=" * 60)
    while True:
        try:
            user_input = input("\n你: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ("quit", "exit", "q"):
                print("助手: 再见。")
                break
            print("  [思考中...]")
            result = await bot.run(user_input, session_key="chatbi:cli", hooks=[PrintHook()])
            print(f"\n助手: {result.content}")
        except KeyboardInterrupt:
            print("\n已退出")
            break


async def run_single(message: str) -> None:
    print(f"问题: {message}")
    print("  [思考中...]")
    bot = build_bot()
    result = await bot.run(message, session_key="chatbi:oneshot", hooks=[PrintHook()])
    print(f"\n助手: {result.content}")


def main() -> None:
    parser = argparse.ArgumentParser(description="ChatBI 助手 (nanobot CLI)")
    parser.add_argument("-m", "--message", default=None, help="单次提问")
    args = parser.parse_args()
    if args.message:
        asyncio.run(run_single(args.message))
    else:
        asyncio.run(run_interactive())


if __name__ == "__main__":
    main()
