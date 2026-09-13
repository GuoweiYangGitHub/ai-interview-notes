/**
 * 共用演示库。LangChain / Vanna 两个文件夹都从这里读表。
 *
 * sqlite 种子：heros、customerinfo、policyinfo、claiminfo。
 */
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import initSqlJs, { type Database, type SqlValue } from 'sql.js'

export type QueryRow = Record<string, SqlValue>

const SEED_SQL = `
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
`

let dbPromise: Promise<Database> | undefined

async function openDatabase() {
  const require = createRequire(import.meta.url)
  const wasmDir = dirname(require.resolve('sql.js/dist/sql-wasm.js'))
  const SQL = await initSqlJs({
    locateFile: (file) => join(wasmDir, file),
  })
  const db = new SQL.Database()
  db.run(SEED_SQL)
  return db
}

export async function getDb() {
  dbPromise ??= openDatabase()
  return dbPromise
}

export async function runSql(sql: string): Promise<QueryRow[]> {
  const db = await getDb()
  const trimmed = sql.trim().replace(/;+\s*$/, '')
  if (!/^\s*select\b/i.test(trimmed) && !/^\s*pragma\b/i.test(trimmed)) {
    throw new Error('本示例只允许 SELECT / PRAGMA，避免模型改库')
  }

  const stmt = db.prepare(trimmed)
  const rows: QueryRow[] = []
  try {
    while (stmt.step()) {
      rows.push(stmt.getAsObject())
    }
  } finally {
    stmt.free()
  }
  return rows
}

export async function listTables() {
  const rows = await runSql(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  )
  return rows.map((row) => String(row.name))
}

export async function getTableDdl(table: string) {
  const rows = await runSql(
    `SELECT sql FROM sqlite_master WHERE type='table' AND name = '${table.replace(/'/g, "''")}'`,
  )
  return String(rows[0]?.sql ?? '')
}

export async function getSchema() {
  const tables = await listTables()
  const chunks: string[] = []
  for (const table of tables) {
    const ddl = await getTableDdl(table)
    if (ddl) chunks.push(ddl)
  }
  return chunks.join(';\n\n')
}

export function formatRows(rows: QueryRow[]) {
  if (rows.length === 0) return '(空结果)'
  return JSON.stringify(rows, null, 2)
}
