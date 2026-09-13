/**
 * @file MCP → Action 桥
 * @description 把跨进程工具收成与 04 相同的 Action 形状，再给模型看。
 */
import type { McpTool } from './mcpClient'

/** 已桥接的 Action：声明来自 MCP，执行仍走 `callTool`。 */
export type BridgedAction = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (args: Record<string, unknown>) => Promise<unknown>
}

/**
 * 把 list 结果登记成本地 Action。
 *
 * @param tools MCP 工具声明
 * @param callTool 跨进程调用
 * @returns 可交给模型的 Action 列表
 */
export function bridgeTools(
  tools: McpTool[],
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>,
): BridgedAction[] {
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    execute: (args) => callTool(tool.name, args),
  }))
}

/**
 * 转成 Chat Completions 的 `tools`。
 *
 * @param actions 已桥接 Action
 */
export function toOpenAITools(actions: BridgedAction[]) {
  return actions.map((action) => ({
    type: 'function' as const,
    function: {
      name: action.name,
      description: action.description,
      parameters: action.inputSchema,
    },
  }))
}
