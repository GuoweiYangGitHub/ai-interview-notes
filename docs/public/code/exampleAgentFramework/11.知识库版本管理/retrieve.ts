/**
 * @file 版本检索：有 embedding 密钥走余弦，否则走字面重叠
 */
import { createEmbeddingClient } from './client'
import type { TestQuery } from './sample'
import type { VersionRecord } from './versions'

export type RetrieveHit = {
  id: string
  content: string
  score: number
}

function tokenize(text: string): string[] {
  const tokens: string[] = []
  for (const match of text.matchAll(/[A-Za-z0-9]+/g)) {
    tokens.push(match[0].toLowerCase())
  }
  const chars = [...text].filter((ch) => /[\u4e00-\u9fff]/.test(ch))
  for (let i = 0; i < chars.length - 1; i++) {
    tokens.push(chars[i] + chars[i + 1])
  }
  return tokens
}

function lexicalScore(query: string, content: string): number {
  const q = new Set(tokenize(query))
  if (q.size === 0) {
    return 0
  }
  const doc = new Set(tokenize(content))
  let hit = 0
  for (const token of q) {
    if (doc.has(token)) {
      hit += 1
    }
  }
  return hit / q.size
}

function cosine(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) {
    return 0
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

async function embedAll(texts: string[]): Promise<number[][] | null> {
  const embedding = createEmbeddingClient()
  if (!embedding) {
    return null
  }
  const response = await embedding.client.embeddings.create({
    model: embedding.model,
    input: texts,
  })
  return response.data.map((row) => row.embedding)
}

export async function retrieve(
  version: VersionRecord,
  query: string,
  k = 3,
): Promise<{ hits: RetrieveHit[]; mode: 'embedding' | 'lexical' }> {
  const chunks = version.knowledgeBase
  const vectors = await embedAll([
    query,
    ...chunks.map((chunk) => chunk.content),
  ])
  if (!vectors) {
    const ranked = chunks
      .map((chunk) => ({
        id: chunk.id,
        content: chunk.content,
        score: lexicalScore(query, chunk.content),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .filter((row) => row.score > 0)
    return { hits: ranked, mode: 'lexical' }
  }
  const [queryVec, ...docVecs] = vectors
  const ranked = chunks
    .map((chunk, index) => ({
      id: chunk.id,
      content: chunk.content,
      score: cosine(queryVec, docVecs[index]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
  return { hits: ranked, mode: 'embedding' }
}

export function hitExpected(hits: RetrieveHit[], expected: string): boolean {
  const needle = expected.toLowerCase()
  return hits.some((hit) => hit.content.toLowerCase().includes(needle))
}

export async function evaluateVersion(
  version: VersionRecord,
  tests: TestQuery[],
) {
  let correct = 0
  const times: number[] = []
  const rows: {
    query: string
    retrieved: number
    responseTime: number
    passed: boolean
  }[] = []
  let mode: 'embedding' | 'lexical' = 'lexical'

  for (const test of tests) {
    const started = Date.now()
    const { hits, mode: used } = await retrieve(version, test.query, 3)
    mode = used
    const elapsed = (Date.now() - started) / 1000
    times.push(elapsed)
    const passed = hitExpected(hits, test.expectedAnswer)
    if (passed) {
      correct += 1
    }
    rows.push({
      query: test.query,
      retrieved: hits.length,
      responseTime: elapsed,
      passed,
    })
  }

  return {
    mode,
    accuracy: tests.length === 0 ? 0 : correct / tests.length,
    avgResponseTime:
      times.length === 0 ? 0 : times.reduce((a, b) => a + b, 0) / times.length,
    totalQueries: tests.length,
    correctAnswers: correct,
    rows,
  }
}

export function recommend(
  acc1: number,
  acc2: number,
  time1: number,
  time2: number,
): string {
  if (acc2 > acc1 && time2 <= time1) {
    return `推荐使用版本2，准确率提升${((acc2 - acc1) * 100).toFixed(1)}%，响应时间${time2 < time1 ? '更快' : '相当'}`
  }
  if (acc2 > acc1 && time2 > time1) {
    return '版本2准确率更高但响应时间较长，需要权衡'
  }
  if (acc2 < acc1 && time2 < time1) {
    return '版本2响应更快但准确率较低，需要权衡'
  }
  return '推荐使用版本1，性能更优'
}
