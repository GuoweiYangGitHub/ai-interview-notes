/**
 * @file 模型接入
 * @description 密钥只停在这一层。
 */
import OpenAI from 'openai'

/**
 * 创建 OpenAI 兼容客户端。
 *
 * @returns 业务层只用 `{ client, model }`
 * @throws {Error} 未配置 API Key
 */
export function createClient() {
  const apiKey =
    process.env.BAILIAN_TOKEN_PLAN_API_KEY ??
    process.env.DEEPSEEK_API_KEY ??
    process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error(
      '请先在 .env 中配置 BAILIAN_TOKEN_PLAN_API_KEY、DEEPSEEK_API_KEY 或 OPENAI_API_KEY',
    )
  }

  return {
    client: new OpenAI({
      apiKey,
      baseURL:
        process.env.CHAT_BASE_URL ??
        process.env.DEEPSEEK_BASE_URL ??
        process.env.OPENAI_BASE_URL ??
        'https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
    }),
    model:
      process.env.CHAT_MODEL ??
      process.env.DEEPSEEK_MODEL ??
      process.env.OPENAI_MODEL ??
      'qwen3.8-flash',
  }
}
