/**
 * @file 输出契约
 * @description Prompt、校验、下游类型都从这份 Schema 长出来。只说“返回 JSON”没有契约。
 */
import { z } from 'zod'

/** 一条可回指原文的证据。 */
export const EvidenceSchema = z.object({
  fact: z.string().min(1).describe('从原文归纳的一条事实'),
  sourceExcerpt: z.string().min(1).describe('原文中能直接支持 fact 的短句'),
})

/** 一条可执行待办，owner / deadline 原文没有则为 null。 */
export const ActionItemSchema = z.object({
  task: z.string().min(1).describe('可执行的待办'),
  owner: z.string().nullable().describe('原文写明的负责人；没写则 null'),
  deadline: z.string().nullable().describe('原文写明的截止日期；没写则 null'),
  evidenceIndex: z
    .number()
    .int()
    .min(0)
    .describe('对应 evidence 的下标，从 0 开始'),
})

/** 会议纪要的完整输出形状，是本示例的唯一契约。 */
export const MeetingMinutesSchema = z.object({
  evidence: z.array(EvidenceSchema).min(1),
  actionItems: z.array(ActionItemSchema),
  selfCheck: z.array(z.string()).max(3),
  summary: z.string().min(1),
})

/** 由 {@link MeetingMinutesSchema} 推导的下游类型。 */
export type MeetingMinutes = z.infer<typeof MeetingMinutesSchema>

/**
 * 把契约说给模型听。改字段先改 Schema，再改这段说明，避免两边各写一套。
 *
 * @returns 写入 user 消息的字段说明与一份合法示例 JSON
 */
export function describeOutputContract(): string {
  return [
    '只返回一个 JSON 对象，不要 markdown。字段必须长这样：',
    '- evidence: { fact: string, sourceExcerpt: string }[]，至少 1 条；不要写成字符串数组',
    '- actionItems: { task: string, owner: string | null, deadline: string | null, evidenceIndex: number }[]',
    '- selfCheck: string[]，最多 3 条；不要写成对象或单字符串',
    '- summary: string',
    'owner / deadline 原文没写明时必须是 null，不要猜测。evidenceIndex 从 0 开始，且必须出现。',
    '形状示例：',
    JSON.stringify(
      {
        evidence: [{ fact: '采用方案 B', sourceExcerpt: '会议确认采用方案 B' }],
        actionItems: [
          {
            task: '提交测试版',
            owner: '李四',
            deadline: '8 月 5 日',
            evidenceIndex: 0,
          },
        ],
        selfCheck: ['owner 来自原文', '未写截止日期的项 deadline 为 null'],
        summary: '采用方案 B，李四在 8 月 5 日前交测试版。',
      },
      null,
      2,
    ),
  ].join('\n')
}
