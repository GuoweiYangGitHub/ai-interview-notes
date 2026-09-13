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

const frameworkQuiz = '/A-应用开发/04-应用框架/开发框架面试题'

export const abcSections: Record<string, AbcSection> = {
  '/A-应用开发/': {
    home: { text: 'AI 应用构建', link: '/A-应用开发/' },
    notes: [
      { text: '提示词', link: '/A-应用开发/01-Prompt与上下文工程/知识点' },
      { text: '知识库', link: '/A-应用开发/02-RAG与知识库/知识点' },
      { text: '智能体', link: '/A-应用开发/03-Agent与工具调用/知识点' },
      {
        text: '应用框架',
        items: [
          {
            text: 'LangChain 家族',
            items: [
              { text: 'LangChain', pair: 'LangChain', link: '/A-应用开发/04-应用框架/LangChain' },
              { text: 'LangGraph', pair: 'LangGraph', link: '/A-应用开发/04-应用框架/Langgraph' },
              { text: 'LangSmith', pair: 'LangSmith', link: '/A-应用开发/04-应用框架/LangSmith' },
            ],
          },
          { text: 'LlamaIndex', pair: 'LlamaIndex', link: '/A-应用开发/04-应用框架/LlamaIndex' },
          { text: 'AutoGen', pair: 'AutoGen', link: '/A-应用开发/04-应用框架/AutoGen' },
          { text: 'Qwen-Agent', pair: 'Qwen-Agent', link: '/A-应用开发/04-应用框架/QwenAgent' },
          { text: 'OpenManus', pair: 'OpenManus', link: '/A-应用开发/04-应用框架/OpenManus' },
        ],
      },
      { text: '平台与业务', link: '/A-应用开发/05-平台与业务场景/知识点' },
    ],
    quiz: [
      { text: '提示词', link: '/A-应用开发/01-Prompt与上下文工程/面试题' },
      { text: '知识库', link: '/A-应用开发/02-RAG与知识库/面试题' },
      { text: '智能体', link: '/A-应用开发/03-Agent与工具调用/面试题' },
      {
        text: '应用框架',
        items: [
          {
            text: 'LangChain 家族',
            items: [
              { text: 'LangChain', pair: 'LangChain', link: `${frameworkQuiz}#重点-langchain-六大核心组件的职责和关系` },
              { text: 'LangGraph', pair: 'LangGraph', link: `${frameworkQuiz}#为什么用-langgraph-而不是传统-chain` },
              { text: 'LangSmith', pair: 'LangSmith', link: `${frameworkQuiz}#从业务场景怎么选-agent-框架` },
            ],
          },
          { text: 'LlamaIndex', pair: 'LlamaIndex', link: `${frameworkQuiz}#重点-langchain、llamaindex、qwen-agent-怎么选` },
          { text: 'AutoGen', pair: 'AutoGen', link: `${frameworkQuiz}#都有哪些主流的-ai-agent-框架` },
          { text: 'Qwen-Agent', pair: 'Qwen-Agent', link: `${frameworkQuiz}#重点-langchain、llamaindex、qwen-agent-怎么选` },
          { text: 'OpenManus', pair: 'OpenManus', link: `${frameworkQuiz}#openmanus-四级继承是什么` },
        ],
      },
      { text: '平台与业务', link: '/A-应用开发/05-平台与业务场景/面试题' },
    ],
  },
  '/B-工程落地/': {
    home: { text: '服务与生产工程', link: '/B-工程落地/' },
    notes: [
      { text: '服务、质量与交付', link: '/B-工程落地/01-应用服务与交付/知识点' },
      { text: '部署', link: '/B-工程落地/06-推理部署与优化/部署-知识点' },
      { text: '推理优化', link: '/B-工程落地/06-推理部署与优化/推理优化-知识点' },
      { text: '华为升腾', link: '/B-工程落地/06-推理部署与优化/华为升腾部署DEEPSEEK' },
    ],
    quiz: [
      { text: '服务、质量与交付', link: '/B-工程落地/01-应用服务与交付/技术问答' },
      { text: '部署', link: '/B-工程落地/06-推理部署与优化/部署-面试题' },
      { text: '推理优化', link: '/B-工程落地/06-推理部署与优化/推理优化-面试题' },
    ],
  },
  '/C-模型能力/': {
    home: { text: '模型原理与选型', link: '/C-模型能力/' },
    notes: [
      { text: '神经网络与视觉（进阶）', link: '/C-模型能力/07-神经网络与视觉/知识点' },
      { text: 'Hugging Face 与模型生态', link: '/C-模型能力/08-HuggingFace/知识点' },
      { text: '微调（选型与协作）', link: '/C-模型能力/09-微调与蒸馏/微调-知识点' },
      { text: '蒸馏（进阶）', link: '/C-模型能力/09-微调与蒸馏/蒸馏-知识点' },
    ],
    quiz: [
      { text: '神经网络与视觉（进阶）', link: '/C-模型能力/07-神经网络与视觉/面试题' },
      { text: 'Hugging Face 与模型生态', link: '/C-模型能力/08-HuggingFace/面试题' },
      { text: '微调（选型与协作）', link: '/C-模型能力/09-微调与蒸馏/微调-面试题' },
      { text: '蒸馏（进阶）', link: '/C-模型能力/09-微调与蒸馏/蒸馏-面试题' },
    ],
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
  return normalized.includes('面试题') || normalized.includes('技术问答')
}
