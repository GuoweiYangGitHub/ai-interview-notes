#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.arima_predict import run_arima_predict


def main() -> None:
    parser = argparse.ArgumentParser(description="ARIMA 收盘价预测")
    parser.add_argument("--ts-code", required=True)
    parser.add_argument("--n", type=int, required=True)
    args = parser.parse_args()
    print(
        json.dumps(
            run_arima_predict(args.ts_code, args.n, ROOT / "stock_data.db", ROOT),
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
