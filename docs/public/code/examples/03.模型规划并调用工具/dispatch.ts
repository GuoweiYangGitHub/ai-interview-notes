/**
 * @file 分发
 * @description 只有这里能调用真实函数；未知 name 直接拒绝。
 */
import { browsePage, searchWeb } from './actions'

/**
 * 按工具名执行已声明的 Action。
 *
 * @param name 工具名
 * @param args 模型给出的参数
 * @returns 工具 observation
 * @throws {Error} 未允许的工具名
 */
export function dispatch(name: string, args: unknown): unknown {
  if (name === 'search_web') return searchWeb(args)
  if (name === 'browse_page') return browsePage(args)
  throw new Error(`未允许的工具：${name}`)
}
