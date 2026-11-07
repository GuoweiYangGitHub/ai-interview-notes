/**
 * @file 读 SKILL.md 的 YAML frontmatter
 * @description 兼容 BOM；解析失败返回错误说明，不抛给调用方。
 */
import { readFileSync } from 'node:fs'

import { parse } from 'yaml'

export type FrontmatterResult =
  | { ok: true; meta: Record<string, unknown>; body: string }
  | { ok: false; error: string }

/**
 * 读 SKILL.md 的 frontmatter 和正文。
 *
 * @param skillMd 文件路径
 */
export function readFrontmatter(skillMd: string): FrontmatterResult {
  const text = readFileSync(skillMd, 'utf8').replace(/^\uFEFF/, '')
  if (!text.startsWith('---')) {
    return { ok: false, error: 'SKILL.md 开头没有 --- frontmatter 块' }
  }
  const parts = text.split('---', 3)
  if (parts.length < 3) {
    return { ok: false, error: 'SKILL.md 的 frontmatter 没有结束标记 ---' }
  }

  let meta: unknown
  try {
    meta = parse(parts[1] ?? '') ?? {}
  } catch (error) {
    return {
      ok: false,
      error: `frontmatter YAML 解析失败：${error instanceof Error ? error.message : String(error)}`,
    }
  }

  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    return { ok: false, error: 'frontmatter 不是 YAML 映射' }
  }

  return {
    ok: true,
    meta: meta as Record<string, unknown>,
    body: parts[2] ?? '',
  }
}

/**
 * 把 YAML 里可能是字符串或数组的字段收成 string[]。
 *
 * @param value frontmatter 字段
 */
export function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split(/[,\s]+/).filter(Boolean)
  }
  return []
}
