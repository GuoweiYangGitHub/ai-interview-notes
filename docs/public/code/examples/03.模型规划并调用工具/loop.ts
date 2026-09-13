/**
 * @file ReAct 循环
 * @description 选择 → 执行 → 观察 → 再选择，直到没有 tool_calls 或达到 maxSteps。
 */
import type OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { dispatch } from './dispatch'
import { toOpenAITools } from './tools'

/** 一轮循环的可观测记录。 */
export type TraceEntry = {
  step: number
  tool?: string
  args?: unknown
  observation?: unknown
  finish?: string
}

/**
 * 跑到模型不再要工具，或超过步数。
 *
 * @param client OpenAI 兼容客户端
 * @param model 模型名
 * @param task 用户任务
 * @param maxSteps 最大循环次数，默认 4
 * @returns 终答、trace、完整 messages
 * @throws {Error} 无 message 或超过 maxSteps
 */
export async function runReactLoop(
  client: OpenAI,
  model: string,
  task: string,
  maxSteps = 4,
) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        '你用工具收集证据再回答。先 search_web，再 browse_page 打开一条候选。不要假装已经读过正文。',
    },
    { role: 'user', content: task },
  ]
  const trace: TraceEntry[] = []

  for (let step = 1; step <= maxSteps; step += 1) {
    const response = await client.chat.completions.create({
      model,
      temperature: 0.2,
      messages,
      tools: toOpenAITools(),
    })
    const message = response.choices[0]?.message
    if (!message) {
      throw new Error('模型没有返回 message')
    }
    messages.push(message)

    const calls = message.tool_calls ?? []
    if (calls.length === 0) {
      const finish = message.content?.trim() ?? ''
      trace.push({ step, finish })
      return { finish, trace, messages }
    }

    for (const call of calls) {
      if (call.type !== 'function') continue
      const args = JSON.parse(call.function.arguments || '{}')
      const observation = dispatch(call.function.name, args)
      trace.push({ step, tool: call.function.name, args, observation })
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: JSON.stringify(observation),
      })
    }
  }

  throw new Error(`超过 maxSteps=${maxSteps} 仍未结束`)
}
