/**
 * @file 健康度检查输出契约
 * @description Prompt、校验、下游类型都从这份 Schema 长出来。
 */
import { z } from 'zod'

const Score = z.coerce
  .number()
  .transform((value) => (value > 1 ? value / 100 : value))
  .pipe(z.number().min(0).max(1))
const Severity = z.string().min(1)

export const KnowledgeChunkSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1),
  lastUpdated: z.string().min(1),
})

export const TestQuerySchema = z.object({
  query: z.string().min(1),
  expectedAnswer: z.string().min(1),
})

export const MissingItemSchema = z.object({
  query: z.string().min(1),
  missing_aspect: z.string().min(1),
  importance: Severity,
  suggested_content: z.string().min(1),
  category: z.string().min(1),
})

export const MissingResultSchema = z.object({
  missing_knowledge: z.array(MissingItemSchema),
  coverage_score: Score,
  completeness_analysis: z.string().min(1),
})

export const OutdatedItemSchema = z.object({
  chunk_id: z.string().min(1),
  content: z.string().min(1),
  outdated_aspect: z.string().min(1),
  severity: Severity,
  suggested_update: z.string().min(1),
  last_verified: z.string().min(1),
})

export const OutdatedResultSchema = z.object({
  outdated_knowledge: z.array(OutdatedItemSchema),
  freshness_score: Score,
  update_recommendations: z.string().min(1),
})

function asStringList(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return value
}

export const ConflictItemSchema = z.object({
  conflict_type: z.string().min(1),
  chunk_ids: z.preprocess(asStringList, z.array(z.string().min(1)).min(1)),
  conflicting_content: z.preprocess(
    asStringList,
    z.array(z.string().min(1)).min(1),
  ),
  severity: Severity,
  resolution_suggestion: z.string().min(1),
})

export const ConflictResultSchema = z.object({
  conflicting_knowledge: z.array(ConflictItemSchema),
  consistency_score: Score,
  conflict_analysis: z.string().min(1),
})

export type KnowledgeChunk = z.infer<typeof KnowledgeChunkSchema>
export type TestQuery = z.infer<typeof TestQuerySchema>
export type MissingResult = z.infer<typeof MissingResultSchema>
export type OutdatedResult = z.infer<typeof OutdatedResultSchema>
export type ConflictResult = z.infer<typeof ConflictResultSchema>

export type HealthReport = {
  overallHealthScore: number
  healthLevel: string
  missing: MissingResult
  outdated: OutdatedResult
  conflicting: ConflictResult
  recommendations: string[]
  checkDate: string
}

function jsonExample(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

export function describeMissingContract(): string {
  return [
    '只返回一个 JSON 对象，不要 markdown。字段必须长这样：',
    '- missing_knowledge: { query, missing_aspect, importance, suggested_content, category }[]',
    '- coverage_score: 0 到 1 的数字',
    '- completeness_analysis: string',
    'importance 用 高 / 中 / 低。能回答的查询不要放进 missing_knowledge。',
    '形状示例：',
    jsonExample({
      missing_knowledge: [
        {
          query: '停车费是多少？',
          missing_aspect: '停车场收费标准',
          importance: '中',
          suggested_content: '补充白天/夜间停车单价与封顶价',
          category: '交通',
        },
      ],
      coverage_score: 0.67,
      completeness_analysis: '位置和票价有覆盖，停车与活动缺失。',
    }),
  ].join('\n')
}

export function describeOutdatedContract(): string {
  return [
    '只返回一个 JSON 对象，不要 markdown。字段必须长这样：',
    '- outdated_knowledge: { chunk_id, content, outdated_aspect, severity, suggested_update, last_verified }[]',
    '- freshness_score: 0 到 1 的数字',
    '- update_recommendations: string',
    'severity 用 高 / 中 / 低。对照当前日期判断票价、政策、活动是否过期。',
    '形状示例：',
    jsonExample({
      outdated_knowledge: [
        {
          chunk_id: 'kb_002',
          content: '门票平日成人 399 元',
          outdated_aspect: '票价 last_updated 过旧',
          severity: '高',
          suggested_update: '按最新官方票价重核并更新日期',
          last_verified: '2023-12-01',
        },
      ],
      freshness_score: 0.6,
      update_recommendations: '重核 2023 年票价切片。',
    }),
  ].join('\n')
}

export function describeConflictContract(): string {
  return [
    '只返回一个 JSON 对象，不要 markdown。字段必须长这样：',
    '- conflicting_knowledge: { conflict_type, chunk_ids, conflicting_content, severity, resolution_suggestion }[]',
    '- consistency_score: 0 到 1 的数字',
    '- conflict_analysis: string',
    'severity 用 高 / 中 / 低。同一主题两套数字或规则即冲突。',
    '形状示例：',
    jsonExample({
      conflicting_knowledge: [
        {
          conflict_type: '门票价格',
          chunk_ids: ['kb_002', 'kb_003'],
          conflicting_content: ['平日成人 399 元', '平日成人 350 元'],
          severity: '高',
          resolution_suggestion: '只保留一条官方票价并删除另一条',
        },
      ],
      consistency_score: 0.5,
      conflict_analysis: 'kb_002 与 kb_003 票价不一致。',
    }),
  ].join('\n')
}
