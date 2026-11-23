import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const roots = ['docs']
const thingjsDeep = [
  '01-项目全景与架构',
  '02-索引构建与热更新',
  '03-检索链路',
  '04-生成与会话记忆',
  '05-API契约与鉴权',
  '06-前端与SSE',
  '07-评测平台与质量门禁',
  '08-运维观测与问题闭环',
]
const jiangzhongDeep = [
  '01-项目全景与架构',
  '02-请求链路与LangGraph',
  '03-三条业务流程',
  '04-会话、记忆与身份',
  '05-场景与宿主前端',
  '06-审阅台与可观测',
  '07-评测与质量闭环',
  '08-运维与故障兜底',
]

function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const replacements = [
  ...thingjsDeep.map((name) => [
    new RegExp(
      `\\]\\(/03-项目实战/01-THINGJS文档RAG/${escape(name)}(?:#[^)]*)?\\)`,
      'g',
    ),
    '](/03-项目实战/01-THINGJS文档RAG/12-项目问答)',
  ]),
  [
    new RegExp(
      '\\]\\(/03-项目实战/01-THINGJS文档RAG/13-源码、演示与架构图(?:#[^)]*)?\\)',
      'g',
    ),
    '](/03-项目实战/架构图)',
  ],
  ...jiangzhongDeep.map((name) => [
    new RegExp(
      `\\]\\(/03-项目实战/02-江中智能助手/${escape(name)}(?:#[^)]*)?\\)`,
      'g',
    ),
    '](/03-项目实战/02-江中智能助手/11-面试问答)',
  ]),
  [
    new RegExp(
      '\\]\\(/03-项目实战/02-江中智能助手/12-源码与演示(?:#[^)]*)?\\)',
      'g',
    ),
    '](/03-项目实战/架构图)',
  ],
]

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.vitepress', 'public', 'superpowers'].includes(entry.name)) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(path)
  }
  return out
}

let changed = 0
for (const root of roots) {
  for (const file of await walk(root)) {
    const source = await readFile(file, 'utf8')
    let next = source
    for (const [pattern, replacement] of replacements) {
      next = next.replace(pattern, replacement)
    }
    if (next !== source) {
      await writeFile(file, next, 'utf8')
      changed += 1
      console.log(relative(process.cwd(), file).replaceAll('\\', '/'))
    }
  }
}

// 去掉问答页里指向自己的链接，保留文字。
for (const [file, pattern] of [
  [
    'docs/03-项目实战/01-THINGJS文档RAG/12-项目问答.md',
    /\[([^\]]+)\]\(\/03-项目实战\/01-THINGJS文档RAG\/12-项目问答(?:#[^)]*)?\)/g,
  ],
  [
    'docs/03-项目实战/02-江中智能助手/11-面试问答.md',
    /\[([^\]]+)\]\(\/03-项目实战\/02-江中智能助手\/11-面试问答(?:#[^)]*)?\)/g,
  ],
]) {
  const source = await readFile(file, 'utf8')
  const next = source.replace(pattern, '$1')
  if (next !== source) await writeFile(file, next, 'utf8')
}

console.log(`已重写 ${changed} 个文件`)
