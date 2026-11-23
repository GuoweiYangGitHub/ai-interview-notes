import { readFile, writeFile } from 'node:fs/promises'

const file = 'docs/.vitepress/data/interview-bank.mjs'
let text = await readFile(file, 'utf8')

if (text.includes("group: 'agent'")) {
  throw new Error('predicted questions already grouped')
}

const start = text.indexOf("  {\n    id: 'predicted',")
const end = text.indexOf("\n]\n\nexport const categoryOrder", start)
if (start < 0 || end < 0) throw new Error('predicted block not found')

let block = text.slice(start, end)

const groups = {
  P01: 'tools',
  P02: 'js',
  P03: 'agent',
  P04: 'agent',
  P05: 'agent',
  P06: 'agent',
  P08: 'agent',
  P09: 'agent',
  P10: 'agent',
  P11: 'agent',
  P12: 'agent',
  P13: 'langchain',
  P14: 'agent',
  P15: 'agent',
  P16: 'agent',
  P17: 'llm-eng',
  P18: 'agent',
  P19: 'agent',
  P20: 'agent',
  P21: 'llm-eng',
  P22: 'agent',
  P23: 'agent',
  P24: 'llm-eng',
  P25: 'agent',
  P26: 'agent',
  P27: 'agent',
  P28: 'agent',
  P29: 'llm-eng',
  P30: 'llm-eng',
  P31: 'rag',
  P32: 'langchain',
  P33: 'ai-coding',
  P34: 'js',
}

block = block.replace(/id: '(P\d+)',/g, (match, id) => {
  if (!groups[id]) return match
  return `${match}\n        group: '${groups[id]}',`
})

const newQuestions = `      {
        id: 'P31',
        group: 'rag',
        title: 'RAG 项目最容易被追问的三个点是什么？',
        body: \`
<p><strong>简要回答</strong></p>
<p>RAG 项目最容易被追问三点：切片、召回、证据。</p>
<ul>
<li><strong>切片</strong>：为什么这么切，切块参数变了会怎样。</li>
<li><strong>召回</strong>：向量和关键词各解决什么，RRF 怎么融合，多类问题怎么保证每类都有。</li>
<li><strong>证据</strong>：引用是否真实、是否支持结论，没证据怎么拒答；评测集和门禁怎么证明没退化。</li>
</ul>
\`,
      },
      {
        id: 'P32',
        group: 'langchain',
        title: 'LangChain 和 LangGraph 怎么选？',
        body: \`
<p><strong>简要回答</strong></p>
<p>LangChain 是组件库和链式组合，适合线性流程：prompt → model → parser → retriever / tool。</p>
<p>LangGraph 是状态图编排，适合多步、循环、分支、暂停恢复和人工确认。</p>
<p>简单链用 LangChain；复杂流程、需要状态和恢复用 LangGraph；两者经常一起用。</p>
\`,
      },
      {
        id: 'P33',
        group: 'ai-coding',
        title: 'AI 编程怎么保证生成代码质量？',
        body: \`
<p><strong>简要回答</strong></p>
<p>给足上下文：目录结构、接口、规范、已有测试；小步生成，先写或先跑测试，再做类型检查、lint、构建和代码评审。</p>
<p>关键配置和生产变更要人工确认；失败能回滚。AI 负责产出候选，程序负责验证和边界。</p>
\`,
      },
      {
        id: 'P34',
        group: 'js',
        title: 'JavaScript 的 Map 和 Object 有什么区别？',
        body: \`
<p><strong>简要回答</strong></p>
<p><code>Object</code> 的键只能是字符串或 Symbol，适合表达结构固定的对象；<code>Map</code> 的键可以是任意类型，保留插入顺序，有 <code>size</code>，可迭代，适合频繁增删和用对象当键。</p>
<p>项目里：普通数据对象用 Object；缓存、计数、频繁增删用 Map。</p>
\`,
      },
`

const insertAt = block.lastIndexOf("    ],\n  },")
if (insertAt < 0) throw new Error('predicted questions end not found')
block = block.slice(0, insertAt) + newQuestions + block.slice(insertAt)

text = text.slice(0, start) + block + text.slice(end)

const groupsMeta = `export const predictedGroups = [
  {
    id: 'predicted-agent',
    group: 'agent',
    title: 'Agent 面试题',
    description: '定义、架构、范式、记忆、多智能体、可靠性与评估。',
  },
  {
    id: 'predicted-rag',
    group: 'rag',
    title: 'RAG 面试题',
    description: '切片、召回、融合、证据与评测。',
  },
  {
    id: 'predicted-tools',
    group: 'tools',
    title: 'LLM 工具调用面试题',
    description: 'Function Call、MCP、工具目录与参数校验。',
  },
  {
    id: 'predicted-llm-eng',
    group: 'llm-eng',
    title: '大模型工程面试题',
    description: '上下文、延迟、数据库安全、压缩与稳定性。',
  },
  {
    id: 'predicted-langchain',
    group: 'langchain',
    title: 'LangChain 框架面试',
    description: 'LangChain、LangGraph、LCEL 与选型。',
  },
  {
    id: 'predicted-ai-coding',
    group: 'ai-coding',
    title: 'AI 编程面试',
    description: '用大模型写代码、验证与工程约束。',
  },
  {
    id: 'predicted-js',
    group: 'js',
    title: 'JavaScript 面试',
    description: 'JS 基础与前端通信。',
  },
]

`

text = text.replace('export const categoryOrder = [', groupsMeta + 'export const categoryOrder = [')
await writeFile(file, text, 'utf8')
console.log('grouped predicted modules')
