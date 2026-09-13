/**
 * @file 问题生成 + BM25 原文检索 vs 问题检索
 * @description 运行：`npm run kb-bm25`
 */
import 'dotenv/config'

import { generateDiverseQuestions, generateQuestions } from './generate'
import { DualBm25, evaluateRetrieval } from './retrieve'
import { knowledgeBase, testQueries } from './sample'

function rate(flags: boolean[]): string {
  if (flags.length === 0) {
    return '0.0%'
  }
  return `${((flags.filter(Boolean).length / flags.length) * 100).toFixed(1)}%`
}

async function main() {
  console.log('=== 问题生成与 BM25 检索（滨江乐园） ===\n')

  const first = knowledgeBase[0]
  console.log('示例1: 为知识切片生成多样化问题')
  console.log(`知识内容: ${first.content}`)
  const five = await generateQuestions(first.content, 5)
  console.log('\n生成的 5 个问题:')
  five.forEach((item, index) => {
    console.log(
      `  ${index + 1}. ${item.question} (类型: ${item.question_type}, 难度: ${item.difficulty})`,
    )
  })

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('示例2: 生成更多样化的问题（8 个）')
  const eight = await generateDiverseQuestions(first.content, 8)
  eight.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.question}`)
    console.log(
      `     类型: ${item.question_type}, 难度: ${item.difficulty}, 角度: ${item.perspective ?? '-'}, 能否回答: ${item.is_answerable ?? '-'}`,
    )
    if (item.answer) {
      console.log(`     答案: ${item.answer}`)
    }
  })

  console.log(`\n${'='.repeat(60)}\n`)
  console.log('示例3: 评估原文 BM25 vs 问题 BM25')
  console.log('正在为知识库生成问题...')
  for (const chunk of knowledgeBase) {
    chunk.generatedQuestions = await generateQuestions(chunk.content, 5)
  }
  console.log('为知识库生成问题完毕')

  const store = new DualBm25()
  store.build(knowledgeBase)
  const details = evaluateRetrieval(store, testQueries)

  console.log(`测试查询数量: ${details.length}`)
  console.log(`BM25 原文检索准确率: ${rate(details.map((row) => row.contentCorrect))}`)
  console.log(
    `BM25 问题检索准确率: ${rate(details.map((row) => row.questionCorrect))}`,
  )
  console.log(
    `问题检索改进的查询数量: ${details.filter((row) => row.improved).length}`,
  )

  console.log('\n=== 详细分析 ===')
  for (const row of details) {
    const diff = row.questionScore - row.contentScore
    console.log(`  查询: ${row.query}`)
    console.log(
      `     原文: ${row.contentChunkId ?? '-'} ${row.contentCorrect ? '命中' : '未命中'} 分数 ${row.contentScore.toFixed(3)}`,
    )
    console.log(
      `     问题: ${row.questionChunkId ?? '-'} ${row.questionCorrect ? '命中' : '未命中'} 分数 ${row.questionScore.toFixed(3)} 差 ${diff >= 0 ? '+' : ''}${diff.toFixed(3)}`,
    )
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
