/**
 * @file 对话知识提取契约
 */
import { z } from 'zod'

const Score = z.coerce
  .number()
  .transform((value) => (value > 1 ? value / 100 : value))
  .pipe(z.number().min(0).max(1))

function asStringList(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return value
}

export const KnowledgeItemSchema = z.object({
  knowledge_type: z.string().min(1),
  content: z.string().min(1),
  confidence: Score,
  source: z.string().min(1),
  keywords: z.preprocess(asStringList, z.array(z.string()).default([])),
  category: z.string().min(1),
  frequency: z.coerce.number().optional(),
  sources: z.array(z.string()).optional(),
})

export const ExtractResultSchema = z.object({
  extracted_knowledge: z.array(KnowledgeItemSchema),
  conversation_summary: z.string().min(1),
  user_intent: z.string().min(1),
})

export const MergedItemSchema = z.object({
  knowledge_type: z.string().min(1),
  content: z.string().min(1),
  confidence: Score,
  keywords: z.array(z.string()).default([]),
  category: z.string().min(1),
  sources: z.array(z.string()).default([]),
  frequency: z.coerce.number().int().positive(),
})

export type KnowledgeItem = z.infer<typeof KnowledgeItemSchema>
export type ExtractResult = z.infer<typeof ExtractResultSchema>
export type MergedItem = z.infer<typeof MergedItemSchema>

export const TRANSIENT_TYPES = ['需求', '问题'] as const

export function isTransientType(knowledgeType: string): boolean {
  return TRANSIENT_TYPES.some((item) => knowledgeType.includes(item))
}
