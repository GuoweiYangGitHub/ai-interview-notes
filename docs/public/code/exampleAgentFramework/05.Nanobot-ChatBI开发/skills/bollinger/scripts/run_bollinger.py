#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.bollinger_core import run_bollinger_analysis


def main() -> None:
    parser = argparse.ArgumentParser(description="布林带超买超卖与回测")
    parser.add_argument("--ts-code", required=True)
    parser.add_argument("--start-date", default=None)
    parser.add_argument("--end-date", default=None)
    parser.add_argument("--window", type=int, default=20)
    parser.add_argument("--num-std", type=float, default=2.0)
    parser.add_argument("--initial-amount", type=float, default=10000.0)
    args = parser.parse_args()
    print(
        json.dumps(
            run_bollinger_analysis(
                args.ts_code,
                ROOT / "stock_data.db",
                ROOT,
                start_date=args.start_date,
                end_date=args.end_date,
                window=args.window,
                num_std=args.num_std,
                initial_amount=args.initial_amount,
            ),
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
