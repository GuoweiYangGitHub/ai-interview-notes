/**
 * LangChain SQL Agent。
 *
 * createAgent + 只读工具。Agent 自己：list tables → schema → SELECT。
 */
import { createAgent, tool } from 'langchain'
import { z } from 'zod'

import { formatRows, getSchema, getTableDdl, listTables, runSql } from '../db'
import { createChatModel } from './client'

function createSqlTools() {
  const listTablesTool = tool(async () => (await listTables()).join(', '), {
    name: 'sql_db_list_tables',
    description: '列出数据库里所有表名。回答任何问题前先调用。',
    schema: z.object({}),
  })

  const schemaTool = tool(
    async ({ tables }) => {
      const names = tables
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
      if (names.length === 0) return await getSchema()
      const parts: string[] = []
      for (const name of names) {
        const ddl = await getTableDdl(name)
        parts.push(ddl || `表 ${name} 不存在`)
      }
      return parts.join('\n\n')
    },
    {
      name: 'sql_db_schema',
      description: '查看一张或多张表的 DDL。tables 用逗号分隔。',
      schema: z.object({
        tables: z
          .string()
          .describe('表名，逗号分隔，例如 heros 或 customerinfo,policyinfo'),
      }),
    },
  )

  const queryTool = tool(
    async ({ query }) => {
      try {
        return formatRows(await runSql(query))
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : String(error)}`
      }
    },
    {
      name: 'sql_db_query',
      description: '执行一条只读 SELECT。不要 SELECT *。默认 LIMIT 10。',
      schema: z.object({
        query: z.string().describe('SQLite SELECT 语句'),
      }),
    },
  )

  return [listTablesTool, schemaTool, queryTool]
}

export async function createSqlAgent() {
  const schema = await getSchema()
  return createAgent({
    model: createChatModel(),
    tools: createSqlTools(),
    systemPrompt: `你是仔细的 SQLite 分析助手。用工具查库，不要编造表或字段。

权威 schema：
${schema}

规则：
- 先 sql_db_list_tables，再 sql_db_schema，最后 sql_db_query。
- 只读 SELECT；禁止 INSERT/UPDATE/DELETE/DDL。
- 表不存在就直说，不要编一张。
- 默认最多 10 行。用中文回答，必要时带上 SQL。`,
  })
}

export function lastText(messages: Array<{ content?: unknown }>) {
  const last = messages.at(-1)
  const content = last?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part
        if (part && typeof part === 'object' && 'text' in part) {
          return String((part as { text?: string }).text ?? '')
        }
        return ''
      })
      .join('')
  }
  return JSON.stringify(content ?? '')
}

export async function askLangChain(question: string) {
  const agent = await createSqlAgent()
  const result = await agent.invoke({
    messages: [{ role: 'user', content: question }],
  })
  return lastText(result.messages as Array<{ content?: unknown }>)
}
