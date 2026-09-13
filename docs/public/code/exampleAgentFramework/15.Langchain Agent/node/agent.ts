/**
 * 最小 createAgent：一件模拟天气工具。
 */
import { createAgent, tool } from 'langchain'
import { z } from 'zod'

import { createChatModel } from './client'

const getWeather = tool(
  async ({ city }) => `${city}：晴，26°C`,
  {
    name: 'get_weather',
    description: '查询指定城市的天气。',
    schema: z.object({
      city: z.string().describe('城市名，例如杭州'),
    }),
  },
)

export function createWeatherAgent() {
  return createAgent({
    model: createChatModel(),
    tools: [getWeather],
    systemPrompt: '你是助手。问天气就调用 get_weather，用中文回答。',
  })
}

export function lastText(messages: Array<{ content?: unknown }>): string {
  const last = messages.at(-1)
  const content = last?.content
  if (typeof content === 'string') {
    return content
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part
        }
        if (part && typeof part === 'object' && 'text' in part) {
          return String((part as { text?: string }).text ?? '')
        }
        return ''
      })
      .join('')
  }
  return JSON.stringify(content ?? '')
}

export async function askWeather(question: string): Promise<string> {
  const agent = createWeatherAgent()
  const result = await agent.invoke({
    messages: [{ role: 'user', content: question }],
  })
  return lastText(result.messages as Array<{ content?: unknown }>)
}
