"""演示 sqlite。表结构与上级 db.ts 对齐，Vanna 用 Python 标准库建库。"""
from __future__ import annotations

import sqlite3
from pathlib import Path

SEED_SQL = """
CREATE TABLE heros (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  hp_max REAL,
  attack_max REAL,
  defense_max REAL,
  attack_range TEXT,
  role_main TEXT,
  role_assist TEXT
);

INSERT INTO heros VALUES
  (10000, '夏侯惇', 7350, 321, 397, '近战', '坦克', '战士'),
  (10004, '吕布', 7344, 343, 390, '近战', '战士', '坦克'),
  (10005, '亚瑟', 8050, 346, 400, '近战', '战士', '坦克'),
  (10019, '后羿', 5986, 396, 336, '远程', '射手', NULL),
  (10020, '马可波罗', 5584, 362, 344, '远程', '射手', NULL),
  (10021, '鲁班七号', 5989, 400, 323, '远程', '射手', NULL),
  (10023, '孙尚香', 6014, 411, 346, '远程', '射手', NULL),
  (10024, '黄忠', 5898, 403, 319, '远程', '射手', NULL);

CREATE TABLE customerinfo (
  CustomerID INTEGER,
  Name TEXT,
  PhoneNumber TEXT,
  EmailAddress TEXT
);

INSERT INTO customerinfo VALUES
  (609296, '欧颖', '14708198484', 'fangshen@example.org'),
  (240508, '李辉', '15182875235', 'pchang@example.org'),
  (421777, '徐波', '18537535161', 'mingwan@example.org');

CREATE TABLE policyinfo (
  PolicyNumber TEXT,
  CustomerID INTEGER,
  PolicyStatus TEXT,
  PremiumPaymentStatus TEXT
);

INSERT INTO policyinfo VALUES
  ('POL263979', 240508, '生效', '未支付'),
  ('POL505796', 421777, '生效', '已支付'),
  ('POL625994', 609296, '终止', '未支付');

CREATE TABLE claiminfo (
  ClaimNumber TEXT,
  PolicyNumber TEXT,
  ClaimAmount INTEGER,
  ClaimStatus TEXT
);

INSERT INTO claiminfo VALUES
  ('CLM4243', 'POL263979', 55407, '审核中'),
  ('CLM1073', 'POL505796', 20026, '审核中'),
  ('CLM3448', 'POL625994', 8000, '已批准');
"""


def create_demo_db(path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        path.unlink()
    conn = sqlite3.connect(path)
    try:
        conn.executescript(SEED_SQL)
        conn.commit()
    finally:
        conn.close()
    return path
