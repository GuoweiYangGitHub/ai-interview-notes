/**
 * @file 任务板
 * @description 对齐课13 step_2：id 和状态由程序写，模型只出任务内容。
 */
import type OpenAI from 'openai'
import { z } from 'zod'
import type { Plan } from './plan'

/** 模型给出的无编号任务草案。 */
export const TaskDraftSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
})

/** 一次拆板的任务列表。 */
export const TaskDraftListSchema = z.object({
  tasks: z.array(TaskDraftSchema).min(1).max(5),
})

/**
 * 把任务草案契约说给模型听。只要 title / detail，不要自己写 id。
 *
 * @returns 写入 user 消息的字段说明与合法示例
 */
export function describeTaskDraftContract(): string {
  return [
    '只返回一个 JSON 对象，不要 markdown。字段必须长这样：',
    '- tasks: { title: string, detail: string }[]，1 到 5 条',
    '- title / detail 都是字符串，不要把 tasks 写成字符串数组',
    '不要输出 id、status、note。',
    '形状示例：',
    JSON.stringify(
      {
        tasks: [
          {
            title: '确认排序规则',
            detail: '按风险把登录失败用例排在文案改动之前。',
          },
        ],
      },
      null,
      2,
    ),
  ].join('\n')
}

/** 由程序掌管的任务状态。 */
export type TaskStatus = 'pending' | 'done' | 'blocked'

/** 板上的一条任务：id / status / note 不交给模型改。 */
export type BoardTask = {
  id: string
  title: string
  detail: string
  status: TaskStatus
  note: string | null
}

/**
 * 把 plan.outline 拆成任务，并由程序补上 T01… 编号。
 *
 * @param client OpenAI 兼容客户端
 * @param model 模型名
 * @param plan 已就绪的计划
 * @returns 全部为 `pending` 的任务板
 */
export async function buildBoard(
  client: OpenAI,
  model: string,
  plan: Plan,
): Promise<BoardTask[]> {
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: '把计划拆成可勾选任务。不要自己编号。只返回一个 JSON 对象。',
      },
      {
        role: 'user',
        content: [describeTaskDraftContract(), plan.outline].join('\n\n'),
      },
    ],
  })
  const raw = response.choices[0]?.message.content?.trim()
  if (!raw) {
    throw new Error('任务板没有返回文本')
  }
  const parsed = TaskDraftListSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    throw new Error(`任务草案未通过契约：${parsed.error.message}`)
  }

  return parsed.data.tasks.map((task, index) => ({
    id: `T${String(index + 1).padStart(2, '0')}`,
    title: task.title,
    detail: task.detail,
    status: 'pending',
    note: null,
  }))
}

/**
 * @param board 当前任务板
 * @returns 下一条 pending，没有则 `undefined`
 */
export function nextPending(board: BoardTask[]) {
  return board.find((task) => task.status === 'pending')
}

/**
 * @param board 当前任务板
 * @returns 是否已无 pending
 */
export function allSettled(board: BoardTask[]) {
  return board.every((task) => task.status !== 'pending')
}
