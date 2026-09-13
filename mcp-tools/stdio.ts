/**
 * 拉起一个 stdio MCP server，返回 list / call / close。
 * npx 包用 {@link connectNpxMcp}；Python 脚本用 {@link connectStdioMcp}。
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import {
  getDefaultEnvironment,
  StdioClientTransport,
} from '@modelcontextprotocol/sdk/client/stdio.js'

export type McpSession = {
  listTools: () => Promise<{ name: string; description?: string }[]>
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>
  close: () => Promise<void>
}

/**
 * 任意 command + args 起 stdio MCP。
 *
 * @param command 可执行文件，如 `python` / `npx`
 * @param args 参数
 * @param extraEnv 传给子进程的环境变量
 */
export async function connectStdioMcp(
  command: string,
  args: string[],
  extraEnv: Record<string, string> = {},
): Promise<McpSession> {
  const transport = new StdioClientTransport({
    command,
    args,
    env: {
      ...getDefaultEnvironment(),
      PYTHONUTF8: '1',
      PYTHONIOENCODING: 'utf-8',
      ...extraEnv,
    },
    stderr: 'inherit',
  })

  const client = new Client({ name: 'example-mcp-tools', version: '1.0.0' })
  await client.connect(transport)

  return {
    async listTools() {
      const { tools } = await client.listTools()
      return tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
      }))
    },
    async callTool(name, args) {
      return client.callTool({ name, arguments: args })
    },
    async close() {
      await client.close()
    },
  }
}

/**
 * 用 npx 拉起 npm 上的 MCP server。
 *
 * @param npmPackage 包名，可带版本
 */
export async function connectNpxMcp(
  npmPackage: string,
  extraEnv: Record<string, string> = {},
): Promise<McpSession> {
  if (process.platform === 'win32') {
    return connectStdioMcp('cmd', ['/c', 'npx', '-y', npmPackage], extraEnv)
  }
  return connectStdioMcp('npx', ['-y', npmPackage], extraEnv)
}
