/**
 * @file Docker 独立执行环境
 * @description 方案 Docker。对齐课10 s04。不自动 pull，不回退宿主执行。
 */
import { execFile } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

/** 与课10 相同的固定镜像；必须事先存在于本机。 */
export const DEFAULT_IMAGE = 'python:3.12-slim'
const NON_ROOT_USER = '10001:10001'
const NAME_PREFIX = 'agent-ex06-'

/** 预检失败时跳过，不假装已经隔离。 */
export type DockerSkip = {
  skipped: true
  reason: string
}

export type DockerRunResult = {
  skipped: false
  containerName: string
  containerId: string
  stdout: string
  inspect: {
    networkMode: string
    readOnlyRootfs: boolean
    user: string
    privileged: boolean
  }
  hostFileUnchanged: boolean
  containerRemoved: boolean
}

/**
 * 跑 docker 子命令。参数全部由 Host 写死，不接收模型拼出来的 argv。
 *
 * @param args `docker` 之后的参数
 * @param timeoutMs 超时
 */
async function runDocker(args: string[], timeoutMs: number) {
  try {
    const { stdout, stderr } = await execFileAsync('docker', args, {
      timeout: timeoutMs,
      encoding: 'utf8',
      windowsHide: true,
    })
    return { code: 0, stdout: stdout.trim(), stderr: stderr.trim() }
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      stdout?: string
      stderr?: string
      code?: string | number
    }
    if (err.code === 'ENOENT') {
      throw new Error('找不到 Docker CLI')
    }
    if (
      err.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' ||
      /ETIMEDOUT/i.test(String(err))
    ) {
      throw new Error(`Docker 超时：docker ${args.join(' ')}`)
    }
    return {
      code: typeof err.code === 'number' ? err.code : 1,
      stdout: String(err.stdout ?? '').trim(),
      stderr: String(err.stderr ?? err.message).trim(),
    }
  }
}

/**
 * 确认 CLI、daemon、本地镜像都在。缺一样就 skip。
 *
 * @returns 可用时带 imageId；否则带 reason
 */
export async function preflightDocker(): Promise<
  { ok: true; serverVersion: string; imageId: string } | DockerSkip
> {
  try {
    const version = await runDocker(
      ['version', '--format', '{{.Server.Version}}'],
      10_000,
    )
    if (version.code !== 0 || !version.stdout) {
      return {
        skipped: true,
        reason: `Docker daemon 不可用：${version.stderr || '无版本号'}`,
      }
    }
    const image = await runDocker(
      ['image', 'inspect', DEFAULT_IMAGE, '--format', '{{.Id}}'],
      10_000,
    )
    if (image.code !== 0 || !image.stdout) {
      return {
        skipped: true,
        reason: `本地没有镜像 ${DEFAULT_IMAGE}。先执行 docker pull ${DEFAULT_IMAGE}，本示例不会自动 pull。`,
      }
    }
    return { ok: true, serverVersion: version.stdout, imageId: image.stdout }
  } catch (error) {
    return {
      skipped: true,
      reason: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * 构造完全由 Host 决定的 `docker create` 参数。
 *
 * @param inputDir 只读挂进容器的 /input
 * @param containerName 符合前缀的容器名
 */
export function buildDockerCreateArgv(inputDir: string, containerName: string) {
  if (!containerName.startsWith(NAME_PREFIX)) {
    throw new Error('容器名必须由 Host 生成')
  }
  const src = resolve(inputDir).replace(/\\/g, '/')
  return [
    'create',
    '--name',
    containerName,
    '--pull',
    'never',
    '--network',
    'none',
    '--read-only',
    '--tmpfs',
    '/tmp:rw,noexec,nosuid,size=64m',
    '--cap-drop',
    'ALL',
    '--security-opt',
    'no-new-privileges',
    '--pids-limit',
    '64',
    '--cpus',
    '0.50',
    '--memory',
    '128m',
    '--user',
    NON_ROOT_USER,
    '--label',
    'agent-examples.ex06=docker-sandbox',
    '--mount',
    `type=bind,src=${src},dst=/input,readonly`,
    DEFAULT_IMAGE,
    'python',
    '/input/task.py',
  ]
}

/**
 * 核对容器真实状态，不轻信 create 参数。
 *
 * @param inspectData `docker inspect` 的第一条
 */
export function verifyDockerInspect(inspectData: Record<string, unknown>) {
  const config = inspectData.Config as Record<string, unknown> | undefined
  const host = inspectData.HostConfig as Record<string, unknown> | undefined
  if (!config || !host) {
    throw new Error('Docker inspect 缺少 Config / HostConfig')
  }
  const failed: string[] = []
  if (host.NetworkMode !== 'none') failed.push('NetworkMode 必须是 none')
  if (host.ReadonlyRootfs !== true) failed.push('根文件系统必须只读')
  if (config.User !== NON_ROOT_USER) failed.push(`User 必须是 ${NON_ROOT_USER}`)
  if (host.Privileged === true) failed.push('不允许 Privileged')
  const args = inspectData.Args
  if (!Array.isArray(args) || args.join(' ') !== '/input/task.py') {
    failed.push('容器入口必须固定为 python /input/task.py')
  }
  if (failed.length > 0) {
    throw new Error(`Docker inspect 边界不匹配：${failed.join('；')}`)
  }
  return {
    networkMode: String(host.NetworkMode),
    readOnlyRootfs: true,
    user: String(config.User),
    privileged: false,
  }
}

function sha256(content: string) {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

const FIXED_TASK = `
from pathlib import Path
calculation = 4 * 4
try:
    Path('/input/important.txt').write_text('不应写入', encoding='utf-8')
except OSError:
    write_blocked = True
else:
    write_blocked = False
print(f'calculation={calculation}')
print(f'write_blocked={str(write_blocked).lower()}')
if calculation != 16 or not write_blocked:
    raise SystemExit(9)
`.trim()

/**
 * 在隔离容器里跑固定任务：算出 4*4，并证明只读挂载写不进宿主文件。
 *
 * @returns 跳过原因，或验收通过的证据
 */
export async function runDockerExecutionEnvironment(): Promise<
  DockerRunResult | DockerSkip
> {
  const preflight = await preflightDocker()
  if ('skipped' in preflight) {
    return preflight
  }

  const containerName = `${NAME_PREFIX}${randomBytes(8).toString('hex')}`
  const root = await mkdtemp(join(tmpdir(), 'agent-ex06-docker-'))
  const inputDir = join(root, 'input')
  await mkdir(inputDir)
  const importantPath = join(inputDir, 'important.txt')
  const before = '这是宿主机上需要保护的重要内容。'
  await writeFile(importantPath, before, 'utf8')
  await writeFile(join(inputDir, 'task.py'), FIXED_TASK, 'utf8')
  const shaBefore = sha256(before)

  let containerId: string | undefined
  try {
    const created = await runDocker(
      buildDockerCreateArgv(inputDir, containerName),
      15_000,
    )
    if (created.code !== 0 || !created.stdout) {
      throw new Error(`Docker create 失败：${created.stderr}`)
    }
    containerId = created.stdout

    const inspected = await runDocker(['inspect', containerId], 10_000)
    if (inspected.code !== 0) {
      throw new Error(`Docker inspect 失败：${inspected.stderr}`)
    }
    const inspectJson = JSON.parse(inspected.stdout) as Record<string, unknown>[]
    const inspect = verifyDockerInspect(inspectJson[0] ?? {})

    const started = await runDocker(['start', '-a', containerId], 20_000)
    if (started.code !== 0) {
      throw new Error(`Docker 容器返回码 ${started.code}：${started.stderr}`)
    }
    const lines = started.stdout.split(/\r?\n/).filter(Boolean)
    if (lines.join('\n') !== 'calculation=16\nwrite_blocked=true') {
      throw new Error(`Docker 输出未证明计算完成且写入被阻断：${started.stdout}`)
    }

    const after = await readFile(importantPath, 'utf8')
    const hostFileUnchanged = after === before && sha256(after) === shaBefore
    if (!hostFileUnchanged) {
      throw new Error('宿主 important.txt 被改写，隔离失败')
    }

    await runDocker(['rm', '-f', containerId], 10_000)
    const stillThere = await runDocker(
      ['container', 'ls', '-a', '--filter', `id=${containerId}`, '--format', '{{.ID}}'],
      10_000,
    )
    const containerRemoved = stillThere.stdout === ''
    if (!containerRemoved) {
      throw new Error('容器回收后仍能查到')
    }

    return {
      skipped: false,
      containerName,
      containerId,
      stdout: started.stdout,
      inspect,
      hostFileUnchanged,
      containerRemoved,
    }
  } finally {
    if (containerId) {
      await runDocker(['rm', '-f', containerId], 10_000).catch(() => undefined)
    }
    await rm(root, { recursive: true, force: true })
  }
}
