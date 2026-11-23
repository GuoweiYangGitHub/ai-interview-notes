import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'

const roots = ['docs/01-前端基础', 'docs/90-附录']
const outDir = 'docs/public/assets/frontend'

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(path)
  }
  return out
}

function fileNameFor(url) {
  const pathname = new URL(url).pathname
  const ext = extname(pathname) || '.png'
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12)
  return `${hash}${ext}`
}

await mkdir(outDir, { recursive: true })

const cache = new Map()
const failures = []

for (const root of roots) {
  for (const file of await walk(root)) {
    const source = await readFile(file, 'utf8')
    let next = source
    const pattern = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g
    for (const match of source.matchAll(pattern)) {
      const url = match[1]
      if (cache.has(url)) {
        next = next.split(url).join(cache.get(url))
        continue
      }
      const name = fileNameFor(url)
      try {
        const response = await fetch(url, {
          redirect: 'follow',
          signal: AbortSignal.timeout(8000),
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            Referer: 'https://blog.csdn.net/',
          },
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const buffer = Buffer.from(await response.arrayBuffer())
        if (buffer.length < 32) throw new Error('empty response')
        await writeFile(join(outDir, name), buffer)
        const local = `/assets/frontend/${name}`
        cache.set(url, local)
        next = next.split(url).join(local)
        console.log(`ok ${url} -> ${name} (${buffer.length} bytes)`)
      } catch (error) {
        failures.push(`${relative(process.cwd(), file).replaceAll('\\', '/')}: ${url} (${error.message})`)
        console.log(`FAIL ${url}: ${error.message}`)
      }
    }
    if (next !== source) await writeFile(file, next, 'utf8')
  }
}

if (failures.length) {
  console.log('\n未下载：')
  for (const line of failures) console.log(line)
  process.exitCode = 1
}
