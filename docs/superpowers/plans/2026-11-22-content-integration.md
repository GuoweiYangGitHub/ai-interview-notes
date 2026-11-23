# AI 面试笔记内容整合实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 A/B/C/D 专题、两个项目 workwork、note-blog 前端资料整合成一个导航清晰、事实单源、题库可筛选的 VitePress 站点。

**Architecture:** 采用“学 / 战 / 练”三层：`01-前端基础`、`02-AI应用开发` 是知识层；`03-项目实战` 是案例层；`04-面试题库` 是生成视图层，答案仍存在专题页和项目页。旧路径通过 Vercel 301 重定向。

**Tech Stack:** VitePress、Vue 3、TypeScript、Node.js 脚本、Markdown、Vercel。

---

## 文件结构

```text
docs/
├─ 00-学习路线/            新建
├─ 01-前端基础/            新建
├─ 02-AI应用开发/          A/B/C 迁入
├─ 03-项目实战/            新建，两个 workwork 迁入
├─ 04-面试题库/            新建，核心能力改造
├─ 90-附录/                语法对照、代码示例、工具
├─ .vitepress/
│  ├─ config.mts           改 nav/sidebar/srcExclude
│  ├─ sidebar-abc.ts       重写分区
│  ├─ components/HomePage.vue
│  ├─ components/TopicLanding.vue
│  └─ core-topics.generated.mjs  生成产物
└─ public/core-topics.json 生成产物

scripts/
├─ sync-core-topics.mjs    改分组与 priority
├─ rewrite-paths.mjs       新建，一次性链接重写
├─ verify-doc-links.mjs    排除 superpowers
└─ verify-core-topics.mjs  沿用

vercel.json                加 redirects
```

---

## P1 架构迁移

### Task 1: 建目录并排除 superpowers

**Files:**
- Modify: `docs/.vitepress/config.mts`
- Modify: `scripts/sync-core-topics.mjs`
- Modify: `scripts/verify-doc-links.mjs`
- Create: `docs/00-学习路线/`、`docs/01-前端基础/`、`docs/02-AI应用开发/`、`docs/03-项目实战/`、`docs/04-面试题库/`、`docs/90-附录/`

- [ ] **Step 1: 建目录**

```bash
mkdir -p docs/00-学习路线 docs/01-前端基础 docs/02-AI应用开发 docs/03-项目实战 docs/04-面试题库 docs/90-附录
```

- [ ] **Step 2: 在 config.mts 排除设计文档**

把：

```ts
srcExclude: ['public/**', '课程练习/**', 'examples/**'],
```

改为：

```ts
srcExclude: ['public/**', '课程练习/**', 'examples/**', 'superpowers/**'],
```

- [ ] **Step 3: 在两个脚本跳过 superpowers**

`scripts/sync-core-topics.mjs` 的 `markdownFiles` 与 `scripts/verify-doc-links.mjs` 的 `files` 都改为：

```js
if (entry.name === '.vitepress' || entry.name === 'public' || entry.name === 'superpowers') continue
```

- [ ] **Step 4: 验证**

```bash
npm run docs:build
```

Expected: 构建通过；设计文档不出现在站点。

### Task 2: 迁移 A/B/C 目录

**Files:**
- Move: `docs/A-应用开发/*` → `docs/02-AI应用开发/*`
- Move: `docs/B-工程落地/01-应用服务与交付` → `docs/02-AI应用开发/06-工程与交付`
- Move: `docs/B-工程落地/06-推理部署与优化` → `docs/02-AI应用开发/07-部署与推理`
- Move: `docs/C-模型能力/07-神经网络与视觉` → `docs/02-AI应用开发/08-模型基础与选型/01-神经网络与视觉`
- Move: `docs/C-模型能力/08-HuggingFace` → `docs/02-AI应用开发/08-模型基础与选型/02-HuggingFace`
- Move: `docs/C-模型能力/09-微调与蒸馏` → `docs/02-AI应用开发/08-模型基础与选型/03-微调与蒸馏`

- [ ] **Step 1: 执行 git mv**

```bash
mkdir -p docs/02-AI应用开发/08-模型基础与选型
git mv docs/A-应用开发/01-Prompt与上下文工程 docs/02-AI应用开发/01-Prompt与上下文工程
git mv docs/A-应用开发/02-RAG与知识库 docs/02-AI应用开发/02-RAG与知识库
git mv docs/A-应用开发/03-Agent与工具调用 docs/02-AI应用开发/03-Agent与工具调用
git mv docs/A-应用开发/04-应用框架 docs/02-AI应用开发/04-应用框架
git mv docs/A-应用开发/05-平台与业务场景 docs/02-AI应用开发/05-平台与业务场景
git rm docs/A-应用开发/index.md
git mv docs/B-工程落地/01-应用服务与交付 docs/02-AI应用开发/06-工程与交付
git mv docs/B-工程落地/06-推理部署与优化 docs/02-AI应用开发/07-部署与推理
git rm docs/B-工程落地/index.md
git mv docs/C-模型能力/07-神经网络与视觉 docs/02-AI应用开发/08-模型基础与选型/01-神经网络与视觉
git mv docs/C-模型能力/08-HuggingFace docs/02-AI应用开发/08-模型基础与选型/02-HuggingFace
git mv docs/C-模型能力/09-微调与蒸馏 docs/02-AI应用开发/08-模型基础与选型/03-微调与蒸馏
git rm docs/C-模型能力/index.md
rmdir docs/A-应用开发 docs/B-工程落地 docs/C-模型能力
```

- [ ] **Step 2: 确认结果**

```bash
find docs/02-AI应用开发 -maxdepth 2 -type d | sort
```

Expected: 8 个一级子目录（01–08）。

### Task 3: 迁移附录目录

- [ ] **Step 1: 移动语法对照与代码示例**

```bash
git mv docs/语法对照 docs/90-附录/语法对照
git mv docs/E-代码示例 docs/90-附录/代码示例
```

- [ ] **Step 2: 更新 `sync-examples.mjs` 输出路径**

把生成的 `examples-sidebar.json` 路由前缀从 `/E-代码示例/` 改为 `/90-附录/代码示例/`，并同步 `docs/examples/index.md` 中的链接。

### Task 4: 重写 sidebar-abc.ts

**Files:**
- Modify: `docs/.vitepress/sidebar-abc.ts`

- [ ] **Step 1: 用新分区替换 `abcSections`**

保留文件顶部的类型与底部 `pairKey`、`normalizePath`、`itemContains`、`matchAbcSection`、`isQuizPath`，只替换 `architectureTopics` 与 `abcSections`。

新分区必须包含：

```ts
const frameworkQuiz = '/02-AI应用开发/04-应用框架/开发框架面试题'

export const abcSections: Record<string, AbcSection> = {
  '/00-学习路线/': {
    home: { text: '学习路线', link: '/00-学习路线/' },
    notes: [
      { text: '岗位能力地图', link: '/00-学习路线/' },
      { text: '学习计划', link: '/00-学习路线/学习计划' },
      { text: '考前清单', link: '/04-面试题库/重点清单' },
    ],
    quiz: [],
  },
  '/01-前端基础/': {
    home: { text: '前端基础', link: '/01-前端基础/' },
    notes: [
      { text: 'HTML', pair: 'HTML', link: '/01-前端基础/00-HTML/知识点' },
      { text: 'JavaScript', pair: 'JS', link: '/01-前端基础/01-JavaScript/知识点' },
      { text: 'TypeScript', pair: 'TS', link: '/01-前端基础/02-TypeScript/' },
      { text: 'CSS 与布局', pair: 'CSS', link: '/01-前端基础/03-CSS与布局/知识点' },
      { text: '浏览器与网络', pair: 'Browser', link: '/01-前端基础/04-浏览器与网络/网络与HTTP' },
      { text: 'Vue 与 React', pair: 'Framework', link: '/01-前端基础/05-Vue与React/Vue' },
      { text: '工程化与性能', pair: 'Engineering', link: '/01-前端基础/06-工程化与性能/性能优化' },
      { text: '手写与算法', pair: 'Handwrite', link: '/01-前端基础/07-手写与算法/算法与数据结构' },
      { text: '小程序', pair: 'WXApp', link: '/01-前端基础/08-小程序/知识点' },
      { text: '历年真题', link: '/01-前端基础/09-历年真题/' },
    ],
    quiz: [
      { text: 'HTML', pair: 'HTML', link: '/01-前端基础/00-HTML/面试题' },
      { text: 'JavaScript', pair: 'JS', link: '/01-前端基础/01-JavaScript/面试题' },
      { text: 'TypeScript', pair: 'TS', link: '/01-前端基础/02-TypeScript/面试题' },
      { text: 'CSS 与布局', pair: 'CSS', link: '/01-前端基础/03-CSS与布局/面试题' },
      { text: '浏览器与网络', pair: 'Browser', link: '/01-前端基础/04-浏览器与网络/面试题' },
      { text: 'Vue 与 React', pair: 'Framework', link: '/01-前端基础/05-Vue与React/面试题' },
      { text: '工程化与性能', pair: 'Engineering', link: '/01-前端基础/06-工程化与性能/面试题' },
      { text: '手写与算法', pair: 'Handwrite', link: '/01-前端基础/07-手写与算法/面试题' },
      { text: '小程序', pair: 'WXApp', link: '/01-前端基础/08-小程序/面试题' },
    ],
  },
  '/02-AI应用开发/': {
    home: { text: 'AI 应用开发', link: '/02-AI应用开发/' },
    notes: [
      { text: 'Prompt 与上下文', pair: 'Prompt', link: '/02-AI应用开发/01-Prompt与上下文工程/知识点' },
      { text: 'RAG 与知识库', pair: 'RAG', link: '/02-AI应用开发/02-RAG与知识库/知识点' },
      { text: 'Agent 与工具调用', pair: 'Agent', link: '/02-AI应用开发/03-Agent与工具调用/知识点' },
      {
        text: '开发框架',
        items: [
          { text: '框架总览', link: '/02-AI应用开发/04-应用框架/' },
          { text: 'LangChain', pair: 'LangChain', link: '/02-AI应用开发/04-应用框架/LangChain' },
          { text: 'LangGraph', pair: 'LangGraph', link: '/02-AI应用开发/04-应用框架/Langgraph' },
          { text: 'LangSmith', pair: 'LangSmith', link: '/02-AI应用开发/04-应用框架/LangSmith' },
          { text: 'LlamaIndex', pair: 'LlamaIndex', link: '/02-AI应用开发/04-应用框架/LlamaIndex' },
          { text: 'AutoGen', pair: 'AutoGen', link: '/02-AI应用开发/04-应用框架/AutoGen' },
          { text: 'Qwen-Agent', pair: 'Qwen-Agent', link: '/02-AI应用开发/04-应用框架/QwenAgent' },
          { text: 'OpenManus', pair: 'OpenManus', link: '/02-AI应用开发/04-应用框架/OpenManus' },
        ],
      },
      { text: '平台与业务场景', pair: 'Platform', link: '/02-AI应用开发/05-平台与业务场景/知识点' },
      { text: '工程与交付', pair: 'Delivery', link: '/02-AI应用开发/06-工程与交付/知识点' },
      { text: '部署与推理', pair: 'Inference', link: '/02-AI应用开发/07-部署与推理/部署-知识点' },
      { text: '模型基础与选型', pair: 'Model', link: '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/知识点' },
    ],
    quiz: [
      { text: 'Prompt 与上下文', pair: 'Prompt', link: '/02-AI应用开发/01-Prompt与上下文工程/面试题' },
      { text: 'RAG 与知识库', pair: 'RAG', link: '/02-AI应用开发/02-RAG与知识库/面试题' },
      { text: 'Agent 与工具调用', pair: 'Agent', link: '/02-AI应用开发/03-Agent与工具调用/面试题' },
      { text: '开发框架', pair: 'Framework', link: frameworkQuiz },
      { text: '平台与业务场景', pair: 'Platform', link: '/02-AI应用开发/05-平台与业务场景/面试题' },
      { text: '工程与交付', pair: 'Delivery', link: '/02-AI应用开发/06-工程与交付/技术问答' },
      { text: '部署与推理', pair: 'Inference', link: '/02-AI应用开发/07-部署与推理/部署-面试题' },
      { text: '模型基础与选型', pair: 'Model', link: '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/面试题' },
    ],
  },
  '/03-项目实战/': {
    home: { text: '项目实战', link: '/03-项目实战/' },
    notes: [
      { text: 'THINGJS 文档 RAG', items: [
        { text: '项目全景与架构', link: '/03-项目实战/01-THINGJS文档RAG/01-项目全景与架构' },
        { text: '索引构建与热更新', link: '/03-项目实战/01-THINGJS文档RAG/02-索引构建与热更新' },
        { text: '检索链路', link: '/03-项目实战/01-THINGJS文档RAG/03-检索链路' },
        { text: '生成与会话记忆', link: '/03-项目实战/01-THINGJS文档RAG/04-生成与会话记忆' },
        { text: 'API 契约与鉴权', link: '/03-项目实战/01-THINGJS文档RAG/05-API契约与鉴权' },
        { text: '前端与 SSE', link: '/03-项目实战/01-THINGJS文档RAG/06-前端与SSE' },
        { text: '评测与质量门禁', link: '/03-项目实战/01-THINGJS文档RAG/07-评测平台与质量门禁' },
        { text: '运维与问题闭环', link: '/03-项目实战/01-THINGJS文档RAG/08-运维观测与问题闭环' },
        { text: '关键取舍', link: '/03-项目实战/01-THINGJS文档RAG/09-关键取舍' },
        { text: '面试讲法', link: '/03-项目实战/01-THINGJS文档RAG/10-面试讲法' },
        { text: '八股项目答法', link: '/03-项目实战/01-THINGJS文档RAG/11-八股项目答法' },
        { text: '项目问答', link: '/03-项目实战/01-THINGJS文档RAG/12-项目问答' },
        { text: '源码、演示与架构图', link: '/03-项目实战/01-THINGJS文档RAG/13-源码、演示与架构图' },
      ]},
      { text: '江中智能助手', items: [
        { text: '项目全景与架构', link: '/03-项目实战/02-江中智能助手/01-项目全景与架构' },
        { text: '请求链路与 LangGraph', link: '/03-项目实战/02-江中智能助手/02-请求链路与LangGraph' },
        { text: '三条业务流程', link: '/03-项目实战/02-江中智能助手/03-三条业务流程' },
        { text: '会话、记忆与身份', link: '/03-项目实战/02-江中智能助手/04-会话、记忆与身份' },
        { text: '场景与宿主前端', link: '/03-项目实战/02-江中智能助手/05-场景与宿主前端' },
        { text: '审阅台与可观测', link: '/03-项目实战/02-江中智能助手/06-审阅台与可观测' },
        { text: '评测与质量闭环', link: '/03-项目实战/02-江中智能助手/07-评测与质量闭环' },
        { text: '运维与故障兜底', link: '/03-项目实战/02-江中智能助手/08-运维与故障兜底' },
        { text: '关键取舍', link: '/03-项目实战/02-江中智能助手/09-关键取舍' },
        { text: '数字速查与讲法', link: '/03-项目实战/02-江中智能助手/10-数字速查与讲法' },
        { text: '面试问答', link: '/03-项目实战/02-江中智能助手/11-面试问答' },
        { text: '源码与演示', link: '/03-项目实战/02-江中智能助手/12-源码与演示' },
      ]},
      { text: '跨项目对比', link: '/03-项目实战/03-跨项目对比' },
    ],
    quiz: [],
  },
  '/04-面试题库/': {
    home: { text: '面试题库', link: '/04-面试题库/' },
    notes: [
      { text: '题库总览', link: '/04-面试题库/' },
      { text: '重点清单', link: '/04-面试题库/重点清单' },
      { text: '通用情境题', link: '/04-面试题库/通用情境题' },
      { text: '八股总纲', link: '/04-面试题库/八股总纲' },
      { text: '数字与话术', link: '/04-面试题库/数字与话术' },
      { text: '语言基础', link: '/04-面试题库/语言基础' },
    ],
    quiz: [],
  },
  '/90-附录/': {
    home: { text: '附录', link: '/90-附录/' },
    notes: [
      { text: '语法对照', link: '/90-附录/语法对照/' },
      { text: '代码示例', link: '/90-附录/代码示例/' },
      { text: '环境与工具', link: '/90-附录/环境与工具/' },
      { text: '常用正则', link: '/90-附录/常用正则' },
    ],
    quiz: [],
  },
}
```

- [ ] **Step 2: 让 DocKindTabs 在没有问答项时隐藏**

修改 `docs/.vitepress/theme/DocKindTabs.vue` 的条件：

```vue
<div v-if="section && (section.notes.length || section.quiz.length)" class="doc-kind">
```

并在“技术问答”按钮上加：

```vue
<button
  v-if="section.quiz.length"
  ...
>
```

### Task 5: 更新 config.mts 导航与侧栏

- [ ] **Step 1: 替换 nav**

```ts
nav: [
  { text: '学习路线', link: '/00-学习路线/' },
  { text: '前端基础', link: '/01-前端基础/' },
  { text: 'AI 应用开发', link: '/02-AI应用开发/' },
  { text: '项目实战', link: '/03-项目实战/' },
  { text: '面试题库', link: '/04-面试题库/' },
],
```

- [ ] **Step 2: 替换 sidebar 映射**

```ts
sidebar: {
  '/00-学习路线/': [abcSections['/00-学习路线/'].home],
  '/01-前端基础/': [abcSections['/01-前端基础/'].home],
  '/02-AI应用开发/': [abcSections['/02-AI应用开发/'].home],
  '/03-项目实战/': [abcSections['/03-项目实战/'].home],
  '/04-面试题库/': [abcSections['/04-面试题库/'].home],
  '/90-附录/': [abcSections['/90-附录/'].home],
},
```

### Task 6: 新建目录首页

- [ ] **Step 1: 创建 `docs/02-AI应用开发/index.md`**

```md
---
aside: false
outline: false
title: AI 应用开发
---

<TopicLanding area="ai" />
```

- [ ] **Step 2: 在 TopicLanding.vue 增加 `ai` 区**

在 `areas` 中增加：

```ts
ai: {
  index: '02',
  title: 'AI 应用开发',
  lead: '把模型接入真实业务：组织上下文、连接知识与工具，并选择合适的应用框架。',
  hint: '建议从 Prompt 开始，再进入 RAG、Agent 和工程交付。',
  topics: [
    { title: 'Prompt 与上下文', summary: '输入、约束与输出协议。', notes: '/02-AI应用开发/01-Prompt与上下文工程/知识点', quiz: '/02-AI应用开发/01-Prompt与上下文工程/面试题' },
    { title: 'RAG 与知识库', summary: '检索、重排与可信回答。', notes: '/02-AI应用开发/02-RAG与知识库/知识点', quiz: '/02-AI应用开发/02-RAG与知识库/面试题' },
    { title: 'Agent 与工具调用', summary: '工具边界、任务流程与执行反馈。', notes: '/02-AI应用开发/03-Agent与工具调用/知识点', quiz: '/02-AI应用开发/03-Agent与工具调用/面试题' },
    { title: '应用框架', summary: 'LangChain、LangGraph 等选型。', notes: '/02-AI应用开发/04-应用框架/', quiz: '/02-AI应用开发/04-应用框架/开发框架面试题' },
    { title: '平台与业务场景', summary: '平台能力与业务需求判断。', notes: '/02-AI应用开发/05-平台与业务场景/知识点', quiz: '/02-AI应用开发/05-平台与业务场景/面试题' },
    { title: '工程与交付', summary: '服务、流式、评测与可观测。', notes: '/02-AI应用开发/06-工程与交付/知识点', quiz: '/02-AI应用开发/06-工程与交付/技术问答' },
    { title: '部署与推理', summary: '部署方式与推理性能。', notes: '/02-AI应用开发/07-部署与推理/部署-知识点', quiz: '/02-AI应用开发/07-部署与推理/部署-面试题' },
    { title: '模型基础与选型', summary: '模型生态、微调与蒸馏。', notes: '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/知识点', quiz: '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/面试题' },
  ],
  extra: {
    title: '框架索引',
    links: [
      { title: 'LangChain', href: '/02-AI应用开发/04-应用框架/LangChain' },
      { title: 'LangGraph', href: '/02-AI应用开发/04-应用框架/Langgraph' },
      { title: 'LlamaIndex', href: '/02-AI应用开发/04-应用框架/LlamaIndex' },
      { title: 'AutoGen', href: '/02-AI应用开发/04-应用框架/AutoGen' },
      { title: 'Qwen-Agent', href: '/02-AI应用开发/04-应用框架/QwenAgent' },
      { title: 'OpenManus', href: '/02-AI应用开发/04-应用框架/OpenManus' },
    ],
  },
},
```

并把 props 类型改为 `'app' | 'ai' | 'engineering' | 'model' | 'architecture'`（旧值可暂留）。

- [ ] **Step 3: 创建其余首页**

`docs/00-学习路线/index.md`：岗位能力地图，列出“前端基础 / AI 应用 / 工程交付 / 项目实战”四块与入口链接。

`docs/01-前端基础/index.md`：列出 HTML、JS、TS、CSS、浏览器、Vue/React、工程化、手写、小程序、真题，链接指向 P3 将创建的页面。

`docs/03-项目实战/index.md`：两张项目卡片 + 跨项目对比链接。

`docs/04-面试题库/index.md`：`<CoreCapabilityCatalog />`。

`docs/90-附录/index.md`：语法对照、代码示例、环境与工具、常用正则。

### Task 7: 更新 HomePage.vue

- [ ] **Step 1: 替换 sections 为四张主卡**

```ts
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
      { label: '手写与算法', href: '/01-前端基础/07-手写与算法/算法与数据结构' },
    ],
  },
  {
    number: '02',
    title: 'AI 应用开发',
    summary: '从 Prompt 到 Agent，再到工程交付。',
    href: '/02-AI应用开发/',
    topics: [
      { label: 'Prompt 与上下文', href: '/02-AI应用开发/01-Prompt与上下文工程/知识点' },
      { label: 'RAG 与知识库', href: '/02-AI应用开发/02-RAG与知识库/知识点' },
      { label: 'Agent 与工具', href: '/02-AI应用开发/03-Agent与工具调用/知识点' },
      { label: '工程与交付', href: '/02-AI应用开发/06-工程与交付/知识点' },
    ],
  },
  {
    number: '03',
    title: '项目实战',
    summary: '两个可讲深的工程案例。',
    href: '/03-项目实战/',
    topics: [
      { label: 'THINGJS 文档 RAG', href: '/03-项目实战/01-THINGJS文档RAG/01-项目全景与架构' },
      { label: '江中智能助手', href: '/03-项目实战/02-江中智能助手/01-项目全景与架构' },
      { label: '跨项目对比', href: '/03-项目实战/03-跨项目对比' },
    ],
  },
  {
    number: '04',
    title: '面试题库',
    summary: '按模块、优先级和项目刷题。',
    href: '/04-面试题库/',
    topics: [
      { label: '重点清单', href: '/04-面试题库/重点清单' },
      { label: '通用情境题', href: '/04-面试题库/通用情境题' },
      { label: '八股总纲', href: '/04-面试题库/八股总纲' },
      { label: '数字与话术', href: '/04-面试题库/数字与话术' },
    ],
  },
]
```

同步修改 `featured` 与 hero 文案。

### Task 8: 重写生成器分组

**Files:**
- Modify: `scripts/sync-core-topics.mjs`

- [ ] **Step 1: 替换 groups**

```js
const groups = [
  { id: 'frontend', title: '前端基础', description: 'JS、TS、CSS、浏览器、框架、工程化与手写题。', defaultOpen: true, paths: ['01-前端基础'] },
  { id: 'prompt', title: 'Prompt 与上下文', description: '输入、约束、上下文与输出协议。', defaultOpen: true, paths: ['02-AI应用开发/01-Prompt与上下文工程'] },
  { id: 'rag', title: 'RAG 与知识工程', description: '切片、Embedding、混合检索、精排、评测、权限与更新。', defaultOpen: true, paths: ['02-AI应用开发/02-RAG与知识库'] },
  { id: 'agent', title: 'Agent、工具与 MCP', description: '工具调用、控制流、上下文、沙箱、可靠性与安全。', defaultOpen: true, paths: ['02-AI应用开发/03-Agent与工具调用'] },
  { id: 'framework', title: '框架与平台', description: 'LangChain、LangGraph、LlamaIndex、Coze/Dify。', defaultOpen: true, paths: ['02-AI应用开发/04-应用框架', '02-AI应用开发/05-平台与业务场景'] },
  { id: 'delivery', title: '工程与交付', description: '流式、异步、多租户、评测、Tracing、成本、安全、发布。', defaultOpen: true, paths: ['02-AI应用开发/06-工程与交付'] },
  { id: 'inference', title: '部署与推理', description: '推理框架、KV Cache、批处理、TTFT、PD 分离。', defaultOpen: false, paths: ['02-AI应用开发/07-部署与推理'] },
  { id: 'model', title: '模型基础与选型', description: '神经网络、Hugging Face、微调、蒸馏、视觉。', defaultOpen: false, paths: ['02-AI应用开发/08-模型基础与选型'] },
  { id: 'project-thingjs', title: 'THINGJS 项目', description: '索引、检索、生成、前端、评测与运维。', defaultOpen: true, paths: ['03-项目实战/01-THINGJS文档RAG'] },
  { id: 'project-jiangzhong', title: '江中项目', description: 'LangGraph、业务流程、会话记忆、场景宿主与评测。', defaultOpen: true, paths: ['03-项目实战/02-江中智能助手'] },
  { id: 'cross', title: '跨项目', description: '两个项目的对比与共同追问。', defaultOpen: false, paths: ['03-项目实战/03-跨项目对比'] },
]
```

- [ ] **Step 2: 更新 moduleNames**

```js
const moduleNames = [
  ['01-前端基础', '前端基础'],
  ['02-AI应用开发/01-Prompt与上下文工程', 'Prompt 与上下文'],
  ['02-AI应用开发/02-RAG与知识库', 'RAG 与知识工程'],
  ['02-AI应用开发/03-Agent与工具调用', 'Agent 与工具调用'],
  ['02-AI应用开发/04-应用框架', '应用框架'],
  ['02-AI应用开发/05-平台与业务场景', '平台与业务场景'],
  ['02-AI应用开发/06-工程与交付', '工程与交付'],
  ['02-AI应用开发/07-部署与推理', '部署与推理'],
  ['02-AI应用开发/08-模型基础与选型', '模型基础与选型'],
  ['03-项目实战/01-THINGJS文档RAG', 'THINGJS 项目'],
  ['03-项目实战/02-江中智能助手', '江中项目'],
  ['03-项目实战/03-跨项目对比', '跨项目'],
]
```

- [ ] **Step 3: 加 priority 字段**

在 `records.push` 前：

```js
const priority = /\[重点\]|必练/.test(match[2]) ? 'p0' : 'p1'
```

并在 record 中加入 `priority`。

- [ ] **Step 4: 让 kindFor 识别项目**

```js
function kindFor(path) {
  if (path.startsWith('03-项目实战/')) return 'project'
  if (/(面试题|技术问答)\.md$/.test(path)) return 'qa'
  return 'knowledge'
}
```

### Task 9: 一次性重写站内链接

**Files:**
- Create: `scripts/rewrite-paths.mjs`

- [ ] **Step 1: 写脚本**

```js
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(rootDir, 'docs')
const replacements = [
  ['/B-工程落地/01-应用服务与交付/', '/02-AI应用开发/06-工程与交付/'],
  ['/B-工程落地/06-推理部署与优化/', '/02-AI应用开发/07-部署与推理/'],
  ['/C-模型能力/07-神经网络与视觉/', '/02-AI应用开发/08-模型基础与选型/01-神经网络与视觉/'],
  ['/C-模型能力/08-HuggingFace/', '/02-AI应用开发/08-模型基础与选型/02-HuggingFace/'],
  ['/C-模型能力/09-微调与蒸馏/', '/02-AI应用开发/08-模型基础与选型/03-微调与蒸馏/'],
  ['/A-应用开发/', '/02-AI应用开发/'],
  ['/B-工程落地/', '/02-AI应用开发/'],
  ['/C-模型能力/', '/02-AI应用开发/08-模型基础与选型/'],
  ['/语法对照/', '/90-附录/语法对照/'],
  ['/E-代码示例/', '/90-附录/代码示例/'],
]

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.vitepress', 'public', 'superpowers'].includes(entry.name)) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await walk(path))
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(path)
  }
  return out
}

for (const file of await walk(docsDir)) {
  let source = await readFile(file, 'utf8')
  for (const [from, to] of replacements) source = source.split(from).join(to)
  await writeFile(file, source, 'utf8')
  console.log(relative(docsDir, file).replaceAll('\\', '/'))
}
```

- [ ] **Step 2: 运行**

```bash
node scripts/rewrite-paths.mjs
npm run docs:build
```

Expected: 构建通过；若内链校验报错，逐条修正残留相对链接。

### Task 10: 加 301 重定向

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: 添加 redirects**

```json
"redirects": [
  { "source": "/A-应用开发/:path*", "destination": "/02-AI应用开发/:path*", "permanent": true },
  { "source": "/B-工程落地/01-应用服务与交付/:path*", "destination": "/02-AI应用开发/06-工程与交付/:path*", "permanent": true },
  { "source": "/B-工程落地/06-推理部署与优化/:path*", "destination": "/02-AI应用开发/07-部署与推理/:path*", "permanent": true },
  { "source": "/B-工程落地/:path*", "destination": "/02-AI应用开发/", "permanent": true },
  { "source": "/C-模型能力/07-神经网络与视觉/:path*", "destination": "/02-AI应用开发/08-模型基础与选型/01-神经网络与视觉/:path*", "permanent": true },
  { "source": "/C-模型能力/08-HuggingFace/:path*", "destination": "/02-AI应用开发/08-模型基础与选型/02-HuggingFace/:path*", "permanent": true },
  { "source": "/C-模型能力/09-微调与蒸馏/:path*", "destination": "/02-AI应用开发/08-模型基础与选型/03-微调与蒸馏/:path*", "permanent": true },
  { "source": "/C-模型能力/:path*", "destination": "/02-AI应用开发/", "permanent": true },
  { "source": "/D-AI架构/:path*", "destination": "/04-面试题库/", "permanent": true },
  { "source": "/核心能力/:path*", "destination": "/04-面试题库/重点清单", "permanent": true },
  { "source": "/语法对照/:path*", "destination": "/90-附录/语法对照/:path*", "permanent": true },
  { "source": "/E-代码示例/:path*", "destination": "/90-附录/代码示例/:path*", "permanent": true }
]
```

- [ ] **Step 2: 校验 JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('ok')"
```

### Task 11: P1 验收

- [ ] **Step 1: 构建**

```bash
npm run docs:build
```

Expected: `Markdown 内链校验通过`、`核心能力目录校验通过`、VitePress build complete。

- [ ] **Step 2: 检查旧路径残留**

```bash
grep -rn "A-应用开发\|B-工程落地\|C-模型能力\|E-代码示例" docs --include=*.md | head -20
```

Expected: 只剩重定向表、迁移说明或有意保留的旧链接。

---

## P2 项目实战

### Task 12: 迁入 ThingJS 项目资料

**Files:**
- Create: `docs/03-项目实战/01-THINGJS文档RAG/*.md`
- Source: `F:/AI-application-project/z-thingjs-docs-agent-js-langchain/workwork/project/*.md`

- [ ] **Step 1: 复制原文到临时目录**

```bash
mkdir -p docs/03-项目实战/01-THINGJS文档RAG
cp "/f/AI-application-project/z-thingjs-docs-agent-js-langchain/workwork/project/01-项目全景.md" docs/03-项目实战/01-THINGJS文档RAG/_src-01.md
# 02–12 同理
```

- [ ] **Step 2: 按设计文档 4.2 的表格合并**

每页统一结构：

```md
# THINGJS 文档 RAG · 页面名

> 一句话定位。

## 1. 做了什么
## 2. 为什么这样做
## 3. 关键数字与证据
## 4. 高频追问
```

合并规则：
- `01` + `02` → `01-项目全景与架构.md`
- `03` + `10` → `02-索引构建与热更新.md`
- `04` → `03-检索链路.md`
- `05` → `04-生成与会话记忆.md`
- `06` → `05-API契约与鉴权.md`
- `07` → `06-前端与SSE.md`
- `08` → `07-评测平台与质量门禁.md`
- `09` → `08-运维观测与问题闭环.md`

- [ ] **Step 3: 删除 `_src-*.md`**

```bash
rm docs/03-项目实战/01-THINGJS文档RAG/_src-*.md
```

### Task 13: 合并 ThingJS 面试文档

- [ ] **Step 1: 生成四页**

- `09-关键取舍.md` ← `interview/10`
- `10-面试讲法.md` ← `interview/11` + `interview/13`
- `11-八股项目答法.md` ← `interview/15` + `interview/16`
- `12-项目问答.md` ← D 的 R01–R18

规则：
- “60 秒 / 3 分钟 / 10 分钟讲法”只保留一份。
- “数字速查”只在 `10-面试讲法` 保留一张总表，其他页引用。
- 同一题在 10/13/16 出现时，保留 16 的项目话术 + 13 的分层必答点，合并成一题。

### Task 14: 迁入江中项目资料

- [ ] **Step 1: 按设计文档 4.2 的表格合并 12 页**

来源：`F:/AI-application-project/z-jiangzhong-agent-langgraph/workwork/project/` 与 `interview/`。

每页统一结构同上。重点：
- `02-请求链路与LangGraph.md` 必须包含 `classify → route → act`、只读计划执行器、固定子图。
- `05-场景与宿主前端.md` 必须包含宿主方法上报、`fetch` 注入、SSE、审批卡。
- `11-面试问答.md` 合并 `interview/03` 的 Q1–Q20 与 D 的 J01–J21；同题只留一版。

### Task 15: 拆分 D 的剩余题目

- [ ] **Step 1: 把 D 的题目分配到目标页**

| D 题 | 去向 |
| --- | --- |
| J01–J21 | `03-项目实战/02-江中智能助手/11-面试问答.md` |
| R01–R18 | `03-项目实战/01-THINGJS文档RAG/12-项目问答.md` |
| C01–C03 | `03-项目实战/03-跨项目对比.md` |
| A01–A20 | `04-面试题库/通用情境题.md` |
| PY01–PY08、PB01–PB06 | `04-面试题库/语言基础.md` |
| N01–N12 | `02-AI应用开发/06-工程与交付/Node与SSE.md` |

- [ ] **Step 2: 删除 D 目录**

```bash
git rm -r docs/D-AI架构
```

- [ ] **Step 3: 从生成器删除 D 分组**

删除 `groups` 中的 `interview-priority`，并确认 `groupFor` 不再抛错。

### Task 16: 收架构图与演示

- [ ] **Step 1: 复制静态资源**

```bash
mkdir -p docs/public/assets/thingjs docs/public/assets/jiangzhong
cp "/f/AI-application-project/z-thingjs-docs-agent-js-langchain/workwork/diagrams/thingjs-rag-2026-11-20.html" docs/public/assets/thingjs/architecture.html
cp "/f/AI-application-project/z-thingjs-docs-agent-js-langchain/workwork/diagrams/preview-2026-11-20.png" docs/public/assets/thingjs/preview.png
```

江中的 Mermaid 图保留在 `02-系统架构` 页内，不单独复制。

- [ ] **Step 2: 在项目页链接资源**

在 `13-源码、演示与架构图.md` 加：

```md
- [架构图（HTML）](/assets/thingjs/architecture.html)
- [架构图预览](/assets/thingjs/preview.png)
```

### Task 17: P2 验收

```bash
npm run docs:build
grep -rn "D-AI架构" docs --include=*.md | head
```

Expected: 构建通过；除重定向和迁移说明外无 D 引用。

---

## P3 前端基础

### Task 18: 建前端目录

```bash
mkdir -p docs/01-前端基础/{00-HTML,01-JavaScript,02-TypeScript,03-CSS与布局,04-浏览器与网络,05-Vue与React,06-工程化与性能,07-手写与算法,08-小程序,09-历年真题}
```

### Task 19: 迁入 JavaScript 与 HTML

- [ ] **Step 1: 复制并合并**

来源：

```text
note-blog/docs/notes/js/common.md
note-blog/docs/notes/js/knowledge.md
note-blog/docs/notes/js/nativeContructor.md
note-blog/docs/notes/js/setmap.md
note-blog/docs/notes/js/Symbol.md
note-blog/docs/notes/js/designMode/pattern.md
note-blog/docs/notes/js/designMode/model.md
note-blog/docs/questions/fontEndBasic/JS.md
note-blog/docs/notes/README.md
```

目标：
- `01-JavaScript/知识点.md`：合并前 5 个 note 文件。
- `01-JavaScript/设计模式.md`：合并 pattern + model。
- `01-JavaScript/面试题.md`：JS.md + `notes/README.md` 中独有的面试题。
- `00-HTML/知识点.md` ← `questions/fontEndBasic/HTML.md`。
- `00-HTML/面试题.md`：从 HTML.md 中拆出问答，如果没有则留空目录页。

去重规则：
- 同一标题只保留一份，保留答案更长的版本。
- `notes/README.md` 与 `knowledge.md` 重复的“闭包、深拷贝、原型链”等题，移动到 `面试题.md` 并删除 README 中的副本。

### Task 20: 迁入 TypeScript

- [ ] **Step 1: 复制 7 篇**

```bash
cp note-blog/docs/tsNotes/Normal.md docs/01-前端基础/02-TypeScript/01-基础.md
cp note-blog/docs/tsNotes/ObjectType.md docs/01-前端基础/02-TypeScript/02-对象类型.md
cp note-blog/docs/tsNotes/Generics.md docs/01-前端基础/02-TypeScript/03-泛型.md
cp note-blog/docs/tsNotes/ConditionalTypes.md docs/01-前端基础/02-TypeScript/04-条件类型.md
cp note-blog/docs/tsNotes/Keyof.md docs/01-前端基础/02-TypeScript/05-keyof.md
cp note-blog/docs/tsNotes/Typeof.md docs/01-前端基础/02-TypeScript/06-typeof.md
cp note-blog/docs/tsNotes/IndexAccess.md docs/01-前端基础/02-TypeScript/07-索引访问.md
```

- [ ] **Step 2: 用 `tsNotes/README.md` 去重后生成 `index.md`**

删除与 01–07 重复的正文，只保留目录和链接。

- [ ] **Step 3: 生成 `面试题.md`**

以 `questions/typescript/TypeScript.md` 为底，补充 TS 八股：泛型、条件类型、`keyof`/`typeof`、类型收窄、工具类型、`unknown` vs `any`。

### Task 21: 迁入 CSS、浏览器与网络

- [ ] **Step 1: CSS**

- `03-CSS与布局/知识点.md` ← commonUsed + layout。
- `03-CSS与布局/兼容与跨端.md` ← compatibility + Compatible + CrossTerminal。
- `03-CSS与布局/面试题.md` ← `questions/fontEndBasic/CSS.md`。

- [ ] **Step 2: 浏览器与网络**

- `04-浏览器与网络/网络与HTTP.md` ← ComputerNetWork。
- `04-浏览器与网络/前端安全.md` ← SecurityNote。
- `04-浏览器与网络/面试题.md`：从两篇中拆出问答，或建立目录页链接到两篇。

### Task 22: 迁入 Vue 与 React

- [ ] **Step 1: Vue**

- `05-Vue与React/Vue.md` ← `notes/vue/vue.md`。
- `05-Vue与React/Vue常见问题.md` ← `notes/vue/vue-problem.md` + `questions/fontEndBasic/Vue.md` 的去重后独有内容。
- `05-Vue与React/Vue面试题.md` ← `questions/fontEndBasic/Vue.md` 的问答部分。

- [ ] **Step 2: React**

- `05-Vue与React/React.md` ← `notes/react/react.md`。
- `05-Vue与React/React面试题.md` ← `questions/fontEndBasic/React.md`。
- `05-Vue与React/面试题.md`：作为目录页，链接 Vue/React 两个题库。

### Task 23: 迁入工程化、性能与测试

- [ ] **Step 1: 复制**

```bash
cp note-blog/docs/questions/fontEndBasic/Webpack.md docs/01-前端基础/06-工程化与性能/构建工具.md
cp note-blog/docs/questions/fontEndBasic/PerformanceOptimization.md docs/01-前端基础/06-工程化与性能/性能优化.md
cp note-blog/docs/questions/autoTesting/AutoTesting.md docs/01-前端基础/06-工程化与性能/自动化测试.md
```

- [ ] **Step 2: 建 `面试题.md`**

把三篇中的问答合并，去掉重复的“性能优化手段”列表。

### Task 24: 迁入手写与算法

- [ ] **Step 1: 合并**

- `07-手写与算法/手写题精选.md` ← DeepClone + Promise + ArrayObject + Axios + `还在死记手写面试题吗.md`。
- `07-手写与算法/输出题.md` ← GetOutputResults。
- `07-手写与算法/算法与数据结构.md` ← Algorithm + Concept。
- `07-手写与算法/排序.md` ← Sort。
- `07-手写与算法/面试题.md` ← Written 中的问答部分。

去重规则：同一手写题只保留一种实现；`DeepClone` 与 `ArrayObject` 中重复的数组方法删除。

### Task 25: 迁入小程序

- [ ] **Step 1: 复制 5 篇笔记 + 1 篇题库**

```bash
cp note-blog/docs/notes/wxapp/basics.md docs/01-前端基础/08-小程序/基础知识.md
cp note-blog/docs/notes/wxapp/scene.md docs/01-前端基础/08-小程序/常见问题.md
cp note-blog/docs/notes/wxapp/scan.md docs/01-前端基础/08-小程序/扫码.md
cp note-blog/docs/notes/wxapp/compatibility.md docs/01-前端基础/08-小程序/兼容性.md
cp note-blog/docs/notes/wxapp/taroUsed.md docs/01-前端基础/08-小程序/Taro.md
cp note-blog/docs/questions/fontEndBasic/WXApp.md docs/01-前端基础/08-小程序/面试题.md
```

### Task 26: 历年真题去重归档

- [ ] **Step 1: 复制 6 篇**

```bash
cp note-blog/docs/questions/questionHistory/2019.06.md docs/01-前端基础/09-历年真题/2019.06.md
# 2020.11 / 2020.12 / 2021.01 / 2021.04 / 2022.10 同理
```

- [ ] **Step 2: 去重**

对每篇：
- 与 `01-JavaScript/面试题.md`、`03-CSS与布局/面试题.md`、`05-Vue与React/面试题.md` 比对标题。
- 重复题目删除正文，保留一行 `> 已在「对应专题」收录，见链接。`
- 每篇顶部加 `> 历史真题，仅作查漏补缺。`

### Task 27: 迁入附录

- [ ] **Step 1: 工具与服务器**

```bash
mkdir -p docs/90-附录/环境与工具
cp note-blog/docs/notes/git/*.md docs/90-附录/环境与工具/
cp note-blog/docs/notes/others/npm.md docs/90-附录/环境与工具/npm.md
cp note-blog/docs/notes/others/nvm.md docs/90-附录/环境与工具/nvm.md
cp note-blog/docs/notes/others/contentType.md docs/90-附录/环境与工具/表单提交类型.md
cp note-blog/docs/mac/README.md docs/90-附录/环境与工具/macOS-README.md
cp note-blog/docs/mac/command.md docs/90-附录/环境与工具/macOS-命令.md
cp note-blog/docs/service/nginx.md docs/90-附录/环境与工具/Nginx.md
cp note-blog/docs/service/own.md docs/90-附录/环境与工具/服务器配置.md
cp note-blog/docs/regexp/regexp.md docs/90-附录/常用正则.md
```

- [ ] **Step 2: 合并 macOS 两篇并删除临时 README**

### Task 28: 下载外链图片

- [ ] **Step 1: 找出 31 张图**

```bash
grep -rhoE "!\[[^]]*\]\([^)]+\)" docs/01-前端基础 docs/90-附录 --include=*.md | sed -E 's/.*\(([^)]+)\).*/\1/' | sort -u
```

- [ ] **Step 2: 下载到 `docs/public/assets/frontend/`**

逐张用 `curl -L -o` 保存，文件名用内容主题命名，替换 Markdown 链接为 `/assets/frontend/<name>`。

- [ ] **Step 3: 校验**

```bash
grep -rn "clouds.guowei.link\|img-blog.csdnimg.cn" docs/01-前端基础 docs/90-附录 --include=*.md
```

Expected: 无输出。

### Task 29: P3 验收

```bash
npm run docs:build
node -e "console.log('frontend pages:', require('fs').readdirSync('docs/01-前端基础').length)"
```

Expected: 构建通过；前端目录 10 个子目录；无外链图片残留。

---

## P4 题库统一

### Task 30: 补全题库页面

- [ ] **Step 1: `04-面试题库/index.md`**

沿用 `<CoreCapabilityCatalog />`，标题改为“面试题库”，说明改为“按模块、优先级和项目筛选”。

- [ ] **Step 2: `重点清单.md`**

用 `<CoreCapabilityCatalog />`，并在组件加 `priority-only` 模式：只显示 `priority === 'p0'`。

- [ ] **Step 3: `通用情境题.md`**

把 D 的 A01–A20 按“模型接入 / Agent / RAG / 评测”分组，保留原题号。

- [ ] **Step 4: `八股总纲.md`**

以 ThingJS `interview/14` 为底，按模块保留星级；删除与 A/B/C 面试题重复的长答案，改为“详见链接”。

- [ ] **Step 5: `数字与话术.md`**

两个项目各一张数字表 + 60 秒 / 3 分钟讲法。数字标注日期与来源。

- [ ] **Step 6: `语言基础.md`**

D 的 PY01–PY08、PB01–PB06，按 Python 基础 / FastAPI / 异步 / 容器分组。

### Task 31: 更新组件支持 priority

**Files:**
- Modify: `docs/.vitepress/components/CoreCapabilityCatalog.vue`

- [ ] **Step 1: 加 props**

```js
const props = defineProps({ priorityOnly: { type: Boolean, default: false } })
```

- [ ] **Step 2: 过滤**

在 `visibleGroups` 的 topic filter 中加：

```js
const matchesPriority = !props.priorityOnly || topic.priority === 'p0'
```

并加入返回条件。

### Task 32: P4 验收

```bash
npm run docs:build
node -e "const m=require('./docs/public/core-topics.json'); console.log(m.total, m.groups.map(g=>g.id+':'+g.topics.length).join(' '))"
```

Expected: 有 frontend / rag / agent / framework / project-thingjs / project-jiangzhong 等分组且数量非零。

---

## P5 验收与收尾

### Task 33: 全站检查

- [ ] **Step 1: 构建**

```bash
npm run docs:build
```

- [ ] **Step 2: 旧路径检查**

```bash
grep -rn "D-AI架构\|A-应用开发\|B-工程落地\|C-模型能力" docs --include=*.md
```

Expected: 只出现在迁移说明或有意保留的文本中。

- [ ] **Step 3: 外链图片检查**

```bash
grep -rn "clouds.guowei.link\|img-blog.csdnimg.cn" docs --include=*.md
```

Expected: 无输出。

- [ ] **Step 4: 死链检查**

`npm run docs:build` 已包含 `verify-doc-links`；如失败，按输出逐条修正。

### Task 34: 更新说明与冻结 note-blog

- [ ] **Step 1: 更新根 `README.md`**

写清新结构、五条导航、开发命令、内容来源。

- [ ] **Step 2: 在 note-blog 仓库根加归档说明**

```md
# 已归档

前端笔记已迁入 `ai-interview-notes` 的 `docs/01-前端基础/`。
本仓库只作历史备份，不再更新。
```

- [ ] **Step 3: 不提交 note-blog 变更**

归档说明由用户决定是否提交；本计划只创建本地文件。

### Task 35: 最终报告

输出：
- 新增/迁移页面数。
- 删除的重复内容清单。
- 构建与校验结果。
- 旧 URL 重定向表。
- 仍需人工确认的内容（如公司名、简历、旧真题取舍）。

---

## 自检

- [ ] 设计文档 4.1–4.4 的每条映射都有对应任务。
- [ ] P1–P5 每阶段都有可执行的构建验收命令。
- [ ] 生成器分组与新目录一致。
- [ ] 301 重定向覆盖所有旧顶级目录。
- [ ] 没有 TBD/TODO/“稍后处理”占位。
