/**
 * @file 04. 管理 Agent 的行动能力
 * @description 同一问题先装载子集再装载全量。运行：`npm run 04`
 */
import 'dotenv/config'

import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { createCatalog } from './catalog'
import { createClient } from './client'

const QUESTION = '李四在团队里是什么角色？用工具查，不要猜。'

/**
 * 只把指定工具交给模型，问同一句「李四是什么角色」。
 *
 * @param names 本次 `load` 的工具名
 * @returns 装载列表、是否发生调用、observation、终答
 */
async function askWithLoaded(names: string[]) {
  const registry = createCatalog()
  const loaded = registry.load(names)
  const { client, model } = createClient()

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: '只能使用当前提供的工具。没有合适工具就说明缺能力。',
    },
    { role: 'user', content: QUESTION },
  ]

  const first = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages,
    tools: registry.toOpenAITools(),
  })
  const message = first.choices[0]?.message
  if (!message) {
    throw new Error('模型没有返回 message')
  }
  messages.push(message)

  const call = message.tool_calls?.[0]
  if (!call || call.type !== 'function') {
    return {
      loaded,
      toolCall: null,
      observation: null,
      answer: message.content ?? '当前装载的工具无法完成查询',
    }
  }

  const args = JSON.parse(call.function.arguments || '{}')
  const observation = registry.call(call.function.name, args)
  messages.push({
    role: 'tool',
    tool_call_id: call.id,
    content: JSON.stringify(observation),
  })

  const second = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages,
  })

  return {
    loaded,
    toolCall: { name: call.function.name },
    observation,
    answer: second.choices[0]?.message.content,
  }
}

/** 对照「只有 echo」与「lookup + echo」两份工具池。 */
async function main() {
  console.log('=== load subset: echo_status only ===')
  console.log(JSON.stringify(await askWithLoaded(['echo_status']), null, 2))
  console.log('\n=== load all ===')
  console.log(
    JSON.stringify(
      await askWithLoaded(['lookup_member', 'echo_status']),
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
