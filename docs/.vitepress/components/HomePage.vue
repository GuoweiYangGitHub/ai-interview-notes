<script setup lang="ts">
import { withBase } from 'vitepress'

const sections = [
  {
    number: '01',
    title: '前端基础',
    summary: 'JS、TS、CSS、浏览器、框架与工程化。',
    href: '/01-前端基础/',
    topics: [
      { label: 'JavaScript', href: '/01-前端基础/01-JavaScript/知识点' },
      { label: 'TypeScript', href: '/01-前端基础/02-TypeScript/' },
      { label: 'Vue 与 React', href: '/01-前端基础/05-Vue与React/Vue' },
      {
        label: '手写与算法',
        href: '/01-前端基础/07-手写与算法/算法与数据结构',
      },
    ],
  },
  {
    number: '02',
    title: 'AI 应用开发',
    summary: '从 Prompt 到 Agent，再到工程交付。',
    href: '/02-AI应用开发/',
    topics: [
      {
        label: 'Prompt 与上下文',
        href: '/02-AI应用开发/01-Prompt与上下文工程/知识点',
      },
      {
        label: 'RAG 与知识库',
        href: '/02-AI应用开发/02-RAG与知识库/知识点',
      },
      {
        label: 'Agent 与工具',
        href: '/02-AI应用开发/03-Agent与工具调用/知识点',
      },
      {
        label: '工程与交付',
        href: '/02-AI应用开发/06-工程与交付/知识点',
      },
    ],
  },
  {
    number: '03',
    title: '项目实战',
    summary: '三个可以讲深的工程案例。',
    href: '/03-项目实战/',
    topics: [
      {
        label: '江中智能助手',
        href: '/03-项目实战/02-江中智能助手/面试问题',
      },
      {
        label: 'THINGJS 文档 RAG',
        href: '/03-项目实战/01-THINGJS文档RAG/面试问题',
      },
      {
        label: '中国移动网络拓扑',
        href: '/03-项目实战/04-中国移动网络拓扑',
      },
      { label: '跨项目对比与压力问题', href: '/03-项目实战/跨项目对比与压力问题' },
    ],
  },
  {
    number: '04',
    title: '面试题库',
    summary: 'Agent → RAG → 工具 → 工程 → 前端。',
    href: '/04-面试题库/',
    topics: [
      { label: '前端与 JavaScript', href: '/04-面试题库/#frontend-01' },
    ],
  },
]

const featured = [
  {
    title: '前端基础',
    summary: 'JS、TS、CSS 与框架',
    href: '/01-前端基础/',
  },
  {
    title: 'RAG 与知识库',
    summary: '检索、重排与回答',
    href: '/02-AI应用开发/02-RAG与知识库/知识点',
  },
  {
    title: '项目实战',
    summary: 'THINGJS、江中与网络拓扑',
    href: '/03-项目实战/',
  },
  {
    title: '面试题库',
    summary: '项目 → Agent → 简历 → 前端',
    href: '/04-面试题库/',
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
          面向 AI 应用开发（偏前端）岗位，把前端基础、提示词、RAG、Agent、项目实战与工程交付整理成清晰的专题笔记。
        </p>
        <div class="home-hero__actions">
          <a
            class="home-button home-button--primary"
            :href="withBase('/04-面试题库/')"
            >从项目 3 分钟开始 <span aria-hidden="true">↗</span></a
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
        <p>用面试题库回顾关键判断，再对照代码示例看具体实现。</p>
      </div>
      <div class="home-practice__links">
        <a :href="withBase('/04-面试题库/')"
          >题库复习 <span aria-hidden="true">→</span></a
        ><a :href="withBase('/90-附录/代码示例/')"
          >浏览代码示例 <span aria-hidden="true">→</span></a
        >
      </div>
    </section>
    <footer class="home-resources">
      辅助资料 <span aria-hidden="true">·</span>
      <a :href="withBase('/90-附录/语法对照/')">Python 与 JavaScript 语法对照</a>
    </footer>
  </main>
</template>
