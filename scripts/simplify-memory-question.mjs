import { readFile, writeFile } from 'node:fs/promises'

const file = 'docs/.vitepress/data/interview-bank.mjs'
let text = await readFile(file, 'utf8')

const start = text.indexOf("      {\n        id: 'P08',")
const nextStart = text.indexOf("      {\n        id: 'P01',", start)
if (start < 0 || nextStart < 0) throw new Error('P08 block not found')

const block = `      {
        id: 'P08',
        title: 'AI Agent 的记忆机制是什么？实际开发怎么设计记忆模块？',
        body: \`
<p><strong>简要回答</strong></p>
<p>Agent 需要记忆，才能在多步任务中保持状态、跨任务积累知识。</p>
<p>记忆机制分四层：<strong>感知记忆</strong>（当前输入）、<strong>短期记忆</strong>（上下文窗口里的对话历史）、<strong>长期记忆</strong>（外部数据库，按范围召回）、<strong>实体记忆</strong>（结构化提取的关键事实）。</p>
<p>实际设计要解决三个问题：<strong>存什么、怎么存、什么时候取</strong>。只存稳定可复用的事实，按信息类型选存储方式，再按需召回，不要把所有历史都塞进上下文。</p>
<p><strong>江中怎么落</strong>：短期记忆是最近对话 + 任务卡 + 摘要；长期记忆存 PostgreSQL，按设备 / 产线 / 车间 / 班次 / 用户隔离，默认关闭；任务状态也落 PostgreSQL，跨轮续接；记忆预算 2,000 token。</p>
\`,
      },
`

text = text.slice(0, start) + block + text.slice(nextStart)
await writeFile(file, text, 'utf8')
console.log('simplified memory question')
