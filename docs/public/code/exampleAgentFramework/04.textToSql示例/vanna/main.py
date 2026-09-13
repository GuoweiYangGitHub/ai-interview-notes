"""官方 Vanna（Python）查阅演示。运行：npm run text-to-sql:vanna

初始化：connect_to_sqlite → train(ddl/doc) → ask
进阶：auto_train、摘要、追问、反向出题
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from client import create_client
from db import create_demo_db
from vanna.chromadb import ChromaDB_VectorStore
from vanna.openai import OpenAI_Chat

DOC = (
    "英雄数据存储在 heros 表，attack_max 是英雄最大攻击力，name 是英雄名字。"
    "customerinfo 存客户姓名和电话。"
    "policyinfo.PremiumPaymentStatus 为 未支付/已支付。"
    "claiminfo.ClaimAmount 是理赔金额。"
)


class MyVanna(ChromaDB_VectorStore, OpenAI_Chat):
    """本地 Chroma + OpenAI 兼容 Chat。不要把 LLM client 放进 config['client']，那是 Chroma 用的。"""

    def __init__(self, llm_client, config=None):
        config = dict(config or {})
        config.setdefault("client", "in-memory")
        ChromaDB_VectorStore.__init__(self, config=config)
        OpenAI_Chat.__init__(self, client=llm_client, config=config)


def allow_readonly(vn: MyVanna) -> None:
    original = vn.run_sql

    def run_sql(sql: str):
        trimmed = sql.strip().rstrip(";")
        if not re.match(r"(?is)^(select|pragma)\b", trimmed):
            raise ValueError("本示例只允许 SELECT / PRAGMA，避免模型改库")
        return original(sql)

    vn.run_sql = run_sql


def train_from_database(vn: MyVanna) -> None:
    ddl_rows = vn.run_sql(
        "SELECT sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL"
    )
    for sql in ddl_rows["sql"].tolist():
        vn.train(ddl=sql)
    vn.train(documentation=DOC)


def main() -> None:
    client, model = create_client()
    vn = MyVanna(
        llm_client=client,
        config={"model": model, "temperature": 0.2},
    )
    vn.dialect = "SQLite"
    vn.language = "Chinese"

    db_path = create_demo_db(HERE / "demo.sqlite")
    vn.connect_to_sqlite(str(db_path))
    allow_readonly(vn)
    train_from_database(vn)
    print(f"训练样本：{len(vn.get_training_data())} 条（DDL + 文档）")

    question = "查询英雄攻击力前5名的英雄"
    print(f"\n=== ask: {question} ===")
    sql, df, _fig = vn.ask(
        question=question,
        print_results=False,
        auto_train=True,
        visualize=False,
        allow_llm_to_see_data=False,
    )
    print("SQL:\n", sql)
    print("结果:\n", df)
    print(f"auto_train 后样本：{len(vn.get_training_data())} 条")

    print("\n=== generate_summary ===")
    print(vn.generate_summary(question=question, df=df))

    print("\n=== generate_followup_questions ===")
    for follow in vn.generate_followup_questions(
        question=question, sql=sql, df=df, n_questions=5
    ) or []:
        print(f"- {follow}")

    print("\n=== generate_question ===")
    sample_sqls = [
        "SELECT role_main, COUNT(*) AS cnt FROM heros GROUP BY role_main ORDER BY cnt DESC",
        "SELECT name, hp_max FROM heros ORDER BY hp_max DESC LIMIT 10",
        "SELECT name, defense_max FROM heros WHERE role_main = '坦克' ORDER BY defense_max DESC",
    ]
    for sample_sql in sample_sqls:
        print(f"SQL: {sample_sql}")
        print(f"反推问题: {vn.generate_question(sql=sample_sql)}\n")


if __name__ == "__main__":
    main()
