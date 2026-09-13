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
  title: 'Agent Notes',
  description: 'Agent 系统化笔记、能力地图与可运行示例',
  cleanUrls: true,
  srcExclude: ['public/**'],
  markdown: {
    config(md) {
      md.use(mermaidPlugin)
      md.use(keyBadgePlugin)
    },
  },
  themeConfig: {
    nav: [
      { text: '核心能力', link: '/核心能力/' },
      { text: 'AI 应用构建', link: '/A-应用开发/' },
      { text: '模型原理与选型', link: '/C-模型能力/' },
      { text: '服务与生产工程', link: '/B-工程落地/' },
      { text: '代码参考', link: '/E-代码示例/' },
      { text: '语法参考', link: '/语法对照/' },
      { text: '课程练习', link: '/课程练习/' },
      { text: '可运行示例', link: '/examples/' },
    ],
    sidebar: {
      '/核心能力/': [{ text: '核心能力', link: '/核心能力/' }],
      '/A-应用开发/': [abcSections['/A-应用开发/'].home],
      '/B-工程落地/': [abcSections['/B-工程落地/'].home],
      '/C-模型能力/': [abcSections['/C-模型能力/'].home],
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
      '/课程练习/': [
        { text: '课程练习', link: '/课程练习/' },
        { text: 'ThingJS RAG 能力关联', link: '/课程练习/打卡对照' },
        {
          text: '课件',
          collapsed: false,
          items: [
            { text: 'Agent 课件', link: '/课程练习/课件项目/Agent课件' },
            { text: '框架课件', link: '/课程练习/课件项目/框架课件' },
            { text: '平台课件', link: '/课程练习/课件项目/平台课件' },
            { text: '微调课件', link: '/课程练习/课件项目/微调课件' },
            { text: '质检课件', link: '/课程练习/课件项目/质检课件' },
          ],
        },
      ],
      '/examples/': [{ text: '可运行示例', link: '/examples/' }],
    },
    outline: { label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新' },
    search: { provider: 'local' },
  },
})
