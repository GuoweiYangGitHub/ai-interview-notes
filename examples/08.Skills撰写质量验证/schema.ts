/**
 * @file 输出契约
 * @description select 的路由判断、score 的七维打分都从这份 Schema 长出来。
 */
import { z } from 'zod'

/** 七个语义维度，顺序与 skill-semantic-review 一致。 */
export const DIMENSION_NAMES = [
  '1 触发语义',
  '2 知识增量',
  '3 可执行性',
  '4 边界与反例',
  '5 自由度匹配',
  '6 披露与资源调用信号',
  '7 本体表述语义',
] as const

export const DimensionNameSchema = z.enum(DIMENSION_NAMES)

/** 单维合格线 3 分；总分 23 分起算通过。 */
export const DIM_PASS_SCORE = 3
export const PASS_SCORE = 23
export const TOTAL_SCORE_MAX = 35

/** 模型对每一张决策卡的是否选用判断。 */
export const JudgementSchema = z.object({
  skill_id: z.string().min(1).describe('必须是决策卡里出现过的 skill_id'),
  selected: z.boolean().describe('这条用户指令该不该加载这个 skill'),
  reason: z.string().min(1).describe('中文理由'),
})

export const SelectionResultSchema = z.object({
  judgements: z.array(JudgementSchema).min(1),
})

export type SelectionResult = z.infer<typeof SelectionResultSchema>

/** 未命中时的相关性诊断，只解释、不改 select 判定。 */
export const DiagnosisSchema = z.object({
  relevance: z.enum(['none', 'weak', 'strong']),
  evidence_in_request: z.array(z.string()),
  missing_in_description: z.array(z.string()),
  suggested_trigger_terms: z.array(z.string()),
})

export type Diagnosis = z.infer<typeof DiagnosisSchema>

export const DimensionScoreSchema = z.object({
  name: DimensionNameSchema,
  score: z.number().int().min(1).max(5),
  basis: z.string().min(1).describe('一句话依据，必须能指到原文'),
})

export const ScoreIssueSchema = z.object({
  dimension: z.string().min(1),
  problem: z.string().min(1),
  quote: z.string().min(1).describe('引用原句；指不到就不要写这条'),
  why: z.string().min(1),
  rewrite: z.string().min(1).describe('可直接粘贴的替换文本'),
})

export const ScoreReportSchema = z.object({
  dimensions: z.array(DimensionScoreSchema).length(7),
  total_score: z.number().int().min(0).max(TOTAL_SCORE_MAX),
  conclusion: z.string().min(1),
  issues: z.array(ScoreIssueSchema).max(5),
})

export type ScoreReport = z.infer<typeof ScoreReportSchema>

/**
 * 把路由契约说给模型听。
 *
 * @returns 写入 user 消息的字段说明
 */
export function describeSelectionContract(): string {
  return [
    '只返回一个 JSON 对象，不要 markdown。字段必须长这样：',
    '- judgements: { skill_id: string, selected: boolean, reason: string }[]',
    '必须对 decision_cards 里每一个 skill_id 给一条判断，不能编造卡片之外的 id。',
    '形状示例：',
    JSON.stringify(
      {
        judgements: [
          {
            skill_id: 'docx',
            selected: true,
            reason: '用户要写 Word 文档，description 覆盖了 .docx 与 Word。',
          },
        ],
      },
      null,
      2,
    ),
  ].join('\n')
}

/**
 * 把七维打分契约说给模型听。
 *
 * @returns 写入 user 消息的字段说明
 */
export function describeScoreContract(): string {
  return [
    '只返回一个 JSON 对象，不要 markdown。字段必须长这样：',
    '- dimensions: 恰好 7 项，name 只能是以下之一，score 是 1-5 的整数，basis 是能指到原文的一句话',
    `  ${DIMENSION_NAMES.join(' / ')}`,
    '- total_score: 七维得分之和，0-35 的整数',
    '- conclusion: 一句话总评，点出最大优点与最大问题',
    '- issues: 最多 5 条，按影响排序；每条含 dimension / problem / quote / why / rewrite',
    '不要把 YAML、name 字符范围、正文行数算进分数。3 分是单维合格线，不是失败。',
    '形状示例：',
    JSON.stringify(
      {
        dimensions: DIMENSION_NAMES.map((name, index) => ({
          name,
          score: index === 0 ? 2 : 3,
          basis: '依据必须引用原文中的具体句子。',
        })),
        total_score: 20,
        conclusion: 'docx-writer：能触发写 Word，但 description 太短、正文没有坑。总分 20/35。',
        issues: [
          {
            dimension: '1 触发语义',
            problem: 'description 只有正向一句，没有反向边界。',
            quote: '当用户需要写 Docx 文档时使用。',
            why: '相邻任务（PDF、表格）也会被误拉进来。',
            rewrite:
              '当用户要创建或编辑 .docx / Word 文档时使用。不要用于 PDF、电子表格或与文档生成无关的编程任务。',
          },
        ],
      },
      null,
      2,
    ),
  ].join('\n')
}
