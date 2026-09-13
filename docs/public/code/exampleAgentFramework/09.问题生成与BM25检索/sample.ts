/**
 * @file 滨江乐园知识切片与难查询
 */
export type KnowledgeChunk = {
  id: string
  content: string
  category: string
  generatedQuestions?: GeneratedQuestion[]
}

export type GeneratedQuestion = {
  question: string
  question_type: string
  difficulty: string
  perspective?: string
  is_answerable?: string
  answer?: string
}

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: 'kb_001',
    category: '基本信息',
    content:
      '滨江乐园位于滨江新区沿江大道 88 号，2020 年 5 月开园，占地 120 公顷，包含五个主题园区：入口大街、奇想花园、探险谷、明日区和童话镇。',
  },
  {
    id: 'kb_002',
    category: '价格信息',
    content:
      '滨江乐园门票按日期浮动。平日成人 399 元，周末和节假日 499 元。儿童票（1.0-1.4 米）平日 299 元，周末 374 元。1.0 米以下儿童免费。',
  },
  {
    id: 'kb_003',
    category: '营业信息',
    content:
      '滨江乐园营业时间通常为上午 8:00 至晚上 20:00，季节和活动期间会调整。周末、节假日人较多，工作日上午相对宽松。出发前请查看官方 App。',
  },
  {
    id: 'kb_004',
    category: '交通信息',
    content:
      '从市区到滨江乐园：地铁 2 号线乐园站下车；乐园专线巴士；打车约 40 分钟；自驾停乐园停车场，停车费 40 元/天。',
  },
  {
    id: 'kb_005',
    category: '游乐项目',
    content:
      '园内较刺激的项目有明日区的极速飞车、童话镇的矿山车、探险谷的飞越峡谷。极速飞车有身高限制。想坐最刺激的过山车应去明日区。',
  },
  {
    id: 'kb_006',
    category: '餐饮信息',
    content:
      '园内餐厅人均约 80-150 元。可以携带密封包装的零食和水入园，不能带玻璃瓶和酒精饮料。',
  },
  {
    id: 'kb_007',
    category: '购物信息',
    content:
      '每个园区都有纪念品店。入口大街的综合商店最大。建议离园前再买周边，避免游玩时携带不便。',
  },
  {
    id: 'kb_008',
    category: '服务设施',
    content:
      '提供婴儿车租赁（30 元/天）、轮椅租赁（免费）、储物柜（20 元/天）。园内有医疗点和失物招领处。',
  },
]

export const testQueries = [
  {
    query: '如果我想体验最刺激的过山车，应该去哪个区域？',
    correctChunkId: 'kb_005',
  },
  {
    query: '什么时间去人比较少？',
    correctChunkId: 'kb_003',
  },
  {
    query: '可以带食物进去吗？',
    correctChunkId: 'kb_006',
  },
]
