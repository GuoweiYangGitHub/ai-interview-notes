<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps<{
  area: 'ai'
}>()

const areas = {
  ai: {
    index: '02',
    title: 'AI 应用开发',
    lead: '把模型接入真实业务：组织上下文、连接知识与工具，并选择合适的应用框架。',
    hint: '建议从 Prompt 开始，再进入 RAG、Agent 和工程交付。',
    topics: [
      {
        title: 'Prompt 与上下文',
        summary: '输入、约束、上下文与输出协议。',
        notes: '/02-AI应用开发/01-Prompt与上下文工程/知识点',
        quiz: '/02-AI应用开发/01-Prompt与上下文工程/面试题',
      },
      {
        title: 'RAG 与知识库',
        summary: '从检索、重排到回答，搭建可信的知识链路。',
        notes: '/02-AI应用开发/02-RAG与知识库/知识点',
        quiz: '/02-AI应用开发/02-RAG与知识库/面试题',
      },
      {
        title: 'Agent 与工具调用',
        summary: '设计工具边界、任务流程与执行反馈。',
        notes: '/02-AI应用开发/03-Agent与工具调用/知识点',
        quiz: '/02-AI应用开发/03-Agent与工具调用/面试题',
      },
      {
        title: '应用框架',
        summary: '对照 LangChain、LangGraph 等框架理解选型。',
        notes: '/02-AI应用开发/04-应用框架/',
        quiz: '/02-AI应用开发/04-应用框架/开发框架面试题',
      },
      {
        title: '平台与业务场景',
        summary: '把技术方案放回平台能力和业务需求中判断。',
        notes: '/02-AI应用开发/05-平台与业务场景/知识点',
        quiz: '/02-AI应用开发/05-平台与业务场景/面试题',
      },
      {
        title: '工程与交付',
        summary: '服务、流式交互、评测与可观测。',
        notes: '/02-AI应用开发/06-工程与交付/知识点',
        quiz: '/02-AI应用开发/06-工程与交付/面试题',
      },
      {
        title: '部署与推理',
        summary: '部署方式、KV Cache、批处理与性能诊断。',
        notes: '/02-AI应用开发/07-部署与推理/部署-知识点',
        quiz: '/02-AI应用开发/07-部署与推理/部署-面试题',
      },
      {
        title: '模型基础与选型',
        summary: '模型生态、微调与蒸馏的适用边界。',
        notes: '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/知识点',
        quiz: '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/面试题',
      },
    ],
    extra: {
      title: '框架索引',
      links: [
        { title: 'LangChain', href: '/02-AI应用开发/04-应用框架/LangChain' },
        { title: 'LangGraph', href: '/02-AI应用开发/04-应用框架/Langgraph' },
        {
          title: 'LlamaIndex',
          href: '/02-AI应用开发/04-应用框架/LlamaIndex',
        },
        { title: 'AutoGen', href: '/02-AI应用开发/04-应用框架/AutoGen' },
        {
          title: 'Qwen-Agent',
          href: '/02-AI应用开发/04-应用框架/QwenAgent',
        },
        { title: 'OpenManus', href: '/02-AI应用开发/04-应用框架/OpenManus' },
      ],
    },
  },
} as const

const area = computed(() => areas[props.area])
</script>

<template>
  <div class="topic-landing">
    <header class="topic-landing__hero">
      <p class="topic-landing__eyebrow">FIELD GUIDE / {{ area.index }}</p>
      <h1>{{ area.title }}</h1>
      <p class="topic-landing__lead">{{ area.lead }}</p>
      <div class="topic-landing__hint">
        <span aria-hidden="true">↳</span>{{ area.hint }}
      </div>
    </header>

    <section aria-labelledby="topic-list-title">
      <div class="topic-landing__section-title">
        <span>专题目录</span>
        <h2 id="topic-list-title">选择一个主题开始</h2>
      </div>
      <div class="topic-landing__list">
        <article
          v-for="(topic, index) in area.topics"
          :key="topic.title"
          class="topic-entry"
        >
          <span class="topic-entry__number">{{
            String(index + 1).padStart(2, '0')
          }}</span>
          <div class="topic-entry__content">
            <h3>{{ topic.title }}</h3>
            <p>{{ topic.summary }}</p>
          </div>
          <div class="topic-entry__links">
            <a v-if="topic.notes" :href="withBase(topic.notes)"
              >阅读笔记 <span aria-hidden="true">→</span></a
            ><a :href="withBase(topic.quiz)"
              >面试题 <span aria-hidden="true">→</span></a
            >
          </div>
        </article>
      </div>
    </section>

    <section
      v-if="area.extra"
      class="topic-landing__extra"
      aria-labelledby="topic-extra-title"
    >
      <div class="topic-landing__section-title">
        <span>延伸查阅</span>
        <h2 id="topic-extra-title">{{ area.extra.title }}</h2>
      </div>
      <div class="topic-landing__extra-links">
        <a
          v-for="link in area.extra.links"
          :key="link.href"
          :href="withBase(link.href)"
          >{{ link.title }} <span aria-hidden="true">↗</span></a
        >
      </div>
    </section>
    <footer class="topic-landing__footer">
      <a :href="withBase('/04-面试题库/')"
        >按项目 3 分钟复习 <span aria-hidden="true">→</span></a
      ><a :href="withBase('/90-附录/代码示例/')"
        >查看代码示例 <span aria-hidden="true">→</span></a
      >
    </footer>
  </div>
</template>
