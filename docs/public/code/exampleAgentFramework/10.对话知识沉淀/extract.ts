/**
 * @file 从对话提取知识点，并按类型合并
 */
import { createClient } from './client'
import {
  ExtractResultSchema,
  MergedItemSchema,
  isTransientType,
  type ExtractResult,
  type KnowledgeItem,
  type MergedItem,
} from './schema'

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
  prompt: string,
  temperature: number,
): Promise<string> {
  const { client, model } = createClient()
  const response = await client.chat.completions.create({
    model,
    temperature,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  })
  const raw = response.choices[0]?.message.content?.trim()
  if (!raw) {
    throw new Error('模型没有返回 JSON')
  }
  return stripFence(raw)
}

export async function extractKnowledge(
  conversation: string,
): Promise<ExtractResult> {
  const prompt = [
    '你是知识提取专家。从对话中提取：事实、需求、问题、流程、注意。',
    '只返回 JSON：',
    '{ "extracted_knowledge": [{ "knowledge_type", "content", "confidence", "source", "keywords", "category" }], "conversation_summary": string, "user_intent": string }',
    'knowledge_type 用 事实/需求/问题/流程/注意。confidence 为 0-1。',
    '### 对话内容 ###',
    conversation,
  ].join('\n\n')
  const raw = await requestJson(prompt, 0.3)
  const parsed = ExtractResultSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    throw new Error(`提取结果未通过契约: ${parsed.error.message}`)
  }
  return parsed.data
}

export async function batchExtract(conversations: string[]): Promise<{
  items: KnowledgeItem[]
  frequency: Map<string, number>
}> {
  const items: KnowledgeItem[] = []
  const frequency = new Map<string, number>()
  for (const [index, conversation] of conversations.entries()) {
    console.log(`正在处理对话 ${index + 1}/${conversations.length}...`)
    const result = await extractKnowledge(conversation)
    for (const item of result.extracted_knowledge) {
      items.push(item)
      const key = `${item.knowledge_type}:${item.content.slice(0, 50)}`
      frequency.set(key, (frequency.get(key) ?? 0) + 1)
    }
  }
  return { items, frequency }
}

async function mergeGroup(
  group: KnowledgeItem[],
  knowledgeType: string,
): Promise<MergedItem> {
  if (group.length === 1) {
    const only = group[0]
    return {
      knowledge_type: knowledgeType,
      content: only.content,
      confidence: only.confidence,
      keywords: only.keywords,
      category: only.category,
      sources: [only.source],
      frequency: 1,
    }
  }

  const block = group
    .map(
      (item, index) =>
        `${index + 1}. 内容: ${item.content}\n   置信度: ${item.confidence}\n   分类: ${item.category}\n   来源: ${item.source}\n   关键词: ${item.keywords.join(', ')}`,
    )
    .join('\n')

  const prompt = [
    `把下列「${knowledgeType}」知识点合并成一条更完整的知识。保留重要信息，去掉重复。置信度取最高。`,
    '只返回 JSON：{ "knowledge_type", "content", "confidence", "keywords", "category", "sources", "frequency" }',
    `frequency 必须是 ${group.length}。`,
    '### 待合并 ###',
    block,
  ].join('\n\n')

  try {
    const raw = await requestJson(prompt, 0.3)
    const parsed = MergedItemSchema.safeParse({
      ...JSON.parse(raw),
      knowledge_type: knowledgeType,
      frequency: group.length,
    })
    if (!parsed.success) {
      throw parsed.error
    }
    return parsed.data
  } catch {
    const best = group.reduce((a, b) => (a.confidence >= b.confidence ? a : b))
    return {
      knowledge_type: knowledgeType,
      content: best.content,
      confidence: best.confidence,
      keywords: [...new Set(group.flatMap((item) => item.keywords))],
      category: best.category,
      sources: [...new Set(group.map((item) => item.source))],
      frequency: group.length,
    }
  }
}

export async function mergeSimilarKnowledge(
  items: KnowledgeItem[],
): Promise<MergedItem[]> {
  const filtered = items.filter((item) => !isTransientType(item.knowledge_type))
  console.log(`过滤前知识点数量: ${items.length}`)
  console.log(`过滤后知识点数量: ${filtered.length}`)
  console.log(
    `过滤掉的「需求」和「问题」类型: ${items.length - filtered.length}`,
  )

  const groups = new Map<string, KnowledgeItem[]>()
  for (const item of filtered) {
    const list = groups.get(item.knowledge_type) ?? []
    list.push(item)
    groups.set(item.knowledge_type, list)
  }

  const merged: MergedItem[] = []
  for (const [type, group] of groups) {
    merged.push(await mergeGroup(group, type))
  }
  return merged
}
