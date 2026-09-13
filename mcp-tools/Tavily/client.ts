/**
 * Tavily 密钥只停在这一层，再传给 MCP 子进程。
 */
export function tavilyApiKey() {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    throw new Error('请先在仓库根目录 .env 中配置 TAVILY_API_KEY')
  }
  return apiKey
}
