/**
 * @file 模型接入
 * @description 密钥只停在这一层。默认百炼 Token Plan。
 */
import OpenAI from 'openai'

export function createClient() {
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
