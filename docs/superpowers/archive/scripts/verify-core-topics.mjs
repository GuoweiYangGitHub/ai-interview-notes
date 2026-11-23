import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(join(rootDir, 'docs/public/core-topics.json'), 'utf8'))
const distDir = join(rootDir, 'docs/.vitepress/dist')
const errors = []

for (const group of manifest.groups) {
  for (const topic of group.topics) {
    try {
      const html = await readFile(join(distDir, topic.output), 'utf8')
      if (!html.includes(`id="${topic.anchor}"`)) errors.push(`${topic.href}（找不到标题锚点）`)
    } catch {
      errors.push(`${topic.href}（找不到构建页面）`)
    }
  }
}

if (errors.length) throw new Error(`核心能力目录校验失败：\n${errors.join('\n')}`)
console.log(`核心能力目录校验通过：${manifest.total} 个重点链接均有效`)
