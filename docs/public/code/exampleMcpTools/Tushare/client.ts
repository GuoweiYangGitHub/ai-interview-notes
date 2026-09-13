/**
 * Tushare 密钥只停在这一层，再传给 Python MCP 子进程。
 */
export function tushareToken() {
  const token = process.env.TUSHARE_TOKEN
  if (!token) {
    throw new Error(
      '请先在仓库根目录 .env 中配置 TUSHARE_TOKEN（https://tushare.pro）',
    )
  }
  return token
}
