/**
 * 深思熟虑投研演示。运行：npm run agent:deliberative
 */
import 'dotenv/config'

import { runResearchAgent } from './graph'

async function main() {
  console.log('=== 深思熟虑智能体：智能投研 ===\n')
  const result = await runResearchAgent(
    '半导体中期配置机会',
    '晶圆制造、设备、设计',
    '中期',
  )
  console.log('\n=== 阶段摘要 ===')
  console.log(`市场状态: ${result.worldModel?.market_state ?? '-'}`)
  console.log(
    `候选方案: ${(result.reasoningPlans ?? []).map((plan) => plan.plan_id).join(', ') || '-'}`,
  )
  console.log(`选中方案: ${result.selectedPlan?.selected_plan_id ?? '-'}`)
  console.log(`投资建议: ${result.selectedPlan?.recommendation ?? '-'}`)
  console.log('\n=== 研究报告（节选） ===\n')
  const report = result.finalReport ?? '未生成报告'
  console.log(report.length > 1800 ? `${report.slice(0, 1800)}\n…` : report)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
