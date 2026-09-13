#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.macd_analysis import run_macd_analysis


def main() -> None:
    parser = argparse.ArgumentParser(description="MACD 买卖点与收益率")
    parser.add_argument("--ts-code", required=True)
    args = parser.parse_args()
    print(json.dumps(run_macd_analysis(args.ts_code, ROOT / "stock_data.db", ROOT), ensure_ascii=False))


if __name__ == "__main__":
    main()
