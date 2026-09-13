/**
 * @file 收敛回路
 * @description 对齐课13 step_3：取 pending → 做 → 检查 → 回填。
 */
import type { BoardTask } from './board'
import { allSettled, nextPending } from './board'

/** 一次回填的痕迹。 */
export type LoopTrace = {
  taskId: string
  result: string
  status: BoardTask['status']
}

/**
 * 就地消费 pending：detail 含「无法/缺少」则 blocked，否则 done。
 *
 * @param board 会被就地改写
 * @returns 更新后的板与 trace
 */
export function runConvergence(board: BoardTask[]) {
  const trace: LoopTrace[] = []

  while (!allSettled(board)) {
    const task = nextPending(board)
    if (!task) break

    const result = `已根据计划处理：${task.title}`
    const blocked = /无法|缺少/.test(task.detail)
    task.status = blocked ? 'blocked' : 'done'
    task.note = result
    trace.push({ taskId: task.id, result, status: task.status })
  }

  return { board, trace }
}
