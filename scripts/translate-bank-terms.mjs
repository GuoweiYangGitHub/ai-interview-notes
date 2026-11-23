import { readFile, writeFile } from 'node:fs/promises'

const file = 'docs/.vitepress/data/interview-bank.mjs'
let text = await readFile(file, 'utf8')

const replacements = [
  ['<code>classify → route → act</code>', '<strong>分类 → 规划 → 执行</strong>'],
  ['<code>plan_step / plan_join</code>', '<strong>计划步骤 / 计划汇总</strong>'],
  ['<code>/chat/stream</code>', '<strong>流式问答接口</strong>'],
  ['<code>/chat</code>', '<strong>普通问答接口</strong>'],
  ['<code>classify</code>', '<strong>分类</strong>'],
  ['<code>route</code>', '<strong>规划</strong>'],
  ['<code>act</code>', '<strong>执行</strong>'],
  ['<code>plan_step</code>', '<strong>计划步骤</strong>'],
  ['<code>plan_join</code>', '<strong>计划汇总</strong>'],
  ['<strong>classify</strong>', '<strong>分类</strong>'],
  ['<strong>route</strong>', '<strong>规划</strong>'],
  ['<strong>act</strong>', '<strong>执行</strong>'],
  ['classify → route → act', '分类 → 规划 → 执行'],
  ['plan_step / plan_join', '计划步骤 / 计划汇总'],
  ['plan_step', '计划步骤'],
  ['plan_join', '计划汇总'],
  ['JSON Schema / Ajv', '参数结构校验'],
  ['scene receipt', '场景回执'],
  ['SceneReceipt', '场景回执'],
  ['active.json', '索引激活文件'],
  ['name + params', '动作名 + 参数'],
  ['MCP', '工具协议'],
  ['SSE', '服务器推送'],
  ['RRF', '排名融合'],
  ['BM25', '关键词检索'],
  ['Embedding', '向量化'],
  ['checkpoint', '状态快照'],
  ['approval', '人工审批'],
  ['idempotency', '幂等'],
  ['Prometheus', '监控指标'],
  ['trace', '调用链'],
  ['Agent', '智能体'],
  ['RAG', '检索增强生成'],
]

for (const [from, to] of replacements) {
  text = text.split(from).join(to)
}

await writeFile(file, text, 'utf8')
console.log('translated bank terms')
