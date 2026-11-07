/**
 * @file 七维语义打分
 * @description 注入 skill-semantic-review 正文，只评语义，不评 YAML / 命名。
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

import type OpenAI from 'openai'

import { readFrontmatter } from './frontmatter'
import { inspectJson, requestJson } from './inspect'
import {
  describeScoreContract,
  DIMENSION_NAMES,
  PASS_SCORE,
  ScoreReportSchema,
  type ScoreReport,
} from './schema'

const TEXT_EXT = new Set(['.md', '.txt', '.py', '.ts', '.js', '.json', '.yml', '.yaml'])
const MAX_EXTRA_CHARS = 12_000

/**
 * 收集 references/、scripts/ 下的文本文件，避免评审时漏读附件。
 *
 * @param skillDir 被评审 skill 目录
 */
export function collectExtraFiles(skillDir: string): { path: string; text: string }[] {
  const extras: { path: string; text: string }[] = []
  let remaining = MAX_EXTRA_CHARS

  const walk = (dir: string) => {
    if (!existsSync(dir) || remaining <= 0) return
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      const stat = statSync(full)
      if (stat.isDirectory()) {
        walk(full)
        continue
      }
      if (!TEXT_EXT.has(extname(name).toLowerCase())) continue
      const text = readFileSync(full, 'utf8').replace(/^\uFEFF/, '')
      const slice = text.slice(0, remaining)
      extras.push({ path: relative(skillDir, full).replaceAll('\\', '/'), text: slice })
      remaining -= slice.length
      if (remaining <= 0) return
    }
  }

  walk(join(skillDir, 'references'))
  walk(join(skillDir, 'scripts'))
  return extras
}

/**
 * 按 skill-semantic-review 的七个维度给目标 skill 打分。
 *
 * @param client OpenAI 兼容客户端
 * @param model 模型名
 * @param request 它要服务的用户指令
 * @param skillDir 被评审目录
 * @param reviewSkillMd 评审用 SKILL.md 路径
 * @throws {Error} 读文件失败或 JSON 未通过契约
 */
export async function scoreSkill(
  client: OpenAI,
  model: string,
  request: string,
  skillDir: string,
  reviewSkillMd: string,
): Promise<ScoreReport> {
  const targetMd = readFileSync(join(skillDir, 'SKILL.md'), 'utf8').replace(/^\uFEFF/, '')
  const review = readFrontmatter(reviewSkillMd)
  if (!review.ok || !review.body.trim()) {
    throw new Error(`评审用 skill 的正文读不出来：${review.ok ? '正文为空' : review.error}`)
  }

  const extras = collectExtraFiles(skillDir)
  const extraBlock =
    extras.length === 0
      ? '（该目录没有 references/ 或 scripts/ 文本文件）'
      : extras.map((file) => `### ${file.path}\n${file.text}`).join('\n\n')

  const raw = await requestJson(client, model, [
    {
      role: 'system',
      content: [
        '你按评审方法给一份 SKILL.md 打分。只判断语义。',
        '字段合法性、YAML、name 字符范围、正文行数一律不要下结论、不要写进分数。',
        '格式问题最多提醒用户去跑 npm run 08:check。',
        '每条判断必须能指到原文；指不到的判断删掉。',
        '不要因为排版整齐或篇幅长就给高分。',
        review.body.trim(),
      ].join('\n\n'),
    },
    {
      role: 'user',
      content: [
        `用户指令（真实场景，用来判断该不该触发）：${request}`,
        '',
        `被评审 skill 目录：${skillDir}`,
        '',
        '被评审 SKILL.md：',
        targetMd,
        '',
        '目录内已读到的附件：',
        extraBlock,
        '',
        describeScoreContract(),
        '',
        `dimensions 必须按这个顺序给出这七个 name：${DIMENSION_NAMES.join('、')}`,
        'total_score 必须等于七维 score 之和。',
      ].join('\n'),
    },
  ])

  const report = inspectJson(raw, ScoreReportSchema)
  if (report.shapeCheck !== 'pass') {
    throw new Error(`score 结构化输出未通过契约：${JSON.stringify(report)}`)
  }

  const seen = new Set(report.data.dimensions.map((item) => item.name))
  if (seen.size !== DIMENSION_NAMES.length) {
    throw new Error('score 的七个维度 name 不完整或有重复')
  }

  const summed = report.data.dimensions.reduce((total, item) => total + item.score, 0)
  return {
    ...report.data,
    total_score: summed,
    conclusion: report.data.conclusion,
  }
}

/**
 * 总分是否达到通过线。
 *
 * @param total 七维之和
 */
export function scorePassed(total: number) {
  return total >= PASS_SCORE
}
