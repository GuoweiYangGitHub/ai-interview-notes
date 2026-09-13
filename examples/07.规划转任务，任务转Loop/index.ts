/**
 * @file 07. 规划转任务，任务转 Loop
 * @description Plan → 程序编号的任务板 → 循环回填。运行：`npm run 07`
 */
import 'dotenv/config'

import { BRIEF } from './brief'
import { buildBoard } from './board'
import { createClient } from './client'
import { runConvergence } from './loop'
import { buildPlan } from './plan'

/** 三阶段顺序跑完并打印 brief / plan / board / loop。 */
async function main() {
  const { client, model } = createClient()

  console.log('=== brief ===')
  console.log(BRIEF)

  const plan = await buildPlan(client, model)
  console.log('\n=== plan ===')
  console.log(JSON.stringify(plan, null, 2))

  const board = await buildBoard(client, model, plan)
  console.log('\n=== board ===')
  console.log(JSON.stringify(board, null, 2))

  const converged = runConvergence(board)
  console.log('\n=== loop ===')
  console.log(JSON.stringify(converged, null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
