<script setup lang="ts">
import { withBase } from 'vitepress'

const sections = [
  {
    number: '01',
    title: 'AI 应用开发',
    summary: '从输入到回答，搭建完整的应用链路。',
    href: '/A-应用开发/',
    topics: [
      {
        label: '提示词工程与上下文',
        href: '/A-应用开发/01-Prompt与上下文工程/知识点',
      },
      { label: 'RAG 与知识库', href: '/A-应用开发/02-RAG与知识库/知识点' },
      {
        label: 'Agent 与工具调用',
        href: '/A-应用开发/03-Agent与工具调用/知识点',
      },
      { label: '平台与业务场景', href: '/A-应用开发/05-平台与业务场景/知识点' },
    ],
  },
  {
    number: '02',
    title: '开发框架',
    summary: '根据编排、检索和多智能体需求选择工具。',
    href: '/A-应用开发/04-应用框架/',
    topics: [
      { label: 'LangChain', href: '/A-应用开发/04-应用框架/LangChain' },
      { label: 'LangGraph', href: '/A-应用开发/04-应用框架/Langgraph' },
      { label: 'LlamaIndex', href: '/A-应用开发/04-应用框架/LlamaIndex' },
      { label: 'AutoGen 与更多框架', href: '/A-应用开发/04-应用框架/' },
    ],
  },
  {
    number: '03',
    title: '工程落地',
    summary: '让应用成为稳定、可观察、可优化的服务。',
    href: '/B-工程落地/',
    topics: [
      {
        label: '服务、质量与交付',
        href: '/B-工程落地/01-应用服务与交付/知识点',
      },
      { label: '推理部署', href: '/B-工程落地/06-推理部署与优化/部署-知识点' },
      {
        label: '推理优化',
        href: '/B-工程落地/06-推理部署与优化/推理优化-知识点',
      },
    ],
  },
  {
    number: '04',
    title: '模型能力与选型',
    summary: '理解能力边界，再决定模型与方案。',
    href: '/C-模型能力/',
    topics: [
      {
        label: '模型生态与 Hugging Face',
        href: '/C-模型能力/08-HuggingFace/知识点',
      },
      { label: '微调与蒸馏', href: '/C-模型能力/09-微调与蒸馏/微调-知识点' },
      { label: '神经网络与视觉', href: '/C-模型能力/07-神经网络与视觉/知识点' },
    ],
  },
  {
    number: '05',
    title: 'AI 架构',
    summary: '用架构面试题复习复杂链路里的判断。',
    href: '/D-AI架构/',
    topics: [
      { label: '模型请求与结果契约', href: '/D-AI架构/面试题#model-contract' },
      { label: '工具、执行环境与外部接入', href: '/D-AI架构/面试题#tools' },
      {
        label: '状态、上下文与持续工作',
        href: '/D-AI架构/面试题#state-context',
      },
      { label: '过程观测、评估与优化', href: '/D-AI架构/面试题#eval' },
    ],
  },
]

const featured = [
  {
    title: '提示词工程',
    summary: '输入、约束与上下文',
    href: '/A-应用开发/01-Prompt与上下文工程/知识点',
  },
  {
    title: 'RAG 与知识库',
    summary: '检索、重排与回答',
    href: '/A-应用开发/02-RAG与知识库/知识点',
  },
  {
    title: 'Agent 与工具',
    summary: '行动能力与流程编排',
    href: '/A-应用开发/03-Agent与工具调用/知识点',
  },
  {
    title: '开发框架',
    summary: 'LangChain、LangGraph 等',
    href: '/A-应用开发/04-应用框架/',
  },
]
</script>

<template>
  <main class="home-page">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero__copy">
        <p class="home-eyebrow">
          <span class="home-eyebrow__dot" /> 开源 · AI 应用开发笔记
        </p>
        <h1 id="home-title">从理解模型<br />到<span>交付 AI 应用</span></h1>
        <p class="home-hero__lead">
          围绕 AI
          应用开发工程师的工作，把提示词、RAG、Agent、框架与工程交付整理成清晰的专题笔记。
        </p>
        <div class="home-hero__actions">
          <a
            class="home-button home-button--primary"
            :href="withBase('/核心能力/')"
            >从核心能力开始 <span aria-hidden="true">↗</span></a
          >
          <a class="home-button home-button--secondary" href="#专题导航"
            >浏览专题 <span aria-hidden="true">↓</span></a
          >
        </div>
      </div>
      <aside class="home-start" aria-label="重点专题">
        <div class="home-start__top">
          <span>TOPICS / 专题入口</span><span aria-hidden="true">✳</span>
        </div>
        <h2>直接进入你要查的主题</h2>
        <a
          v-for="(topic, index) in featured"
          :key="topic.href"
          :href="withBase(topic.href)"
          ><span class="home-start__number">0{{ index + 1 }}</span
          ><span
            ><strong>{{ topic.title }}</strong
            ><small>{{ topic.summary }}</small></span
          ><span aria-hidden="true">↗</span></a
        >
      </aside>
    </section>

    <section
      id="专题导航"
      class="home-section"
      aria-labelledby="home-paths-title"
    >
      <div class="home-section__heading">
        <div>
          <p class="home-section__eyebrow">FIELD NOTES / 专题笔记</p>
          <h2 id="home-paths-title">每个方向，都有明确入口</h2>
        </div>
        <p>按开发任务分组。点主题名称直接读笔记，也可以进入完整专题。</p>
      </div>
      <div class="home-paths">
        <article
          v-for="section in sections"
          :key="section.number"
          class="home-path"
        >
          <div class="home-path__header">
            <span>{{ section.number }} / 方向</span
            ><span aria-hidden="true">↗</span>
          </div>
          <h3>
            <a :href="withBase(section.href)">{{ section.title }}</a>
          </h3>
          <p>{{ section.summary }}</p>
          <ul>
            <li v-for="topic in section.topics" :key="topic.label">
              <a :href="withBase(topic.href)"
                >{{ topic.label }} <span aria-hidden="true">→</span></a
              >
            </li>
          </ul>
          <a class="home-path__all" :href="withBase(section.href)"
            >查看完整目录 <span aria-hidden="true">→</span></a
          >
        </article>
      </div>
    </section>

    <section class="home-practice" aria-labelledby="home-practice-title">
      <div>
        <p class="home-section__eyebrow">READ & BUILD / 复习与实践</p>
        <h2 id="home-practice-title">读完专题，继续动手</h2>
        <p>用重点清单回顾关键判断，再对照代码示例看具体实现。</p>
      </div>
      <div class="home-practice__links">
        <a :href="withBase('/核心能力/')"
          >核心能力复习 <span aria-hidden="true">→</span></a
        ><a :href="withBase('/E-代码示例/')"
          >浏览代码示例 <span aria-hidden="true">→</span></a
        >
      </div>
    </section>
    <footer class="home-resources">
      辅助资料 <span aria-hidden="true">·</span>
      <a :href="withBase('/语法对照/')">Python 与 JavaScript 语法对照</a>
    </footer>
  </main>
</template>
