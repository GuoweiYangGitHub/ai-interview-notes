/**
 * 混合式投顾演示。运行：npm run agent:hybrid
 */
import 'dotenv/config'

import { runWealthAdvisor } from './graph'
import { customerProfile } from './sample'

const QUERIES = [
  '今天上证指数的表现如何？',
  '根据当前市场情况，我应该如何调整投资组合以应对可能的经济放缓？',
]

async function main() {
  console.log('=== 混合式智能体：财富投顾 ===\n')
  for (const query of QUERIES) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`问题: ${query}`)
    const result = await runWealthAdvisor(query, customerProfile)
    console.log(`处理模式: ${result.processingMode ?? '-'}`)
    console.log(`查询类型: ${result.queryType ?? '-'}`)
    console.log('\n回答:')
    console.log(result.finalResponse ?? '无')
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
