/**
 * @file 真实执行
 * @description 在本地 JSON 上实现 search_web / browse_page，不接外网搜索。
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowseArgsSchema, SearchArgsSchema } from './tools'

/** `data/pages.json` 中的一篇本地页面。 */
type Page = {
  url: string
  title: string
  topics: string[]
  excerpt: string
  body: string
}

const pages: Page[] = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'data/pages.json'), 'utf8'),
)

/**
 * 按关键词匹配本地页面，只返回发现线索。
 *
 * @param raw 未经校验的工具参数
 * @returns 查询词与候选列表
 */
export function searchWeb(raw: unknown) {
  const { query } = SearchArgsSchema.parse(raw)
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  const candidates = pages
    .filter((page) => {
      const haystack = `${page.title} ${page.topics.join(' ')} ${page.excerpt}`.toLowerCase()
      return tokens.some((token) => haystack.includes(token))
    })
    .map((page) => ({ title: page.title, url: page.url, excerpt: page.excerpt }))
  return { query, candidates }
}

/**
 * 按 URL 读取本地页面正文。
 *
 * @param raw 未经校验的工具参数
 * @returns 标题与正文
 * @throws {Error} URL 不在候选里
 */
export function browsePage(raw: unknown) {
  const { url } = BrowseArgsSchema.parse(raw)
  const page = pages.find((item) => item.url === url)
  if (!page) {
    throw new Error(`没有这个候选 URL：${url}`)
  }
  return {
    url: page.url,
    title: page.title,
    body: page.body,
  }
}
