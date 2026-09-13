/**
 * @file 受限进程执行器
 * @description 新进程 + 超时 + 裁剪环境变量。cwd 不是文件权限边界。
 */
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const GUEST = `
const fs = require('node:fs')
const sentinel = process.argv[2]
console.log('calculation=' + String(4 * 4))
try {
  fs.writeFileSync(sentinel, 'restricted-process-overwrote-host-file', 'utf8')
  console.log('outside_write=true')
} catch {
  console.log('outside_write=false')
}
console.log('secret_visible=' + String(Boolean(process.env.DEMO_SECRET)))
`.trim()

export type RestrictedProcessResult = {
  stdout: string
  timedOut: boolean
  calculation: string
  outsideWrite: boolean
  secretVisible: boolean
  hostFileChanged: boolean
  envStripped: boolean
}

/**
 * 在裁剪过的子进程里跑固定任务，并证明宿主文件仍可被改写。
 *
 * @param timeoutMs 子进程超时；超时后杀掉，不留给模型无限占用
 * @returns 计算、越权写入、环境变量是否泄漏的证据
 */
export async function runRestrictedProcess(
  timeoutMs = 5_000,
): Promise<RestrictedProcessResult> {
  const root = await mkdtemp(join(tmpdir(), 'agent-ex06-proc-'))
  const workdir = join(root, 'work')
  const sentinel = join(root, 'outside-important.txt')
  const guest = join(workdir, 'guest.cjs')
  const before = '这是工作目录之外、仍属同一账户的宿主文件。'

  await writeFile(sentinel, before, 'utf8')
  await mkdir(workdir)
  await writeFile(guest, GUEST, 'utf8')

  try {
    const { stdout, timedOut } = await spawnGuest({
      guest,
      sentinel,
      workdir,
      timeoutMs,
    })
    const after = await readFile(sentinel, 'utf8')
    const lines = Object.fromEntries(
      stdout
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
          const idx = line.indexOf('=')
          return [line.slice(0, idx), line.slice(idx + 1)]
        }),
    )

    return {
      stdout,
      timedOut,
      calculation: lines.calculation ?? '',
      outsideWrite: lines.outside_write === 'true',
      secretVisible: lines.secret_visible === 'true',
      hostFileChanged: after !== before,
      envStripped: lines.secret_visible === 'false',
    }
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

/**
 * 启动 Node 子进程。不把宿主密钥传进去；参数由 Host 写死。
 */
function spawnGuest(input: {
  guest: string
  sentinel: string
  workdir: string
  timeoutMs: number
}) {
  return new Promise<{ stdout: string; timedOut: boolean }>((resolve, reject) => {
    const child = spawn(process.execPath, [input.guest, input.sentinel], {
      cwd: input.workdir,
      env: {
        PATH: process.env.PATH,
        SYSTEMROOT: process.env.SYSTEMROOT,
        TEMP: input.workdir,
        TMP: input.workdir,
      },
      windowsHide: true,
    })

    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill()
    }, input.timeoutMs)

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk
    })
    child.on('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (timedOut) {
        resolve({ stdout: stdout.trim(), timedOut: true })
        return
      }
      if (code !== 0) {
        reject(new Error(`受限进程退出码 ${code}：${stderr.trim()}`))
        return
      }
      resolve({ stdout: stdout.trim(), timedOut: false })
    })
  })
}
