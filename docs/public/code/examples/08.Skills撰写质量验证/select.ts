/**
 * @file 环节 3：模型按决策卡路由
 * @description 只看 name / description / keywords，不碰 SKILL.md 正文。
 */
import type OpenAI from 'openai'

import type { DecisionCard } from './catalog'
import { inspectJson, requestJson } from './inspect'
import {
  describeSelectionContract,
  SelectionResultSchema,
  type SelectionResult,
} from './schema'

export type Selection = {
  skillId: string
  selectedBy: 'model'
  reason: string
}

export type Rejection = {
  skillId: string
  reasonCode: string
  reason: string
}

/**
 * 让模型对每一张决策卡给出是否选用。未知 skill_id 由宿主丢掉。
 *
 * @param client OpenAI 兼容客户端
 * @param model 模型名
 * @param userInput 用户指令
 * @param cards 决策卡（不含正文）
 * @throws {Error} JSON 未通过契约
 */
export async function selectModelBased(
  client: OpenAI,
  model: string,
  userInput: string,
  cards: DecisionCard[],
): Promise<{ selections: Selection[]; rejections: Rejection[]; raw: SelectionResult }> {
  const catalog = cards.map((card) => ({
    skill_id: card.skillId,
    description: card.description,
    keywords: card.keywords,
  }))

  const raw = await requestJson(client, model, [
    {
      role: 'system',
      content:
        '你是 skill 路由器。只能对 decision_cards 里出现过的 skill_id 做判断，为每一个候选给出 selected 与中文 reason。不要因为中英文不同就判不相关。',
    },
    {
      role: 'user',
      content: [
        `用户指令：${userInput}`,
        '',
        'decision_cards：',
        JSON.stringify(catalog, null, 2),
        '',
        describeSelectionContract(),
      ].join('\n'),
    },
  ])

  const report = inspectJson(raw, SelectionResultSchema)
  if (report.shapeCheck !== 'pass') {
    throw new Error(`select 结构化输出未通过契约：${JSON.stringify(report)}`)
  }

  const knownIds = new Set(cards.map((card) => card.skillId))
  const selections: Selection[] = []
  const rejections: Rejection[] = []

  for (const judgement of report.data.judgements) {
    if (!knownIds.has(judgement.skill_id)) {
      continue
    }
    if (judgement.selected) {
      selections.push({
        skillId: judgement.skill_id,
        selectedBy: 'model',
        reason: judgement.reason,
      })
    } else {
      rejections.push({
        skillId: judgement.skill_id,
        reasonCode: 'model_rejected',
        reason: judgement.reason,
      })
    }
  }

  return { selections, rejections, raw: report.data }
}
