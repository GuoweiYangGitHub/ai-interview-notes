/**
 * @file 02. 多步流程编排与条件分支
 * @description 短文本单步、长文本分段调度。运行：`npm run 02`
 */
import 'dotenv/config'

import { createClient } from './client'
import { createState } from './state'
import { extractSegment, mergeActions, splitTranscript } from './steps'

const SHORT_NOTES = `
会议确认采用方案 B，李四负责开发，8 月 5 日前提交测试版。
`.trim()

const LONG_NOTES = `
产品确认采用方案 B。李四负责开发，8 月 5 日前提交测试版。

王五负责检查测试环境的偶发登录失败。会议没有给出截止日期。

大家讨论了深色模式的视觉风格，没有形成待办，也没有指定负责人。
`.trim()

/**
 * 按段落数选择单步或分段调度，并打印状态。
 *
 * @param transcript 会议原文
 * @param label 日志标签
 */
async function extractAll(transcript: string, label: string) {
  const { client, model } = createClient()
  const segments = splitTranscript(transcript)
  const state = createState()

  console.log(`\n=== ${label} segments=${segments.length} ===`)

  if (segments.length === 1) {
    state.currentStep = 'extract'
    const actions = await extractSegment(client, model, segments[0])
    state.processedSegmentIds.push(segments[0].segmentId)
    state.currentStep = 'branch'
    state.actions = mergeActions([{ segmentId: segments[0].segmentId, actions }])
    state.currentStep = 'done'
  } else {
    const batches = []
    for (const segment of segments) {
      state.currentStep = 'extract'
      const actions = await extractSegment(client, model, segment)
      state.processedSegmentIds.push(segment.segmentId)
      batches.push({ segmentId: segment.segmentId, actions })
    }
    state.currentStep = 'filter'
    state.actions = mergeActions(batches)
    state.currentStep = 'done'
  }

  console.log(
    JSON.stringify(
      {
        processedSegmentIds: state.processedSegmentIds,
        currentStep: state.currentStep,
        actions: state.actions,
      },
      null,
      2,
    ),
  )
}

/** 先跑短文本基线，再跑长文本分段。 */
async function main() {
  await extractAll(SHORT_NOTES, 'short/single-request')
  await extractAll(LONG_NOTES, 'long/segmented')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
