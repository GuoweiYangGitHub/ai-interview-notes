/**
 * @file 三次 LLM 检查与加权打分
 */
import type OpenAI from 'openai'
import { z } from 'zod'

import { createClient } from './client'
import {
  ConflictResultSchema,
  MissingResultSchema,
  OutdatedResultSchema,
  describeConflictContract,
  describeMissingContract,
  describeOutdatedContract,
  type ConflictResult,
  type HealthReport,
  type KnowledgeChunk,
  type MissingResult,
  type OutdatedResult,
  type TestQuery,
} from './schema'

function formatChunks(chunks: KnowledgeChunk[]): string {
  return chunks
    .map(
      (chunk) =>
        `ID: ${chunk.id} | 更新时间: ${chunk.lastUpdated} | 内容: ${chunk.content}`,
    )
    .join('\n')
}

function formatQueries(queries: TestQuery[]): string {
  return queries
    .map((item) => `查询: ${item.query} | 期望答案: ${item.expectedAnswer}`)
    .join('\n')
}

function stripFence(raw: string): string {
  let text = raw.trim()
  if (text.startsWith('```json')) {
    text = text.slice(7)
  } else if (text.startsWith('```')) {
    text = text.slice(3)
  }
  if (text.endsWith('```')) {
    text = text.slice(0, -3)
  }
  return text.trim()
}

async function requestJson(
  client: OpenAI,
  model: string,
  prompt: string,
): Promise<string> {
  const response = await client.chat.completions.create({
    model,
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  })
  const raw = response.choices[0]?.message.content?.trim()
  if (!raw) {
    throw new Error('模型没有返回可检查的文本')
  }
  return raw
}

function parseWith<T>(schema: z.ZodType<T>, raw: string, label: string): T {
  let parsed: unknown
  try {
    parsed = JSON.parse(stripFence(raw))
  } catch (error) {
    throw new Error(`${label} 不是合法 JSON: ${(error as Error).message}`)
  }
  const result = schema.safeParse(parsed)
  if (!result.success) {
    throw new Error(`${label} 未通过契约: ${result.error.message}`)
  }
  return result.data
}

export async function checkMissing(
  chunks: KnowledgeChunk[],
  queries: TestQuery[],
): Promise<MissingResult> {
  const { client, model } = createClient()
  const prompt = [
    '你是知识库完整性检查专家。判断测试查询能否在知识库中找到相关、完整的答案，并找出知识空白。',
    describeMissingContract(),
    '### 知识库内容 ###',
    formatChunks(chunks),
    '### 测试查询 ###',
    formatQueries(queries),
  ].join('\n\n')
  const raw = await requestJson(client, model, prompt)
  return parseWith(MissingResultSchema, raw, '缺知识检查')
}

export async function checkOutdated(
  chunks: KnowledgeChunk[],
): Promise<OutdatedResult> {
  const { client, model } = createClient()
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const prompt = [
    '你是知识时效性检查专家。找出过期或需要更新的信息：年份、价格、政策、活动、联系方式。',
    describeOutdatedContract(),
    '### 知识库内容 ###',
    formatChunks(chunks),
    `### 当前时间 ###\n${today}`,
  ].join('\n\n')
  const raw = await requestJson(client, model, prompt)
  return parseWith(OutdatedResultSchema, raw, '过期检查')
}

export async function checkConflict(
  chunks: KnowledgeChunk[],
): Promise<ConflictResult> {
  const { client, model } = createClient()
  const prompt = [
    '你是知识一致性检查专家。找出同一主题的冲突：价格、时间、规则、流程、联系方式。',
    describeConflictContract(),
    '### 知识库内容 ###',
    formatChunks(chunks),
  ].join('\n\n')
  const raw = await requestJson(client, model, prompt)
  return parseWith(ConflictResultSchema, raw, '冲突检查')
}

export function overallScore(
  missing: MissingResult,
  outdated: OutdatedResult,
  conflicting: ConflictResult,
): number {
  return (
    missing.coverage_score * 0.4 +
    outdated.freshness_score * 0.3 +
    conflicting.consistency_score * 0.3
  )
}

export function healthLevel(score: number): string {
  if (score >= 0.8) {
    return '优秀'
  }
  if (score >= 0.6) {
    return '良好'
  }
  if (score >= 0.4) {
    return '一般'
  }
  return '需要改进'
}

export function recommendations(
  missing: MissingResult,
  outdated: OutdatedResult,
  conflicting: ConflictResult,
): string[] {
  const items: string[] = []
  if (missing.missing_knowledge.length > 0) {
    items.push(
      `补充${missing.missing_knowledge.length}个缺少的知识点，提高覆盖率`,
    )
  }
  if (outdated.outdated_knowledge.length > 0) {
    items.push(
      `更新${outdated.outdated_knowledge.length}个过期知识点，确保信息时效性`,
    )
  }
  if (conflicting.conflicting_knowledge.length > 0) {
    items.push(
      `解决${conflicting.conflicting_knowledge.length}个知识冲突，提高一致性`,
    )
  }
  if (items.length === 0) {
    items.push('知识库状态良好，建议定期维护')
  }
  return items
}

export async function generateHealthReport(
  chunks: KnowledgeChunk[],
  queries: TestQuery[],
): Promise<HealthReport> {
  console.log('正在检查知识库健康度...')
  console.log('1. 检查缺少的知识...')
  const missing = await checkMissing(chunks, queries)
  console.log('2. 检查过期的知识...')
  const outdated = await checkOutdated(chunks)
  console.log('3. 检查冲突的知识...')
  const conflicting = await checkConflict(chunks)
  const score = overallScore(missing, outdated, conflicting)
  return {
    overallHealthScore: score,
    healthLevel: healthLevel(score),
    missing,
    outdated,
    conflicting,
    recommendations: recommendations(missing, outdated, conflicting),
    checkDate: new Date().toISOString(),
  }
}
