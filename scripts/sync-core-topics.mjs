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
    id: 'app-foundations',
    title: 'AI 应用基础',
    description: 'Prompt、Context、结构化输出、幻觉与方案选型。',
    defaultOpen: true,
    paths: ['A-应用开发/01-Prompt与上下文工程'],
  },
  {
    id: 'rag',
    title: 'RAG 与知识工程',
    description: '切片、Embedding、混合检索、精排、评测、权限与更新。',
    defaultOpen: true,
    paths: ['A-应用开发/02-RAG与知识库'],
  },
  {
    id: 'agent',
    title: 'Agent、工具与 MCP',
    description: '工具调用、控制流、上下文、沙箱、可靠性与安全。',
    defaultOpen: true,
    paths: ['A-应用开发/03-Agent与工具调用'],
  },
  {
    id: 'frameworks',
    title: '框架与平台选型',
    description:
      'LangChain、LangGraph、LlamaIndex、评测平台、Coze/Dify、Text-to-SQL。',
    defaultOpen: true,
    paths: ['A-应用开发/04-应用框架', 'A-应用开发/05-平台与业务场景'],
  },
  {
    id: 'delivery',
    title: '服务、质量与交付',
    description:
      '流式交互、异步任务、多租户、评测、Tracing、成本、安全、发布。',
    defaultOpen: true,
    paths: ['B-工程落地/01-应用服务与交付'],
  },
  {
    id: 'inference',
    title: '部署与推理工程',
    description: '推理框架选型、KV Cache、批处理、TTFT、PD 分离与监控。',
    defaultOpen: false,
    paths: ['B-工程落地/06-推理部署与优化'],
  },
  {
    id: 'model',
    title: '模型原理与算法进阶',
    description:
      '应用开发的支撑与进阶能力：神经网络、Hugging Face、微调、蒸馏、视觉。',
    defaultOpen: false,
    paths: ['C-模型能力'],
  },
]

const moduleNames = [
  ['A-应用开发/01-Prompt与上下文工程', 'Prompt 与上下文工程'],
  ['A-应用开发/02-RAG与知识库', 'RAG 与知识工程'],
  ['A-应用开发/03-Agent与工具调用', 'Agent 与工具调用'],
  ['A-应用开发/04-应用框架', '应用框架'],
  ['A-应用开发/05-平台与业务场景', '平台与业务场景'],
  ['B-工程落地/01-应用服务与交付', '应用服务与交付'],
  ['B-工程落地/06-推理部署与优化', '推理部署与优化'],
  ['C-模型能力/07-神经网络与视觉', '神经网络与视觉'],
  ['C-模型能力/08-HuggingFace', 'Hugging Face'],
  ['C-模型能力/09-微调与蒸馏', '微调与蒸馏'],
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
    if (entry.name === '.vitepress' || entry.name === 'public') continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await markdownFiles(path)))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path)
  }
  return files
}

function groupFor(path) {
  return groups.find((group) =>
    group.paths.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    ),
  )
}

function moduleFor(path) {
  return (
    moduleNames.find(
      ([prefix]) => path === prefix || path.startsWith(`${prefix}/`),
    )?.[1] ?? path.split('/').slice(0, 2).join(' / ')
  )
}

function kindFor(path) {
  if (path.startsWith('D-项目口述/')) return 'project'
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
  for (let i = 0; i < lines.length; i++) {
    const match = /^(#{2,6})\s+(.+?)\s*$/.exec(lines[i])
    if (!match || !match[2].includes('[重点]')) continue
    const group = groupFor(docPath)
    if (!group) throw new Error(`未分类重点：${docPath} → ${match[2]}`)
    const title = match[2]
      .replace(/\[重点\]\s*/g, '')
      .replace(/\s+#*\s*$/, '')
      .trim()
    const baseSlug = slugify(match[2].replace(/\[重点\]/g, '重点'))
    const duplicate = slugCounts.get(baseSlug) ?? 0
    slugCounts.set(baseSlug, duplicate + 1)
    const slug = duplicate === 0 ? baseSlug : `${baseSlug}-${duplicate}`
    const body = extractBody(lines, i, match[1].length)
    records.push({
      id: `${docPath}#${slug}`,
      title,
      module: moduleFor(docPath),
      kind: kindFor(docPath),
      href: `${routeFor(docPath)}#${slug}`,
      output: outputFor(docPath),
      anchor: slug,
      groupId: group.id,
      body,
      html: body ? await markdown.renderAsync(body) : '',
    })
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'Markdown [重点] headings',
  total: records.length,
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
