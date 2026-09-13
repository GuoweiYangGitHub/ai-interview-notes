/**
 * Dify API 查阅演示
 *
 * 对应课 8 CASE-Dify API使用：
 *   --mode chat       dify_chat_example.py
 *   --mode workflow   dify_workflow_example.py
 *   --mode completion 文本生成应用
 *
 *   npm run dify
 *   npm run dify -- --mode workflow
 *
 * 需要 .env：DIFY_API_KEY
 * 本地默认 http://localhost/v1；云端设 DIFY_BASE_URL=https://api.dify.ai/v1
 */
import 'dotenv/config'

import process from 'node:process'

import {
  chat,
  completion,
  getConversationMessages,
  runWorkflow,
} from './client'

type Mode = 'chat' | 'workflow' | 'completion'

function parseMode(): Mode {
  const index = process.argv.indexOf('--mode')
  const mode = (index >= 0 ? process.argv[index + 1] : 'chat') as string
  if (mode === 'chat' || mode === 'workflow' || mode === 'completion') {
    return mode
  }
  throw new Error('--mode 只能是 chat、workflow 或 completion')
}

function printResult(
  title: string,
  result: { error: boolean; message?: string },
) {
  console.log(`=== ${title} ===`)
  console.log(JSON.stringify(result, null, 2))
  if (result.error) {
    throw new Error(result.message ?? 'Dify 调用失败')
  }
}

async function runChat() {
  const query =
    '我的用户id：7501690985227960354，我在5月4日登录了软件，但是没有成功'
  console.log(`发送: ${query}`)

  const first = await chat(query)
  printResult('chat blocking', first)

  if (first.conversation_id) {
    const second = await chat('把上面的问题再总结成一句话', {
      conversationId: first.conversation_id,
    })
    printResult('chat 续聊', second)

    const history = await getConversationMessages(first.conversation_id)
    printResult('messages', history)
  }

  const streamed = await chat('用五个字回答：你好', { stream: true })
  printResult('chat stream', streamed)
}

async function runWorkflowDemo() {
  const input = '黄金价格和哪些因素有关'
  console.log(`发送: ${input}`)
  const result = await runWorkflow({ input })
  printResult('workflow', result)
}

async function runCompletionDemo() {
  const result = await completion({ query: '用一句话解释什么是工作流' })
  printResult('completion', result)
}

async function main() {
  const mode = parseMode()
  if (mode === 'workflow') {
    await runWorkflowDemo()
    return
  }
  if (mode === 'completion') {
    await runCompletionDemo()
    return
  }
  await runChat()
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
