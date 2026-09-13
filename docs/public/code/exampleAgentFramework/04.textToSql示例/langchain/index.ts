/**
 * LangChain SQL Agent 演示。运行：npm run text-to-sql:langchain
 */
import 'dotenv/config'

import { askLangChain } from './agent'

const QUESTIONS = [
  '描述与订单相关的表及其关系',
  '描述HeroDetails表',
  '找出英雄攻击力最高的前5个英雄',
  '获取所有客户的姓名和联系电话',
  '查询所有未支付保费的保单号和客户姓名',
  '找出所有理赔金额大于10000元的理赔记录，并列出相关客户的姓名和联系电话',
]

async function main() {
  for (const question of QUESTIONS) {
    console.log(`\n=== LangChain: ${question} ===`)
    console.log(await askLangChain(question))
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
