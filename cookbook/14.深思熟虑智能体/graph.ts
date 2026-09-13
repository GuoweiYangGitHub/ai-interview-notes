/**
 * 深思熟虑投研：感知 → 建模 → 推理 → 决策 → 报告。
 */
import { HumanMessage } from '@langchain/core/messages'
import { Annotation, END, START, StateGraph } from '@langchain/langgraph'
import { z } from 'zod'

import { createChatModel } from './client'
import {
  DecisionSchema,
  ModelingSchema,
  PerceptionSchema,
  ReasoningSchema,
  type Decision,
  type Modeling,
  type Perception,
  type Plan,
} from './schema'

export const ResearchState = Annotation.Root({
  researchTopic: Annotation<string>,
  industryFocus: Annotation<string>,
  timeHorizon: Annotation<string>,
  perceptionData: Annotation<Perception | undefined>,
  worldModel: Annotation<Modeling | undefined>,
  reasoningPlans: Annotation<Plan[] | undefined>,
  selectedPlan: Annotation<Decision | undefined>,
  finalReport: Annotation<string | undefined>,
})

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

async function requestJson(prompt: string): Promise<unknown> {
  const model = createChatModel(0.3)
  const response = await model.invoke([new HumanMessage(prompt)], {
    response_format: { type: 'json_object' },
  })
  const text =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content)
  return JSON.parse(stripFence(text))
}

function parseWith<T>(schema: z.ZodType<T>, value: unknown, label: string): T {
  const parsed = schema.safeParse(value)
  if (!parsed.success) {
    throw new Error(`${label} 未通过契约: ${parsed.error.message}`)
  }
  return parsed.data
}

function context(state: typeof ResearchState.State): string {
  return `研究主题: ${state.researchTopic}\n行业焦点: ${state.industryFocus}\n时间范围: ${state.timeHorizon}`
}

async function perception(state: typeof ResearchState.State) {
  console.log('1. 感知：收集市场数据和信息...')
  const raw = await requestJson(`你是投资研究分析师。根据主题整理市场感知。
${context(state)}

只返回 JSON：{
  "market_overview": string,
  "key_indicators": { [指标名]: string },
  "recent_news": string[]（至少 3 条）,
  "industry_trends": { [细分领域]: string }
}`)
  return { perceptionData: parseWith(PerceptionSchema, raw, '感知') }
}

async function modeling(state: typeof ResearchState.State) {
  console.log('2. 建模：构建内部世界模型...')
  const raw = await requestJson(`你是投资策略师。根据感知数据构建市场内部模型。
${context(state)}
市场数据: ${JSON.stringify(state.perceptionData, null, 2)}

只返回 JSON：{
  "market_state": string,
  "economic_cycle": string,
  "risk_factors": string[]（至少 3 条）,
  "opportunity_areas": string[]（至少 3 条）,
  "market_sentiment": string
}`)
  return { worldModel: parseWith(ModelingSchema, raw, '建模') }
}

async function reasoning(state: typeof ResearchState.State) {
  console.log('3. 推理：生成 3 个候选方案...')
  const raw = await requestJson(`你是战略投资顾问。根据世界模型给出 3 个明显不同的投资分析方案。
${context(state)}
世界模型: ${JSON.stringify(state.worldModel, null, 2)}

只返回 JSON：{ "plans": [{ "plan_id", "hypothesis", "analysis_approach", "expected_outcome", "confidence_level", "pros": string[], "cons": string[] }] }`)
  const result = parseWith(ReasoningSchema, raw, '推理')
  console.log(
    `   方案: ${result.plans.map((plan) => `${plan.plan_id}(${Number(plan.confidence_level).toFixed(2)})`).join(', ')}`,
  )
  return { reasoningPlans: result.plans }
}

async function decision(state: typeof ResearchState.State) {
  console.log('4. 决策：选择最优方案...')
  const raw = await requestJson(`你是投资决策委员会主席。从候选方案里选一个并给出决策。
${context(state)}
世界模型: ${JSON.stringify(state.worldModel, null, 2)}
候选方案: ${JSON.stringify(state.reasoningPlans, null, 2)}

只返回 JSON：{
  "selected_plan_id",
  "investment_thesis",
  "supporting_evidence": string[],
  "risk_assessment",
  "recommendation",
  "timeframe"
}`)
  const result = parseWith(DecisionSchema, raw, '决策')
  console.log(`   选中: ${result.selected_plan_id}`)
  return { selectedPlan: result }
}

async function report(state: typeof ResearchState.State) {
  console.log('5. 报告：撰写投研报告...')
  const model = createChatModel(0.3)
  const response = await model.invoke([
    new HumanMessage(`你是投研报告撰写人。写一份结构完整的中文报告：标题摘要、背景、核心观点、论证、风险、建议、时间框架。
${context(state)}
感知: ${JSON.stringify(state.perceptionData, null, 2)}
模型: ${JSON.stringify(state.worldModel, null, 2)}
决策: ${JSON.stringify(state.selectedPlan, null, 2)}`),
  ])
  const text =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content)
  return { finalReport: text }
}

export function createResearchGraph() {
  return new StateGraph(ResearchState)
    .addNode('perception', perception)
    .addNode('modeling', modeling)
    .addNode('reasoning', reasoning)
    .addNode('decision', decision)
    .addNode('report', report)
    .addEdge(START, 'perception')
    .addEdge('perception', 'modeling')
    .addEdge('modeling', 'reasoning')
    .addEdge('reasoning', 'decision')
    .addEdge('decision', 'report')
    .addEdge('report', END)
    .compile()
}

export async function runResearchAgent(
  researchTopic: string,
  industryFocus: string,
  timeHorizon: string,
) {
  const graph = createResearchGraph()
  return graph.invoke({
    researchTopic,
    industryFocus,
    timeHorizon,
  })
}
