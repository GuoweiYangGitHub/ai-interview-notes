/**
 * 混合式投顾：评估后走反应式 createAgent，或深思熟虑流水线。
 */
import { HumanMessage } from '@langchain/core/messages'
import { Annotation, END, START, StateGraph } from '@langchain/langgraph'
import { createAgent } from 'langchain'
import { z } from 'zod'

import { createChatModel } from './client'
import { createWealthTools } from './tools'

const AssessSchema = z.object({
  query_type: z.enum(['emergency', 'informational', 'analytical']),
  processing_mode: z.enum(['reactive', 'deliberative']),
  reasoning: z.string(),
})

const CollectSchema = z.object({
  required_data_types: z.array(z.string()),
  data_sources: z.array(z.string()),
  collected_data: z.unknown(),
})

const AnalysisSchema = z.object({
  market_assessment: z.string(),
  portfolio_analysis: z.string(),
  recommendations: z.array(z.string()),
  risk_analysis: z.string(),
  expected_outcomes: z.string(),
})

export const AdvisorState = Annotation.Root({
  userQuery: Annotation<string>,
  customerProfile: Annotation<Record<string, unknown>>,
  queryType: Annotation<string | undefined>,
  processingMode: Annotation<'reactive' | 'deliberative' | undefined>,
  marketData: Annotation<unknown>,
  analysisResults: Annotation<unknown>,
  finalResponse: Annotation<string | undefined>,
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

function contentText(content: unknown): string {
  if (typeof content === 'string') {
    return content
  }
  return JSON.stringify(content ?? '')
}

async function requestJson(prompt: string): Promise<unknown> {
  const model = createChatModel(0.2)
  const response = await model.invoke([new HumanMessage(prompt)], {
    response_format: { type: 'json_object' },
  })
  return JSON.parse(stripFence(contentText(response.content)))
}

function parseWith<T>(schema: z.ZodType<T>, value: unknown, label: string): T {
  const parsed = schema.safeParse(value)
  if (!parsed.success) {
    throw new Error(`${label} 未通过契约: ${parsed.error.message}`)
  }
  return parsed.data
}

function lastText(messages: Array<{ content?: unknown }>): string {
  const last = messages.at(-1)
  return contentText(last?.content)
}

async function assessQuery(state: typeof AdvisorState.State) {
  console.log('[节点] assess')
  const raw = await requestJson(`你是财富管理投顾的协调层。评估用户查询该走哪条路。
用户查询: ${state.userQuery}

query_type: emergency（立刻查行情/账户） / informational（概念解释） / analytical（组合优化、长期规划）
processing_mode: reactive（快速工具） / deliberative（多步分析）

只返回 JSON：{ "query_type", "processing_mode", "reasoning" }`)
  const result = parseWith(AssessSchema, raw, '评估')
  console.log(
    `[评估] mode=${result.processing_mode} type=${result.query_type} ${result.reasoning}`,
  )
  return {
    queryType: result.query_type,
    processingMode: result.processing_mode,
  }
}

async function reactiveAgent(state: typeof AdvisorState.State) {
  console.log('[节点] reactive_agent')
  const profile = JSON.stringify(state.customerProfile, null, 2)
  const agent = createAgent({
    model: createChatModel(0.2),
    tools: createWealthTools(),
    systemPrompt: `你是财富管理投顾。客户信息:\n${profile}\n\n可用工具: query_shanghai_index、query_portfolio_allocation、query_market_news。需要数据就调工具，再用中文简洁回答。`,
  })
  const result = await agent.invoke({
    messages: [{ role: 'user', content: state.userQuery }],
  })
  return {
    finalResponse: lastText(result.messages as Array<{ content?: unknown }>),
  }
}

async function collectData(state: typeof AdvisorState.State) {
  console.log('[节点] collect_data')
  const raw = await requestJson(`根据用户查询确定要收集的数据，并给出合理的模拟数据。
用户查询: ${state.userQuery}
客户信息: ${JSON.stringify(state.customerProfile, null, 2)}
只返回 JSON：{ "required_data_types": string[], "data_sources": string[], "collected_data": object }`)
  const result = parseWith(CollectSchema, raw, '数据收集')
  return { marketData: result.collected_data }
}

async function analyzeData(state: typeof AdvisorState.State) {
  console.log('[节点] analyze')
  const raw = await requestJson(`根据数据和客户情况做投资分析。
用户查询: ${state.userQuery}
客户信息: ${JSON.stringify(state.customerProfile, null, 2)}
市场数据: ${JSON.stringify(state.marketData, null, 2)}
只返回 JSON：{ "market_assessment", "portfolio_analysis", "recommendations": string[], "risk_analysis", "expected_outcomes" }`)
  const result = parseWith(AnalysisSchema, raw, '分析')
  return { analysisResults: result }
}

async function generateRecommendations(state: typeof AdvisorState.State) {
  console.log('[节点] recommend')
  const model = createChatModel(0.2)
  const response = await model.invoke([
    new HumanMessage(`根据分析结果给客户写最终建议。语言友好，少术语。包含策略、行动步骤、配置、风险、时间框架、后续跟进。
用户查询: ${state.userQuery}
客户信息: ${JSON.stringify(state.customerProfile, null, 2)}
分析结果: ${JSON.stringify(state.analysisResults, null, 2)}`),
  ])
  return { finalResponse: contentText(response.content) }
}

export function createWealthAdvisorGraph() {
  return new StateGraph(AdvisorState)
    .addNode('assess', assessQuery)
    .addNode('reactive_agent', reactiveAgent)
    .addNode('collect_data', collectData)
    .addNode('analyze', analyzeData)
    .addNode('recommend', generateRecommendations)
    .addEdge(START, 'assess')
    .addConditionalEdges('assess', (state) =>
      state.processingMode === 'deliberative' ? 'collect_data' : 'reactive_agent',
    )
    .addEdge('reactive_agent', END)
    .addEdge('collect_data', 'analyze')
    .addEdge('analyze', 'recommend')
    .addEdge('recommend', END)
    .compile()
}

export async function runWealthAdvisor(
  userQuery: string,
  customerProfile: Record<string, unknown>,
) {
  const graph = createWealthAdvisorGraph()
  return graph.invoke({
    userQuery,
    customerProfile,
  })
}
