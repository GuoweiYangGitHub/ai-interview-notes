/**
 * @file stdio 工具进程
 * @description 对齐课08：`tools/list` + `tools/call`，由 mcpClient 拉起，不要当业务入口。
 */
import { createInterface } from 'node:readline'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** `data/reports.json` 中的一篇报告。 */
type Report = {
  report_id: string
  title: string
  topics: string[]
  summary: string
  content: string
}

const reports: Report[] = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), 'data/reports.json'),
    'utf8',
  ),
)

const tools = [
  {
    name: 'search_reports',
    description: '按关键词搜索报告候选',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '主题或标题关键词' },
      },
      required: ['query'],
    },
  },
  {
    name: 'read_report',
    description: '按 report_id 读取详情',
    inputSchema: {
      type: 'object',
      properties: {
        report_id: { type: 'string', description: '例如 RPT-001' },
      },
      required: ['report_id'],
    },
  },
]

/**
 * 在本进程执行工具。
 *
 * @param name `search_reports` 或 `read_report`
 * @param args 工具参数
 * @throws {Error} 未知工具或报告不存在
 */
function callTool(name: string, args: Record<string, unknown>) {
  if (name === 'search_reports') {
    const query = String(args.query ?? '').toLowerCase()
    return reports
      .filter((row) =>
        `${row.title} ${row.topics.join(' ')} ${row.summary}`
          .toLowerCase()
          .includes(query),
      )
      .map((row) => ({
        report_id: row.report_id,
        title: row.title,
        summary: row.summary,
      }))
  }
  if (name === 'read_report') {
    const row = reports.find((item) => item.report_id === args.report_id)
    if (!row) {
      throw new Error(`没有这份报告：${args.report_id}`)
    }
    return row
  }
  throw new Error(`未知工具：${name}`)
}

/**
 * 写出一条 JSON-RPC 成功响应。
 *
 * @param id 请求 id
 * @param result 方法结果
 */
function reply(id: unknown, result: unknown) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, result })}\n`)
}

/**
 * 写出一条 JSON-RPC 错误响应。
 *
 * @param id 请求 id
 * @param message 错误说明
 */
function fail(id: unknown, message: string) {
  process.stdout.write(
    `${JSON.stringify({ jsonrpc: '2.0', id, error: { message } })}\n`,
  )
}

const rl = createInterface({ input: process.stdin })
rl.on('line', (line) => {
  if (!line.trim()) return
  let request: {
    id?: unknown
    method?: string
    params?: { name?: string; arguments?: Record<string, unknown> }
  }
  try {
    request = JSON.parse(line)
  } catch {
    fail(null, '请求不是合法 JSON')
    return
  }

  try {
    if (request.method === 'tools/list') {
      reply(request.id, { tools })
      return
    }
    if (request.method === 'tools/call') {
      const name = request.params?.name ?? ''
      const args = request.params?.arguments ?? {}
      reply(request.id, { content: callTool(name, args) })
      return
    }
    fail(request.id, `未知方法：${request.method}`)
  } catch (error) {
    fail(request.id, error instanceof Error ? error.message : String(error))
  }
})
