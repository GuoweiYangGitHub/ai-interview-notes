/**
 * @file 模型接入
 * @description 对话/报告走 Token Plan；embedding 只用普通百炼 Key。
 */
import OpenAI from 'openai'

export function createChatClient() {
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
  return {
    client: new OpenAI({
      apiKey,
      baseURL:
        process.env.CHAT_BASE_URL ??
        'https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
    }),
    model: process.env.CHAT_MODEL ?? 'qwen3.8-flash',
  }
}

export function embeddingApiKey(): string | undefined {
  const key = process.env.DASHSCOPE_API_KEY ?? process.env.EMBEDDING_API_KEY
  if (!key || key.startsWith('sk-sp-')) {
    return undefined
  }
  return key
}

export function createEmbeddingClient(): {
  client: OpenAI
  model: string
} | null {
  const apiKey = embeddingApiKey()
  if (!apiKey) {
    return null
  }
  return {
    client: new OpenAI({
      apiKey,
      baseURL:
        process.env.EMBEDDING_BASE_URL ??
        'https://dashscope.aliyuncs.com/compatible-mode/v1',
    }),
    model: process.env.EMBEDDING_MODEL ?? 'text-embedding-v3',
  }
}
