/**
 * @file 知识库版本 diff 与检索评测
 * @description 运行：`npm run kb-version`
 */
import 'dotenv/config'

import { evaluateVersion, recommend } from './retrieve'
import { knowledgeV1, knowledgeV2, testQueries } from './sample'
import { createVersion, diffVersions } from './versions'

async function main() {
  console.log('=== 知识库版本管理与性能比较（滨江乐园） ===\n')

  const v1 = createVersion(knowledgeV1, 'v1.0', '基础版本')
  const v2 = createVersion(knowledgeV2, 'v2.0', '增强版本')

  console.log('功能1: 创建知识库版本')
  console.log('版本1信息:')
  console.log(`  版本名: ${v1.name}`)
  console.log(`  描述: ${v1.description}`)
  console.log(`  知识切片数量: ${v1.statistics.totalChunks}`)
  console.log(`  平均切片长度: ${v1.statistics.averageChunkLength.toFixed(0)}字符`)
  console.log('\n版本2信息:')
  console.log(`  版本名: ${v2.name}`)
  console.log(`  描述: ${v2.description}`)
  console.log(`  知识切片数量: ${v2.statistics.totalChunks}`)
  console.log(`  平均切片长度: ${v2.statistics.averageChunkLength.toFixed(0)}字符`)

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('功能2: 版本差异比较')
  const diff = diffVersions(v1, v2)
  console.log(`  新增知识切片: ${diff.added.length}个`)
  console.log(`  删除知识切片: ${diff.removed.length}个`)
  console.log(`  修改知识切片: ${diff.modified.length}个`)
  console.log('\n新增的知识切片:')
  diff.added.forEach((chunk, index) => {
    console.log(`  ${index + 1}. ID: ${chunk.id}`)
    console.log(`     内容: ${chunk.content}`)
  })
  console.log('\n修改的知识切片:')
  diff.modified.forEach((chunk, index) => {
    console.log(`  ${index + 1}. ID: ${chunk.id}`)
    console.log(`     旧内容: ${chunk.oldContent}`)
    console.log(`     新内容: ${chunk.newContent}`)
  })

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('功能3: 版本性能评估')
  const perf1 = await evaluateVersion(v1, testQueries)
  const perf2 = await evaluateVersion(v2, testQueries)
  console.log(`检索方式: ${perf1.mode === 'embedding' ? '百炼 embedding 余弦' : '字面重叠（未配 DASHSCOPE_API_KEY）'}`)
  console.log('\n版本1性能:')
  console.log(`  准确率: ${(perf1.accuracy * 100).toFixed(1)}%`)
  console.log(`  平均响应时间: ${(perf1.avgResponseTime * 1000).toFixed(1)}ms`)
  console.log('\n版本2性能:')
  console.log(`  准确率: ${(perf2.accuracy * 100).toFixed(1)}%`)
  console.log(`  平均响应时间: ${(perf2.avgResponseTime * 1000).toFixed(1)}ms`)

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('功能4: 性能比较与建议')
  console.log(
    `  准确率提升: ${((perf2.accuracy - perf1.accuracy) * 100).toFixed(1)}%`,
  )
  console.log(
    `  响应时间变化: ${((perf1.avgResponseTime - perf2.avgResponseTime) * 1000).toFixed(1)}ms`,
  )
  console.log(
    `  建议: ${recommend(perf1.accuracy, perf2.accuracy, perf1.avgResponseTime, perf2.avgResponseTime)}`,
  )

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('功能5: 回归测试（v2.0）')
  console.log(`  测试通过率: ${(perf2.accuracy * 100).toFixed(1)}%`)
  console.log(`  测试用例数量: ${perf2.rows.length}`)
  perf2.rows.forEach((row, index) => {
    console.log(`  ${index + 1}. ${row.query} ${row.passed ? '通过' : '未通过'}`)
  })
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
