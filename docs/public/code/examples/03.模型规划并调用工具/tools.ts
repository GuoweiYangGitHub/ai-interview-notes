/**
 * @file 工具声明
 * @description Zod 参数转成 OpenAI `tools`。对齐课06 TOOLS / lesson_tools。
 */
import { z } from 'zod'
import { zodToJsonSchema } from './zodToJsonSchema'

/** `search_web` 的参数契约。 */
export const SearchArgsSchema = z.object({
  query: z.string().min(3).max(200).describe('3-200 字符的搜索词'),
})

/** `browse_page` 的参数契约。 */
export const BrowseArgsSchema = z.object({
  url: z.string().min(1).describe('必须使用 search_web 返回的候选 URL'),
})

/** 本示例向模型公开的工具目录。 */
export const toolSpecs = [
  {
    name: 'search_web',
    description: '搜索网页候选；结果只是发现线索，不能当作已核验正文',
    schema: SearchArgsSchema,
  },
  {
    name: 'browse_page',
    description: '读取某个搜索候选的页面正文',
    schema: BrowseArgsSchema,
  },
] as const

/**
 * 转成 Chat Completions 的 `tools` 数组。
 *
 * @returns OpenAI function tools
 */
export function toOpenAITools() {
  return toolSpecs.map((spec) => ({
    type: 'function' as const,
    function: {
      name: spec.name,
      description: spec.description,
      parameters: zodToJsonSchema(spec.schema),
    },
  }))
}
