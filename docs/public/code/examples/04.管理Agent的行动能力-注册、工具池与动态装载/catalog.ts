/**
 * @file 本地 Action 目录
 * @description 注册进 registry，不直接暴露给模型。
 */
import { ActionRegistry } from './registry'

const TEAM = [
  { name: '李四', role: '开发' },
  { name: '王五', role: '测试' },
]

/**
 * 创建已登记 `lookup_member` 与 `echo_status` 的注册表，尚未 load。
 *
 * @returns 空装载集的 {@link ActionRegistry}
 */
export function createCatalog() {
  const registry = new ActionRegistry()

  registry.register({
    name: 'lookup_member',
    description: '按姓名查团队角色',
    args: { name: '成员姓名' },
    execute: (args) => {
      const name = String(args.name ?? '')
      const row = TEAM.find((item) => item.name === name)
      return row ?? { error: `没有这位成员：${name}` }
    },
  })

  registry.register({
    name: 'echo_status',
    description: '回显一句状态说明，不查外部系统',
    args: { text: '要回显的短句' },
    execute: (args) => ({ echoed: String(args.text ?? '') }),
  })

  return registry
}
