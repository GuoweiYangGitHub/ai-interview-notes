/**
 * @file 05. MCP 协议融入 Agent
 * @description list → 桥接 → 模型调工具 → 终答。运行：`npm run 05`
 */
import 'dotenv/config'

import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { bridgeTools, toOpenAITools } from './bridge'
import { createClient } from './client'
import { connectMcp } from './mcpClient'

const QUESTION = '查一份和 MCP 或工具协议有关的报告，读详情后用三句话总结。'

/**
 * 拉起 server，列出工具，让模型搜报告并总结。
 *
 * @throws {Error} 未桥接的工具名，或步数内没有终答
 */
async function main() {
  const mcp = connectMcp()
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const listed = await mcp.listTools()
    const actions = bridgeTools(listed, (name, args) =>
      mcp.callTool(name, args),
    )
    console.log('=== mcp tools/list ===')
    console.log(
      JSON.stringify(
        listed.map((tool) => tool.name),
        null,
        2,
      ),
    )

    const { client, model } = createClient()
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: '先搜索报告候选，再按 report_id 读详情。不要编造编号。',
      },
      { role: 'user', content: QUESTION },
    ]

    for (let step = 0; step < 4; step += 1) {
      const response = await client.chat.completions.create({
        model,
        temperature: 0.2,
        messages,
        tools: toOpenAITools(actions),
      })
      const message = response.choices[0]?.message
      if (!message) {
        throw new Error('模型没有返回 message')
      }
      messages.push(message)
      const calls = message.tool_calls ?? []
      if (calls.length === 0) {
        console.log('=== answer ===')
        console.log(message.content)
        return
      }
      for (const call of calls) {
        if (call.type !== 'function') continue
        const args = JSON.parse(call.function.arguments || '{}')
        const action = actions.find((item) => item.name === call.function.name)
        if (!action) {
          throw new Error(`未桥接工具：${call.function.name}`)
        }
        const observation = await action.execute(args)
        console.log(`=== call ${call.function.name} ===`)
        console.log(JSON.stringify({ args, observation }, null, 2))
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(observation),
        })
      }
    }
    throw new Error('未在步数内得到终答')
  } finally {
    mcp.close()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
