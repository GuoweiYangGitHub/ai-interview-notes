/**
 * 投研各阶段输出契约。
 */
import { z } from 'zod'

function toScore(value: unknown): unknown {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1 ? value / 100 : value
  }
  if (typeof value === 'string') {
    const match = value.match(/[0-9]+(?:\.[0-9]+)?/)
    if (match) {
      const parsed = Number(match[0])
      return parsed > 1 ? parsed / 100 : parsed
    }
    if (value.includes('高')) {
      return 0.8
    }
    if (value.includes('中')) {
      return 0.6
    }
    if (value.includes('低')) {
      return 0.4
    }
  }
  return 0.5
}

const Score = z.preprocess(toScore, z.number().min(0).max(1))

const TextMap = z.record(
  z
    .union([z.string(), z.number(), z.boolean()])
    .transform((value) => String(value)),
)

export const PerceptionSchema = z.object({
  market_overview: z.string().min(1),
  key_indicators: TextMap,
  recent_news: z.array(z.string()).min(1),
  industry_trends: TextMap,
})

export const ModelingSchema = z.object({
  market_state: z.string().min(1),
  economic_cycle: z.string().min(1),
  risk_factors: z.array(z.string()).min(1),
  opportunity_areas: z.array(z.string()).min(1),
  market_sentiment: z.string().min(1),
})

export const PlanSchema = z.object({
  plan_id: z.string().min(1),
  hypothesis: z.string().min(1),
  analysis_approach: z.string().min(1),
  expected_outcome: z.string().min(1),
  confidence_level: Score,
  pros: z.array(z.string()).min(1),
  cons: z.array(z.string()).min(1),
})

export const ReasoningSchema = z.object({
  plans: z.array(PlanSchema).min(1),
})

export const DecisionSchema = z.object({
  selected_plan_id: z.string().min(1),
  investment_thesis: z.string().min(1),
  supporting_evidence: z.array(z.string()).min(1),
  risk_assessment: z.string().min(1),
  recommendation: z.string().min(1),
  timeframe: z.string().min(1),
})

export type Perception = z.infer<typeof PerceptionSchema>
export type Modeling = z.infer<typeof ModelingSchema>
export type Plan = z.infer<typeof PlanSchema>
export type Decision = z.infer<typeof DecisionSchema>
