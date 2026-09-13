/**
 * LangChain 模型接入。密钥只停在这一层。
 */
import { ChatOpenAI } from '@langchain/openai'

export function createChatModel(temperature = 0.2) {
  const apiKey =
    process.env.BAILIAN_TOKEN_PLAN_API_KEY ??
    process.env.DASHSCOPE_API_KEY ??
    process.env.DEEPSEEK_API_KEY ??
    process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error(
      '请先在 .env 中配置 BAILIAN_TOKEN_PLAN_API_KEY 或 DASHSCOPE_API_KEY',
    )
  }

  return new ChatOpenAI({
    model: process.env.CHAT_MODEL ?? 'qwen3.8-flash',
    temperature,
    apiKey,
    configuration: {
      baseURL:
        process.env.CHAT_BASE_URL ??
        'https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
    },
  })
}
