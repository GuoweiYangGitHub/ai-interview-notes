import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const roots = ['docs/01-前端基础', 'docs/90-附录']

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(path)
  }
  return out
}

const dead = /^\s*!\[[^\]]*\]\(https?:\/\/clouds\.guowei\.link[^)]*\)\s*$/
let removed = 0

for (const root of roots) {
  for (const file of await walk(root)) {
    const source = await readFile(file, 'utf8')
    const lines = source.split(/\r?\n/)
    const next = lines.filter((line) => {
      if (!dead.test(line)) return true
      removed += 1
      return false
    })
    if (next.length !== lines.length) {
      await writeFile(file, next.join('\n'), 'utf8')
      console.log(relative(process.cwd(), file).replaceAll('\\', '/'))
    }
  }
}

console.log(`已移除 ${removed} 个失效图片链接`)
