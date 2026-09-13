/**
 * @file 01. 定义模型结构化输出
 * @description 契约进 Prompt，验收通过后才把 typed data 给下游。运行：`npm run 01`
 */
import 'dotenv/config'

import { createClient } from './client'
import { inspect } from './inspect'
import { describeOutputContract } from './schema'

const MEETING_NOTES = `
会议确认采用方案 B，李四负责开发，8 月 5 日前提交测试版。
王五负责检查测试环境的偶发登录失败，会议没有给出截止日期。
`.trim()

/**
 * 组装请求消息。系统提示只约束“别编造”，结构以 schema 为准。
 *
 * @param meetingNotes 会议原文
 * @returns Chat Completions 的 messages
 */
function buildMessages(meetingNotes: string) {
  return [
    { role: 'system' as const, content: '你是会议助理，只使用原文信息。' },
    {
      role: 'user' as const,
      content: `整理下面的会议原文。\n\n${describeOutputContract()}\n\n${meetingNotes}`,
    },
  ]
}

/**
 * 向模型要一份符合契约的 JSON 文本。
 *
 * @returns 尚未验收的模型原文
 * @throws {Error} 模型没有返回文本
 */
async function requestMinutes() {
  const { client, model } = createClient()
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    // json_object 管语法；Schema 管形状。只开 JSON mode、不写契约，字段照样会漂。
    response_format: { type: 'json_object' },
    messages: buildMessages(MEETING_NOTES),
  })

  const raw = response.choices[0]?.message.content?.trim()
  if (!raw) {
    throw new Error('模型没有返回可检查的文本')
  }
  return raw
}

/**
 * 请求 → 验收 → 仅在形状通过时打印 typed data。
 *
 * @throws {Error} 形状未通过契约
 */
async function main() {
  const rawText = await requestMinutes()
  const report = inspect(rawText)

  console.log('=== raw ===')
  console.log(rawText)
  console.log('=== inspection ===')
  console.log(JSON.stringify(report, null, 2))

  // 只有契约通过，才把 data 交给下游（建工单、写库、下一步 Agent）。
  if (report.shapeCheck !== 'pass') {
    throw new Error('结构化输出未通过契约，见上方 inspection')
  }

  console.log('=== typed data ===')
  console.log(report.data.summary)
  for (const item of report.data.actionItems) {
    console.log(`- ${item.task} / ${item.owner} / ${item.deadline}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
