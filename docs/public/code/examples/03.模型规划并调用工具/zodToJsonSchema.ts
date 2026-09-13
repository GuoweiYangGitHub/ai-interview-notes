/**
 * @file Zod → JSON Schema 子集
 * @description 只够填 OpenAI `tools.parameters`，不是完整 JSON Schema。
 */
import type { z } from 'zod'

/**
 * 把 Zod object 收成 tools.parameters。
 *
 * @param schema 工具参数的 Zod object
 * @returns `{ type, properties, required, additionalProperties }`
 */
export function zodToJsonSchema(schema: z.ZodObject<z.ZodRawShape>) {
  const shape = schema.shape
  const properties: Record<string, { type: string; description?: string }> = {}
  const required: string[] = []

  for (const [key, value] of Object.entries(shape)) {
    const description = value.description
    properties[key] = {
      type: 'string',
      ...(description ? { description } : {}),
    }
    if (!value.isOptional()) {
      required.push(key)
    }
  }

  return {
    type: 'object' as const,
    properties,
    required,
    additionalProperties: false,
  }
}
