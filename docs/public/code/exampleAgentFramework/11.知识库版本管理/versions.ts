/**
 * @file 知识库版本：创建、diff、统计
 */
import type { Chunk } from './sample'

export type VersionStats = {
  totalChunks: number
  totalContentLength: number
  averageChunkLength: number
}

export type VersionRecord = {
  name: string
  description: string
  createdDate: string
  knowledgeBase: Chunk[]
  statistics: VersionStats
}

export type VersionDiff = {
  added: Chunk[]
  removed: Chunk[]
  modified: { id: string; oldContent: string; newContent: string }[]
  unchanged: string[]
}

export function statistics(chunks: Chunk[]): VersionStats {
  const totalChunks = chunks.length
  const totalContentLength = chunks.reduce(
    (sum, chunk) => sum + chunk.content.length,
    0,
  )
  return {
    totalChunks,
    totalContentLength,
    averageChunkLength: totalChunks === 0 ? 0 : totalContentLength / totalChunks,
  }
}

export function createVersion(
  chunks: Chunk[],
  name: string,
  description: string,
): VersionRecord {
  return {
    name,
    description,
    createdDate: new Date().toISOString(),
    knowledgeBase: chunks,
    statistics: statistics(chunks),
  }
}

export function diffVersions(
  older: VersionRecord,
  newer: VersionRecord,
): VersionDiff {
  const a = new Map(older.knowledgeBase.map((chunk) => [chunk.id, chunk]))
  const b = new Map(newer.knowledgeBase.map((chunk) => [chunk.id, chunk]))
  const added: Chunk[] = []
  const removed: Chunk[] = []
  const modified: VersionDiff['modified'] = []
  const unchanged: string[] = []

  for (const [id, chunk] of b) {
    if (!a.has(id)) {
      added.push(chunk)
    }
  }
  for (const [id, chunk] of a) {
    if (!b.has(id)) {
      removed.push(chunk)
    }
  }
  for (const [id, oldChunk] of a) {
    const next = b.get(id)
    if (!next) {
      continue
    }
    if (oldChunk.content !== next.content) {
      modified.push({
        id,
        oldContent: oldChunk.content,
        newContent: next.content,
      })
    } else {
      unchanged.push(id)
    }
  }

  return { added, removed, modified, unchanged }
}
