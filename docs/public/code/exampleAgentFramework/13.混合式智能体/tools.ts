/**
 * 模拟行情工具。不接真实行情。
 */
import { tool } from 'langchain'
import { z } from 'zod'

export function createWealthTools() {
  const indexTool = tool(
    async () => {
      const result = '上证指数 当前点位: 3125.62，涨跌: 6.32，涨跌幅: 0.20%'
      console.log(`[工具调用] ${result}`)
      return result
    },
    {
      name: 'query_shanghai_index',
      description: '查询上证指数模拟行情（点位、涨跌、涨跌幅）',
      schema: z.object({}),
    },
  )

  const allocationTool = tool(
    async ({ asset_type }) => {
      const allocations: Record<string, string> = {
        股票: '40%',
        债券: '30%',
        现金: '10%',
        另类投资: '20%',
      }
      const result = allocations[asset_type] ?? `未找到${asset_type}的配置信息`
      console.log(`[工具调用] 查询${asset_type}配置: ${result}`)
      return `${asset_type}在投资组合中的配置比例为: ${result}`
    },
    {
      name: 'query_portfolio_allocation',
      description: '查询客户组合中某类资产的配置比例。asset_type 如 股票、债券、现金、另类投资。',
      schema: z.object({
        asset_type: z.string().describe('资产类型'),
      }),
    },
  )

  const newsTool = tool(
    async () => {
      const result = [
        '最新市场动态:',
        '- 央行维持利率不变，市场预期稳定',
        '- 科技板块持续走强，半导体行业领涨',
        '- 外资连续三日净流入 A 股市场',
      ].join('\n')
      console.log(`[工具调用] ${result}`)
      return result
    },
    {
      name: 'query_market_news',
      description: '查询模拟的最新市场新闻',
      schema: z.object({}),
    },
  )

  return [indexTool, allocationTool, newsTool]
}
