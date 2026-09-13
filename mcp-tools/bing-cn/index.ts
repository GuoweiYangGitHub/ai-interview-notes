/**
 * bing-cn-mcp：list 工具后调用 bing_search。无需 API Key。
 * 运行：npm run mcp:bing-cn
 */
import { connectNpxMcp } from '../stdio'

async function main() {
  const mcp = await connectNpxMcp('bing-cn-mcp')
  try {
    const tools = await mcp.listTools()
    console.log('=== tools/list ===')
    console.log(JSON.stringify(tools, null, 2))

    const query = '贵州茅台 最新新闻'
    console.log(`\n=== bing_search: ${query} ===`)
    console.log(
      JSON.stringify(
        await mcp.callTool('bing_search', { query, count: 5 }),
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
