/**
 * @file 每步提取的小契约
 * @description 对齐课04 `common.py` 的 ActionItem / ActionExtraction。
 */
import { z } from 'zod'

/** 一条可独立核对的行动项。 */
export const ActionItemSchema = z.object({
  task: z.string().min(1).describe('可以独立检查是否完成的任务'),
  owner: z.string().nullable().describe('负责人；原文没有时 null'),
  deadline: z.string().nullable().describe('截止时间；原文没有时 null'),
})

/** 一次提取的结果；纯讨论时 `actions` 为空数组。 */
export const ActionExtractionSchema = z.object({
  actions: z
    .array(ActionItemSchema)
    .describe('明确形成的行动项；纯讨论返回空列表'),
})

/** {@link ActionItemSchema} 推导类型。 */
export type ActionItem = z.infer<typeof ActionItemSchema>
/** {@link ActionExtractionSchema} 推导类型。 */
export type ActionExtraction = z.infer<typeof ActionExtractionSchema>

/** 带段落编号与分支状态的待办，供流程状态机保存。 */
export type TrackedAction = ActionItem & {
  segmentId: number
  status: '信息完整' | '待确认'
  missing: string[]
}
