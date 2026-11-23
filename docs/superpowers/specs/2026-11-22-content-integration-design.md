# AI 面试笔记内容整合设计

- 日期：2026-11-22
- 状态：已确认，进入实施
- 目标岗位：AI 应用开发（偏前端）
- 目标站点：`ai-interview-notes` 独立 VitePress 站

## 1. 背景与目标

当前有四份资料：

1. `ai-interview-notes`：A/B/C 专题、D 架构 88 题、核心能力、语法对照、代码示例。
2. `z-thingjs-docs-agent-js-langchain/workwork`：ThingJS 文档 RAG 项目资料与面试题。
3. `z-jiangzhong-agent-langgraph/workwork`：江中智能助手项目资料与面试题。
4. `note-blog`：VuePress 1 前端笔记与面试题，73 篇、约 17,500 行。

问题不是资料不足，而是同一件事有多个入口和多个版本：

- A/B/C 专题题、D 综合题、两个 workwork 的面试文档、note-blog 题库各自成体系。
- 项目事实与项目问答分散在站内和站外。
- 目标岗位偏前端，但当前站点没有前端内容。
- 顶部导航 8 项，“核心能力”与专题目录重复。
- note-blog 工具链过时，旧真题与旧版本说明混杂。

目标：**一个站点、一套导航、一份事实来源、一个可筛选题库**。

## 2. 已确认决策

| 决策 | 结论 |
| --- | --- |
| 站点公开范围 | 站点公开，不专门面向面试官；他人可浏览 |
| 前端内容迁入 | `note-blog` 全部前端内容迁入；重复内容去重 |
| note-blog 归宿 | 迁完后冻结为归档仓库，只在本站维护 |
| 旧链接 | 保留 301 重定向，旧链接不失效 |
| 简历 | 不发布，保留在本地或私有目录 |
| 项目公司名 | 保留现有写法；站点公开不影响 |

## 3. 目标信息架构

```text
首页
├─ 00-学习路线/
│  ├─ index.md                 岗位能力地图（前端 × AI）
│  ├─ 学习计划.md              30 分钟 / 1 天 / 1 周三条路径
│  └─ 考前清单.md              P0 题单
├─ 01-前端基础/                ← note-blog 全量迁入、去重
│  ├─ index.md
│  ├─ 00-HTML/
│  ├─ 01-JavaScript/
│  ├─ 02-TypeScript/
│  ├─ 03-CSS与布局/
│  ├─ 04-浏览器与网络/
│  ├─ 05-Vue与React/
│  ├─ 06-工程化与性能/
│  ├─ 07-手写与算法/
│  ├─ 08-小程序/
│  └─ 09-历年真题/             ← 旧真题去重后归档
├─ 02-AI应用开发/              ← 现有 A + B + C 合并
│  ├─ index.md
│  ├─ 01-Prompt与上下文工程/
│  ├─ 02-RAG与知识库/
│  ├─ 03-Agent与工具调用/
│  ├─ 04-应用框架/
│  ├─ 05-平台与业务场景/
│  ├─ 06-工程与交付/           ← B/01 + D 的 Node/SSE 题
│  ├─ 07-部署与推理/           ← B/06
│  └─ 08-模型基础与选型/       ← C
├─ 03-项目实战/
│  ├─ index.md
│  ├─ 01-THINGJS文档RAG/
│  ├─ 02-江中智能助手/
│  └─ 03-跨项目对比.md
├─ 04-面试题库/
│  ├─ index.md                 生成式题库：筛选、搜索、进度
│  ├─ 重点清单.md              P0 / 必练
│  ├─ 通用情境题.md            D 的 A01–A20
│  ├─ 八股总纲.md              ThingJS 14 提炼
│  ├─ 数字与话术.md            两项目数字口径与讲法
│  └─ 语言基础.md              D 的 PY/PB 题
└─ 90-附录/
   ├─ 语法对照/
   ├─ 环境与工具/              Git、npm、nvm、mac、Nginx
   ├─ 常用正则.md
   └─ 代码示例/                ← 原 E-代码示例
```

顶部导航压到 5–6 项：

```text
前端基础 / AI 应用开发 / 项目实战 / 面试题库 / 学习路线
```

“核心能力”不再单独占栏目，改造成 `04-面试题库/重点清单`。

## 4. 内容来源映射

### 4.1 AI 应用开发

| 原路径 | 新路径 | 处理 |
| --- | --- | --- |
| `A-应用开发/01-Prompt与上下文工程` | `02-AI应用开发/01-Prompt与上下文工程` | 原样迁移 |
| `A-应用开发/02-RAG与知识库` | `02-AI应用开发/02-RAG与知识库` | 原样迁移 |
| `A-应用开发/03-Agent与工具调用` | `02-AI应用开发/03-Agent与工具调用` | 原样迁移 |
| `A-应用开发/04-应用框架` | `02-AI应用开发/04-应用框架` | 原样迁移 |
| `A-应用开发/05-平台与业务场景` | `02-AI应用开发/05-平台与业务场景` | 原样迁移 |
| `B-工程落地/01-应用服务与交付` | `02-AI应用开发/06-工程与交付` | 迁移；并入 D 的 N01–N12 |
| `B-工程落地/06-推理部署与优化` | `02-AI应用开发/07-部署与推理` | 原样迁移 |
| `C-模型能力/07-神经网络与视觉` | `02-AI应用开发/08-模型基础与选型/01-神经网络与视觉` | 迁移 |
| `C-模型能力/08-HuggingFace` | `02-AI应用开发/08-模型基础与选型/02-HuggingFace` | 迁移 |
| `C-模型能力/09-微调与蒸馏` | `02-AI应用开发/08-模型基础与选型/03-微调与蒸馏` | 迁移 |

### 4.2 项目实战

#### ThingJS 文档 RAG

| 目标文件 | 来源 | 合并说明 |
| --- | --- | --- |
| `01-项目全景与架构.md` | `project/01` + `project/02` | 合并为“定位 + 架构 + 数据流” |
| `02-索引构建与热更新.md` | `project/03` + `project/10` | 切片规则并入索引页 |
| `03-检索链路.md` | `project/04` | 原文 |
| `04-生成与会话记忆.md` | `project/05` | 原文 |
| `05-API契约与鉴权.md` | `project/06` | 原文 |
| `06-前端与SSE.md` | `project/07` | 原文，突出前端视角 |
| `07-评测平台与质量门禁.md` | `project/08` | 原文 |
| `08-运维观测与问题闭环.md` | `project/09` | 原文 |
| `09-关键取舍.md` | `interview/10` | 保留 16 条取舍 |
| `10-面试讲法.md` | `interview/11` + `interview/13` | 合并讲法与分层速查 |
| `11-八股项目答法.md` | `interview/15` + `interview/16` | 合并定位与逐题话术 |
| `12-项目问答.md` | D 的 R01–R18 | 保留 18 个高频追问 |
| `13-源码、演示与架构图.md` | `project/12` + `demo/` + `diagrams/` | 源码导览、录屏、架构图入口 |

`interview/14`（通用八股）提炼进 `04-面试题库/八股总纲.md`。
`resume/` 不发布。

#### 江中智能助手

| 目标文件 | 来源 | 合并说明 |
| --- | --- | --- |
| `01-项目全景与架构.md` | `project/01` + `project/02` | 合并 |
| `02-请求链路与LangGraph.md` | `project/03` + `project/13` | 加入 LangGraph 适用边界 |
| `03-三条业务流程.md` | `project/04` + `11` + `12` + `15` | 批次、工单、巡检 + 业务地图 |
| `04-会话、记忆与身份.md` | `project/05` + `14` + `16` | 会话、持久化、无登录身份、分层记忆 |
| `05-场景与宿主前端.md` | `project/06` | 突出浏览器宿主与前端模块 |
| `06-审阅台与可观测.md` | `project/07` | 原文 |
| `07-评测与质量闭环.md` | `project/08` + `17` | 合并 |
| `08-运维与故障兜底.md` | `project/09` + `踩坑.md` | 合并 |
| `09-关键取舍.md` | `interview/01` | 16 条取舍 |
| `10-数字速查与讲法.md` | `interview/02` + `demo/` | 数字口径 + 时长讲法 |
| `11-面试问答.md` | `interview/03` + D 的 J01–J21 | 逐题合并，保留更完整版本 |
| `12-源码与演示.md` | `project/10` + `demo/` | 源码导览与演示入口 |

#### 跨项目

`03-跨项目对比.md`：D 的 C01–C03 + 新增对比表（MCP 角色、完成证据、失败复盘、前端架构、评测方式）。

### 4.3 前端基础（note-blog 全量迁入）

| 原路径 | 新路径 | 处理 |
| --- | --- | --- |
| `questions/fontEndBasic/HTML.md` | `01-前端基础/00-HTML/知识点.md` | 原文 |
| `notes/js/common.md`、`knowledge.md`、`nativeContructor.md`、`setmap.md`、`Symbol.md` | `01-JavaScript/知识点.md` | 合并 JS 核心知识 |
| `notes/js/designMode/pattern.md`、`model.md` | `01-JavaScript/设计模式.md` | 合并 |
| `questions/fontEndBasic/JS.md` | `01-JavaScript/面试题.md` | 与 `notes/README.md` 去重后合并 |
| `tsNotes/Normal.md`、`ObjectType.md`、`Generics.md`、`ConditionalTypes.md`、`Keyof.md`、`Typeof.md`、`IndexAccess.md` | `02-TypeScript/01-基础.md` … `07-索引访问.md` | 每篇一页 |
| `tsNotes/README.md` | `02-TypeScript/index.md` | 去重后作为目录 |
| `questions/typescript/TypeScript.md` | `02-TypeScript/面试题.md` | 原文，补充 |
| `notes/css/commonUsed.md`、`layout.md` | `03-CSS与布局/知识点.md` | 合并 |
| `notes/css/compatibility.md` + `questions/compatible/Compatible.md` + `CrossTerminal.md` | `03-CSS与布局/兼容与跨端.md` | 合并 |
| `questions/fontEndBasic/CSS.md` | `03-CSS与布局/面试题.md` | 原文 |
| `questions/computer/ComputerNetWork.md` | `04-浏览器与网络/网络与HTTP.md` | 原文 |
| `questions/computer/SecurityNote.md` | `04-浏览器与网络/前端安全.md` | 原文 |
| `notes/vue/vue.md` + `vue-problem.md` | `05-Vue与React/Vue.md`、`Vue常见问题.md` | 拆分 |
| `questions/fontEndBasic/Vue.md` | `05-Vue与React/Vue面试题.md` | 与笔记去重 |
| `notes/react/react.md` + `questions/fontEndBasic/React.md` | `05-Vue与React/React.md`、`React面试题.md` | 合并去重 |
| `questions/fontEndBasic/Webpack.md` | `06-工程化与性能/构建工具.md` | 原文 |
| `questions/fontEndBasic/PerformanceOptimization.md` | `06-工程化与性能/性能优化.md` | 原文 |
| `questions/autoTesting/AutoTesting.md` | `06-工程化与性能/自动化测试.md` | 原文 |
| `questions/dataStructure/Algorithm.md`、`Concept.md`、`Sort.md` | `07-手写与算法/算法与数据结构.md`、`排序.md` | 合并 |
| `questions/written/DeepClone.md`、`Promise.md`、`ArrayObject.md`、`GetOutputResults.md`、`Written.md`、`Axios.md`、`还在死记手写面试题吗.md` | `07-手写与算法/` 下分主题页 | 合并去重 |
| `notes/wxapp/basics.md`、`scene.md`、`scan.md`、`compatibility.md`、`taroUsed.md` | `08-小程序/` 下分主题页 | 原文 |
| `questions/fontEndBasic/WXApp.md` | `08-小程序/面试题.md` | 原文 |
| `questions/questionHistory/*.md` | `09-历年真题/` | 去重后归档，重复题只保留链接 |
| `notes/git/*.md` | `90-附录/环境与工具/Git/` | 原文 |
| `notes/others/npm.md`、`nvm.md`、`contentType.md` | `90-附录/环境与工具/` | 原文 |
| `mac/README.md`、`command.md` | `90-附录/环境与工具/macOS.md` | 合并 |
| `service/nginx.md`、`own.md` | `90-附录/环境与工具/服务器与Nginx.md` | 合并 |
| `regexp/regexp.md` | `90-附录/常用正则.md` | 原文 |
| `docs/README.md`、各目录 `README.md` | 不迁移 | 由新首页和目录页替代 |

### 4.4 其他

| 原路径 | 新路径 | 处理 |
| --- | --- | --- |
| `核心能力/index.md` | `04-面试题库/重点清单.md` | 复用组件与生成器 |
| `语法对照/` | `90-附录/语法对照/` | 原样迁移 |
| `E-代码示例/` | `90-附录/代码示例/` | 原样迁移 |
| `课程练习/` | 不发布 | 保留仓库 |
| `D-AI架构/面试题.md` | 拆散 | 见 4.2 与 04-面试题库 |
| `D-AI架构/index.md` | 删除 | 由 `03-项目实战/index.md` 替代 |
| `docs/public/code/` | 不动 | 代码示例静态资源 |

## 5. 去重规则

1. **项目事实只存一份**：链路、数字、取舍写在项目实战页；面试讲法页只引用，不复述。
2. **通用题只存一份**：答案留在各专题的 `面试题.md`；题库页是生成视图。
3. **项目题只存一份**：D 的 J/R 题合并进两个项目页；重复条目删除。
4. **前端笔记与题库去重**：
   - 同一问题在 `notes/` 和 `questions/` 同时出现时，保留更完整的答案，移动到对应 `面试题.md`。
   - `notes/README.md`、`tsNotes/README.md` 只保留目录作用，重复问答删除。
   - `questionHistory/` 与专题题库重复的题只保留标题链接，不复制答案。
5. **数字统一口径**：每个项目一页数字速查，其他页面引用同一组数字。
6. **旧内容归档**：2019–2022 真题进 `09-历年真题/`，不参与首页推荐。

## 6. 题库设计

扩展现有 `scripts/sync-core-topics.mjs`，不新建第四份答案副本。

### 6.1 生成规则

- 扫描 `docs/` 下所有 `.md`（排除 `public/`、`课程练习/`、`90-附录/`）。
- 识别 `##`–`###` 标题中的 `[重点]` 与 `必练`。
- 输出字段：`id`、`title`、`module`、`kind`、`priority`、`href`、`output`、`anchor`、`body`、`html`。
- `kind`：`knowledge`（知识点）、`qa`（面试题/技术问答）、`project`（项目实战）。
- `priority`：标题含 `[重点]` 或 `必练` → `p0`，否则 `p1`。

### 6.2 分组

```text
priority        本周必练（p0）
frontend        前端基础
prompt          Prompt 与上下文
rag             RAG 与知识工程
agent           Agent、工具与 MCP
framework       框架与平台
delivery        工程与交付
inference       部署与推理
model           模型基础与选型
project-thingjs ThingJS 项目
project-jiangzhong 江中项目
cross           跨项目
```

### 6.3 页面

- `04-面试题库/index.md`：筛选、搜索、类型、复习进度（沿用 `CoreCapabilityCatalog.vue`）。
- `04-面试题库/重点清单.md`：P0 列表，默认按模块分组。
- `04-面试题库/通用情境题.md`：D 的 A01–A20。
- `04-面试题库/八股总纲.md`：ThingJS 14 提炼。
- `04-面试题库/数字与话术.md`：两项目数字口径与 60 秒/3 分钟讲法。
- `04-面试题库/语言基础.md`：D 的 PY/PB 题。

## 7. 首页与导航

### 7.1 首页

四张主卡：

1. 前端基础
2. AI 应用开发
3. 项目实战
4. 面试题库

三条路径：

- 30 分钟：项目全景 + 架构图 + 60 秒讲法。
- 1 天：前端高频 + RAG/Agent 高频。
- 1 周：P0 题单 + 两个项目逐层过一遍。

首页直接显示“本周必练”，点击进题库。

### 7.2 导航

```ts
nav: [
  { text: '学习路线', link: '/00-学习路线/' },
  { text: '前端基础', link: '/01-前端基础/' },
  { text: 'AI 应用开发', link: '/02-AI应用开发/' },
  { text: '项目实战', link: '/03-项目实战/' },
  { text: '面试题库', link: '/04-面试题库/' },
]
```

侧栏按新目录重建，删除 D 的重复锚点侧栏。

## 8. URL 与重定向

目录改名后，在 `vercel.json` 增加 301：

| 旧路径 | 新路径 |
| --- | --- |
| `/A-应用开发/:path*` | `/02-AI应用开发/:path*` |
| `/B-工程落地/01-应用服务与交付/:path*` | `/02-AI应用开发/06-工程与交付/:path*` |
| `/B-工程落地/06-推理部署与优化/:path*` | `/02-AI应用开发/07-部署与推理/:path*` |
| `/B-工程落地/:path*` | `/02-AI应用开发/` |
| `/C-模型能力/07-神经网络与视觉/:path*` | `/02-AI应用开发/08-模型基础与选型/01-神经网络与视觉/:path*` |
| `/C-模型能力/08-HuggingFace/:path*` | `/02-AI应用开发/08-模型基础与选型/02-HuggingFace/:path*` |
| `/C-模型能力/09-微调与蒸馏/:path*` | `/02-AI应用开发/08-模型基础与选型/03-微调与蒸馏/:path*` |
| `/C-模型能力/:path*` | `/02-AI应用开发/` |
| `/D-AI架构/:path*` | `/04-面试题库/` |
| `/核心能力/:path*` | `/04-面试题库/重点清单` |
| `/语法对照/:path*` | `/90-附录/语法对照/:path*` |
| `/E-代码示例/:path*` | `/90-附录/代码示例/:path*` |

VitePress 继续使用 `cleanUrls: true`。构建前继续执行 `verify-doc-links` 与 `verify-core-topics`。

## 9. 实施阶段

| 阶段 | 内容 | 验收 |
| --- | --- | --- |
| P1 架构迁移 | 建目录、`git mv` 现有 A/B/C、改导航/侧栏/首页、扩生成器、加重定向 | `npm run docs:build` 通过 |
| P2 项目实战 | 迁入两个 workwork、合并面试文档、收架构图、拆 D | 项目页与题库双入口可达 |
| P3 前端基础 | 迁入 note-blog 全部内容、去重、下载外链图、补目录 | 无死链、移动端可读 |
| P4 题库统一 | 八股总纲、数字话术、重点清单、分组筛选 | 同一题只有一个答案源 |
| P5 验收 | 链接校验、构建、搜索、手机端、旧 URL、内容抽查 | 构建与校验全绿 |

## 10. 风险与约束

- note-blog 有 31 张外链图片，迁移时下载到 `docs/public/assets/frontend/`，避免外链失效。
- VuePress 1 的 `README.md`、相对链接、`sidebar` frontmatter 需要清理。
- 大文件拆分后要保留标题锚点，避免旧链接失效。
- 旧真题质量参差，去重后归档，不进入重点清单。
- 项目资料中的数字会随代码变化，统一在“数字速查”页标注日期与来源。
- 简历不发布；如后续要公开，单独评审。

## 11. 非目标

- 不重写所有技术内容，只做迁移、合并、去重和格式统一。
- 不改动 `examples/`、`cookbook/`、`mcp-tools/` 的可运行代码。
- 不把站点改成博客或作品集主页。
- 不迁移 `note-blog` 的构建配置和主题。
