/**
 * @file 先问清再成 Plan
 * @description 对齐课13 step_1_plan，澄清走 {@link PRESET_ANSWERS}。
 */
import type OpenAI from 'openai'
import { z } from 'zod'
import { BRIEF, PRESET_ANSWERS } from './brief'

/** 计划书形状。未就绪时 `outline` 必须是空字符串，不能缺字段或改成数组。 */
export const PlanSchema = z.object({
  goal: z.string().min(1),
  constraints: z.array(z.string()),
  openQuestions: z.array(z.string()).max(3),
  ready: z.boolean(),
  outline: z.string(),
})

/** {@link PlanSchema} 推导类型。 */
export type Plan = z.infer<typeof PlanSchema>

/**
 * 把计划契约说给模型听。`outline` 是正文，不是条目列表。
 *
 * @returns 写入 user 消息的字段说明与合法示例
 */
export function describePlanContract(): string {
  return [
    '只返回一个 JSON 对象，不要 markdown。字段必须长这样：',
    '- goal: string',
    '- constraints: string[]',
    '- openQuestions: string[]，最多 3 条',
    '- ready: boolean',
    '- outline: string。会议方案正文，段落用 \\n 连接。未就绪时用 ""。禁止数组、禁止对象。',
    '形状示例（未就绪）：',
    JSON.stringify(
      {
        goal: '45 分钟复盘，排出本周前 2 项',
        constraints: ['时长 45 分钟', '参会：产品、研发、测试'],
        openQuestions: ['排序规则是什么？'],
        ready: false,
        outline: '',
      },
      null,
      2,
    ),
    '形状示例（已就绪）：',
    JSON.stringify(
      {
        goal: '45 分钟复盘，排出本周前 2 项',
        constraints: ['按风险排序', '会上指定负责人'],
        openQuestions: [],
        ready: true,
        outline:
          '开场对齐目标。先排登录失败用例，再排冻结方案 B 接口。会上指定负责人。',
      },
      null,
      2,
    ),
  ].join('\n')
}

/**
 * 必要时用预设答案补一轮澄清，直到有可执行 outline。
 *
 * @param client OpenAI 兼容客户端
 * @param model 模型名
 * @returns 澄清后的计划
 * @throws {Error} 澄清后仍无 outline
 */
export async function buildPlan(client: OpenAI, model: string): Promise<Plan> {
  const first = await requestPlan(
    client,
    model,
    BRIEF,
    '这是首次生成。如需澄清，最多 2 个问题。未就绪时 outline 用空字符串，不要改成数组。',
  )
  if (
    (first.ready || first.openQuestions.length === 0) &&
    first.outline.trim()
  ) {
    return first
  }

  const answers = first.openQuestions
    .map((question, index) => {
      const matched = Object.entries(PRESET_ANSWERS).find(([key]) =>
        question.includes(key.slice(0, 2)),
      )
      const answer =
        matched?.[1] ??
        Object.values(PRESET_ANSWERS)[index] ??
        '按风险排序，会上指定负责人'
      return `- ${question} → ${answer}`
    })
    .join('\n')

  const next = await requestPlan(
    client,
    model,
    `${BRIEF}\n\n已澄清：\n${answers}`,
    '澄清已给出，ready 必须为 true，openQuestions 置空，outline 必须是一段可执行的会议方案正文（单个字符串）。',
  )
  if (!next.outline.trim()) {
    throw new Error('澄清后计划仍没有 outline')
  }
  return { ...next, ready: true, openQuestions: [] }
}

/**
 * 向模型要一份计划 JSON 并做契约验收。
 *
 * @param client OpenAI 兼容客户端
 * @param model 模型名
 * @param brief 需求或带澄清的需求
 * @param hint 本轮额外约束
 */
async function requestPlan(
  client: OpenAI,
  model: string,
  brief: string,
  hint: string,
): Promise<Plan> {
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          '你做会议执行计划。信息不够就提问，不要编造约束。outline 只能是一个字符串。',
      },
      {
        role: 'user',
        content: [hint, describePlanContract(), brief].join('\n\n'),
      },
    ],
  })
  const raw = response.choices[0]?.message.content?.trim()
  if (!raw) {
    throw new Error('计划没有返回文本')
  }
  const parsed = PlanSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    throw new Error(`计划未通过契约：${parsed.error.message}`)
  }
  return parsed.data
}
