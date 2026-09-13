/**
 * @file 03. 模型规划并调用工具
 * @description 先一轮原生 tool call，再跑 ReAct。运行：`npm run 03`
 */
import 'dotenv/config'

import { createClient } from './client'
import { dispatch } from './dispatch'
import { runReactLoop } from './loop'
import { toOpenAITools } from './tools'

const ONCE_TASK =
  '搜索 NVIDIA 2026 年机器人进展的网页候选。只返回发现线索，不要声称已经读过正文。'

const LOOP_TASK = `
从本地资料里找一项 2026 年 NVIDIA 机器人进展。
先搜索候选，再浏览一个页面。
回答包含标题、日期、两条正文事实和来源 URL。
`.trim()

/**
 * 只开放 search_web，完成「命令 → 执行 → 回传 → 终答」一轮。
 *
 * @returns 命令、observation、模型终答
 * @throws {Error} 没有产生 tool_calls
 */
async function runOnce() {
  const { client, model } = createClient()
  const first = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: 'system', content: '你只能通过工具拿线索，不要编造 URL。' },
      { role: 'user', content: ONCE_TASK },
    ],
    tools: toOpenAITools().filter(
      (tool) => tool.function.name === 'search_web',
    ),
  })

  const message = first.choices[0]?.message
  const call = message?.tool_calls?.[0]
  if (!call || call.type !== 'function') {
    throw new Error('一轮调用没有产生 tool_calls')
  }

  const args = JSON.parse(call.function.arguments || '{}')
  const observation = dispatch(call.function.name, args)

  const second = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: '根据 observation 回答。不要声称已核验正文。',
      },
      { role: 'user', content: ONCE_TASK },
      message,
      {
        role: 'tool',
        tool_call_id: call.id,
        content: JSON.stringify(observation),
      },
    ],
  })

  return {
    command: { name: call.function.name, args },
    observation,
    answer: second.choices[0]?.message.content,
  }
}

/** 先打印一轮调用，再打印需要搜+读的循环。 */
async function main() {
  console.log('=== once: native tool call ===')
  console.log(JSON.stringify(await runOnce(), null, 2))

  const { client, model } = createClient()
  console.log('\n=== react loop ===')
  const result = await runReactLoop(client, model, LOOP_TASK)
  console.log(
    JSON.stringify({ finish: result.finish, trace: result.trace }, null, 2),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
