/**
 * @file 验收
 * @description 先 JSON.parse，再交给 Schema。失败只报告，不修补原文。
 */
import { MeetingMinutesSchema, type MeetingMinutes } from './schema'

/**
 * 语法检查与形状检查的分开结果。
 * `shapeCheck` 为 `not_run` 表示 JSON 都没过，不必看字段。
 */
export type InspectResult =
  | { jsonParse: 'fail'; shapeCheck: 'not_run'; detail: string }
  | {
      jsonParse: 'pass'
      shapeCheck: 'fail'
      errors: { path: string; message: string }[]
    }
  | { jsonParse: 'pass'; shapeCheck: 'pass'; data: MeetingMinutes }

/**
 * 验收模型原文。
 *
 * @param rawText 模型返回的原始字符串
 * @returns 语法失败、形状失败或带 typed `data` 的通过结果
 */
export function inspect(rawText: string): InspectResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawText)
  } catch (error) {
    return {
      jsonParse: 'fail',
      shapeCheck: 'not_run',
      detail: error instanceof Error ? error.message : String(error),
    }
  }

  const result = MeetingMinutesSchema.safeParse(parsed)
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
