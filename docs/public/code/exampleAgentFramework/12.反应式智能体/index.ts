/**
 * 反应式私募问答演示。运行：npm run agent:reactive
 */
import 'dotenv/config'

import { askFundQa } from './agent'

const QUESTIONS = [
  '私募基金的合格投资者标准是什么？',
  '私募基金管理人的风险准备金怎么计提？',
  '私募基金能不能向不特定对象公开宣传推介？',
]

async function main() {
  console.log('=== 反应式智能体：私募规则问答 ===\n')
  for (const question of QUESTIONS) {
    console.log(`\n=== ${question} ===`)
    console.log(await askFundQa(question))
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
