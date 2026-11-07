/**
 * @file 08. Skills 撰写质量验证
 * @description 两把尺子：会不会加载（check）、写得好不好（score）。运行：`npm run 08`
 */
import 'dotenv/config'

import { existsSync, statSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { checkSkill } from './check'
import { createClient } from './client'
import {
  echoParams,
  printConclusion,
  printOptionalChecks,
  printRows,
  scoreRows,
} from './report'
import { resolveTarget } from './catalog'
import { PASS_SCORE } from './schema'
import { scorePassed, scoreSkill } from './score'

const EXAMPLE_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_REQUEST = '帮我写一个包含 hello world 的 Word 文档'
const DEFAULT_SKILLS_ROOT = join(EXAMPLE_DIR, 'fixtures', 'skills')
const DEFAULT_SKILL = join(DEFAULT_SKILLS_ROOT, 'docx')
const REVIEW_SKILL_MD = join(
  EXAMPLE_DIR,
  'fixtures',
  'skill-semantic-review',
  'SKILL.md',
)

type Mode = 'check' | 'score' | 'both'

type CliArgs = {
  mode: Mode
  request: string
  skill: string
  skillsRoot: string
}

/**
 * 用户给的相对路径：先相对 cwd，找不到再相对本示例目录。
 *
 * @param input 路径参数
 */
function resolveUserPath(input: string) {
  if (isAbsolute(input)) return input
  const fromCwd = resolve(process.cwd(), input)
  if (existsSync(fromCwd)) return fromCwd
  return resolve(EXAMPLE_DIR, input)
}

/**
 * 解析 `check | score | both` 与三个可选参数。
 *
 * @param argv process.argv
 */
function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2)
  let mode: Mode = 'both'
  if (args[0] === 'check' || args[0] === 'score' || args[0] === 'both') {
    mode = args.shift() as Mode
  }

  let request = DEFAULT_REQUEST
  let skill = DEFAULT_SKILL
  let skillsRoot = DEFAULT_SKILLS_ROOT

  for (let i = 0; i < args.length; i += 1) {
    const key = args[i]
    const value = args[i + 1]
    if (
      (key === '--request' || key === '--skill' || key === '--skills-root') &&
      !value
    ) {
      throw new Error(`${key} 需要一个值`)
    }
    if (key === '--request') {
      request = value
      i += 1
      continue
    }
    if (key === '--skill') {
      skill = value
      i += 1
      continue
    }
    if (key === '--skills-root') {
      skillsRoot = value
      i += 1
      continue
    }
    throw new Error(`未知参数: ${key}`)
  }

  return { mode, request, skill, skillsRoot }
}

/**
 * 跑「会不会加载」。退出码：0 会加载，1 不会，2 环境错误在 main 里处理。
 */
async function runCheck(
  request: string,
  skillArg: string,
  skillsRootArg: string,
  displaySkill: string,
) {
  const result = await checkSkill(
    createClient,
    request,
    skillArg,
    skillsRootArg,
    displaySkill,
  )
  printRows('环节', result.stages)
  printConclusion([result.conclusion])
  printOptionalChecks(result.optionalChecks)
  if (result.diagnosis) {
    console.log('===== 未命中诊断 =====')
    console.log(JSON.stringify(result.diagnosis, null, 2))
    console.log()
  }
  return result.loaded
}

/**
 * 跑「写得好不好」。退出码：0 达标，1 不达标，2 locate 失败。
 */
async function runScore(
  request: string,
  skillArg: string,
  skillsRootArg: string,
) {
  const skillDir = resolveTarget(skillsRootArg, skillArg)
  if (!skillDir) {
    printRows('环节', [
      {
        no: 1,
        name: 'locate',
        ok: false,
        result: '目标 skill 不在 skills 根目录的直接子目录里',
        reason_code: 'target_not_in_skills_root',
      },
    ])
    printConclusion(['模型没给出总分，本次无法判定（按未通过处理）'])
    return 2
  }

  const { client, model } = createClient()
  console.log(`评审用 skill：${REVIEW_SKILL_MD}`)
  console.log()
  const report = await scoreSkill(
    client,
    model,
    request,
    skillDir,
    REVIEW_SKILL_MD,
  )
  printRows('环节', [
    {
      no: 1,
      name: 'locate',
      ok: true,
      result: `定位到 ${skillDir}`,
    },
    {
      no: 2,
      name: 'score',
      ok: true,
      result: `摘出 ${report.dimensions.length} 个维度、总分 ${report.total_score}`,
    },
  ])
  printRows(
    `评判项目（单维 3 分合格，总分 ${PASS_SCORE} 分起算通过）`,
    scoreRows(report),
  )

  const passed = scorePassed(report.total_score)
  printConclusion([
    `报告的一句话结论：${report.conclusion}`,
    `判定：总分 ${report.total_score}/35 ${passed ? '达到' : '低于'}通过线 ${PASS_SCORE}，${
      passed ? '这份 skill 相对这条指令可用' : '这份 skill 相对这条指令还不够'
    }`,
  ])

  if (report.issues.length) {
    console.log('===== 问题清单 =====')
    console.log(JSON.stringify(report.issues, null, 2))
    console.log()
  }

  return passed ? 0 : 1
}

/** 默认先 check 再 score；子命令可单独跑。 */
async function main() {
  const args = parseArgs(process.argv)
  const skillArg = resolveUserPath(args.skill)
  const skillsRootArg = resolveUserPath(args.skillsRoot)
  const guessed =
    existsSync(skillArg) && statSync(skillArg).isDirectory() ? skillArg : null

  echoParams({
    request: args.request,
    skillArg: args.skill,
    skillsRootArg: args.skillsRoot,
    skillDir: guessed,
    skillsRoot: skillsRootArg,
    skillsRootExists:
      existsSync(skillsRootArg) && statSync(skillsRootArg).isDirectory(),
  })

  if (args.mode === 'check') {
    const loaded = await runCheck(
      args.request,
      skillArg,
      skillsRootArg,
      args.skill,
    )
    process.exitCode = loaded ? 0 : 1
    return
  }

  if (args.mode === 'score') {
    process.exitCode = await runScore(args.request, skillArg, skillsRootArg)
    return
  }

  const loaded = await runCheck(
    args.request,
    skillArg,
    skillsRootArg,
    args.skill,
  )
  console.log('-----')
  console.log()
  const scoreCode = await runScore(args.request, skillArg, skillsRootArg)
  process.exitCode = loaded && scoreCode === 0 ? 0 : scoreCode === 2 ? 2 : 1
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 2
})
