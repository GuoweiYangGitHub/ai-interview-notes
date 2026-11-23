import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { mermaidPlugin } from './theme/mermaid-md.ts'
import { keyBadgePlugin } from './theme/key-badge.ts'
import { abcSections, interviewBankSidebar } from './sidebar-abc.ts'

const examplesSidebar = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./examples-sidebar.json', import.meta.url)),
    'utf8',
  ),
)

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI 应用开发笔记',
  description: '面向 AI 应用开发工程师的开源笔记：知识点、面试题与代码示例',
  cleanUrls: true,
  srcExclude: ['public/**', '课程练习/**', 'examples/**', 'superpowers/**'],
  markdown: {
    config(md) {
      md.use(mermaidPlugin)
      md.use(keyBadgePlugin)
    },
  },
  themeConfig: {
    nav: [
      { text: '前端基础', link: '/01-前端基础/' },
      { text: 'AI 应用开发', link: '/02-AI应用开发/' },
      { text: '项目实战', link: '/03-项目实战/' },
      { text: '面试题库', link: '/04-面试题库/' },
    ],
    sidebar: {
      '/01-前端基础/': [abcSections['/01-前端基础/'].home],
      '/02-AI应用开发/': [abcSections['/02-AI应用开发/'].home],
      '/03-项目实战/': [abcSections['/03-项目实战/'].home],
      '/04-面试题库/': interviewBankSidebar,
      '/90-附录/代码示例/': examplesSidebar,
      '/90-附录/': [abcSections['/90-附录/'].home],
    },
    outline: { label: '本页目录' },
    sidebarMenuLabel: '专题目录',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/GuoweiYangGitHub/ai-interview-notes',
      },
    ],
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新' },
    search: { provider: 'local' },
  },
})
