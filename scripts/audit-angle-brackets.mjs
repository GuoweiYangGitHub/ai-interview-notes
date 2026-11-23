import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.argv[2] ?? 'docs/01-前端基础'

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(path)
  }
  return out
}

const pattern = /<[A-Za-z][^>]*>|<[A-Za-z][^>]*$/

for (const file of await walk(root)) {
  const source = await readFile(file, 'utf8')
  const withoutCode = source
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`\n]*`/g, '')
  withoutCode.split(/\r?\n/).forEach((line, index) => {
    if (pattern.test(line)) {
      console.log(
        `${relative(process.cwd(), file).replaceAll('\\', '/')}:${index + 1}: ${line.trim().slice(0, 160)}`,
      )
    }
  })
}
