/**
 * @file 验收
 * @description 先 JSON.parse，再交给 Schema。失败只报告，不修补原文。
 */
import type OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import type { z } from 'zod'

export type InspectResult<T> =
  | { jsonParse: 'fail'; shapeCheck: 'not_run'; detail: string }
  | {
      jsonParse: 'pass'
      shapeCheck: 'fail'
      errors: { path: string; message: string }[]
    }
  | { jsonParse: 'pass'; shapeCheck: 'pass'; data: T }

/**
 * 去掉模型偶尔包上的 markdown 围栏，再 JSON.parse。
 *
 * @param rawText 模型返回的原始文本
 */
export function parseJsonText(rawText: string): unknown {
  const trimmed = rawText.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  const text = fenced?.[1]?.trim() ?? trimmed
  return JSON.parse(text)
}

/**
 * 验收模型原文。
 *
 * @param rawText 模型返回的原始字符串
 * @param schema Zod 契约
 */
export function inspectJson<T>(
  rawText: string,
  schema: z.ZodType<T>,
): InspectResult<T> {
  let parsed: unknown
  try {
    parsed = parseJsonText(rawText)
  } catch (error) {
    return {
      jsonParse: 'fail',
      shapeCheck: 'not_run',
      detail: error instanceof Error ? error.message : String(error),
    }
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    return {
      jsonParse: 'pass',
      shapeCheck: 'fail',
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.') || '(root)',
        message: issue.message,
      })),
    }
  }

  return { jsonParse: 'pass', shapeCheck: 'pass', data: result.data }
}

/**
 * 向模型要一份 JSON 文本。语法交给 json_object，形状交给调用方的 Schema。
 *
 * @throws {Error} 模型没有返回文本
 */
export async function requestJson(
  client: OpenAI,
  model: string,
  messages: ChatCompletionMessageParam[],
) {
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages,
  })
  const raw = response.choices[0]?.message.content?.trim()
  if (!raw) {
    throw new Error('模型没有返回可检查的文本')
  }
  return raw
}
