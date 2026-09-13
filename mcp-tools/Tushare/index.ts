/**
 * Tushare Python MCP：list 工具后查茅台日线。
 * 运行：npm run mcp:tushare
 */
import 'dotenv/config'

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tushareToken } from './client'
import { connectStdioMcp } from '../stdio'

const SERVER = join(dirname(fileURLToPath(import.meta.url)), 'server.py')

async function main() {
  const mcp = await connectStdioMcp('python', [SERVER], {
    TUSHARE_TOKEN: tushareToken(),
  })
  try {
    const tools = await mcp.listTools()
    console.log('=== tools/list ===')
    console.log(JSON.stringify(tools, null, 2))

    console.log('\n=== daily: 600519.SH ===')
    console.log(
      await mcp.callTool('daily', {
        ts_code: '600519.SH',
        start_date: '20240101',
        end_date: '20240131',
      }),
    )
  } finally {
    await mcp.close()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
