/**
 * @file 环节 1–2：发现候选 + 按官方规则编目
 * @description 硬规则失败即停。metadata 词数、正文行数只警告，不参与判定。
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

import { asStringList, readFrontmatter } from './frontmatter'

const NAME_MAX_CHARS = 64
const DESCRIPTION_MAX_CHARS = 1024
const RESERVED_WORDS = ['anthropic', 'claude'] as const
const NAME_ALLOWED = /^[a-z0-9-]+$/
const XML_TAG = /<[^>]*>/

/** 官方只给建议值，超出不算报错。 */
export const METADATA_WORDS_LIMIT = 100
export const BODY_LINES_LIMIT = 500

/** 选择阶段只能看到这些字段，不含 SKILL.md 正文。 */
export type DecisionCard = {
  skillId: string
  name: string
  description: string
  keywords: string[]
  root: string
  compatibility: string
  allowedTools: string[]
}

export type OptionalChecks = {
  metadata_words: {
    ok: boolean
    words: number
    limit: number
    warning: string | null
    note: string
  }
  body_lines: {
    ok: boolean
    lines: number
    limit: number
    warning: string | null
    note: string
  }
  warnings: string[]
}

export type StageRow = {
  no: number
  name: string
  ok: boolean | null
  result: string
  reason_code?: string
}

/**
 * 一行环节结果。多行说明压成单行。
 *
 * @param no 环节序号
 * @param name 环节名
 * @param ok true 过 / false 不过 / null 未能判定
 * @param result 一句话
 * @param reasonCode 失败码
 */
export function row(
  no: number,
  name: string,
  ok: boolean | null,
  result: string,
  reasonCode?: string,
): StageRow {
  return {
    no,
    name,
    ok,
    result: String(result).split(/\s+/).join(' '),
    reason_code: reasonCode,
  }
}

/**
 * 扫描 skills 根目录的直接子目录，列出含 SKILL.md 的候选。
 *
 * @param skillsRoot skills 根目录
 */
export function listCandidates(skillsRoot: string): string[] {
  if (!existsSync(skillsRoot) || !statSync(skillsRoot).isDirectory()) {
    return []
  }
  return readdirSync(skillsRoot)
    .map((name) => join(skillsRoot, name))
    .filter((dir) => statSync(dir).isDirectory() && existsSync(join(dir, 'SKILL.md')))
    .sort((a, b) => basename(a).localeCompare(basename(b), 'zh-CN'))
}

/**
 * 按 Anthropic / agentskills.io 规则校验 frontmatter，返回全部违规说明。
 *
 * @param meta YAML 映射
 * @param dirName 父目录名，必须与 name 一致
 */
export function validateSkillMeta(
  meta: Record<string, unknown>,
  dirName: string,
): string[] {
  const errors: string[] = []
  const name = meta.name

  if (typeof name !== 'string' || !name.trim()) {
    errors.push('name 缺失或为空')
  } else {
    if (XML_TAG.test(name)) {
      errors.push(`name 不能包含 XML/尖括号标签：${JSON.stringify(name)}`)
    } else if (!NAME_ALLOWED.test(name)) {
      errors.push(`name 只能用小写字母、数字、连字符：${JSON.stringify(name)}`)
    }
    if (name.length > NAME_MAX_CHARS) {
      errors.push(`name 长度 ${name.length} 超过 ${NAME_MAX_CHARS} 字符`)
    }
    if (name.startsWith('-') || name.endsWith('-')) {
      errors.push(`name 不能以连字符开头或结尾：${JSON.stringify(name)}`)
    }
    if (name.includes('--')) {
      errors.push(`name 不能含连续连字符：${JSON.stringify(name)}`)
    }
    const hit = RESERVED_WORDS.filter((word) => name.toLowerCase().includes(word))
    if (hit.length) {
      errors.push(`name 含保留字 ${hit.join(', ')}（官方不允许 anthropic / claude）`)
    }
    if (!XML_TAG.test(name) && name !== dirName) {
      errors.push(`name ${JSON.stringify(name)} 与父目录名 ${JSON.stringify(dirName)} 不一致`)
    }
  }

  const desc = meta.description
  if (typeof desc !== 'string' || !desc.trim()) {
    errors.push('description 缺失或为空')
  } else {
    if (desc.length > DESCRIPTION_MAX_CHARS) {
      errors.push(`description 长度 ${desc.length} 超过 ${DESCRIPTION_MAX_CHARS} 字符`)
    }
    if (XML_TAG.test(desc)) {
      errors.push('description 不能包含 XML/尖括号标签')
    }
  }

  return errors
}

/**
 * 两个官方建议值检查：只给警告，不参与判定。
 *
 * @param meta frontmatter
 * @param body SKILL.md 正文
 */
export function optionalChecks(
  meta: Record<string, unknown>,
  body: string,
): OptionalChecks {
  const name = typeof meta.name === 'string' ? meta.name : ''
  const desc = typeof meta.description === 'string' ? meta.description : ''
  const words = `${name} ${desc}`.split(/\s+/).filter(Boolean).length
  const metadata = {
    ok: words <= METADATA_WORDS_LIMIT,
    words,
    limit: METADATA_WORDS_LIMIT,
    warning:
      words <= METADATA_WORDS_LIMIT
        ? null
        : `metadata 合计 ${words} 词，超过建议的 ${METADATA_WORDS_LIMIT} 词`,
    note: 'Anthropic skill-creator 建议 name + description 合计 ~100 词（英文按空格切词；中文计数偏低估）',
  }

  const lines = body.split(/\r?\n/).filter((line) => line.trim()).length
  const bodyCheck = {
    ok: lines <= BODY_LINES_LIMIT,
    lines,
    limit: BODY_LINES_LIMIT,
    warning:
      lines <= BODY_LINES_LIMIT
        ? null
        : `正文 ${lines} 行，超过建议的 ${BODY_LINES_LIMIT} 行`,
    note: '官方 best-practices 建议 SKILL.md 正文 500 行以内，超出时把细节拆到 references/',
  }

  return {
    metadata_words: metadata,
    body_lines: bodyCheck,
    warnings: [metadata.warning, bodyCheck.warning].filter(
      (item): item is string => Boolean(item),
    ),
  }
}

/**
 * 把 frontmatter 合法（至少有 name）的目录装成决策卡。不读正文。
 *
 * @param skillsRoot skills 根目录
 */
export function discoverAndInstall(skillsRoot: string): DecisionCard[] {
  const cards: DecisionCard[] = []
  for (const dir of listCandidates(skillsRoot)) {
    const parsed = readFrontmatter(join(dir, 'SKILL.md'))
    if (!parsed.ok) continue
    const name = parsed.meta.name
    if (typeof name !== 'string' || !name.trim()) continue
    cards.push({
      skillId: name,
      name,
      description: typeof parsed.meta.description === 'string' ? parsed.meta.description : '',
      keywords: asStringList(parsed.meta.keywords),
      root: dir,
      compatibility:
        typeof parsed.meta.compatibility === 'string' ? parsed.meta.compatibility : '',
      allowedTools: asStringList(parsed.meta['allowed-tools']),
    })
  }
  return cards
}

/**
 * 读命中 skill 的 SKILL.md 正文（去掉 frontmatter）。
 *
 * @param card 已选中的决策卡
 */
export function loadFullSkill(card: DecisionCard): string {
  const text = readFileSync(join(card.root, 'SKILL.md'), 'utf8').replace(/^\uFEFF/, '')
  return text.startsWith('---') ? text.split('---', 3)[2]?.trim() ?? text : text
}

/**
 * 定位目标 skill：必须是 root 的直接子目录，且含 SKILL.md。
 *
 * @param skillsRoot skills 根目录
 * @param skillArg 裸名或路径
 */
export function resolveTarget(skillsRoot: string, skillArg: string): string | null {
  const candidates = listCandidates(skillsRoot)
  const resolved = new Set(candidates.map((dir) => resolve(dir)))
  const direct = resolve(skillArg)
  if (existsSync(direct) && statSync(direct).isDirectory() && resolved.has(direct)) {
    return direct
  }
  const nested = resolve(skillsRoot, skillArg)
  if (existsSync(nested) && statSync(nested).isDirectory() && resolved.has(nested)) {
    return nested
  }
  return null
}
