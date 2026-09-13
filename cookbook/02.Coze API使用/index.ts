/**
 * Coze API 查阅演示
 *
 * 对应课 8 CASE-Coze API使用/coze_client.py 的功能点（不做交互式 REPL）。
 *
 *   npm run coze
 *
 * 需要 .env：COZE_API_TOKEN、COZE_BOT_ID
 */
import 'dotenv/config'

import { chat, chatStream, chatWithHistory, getBotInfo } from './client'

async function main() {
  console.log('=== getBotInfo ===')
  try {
    console.log(JSON.stringify(await getBotInfo(), null, 2))
  } catch (error) {
    console.log(error instanceof Error ? error.message : error)
  }

  console.log('\n=== chat（阻塞） ===')
  const question = '用一句话介绍你自己'
  const answer = await chat(question)
  console.log(`user: ${question}`)
  console.log(`assistant: ${answer}`)

  console.log('\n=== chatStream（流式） ===')
  process.stdout.write('assistant: ')
  let streamed = ''
  for await (const chunk of chatStream(
    '再重复一遍你刚才的自我介绍，更短一点',
  )) {
    process.stdout.write(chunk)
    streamed += chunk
  }
  process.stdout.write('\n')

  console.log('\n=== chatWithHistory（带历史） ===')
  const followUp = await chatWithHistory([
    { role: 'user', content: question },
    { role: 'assistant', content: streamed || answer },
    { role: 'user', content: '把上面的介绍改成八个字以内' },
  ])
  console.log(`assistant: ${followUp}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
