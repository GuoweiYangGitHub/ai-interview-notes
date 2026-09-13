/**
 * 模块：Coze 接入
 *
 * 对应课 8 CASE-Coze API使用/coze_client.py（cozepy）。
 * 密钥和 bot_id 只在这里读。业务代码拿返回的方法用即可。
 *
 * 对照：
 *   TokenAuth + Coze(...)     → new CozeAPI({ token, baseURL })
 *   chat.create_and_poll      → client.chat.createAndPoll
 *   chat.stream               → client.chat.stream
 *   bots.retrieve             → client.bots.retrieve
 */
import {
  ChatEventType,
  ChatStatus,
  CozeAPI,
  COZE_CN_BASE_URL,
  RoleType,
} from '@coze/api'

export type HistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

export function createCozeClient() {
  const token = process.env.COZE_API_TOKEN
  const botId = process.env.COZE_BOT_ID
  if (!token) {
    throw new Error('请先在 .env 中配置 COZE_API_TOKEN')
  }
  if (!botId) {
    throw new Error('请先在 .env 中配置 COZE_BOT_ID（已发布为 API 的 Bot）')
  }

  const baseURL = process.env.COZE_BASE_URL ?? COZE_CN_BASE_URL
  const userId = process.env.COZE_USER_ID ?? 'user_12345'
  const client = new CozeAPI({ token, baseURL })

  return { client, botId, userId, baseURL }
}

function toAdditionalMessages(messages: HistoryMessage[]) {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? RoleType.Assistant : RoleType.User,
    content: message.content,
    content_type: 'text' as const,
  }))
}

function pickAssistantAnswer(
  messages: Array<{ role?: string; type?: string; content?: string }>,
) {
  const answers = messages.filter(
    (message) =>
      message.role === 'assistant' &&
      (message.type === 'answer' || !message.type) &&
      message.content,
  )
  const last = answers.at(-1)
  return last?.content ?? null
}

/** 阻塞拿到完整回复。对应 CozeClient.chat */
export async function chat(message: string) {
  const { client, botId, userId } = createCozeClient()
  const poll = await client.chat.createAndPoll({
    bot_id: botId,
    user_id: userId,
    additional_messages: toAdditionalMessages([
      { role: 'user', content: message },
    ]),
  })

  if (poll.chat.status !== ChatStatus.COMPLETED) {
    return `聊天未完成，状态: ${poll.chat.status}`
  }

  return pickAssistantAnswer(poll.messages ?? []) ?? '智能体没有回复内容'
}

/** 流式吐增量。对应 CozeClient.chat_stream */
export async function* chatStream(message: string) {
  const { client, botId, userId } = createCozeClient()
  const stream = await client.chat.stream({
    bot_id: botId,
    user_id: userId,
    additional_messages: toAdditionalMessages([
      { role: 'user', content: message },
    ]),
  })

  for await (const event of stream) {
    if (event.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      const text = event.data.content
      if (text) yield text
    }
  }
}

/** 带历史再问一轮。对应 CozeClient.chat_with_history */
export async function chatWithHistory(messages: HistoryMessage[]) {
  const { client, botId, userId } = createCozeClient()
  const poll = await client.chat.createAndPoll({
    bot_id: botId,
    user_id: userId,
    additional_messages: toAdditionalMessages(messages),
  })

  if (poll.chat.status !== ChatStatus.COMPLETED) {
    return `聊天未完成，状态: ${poll.chat.status}`
  }

  return pickAssistantAnswer(poll.messages ?? []) ?? '智能体没有回复内容'
}

/** 查已发布 Bot 元数据。对应 CozeClient.get_bot_info */
export async function getBotInfo() {
  const { client, botId } = createCozeClient()
  const bot = await client.bots.retrieve({ bot_id: botId })
  return {
    bot_id: bot.bot_id,
    name: bot.name,
    description: bot.description,
    create_time: bot.create_time,
    update_time: bot.update_time,
  }
}
