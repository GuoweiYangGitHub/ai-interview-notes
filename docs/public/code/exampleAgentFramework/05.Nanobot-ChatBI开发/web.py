#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""灌密钥后启动官方 WebUI（nanobot webui，内部会起 gateway）。"""
from __future__ import annotations

import os
import subprocess
import sys

from client import WORKSPACE, write_runtime_config


def main() -> None:
    from seed_db import main as seed_main

    if not (WORKSPACE / "stock_data.db").is_file():
        print("未找到 stock_data.db，正在生成演示库…")
        seed_main()

    runtime = write_runtime_config()
    nanobot_exe = WORKSPACE / ".venv" / "Scripts" / "nanobot.exe"
    if nanobot_exe.is_file():
        cmd = [
            str(nanobot_exe),
            "webui",
            "--config",
            str(runtime),
            "--workspace",
            str(WORKSPACE),
            "--yes",
        ]
    else:
        cmd = [
            sys.executable,
            "-m",
            "nanobot",
            "webui",
            "--config",
            str(runtime),
            "--workspace",
            str(WORKSPACE),
            "--yes",
        ]
    print("启动官方 WebUI（nanobot webui）…")
    os.chdir(WORKSPACE)
    raise SystemExit(subprocess.call(cmd))


if __name__ == "__main__":
    main()
