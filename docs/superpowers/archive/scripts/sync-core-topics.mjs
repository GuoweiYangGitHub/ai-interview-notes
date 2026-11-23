import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(rootDir, 'docs')
const manifestPath = join(docsDir, 'public', 'core-topics.json')
const modulePath = join(docsDir, '.vitepress', 'core-topics.generated.mjs')

const groups = [
  {
    id: 'frontend',
    title: '前端基础',
    description: 'JS、TS、CSS、浏览器、框架、工程化与手写题。',
    defaultOpen: true,
    paths: ['01-前端基础'],
  },
  {
    id: 'prompt',
    title: 'Prompt 与上下文',
    description: '输入、约束、上下文与输出协议。',
    defaultOpen: true,
    paths: ['02-AI应用开发/01-Prompt与上下文工程'],
  },
  {
    id: 'rag',
    title: 'RAG 与知识工程',
    description: '切片、Embedding、混合检索、精排、评测、权限与更新。',
    defaultOpen: true,
    paths: ['02-AI应用开发/02-RAG与知识库'],
  },
  {
    id: 'agent',
    title: 'Agent、工具与 MCP',
    description: '工具调用、控制流、上下文、沙箱、可靠性与安全。',
    defaultOpen: true,
    paths: ['02-AI应用开发/03-Agent与工具调用'],
  },
  {
    id: 'framework',
    title: '框架与平台',
    description:
      'LangChain、LangGraph、LlamaIndex、评测平台、Coze/Dify、Text-to-SQL。',
    defaultOpen: true,
    paths: ['02-AI应用开发/04-应用框架', '02-AI应用开发/05-平台与业务场景'],
  },
  {
    id: 'delivery',
    title: '工程与交付',
    description:
      '流式交互、异步任务、多租户、评测、Tracing、成本、安全、发布。',
    defaultOpen: true,
    paths: ['02-AI应用开发/06-工程与交付'],
  },
  {
    id: 'inference',
    title: '部署与推理',
    description: '推理框架选型、KV Cache、批处理、TTFT、PD 分离与监控。',
    defaultOpen: false,
    paths: ['02-AI应用开发/07-部署与推理'],
  },
  {
    id: 'model',
    title: '模型基础与选型',
    description:
      '应用开发的支撑与进阶能力：神经网络、Hugging Face、微调、蒸馏、视觉。',
    defaultOpen: false,
    paths: ['02-AI应用开发/08-模型基础与选型'],
  },
  {
    id: 'project-thingjs',
    title: 'THINGJS 项目',
    description: '索引、检索、生成、前端、评测与运维。',
    defaultOpen: true,
    paths: ['03-项目实战/01-THINGJS文档RAG'],
  },
  {
    id: 'project-jiangzhong',
    title: '江中项目',
    description: 'LangGraph、业务流程、会话记忆、场景宿主与评测。',
    defaultOpen: true,
    paths: ['03-项目实战/02-江中智能助手'],
  },
  {
    id: 'project-china-mobile',
    title: '中国移动网络拓扑',
    description: '3D/2D 拓扑、布局、相机与聚合下钻。',
    defaultOpen: true,
    paths: ['03-项目实战/04-中国移动网络拓扑'],
  },
  {
    id: 'cross',
    title: '跨项目',
    description: '多个项目的对比与共同追问。',
    defaultOpen: false,
    paths: ['03-项目实战/03-跨项目对比'],
  },
  {
    id: 'question-bank',
    title: '题库与速查',
    description: '通用情境题、语言基础与八股速查。',
    defaultOpen: false,
    paths: ['04-面试题库'],
  },
]

const moduleNames = [
  ['01-前端基础', '前端基础'],
  ['02-AI应用开发/01-Prompt与上下文工程', 'Prompt 与上下文'],
  ['02-AI应用开发/02-RAG与知识库', 'RAG 与知识工程'],
  ['02-AI应用开发/03-Agent与工具调用', 'Agent 与工具调用'],
  ['02-AI应用开发/04-应用框架', '应用框架'],
  ['02-AI应用开发/05-平台与业务场景', '平台与业务场景'],
  ['02-AI应用开发/06-工程与交付', '工程与交付'],
  ['02-AI应用开发/07-部署与推理', '部署与推理'],
  ['02-AI应用开发/08-模型基础与选型', '模型基础与选型'],
  ['03-项目实战/01-THINGJS文档RAG', 'THINGJS 项目'],
  ['03-项目实战/02-江中智能助手', '江中项目'],
  ['03-项目实战/04-中国移动网络拓扑', '中国移动网络拓扑'],
  ['03-项目实战/03-跨项目对比', '跨项目'],
  ['04-面试题库', '题库与速查'],
]

const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const rCombining = /[\u0300-\u036F]/g

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

async function markdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (
      entry.name === '.vitepress' ||
      entry.name === 'public' ||
      entry.name === 'superpowers'
    )
      continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await markdownFiles(path)))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path)
  }
  return files
}

function groupFor(path) {
  const clean = path.replace(/\.md$/, '')
  return groups.find((group) =>
    group.paths.some(
      (prefix) => clean === prefix || clean.startsWith(`${prefix}/`),
    ),
  )
}

function moduleFor(path) {
  const clean = path.replace(/\.md$/, '')
  return (
    moduleNames.find(
      ([prefix]) => clean === prefix || clean.startsWith(`${prefix}/`),
    )?.[1] ?? path.split('/').slice(0, 2).join(' / ')
  )
}

function kindFor(path) {
  if (path.startsWith('03-项目实战/')) return 'project'
  if (path.startsWith('04-面试题库/')) return 'qa'
  if (/(面试题|技术问答)\.md$/.test(path)) return 'qa'
  return 'knowledge'
}

function routeFor(path) {
  const withoutExtension = path.replace(/\.md$/, '')
  return withoutExtension.endsWith('/index')
    ? `/${withoutExtension.slice(0, -6)}`
    : `/${withoutExtension}`
}

function outputFor(path) {
  return path.replace(/\.md$/, '.html')
}

function extractBody(lines, startIndex, headingLevel) {
  const body = []
  for (let i = startIndex + 1; i < lines.length; i++) {
    const next = /^(#{1,6})\s+/.exec(lines[i])
    if (next && next[1].length <= headingLevel) break
    body.push(lines[i])
  }
  return body.join('\n').trim()
}

const markdown = await createMarkdownRenderer(docsDir)
const records = []
for (const file of await markdownFiles(docsDir)) {
  const source = await readFile(file, 'utf8')
  const docPath = relative(docsDir, file).replaceAll('\\', '/')
  const lines = source.split(/\r?\n/)
  const slugCounts = new Map()
  const isQuestionFile = /(面试题|技术问答)\.md$/.test(docPath)
  const isQuestionBankPage =
    /^04-面试题库\/(通用情境题|语言基础|八股总纲)\.md$/.test(docPath)
  const isProjectPage = docPath.startsWith('03-项目实战/')

  for (let i = 0; i < lines.length; i++) {
    const match = /^(#{2,6})\s+(.+?)\s*$/.exec(lines[i])
    if (!match) continue
    const rawTitle = match[2].replace(/\*\*/g, '')
    const hasMarker = match[2].includes('[重点]')
    const looksLikeQuestion =
      /^(Q|J|R|A|C|N|PY|PB)\d+/i.test(rawTitle) ||
      /[？?]\s*$/.test(rawTitle) ||
      rawTitle.includes('·')
    const shouldExtract =
      hasMarker ||
      (match[1].length >= 3 && (isQuestionFile || isQuestionBankPage)) ||
      (isProjectPage && match[1].length >= 3 && looksLikeQuestion)
    if (!shouldExtract) continue
    const group = groupFor(docPath)
    if (!group) throw new Error(`未分类重点：${docPath} → ${match[2]}`)
    const title = match[2]
      .replace(/\[重点\]\s*/g, '')
      .replace(/\*\*/g, '')
      .replace(/\s+#*\s*$/, '')
      .trim()
    const baseSlug = slugify(match[2].replace(/\[重点\]/g, '重点'))
    const duplicate = slugCounts.get(baseSlug) ?? 0
    slugCounts.set(baseSlug, duplicate + 1)
    const slug = duplicate === 0 ? baseSlug : `${baseSlug}-${duplicate}`
    const body = extractBody(lines, i, match[1].length)
    const priority = /\[重点\]|必练/.test(match[2]) ? 'p0' : 'p1'
    records.push({
      id: `${docPath}#${slug}`,
      title,
      module: moduleFor(docPath),
      kind: kindFor(docPath),
      priority,
      href: `${routeFor(docPath)}#${slug}`,
      output: outputFor(docPath),
      anchor: slug,
      groupId: group.id,
      body,
      html: body ? await markdown.renderAsync(body) : '',
    })
  }
}

function topicPath(topic) {
  return topic.id.split('#')[0].replace(/\.md$/, '')
}

function viewTopics(view) {
  return records.filter((topic) => {
    const path = topicPath(topic)
    const inPath = view.paths.some(
      (prefix) =>
        !prefix || path === prefix || path.startsWith(`${prefix}/`),
    )
    const inPriority = !view.priority || topic.priority === view.priority
    return inPath && inPriority
  })
}

const views = [
  {
    id: 'p0-twelve',
    title: '面试官视角 · P0 十二问',
    description: '如果我是面试官，先问这 12 道。',
    paths: ['04-面试题库/面试官视角'],
    priority: 'p0',
    defaultOpen: true,
  },
  {
    id: 'jiangzhong-p0',
    title: '江中 Agent · P0',
    description: 'Agent 主线，决定面试走向。',
    paths: ['03-项目实战/02-江中智能助手'],
    priority: 'p0',
    defaultOpen: true,
  },
  {
    id: 'thingjs-p0',
    title: 'ThingJS RAG · P0',
    description: '检索、生成、评测的必答题。',
    paths: ['03-项目实战/01-THINGJS文档RAG'],
    priority: 'p0',
    defaultOpen: false,
  },
  {
    id: 'frontend',
    title: '前端高频',
    description: 'SSE、状态机、TypeScript、浏览器与框架。',
    paths: ['01-前端基础'],
    defaultOpen: false,
  },
  {
    id: 'china-mobile',
    title: '中国移动 · 三维前端',
    description: '3D/2D 拓扑、布局、相机与聚合下钻。',
    paths: ['03-项目实战/04-中国移动网络拓扑'],
    defaultOpen: false,
  },
  {
    id: 'cross',
    title: '跨项目',
    description: 'MCP 角色、完成证据、失败复盘。',
    paths: ['03-项目实战/03-跨项目对比'],
    defaultOpen: false,
  },
  {
    id: 'jiangzhong-p1',
    title: '江中 Agent · P1',
    description: '区分深度的追问。',
    paths: ['03-项目实战/02-江中智能助手'],
    priority: 'p1',
    defaultOpen: false,
  },
  {
    id: 'thingjs-p1',
    title: 'ThingJS RAG · P1',
    description: 'RAG 细节与运维。',
    paths: ['03-项目实战/01-THINGJS文档RAG'],
    priority: 'p1',
    defaultOpen: false,
  },
  {
    id: 'ai-topics',
    title: 'AI 专题',
    description: 'Prompt、RAG、Agent、框架、工程、部署、模型。',
    paths: ['02-AI应用开发'],
    defaultOpen: false,
  },
  {
    id: 'eight-legged',
    title: '八股与语言',
    description: '八股、通用情境、语言基础。',
    paths: [
      '04-面试题库/八股总纲',
      '04-面试题库/通用情境题',
      '04-面试题库/语言基础',
      '04-面试题库/数字与话术',
    ],
    defaultOpen: false,
  },
  {
    id: 'p0-all',
    title: 'P0 重点',
    description: '全部标了 [重点] 或 必练 的题目。',
    paths: [''],
    priority: 'p0',
    defaultOpen: false,
  },
  {
    id: 'all',
    title: '全量题库',
    description: '全部题目，用于查漏补缺。',
    paths: [''],
    defaultOpen: false,
  },
]

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'Markdown [重点] 标题与面试题标题',
  total: records.length,
  views: views.map(({ paths, priority, ...view }) => {
    const topics = viewTopics({ paths, priority })
    return {
      ...view,
      count: topics.length,
      topicIds: topics.map((topic) => topic.id),
    }
  }),
  groups: groups.map(({ paths, ...group }) => ({
    ...group,
    topics: records.filter((record) => record.groupId === group.id),
  })),
}

await mkdir(dirname(manifestPath), { recursive: true })
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
await writeFile(
  modulePath,
  `// This file is generated by scripts/sync-core-topics.mjs. Do not edit manually.\nexport default ${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
)
console.log(`核心能力目录已生成：${manifest.total} 个重点`)
