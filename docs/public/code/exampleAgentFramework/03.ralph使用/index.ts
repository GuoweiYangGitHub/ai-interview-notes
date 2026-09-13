/**
 * @file Mini Ralph
 * @description 从 ralph_demo.py 抽出的编排循环。运行：`npm run ralph`
 *
 * 下次先看这四件事：
 * 1. 帽子系统：Planner → Builder → Critic → Finalizer，各戴各的 system prompt
 * 2. 背压门控：Host 跑测试，不过就不换下一顶帽子
 * 3. 仓库即记录：帽子之间只读 scratchpad.md，不传对话历史
 * 4. 自我纠正：Builder 凭测试输出修文件，不能自己宣布通过
 */
import 'dotenv/config'

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from './client'
import { extractFiles, runTests, writeExtractedFiles } from './harness'
import { HAT_BUILDER, HAT_CRITIC, HAT_FINALIZER, HAT_PLANNER } from './hats'
import { DEFAULT_PROMPT } from './prompt'
import { appendScratchpad, initScratchpad, readScratchpad } from './scratchpad'

const ROOT = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(ROOT, 'ralph_output')
const SCRATCHPAD = join(OUTPUT_DIR, 'scratchpad.md')
const MAX_REPAIR = 2

/**
 * 戴一顶帽子问模型。不携带上一顶帽子的 messages。
 *
 * @param system 当前帽子
 * @param user 本轮材料（任务 / scratchpad / 测试输出）
 */
async function wearHat(system: string, user: string) {
  const { client, model } = createClient()
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })
  const text = response.choices[0]?.message.content?.trim()
  if (!text) {
    throw new Error('当前帽子没有返回文本')
  }
  return text
}

function printHat(hat: string) {
  console.log(`\n=== ${hat} ===`)
}

/**
 * 让 Builder 产出文件；格式不对就加一句约束再要一次。
 *
 * @param user 计划或失败测试
 */
async function requestFiles(user: string) {
  let response = await wearHat(HAT_BUILDER, user)
  let files = extractFiles(response)
  if (Object.keys(files).length === 0) {
    response = await wearHat(
      `${HAT_BUILDER}\n\n必须使用 ===FILE:文件名=== 与 ===END=== 包裹每个文件。`,
      user,
    )
    files = extractFiles(response)
  }
  if (Object.keys(files).length === 0) {
    throw new Error('Builder 没有按文件块格式输出')
  }
  return files
}

async function main() {
  console.log('Ralph 精华：帽子换人 / 测试背压 / 文件当记忆 / 失败自修')
  console.log(`输出: ${OUTPUT_DIR}`)

  await initScratchpad(SCRATCHPAD)

  printHat('Planner')
  const plan = await wearHat(HAT_PLANNER, `任务描述:\n\n${DEFAULT_PROMPT}`)
  console.log(plan)
  await appendScratchpad(SCRATCHPAD, 'Planner', plan)

  let passed = false
  let testOutput = ''
  let files: Record<string, string> = {}

  for (let attempt = 1; attempt <= MAX_REPAIR + 1; attempt += 1) {
    const hat = attempt === 1 ? 'Builder' : `Builder 修复 #${attempt - 1}`
    printHat(hat)

    const user =
      attempt === 1
        ? `任务描述:\n${DEFAULT_PROMPT}\n\n计划:\n${await readScratchpad(SCRATCHPAD)}`
        : [
            `任务描述:\n${DEFAULT_PROMPT}`,
            '测试失败，按输出修复。仍然用 ===FILE=== 输出完整文件。',
            `测试输出:\n${testOutput.slice(-1200)}`,
            `当前文件:\n${Object.entries(files)
              .map(([name, content]) => `--- ${name} ---\n${content}`)
              .join('\n\n')}`,
          ].join('\n\n')

    files = await requestFiles(user)
    const written = await writeExtractedFiles(OUTPUT_DIR, files)
    console.log(
      `已写入: ${written.map((path) => path.split(/[\\/]/).pop()).join(', ')}`,
    )

    const gate = await runTests(OUTPUT_DIR)
    passed = gate.passed
    testOutput = gate.output
    console.log(`测试: ${passed ? '通过' : '失败（背压，不换帽）'}`)
    if (!passed) {
      console.log(testOutput.slice(-800))
    }
    await appendScratchpad(
      SCRATCHPAD,
      hat,
      `文件: ${Object.keys(files).join(', ')}\n测试: ${passed ? 'PASS' : 'FAIL'}\n\n${testOutput.slice(-500)}`,
    )

    if (passed) {
      break
    }
  }

  if (!passed) {
    console.log('\n背压：测试仍失败，不进入 Critic / Finalizer。')
    console.log(`完整记录: ${SCRATCHPAD}`)
    return
  }

  printHat('Critic')
  const review = await wearHat(
    HAT_CRITIC,
    [
      '请审查以下代码和测试结果:\n',
      ...Object.entries(files).map(
        ([name, content]) => `--- ${name} ---\n${content}`,
      ),
      `--- 测试运行结果 ---\n${testOutput}`,
    ].join('\n\n'),
  )
  console.log(review)
  await appendScratchpad(SCRATCHPAD, 'Critic', review)
  if (review.includes('VERDICT: FAILED')) {
    console.log('\n背压：审查未通过，不进入 Finalizer。')
    console.log(`完整记录: ${SCRATCHPAD}`)
    return
  }

  printHat('Finalizer')
  const finale = await wearHat(
    HAT_FINALIZER,
    `任务描述:\n${DEFAULT_PROMPT}\n\n完整记录:\n${await readScratchpad(SCRATCHPAD)}\n\n最终测试:\n${testOutput}`,
  )
  console.log(finale)
  await appendScratchpad(SCRATCHPAD, 'Finalizer', finale)

  console.log(
    finale.includes('LOOP_COMPLETE')
      ? '\nLOOP_COMPLETE'
      : '\nFinalizer 未确认完成',
  )
  console.log(`完整记录: ${SCRATCHPAD}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
