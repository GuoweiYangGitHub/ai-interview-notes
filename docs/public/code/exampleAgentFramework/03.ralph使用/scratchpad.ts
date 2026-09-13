/**
 * @file 仓库即记录
 * @description 帽子之间不传 chat history，只读写 scratchpad.md。
 */
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises'
import { dirname } from 'node:path'

/**
 * 清空并写好本次循环的抬头。
 *
 * @param path scratchpad 路径
 */
export async function initScratchpad(path: string) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(
    path,
    `# Ralph Scratchpad\n\n启动时间: ${new Date().toISOString()}\n`,
    'utf8',
  )
}

/**
 * 追加一顶帽子的产出。下一顶帽子只读文件，不读内存。
 *
 * @param path scratchpad 路径
 * @param hat 帽子名
 * @param content 本轮要留下的记录
 */
export async function appendScratchpad(
  path: string,
  hat: string,
  content: string,
) {
  await appendFile(
    path,
    `\n## ${hat}\n时间: ${new Date().toISOString()}\n\n${content}\n`,
    'utf8',
  )
}

/**
 * 读出目前为止的全部记录。
 *
 * @param path scratchpad 路径
 */
export async function readScratchpad(path: string) {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return '(空)'
  }
}
