/**
 * @file 两个乐园知识库版本与评测问句
 */
export type Chunk = { id: string; content: string }
export type TestQuery = { query: string; expectedAnswer: string }

export const knowledgeV1: Chunk[] = [
  {
    id: 'kb_001',
    content: '滨江乐园位于滨江新区，2020 年 5 月开园。',
  },
  {
    id: 'kb_002',
    content: '滨江乐园门票：平日成人 399 元，周末和节假日 499 元。',
  },
  {
    id: 'kb_003',
    content: '滨江乐园营业时间为上午 8:00 至晚上 20:00。',
  },
]

export const knowledgeV2: Chunk[] = [
  {
    id: 'kb_001',
    content:
      '滨江乐园位于滨江新区沿江大道 88 号，2020 年 5 月开园。占地 120 公顷，包含五个主题园区。',
  },
  {
    id: 'kb_002',
    content:
      '滨江乐园门票：平日成人 399 元，周末和节假日 499 元。儿童票（1.0-1.4 米）平日 299 元，周末 374 元。1.0 米以下免费。',
  },
  {
    id: 'kb_003',
    content:
      '滨江乐园营业时间为上午 8:00 至晚上 20:00，全年无休。出发前请查看官方 App。',
  },
  {
    id: 'kb_004',
    content: '从市区到滨江乐园可乘坐地铁 2 号线乐园站，或乘坐乐园专线巴士。',
  },
  {
    id: 'kb_005',
    content: '园内特色项目包括极速飞车、矿山车、飞越峡谷。',
  },
]

export const testQueries: TestQuery[] = [
  { query: '滨江乐园在哪里？', expectedAnswer: '滨江新区' },
  { query: '门票多少钱？', expectedAnswer: '399' },
  { query: '营业时间是什么？', expectedAnswer: '8:00' },
  { query: '怎么去乐园？', expectedAnswer: '地铁' },
  { query: '有什么好玩的项目？', expectedAnswer: '极速飞车' },
]
