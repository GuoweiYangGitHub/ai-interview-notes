/**
 * @file 为切片生成多样化问题
 */
import { z } from 'zod'

import { createClient } from './client'
import type { GeneratedQuestion } from './sample'

const QuestionSchema = z.object({
  question: z.string().min(1),
  question_type: z.string().min(1),
  difficulty: z.string().min(1),
  perspective: z.string().optional(),
  is_answerable: z.union([z.string(), z.boolean()]).optional(),
  answer: z.string().optional(),
})

const QuestionsSchema = z.object({
  questions: z.array(QuestionSchema),
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

async function requestQuestions(
  prompt: string,
  temperature: number,
): Promise<GeneratedQuestion[]> {
  const { client, model } = createClient()
  const response = await client.chat.completions.create({
    model,
    temperature,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  })
  const raw = response.choices[0]?.message.content?.trim()
  if (!raw) {
    throw new Error('模型没有返回问题 JSON')
  }
  const parsed = QuestionsSchema.safeParse(JSON.parse(stripFence(raw)))
  if (!parsed.success) {
    throw new Error(`问题 JSON 未通过契约: ${parsed.error.message}`)
  }
  return parsed.data.questions.map((item) => ({
    question: item.question,
    question_type: item.question_type,
    difficulty: item.difficulty,
    perspective: item.perspective,
    is_answerable:
      item.is_answerable === undefined
        ? undefined
        : String(item.is_answerable),
    answer: item.answer,
  }))
}

export function generateQuestions(
  content: string,
  numQuestions: number,
): Promise<GeneratedQuestion[]> {
  const prompt = [
    '你是问答系统专家。根据知识内容生成多样化问题：直接问、间接问、对比问、条件问。不要超出原文范围。',
    '只返回 JSON：{ "questions": [{ "question", "question_type", "difficulty" }] }',
    `生成 ${numQuestions} 条。`,
    '### 知识内容 ###',
    content,
  ].join('\n\n')
  return requestQuestions(prompt, 0.7)
}

export function generateDiverseQuestions(
  content: string,
  numQuestions: number,
): Promise<GeneratedQuestion[]> {
  const prompt = [
    '你是问答系统专家。请生成高度多样化的问题：类型、句式、难度、提问角度都要拉开。不要超出原文。',
    '只返回 JSON：{ "questions": [{ "question", "question_type", "difficulty", "perspective", "is_answerable", "answer" }] }',
    `生成 ${numQuestions} 条。`,
    '### 知识内容 ###',
    content,
  ].join('\n\n')
  return requestQuestions(prompt, 0.7)
}
