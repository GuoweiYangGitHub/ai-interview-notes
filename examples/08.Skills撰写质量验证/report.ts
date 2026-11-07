/**
 * @file 终端排版
 * @description 环节表、评分表、结论区。对应课程 helper.py 的 print_rows。
 */
import { DIM_PASS_SCORE, PASS_SCORE, type ScoreReport } from './schema'
import type { OptionalChecks, StageRow } from './catalog'
import { row } from './catalog'

/**
 * 打印一组结果行。三档标记：过 / 不过 / 未能判定。
 *
 * @param title 区块标题
 * @param rows 结果行
 */
export function printRows(title: string, rows: StageRow[]) {
  console.log(`===== ${title} =====`)
  for (const item of [...rows].sort((a, b) => a.no - b.no)) {
    const mark = item.ok ? '✅' : item.ok === false ? '❌' : '⚠️'
    console.log(`${item.no} - ${item.name} ${mark} ${item.result}`)
  }
  console.log()
}

/**
 * 结论区。
 *
 * @param lines 若干行
 */
export function printConclusion(lines: string[]) {
  console.log('===== 结论 =====')
  for (const line of lines) {
    console.log(line)
  }
  console.log()
}

/**
 * 两个官方建议值。只警告，不影响退出码。
 *
 * @param checks 建议值结果；未读到 frontmatter 时为 null
 */
export function printOptionalChecks(checks: OptionalChecks | null) {
  if (!checks) {
    console.log('===== 可选项 =====')
    console.log('没读到 SKILL.md 的 frontmatter，两个可选项都未评估。')
    console.log()
    return
  }
  console.log('===== 可选项（只警告，不算报错）=====')
  for (const [key, label] of [
    ['metadata_words', 'metadata 词数'],
    ['body_lines', '正文行数'],
  ] as const) {
    const item = checks[key]
    const mark = item.ok ? '✅' : '⚠️'
    const value = 'words' in item ? item.words : item.lines
    console.log(`${label} ${mark} ${value}（建议 ≤ ${item.limit}）：${item.note}`)
  }
  console.log()
}

/**
 * 把七维分数做成与环节同形状的结果行。
 *
 * @param report 结构化打分
 */
export function scoreRows(report: ScoreReport): StageRow[] {
  const rows = report.dimensions.map((dim, index) =>
    row(
      index + 1,
      dim.name,
      dim.score >= DIM_PASS_SCORE,
      `${dim.score}/5 —— ${dim.basis}`,
    ),
  )
  rows.push(
    row(
      8,
      '总分',
      report.total_score >= PASS_SCORE,
      `${report.total_score}/35，${PASS_SCORE} 分起算通过`,
    ),
  )
  return rows
}

/**
 * 回显三个参数，让人一眼看到本次跑的是哪一组。
 */
export function echoParams(input: {
  request: string
  skillArg: string
  skillsRootArg: string
  skillDir: string | null
  skillsRoot: string
  skillsRootExists: boolean
}) {
  console.log('===== 参数 =====')
  console.log(`用户指令    ：${input.request}`)
  console.log(
    `待校验 skill：${input.skillArg}  ->  ${input.skillDir ?? '(未找到)'}`,
  )
  console.log(
    `skills 根目录：${input.skillsRootArg}  ->  ${input.skillsRootExists ? input.skillsRoot : '(未找到)'}`,
  )
  console.log()
}
