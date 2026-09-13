/**
 * @file MCP 形状的 stdio 客户端
 * @description 拉起 `server.ts`，按行做 tools/list 与 tools/call。
 */
import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** server `tools/list` 返回的一条工具声明。 */
export type McpTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

/** 等待一行 stdout 的未完成请求。 */
type Pending = {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
}

/**
 * 拉起本地 server 进程并返回 list/call/close。
 *
 * @returns 跨进程工具客户端
 * @throws {Error} server 没有 stdout
 */
export function connectMcp() {
  const here = dirname(fileURLToPath(import.meta.url))
  const child = spawn('npx', ['tsx', join(here, 'server.ts')], {
    cwd: here,
    shell: true,
    stdio: ['pipe', 'pipe', 'inherit'],
  })

  const pending = new Map<number, Pending>()
  let nextId = 1

  if (!child.stdout) {
    throw new Error('MCP server 没有 stdout')
  }

  const rl = createInterface({ input: child.stdout })
  rl.on('line', (line) => {
    if (!line.trim()) return
    const message = JSON.parse(line) as {
      id?: number
      result?: unknown
      error?: { message?: string }
    }
    const wait = message.id != null ? pending.get(message.id) : undefined
    if (!wait) return
    pending.delete(message.id as number)
    if (message.error) {
      wait.reject(new Error(message.error.message ?? 'MCP error'))
      return
    }
    wait.resolve(message.result)
  })

  /**
   * 发送一条 JSON-RPC 并等待对应 id 的响应。
   *
   * @param method `tools/list` 或 `tools/call`
   * @param params 可选参数
   */
  function request(method: string, params?: unknown) {
    const id = nextId
    nextId += 1
    return new Promise<unknown>((resolve, reject) => {
      pending.set(id, { resolve, reject })
      child.stdin?.write(
        `${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`,
      )
    })
  }

  return {
    /** @returns server 声明的工具列表 */
    async listTools() {
      const result = (await request('tools/list')) as { tools: McpTool[] }
      return result.tools
    },
    /**
     * @param name 工具名
     * @param args 工具参数
     * @returns server 执行结果
     */
    async callTool(name: string, args: Record<string, unknown>) {
      const result = (await request('tools/call', {
        name,
        arguments: args,
      })) as {
        content: unknown
      }
      return result.content
    },
    /** 结束 server 子进程。 */
    close() {
      child.kill()
    },
  }
}
