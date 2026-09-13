/**
 * 模块：Dify 接入
 *
 * 对应课 8 CASE-Dify API使用/dify_agent_client.py（requests 直打 HTTP）。
 * 这里同样不用 SDK，URL 和 payload 留在文件里方便对照。
 *
 *   POST {base}/chat-messages          对话流
 *   POST {base}/completion-messages    文本生成
 *   POST {base}/workflows/run          工作流
 *   GET  {base}/messages               会话消息
 *
 * 默认打本地 Dify（http://localhost/v1）。云端改 DIFY_BASE_URL=https://api.dify.ai/v1
 */
export type DifyAppResult = {
  error: boolean
  message?: string
  answer?: string
  conversation_id?: string
  message_id?: string
  outputs?: Record<string, unknown>
  workflow_run_id?: string
  task_id?: string
  data?: unknown
}

export function createDifyClient() {
  const apiKey = process.env.DIFY_API_KEY
  if (!apiKey) {
    throw new Error(
      '请先在 .env 中配置 DIFY_API_KEY（应用 API Key，不是账号密码）',
    )
  }

  const baseURL = (process.env.DIFY_BASE_URL ?? 'http://localhost/v1').replace(
    /\/$/,
    '',
  )
  const userId = process.env.DIFY_USER_ID ?? 'demo_user'

  return { apiKey, baseURL, userId }
}

function headers(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

async function readError(response: Response) {
  const text = await response.text()
  return {
    error: true as const,
    message: `HTTP ${response.status}: ${text}`,
  }
}

function pickWorkflowAnswer(outputs: Record<string, unknown> | undefined) {
  if (!outputs) return ''
  for (const key of [
    'answer',
    'result',
    'output',
    'text',
    'response',
    'input',
  ]) {
    const value = outputs[key]
    if (value != null && String(value).length > 0) return String(value)
  }
  const first = Object.values(outputs)[0]
  return first == null ? '' : String(first)
}

async function parseSseJson(response: Response) {
  const body = await response.text()
  const events: Array<Record<string, unknown>> = []

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line.startsWith('data:')) continue
    const payload = line.slice(5).trim()
    if (!payload || payload === '[DONE]') continue
    try {
      events.push(JSON.parse(payload) as Record<string, unknown>)
    } catch {
      // 半包或心跳行，跳过
    }
  }

  return events
}

/** 对话流。对应 DifyAgentClient.chat_completion(app_type="chat") */
export async function chat(
  query: string,
  options: { conversationId?: string; stream?: boolean } = {},
): Promise<DifyAppResult> {
  const { apiKey, baseURL, userId } = createDifyClient()
  const url = `${baseURL}/chat-messages`
  const payload: Record<string, unknown> = {
    inputs: {},
    query,
    response_mode: options.stream ? 'streaming' : 'blocking',
    user: userId,
  }
  if (options.conversationId) {
    payload.conversation_id = options.conversationId
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(payload),
  })
  if (!response.ok) return readError(response)

  if (!options.stream) {
    const data = (await response.json()) as Record<string, unknown>
    return {
      error: false,
      data,
      answer: String(data.answer ?? ''),
      conversation_id: String(data.conversation_id ?? ''),
      message_id: String(data.message_id ?? ''),
    }
  }

  const events = await parseSseJson(response)
  let answer = ''
  let conversationId = ''
  let messageId = ''
  for (const event of events) {
    if (event.event === 'message') {
      answer += String(event.answer ?? '')
    }
    if (event.event === 'message_end') {
      conversationId = String(event.conversation_id ?? '')
      messageId = String(event.id ?? event.message_id ?? '')
    }
  }

  return {
    error: false,
    answer,
    conversation_id: conversationId,
    message_id: messageId,
  }
}

/** 文本生成。对应 DifyAgentClient.completion_message */
export async function completion(
  inputs: Record<string, unknown>,
  options: { stream?: boolean } = {},
): Promise<DifyAppResult> {
  const { apiKey, baseURL, userId } = createDifyClient()
  const url = `${baseURL}/completion-messages`
  const payload = {
    inputs,
    response_mode: options.stream ? 'streaming' : 'blocking',
    user: userId,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(payload),
  })
  if (!response.ok) return readError(response)

  if (options.stream) {
    const events = await parseSseJson(response)
    let answer = ''
    let messageId = ''
    for (const event of events) {
      if (event.event === 'message') answer += String(event.answer ?? '')
      if (event.event === 'message_end') {
        messageId = String(event.id ?? event.message_id ?? '')
      }
    }
    return { error: false, answer, message_id: messageId }
  }

  const data = (await response.json()) as Record<string, unknown>
  return {
    error: false,
    data,
    answer: String(data.answer ?? ''),
    message_id: String(data.message_id ?? ''),
  }
}

/** 工作流。对应 DifyAgentClient.run_workflow */
export async function runWorkflow(
  inputs: Record<string, unknown>,
  options: { stream?: boolean } = {},
): Promise<DifyAppResult> {
  const { apiKey, baseURL, userId } = createDifyClient()
  const url = `${baseURL}/workflows/run`
  const payload = {
    inputs,
    response_mode: options.stream ? 'streaming' : 'blocking',
    user: userId,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(payload),
  })
  if (!response.ok) return readError(response)

  if (!options.stream) {
    const data = (await response.json()) as Record<string, unknown>
    const inner = (data.data ?? {}) as Record<string, unknown>
    const outputs = (inner.outputs ?? {}) as Record<string, unknown>
    return {
      error: false,
      data,
      outputs,
      answer: pickWorkflowAnswer(outputs),
      workflow_run_id: String(data.workflow_run_id ?? inner.id ?? ''),
      task_id: String(data.task_id ?? ''),
    }
  }

  const events = await parseSseJson(response)
  let outputs: Record<string, unknown> = {}
  let workflowRunId = ''
  let taskId = ''
  for (const event of events) {
    if (event.event === 'workflow_started') {
      workflowRunId = String(event.workflow_run_id ?? '')
      taskId = String(event.task_id ?? '')
    }
    if (event.event === 'workflow_finished') {
      const inner = (event.data ?? {}) as Record<string, unknown>
      outputs = (inner.outputs ?? {}) as Record<string, unknown>
    }
  }

  return {
    error: false,
    outputs,
    answer: pickWorkflowAnswer(outputs),
    workflow_run_id: workflowRunId,
    task_id: taskId,
  }
}

/** 拉会话历史。对应 DifyAgentClient.get_conversation_messages */
export async function getConversationMessages(
  conversationId: string,
): Promise<DifyAppResult> {
  const { apiKey, baseURL, userId } = createDifyClient()
  const url = new URL(`${baseURL}/messages`)
  url.searchParams.set('conversation_id', conversationId)
  url.searchParams.set('user', userId)

  const response = await fetch(url, { headers: headers(apiKey) })
  if (!response.ok) return readError(response)

  return { error: false, data: await response.json() }
}
