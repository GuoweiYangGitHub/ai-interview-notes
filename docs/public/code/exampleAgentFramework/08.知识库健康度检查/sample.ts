/**
 * @file 演示知识库与测试问句
 * @description 故意埋价格冲突、过期票价、缺失活动/停车费。
 */
import type { KnowledgeChunk, TestQuery } from './schema'

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: 'kb_001',
    content:
      '滨江乐园位于滨江新区沿江大道 88 号，2020 年 5 月开园，占地 120 公顷，包含五个主题园区。',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'kb_002',
    content:
      '滨江乐园门票：平日成人 399 元，周末和节假日 499 元。儿童票平日 299 元，周末 374 元。',
    lastUpdated: '2023-12-01',
  },
  {
    id: 'kb_003',
    content:
      '滨江乐园门票价格：成人票平日 350 元，周末 450 元。儿童票平日 250 元，周末 350 元。',
    lastUpdated: '2024-02-01',
  },
  {
    id: 'kb_004',
    content: '滨江乐园营业时间为上午 8:00 至晚上 20:00，全年无休。',
    lastUpdated: '2024-01-20',
  },
  {
    id: 'kb_005',
    content: '从市区到滨江乐园可乘坐地铁 2 号线到乐园站，或乘坐乐园专线巴士。',
    lastUpdated: '2024-01-10',
  },
]

export const testQueries: TestQuery[] = [
  { query: '滨江乐园在哪里？', expectedAnswer: '滨江新区' },
  { query: '门票多少钱？', expectedAnswer: '价格信息' },
  { query: '营业时间是什么？', expectedAnswer: '8:00-20:00' },
  { query: '怎么去乐园？', expectedAnswer: '地铁 2 号线' },
  { query: '有什么特别活动？', expectedAnswer: '活动信息' },
  { query: '停车费是多少？', expectedAnswer: '停车费信息' },
]
