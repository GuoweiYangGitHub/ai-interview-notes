import {
  cpSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, extname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '..')
const sourceRoot = 'F:\\agent代码示例'
const destRoot = join(repoRoot, 'docs', 'public', 'code')

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.venv',
  'venv',
  '__pycache__',
  '.cursor',
  'modelscope_models',
])

const SKIP_EXT = new Set([
  '.pt',
  '.pth',
  '.bin',
  '.safetensors',
  '.onnx',
  '.db',
  '.pyc',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.pdf',
  '.woff',
  '.woff2',
  '.ttf',
  '.ico',
])

const SKIP_FILES = new Set(['.env', '.msc', '.mv'])

const LANG_BY_EXT = {
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.js': 'js',
  '.cjs': 'js',
  '.mjs': 'js',
  '.py': 'python',
  '.md': 'md',
  '.json': 'json',
  '.jsonl': 'json',
  '.txt': 'text',
  '.yml': 'yaml',
  '.yaml': 'yaml',
  '.toml': 'toml',
  '.html': 'html',
  '.css': 'css',
  '.vue': 'vue',
  '.sh': 'bash',
  '.sql': 'sql',
}

const COPY_ROOTS = [
  'examples',
  'exampleAgentFramework',
  'exampleFineTune',
  'exampleMcpTools',
  'exampleMultimodal',
  'exampleNeuralNetwork',
  'datasets',
  '知识点',
  'openspec',
  'skills',
]

const TAXONOMY = [
  {
    id: 'node',
    title: 'Node.js',
    collapsed: false,
    topics: [
      {
        id: 'agent-basics',
        title: 'Agent 基础',
        examples: [
          { path: 'examples/01.定义模型结构化输出' },
          { path: 'examples/02.多步流程编排与条件分支' },
          { path: 'examples/03.模型规划并调用工具' },
          { path: 'examples/04.管理Agent的行动能力-注册、工具池与动态装载' },
          { path: 'examples/05.MCP协议融入Agent' },
          { path: 'examples/06.独立的运行环境设计（沙箱）' },
          { path: 'examples/07.规划转任务，任务转Loop' },
        ],
      },
      {
        id: 'platform',
        title: '平台接入',
        examples: [
          { path: 'exampleAgentFramework/01.Dify API使用' },
          { path: 'exampleAgentFramework/02.Coze API使用' },
          { path: 'exampleAgentFramework/03.ralph使用' },
        ],
      },
      {
        id: 'kb-eng',
        title: '知识库工程',
        examples: [
          { path: 'exampleAgentFramework/08.知识库健康度检查' },
          { path: 'exampleAgentFramework/09.问题生成与BM25检索' },
          { path: 'exampleAgentFramework/10.对话知识沉淀' },
          { path: 'exampleAgentFramework/11.知识库版本管理' },
        ],
      },
      {
        id: 'agent-style',
        title: 'Agent 形态',
        examples: [
          { path: 'exampleAgentFramework/12.反应式智能体' },
          { path: 'exampleAgentFramework/13.混合式智能体' },
          { path: 'exampleAgentFramework/14.深思熟虑智能体' },
        ],
      },
      {
        id: 'frameworks',
        title: '框架',
        examples: [
          {
            path: 'exampleAgentFramework/15.Langchain Agent/node',
            title: 'LangChain Agent（node）',
          },
          {
            path: 'exampleAgentFramework/04.textToSql示例/langchain',
            title: 'textToSql / LangChain',
          },
        ],
      },
      {
        id: 'mcp',
        title: 'MCP',
        examples: [
          { path: 'exampleMcpTools/bing-cn' },
          { path: 'exampleMcpTools/Tavily' },
          { path: 'exampleMcpTools/Tushare' },
        ],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    collapsed: false,
    topics: [
      {
        id: 'frameworks',
        title: '框架',
        examples: [
          {
            path: 'exampleAgentFramework/15.Langchain Agent/python',
            title: 'LangChain Agent（python）',
          },
          {
            path: 'exampleAgentFramework/04.textToSql示例/vanna',
            title: 'textToSql / Vanna',
          },
          { path: 'exampleAgentFramework/16.LlamaIndex' },
          { path: 'exampleAgentFramework/17.Qwen-Agent' },
          { path: 'exampleAgentFramework/18.AutoGen' },
        ],
      },
      {
        id: 'kb-search',
        title: '知识库与检索',
        examples: [
          { path: 'exampleAgentFramework/06.Faiss使用' },
          { path: 'exampleAgentFramework/07.多模态RAG知识库' },
          { path: 'exampleAgentFramework/05.Nanobot-ChatBI开发' },
        ],
      },
      {
        id: 'finetune',
        title: '微调',
        examples: [
          { path: 'exampleFineTune/01.Alpaca-SFT' },
          { path: 'exampleFineTune/02.GRPO-R1' },
          { path: 'exampleFineTune/03.QwenVL微调' },
          { path: 'exampleFineTune/04.效果对比评估' },
        ],
      },
      {
        id: 'multimodal',
        title: '多模态',
        examples: [{ path: 'exampleMultimodal/01.MinerU使用' }],
      },
      {
        id: 'nn',
        title: '神经网络',
        examples: [
          { path: 'exampleNeuralNetwork/01.激活函数' },
          { path: 'exampleNeuralNetwork/02.NumPy前向传播' },
          { path: 'exampleNeuralNetwork/03.NumPy手写训练' },
          { path: 'exampleNeuralNetwork/04.Keras最小回归' },
          { path: 'exampleNeuralNetwork/05.CNN卷积演示' },
          { path: 'exampleNeuralNetwork/06.CNN特征图' },
          { path: 'exampleNeuralNetwork/07.YOLO预测' },
          { path: 'exampleNeuralNetwork/08.YOLO训练' },
        ],
      },
    ],
  },
  {
    id: 'extras',
    title: '资料',
    collapsed: true,
    topics: [
      {
        id: 'refs',
        title: '资料',
        examples: [
          { path: 'datasets', title: 'datasets' },
          { path: '知识点', title: '知识点' },
        ],
      },
    ],
  },
]

function posix(p) {
  return p.split(sep).join('/')
}

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name) || name.startsWith('.')
}

function shouldSkipFile(name) {
  if (SKIP_FILES.has(name) || name === '.env') return true
  const ext = extname(name).toLowerCase()
  return SKIP_EXT.has(ext)
}

function langOf(name) {
  return LANG_BY_EXT[extname(name).toLowerCase()] || 'text'
}

function walk(absDir, relDir, copied, skipped) {
  let entries
  try {
    entries = readdirSync(absDir, { withFileTypes: true })
  } catch {
    return
  }

  entries.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

  for (const entry of entries) {
    const rel = posix(join(relDir, entry.name))
    const abs = join(absDir, entry.name)

    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue
      walk(abs, rel, copied, skipped)
      continue
    }

    if (!entry.isFile()) continue
    if (shouldSkipFile(entry.name)) {
      skipped.push(rel)
      continue
    }

    const dest = join(destRoot, rel)
    mkdirSync(dirname(dest), { recursive: true })
    cpSync(abs, dest)
    copied.push(rel)
  }
}

function buildTree(files) {
  const root = { type: 'dir', name: '', children: [] }

  for (const file of files) {
    const parts = file.split('/')
    let node = root
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i]
      const isFile = i === parts.length - 1
      if (isFile) {
        node.children.push({
          type: 'file',
          name,
          path: file,
          lang: langOf(name),
        })
      } else {
        let child = node.children.find(
          (c) => c.type === 'dir' && c.name === name,
        )
        if (!child) {
          child = { type: 'dir', name, children: [] }
          node.children.push(child)
        }
        node = child
      }
    }
  }

  function sortNode(node) {
    if (!node.children) return
    node.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
      return a.name.localeCompare(b.name, 'zh-CN')
    })
    for (const child of node.children) sortNode(child)
  }

  sortNode(root)
  return root.children
}

function collectExample(relRoot, files, skipped, title) {
  const prefix = `${relRoot}/`
  const ownFiles = files
    .filter((f) => f === relRoot || f.startsWith(prefix))
    .map((f) => {
      if (f === relRoot) return f.split('/').pop()
      return f.slice(prefix.length)
    })
  const ownSkipped = skipped
    .filter((f) => f === relRoot || f.startsWith(prefix))
    .map((f) => {
      if (f === relRoot) return f.split('/').pop()
      return f.slice(prefix.length)
    })

  return {
    id: relRoot,
    title: title || relRoot.split('/').pop(),
    path: relRoot,
    hasReadme: ownFiles.some((f) => f.toLowerCase() === 'readme.md'),
    tree: buildTree(ownFiles),
    skipped: ownSkipped,
  }
}

function filesUnder(relRoot, files) {
  const prefix = `${relRoot}/`
  return files.filter((f) => f === relRoot || f.startsWith(prefix))
}

rmSync(destRoot, { recursive: true, force: true })
mkdirSync(destRoot, { recursive: true })

const copied = []
const skipped = []

for (const root of COPY_ROOTS) {
  const abs = join(sourceRoot, root)
  if (!statSync(abs, { throwIfNoEntry: false })) {
    console.warn(`skip missing: ${root}`)
    continue
  }
  walk(abs, root, copied, skipped)
}

copied.sort((a, b) => a.localeCompare(b, 'zh-CN'))
skipped.sort((a, b) => a.localeCompare(b, 'zh-CN'))

const groups = []

for (const lang of TAXONOMY) {
  const topics = []
  for (const topic of lang.topics) {
    const examples = []
    for (const item of topic.examples) {
      if (
        filesUnder(item.path, copied).length === 0 &&
        filesUnder(item.path, skipped).length === 0
      ) {
        console.warn(`skip empty example: ${item.path}`)
        continue
      }
      examples.push(collectExample(item.path, copied, skipped, item.title))
    }
    if (examples.length) {
      topics.push({
        id: topic.id,
        title: topic.title,
        examples,
      })
    }
  }
  if (topics.length) {
    groups.push({
      id: lang.id,
      title: lang.title,
      collapsed: Boolean(lang.collapsed),
      topics,
    })
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source: sourceRoot,
  fileCount: copied.length,
  skippedCount: skipped.length,
  groups,
}

writeFileSync(
  join(destRoot, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
)

const sidebar = [
  { text: '代码示例', link: '/E-代码示例/' },
  ...groups.map((lang) => ({
    text: lang.title,
    collapsed: Boolean(lang.collapsed),
    items: lang.topics.map((topic) => ({
      text: topic.title,
      collapsed: lang.id !== 'node' || topic.id !== 'agent-basics',
      items: topic.examples.map((example) => ({
        text: example.title,
        link: `/E-代码示例/view#${encodeURIComponent(example.id)}`,
      })),
    })),
  })),
]

writeFileSync(
  join(repoRoot, 'docs', '.vitepress', 'examples-sidebar.json'),
  `${JSON.stringify(sidebar, null, 2)}\n`,
  'utf8',
)

console.log(
  `copied ${copied.length} files, skipped ${skipped.length}, langs ${groups.length}`,
)
for (const lang of groups) {
  const count = lang.topics.reduce((n, topic) => n + topic.examples.length, 0)
  console.log(`- ${lang.title}: ${count} examples`)
  for (const topic of lang.topics) {
    console.log(
      `  - ${topic.title}: ${topic.examples.map((e) => e.title).join(', ')}`,
    )
  }
}
