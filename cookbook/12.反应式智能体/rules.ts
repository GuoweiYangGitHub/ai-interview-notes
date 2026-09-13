/**
 * 演示用私募规则。不是法规全文。
 */
export type FundRule = {
  id: string
  category: string
  question: string
  answer: string
}

export const FUND_RULES: FundRule[] = [
  {
    id: 'rule001',
    category: '设立与募集',
    question: '私募基金的合格投资者标准是什么？',
    answer:
      '合格投资者须具备相应风险识别和承担能力，投资于单只私募基金的金额不低于 100 万元，且符合下列条件之一：净资产不低于 1000 万元的单位；金融资产不低于 300 万元，或最近三年个人年均收入不低于 50 万元的个人。',
  },
  {
    id: 'rule002',
    category: '设立与募集',
    question: '私募基金的最低募集规模要求是多少？',
    answer:
      '私募证券投资基金的最低募集规模不得低于人民币 1000 万元。股权、创投等其他类型通常以基金合同约定为准。',
  },
  {
    id: 'rule003',
    category: '监管规定',
    question: '私募基金管理人的风险准备金要求是什么？',
    answer:
      '私募证券基金管理人应当按照管理费收入的 10% 计提风险准备金，用于赔偿因违法违规、违反基金合同或操作错误给基金财产或投资者造成的损失。',
  },
]
