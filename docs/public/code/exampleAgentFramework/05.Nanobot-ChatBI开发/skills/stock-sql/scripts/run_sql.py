#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.sql_chart import run_exc_sql


def main() -> None:
    parser = argparse.ArgumentParser(description="执行 stock_data 相关 SQL")
    parser.add_argument("--sql", required=True, help="完整 SELECT 语句")
    args = parser.parse_args()
    print(json.dumps(run_exc_sql(args.sql, ROOT / "stock_data.db", ROOT), ensure_ascii=False))


if __name__ == "__main__":
    main()
