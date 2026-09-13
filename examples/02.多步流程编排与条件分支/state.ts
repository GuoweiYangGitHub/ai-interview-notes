/**
 * @file 流程状态
 * @description 程序记住已走完哪一段，不靠模型自己回忆。
 */
import type { TrackedAction } from './schema'

/** 编排过程中的进度：当前步、已处理段落、已合并待办。 */
export type PipelineState = {
  currentStep: 'idle' | 'extract' | 'filter' | 'branch' | 'done'
  processedSegmentIds: number[]
  actions: TrackedAction[]
}

/**
 * 创建空状态，从 `idle` 开始。
 *
 * @returns 尚未处理任何段落的 {@link PipelineState}
 */
export function createState(): PipelineState {
  return {
    currentStep: 'idle',
    processedSegmentIds: [],
    actions: [],
  }
}
