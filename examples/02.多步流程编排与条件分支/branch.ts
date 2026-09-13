/**
 * @file 条件分支
 * @description 缺负责人或截止日期标待确认，不丢弃这条待办。
 */
import type { ActionItem, TrackedAction } from './schema'

/**
 * 按缺失字段打标。
 *
 * @param item 模型抽出的行动项
 * @param segmentId 来源段落编号
 * @returns 带 `status` / `missing` 的 {@link TrackedAction}
 */
export function markMissing(item: ActionItem, segmentId: number): TrackedAction {
  const missing = (['owner', 'deadline'] as const).filter(
    (field) => item[field] == null || item[field] === '',
  )
  return {
    ...item,
    segmentId,
    missing: [...missing],
    status: missing.length > 0 ? '待确认' : '信息完整',
  }
}
