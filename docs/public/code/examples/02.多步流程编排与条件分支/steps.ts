/**
 * @file 流程节点
 * @description 分段 → 提取 → 过滤纯讨论 → 合并。
 */
import type OpenAI from 'openai'
import { markMissing } from './branch'
import {
  ActionExtractionSchema,
  type ActionItem,
  type TrackedAction,
} from './schema'

/** 一段待提取的会议原文。 */
export type Segment = { segmentId: number; text: string }

/**
 * 按空行切成段落。
 *
 * @param transcript 完整会议原文
 * @returns 从 1 起编号的段落列表
 */
export function splitTranscript(transcript: string): Segment[] {
  return transcript
    .split(/\n\n+/)
    .map((text) => text.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((text, index) => ({ segmentId: index + 1, text }))
}

/**
 * 丢掉没有 task 的空项（纯讨论应已是空数组）。
 *
 * @param actions 某段提取结果
 * @returns 仍可执行的行动项
 */
export function filterDiscussionOnly(actions: ActionItem[]): ActionItem[] {
  return actions.filter((item) => item.task.trim().length > 0)
}

/**
 * 合并各段结果并走 {@link markMissing} 分支。
 *
 * @param batches 按段落分组的提取结果
 * @returns 带状态的待办列表
 */
export function mergeActions(
  batches: { segmentId: number; actions: ActionItem[] }[],
): TrackedAction[] {
  return batches.flatMap((batch) =>
    filterDiscussionOnly(batch.actions).map((item) =>
      markMissing(item, batch.segmentId),
    ),
  )
}

/**
 * 对单段原文做一次结构化提取。
 *
 * @param client OpenAI 兼容客户端
 * @param model 模型名
 * @param segment 当前段落
 * @returns 该段的行动项
 * @throws {Error} 无文本或未通过契约
 */
export async function extractSegment(
  client: OpenAI,
  model: string,
  segment: Segment,
): Promise<ActionItem[]> {
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          '你提取会议行动项。只使用原文。纯讨论或未形成决定时 actions 为空数组。',
      },
      {
        role: 'user',
        content: [
          '返回 JSON：{ "actions": [{ "task": string, "owner": string | null, "deadline": string | null }] }',
          '原文没有负责人或截止日期时填 null，不要猜。',
          '',
          segment.text,
        ].join('\n'),
      },
    ],
  })

  const raw = response.choices[0]?.message.content?.trim()
  if (!raw) {
    throw new Error(`段落 ${segment.segmentId} 没有返回文本`)
  }

  const parsed = ActionExtractionSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    throw new Error(
      `段落 ${segment.segmentId} 未通过契约：${parsed.error.message}`,
    )
  }
  return parsed.data.actions
}
