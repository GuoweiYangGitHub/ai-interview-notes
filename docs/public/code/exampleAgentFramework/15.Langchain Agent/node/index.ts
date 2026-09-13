/**
 * 最小 LangChain Agent 演示。运行：npm run langchain-agent
 */
import 'dotenv/config'

import { askWeather } from './agent'

const QUESTION = '杭州今天天气怎么样？'

async function main() {
  console.log('=== LangChain Agent（Node）===\n')
  console.log(`问: ${QUESTION}`)
  console.log(`答: ${await askWeather(QUESTION)}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
