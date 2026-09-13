/**
 * @file 原文 BM25 与「内容+问题」BM25 检索
 */
import { Bm25Index } from './bm25'
import type { GeneratedQuestion, KnowledgeChunk } from './sample'
import { tokenize } from './tokenize'

export type SearchHit = {
  chunkId: string
  content: string
  score: number
  kind: 'content' | 'question'
}

type IndexedDoc = {
  tokens: string[]
  chunkId: string
  content: string
}

export class DualBm25 {
  private contentIndex: Bm25Index | null = null
  private questionIndex: Bm25Index | null = null
  private contentDocs: IndexedDoc[] = []
  private questionDocs: IndexedDoc[] = []

  build(chunks: KnowledgeChunk[]) {
    this.contentDocs = []
    this.questionDocs = []
    for (const chunk of chunks) {
      const contentTokens = tokenize(chunk.content)
      if (contentTokens.length > 0) {
        this.contentDocs.push({
          tokens: contentTokens,
          chunkId: chunk.id,
          content: chunk.content,
        })
      }
      for (const item of chunk.generatedQuestions ?? []) {
        const combined = `内容：${chunk.content} 问题：${item.question}`
        const tokens = tokenize(combined)
        if (tokens.length > 0) {
          this.questionDocs.push({
            tokens,
            chunkId: chunk.id,
            content: chunk.content,
          })
        }
      }
    }
    this.contentIndex =
      this.contentDocs.length > 0
        ? new Bm25Index(this.contentDocs.map((doc) => doc.tokens))
        : null
    this.questionIndex =
      this.questionDocs.length > 0
        ? new Bm25Index(this.questionDocs.map((doc) => doc.tokens))
        : null
  }

  search(query: string, kind: 'content' | 'question', k = 1): SearchHit[] {
    const index = kind === 'content' ? this.contentIndex : this.questionIndex
    const docs = kind === 'content' ? this.contentDocs : this.questionDocs
    if (!index || docs.length === 0) {
      return []
    }
    const queryTokens = tokenize(query)
    if (queryTokens.length === 0) {
      return []
    }
    const scores = index.scores(queryTokens)
    return scores
      .map((score, i) => ({ score, i }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((row) => ({
        chunkId: docs[row.i].chunkId,
        content: docs[row.i].content,
        score: row.score,
        kind,
      }))
  }
}

export function evaluateRetrieval(
  store: DualBm25,
  tests: { query: string; correctChunkId: string }[],
) {
  return tests.map((test) => {
    const contentHit = store.search(test.query, 'content', 1)[0]
    const questionHit = store.search(test.query, 'question', 1)[0]
    const contentCorrect = contentHit?.chunkId === test.correctChunkId
    const questionCorrect = questionHit?.chunkId === test.correctChunkId
    return {
      query: test.query,
      contentScore: contentHit?.score ?? 0,
      questionScore: questionHit?.score ?? 0,
      contentCorrect,
      questionCorrect,
      improved: questionCorrect && !contentCorrect,
      contentChunkId: contentHit?.chunkId,
      questionChunkId: questionHit?.chunkId,
    }
  })
}

export type { GeneratedQuestion }
