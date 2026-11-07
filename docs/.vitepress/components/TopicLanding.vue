<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps<{ area: 'app' | 'engineering' | 'model' }>()

const areas = {
  app: {
    index: '01', title: 'AI 应用开发',
    lead: '把模型接入真实业务：组织上下文、连接知识与工具，并选择合适的应用框架。',
    hint: '建议从提示词工程开始，再进入 RAG、Agent 和框架选型。',
    topics: [
      { title: '提示词工程与上下文', summary: '让输入、约束与输出协议足够清晰。', notes: '/A-应用开发/01-Prompt与上下文工程/知识点', quiz: '/A-应用开发/01-Prompt与上下文工程/面试题' },
      { title: 'RAG 与知识库', summary: '从检索、重排到回答，搭建可信的知识链路。', notes: '/A-应用开发/02-RAG与知识库/知识点', quiz: '/A-应用开发/02-RAG与知识库/面试题' },
      { title: 'Agent 与工具调用', summary: '设计工具边界、任务流程与执行反馈。', notes: '/A-应用开发/03-Agent与工具调用/知识点', quiz: '/A-应用开发/03-Agent与工具调用/面试题' },
      { title: '开发框架', summary: '对照 LangChain、LangGraph 等框架理解选型。', notes: '/A-应用开发/04-应用框架/', quiz: '/A-应用开发/04-应用框架/开发框架面试题' },
      { title: '平台与业务场景', summary: '把技术方案放回平台能力和业务需求中判断。', notes: '/A-应用开发/05-平台与业务场景/知识点', quiz: '/A-应用开发/05-平台与业务场景/面试题' },
    ],
    extra: { title: '框架索引', links: [
      { title: 'LangGraph', href: '/A-应用开发/04-应用框架/Langgraph' },
      { title: 'LangSmith', href: '/A-应用开发/04-应用框架/LangSmith' },
      { title: 'LlamaIndex', href: '/A-应用开发/04-应用框架/LlamaIndex' },
      { title: 'AutoGen', href: '/A-应用开发/04-应用框架/AutoGen' },
      { title: 'Qwen-Agent', href: '/A-应用开发/04-应用框架/QwenAgent' },
      { title: 'OpenManus', href: '/A-应用开发/04-应用框架/OpenManus' },
    ] },
  },
  engineering: {
    index: '02', title: '服务与生产工程',
    lead: '让 AI 应用稳定运行：从服务接口、质量与交付，到部署和推理性能。',
    hint: '建议先建立服务与质量基线，再查阅部署和优化。',
    topics: [
      { title: '服务、质量与交付', summary: '理解接口设计、评测、可观测性与安全。', notes: '/B-工程落地/01-应用服务与交付/知识点', quiz: '/B-工程落地/01-应用服务与交付/技术问答' },
      { title: '推理部署', summary: '选择部署方式，理解服务化过程与约束。', notes: '/B-工程落地/06-推理部署与优化/部署-知识点', quiz: '/B-工程落地/06-推理部署与优化/部署-面试题' },
      { title: '推理优化', summary: '从延迟、吞吐和资源占用分析优化空间。', notes: '/B-工程落地/06-推理部署与优化/推理优化-知识点', quiz: '/B-工程落地/06-推理部署与优化/推理优化-面试题' },
    ],
    extra: { title: '部署案例', links: [{ title: '华为昇腾部署 DeepSeek', href: '/B-工程落地/06-推理部署与优化/华为升腾部署DEEPSEEK' }] },
  },
  model: {
    index: '03', title: '模型原理与选型',
    lead: '理解模型能力与边界，为应用选型、方案取舍和算法协作打基础。',
    hint: '按当前问题选择主题；进阶内容可以在项目需要时再深入。',
    topics: [
      { title: '模型生态与 Hugging Face', summary: '理解模型、数据集与常用生态工具。', notes: '/C-模型能力/08-HuggingFace/知识点', quiz: '/C-模型能力/08-HuggingFace/面试题' },
      { title: '微调', summary: '判断什么时候需要微调，以及如何协作落地。', notes: '/C-模型能力/09-微调与蒸馏/微调-知识点', quiz: '/C-模型能力/09-微调与蒸馏/微调-面试题' },
      { title: '蒸馏', summary: '理解模型压缩与能力迁移的适用场景。', notes: '/C-模型能力/09-微调与蒸馏/蒸馏-知识点', quiz: '/C-模型能力/09-微调与蒸馏/蒸馏-面试题' },
      { title: '神经网络与视觉', summary: '进阶了解基础网络与视觉任务。', notes: '/C-模型能力/07-神经网络与视觉/知识点', quiz: '/C-模型能力/07-神经网络与视觉/面试题' },
    ],
    extra: null,
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
      <div class="topic-landing__hint"><span aria-hidden="true">↳</span>{{ area.hint }}</div>
    </header>

    <section aria-labelledby="topic-list-title">
      <div class="topic-landing__section-title"><span>专题目录</span><h2 id="topic-list-title">选择一个主题开始</h2></div>
      <div class="topic-landing__list">
        <article v-for="(topic, index) in area.topics" :key="topic.title" class="topic-entry">
          <span class="topic-entry__number">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="topic-entry__content"><h3>{{ topic.title }}</h3><p>{{ topic.summary }}</p></div>
          <div class="topic-entry__links"><a :href="withBase(topic.notes)">阅读笔记 <span aria-hidden="true">→</span></a><a :href="withBase(topic.quiz)">技术问答 <span aria-hidden="true">→</span></a></div>
        </article>
      </div>
    </section>

    <section v-if="area.extra" class="topic-landing__extra" aria-labelledby="topic-extra-title">
      <div class="topic-landing__section-title"><span>延伸查阅</span><h2 id="topic-extra-title">{{ area.extra.title }}</h2></div>
      <div class="topic-landing__extra-links"><a v-for="link in area.extra.links" :key="link.href" :href="withBase(link.href)">{{ link.title }} <span aria-hidden="true">↗</span></a></div>
    </section>
    <footer class="topic-landing__footer"><a :href="withBase('/核心能力/')">按核心能力复习 <span aria-hidden="true">→</span></a><a :href="withBase('/E-代码示例/')">查看代码示例 <span aria-hidden="true">→</span></a></footer>
  </div>
</template>
