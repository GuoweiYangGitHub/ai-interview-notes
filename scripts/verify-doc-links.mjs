import { access, readFile, readdir } from 'node:fs/promises'
import { dirname, join, normalize, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(rootDir, 'docs')
const errors = []

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    if (entry.name === '.vitepress' || entry.name === 'public') continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...await files(path))
    else if (entry.isFile() && entry.name.endsWith('.md')) result.push(path)
  }
  return result
}

async function exists(path) {
  try { await access(path); return true } catch { return false }
}

for (const file of await files(docsDir)) {
  const source = await readFile(file, 'utf8')
  for (const match of source.matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^)]+)\)/g)) {
    let target = match[1].trim().replace(/^<|>$/g, '')
    if (!target || /^(https?:|mailto:|#)/.test(target)) continue
    target = decodeURIComponent(target.split('#')[0].split('?')[0])
    if (!target) continue
    const absolute = normalize(target.startsWith('/') ? join(docsDir, target) : join(dirname(file), target))
    const candidates = [absolute, `${absolute}.md`, join(absolute, 'index.md')]
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
      errors.push(`${relative(docsDir, file).replaceAll('\\', '/')}: ${target}`)
    }
  }
}

if (errors.length) throw new Error(`Markdown 内链校验失败：\n${errors.join('\n')}`)
console.log('Markdown 内链校验通过')
