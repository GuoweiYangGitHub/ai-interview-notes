import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(rootDir, 'docs')

const replacements = [
  [
    '/B-工程落地/01-应用服务与交付/',
    '/02-AI应用开发/06-工程与交付/',
  ],
  ['/B-工程落地/06-推理部署与优化/', '/02-AI应用开发/07-部署与推理/'],
  [
    '/C-模型能力/07-神经网络与视觉/',
    '/02-AI应用开发/08-模型基础与选型/01-神经网络与视觉/',
  ],
  [
    '/C-模型能力/08-HuggingFace/',
    '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/',
  ],
  [
    '/C-模型能力/09-微调与蒸馏/',
    '/02-AI应用开发/08-模型基础与选型/03-微调与蒸馏/',
  ],
  ['/A-应用开发/', '/02-AI应用开发/'],
  ['/B-工程落地/', '/02-AI应用开发/'],
  ['/C-模型能力/', '/02-AI应用开发/08-模型基础与选型/'],
  ['/语法对照/', '/90-附录/语法对照/'],
  ['/E-代码示例/', '/90-附录/代码示例/'],
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
for (const file of await walk(docsDir)) {
  const source = await readFile(file, 'utf8')
  let next = source
  for (const [from, to] of replacements) next = next.split(from).join(to)
  if (next !== source) {
    await writeFile(file, next, 'utf8')
    changed += 1
    console.log(relative(docsDir, file).replaceAll('\\', '/'))
  }
}

console.log(`已重写 ${changed} 个文件`)
