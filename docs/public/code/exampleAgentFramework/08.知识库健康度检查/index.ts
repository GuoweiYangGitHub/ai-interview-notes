/**
 * @file 知识库健康度检查
 * @description 缺知识 / 过期 / 冲突三次结构化检查，再加权打分。运行：`npm run kb-health`
 */
import 'dotenv/config'

import { generateHealthReport } from './checker'
import { knowledgeBase, testQueries } from './sample'

function percent(score: number): string {
  return `${(score * 100).toFixed(1)}%`
}

async function main() {
  console.log('=== 知识库健康度检查（滨江乐园演示库） ===\n')
  const report = await generateHealthReport(knowledgeBase, testQueries)

  console.log('=== 知识库健康度报告 ===\n')
  console.log(`整体健康度评分: ${report.overallHealthScore.toFixed(2)}`)
  console.log(`健康等级: ${report.healthLevel}`)
  console.log(`检查时间: ${report.checkDate}`)
  console.log(`\n${'='.repeat(60)}\n`)

  console.log('=== 详细分析 ===\n')
  console.log('1. 缺少的知识分析:')
  console.log(`   覆盖率: ${percent(report.missing.coverage_score)}`)
  console.log(`   缺少知识点数量: ${report.missing.missing_knowledge.length}`)
  for (const [index, item] of report.missing.missing_knowledge
    .slice(0, 3)
    .entries()) {
    console.log(`   ${index + 1}. 查询: ${item.query}`)
    console.log(`      缺少方面: ${item.missing_aspect}`)
    console.log(`      重要性: ${item.importance}`)
  }

  console.log(`\n${'-'.repeat(40)}\n`)
  console.log('2. 过期的知识分析:')
  console.log(`   新鲜度评分: ${report.outdated.freshness_score.toFixed(2)}`)
  console.log(`   过期知识点数量: ${report.outdated.outdated_knowledge.length}`)
  for (const [index, item] of report.outdated.outdated_knowledge
    .slice(0, 3)
    .entries()) {
    console.log(`   ${index + 1}. 切片ID: ${item.chunk_id}`)
    console.log(`      过期方面: ${item.outdated_aspect}`)
    console.log(`      严重程度: ${item.severity}`)
  }

  console.log(`\n${'-'.repeat(40)}\n`)
  console.log('3. 冲突的知识分析:')
  console.log(`   一致性评分: ${report.conflicting.consistency_score.toFixed(2)}`)
  console.log(
    `   冲突数量: ${report.conflicting.conflicting_knowledge.length}`,
  )
  for (const [index, item] of report.conflicting.conflicting_knowledge
    .slice(0, 3)
    .entries()) {
    console.log(`   ${index + 1}. 冲突类型: ${item.conflict_type}`)
    console.log(`      相关切片: ${item.chunk_ids.join(', ')}`)
    console.log(`      严重程度: ${item.severity}`)
  }

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('=== 改进建议 ===\n')
  for (const [index, item] of report.recommendations.entries()) {
    console.log(`${index + 1}. ${item}`)
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
