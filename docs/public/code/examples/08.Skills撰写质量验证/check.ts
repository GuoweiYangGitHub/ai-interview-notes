/**
 * @file 会不会加载：discover → catalog → select → load
 * @description 对应课程 check_a_skill_v1.py 的前四环。不跑 bash。
 */
import { existsSync, statSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

import type OpenAI from 'openai'

import {
  discoverAndInstall,
  listCandidates,
  loadFullSkill,
  optionalChecks,
  resolveTarget,
  row,
  validateSkillMeta,
  type OptionalChecks,
  type StageRow,
} from './catalog'
import { diagnose, type DiagnosisResult } from './diagnose'
import { readFrontmatter } from './frontmatter'
import { selectModelBased, type Selection } from './select'

export type CheckResult = {
  request: string
  skillArg: string
  skillsRoot: string
  resolvedSkillDir: string | null
  loaded: boolean
  conclusion: string
  stages: StageRow[]
  triggeredSkills: Selection[]
  diagnosis: DiagnosisResult | null
  optionalChecks: OptionalChecks | null
  bodyChars: number | null
}

type ModelAccess = {
  client: OpenAI
  model: string
}

/**
 * 跑完发现、编目、模型路由、装载正文。任一环失败即停。
 *
 * @param loadModel 仅 select / diagnose 时才创建客户端；catalog 失败不会调模型
 * @param request 用户指令
 * @param skillArg 目标 skill 的解析后路径
 * @param skillsRoot skills 根目录
 * @param displaySkill 打印结论时用的原始参数
 */
export async function checkSkill(
  loadModel: () => ModelAccess,
  request: string,
  skillArg: string,
  skillsRoot: string,
  displaySkill = skillArg,
): Promise<CheckResult> {
  const stages: StageRow[] = []
  const result: CheckResult = {
    request,
    skillArg: displaySkill,
    skillsRoot,
    resolvedSkillDir: null,
    loaded: false,
    conclusion: '',
    stages,
    triggeredSkills: [],
    diagnosis: null,
    optionalChecks: null,
    bodyChars: null,
  }

  const candidates = listCandidates(skillsRoot)
  if (!existsSync(skillsRoot) || !statSync(skillsRoot).isDirectory()) {
    stages.push(
      row(1, 'discover', false, `skills 根目录不存在：${skillsRoot}`, 'skills_root_not_found'),
    )
    return finalize(result)
  }

  const targetDir = resolveTarget(skillsRoot, skillArg)
  if (!targetDir) {
    stages.push(
      row(
        1,
        'discover',
        false,
        `目标 skill 不在扫描结果里；扫描只覆盖 skills 根目录的直接子目录。试过：${skillArg}、${join(skillsRoot, skillArg)}`,
        'target_not_in_skills_root',
      ),
    )
    return finalize(result)
  }
  result.resolvedSkillDir = targetDir

  stages.push(
    row(
      1,
      'discover',
      true,
      `扫描到 ${candidates.length} 个候选目录，目标 ${basename(targetDir)} 在候选内`,
    ),
  )

  const parsed = readFrontmatter(join(targetDir, 'SKILL.md'))
  if (!parsed.ok) {
    stages.push(row(2, 'catalog', false, parsed.error, 'invalid_frontmatter'))
    return finalize(result)
  }

  result.optionalChecks = optionalChecks(parsed.meta, parsed.body)
  const violations = validateSkillMeta(parsed.meta, basename(targetDir))
  if (violations.length) {
    stages.push(
      row(
        2,
        'catalog',
        false,
        `不符合 Anthropic 官方 frontmatter 规范：${violations.join('；')}`,
        'spec_violation',
      ),
    )
    return finalize(result)
  }

  const cards = discoverAndInstall(skillsRoot)
  const card = cards.find((item) => resolve(item.root) === resolve(targetDir))
  if (!card) {
    stages.push(
      row(2, 'catalog', false, 'frontmatter 不合法，未能登记决策卡', 'invalid_frontmatter'),
    )
    return finalize(result)
  }

  stages.push(
    row(
      2,
      'catalog',
      true,
      `frontmatter 符合官方规范，已登记决策卡 ${card.skillId}（description ${card.description.length} 字符）`,
    ),
  )

  const { client, model } = loadModel()
  const { selections, rejections } = await selectModelBased(client, model, request, cards)
  result.triggeredSkills = selections
  const chosen = selections.find((item) => item.skillId === card.skillId)
  if (!chosen) {
    const rejected = rejections.find((item) => item.skillId === card.skillId)
    const reason = rejected?.reason ?? '模型没有选中这个 skill'
    stages.push(row(3, 'select', false, `模型判定不适用：${reason}`, 'model_rejected'))
    result.diagnosis = await diagnose(client, model, request, card)
    return finalize(result)
  }

  stages.push(row(3, 'select', true, `模型选中 ${card.skillId}：${chosen.reason}`))

  const body = loadFullSkill(card)
  result.bodyChars = body.length
  stages.push(row(4, 'load', true, `已读 SKILL.md 正文（${body.length} 字符）`))
  result.loaded = true
  return finalize(result)
}

function finalize(result: CheckResult): CheckResult {
  if (result.loaded) {
    result.conclusion = `skill「${result.skillArg}」✅ 会因这条指令被加载`
  } else {
    const last = result.stages.reduce(
      (best, item) => (item.no > best.no ? item : best),
      result.stages[0] ?? { no: 0, name: 'discover', ok: false, result: '' },
    )
    result.conclusion = `skill「${result.skillArg}」❌ 不会因这条指令被加载（卡在 ${last.no} - ${last.name}）`
  }
  return result
}
