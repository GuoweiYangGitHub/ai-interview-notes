import {
  categories as interviewCategories,
  categoryOrder,
  predictedGroups,
} from './data/interview-bank.mjs'

function localNumber(index: number) {
  return `Q${String(index + 1).padStart(2, '0')}`
}

function categoryGroup(category: any) {
  const items = category.questions.map((question: any, index: number) => ({
    text: `${localNumber(index)} ${question.title}`,
    link: `/04-面试题库/#${category.id}-${localNumber(index)}`,
  }))
  if (!items.length) {
    items.push({
      text: '暂无题目',
      link: `/04-面试题库/#cat-${category.id}`,
    })
  }
  return {
    text: category.title,
    collapsed: false,
    items,
  }
}

const orderedCategories = categoryOrder
  .map((id: string) =>
    interviewCategories.find((category: any) => category.id === id),
  )
  .filter(Boolean)

const introCategories = orderedCategories.filter(
  (category: any) => category.id === 'project-intro',
)
const predictedContainer = orderedCategories.find(
  (category: any) => category.id === 'predicted',
)
const predictedCategories = predictedGroups.map((group: any) => ({
  id: group.id,
  title: group.title,
  questions:
    predictedContainer?.questions.filter(
      (question: any) => question.group === group.group,
    ) ?? [],
}))
const followUpCategories = orderedCategories.filter(
  (category: any) =>
    category.id !== 'project-intro' && category.id !== 'predicted',
)

export const interviewBankSidebar = [
  { text: '面试题库', link: '/04-面试题库/' },
  {
    text: '关键词',
    collapsed: false,
    items: [{ text: '关键词速查', link: '/04-面试题库/#keywords' }],
  },
  ...introCategories.map(categoryGroup),
  ...predictedCategories.map(categoryGroup),
  {
    text: '面试官追问',
    collapsed: false,
    items: followUpCategories.map(categoryGroup),
  },
]

export type SidebarItem = {
  text: string
  link?: string
  pair?: string
  items?: SidebarItem[]
}

export type AbcSection = {
  home: { text: string; link: string }
  notes: SidebarItem[]
  quiz: SidebarItem[]
}

const frameworkQuiz = '/02-AI应用开发/04-应用框架/开发框架面试题'
const thingjs = '/03-项目实战/01-THINGJS文档RAG'
const jiangzhong = '/03-项目实战/02-江中智能助手'

export const abcSections: Record<string, AbcSection> = {
  '/01-前端基础/': {
    home: { text: '前端基础', link: '/01-前端基础/' },
    notes: [
      { text: 'HTML', pair: 'HTML', link: '/01-前端基础/00-HTML/知识点' },
      {
        text: 'JavaScript',
        pair: 'JS',
        link: '/01-前端基础/01-JavaScript/知识点',
      },
      { text: 'TypeScript', pair: 'TS', link: '/01-前端基础/02-TypeScript/' },
      {
        text: 'CSS 与布局',
        pair: 'CSS',
        link: '/01-前端基础/03-CSS与布局/知识点',
      },
      {
        text: '浏览器与网络',
        pair: 'Browser',
        link: '/01-前端基础/04-浏览器与网络/网络与HTTP',
      },
      {
        text: 'Vue 与 React',
        pair: 'Framework',
        link: '/01-前端基础/05-Vue与React/Vue',
      },
      {
        text: '工程化与性能',
        pair: 'Engineering',
        link: '/01-前端基础/06-工程化与性能/性能优化',
      },
      {
        text: '手写与算法',
        pair: 'Handwrite',
        link: '/01-前端基础/07-手写与算法/算法与数据结构',
      },
      {
        text: '小程序',
        pair: 'WXApp',
        link: '/01-前端基础/08-小程序/基础知识',
      },
    ],
    quiz: [
      { text: 'HTML', pair: 'HTML', link: '/01-前端基础/00-HTML/面试题' },
      { text: 'JavaScript', pair: 'JS', link: '/01-前端基础/01-JavaScript/面试题' },
      { text: 'TypeScript', pair: 'TS', link: '/01-前端基础/02-TypeScript/面试题' },
      { text: 'CSS 与布局', pair: 'CSS', link: '/01-前端基础/03-CSS与布局/面试题' },
      {
        text: '浏览器与网络',
        pair: 'Browser',
        link: '/01-前端基础/04-浏览器与网络/面试题',
      },
      {
        text: 'Vue 与 React',
        pair: 'Framework',
        link: '/01-前端基础/05-Vue与React/面试题',
      },
      {
        text: '工程化与性能',
        pair: 'Engineering',
        link: '/01-前端基础/06-工程化与性能/面试题',
      },
      {
        text: '手写与算法',
        pair: 'Handwrite',
        link: '/01-前端基础/07-手写与算法/面试题',
      },
      { text: '小程序', pair: 'WXApp', link: '/01-前端基础/08-小程序/面试题' },
    ],
  },
  '/02-AI应用开发/': {
    home: { text: 'AI 应用开发', link: '/02-AI应用开发/' },
    notes: [
      {
        text: 'Prompt 与上下文',
        pair: 'Prompt',
        link: '/02-AI应用开发/01-Prompt与上下文工程/知识点',
      },
      {
        text: 'RAG 与知识库',
        pair: 'RAG',
        link: '/02-AI应用开发/02-RAG与知识库/知识点',
      },
      {
        text: 'Agent 与工具调用',
        pair: 'Agent',
        link: '/02-AI应用开发/03-Agent与工具调用/知识点',
      },
      {
        text: '开发框架',
        items: [
          { text: '框架总览', link: '/02-AI应用开发/04-应用框架/' },
          {
            text: 'LangChain 家族',
            items: [
              {
                text: 'LangChain',
                pair: 'LangChain',
                link: '/02-AI应用开发/04-应用框架/LangChain',
              },
              {
                text: 'LangGraph',
                pair: 'LangGraph',
                link: '/02-AI应用开发/04-应用框架/Langgraph',
              },
              {
                text: 'LangSmith',
                pair: 'LangSmith',
                link: '/02-AI应用开发/04-应用框架/LangSmith',
              },
            ],
          },
          {
            text: 'LlamaIndex',
            pair: 'LlamaIndex',
            link: '/02-AI应用开发/04-应用框架/LlamaIndex',
          },
          {
            text: 'AutoGen',
            pair: 'AutoGen',
            link: '/02-AI应用开发/04-应用框架/AutoGen',
          },
          {
            text: 'Qwen-Agent',
            pair: 'Qwen-Agent',
            link: '/02-AI应用开发/04-应用框架/QwenAgent',
          },
          {
            text: 'OpenManus',
            pair: 'OpenManus',
            link: '/02-AI应用开发/04-应用框架/OpenManus',
          },
        ],
      },
      {
        text: '平台与业务场景',
        pair: 'Platform',
        link: '/02-AI应用开发/05-平台与业务场景/知识点',
      },
      {
        text: '工程与交付',
        pair: 'Delivery',
        link: '/02-AI应用开发/06-工程与交付/知识点',
      },
      {
        text: 'Node/Express/SSE',
        link: '/02-AI应用开发/06-工程与交付/Node与SSE',
      },
      {
        text: '部署与推理',
        pair: 'Inference',
        link: '/02-AI应用开发/07-部署与推理/部署-知识点',
      },
      {
        text: '模型基础与选型',
        pair: 'Model',
        link: '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/知识点',
      },
    ],
    quiz: [
      {
        text: 'Prompt 与上下文',
        pair: 'Prompt',
        link: '/02-AI应用开发/01-Prompt与上下文工程/面试题',
      },
      {
        text: 'RAG 与知识库',
        pair: 'RAG',
        link: '/02-AI应用开发/02-RAG与知识库/面试题',
      },
      {
        text: 'Agent 与工具调用',
        pair: 'Agent',
        link: '/02-AI应用开发/03-Agent与工具调用/面试题',
      },
      {
        text: '开发框架',
        items: [
          {
            text: 'LangChain 家族',
            items: [
              {
                text: 'LangChain',
                pair: 'LangChain',
                link: `${frameworkQuiz}#重点-langchain-六大核心组件的职责和关系`,
              },
              {
                text: 'LangGraph',
                pair: 'LangGraph',
                link: `${frameworkQuiz}#为什么用-langgraph-而不是传统-chain`,
              },
              {
                text: 'LangSmith',
                pair: 'LangSmith',
                link: `${frameworkQuiz}#从业务场景怎么选-agent-框架`,
              },
            ],
          },
          {
            text: 'LlamaIndex',
            pair: 'LlamaIndex',
            link: `${frameworkQuiz}#重点-langchain、llamaindex、qwen-agent-怎么选`,
          },
          {
            text: 'AutoGen',
            pair: 'AutoGen',
            link: `${frameworkQuiz}#都有哪些主流的-ai-agent-框架`,
          },
          {
            text: 'Qwen-Agent',
            pair: 'Qwen-Agent',
            link: `${frameworkQuiz}#重点-langchain、llamaindex、qwen-agent-怎么选`,
          },
          {
            text: 'OpenManus',
            pair: 'OpenManus',
            link: `${frameworkQuiz}#openmanus-四级继承是什么`,
          },
        ],
      },
      {
        text: '平台与业务场景',
        pair: 'Platform',
        link: '/02-AI应用开发/05-平台与业务场景/面试题',
      },
      {
        text: '工程与交付',
        pair: 'Delivery',
        link: '/02-AI应用开发/06-工程与交付/面试题',
      },
      {
        text: '部署与推理',
        pair: 'Inference',
        link: '/02-AI应用开发/07-部署与推理/部署-面试题',
      },
      {
        text: '模型基础与选型',
        pair: 'Model',
        link: '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/面试题',
      },
    ],
  },
  '/03-项目实战/': {
    home: { text: '项目实战', link: '/03-项目实战/' },
    notes: [
      {
        text: 'THINGJS 文档 RAG',
        items: [
          { text: '项目问答 R01–R18', link: `${thingjs}/12-项目问答` },
          { text: '关键取舍', link: `${thingjs}/09-关键取舍` },
          { text: '面试讲法', link: `${thingjs}/10-面试讲法` },
          { text: '八股项目答法', link: `${thingjs}/11-八股项目答法` },
        ],
      },
      {
        text: '江中智能助手',
        items: [
          { text: '面试问答 J01–J21', link: `${jiangzhong}/11-面试问答` },
          { text: '关键取舍', link: `${jiangzhong}/09-关键取舍` },
          { text: '数字速查与讲法', link: `${jiangzhong}/10-数字速查与讲法` },
        ],
      },
      { text: '中国移动网络拓扑', link: '/03-项目实战/04-中国移动网络拓扑' },
      { text: '跨项目对比', link: '/03-项目实战/03-跨项目对比' },
    ],
    quiz: [],
  },
  '/90-附录/': {
    home: { text: '附录', link: '/90-附录/' },
    notes: [
      { text: '语法对照', link: '/90-附录/语法对照/' },
      { text: '代码示例', link: '/90-附录/代码示例/' },
      { text: '常用正则', link: '/90-附录/常用正则' },
    ],
    quiz: [],
  },
}

export function pairKey(item: SidebarItem) {
  return item.pair ?? item.text
}

export function normalizePath(path: string) {
  return decodeURIComponent(path)
    .replace(/\.html$/, '')
    .replace(/#.*$/, '')
    .replace(/\/$/, '')
}

export function itemContains(item: SidebarItem, path: string): boolean {
  if (item.link && normalizePath(item.link) === normalizePath(path)) {
    return true
  }
  return item.items?.some((child) => itemContains(child, path)) ?? false
}

export function matchAbcSection(path: string) {
  const normalized = decodeURIComponent(path)
  for (const prefix of Object.keys(abcSections)) {
    const root = prefix.replace(/\/$/, '')
    if (
      normalized === root ||
      normalized === prefix ||
      normalized.startsWith(`${root}/`)
    ) {
      return abcSections[prefix]
    }
  }
  return null
}

export function isQuizPath(path: string) {
  const normalized = decodeURIComponent(path)
  if (normalized === '/04-面试题库/' || normalized.startsWith('/04-面试题库/')) {
    return false
  }
  return normalized.includes('面试题') || normalized.includes('技术问答')
}
