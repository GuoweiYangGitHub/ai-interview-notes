/**
 * @file 未命中诊断
 * @description 只解释 description 够不够，不改 select 的判定。
 */
import type OpenAI from 'openai'

import type { DecisionCard } from './catalog'
import { inspectJson, requestJson } from './inspect'
import { DiagnosisSchema, type Diagnosis } from './schema'

const TRIGGER_MARKERS = [
  'use when',
  'use this skill',
  'whenever',
  'trigger',
  '当用户',
  '适用于',
  '用于',
]

export type DescriptionLint = {
  description_length: number
  has_trigger_clause: boolean
  keywords_count: number
}

export type DiagnosisResult = Diagnosis & {
  kind: 'truly_irrelevant' | 'description_gap'
  detail: string
  lint: DescriptionLint
}

/**
 * 零成本字符串扫描：只看 description 写得好不好。
 *
 * @param card 目标决策卡
 */
export function lintDescription(card: DecisionCard): DescriptionLint {
  const text = (card.description || '').toLowerCase()
  return {
    description_length: (card.description || '').length,
    has_trigger_clause: TRIGGER_MARKERS.some((marker) => text.includes(marker)),
    keywords_count: card.keywords.length,
  }
}

/**
 * 未命中时单独问一次：是描述写得不够，还是真的不相关。
 *
 * @param client OpenAI 兼容客户端
 * @param model 模型名
 * @param request 用户指令
 * @param card 目标决策卡
 * @throws {Error} JSON 未通过契约
 */
export async function diagnose(
  client: OpenAI,
  model: string,
  request: string,
  card: DecisionCard,
): Promise<DiagnosisResult> {
  const lint = lintDescription(card)
  const raw = await requestJson(client, model, [
    {
      role: 'system',
      content:
        '判断这条指令与这份 Skill 元数据的语义相关程度。不要因为中英文不同就判不相关。只返回 JSON。',
    },
    {
      role: 'user',
      content: [
        `用户指令：${request}`,
        '',
        'Skill 元数据：',
        JSON.stringify(
          {
            name: card.skillId,
            description: card.description,
            keywords: card.keywords,
          },
          null,
          2,
        ),
        '',
        '字段：',
        '- relevance: none=真的不相关；weak=沾边但不该触发；strong=语义上就该触发',
        '- evidence_in_request: 指令里与该 Skill 有关的信号词，没有就给 []',
        '- missing_in_description: 指令里有、描述里没有的语义信号',
        '- suggested_trigger_terms: 建议补进 description 的触发词',
      ].join('\n'),
    },
  ])

  const report = inspectJson(raw, DiagnosisSchema)
  if (report.shapeCheck !== 'pass') {
    throw new Error(`diagnose 结构化输出未通过契约：${JSON.stringify(report)}`)
  }

  const relevance = report.data.relevance
  if (relevance === 'none') {
    return {
      ...report.data,
      kind: 'truly_irrelevant',
      detail: '模型判断这条指令与这个 skill 语义上确实不相关，描述本身没问题。',
      lint,
    }
  }

  return {
    ...report.data,
    kind: 'description_gap',
    detail: `模型判断语义相关度为 ${relevance}，本该命中却没被选中，说明 description 的触发边界写得不够。`,
    lint,
  }
}
