/**
 * 反应式私募问答：createAgent + 三件查库工具。
 */
import { createAgent, tool } from 'langchain'
import { z } from 'zod'

import { createChatModel } from './client'
import { FUND_RULES, type FundRule } from './rules'

function formatRule(rule: FundRule): string {
  return `类别: ${rule.category}\n问题: ${rule.question}\n答案: ${rule.answer}`
}

function tokenize(text: string): string[] {
  const tokens: string[] = []
  for (const match of text.toLowerCase().matchAll(/[a-z0-9]+/g)) {
    tokens.push(match[0])
  }
  const chars = [...text].filter((ch) => /[\u4e00-\u9fff]/.test(ch))
  for (let i = 0; i < chars.length - 1; i++) {
    tokens.push(chars[i] + chars[i + 1])
  }
  return tokens.filter((token) => token.length > 1)
}

function searchByKeywords(keywords: string): string {
  const parts = keywords
    .split(/[,，\s]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  const ranked = FUND_RULES.map((rule) => {
    const hay = `${rule.category} ${rule.question} ${rule.answer}`.toLowerCase()
    const hits = parts.filter((kw) => hay.includes(kw)).length
    return { rule, hits }
  })
    .filter((row) => row.hits > 0)
    .sort((a, b) => b.hits - a.hits)

  if (ranked.length === 0) {
    return '未找到与关键词相关的规则。'
  }
  return ranked.slice(0, 2).map((row) => formatRule(row.rule)).join('\n\n')
}

function searchByCategory(category: string): string {
  const needle = category.trim().toLowerCase()
  const matched = FUND_RULES.filter((rule) =>
    rule.category.toLowerCase().includes(needle),
  )
  if (matched.length === 0) {
    return `未找到类别为「${category}」的规则。可选：设立与募集、监管规定。`
  }
  return matched.map((rule) => formatRule(rule)).join('\n\n')
}

function answerFromStore(query: string): string {
  const queryTokens = new Set(tokenize(query))
  let best: FundRule | null = null
  let bestScore = 0
  for (const rule of FUND_RULES) {
    const hay = tokenize(`${rule.question} ${rule.category}`)
    const hits = hay.filter((token) => queryTokens.has(token)).length
    const score = hits / Math.max(1, queryTokens.size)
    if (score > bestScore) {
      bestScore = score
      best = rule
    }
  }
  if (!best || bestScore < 0.08) {
    return '在知识库中未找到与该问题直接相关的信息。请尝试关键词搜索或类别查询。'
  }
  return `根据知识库信息：\n\n${formatRule(best)}`
}

function createTools() {
  return [
    tool(
      async ({ keywords }) => searchByKeywords(keywords),
      {
        name: 'search_rules_by_keywords',
        description:
          '通过关键词搜索私募基金规则。多个关键词用逗号或空格分隔。',
        schema: z.object({
          keywords: z.string().describe('关键词，例如 合格投资者、风险准备金'),
        }),
      },
    ),
    tool(
      async ({ category }) => searchByCategory(category),
      {
        name: 'search_rules_by_category',
        description: '按类别查询。可选：设立与募集、监管规定。',
        schema: z.object({
          category: z.string().describe('类别名称'),
        }),
      },
    ),
    tool(
      async ({ query }) => answerFromStore(query),
      {
        name: 'answer_question',
        description: '用完整用户问题在知识库里找最接近的一条规则。',
        schema: z.object({
          query: z.string().describe('完整用户问题'),
        }),
      },
    ),
  ]
}

export function createFundQaAgent() {
  return createAgent({
    model: createChatModel(),
    tools: createTools(),
    systemPrompt: `你是私募基金问答助手，只用工具查演示知识库，不要编造条文。

工具：
1. search_rules_by_keywords：关键词搜索
2. search_rules_by_category：按类别（设立与募集、监管规定）
3. answer_question：按完整问题找最近的一条

规则：
- 知识库没有就明确说「对不起，在我的知识库中没有关于[主题]的详细信息」。
- 若补充一般经验，必须以「根据我的经验」或「一般来说」开头。
- 回答专业、简洁、用中文。`,
  })
}

export function lastText(messages: Array<{ content?: unknown }>): string {
  const last = messages.at(-1)
  const content = last?.content
  if (typeof content === 'string') {
    return content
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part
        }
        if (part && typeof part === 'object' && 'text' in part) {
          return String((part as { text?: string }).text ?? '')
        }
        return ''
      })
      .join('')
  }
  return JSON.stringify(content ?? '')
}

export async function askFundQa(question: string): Promise<string> {
  const agent = createFundQaAgent()
  const result = await agent.invoke({
    messages: [{ role: 'user', content: question }],
  })
  return lastText(result.messages as Array<{ content?: unknown }>)
}
