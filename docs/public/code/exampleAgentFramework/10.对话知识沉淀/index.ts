/**
 * @file 从客服对话提取知识并沉淀
 * @description 运行：`npm run kb-extract`
 */
import 'dotenv/config'

import { batchExtract, extractKnowledge, mergeSimilarKnowledge } from './extract'
import { sampleConversations } from './sample'

async function main() {
  console.log('=== 对话知识提取与沉淀（滨江乐园） ===\n')

  console.log('示例1: 从单次对话中提取知识')
  console.log(`对话内容:\n${sampleConversations[0]}\n`)
  const first = await extractKnowledge(sampleConversations[0])
  console.log('提取的知识点:')
  first.extracted_knowledge.forEach((item, index) => {
    console.log(`  ${index + 1}. 类型: ${item.knowledge_type}`)
    console.log(`     内容: ${item.content}`)
    console.log(`     置信度: ${item.confidence}`)
    console.log(`     分类: ${item.category}`)
  })
  console.log(`\n对话摘要: ${first.conversation_summary}`)
  console.log(`用户意图: ${first.user_intent}`)

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('示例2: 批量提取知识')
  const { items, frequency } = await batchExtract(sampleConversations)
  console.log(`总共提取了 ${items.length} 个知识点\n`)
  console.log('频次统计:')
  const ranked = [...frequency.entries()].sort((a, b) => b[1] - a[1])
  for (const [key, count] of ranked) {
    console.log(`  ${key}: ${count}次`)
  }

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('示例3: 合并相似知识（先丢掉需求和问题）')
  const merged = await mergeSimilarKnowledge(items)
  console.log(`合并后剩余 ${merged.length} 个知识点\n`)
  merged.forEach((item, index) => {
    console.log(`  ${index + 1}. 类型: ${item.knowledge_type}`)
    console.log(`     内容: ${item.content}`)
    console.log(`     频率: ${item.frequency}次`)
    console.log(`     置信度: ${item.confidence}`)
    console.log(`     分类: ${item.category}`)
    console.log(`     关键词: ${item.keywords.join(', ')}`)
    console.log(`     来源: ${item.sources.join(', ')}`)
    console.log()
  })
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
