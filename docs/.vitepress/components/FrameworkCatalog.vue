<script setup lang="ts">
import { withBase } from 'vitepress'

const frameworks = [
  { name: 'LangChain', kind: '应用编排', description: '模型、提示词、工具与检索组件的基础抽象。', href: '/A-应用开发/04-应用框架/LangChain' },
  { name: 'LangGraph', kind: '工作流与状态', description: '用状态图组织多步骤任务与 Agent 流程。', href: '/A-应用开发/04-应用框架/Langgraph' },
  { name: 'LlamaIndex', kind: '知识与检索', description: '围绕数据接入、索引与知识应用构建。', href: '/A-应用开发/04-应用框架/LlamaIndex' },
  { name: 'LangSmith', kind: '追踪与调试', description: '观察执行过程，分析和评测应用行为。', href: '/A-应用开发/04-应用框架/LangSmith' },
  { name: 'AutoGen', kind: '多智能体', description: '组织多个智能体之间的协作与对话。', href: '/A-应用开发/04-应用框架/AutoGen' },
  { name: 'Qwen-Agent', kind: '工具与智能体', description: '结合模型能力、工具和 Agent 开发。', href: '/A-应用开发/04-应用框架/QwenAgent' },
  { name: 'OpenManus', kind: '智能体实践', description: '了解通用智能体的任务执行结构。', href: '/A-应用开发/04-应用框架/OpenManus' },
]
</script>

<template>
  <div class="framework-catalog">
    <header class="topic-landing__hero">
      <p class="topic-landing__eyebrow">FIELD GUIDE / 开发框架</p>
      <h1>开发框架</h1>
      <p class="topic-landing__lead">从用途出发认识框架：应用编排、知识检索、多智能体与调试。先看框架解决什么问题，再决定是否引入。</p>
      <div class="topic-landing__hint"><span aria-hidden="true">↳</span>刚开始学习？先看 LangChain 与 LangGraph，再按项目需要查阅其他框架。</div>
    </header>
    <section aria-labelledby="framework-list-title">
      <div class="topic-landing__section-title"><span>框架目录</span><h2 id="framework-list-title">按用途查找框架</h2></div>
      <div class="framework-catalog__grid">
        <a v-for="framework in frameworks" :key="framework.name" :href="withBase(framework.href)" class="framework-catalog__card">
          <span>{{ framework.kind }}</span>
          <strong>{{ framework.name }}</strong>
          <small>{{ framework.description }}</small>
          <em>阅读笔记 <span aria-hidden="true">→</span></em>
        </a>
      </div>
    </section>
    <div class="framework-catalog__question"><div><strong>框架怎么选？</strong><p>用技术问答对照各框架的职责、边界与适用场景。</p></div><a :href="withBase('/A-应用开发/04-应用框架/开发框架面试题')">查看框架技术问答 <span aria-hidden="true">→</span></a></div>
  </div>
</template>
