/**
 * @file Host 侧执行器
 * @description 解析 Builder 文件块、落盘、跑测试。模型不能自己宣布测试通过。
 */
import { execFile } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const FILE_NAME = /^[\w.-]+$/

export type TestGate = {
  passed: boolean
  output: string
}

/**
 * 从 Builder 文本里抽出 `===FILE:name===` … `===END===`。
 * 拒绝路径分隔和 `..`，避免模型写出目录外的文件。
 *
 * @param response Builder 原文
 */
export function extractFiles(response: string) {
  const files: Record<string, string> = {}
  let current: string | null = null
  let lines: string[] = []

  const flush = () => {
    if (current && lines.length > 0) {
      files[current] = lines.join('\n')
    }
    current = null
    lines = []
  }

  for (const line of response.split('\n')) {
    if (line.startsWith('===FILE:') && line.includes('===', 8)) {
      flush()
      const name = line.slice(8, line.lastIndexOf('===')).trim()
      if (!FILE_NAME.test(name) || name.includes('..')) {
        throw new Error(`非法文件名：${name}`)
      }
      current = name
      continue
    }
    if (line.trim() === '===END===') {
      flush()
      continue
    }
    if (current !== null && !line.trim().startsWith('```')) {
      lines.push(line)
    }
  }
  flush()
  return files
}

/**
 * 把抽出的文件写进输出目录。只允许文件名，不允许子目录。
 *
 * @param outputDir 本次循环目录
 * @param files 文件名 → 内容
 */
/**
 * 输出目录自成 CommonJS，避免仓库根 `type: module` 让 require 挂掉。
 *
 * @param outputDir 本次循环目录
 */
export async function prepareOutputDir(outputDir: string) {
  await mkdir(outputDir, { recursive: true })
  await writeFile(
    join(outputDir, 'package.json'),
    `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`,
    'utf8',
  )
}

export async function writeExtractedFiles(
  outputDir: string,
  files: Record<string, string>,
) {
  await prepareOutputDir(outputDir)
  const written: string[] = []
  for (const [name, content] of Object.entries(files)) {
    const target = join(outputDir, basename(name))
    await writeFile(target, content, 'utf8')
    written.push(target)
  }
  return written
}

/**
 * 用 `node --test` 跑输出目录。通过与否以进程退出码为准。
 *
 * @param outputDir 已写入测试文件的目录
 */
export async function runTests(outputDir: string): Promise<TestGate> {
  try {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      ['--test', '--test-reporter=spec'],
      { cwd: outputDir, timeout: 20_000, windowsHide: true },
    )
    return { passed: true, output: `${stdout}\n${stderr}`.trim() }
  } catch (error) {
    const err = error as {
      stdout?: string
      stderr?: string
      message?: string
    }
    return {
      passed: false,
      output: `${err.stdout ?? ''}\n${err.stderr ?? err.message ?? ''}`.trim(),
    }
  }
}
