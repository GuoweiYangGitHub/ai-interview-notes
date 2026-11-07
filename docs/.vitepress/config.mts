import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { mermaidPlugin } from './theme/mermaid-md.ts'
import { keyBadgePlugin } from './theme/key-badge.ts'
import { abcSections } from './sidebar-abc.ts'

const examplesSidebar = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./examples-sidebar.json', import.meta.url)),
    'utf8',
  ),
)

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI 应用开发笔记',
  description: '面向 AI 应用开发工程师的开源笔记：知识点、技术问答与代码示例',
  cleanUrls: true,
  srcExclude: ['public/**', '课程练习/**', 'examples/**'],
  markdown: {
    config(md) {
      md.use(mermaidPlugin)
      md.use(keyBadgePlugin)
    },
  },
  themeConfig: {
    nav: [
      { text: 'AI 应用开发', link: '/A-应用开发/' },
      { text: '提示词工程', link: '/A-应用开发/01-Prompt与上下文工程/知识点' },
      { text: 'RAG 知识库', link: '/A-应用开发/02-RAG与知识库/知识点' },
      { text: 'Agent 与工具', link: '/A-应用开发/03-Agent与工具调用/知识点' },
      { text: '开发框架', link: '/A-应用开发/04-应用框架/' },
      { text: '工程落地', link: '/B-工程落地/' },
      { text: '模型选型', link: '/C-模型能力/' },
      { text: 'AI 架构', link: '/D-AI架构/' },
    ],
    sidebar: {
      '/核心能力/': [{ text: '核心能力', link: '/核心能力/' }],
      '/A-应用开发/': [abcSections['/A-应用开发/'].home],
      '/B-工程落地/': [abcSections['/B-工程落地/'].home],
      '/C-模型能力/': [abcSections['/C-模型能力/'].home],
      '/D-AI架构/': [abcSections['/D-AI架构/'].home],
      '/E-代码示例/': examplesSidebar,
      '/语法对照/': [
        { text: '语法对照', link: '/语法对照/' },
        { text: '01 值与判断', link: '/语法对照/01-值与判断' },
        { text: '02 导入与函数', link: '/语法对照/02-导入与函数' },
        { text: '03 对象与列表', link: '/语法对照/03-对象与列表' },
        { text: '04 字符串与格式化', link: '/语法对照/04-字符串与格式化' },
        { text: '05 循环与推导', link: '/语法对照/05-循环与推导' },
        { text: '06 切片与排序', link: '/语法对照/06-切片与排序' },
        { text: '07 异常与文件', link: '/语法对照/07-异常与文件' },
        { text: '08 类型与模型', link: '/语法对照/08-类型与模型' },
        { text: '09 异步', link: '/语法对照/09-异步' },
        { text: '10 进阶', link: '/语法对照/10-进阶' },
      ],
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
