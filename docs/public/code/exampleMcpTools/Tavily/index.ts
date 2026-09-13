/**
 * tavily-mcp：list 工具后调用 tavily-search。
 * 运行：npm run mcp:tavily
 */
import 'dotenv/config'

import { connectNpxMcp } from '../stdio'
import { tavilyApiKey } from './client'

async function main() {
  const mcp = await connectNpxMcp('tavily-mcp@0.1.4', {
    TAVILY_API_KEY: tavilyApiKey(),
  })
  try {
    const tools = await mcp.listTools()
    console.log('=== tools/list ===')
    console.log(JSON.stringify(tools, null, 2))

    const query = '贵州茅台 最新新闻'
    console.log(`\n=== tavily-search: ${query} ===`)
    console.log(
      JSON.stringify(
        await mcp.callTool('tavily-search', {
          query,
          max_results: 5,
          topic: 'news',
        }),
        null,
        2,
      ),
    )
  } finally {
    await mcp.close()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
