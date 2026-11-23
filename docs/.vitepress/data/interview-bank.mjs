export const categories = [
  {
    id: 'project-intro',
    title: '项目 3 分钟简介',
    questions: [
      {
        id: 'Q01',
        title: '江中智能助手 3 分钟',
        body: `
<p>江中智能助手是面向制药车间内网的对话式业务助手。用户可以用自然语言查规程、设备状态、告警、工单、库存和批次，也可以办理批次追溯、维修工单、巡检，并定位到三维场景里的设备。</p>
<p>我独立交付了 Vue 3 对话前端和 TypeScript / Express 服务端。服务端不是一个大提示词，而是 <strong>分类 → 规划 → 执行</strong>：先判断意图，再产出目标和结构化计划，最后由<strong>计划编译器</strong>校验工具、参数、依赖和写边界，交给 <strong>计划步骤 / 计划汇总</strong> 执行；固定业务流程编译成 LangGraph 子图。</p>
<p>写操作必须走<strong>提议 → 审批 → 执行</strong>，确认幂等并写审计；三维动作交给宿主执行，<strong>没有回执不算成功</strong>。会话、图状态、审批和场景回执存 PostgreSQL，服务重启后能续接，<strong>状态不明不自动重放</strong>。</p>
<p>评测分两层：第一层用<strong>固定断言</strong>检查工具、流程和状态等确定性行为；第二层按<strong>任务完成、安全拦截、数值溯源</strong>做质量门禁。用例覆盖正常问答、多步任务、缺参、越权、空结果、工具失败和注入；不达线就阻断发布。审阅台支持回放、人工标注、参考标准对比和回归用例。</p>
<p>三句话收尾：<strong>模型负责理解和提议，程序负责边界和结算</strong>；<strong>没有回执不算成功</strong>；<strong>评测和门禁让改动可回归</strong>。</p>
`,
      },
      {
        id: 'Q02',
        title: 'THINGJS 文档问答系统 3 分钟',
        body: `
<p>ThingJS 文档问答系统面向官方文档和示例代码，网页助手和编辑器通过工具协议共用一套检索、生成链路。</p>
<p>文档按 Markdown 结构和代码语法树切分，保留类 / 成员身份和父块；检索走<strong>向量 + 关键词检索</strong>，用<strong>排名融合</strong>把两路结果合并，再做<strong>精确符号置顶</strong>、类 / 成员采纳和<strong>父块回填</strong>；生成用 YAML 提示词 + LangChain 表达式，做证据筛选、领域守卫和引用校验。</p>
<p>索引按文件内容指纹增量构建，索引清单校验后切激活指针；文档改动可热更新，发布门禁失败回滚。评测有 100 题检索集、30 题生成集和 12 题自动评审校准，另加覆盖集、真实问法和代码题；三套门禁绑定配置版本。</p>
<p>我负责前端、检索、生成和评测。三句话：<strong>切片不是固定长度</strong>；<strong>混合检索同时解决语义和精确符号</strong>；<strong>引用检查只能保证引用真实存在，不能保证引用支持结论</strong>。</p>
`,
      },
      {
        id: 'Q03',
        title: '中国移动网络拓扑 3 分钟',
        body: `
<p>中国移动集团网络拓扑是集团级网络资源管理和运行监控的三维可视化平台，用地球场景展示集团、省份和区域的网络资源，支持 <strong>3D 拓扑</strong>和 <strong>2D 逻辑拓扑</strong>多层级查看。</p>
<p>我参与三维拓扑模块的设计和开发：地球与 3D 拓扑联动、3D / 2D 构建与切换、设备 / 线路 / 标签 / 告警管理，以及专线等业务数据适配。</p>
<p>布局按节点数、连接数、双向 / 备用线路比例和中心节点判断<strong>树状、链式、星型 / 复杂拓扑</strong>，用<strong>邻接表</strong>算层级和坐标；同一对设备多条线做<strong>平行偏移</strong>。交互支持线路高亮、双击下钻、按业务筛线、相机飞行、视角保存 / 恢复和标签显隐。</p>
<p>我独立完成的<strong>聚合下钻</strong>功能已经迁入中国移动项目。</p>
`,
      },
    ],
  },
  {
    id: 'project-architecture',
    title: '项目架构与主链路',
    questions: [
      {
        id: 'Q04',
        title: '画一下江中项目架构',
        figure: 'jiangzhong',
        body: `
<p>画图顺序：宿主聊天窗口 → 后端服务器 → 助手节点 → 模型服务 / 工具与场景节点 / 业务中台 / Dify 知识库。</p>
<ul>
<li><strong>宿主</strong>：浏览器聊天模块、三维场景、审批卡、场景回执。</li>
<li><strong>后端</strong>：Express 网关、鉴权、会话锁、服务器推送、后台运行。</li>
<li><strong>助手</strong>：分类、规划、计划编译、LangGraph 主图、固定流程子图。</li>
<li><strong>外部</strong>：模型网关、工具协议里的工具、业务中台、Dify 知识库。</li>
</ul>
<p>讲的时候补一句：模型只负责理解和提议，工具、权限、写操作和回执由程序控制。</p>
`,
      },
      {
        id: 'Q05',
        title: '画一下 THINGJS 项目架构',
        figure: 'thingjs',
        body: `
<p>这张图是一套完整的知识检索工程链路，按 1–6 读：</p>
<ul>
<li><strong>1. 系统整体流程</strong>：前端 → API → 检索 → 生成 → 评测 / 发布。</li>
<li><strong>2. 离线索引流程</strong>：文档新增 / 修改 / 删除 → 解析 → 切片 → 向量化 / 关键词检索 → 索引版本。</li>
<li><strong>3. 在线检索问答</strong>：意图 / 查询计划 → 双路召回 → 排名融合 → 父块 → 生成 → 证据守卫。</li>
<li><strong>4. 评测系统</strong>：检索 / 生成评测、自动评审、回归。</li>
<li><strong>5. 检索黄金集</strong>：固定题集与基线。</li>
<li><strong>6. 发布门禁系统</strong>：索引清单 / 激活指针、门禁、回滚。</li>
</ul>
<p>另外三块：<strong>记忆系统</strong>、<strong>会话管理</strong>、<strong>日报和混合排序</strong>。</p>
<p>讲的时候补一句：网页、编辑器和评测平台共用同一套检索与生成链路。</p>
`,
      },
      {
        id: 'Q06',
        title: '江中一次请求怎么走？',
        body: `
<p><strong>接入</strong>：前端调用两个接口。<strong>普通问答接口</strong>问一次，返回完整回答；<strong>流式问答接口</strong>边生成边返回，前端可以逐字显示。服务端收到请求后解析身份、限流、拿会话锁。</p>
<p><strong>分类</strong>：判断意图类别；<strong>规划</strong>：产出目标和结构化计划；<strong>执行</strong>：按计划执行。</p>
<p><strong>计划编译</strong>：校验工具、参数、依赖和写边界；最多 8 步、3 层依赖、每批 3 个并行。</p>
<p><strong>执行</strong>：只读走 <strong>计划步骤 / 计划汇总</strong>；固定业务走子图；写操作进入审批；三维动作交给宿主并等回执。</p>
<p><strong>收尾</strong>：组织本轮证据，返回回答；会话、图状态、任务卡、审批和回执落 PostgreSQL。</p>
`,
      },
      {
        id: 'Q07',
        title: '江中写操作审批和场景回执怎么走？',
        body: `
<p><strong>写操作</strong>：模型提议 → 人工确认 → 执行器执行。确认幂等并写审计；重复点击不会重复派工。状态不明时拒绝自动重放，要求人工核对。</p>
<p><strong>场景动作</strong>：服务端只生成 <code>动作名 + 参数</code>；宿主执行后回传场景回执。没有回执不算成功；服务器推送上的“正在定位”只是进度。</p>
<p><strong>边界</strong>：只有聚焦、飞行、告警高亮真正改变场景，其余标记为模拟。</p>
`,
      },
      {
        id: 'Q08',
        title: 'THINGJS 一次问答怎么走？',
        body: `
<p><strong>离线</strong>：文档解析 → 结构切片 → 父块 → 向量化 +关键词检索→ 索引版本。</p>
<p><strong>在线</strong>：意图识别 → 查询计划 → 向量 /关键词检索双路召回 →排名融合→ 精确符号置顶 → 类 / 成员采纳 → 父块回填 → 组装上下文。</p>
<p><strong>生成</strong>：结构化 JSON → 回答形态分类 → 证据筛选 → 领域守卫 → 引用校验 → 确定性清洗。</p>
<p><strong>质量</strong>：检索黄金集、生成黄金集、裁判校准；三套门禁绑定配置版本。</p>
`,
      },
      {
        id: 'Q09',
        title: 'THINGJS 索引怎么发布和回滚？',
        body: `
<p>索引按文件 hash 增量构建，未变文件复用上一版向量；切块指纹或维度变化才全量。</p>
<p>构建产物写 manifest 和 <code>BUILD_OK</code>；校验通过后切 <code>索引激活文件</code> 指针，再热加载新版本。</p>
<p>发布门禁失败时回滚 <code>索引激活文件</code> 并热加载旧版；prune 保留最近 5 个可用版本。</p>
<p>docs 改动可触发热更新，去抖 5s、冷却 2.5s；提示词不热更新，改 YAML 需重启。</p>
`,
      },
    ],
  },
  {
    id: 'agent',
    title: '智能体重点问题',
    questions: [
      {
        id: 'Q10',
        title: '为什么用 LangGraph 状态图 / 智能体，而不是固定流程？',
        body: `
<p>固定流程要求执行前把顺序写死。江中很多请求的下一步取决于用户要做哪几件事、上一步查到了什么，整条路径写不出来。</p>
<p>所以用 <strong>分类 → 规划 → 执行</strong>：模型只负责理解与提议，程序负责计划校验、工具执行和结算。固定业务仍然编译成子图，不是所有请求都进智能体。</p>
<p><strong>关键词</strong>：智能体适用边界、固定流程、状态图、模型提议 / 程序结算。</p>
`,
      },
      {
        id: 'Q11',
        title: '分类 → 规划 → 执行 分别做什么？',
        body: `
<p><strong>分类</strong>：判断意图类别。</p>
<p><strong>规划</strong>：产出目标和结构化计划。</p>
<p><strong>执行</strong>：按计划执行；只读走计划执行器，固定业务走子图，写操作进入审批。</p>
<p>上限：计划最多 <strong>8 步 / 3 层依赖</strong>，每批最多 <strong>3 个</strong>并行。</p>
`,
      },
      {
        id: 'Q12',
        title: '计划编译器校验什么？怎么防止乱跑？',
        body: `
<p>校验<strong>工具是否已注册、参数是否符合 Schema、依赖是否成环、是否越过写边界</strong>。</p>
<p>目录外工具直接拒绝；缺参先问，不猜；只读失败可重试，写操作不自动重试。</p>
<p>模型只能提议，执行权在程序。</p>
`,
      },
      {
        id: 'Q13',
        title: '工具目录怎么用？参数怎么校验？',
        body: `
<p>宿主或中台每轮上报工具目录，模型只看到本次目录。</p>
<p>参数用 <strong>参数结构校验</strong> 运行时校验；参数错误最多修两次，不能借机换工具。</p>
<p>越权在调用前拦；工具返回里的注入指令不执行。</p>
`,
      },
      {
        id: 'Q14',
        title: '写操作为什么必须人工确认？怎么幂等？',
        body: `
<p>写操作走<strong>提议 → 审批 → 执行</strong>。确认幂等并写审计；重复点击不会重复下单 / 派工。</p>
<p>状态不明时拒绝自动重放，要求人工核对。</p>
<p><strong>关键词</strong>：人工审批、幂等、审计、状态不明、不重放。</p>
`,
      },
      {
        id: 'Q15',
        title: '会话、图状态、审批、回执怎么存？重启怎么恢复？',
        body: `
<p>会话、图状态、任务卡、审批和场景回执存 <strong>PostgreSQL</strong>；同一会话用<strong>咨询锁</strong>串行。</p>
<p>恢复时读取已完成结果引用，<strong>工单查询不会重跑</strong>；状态不明只核对，不重放。</p>
<p><strong>关键词</strong>：状态快照、PostgreSQL、会话锁、结果引用、恢复。</p>
`,
      },
      {
        id: 'Q16',
        title: '三维动作怎么保证真的执行了？',
        body: `
<p>服务端只生成 <code>动作名 + 参数</code> 的动作；宿主执行后回传 <strong>场景回执</strong>。</p>
<p>没有回执不算成功；服务器推送上的“正在定位”只是进度，不是执行结果。</p>
<p>真正改变场景的只有聚焦、飞行、告警高亮，其余标记为模拟。</p>
`,
      },
      {
        id: 'Q17',
        title: '智能体怎么评测？',
        body: `
<p><strong>第一层：固定断言</strong>，检查工具、流程和状态等确定性行为。</p>
<p><strong>第二层：质量门禁</strong>，按任务完成、安全拦截、数值溯源评价。</p>
<p>用例覆盖正常问答、多步任务、缺参、越权、空结果、工具失败和注入；审阅台支持回放、人工标注、参考标准对比和回归用例。</p>
<p><strong>关键词</strong>：固定断言、质量门禁、任务完成、安全拦截、数值溯源、人工标注、回归用例。</p>
`,
      },
      {
        id: 'Q18',
        title: '流量涨 10 倍，哪里先崩？',
        body: `
<p>先看<strong>进程内限流</strong>、<strong>会话锁</strong>、<strong>服务器推送连接</strong>、<strong>模型网关排队</strong>、<strong>向量检索</strong>和<strong>成本</strong>。</p>
<p>多实例要外置限流和状态；会话要能分片；服务器推送要考虑粘性。</p>
<p>先盯 P95、首字延迟、排队时间、工具失败率和单轮成本。</p>
`,
      },
      {
        id: 'Q19',
        title: '哪些真正生效，哪些是模拟？怎么反驳“只是套了 LangGraph”？',
        body: `
<p>三维只有 3 个方法真正改变场景，其余标记模拟；微调和分布式没有生产验证。</p>
<p>反驳点不是“我用了 LangGraph”，而是<strong>计划编译器、参数校验、审批幂等、场景回执、评测门禁</strong>这些框架不自带、自己补的工程。</p>
`,
      },
      {
        id: 'Q20',
        title: '讲一个失败复盘',
        body: `
<p>按 <strong>现象 → 证据 → 哪一层 → 改了什么 → 怎么复验</strong>。</p>
<p>例子：设备存在但无告警，用户仍要定位；或目标类召回了却没进入最终上下文。</p>
<p>先说看到了什么证据，再说根因和复验，不要归因于“模型不稳定”。</p>
`,
      },
      {
        id: 'Q21',
        title: '项目最大的技术难点是什么？',
        body: `
<p>不是“调通模型”，而是<strong>让模型提议可控</strong>：计划要能校验、工具要能绑定、写操作要审批、状态要能恢复、结果要能回执、改动要能回归。</p>
<p>把这几件事拆开，每件都能落到代码和数字。</p>
`,
      },
    ],
  },
  {
    id: 'resume-keywords',
    title: '简历关键词',
    questions: [
      {
        id: 'Q22',
        title: '智能体运行时与业务编排',
        body: `
<p><strong>他会问</strong>：LangGraph 到底解决了什么？为什么不用一条链？工具怎么绑？写操作怎么保证不重复？</p>
<p><strong>一句话接</strong>：固定流程写死顺序，江中的下一步取决于用户要做几件事和上一步查到了什么，所以用 <strong>分类 → 规划 → 执行</strong>；模型只提议，计划编译器校验，写操作走审批，状态和回执落 PostgreSQL。</p>
`,
      },
      {
        id: 'Q23',
        title: '检索与回答质量',
        body: `
<p><strong>他会问</strong>：为什么不用固定长度切块？向量和关键词检索各解决什么？排名融合为什么比加权求和稳？引用能保证什么？</p>
<p><strong>一句话接</strong>：按 Markdown 结构和代码 AST 切，保留类 / 成员和父块；向量补语义，关键词检索补精确符号，排名融合按名次合并；引用检查只能保证引用真实存在，不能保证引用支持结论。</p>
`,
      },
      {
        id: 'Q24',
        title: '评测与门禁',
        body: `
<p><strong>他会问</strong>：你怎么证明改完没退化？裁判有偏差怎么办？门禁会不会误杀？</p>
<p><strong>一句话接</strong>：评测分两层：第一层固定断言，第二层按任务完成、安全拦截、数值溯源做质量门禁；审阅台支持回放、人工标注、参考标准对比和回归用例；不达线阻断发布。误杀时先看题集分母和阈值，再决定改系统还是改基线。</p>
`,
      },
      {
        id: 'Q25',
        title: 'AI 应用前端',
        body: `
<p><strong>他会问</strong>：服务器推送怎么解析？取消和重试怎么做？审批卡怎么处理？引用和证据怎么展示？</p>
<p><strong>一句话接</strong>：<code>ReadableStream + TextDecoder</code> 解析服务器推送；<code>delta / reset / phase / done / error</code> 事件；增量预览不是最终答案，<code>done</code> 才是权威结果；<code>AbortController</code> 取消；审批卡只产出 patch，不自己提交；Markdown 渲染加 XSS 净化。</p>
`,
      },
      {
        id: 'Q26',
        title: '前端基础与框架',
        body: `
<p><strong>他会问</strong>：事件循环、原型链、闭包、Promise；Vue 响应式、组件通信、<code>v-model</code>；TypeScript 泛型和类型收窄。</p>
<p><strong>一句话接</strong>：这些是十年基础，按“概念 → 例子 → 项目里怎么用”答。项目里最相关的是服务器推送状态机、审批卡、会话恢复和类型契约。</p>
`,
      },
      {
        id: 'Q27',
        title: '小程序 / 跨端',
        body: `
<p><strong>他会问</strong>：小程序生命周期、登录流程、扫码、定位、公共能力怎么抽？</p>
<p><strong>一句话接</strong>：做过嘉士伯多品牌会员小程序，总用户 3000w+、日活 15w+；用 ES6 class 抽公共扫码逻辑和生命周期 hooks，定位和状态管理也复用；接口加密和表单校验防刷、防 XSS。</p>
`,
      },
      {
        id: 'Q28',
        title: '三维与大屏',
        body: `
<p><strong>他会问</strong>：3D / 2D 拓扑怎么分工？复杂拓扑怎么自动布局？聚合下钻怎么保留上下文？相机和标签怎么不打架？</p>
<p><strong>一句话接</strong>：3D 看空间层级，2D 看逻辑连接，共享同一份拓扑数据；按节点数、连接数、双向 / 备用线路比例判断树状 / 链式 / 星型 / 复杂拓扑，用邻接表算层级和坐标；聚合按 scope 取子图，返回恢复父级视角和过滤条件。</p>
`,
      },
      {
        id: 'Q29',
        title: '工程化',
        body: `
<p><strong>他会问</strong>：Vite / Webpack 怎么选？pnpm workspace 怎么管？Playwright 测什么？Docker / CI / Nginx 做过什么？</p>
<p><strong>一句话接</strong>：工程化不是工具清单，是交付效率和质量：构建、依赖、规范、测试、部署、回滚各有一件事能讲。项目里最相关的是服务器推送测试、索引发布门禁和配置版本。</p>
`,
      },
    ],
  },
  {
    id: 'frontend',
    title: '前端内容',
    questions: [
      {
        id: 'Q30',
        title: '事件循环：宏任务 / 微任务',
        body: `
<p>同步代码先执行；每轮先清空微任务，再取一个宏任务。</p>
<ul><li>微任务：<code>Promise.then</code>、<code>queueMicrotask</code>、<code>MutationObserver</code>。</li><li>宏任务：<code>setTimeout</code>、<code>setInterval</code>、I/O、UI 渲染。</li><li><code>async/await</code> 里 <code>await</code> 之后是微任务。</li></ul>
<p>答题时画一个“同步 → 微任务 → 宏任务”的顺序，再举一个 <code>Promise</code> + <code>setTimeout</code> 的输出题。</p>
`,
      },
      {
        id: 'Q31',
        title: '原型链、instanceof、new 做了什么',
        body: `
<p><code>new</code>：创建空对象 → 指向构造函数原型 → 执行构造函数 → 返回对象或构造函数的返回值。</p>
<p><code>instanceof</code>：沿 <code>__proto__</code> 找 <code>B.prototype</code>。</p>
<p>原型链：访问属性先查自身，再沿 <code>__proto__</code> 向上，直到 <code>Object.prototype</code>。</p>
`,
      },
      {
        id: 'Q32',
        title: '闭包与内存泄漏',
        body: `
<p>闭包是函数能访问外部作用域变量。用途：私有变量、回调、防抖节流。</p>
<p>风险：长期持有大对象、未解绑事件、定时器未清理。处理：置空引用、<code>removeEventListener</code>、<code>clearInterval</code>。</p>
`,
      },
      {
        id: 'Q33',
        title: '深浅拷贝',
        body: `
<p>浅拷贝只复制第一层：<code>Object.assign</code>、展开运算符、<code>slice</code>。</p>
<p>深拷贝：递归、<code>structuredClone</code>、<code>JSON.parse(JSON.stringify())</code>（会丢函数 / undefined / Date 变字符串）。</p>
<p>答题时说清边界：循环引用、Map / Set、Symbol、Date。</p>
`,
      },
      {
        id: 'Q34',
        title: 'Promise、async/await 与并发',
        body: `
<p><code>Promise.all</code>：全部成功才成功，一个失败就失败；<code>allSettled</code> 等全部结束；<code>race</code> 取最快；<code>any</code> 取第一个成功。</p>
<p><code>async/await</code> 是 Promise 的语法糖；循环里 <code>await</code> 会串行，要并发就用 <code>Promise.all</code> 或限制并发。</p>
<p>项目里：服务器推送取消用 <code>AbortController</code>；模型调用要设超时和兜底。</p>
`,
      },
      {
        id: 'Q35',
        title: 'TypeScript：type 和 interface 的区别',
        body: `
<ul><li><code>interface</code> 可声明合并，适合对象结构；<code>type</code> 能表达联合、交叉、条件类型。</li><li><code>type</code> 不能重复声明合并；<code>interface</code> 更适合扩展。</li><li>项目里 API 契约用 <code>type</code> + Zod 校验；组件 props 用 <code>interface</code> 也常见。</li></ul>
`,
      },
      {
        id: 'Q36',
        title: 'TypeScript：泛型、条件类型、类型收窄',
        body: `
<p>泛型：把类型当参数，保持输入输出关系。<code>function first&lt;T&gt;(arr: T[]): T | undefined</code>。</p>
<p>条件类型：<code>T extends U ? X : Y</code>；配合 <code>infer</code> 做类型提取。</p>
<p>类型收窄：<code>typeof</code>、<code>in</code>、<code>instanceof</code>、判别联合、自定义类型守卫。</p>
`,
      },
      {
        id: 'Q37',
        title: '盒模型与 BFC',
        body: `
<p>盒模型：content + padding + border + margin。<code>box-sizing: border-box</code> 让宽高包含 padding 和 border。</p>
<p>BFC：块级格式化上下文。触发：<code>overflow</code> 非 visible、<code>display: flow-root</code>、float、绝对定位、flex/grid 子项。</p>
<p>用途：清浮动、防 margin 合并、隔离布局。</p>
`,
      },
      {
        id: 'Q38',
        title: 'Flex / Grid 与居中',
        body: `
<p>Flex 一维布局：<code>justify-content</code> 主轴、<code>align-items</code> 交叉轴、<code>flex: 1</code> 占剩余空间。</p>
<p>Grid 二维布局：<code>grid-template-columns / rows</code>、<code>gap</code>、<code>minmax</code>、<code>auto-fit</code>。</p>
<p>居中：<code>display: flex; justify-content: center; align-items: center</code>；或 Grid <code>place-items: center</code>。</p>
`,
      },
      {
        id: 'Q39',
        title: 'display: none / visibility: hidden / opacity: 0',
        body: `
<ul><li><code>display: none</code>：不渲染，不占位，不响应事件。</li><li><code>visibility: hidden</code>：不显示但占位，不响应事件。</li><li><code>opacity: 0</code>：透明但占位，仍响应事件。</li></ul>
`,
      },
      {
        id: 'Q40',
        title: '浏览器缓存与 HTTP',
        body: `
<p>强缓存：<code>Cache-Control</code>、<code>Expires</code>，不发请求。</p>
<p>协商缓存：<code>ETag / If-None-Match</code>、<code>Last-Modified / If-Modified-Since</code>，命中返回 304。</p>
<p>答题时补一句：HTML 用短缓存 / 协商，静态资源加 hash 长缓存。</p>
`,
      },
      {
        id: 'Q41',
        title: '跨域与 CORS',
        body: `
<p>同源：协议 + 域名 + 端口一致。跨域是浏览器限制，不是服务器限制。</p>
<p>CORS：服务端返回 <code>Access-Control-Allow-Origin</code> 等头；非简单请求先发 OPTIONS 预检。</p>
<p>开发环境可用代理；生产用网关 / Nginx 转发或正确配置 CORS。</p>
`,
      },
      {
        id: 'Q42',
        title: '重排、重绘与性能指标',
        body: `
<p>重排：几何属性变化，重新布局；重绘：颜色等不影响布局的变化。</p>
<p>优化：批量 DOM、离线更新、<code>transform / opacity</code>、避免强制同步布局。</p>
<p>指标：FCP、LCP、CLS、TTI；用 Performance API / Lighthouse 看。</p>
`,
      },
      {
        id: 'Q43',
        title: 'XSS 与 CSRF',
        body: `
<p>XSS：注入脚本。防护：输出转义、<code>textContent</code>、CSP、富文本白名单净化。</p>
<p>CSRF：借用户登录态发请求。防护：CSRF Token、SameSite Cookie、校验 Origin / Referer。</p>
<p>项目里：Markdown 渲染用 DOMPurify；接口做参数校验。</p>
`,
      },
      {
        id: 'Q44',
        title: 'Vue 响应式原理',
        body: `
<p>Vue 2：<code>Object.defineProperty</code> 劫持 getter/setter，数组方法重写。</p>
<p>Vue 3：<code>Proxy</code> 代理整个对象，能监听新增 / 删除属性；依赖收集用 <code>track / trigger</code>。</p>
<p>答题时补一句：<code>ref</code> 包基本类型，<code>reactive</code> 包对象；模板自动解包。</p>
`,
      },
      {
        id: 'Q45',
        title: 'Vue 组件通信与生命周期',
        body: `
<p>通信：props / emit、<code>v-model</code>、provide / inject、Pinia / Vuex、<code>$attrs</code> / 插槽。</p>
<p>生命周期：创建、挂载、更新、销毁；<code>onMounted</code>、<code>onUnmounted</code> 常用。</p>
<p><code>keep-alive</code>：缓存组件，触发 <code>activated / deactivated</code>。</p>
`,
      },
      {
        id: 'Q46',
        title: 'React Hooks 与闭包陷阱',
        body: `
<p><code>useEffect</code> 依赖数组决定执行时机；空数组只执行一次，清理函数在卸载 / 依赖变化时执行。</p>
<p>闭包陷阱：回调里拿到旧 state；用函数式更新、<code>useRef</code> 或正确依赖解决。</p>
<p>优化：<code>memo</code>、<code>useMemo</code>、<code>useCallback</code>；不要过早优化。</p>
`,
      },
      {
        id: 'Q47',
        title: 'Vite 和 Webpack 的区别',
        body: `
<p>Vite 开发态用原生 ESM + esbuild 预构建，启动快；生产用 Rollup 打包。</p>
<p>Webpack 先打包再启动，生态成熟，适合复杂自定义构建。</p>
<p>答题时补一句：选型看团队、插件生态和构建需求，不是单纯比速度。</p>
`,
      },
      {
        id: 'Q48',
        title: '首屏优化',
        body: `
<p>代码分割、路由懒加载、预加载关键资源、图片压缩 / 懒加载、CDN、缓存。</p>
<p>SSR / SSG 改善首屏；骨架屏减少感知等待。</p>
<p>用 LCP、FCP、CLS 和真实用户监控验证，不只看打包体积。</p>
`,
      },
      {
        id: 'Q49',
        title: '手写：深拷贝 / 防抖节流 / Promise',
        body: `
<p>深拷贝：递归 + WeakMap 处理循环引用；区分数组、Date、Map / Set。</p>
<p>防抖：最后一次触发后延迟执行；节流：固定频率执行。</p>
<p>Promise：<code>then</code> 收集回调，<code>resolve / reject</code> 改状态，微任务里执行回调。</p>
`,
      },
      {
        id: 'Q50',
        title: '小程序生命周期与登录流程',
        body: `
<p>生命周期：App 的 <code>onLaunch / onShow / onHide</code>；Page 的 <code>onLoad / onShow / onReady / onUnload</code>。</p>
<p>登录：<code>wx.login</code> 拿 code → 后端 <code>code2Session</code> 换 openid / session_key → 后端自定义密钥 → 前端存 storage。</p>
<p>注意：session_key 不下发前端；用 <code>wx.checkSession</code> 检查登录态。</p>
`,
      },
    ],
  },
  {
    id: 'compare-pressure',
    title: '对比与压力题',
    questions: [
      {
        id: 'Q51',
        title: '两个项目都用了工具协议，有什么不同？',
        body: `
<p>江中：助手服务端是工具协议里工具的<strong>调用方</strong>，接中台查设备、工单、库存；重点是参数、权限和多步编排。</p>
<p>THINGJS：项目是知识工具的<strong>提供方</strong>，向编辑器开放检索和问答；重点是证据质量、索引版本和检索稳定性。</p>
`,
      },
      {
        id: 'Q52',
        title: '两个项目怎么判断“做得好”？给什么证据？',
        body: `
<p>江中：用真实请求说明是否选对工具、参数是否正确、后续动作是否合理、异常时怎么结束。</p>
<p>THINGJS：展示检索与回答的逐题记录、证据是否被采用、答案和引用是否匹配、新索引是否通过发布检查。</p>
<p>报数字前先说清测试条件、题集分母和统计对象。</p>
`,
      },
      {
        id: 'Q53',
        title: '只允许讲一次失败复盘，你选什么？',
        body: `
<p>选一条自己能核对的记录：江中的“设备存在但无告警，仍需定位”，或检索增强生成的“目标类召回了却没有进入上下文”。</p>
<p>按“现象 → 证据 → 问题在哪一层 → 修改了什么 → 如何复验”讲。</p>
`,
      },
      {
        id: 'Q54',
        title: '中国移动网络拓扑 vs 江中场景定位',
        body: `
<p>中国移动：网络资源拓扑，重点是 3D/2D 布局、线路关系和聚合下钻。</p>
<p>江中：对话式业务助手，场景定位只是其中一环，重点是 <strong>分类 → 规划 → 执行</strong>、工具、审批和回执。</p>
<p>两者都用 ThingJS，但一个以拓扑为主体，一个以对话和业务办理为主体。</p>
`,
      },
      {
        id: 'Q55',
        title: '你更像前端还是 AI 应用工程师？',
        body: `
<p>我的底子是前端，但最近两个项目是端到端交付：Vue 3 对话前端、Express 服务端、智能体编排、检索与评测。</p>
<p>所以更像<strong>偏前端的 AI 应用工程师</strong>：能把模型能力接进业务，也能把交互、流式、审批和恢复做完整。</p>
`,
      },
    ],
  },
  {
    id: 'predicted',
    title: '面试预测题',
    description:
      '这里放我猜面试官可能问的题，按智能体 → 前端 JS 从上往下排；和下面分类重复的题只保留在这里。',
    questions: [
      {
        id: 'P03',
        group: 'agent',
        title: '什么是智能体（Agent）？和大模型有什么本质不同？',
        body: `
<p><strong>简要回答</strong></p>
<p>智能体是一个能自主完成目标的 AI 系统。它和传统 AI 最核心的区别是「自主性」和「能行动」。</p>
<p>传统 AI 是你问一个问题它回答一个问题，每次独立、被动响应；智能体会把复杂目标拆成多步，通过调工具、访问记忆、感知环境来一步步执行，直到完成。</p>
<p>它不只是输出文字，而是真的能做事。大模型负责理解和生成；智能体在大模型外面加了规划、工具、记忆和执行循环。</p>
`,
      },
      {
        id: 'P04',
        group: 'agent',
        title: '智能体的基本架构是什么？',
        body: `
<p><strong>智能体 = 大模型 + 工具 + 记忆 + 规划模块。</strong></p>
<ul>
<li><strong>大模型</strong>：整个系统的大脑，负责理解任务和做决策。</li>
<li><strong>工具</strong>：让智能体能跟外部世界交互，搜索、执行代码、调 API 都靠它。</li>
<li><strong>记忆</strong>：让智能体在任务执行过程中保持状态，不会「失忆」。</li>
<li><strong>规划模块</strong>：负责把复杂目标拆解成可执行的步骤。</li>
</ul>
<p>生产里再加执行循环和边界控制。</p>
`,
      },
      {
        id: 'P05',
        group: 'agent',
        title: '工作流（Workflow）、智能体（Agent）、工具（Tools）有什么区别？',
        body: `
<p><strong>三者是从小到大的三层结构。</strong></p>
<p><strong>工具（Tools）</strong>：最小的能力单元，封装好的可调用函数，比如搜索、执行代码、发邮件。它只负责执行，本身没有决策能力。</p>
<p><strong>智能体（Agent）</strong>：完整的决策系统，内部用大模型做大脑，自己判断什么时候调哪个工具、要不要继续、什么时候结束，是主动的。</p>
<p><strong>工作流（Workflow）</strong>：更上层的编排框架，把智能体、大模型、工具组织成一条确定性流程；每个节点做什么、按什么顺序流转，都是开发者提前写死的。</p>
<p><strong>核心区别</strong>：工具不做决策只执行；智能体自己做决策；工作流是开发者替所有节点把决策提前写好。</p>
`,
      },
      {
        id: 'P06',
        group: 'agent',
        title: '了解哪些智能体设计范式？智能体和工作流有什么区别？',
        body: `
<p><strong>最核心的区别是「谁来决定下一步」。</strong>工作流提前把流程写死，每一步固定，确定性强、好控制；智能体让大模型决定下一步，灵活但不可控。</p>
<p><strong>常见范式</strong></p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>范式</th><th>描述</th></tr>
</thead>
<tbody>
<tr class="interview-bank-doc__table-row--used"><td>ReAct</td><td>思考 → 行动 → 观察，循环推进；适合工具调用。</td></tr>
<tr class="interview-bank-doc__table-row--used"><td>Plan-and-Execute</td><td>先产出多步计划，再逐步执行；失败或出现新信息时重规划。</td></tr>
<tr><td>Reflection</td><td>生成 → 批判 → 修订；适合质量要求高的输出。</td></tr>
<tr class="interview-bank-doc__table-row--used"><td>Router / 分类分发</td><td>先判断意图，再路由到专用流程或子智能体。</td></tr>
<tr><td>Multi-Agent</td><td>规划者、执行者、评审者分工，或主管 / 工人结构。</td></tr>
<tr class="interview-bank-doc__table-row--used"><td>Human-in-the-loop</td><td>关键写操作或高风险节点暂停等人工确认。</td></tr>
<tr class="interview-bank-doc__table-row--used"><td>Memory-augmented</td><td>加短期 / 长期记忆，支持跨轮和个性化。</td></tr>
<tr><td>Tree of Thoughts / Self-consistency</td><td>多路径探索或多答案投票，偏高质量场景。</td></tr>
</tbody>
</table>
</div>
<p><strong>工程里</strong>：固定流程用工作流，需要灵活决策的节点嵌入智能体，整体可控、局部灵活。</p>
`,
      },
      {
        id: 'P08',
        group: 'agent',
        title: 'AI Agent 的记忆机制是什么？实际开发怎么设计记忆模块？',
        body: `
<p><strong>简要回答</strong></p>
<p>Agent 需要记忆，才能在多步任务中保持状态、跨任务积累知识。</p>
<p>记忆机制分四层：<strong>感知记忆</strong>（当前输入）、<strong>短期记忆</strong>（上下文窗口里的对话历史）、<strong>长期记忆</strong>（外部数据库，按范围召回）、<strong>实体记忆</strong>（结构化提取的关键事实）。</p>
<p>实际设计要解决三个问题：<strong>存什么、怎么存、什么时候取</strong>。只存稳定可复用的事实，按信息类型选存储方式，再按需召回，不要把所有历史都塞进上下文。</p>
<p><strong>江中怎么落</strong>：短期记忆是最近对话 + 任务卡 + 摘要；长期记忆存 PostgreSQL，按设备 / 产线 / 车间 / 班次 / 用户隔离，默认关闭；任务状态也落 PostgreSQL，跨轮续接；记忆预算 2,000 token。</p>
`,
      },
      {
        id: 'P09',
        group: 'agent',
        title: 'Agent 的长短期记忆系统怎么做的？记忆怎么存、粒度多少、怎么用？',
        body: `
<p><strong>简要回答</strong></p>
<p>记忆分两层：短期记忆放当前会话的上下文窗口，存当前任务的中间状态，任务结束或会话过期后清理；长期记忆放外部存储，按关键事件写入，用的时候召回、选择后注入提示词。</p>
<p><strong>通用做法</strong>：短期就是上下文窗口里的对话历史；长期把信息向量化后写向量库，用时做语义检索；粒度按“一次完整交互”或“一个关键事件”存，太细检索噪音大，太粗会丢细节。</p>
<p><strong>江中实际</strong>：短期是最近对话 + 任务卡 + 摘要，按 token 预算裁剪；长期没有上向量库，用 PostgreSQL 五张表、五类范围（设备 / 产线 / 车间 / 班次 / 用户），按业务事件触发写入，不是每轮都存；召回用 FTS + 最近记录，默认关闭，记忆预算 2,000 token。</p>
<p><strong>怎么用</strong>：事件 → 提取 → 程序校验来源和范围 → 入库；召回时按 scope 过滤，profile 按 key、record 走 FTS，选择器逐条给理由，只注入选中的记忆；业务系统状态以业务系统为准，不拿记忆覆盖。</p>
`,
      },
      {
        id: 'P12',
        group: 'agent',
        title: 'Agent 记忆压缩通常有哪些方法？',
        body: `
<p><strong>简要回答</strong></p>
<p>记忆压缩常见有四种：摘要压缩、滑动窗口、重要性过滤、结构化抽取。实际最常用的是摘要压缩 + 滑动窗口，丢之前先摘要，尽量不丢重要信息。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>方法</th><th>描述</th></tr>
</thead>
<tbody>
<tr><td>摘要压缩</td><td>把长对话总结成简短摘要。</td></tr>
<tr><td>滑动窗口</td><td>只保留最近 N 轮对话。</td></tr>
<tr><td>重要性过滤</td><td>打分筛选，只留重要内容。</td></tr>
<tr><td>结构化抽取</td><td>把关键信息抽成结构化数据存起来。</td></tr>
</tbody>
</table>
</div>
<p><strong>江中怎么用</strong>：滑动窗口 + 结构化摘要；摘要输出目标、事实、动作、失败、未完成、约束，摘要失败保留旧摘要，不阻塞本轮。</p>
`,
      },
      {
        id: 'P10',
        group: 'agent',
        title: '什么是 Multi-Agent？',
        body: `
<p><strong>简要回答</strong></p>
<p>Multi-Agent 就是多个智能体协作完成一个任务，每个智能体各有分工：有的搜索、有的写代码、有的做评审。</p>
<p>单个智能体主要受两个限制：一是上下文窗口有限，复杂任务信息一多就撑爆；二是单点能力，什么都让一个智能体做，每件事都只是泛才。Multi-Agent 通过专业分工和并行执行，处理更复杂、更长的流程。</p>
<p><strong>边界</strong>：不是越多越好。任务能按角色拆开、需要并行或专业分工时才用；否则协调成本、调试成本和调用成本更高。</p>
`,
      },
      {
        id: 'P11',
        group: 'agent',
        title: '说说 Single-Agent 和 Multi-Agent 的设计方案？',
        body: `
<p><strong>简要回答</strong></p>
<p><strong>Single-Agent</strong>：适合任务流程清晰、复杂度适中的场景，实现简单、好维护。</p>
<p><strong>Multi-Agent</strong>：适合需要专业分工、任务量大或需要并行执行的复杂场景。</p>
<p><strong>两种拓扑</strong>：中心化 Orchestrator，由一个主智能体统一调度多个 Worker；去中心化 Peer-to-Peer，智能体之间直接通信。</p>
<p><strong>工程选择</strong>：中心化更好控制、好调试，出问题链路清晰，我用得更多；P2P 更灵活，但协调和排查成本高。不要为了多智能体而多智能体，先把单智能体 + 工作流做稳。</p>
`,
      },
      {
        id: 'P16',
        group: 'agent',
        title: '如何设计多 Agent 的协作与动态切换机制？',
        body: `
<p><strong>简要回答</strong></p>
<p>协作靠两件事：<strong>消息传递</strong>和<strong>共享状态</strong>。消息传递是智能体完成自己的工作后把结果发出去，下一个智能体取用；共享状态是所有智能体共同读写一个状态对象，记录任务进展和中间结果。</p>
<p><strong>动态切换</strong>靠 Orchestrator 来做，有两种方式：一种是静态路由，提前写好规则“任务类型 A 就找智能体 X”；另一种是让大模型动态决策，根据当前情况实时判断该把任务交给谁。</p>
<p><strong>我的实践</strong>：两种混用。主流程用静态路由保证稳定，边缘情况才交给大模型动态判断。共享状态要定义清楚谁写谁读，避免并发覆盖。</p>
`,
      },
      {
        id: 'P22',
        group: 'agent',
        title: 'Multi-Agent 系统如何处理子 Agent 超时、失联和并发修改冲突？',
        body: `
<p><strong>简要回答</strong></p>
<p>先把<strong>通信问题</strong>和<strong>一致性问题</strong>分开。心跳中断只能说明协调者暂时看不到子智能体，不能证明它已经停止。任务分配要带<strong>租约</strong>和<strong>递增的执行代次</strong>，子智能体定期续租；租约过期后协调者才能安排接管，旧执行者即使恢复，也不能再用过期代次提交结果。</p>
<p><strong>接管</strong>不能简单从头重跑。保存任务检查点，记录已完成步骤、产物版本和外部副作用；重试用稳定的任务 ID、步骤 ID 和幂等键；遇到结果未知的写操作，先查询外部系统，再决定继续、补偿还是人工确认。连续失败时支持换模型、换工具、拆小任务和人工接管等降级路径。</p>
<p><strong>并发修改</strong>：按任务依赖和文件所有权尽量减少重叠写入；每个智能体在独立工作区或分支中工作；提交时校验基线版本，普通文件用乐观并发，少数热点文件用带租约的短锁；只有 Integrator 有权合并到目标分支，按依赖顺序合并并跑静态检查、单元测试和集成测试。出现文本或语义冲突时，把最新基线、冲突原因和失败测试交回对应智能体修正，而不是让多个智能体直接抢写主分支。</p>
<p><strong>江中</strong>：目前是单智能体 + 固定流程，不是多智能体并发写；但同一会话用咨询锁串行，写操作幂等、状态不明不重放，这套原则是相通的。</p>
`,
      },
      {
        id: 'P96',
        group: 'langchain',
        title: '你了解过哪些 AI Agent 开发框架？',
        body: `
<p><strong>简要回答</strong></p>
<p>我重点了解过 LangChain、LangGraph 和 LlamaIndex。</p>
<p><strong>LangChain</strong>：提供模型、Prompt、工具、Agent 和中间件等通用抽象，集成范围比较广，适合快速构建工具调用、RAG、SQL 查询等 AI 应用。</p>
<p><strong>LangGraph</strong>：更偏底层的状态与流程编排。面对循环、分支、并行、断点恢复和人工审批等复杂流程时，可以用图结构显式控制 Agent 的执行路径。现在 LangChain 的 Agent 也运行在 LangGraph 之上，因此二者更多是上下层关系，而不是互相替代的竞争关系。</p>
<p><strong>LlamaIndex</strong>：优势集中在数据接入、文档解析、索引和检索，适合企业知识库、文档问答和复杂 RAG 等数据密集型应用。</p>
<p>除此之外，我也了解 <strong>OpenAI Agents SDK</strong> 和 <strong>CrewAI</strong>。前者适合以 OpenAI 模型为主的轻量 Agent，后者擅长使用角色和任务表达多 Agent 协作。不过在通用 Python Agent 开发岗位中，我会优先掌握 LangChain、LangGraph 和 LlamaIndex，再根据公司的技术栈补充其他框架。</p>
`,
      },
      {
        id: 'P97',
        group: 'langchain',
        title: '谈谈你对 LangChain 中核心概念「Chain」的理解，以及它的核心作用与设计理念。',
        body: `
<p><strong>简要回答</strong></p>
<p>Chain 是一种应用编排思路：把 Prompt、模型、检索器、输出解析器和自定义逻辑等步骤，按照明确的数据流连接起来，让上一步的输出成为下一步的输入，最终形成一个可以整体执行的流程。</p>
<p>在现在的 LangChain 里，Chain 最重要的技术基础是 <strong>Runnable</strong>。每个步骤都尽量遵守统一的输入输出和执行接口，再通过 LCEL 的 <code>|</code> 做串行组合，或者通过字典、<code>RunnableParallel</code> 做并行组合。</p>
<p>组合后的整条 Chain 本身仍然是 Runnable，所以可以继续嵌套，也能统一使用 <code>invoke</code>、<code>ainvoke</code>、<code>batch</code> 和 <code>stream</code> 等能力。</p>
<p>它的核心设计理念是「组合优于堆积封装」：开发者只关注每一步做什么、数据怎么流动，框架负责把执行方式、配置、重试、回退和追踪等通用能力接到整条流程上。</p>
<p><code>LLMChain</code>、<code>SequentialChain</code> 属于旧式 Chain API，LangChain v1 已把这类能力移入 <code>langchain-classic</code>，适合维护旧项目，不应再作为新项目的首选写法。</p>
<p><strong>选型</strong>：确定性的线性或分支流程可以用 Runnable 和 LCEL；Agent 让模型在运行时动态决定下一步；带循环、持久状态和人工审批的复杂工作流，则更适合用 LangGraph。</p>
`,
      },
      {
        id: 'P98',
        group: 'langchain',
        title: 'LangChain 的底层架构与实现原理是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>当前 LangChain v1 更像一套面向 Agent 的<strong>分层开发框架</strong>，而不只是将 Prompt 串起来的 Chain 工具。</p>
<p><strong>底层</strong>：<code>langchain-core</code> 定义 Message、Model、Tool 和 Runnable 等标准协议；不同模型厂商的独立集成包负责把自己的请求与响应适配到这些协议，因此应用层可以使用相对统一的方式切换模型和工具。</p>
<p><strong>执行层</strong>：Runnable 统一了组件的同步、异步、批处理和流式调用方式。对于步骤固定的流程，可以使用 LCEL 组合 Prompt、Model 和 Parser；对于需要模型自主选择工具的任务，则使用 <code>create_agent</code> 创建 Agent。</p>
<p><code>create_agent</code> 会把模型节点和工具节点编译成 LangGraph 状态图：模型读取消息后生成 <code>AIMessage</code>；如果其中包含 <code>tool_calls</code>，运行时执行对应工具，并把结果包装成带相同调用 ID 的 <code>ToolMessage</code> 写回状态；模型再次读取工具结果并继续判断，直到生成最终回答。</p>
<p>在这套架构中，<strong>State</strong> 保存会变化的消息与业务状态，<strong>Runtime</strong> 提供可信上下文和长期 <strong>Store</strong>，<strong>Middleware</strong> 负责在模型或工具调用前后加入权限、重试、摘要与人工审批，<strong>LangGraph</strong> 则负责路由、检查点、暂停恢复和长时间运行。</p>
<p>一句话总结：<strong>LangChain 用标准协议统一组件，用 <code>create_agent</code> 提供高层 Agent 入口，再由 LangGraph 承担有状态的执行运行时。</strong></p>
`,
      },
      {
        id: 'P99',
        group: 'langchain',
        title: '使用 LangChain 构建 Agent 的核心步骤是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>我通常分七步构建 LangChain Agent。</p>
<ol>
<li><strong>明确任务边界</strong>：包括 Agent 能做什么、不能做什么、何时结束，以及什么结果算成功。</li>
<li><strong>选模型、封装工具</strong>：选择支持所需工具调用和结构化输出能力的模型，并把数据库、搜索和业务 API 封装为职责单一、Schema 清晰的 Tools。</li>
<li><strong>写约束</strong>：使用 <code>system_prompt</code> 约束角色、工具使用规则和失败策略；如果结果还要交给程序处理，则使用 <code>response_format</code> 定义结构化输出。</li>
<li><strong>组装 Agent</strong>：通过 <code>create_agent</code> 组装模型、工具、提示词和输出格式。它底层使用 LangGraph，在模型判断、工具执行和工具结果回传之间循环。</li>
<li><strong>补状态与安全能力</strong>：使用 Checkpointer 按 <code>thread_id</code> 保存当前线程状态，使用 Store 管理跨线程信息，通过 Middleware 添加重试、摘要、权限控制和人工审批。</li>
<li><strong>定调用策略</strong>：根据场景选择同步、异步或流式调用，并设置超时、并发和取消策略。</li>
<li><strong>分层测试</strong>：先单测 Tool，再测试 Agent 的工具选择与调用轨迹，最后通过 Trace 观察模型调用、工具参数、耗时、Token 和异常。</li>
</ol>
`,
      },
      {
        id: 'P100',
        group: 'langchain',
        title: '在 LangChain 中，如何为 Agent 注册工具？',
        body: `
<p><strong>简要回答</strong></p>
<p>LangChain 中注册 Tool 的本质，是同时向模型提供一份工具说明，并向运行时提供一个真正可执行的函数。工具说明主要包含名称、用途和参数 Schema，模型根据它选择工具并生成参数，LangChain 再执行对应函数。</p>
<p>在 TypeScript 里最常用的实现方式有四种。</p>
<ol>
<li><strong>已有函数用 <code>tool()</code> 包装</strong>：函数负责执行，配置对象里补名称、描述和 zod Schema。</li>
<li><strong>大多数业务工具也用 <code>tool()</code></strong>：它相当于 Python 里的 <code>@tool</code>，参数校验交给 zod。</li>
<li><strong>运行时组装 Schema 或函数时</strong>：使用 <code>DynamicStructuredTool</code>。</li>
<li><strong>需要封装客户端、维护资源或定制执行过程时</strong>：继承 <code>BaseTool</code>。</li>
</ol>
<pre><code class="language-ts">import { tool, DynamicStructuredTool, BaseTool } from "@langchain/core/tools";
import { z } from "zod";

// 1. 已有函数：用 tool() 补名称、描述和参数 Schema
const getWeather = tool(
  async ({ city }) => {
    const url = "https://api.example.com/weather?city=" + encodeURIComponent(city);
    const res = await fetch(url);
    return await res.text();
  },
  {
    name: "get_weather",
    description: "查询指定城市的实时天气。用户问天气时调用。",
    schema: z.object({
      city: z.string().describe("城市名，例如 北京"),
    }),
  },
);

// 2. 业务工具：同样用 tool()，描述写清什么时候用、什么时候别用
const lookupOrder = tool(
  async ({ orderId }, config) => {
    // 注意：userId 不在 Schema 里，由运行时的可信配置注入
    const userId = config?.configurable?.userId;
    return JSON.stringify({ orderId, userId, status: "paid" });
  },
  {
    name: "lookup_order",
    description: "按订单号查询当前用户的订单状态。只有用户明确给出订单号时调用。",
    schema: z.object({
      orderId: z.string().describe("订单号，例如 A1001"),
    }),
  },
);

// 3. 运行时组装：用 DynamicStructuredTool
const dynamicTool = new DynamicStructuredTool({
  name: "search_docs",
  description: "在企业知识库中检索文档",
  schema: z.object({ query: z.string() }),
  func: async ({ query }, config) => {
    const tenantId = config?.configurable?.tenantId;
    return JSON.stringify({ query, tenantId, hits: [] });
  },
});

// 4. 维护客户端或资源：继承 BaseTool
class SearchDocsTool extends BaseTool {
  name = "search_docs_v2";
  description = "在企业知识库中检索文档（复用长连接客户端）";
  schema = z.object({ query: z.string() });

  async _call(input) {
    return JSON.stringify(await searchDocs(input.query));
  }
}
</code></pre>
<p><strong>注册和调用</strong>：LangChain v1 中通常通过 <code>createAgent({ model, tools: [...] })</code> 完成注册。城市、关键词、订单号这类任务参数可以让模型填写；用户 ID、租户、权限和存储对象等可信参数，应通过运行时上下文或 <code>configurable</code> 注入，不能暴露给模型。</p>
<pre><code class="language-ts">import { createAgent } from "langchain";

const agent = createAgent({
  model,
  tools: [getWeather, lookupOrder, dynamicTool, new SearchDocsTool()],
});

await agent.invoke(
  { messages: [{ role: "user", content: "帮我查下订单 A1001" }] },
  { configurable: { userId: "u_123", tenantId: "t_01" } },
);
</code></pre>
<p>生产环境还要关注参数校验、权限检查、超时、重试、幂等和错误分类。只有网络超时等临时故障适合自动重试；参数错误和业务拒绝应返回清楚的信息，程序 Bug 则不应该被统一吞掉。</p>
`,
      },
      {
        id: 'P101',
        group: 'langchain',
        title: 'LangChain 如何实现短期记忆和长期记忆？',
        body: `
<p><strong>简要回答</strong></p>
<p>在 LangChain v1 中，可以用一句话区分两类记忆：</p>
<pre><code class="language-text">短期记忆 = State + thread_id + Checkpointer
长期记忆 = namespace/key + Store</code></pre>
<p><strong>短期记忆属于当前会话线程</strong>。Agent State 保存消息、当前步骤和中间结果；Checkpointer 按 <code>thread_id</code> 保存状态快照。使用同一个 <code>thread_id</code> 再次调用时，可以恢复前面的对话和执行状态。</p>
<p><strong>长期记忆不应该绑定某个线程，而是保存到 Store</strong>。Store 使用 <code>namespace</code> 和 <code>key</code> 组织数据，namespace 通常包含租户、用户和记忆类型。即使用户新建了线程，只要使用相同的可信用户身份和 namespace，仍然可以读取以前保存的偏好或经验。</p>
<p>工具可以通过 <code>ToolRuntime</code> 读取当前 State、可信 Context 和长期 Store。用户 ID、租户和权限应由应用运行时注入，不能让模型自己填写。</p>
<p>长对话还需要控制上下文：<strong>裁剪</strong>只减少本次模型输入，<strong>删除</strong>会真正移除持久状态，<strong>摘要</strong>则用更短文本保留主要语义。生产环境要使用数据库型 Checkpointer 和 Store，并做好租户隔离、写入幂等、记忆更正、过期删除、敏感信息保护和检索评测。</p>
`,
      },
      {
        id: 'P102',
        group: 'langchain',
        title: 'LangChain 和 LlamaIndex 有什么区别？',
        body: `
<p><strong>简要回答</strong></p>
<p>LangChain 和 LlamaIndex 现在都能构建 Agent、调用工具和实现 RAG，但它们的默认入口与优势重心不同。</p>
<p><strong>LangChain</strong> 更偏通用 Agent 组装。它统一模型、消息、工具、结构化输出和中间件等接口，适合快速连接不同模型供应商、业务 API 和外部工具。当前 LangChain Agent 底层运行在 LangGraph 之上，需要复杂状态、暂停恢复和人工审批时，可以进一步使用 LangGraph 编排。</p>
<p><strong>LlamaIndex</strong> 更偏数据与上下文增强。它在数据接入、文档解析、切分、索引、检索、重排和 Query Engine 等环节积累更深，适合企业知识库、复杂文档问答和数据密集型 Agent。它也提供 Agent 和 Workflow，因此不能简单说它只能做 RAG。</p>
<p><strong>选型时看项目的主要难点</strong>：如果难点是模型与工具集成，优先评估 LangChain；如果难点是私有数据处理和检索质量，优先评估 LlamaIndex；如果两边都复杂，可以让 LlamaIndex 负责数据层，把检索能力封装成 Tool，再由 LangChain Agent 或 LangGraph 调度。</p>
`,
      },
      {
        id: 'P103',
        group: 'langchain',
        title: '谈谈 LangChain Node 生态的衍生框架，主要帮开发者解决了哪些核心问题？适用场景是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>LangChain.js 是 LangChain 官方的 TypeScript / JavaScript 实现，不是第三方移植版；它和 Python 版共享同一套设计思路，但包结构、类型和运行方式都按 Node 生态重新组织。在它之上，还有 LlamaIndex.TS、Vercel AI SDK、Mastra 等框架，各自侧重点不同。</p>
<p><strong>它主要解决三类问题</strong>：</p>
<ol>
<li><strong>供应商 API 不统一</strong>：通过 <code>ChatModel</code>、<code>Embeddings</code>、<code>VectorStore</code> 等接口，把常见模型和向量库接到相对一致的 TypeScript API 上；厂商适配放在 <code>@langchain/openai</code>、<code>@langchain/anthropic</code>、<code>@langchain/community</code> 这类独立包里。</li>
<li><strong>LLM 应用的胶水代码太多</strong>：用 Runnable 和 LCEL 组合 Prompt、模型、解析器、检索和工具；用 zod 定义工具参数和结构化输出；RAG 的加载、切分、索引和检索也有现成封装，不用每个项目重写一遍。</li>
<li><strong>Node 工程接入成本</strong>：类型贯穿前后端，能直接跑在 Node、Next.js、Serverless 和 Edge Runtime 里；流式输出用异步迭代器对接 SSE，配合 npm 生态、现有鉴权、配置、测试和监控体系，不用为了 AI 能力单独维护一套 Python 服务。</li>
</ol>
<p><strong>核心适用场景</strong>：已有 Node / TypeScript 技术栈，要做企业知识库问答、智能客服、文档抽取、内容生成，或者让模型调用现有 Node 服务；尤其是 Next.js / Nuxt 这类全栈项目，希望前后端统一语言、统一类型、统一部署。</p>
<p><strong>成本与边界</strong>：模型切换依然有成本，不同厂商的工具调用、JSON Schema、多模态和流式能力各有差异；Checkpointer 和 Memory 只保留当前需要的上下文，不等于完整聊天记录；复杂长事务还是要交给业务系统、LangGraph 或专门的编排层处理。另外，官方部分模块仍带 beta 标记，选型时要看模块成熟度。</p>
<p><strong>和同类框架比较</strong>：如果主要需求是把多个模型的对话流式接到前端，Vercel AI SDK 更轻；如果要 RAG、工具调用、Agent 和复杂组合，LangChain.js 更全；LlamaIndex.TS 更偏数据接入和检索；Mastra 更偏 TypeScript 的 Agent 工作流编排。</p>
`,
      },
      {
        id: 'P104',
        group: 'langchain',
        title: '详细说说 LangChain 和 LangGraph 的核心区别是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>LangChain 和 LangGraph 处在不同的抽象层。按照当前官方定位，<strong>LangChain v1 是高层 Agent 开发框架</strong>，负责提供模型、工具、结构化输出和 middleware 等常用能力；<strong>LangGraph 则是低层的 Agent 编排框架与运行时</strong>，让开发者直接设计状态、节点、路由、并行、中断和恢复。</p>
<p>两者最关键的关系是：LangChain v1 的 <code>create_agent</code> 构建在 LangGraph 之上，返回一个编译后的图。也就是说，LangChain Agent 不是脱离 LangGraph 运行的另一套引擎，它已经继承了 LangGraph 的状态、持久化、流式输出、durable execution 和 human-in-the-loop 等运行能力。</p>
<p><strong>区别在于开发者控制哪一层</strong>：</p>
<ul>
<li>如果是常见的「模型判断 → 调用工具 → 返回模型」循环，我会优先用 LangChain，再借助 middleware 做提示词、重试、护栏和审批等定制。</li>
<li>如果业务需要显式控制多个阶段，让确定性步骤与 Agent 步骤混排，或者要处理复杂并行、长期暂停和多 Agent 协作，我会直接用 LangGraph。<code>create_agent</code> 生成的 Agent 仍然可以作为图中的节点或子图复用。</li>
</ul>
<p>一句话总结：<strong>LangChain 帮我快速得到一个好用的 Agent，LangGraph 帮我精确控制整个 Agent 系统怎么运行。</strong></p>
`,
      },
      {
        id: 'P105',
        group: 'langchain',
        title: 'LangGraph 相比于 LangChain 有哪些核心优势？更适配哪些 Agent 场景？',
        body: `
<p><strong>简要回答</strong></p>
<p>LangGraph 和 LangChain 不是互斥的两套 Agent 框架。LangChain v1 提供模型、工具、中间件和预构建 Agent loop，<code>create_agent</code> 本身就运行在 LangGraph 上；LangGraph 是更低层的编排框架与运行时，让开发者直接控制 State、节点、边、路由、并行、子图、中断和恢复。</p>
<p>LangGraph 把复杂 Agent 的运行过程变成<strong>显式、可持久化、可观察、可恢复的业务状态机</strong>，这才是它的核心优势。</p>
<p>我们既可以用 <code>StateGraph</code> 声明拓扑和共享状态，也可以用 Functional API 在普通 Python 控制流上增加检查点与恢复能力。</p>
<p><strong>这些场景优势最明显</strong>：任务会持续很久、必须人工审批、要从故障点继续，或者需要并行研究与多 Agent 协作。</p>
<p>具体能力上：Checkpointer 保存线程内状态快照，Store 保存跨线程长期记忆；<code>interrupt()</code> 可以暂停任意业务节点；时间旅行可以从旧 checkpoint 重放或分叉；节点级容错则让失败路径也能被建模。</p>
<p>如果需求只是常见的「模型选择工具 → 调用工具 → 返回模型」循环，我会优先使用 LangChain <code>create_agent</code>，再用 middleware 完成提示词、重试、护栏和审批等定制。</p>
<p>只有当业务拓扑、恢复边界或多角色协作成为主要复杂度时，我才直接使用 LangGraph，也常把 LangChain Agent 作为图中的节点或子图复用。</p>
`,
      },
      {
        id: 'P106',
        group: 'langchain',
        title: 'LangChain 大版本升级有哪些核心变化？',
        body: `
<p><strong>简要回答</strong></p>
<p>LangChain 的版本演进可以抓住四条主线。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>主线</th><th>以前</th><th>现在（v1）</th><th>解决什么问题</th></tr>
</thead>
<tbody>
<tr><td>核心与集成拆分</td><td>模型、工具、Chain 等混在主包里</td><td>稳定的消息、模型、Tool、Runnable 协议放进 <code>langchain-core</code>；第三方模型与向量库迁到 <code>langchain-community</code> 或独立集成包</td><td>避免厂商 SDK 的频繁变化影响核心框架</td></tr>
<tr><td>统一组件调用</td><td>靠不断继承新的 Chain 类实现流程</td><td>Runnable 和 LCEL 统一 <code>invoke</code>、<code>batch</code>、<code>stream</code> 和异步接口，确定性流程通过组合实现</td><td>接口一致，少写重复的 Chain 子类</td></tr>
<tr><td>Agent 运行时</td><td>传统 Agent 执行器，适合简单循环</td><td>执行过程显式表示为状态图，由 LangGraph 作为底层运行基础</td><td>复杂状态、分支、暂停恢复和人工审批</td></tr>
<tr><td>v1 聚焦 Agent</td><td>以 Chain 为中心</td><td><code>create_agent</code> 成为高层入口，middleware 负责动态提示词、工具控制、摘要、重试和人工介入；旧 Chain 等接口进入 <code>langchain-classic</code></td><td>聚焦 Agent，同时兼容旧项目</td></tr>
</tbody>
</table>
</div>
<p>这些变化都指向同一个方向：<strong>稳定核心抽象、解耦第三方集成、统一组合协议，并把复杂 Agent 交给可持久化、可恢复的图运行时</strong>。</p>
`,
      },
      {
        id: 'P107',
        group: 'langchain',
        title: 'Deep Research 的实现逻辑和适用场景是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>Deep Research 不是 LangChain 核心包里的一个固定开关，而是一类面向开放问题的<strong>研究型 Agent 架构</strong>。LangChain 团队提供了 <code>open_deep_research</code> 参考实现，也提供了更通用的 Deep Agents SDK；前者是具体研究应用，后者是通用 Agent 开发框架，不能混为一谈。</p>
<p><strong>核心流程</strong>：</p>
<ol>
<li>先澄清用户目标并生成 Research Brief；</li>
<li>再由 Supervisor 把问题拆成相对独立的子课题；</li>
<li>多个 Researcher 在隔离上下文中并行检索，并对来源进行筛选和压缩；</li>
<li>Supervisor 检查证据是否覆盖研究目标，发现空白就继续补搜；</li>
<li>最后由统一的写作阶段综合证据并生成带引用的报告。</li>
</ol>
<p><strong>这种架构的价值不只是并行加速</strong>：子 Agent 可以隔离不同主题的上下文，避免大量搜索结果互相干扰；Supervisor 可以根据中间证据动态调整方向；统一写作则能减少章节重复和口径冲突。</p>
<p><strong>适用场景</strong>：竞品分析、技术调研、文献综述和供应商尽调等开放式、多来源、可拆分的任务。不适合一次搜索就能回答的简单事实，也不适合子任务高度依赖的强耦合工作。</p>
<p><strong>生产环境</strong>必须限制并发、迭代、Token 和搜索预算，并对网页提示词注入、来源可信度和高风险结论进行人工复核。</p>
`,
      },
      {
        id: 'P13',
        group: 'langchain',
        title: '工程实践中，为什么有时候选择「手搓」Agent，而不是直接用成熟框架？',
        body: `
<p><strong>简要回答</strong></p>
<p>框架用起来快，但实际有三个痛点：一是抽象层太多，调试时不知道哪步出问题，得一层层往下扒；二是版本升级经常有破坏性变更，线上稳定性难保证；三是框架的通用设计和具体业务有偏差，定制起来反而更费劲。</p>
<p>手搓的代码完全在自己掌控之内，可观测性好、出问题好排查，也更方便做性能优化。所以策略是：<strong>核心逻辑手写，边缘功能用框架的工具。</strong></p>
<p><strong>江中也是这个思路</strong>：编排用 LangGraph，计划编译、工具校验、审批幂等、场景回执这些核心边界自己写，不把控制权交给框架。</p>
`,
      },
      {
        id: 'P14',
        group: 'agent',
        title: '如何赋予 LLM 规划能力？',
        body: `
<p><strong>简要回答</strong></p>
<p>给大模型加规划能力，主要靠这几种思路：</p>
<ul>
<li><strong>CoT</strong>：让模型把推理步骤写出来，线性地一步步推导到答案。</li>
<li><strong>ToT</strong>：同时探索多条推理路径，选最优的继续深入。</li>
<li><strong>GoT</strong>：图结构推理，推理节点可以复用和合并，适合更复杂的任务。</li>
</ul>
<p><strong>工程选择</strong>：我用 CoT 最多，因为实现成本最低，改个提示词就行；ToT 效果更好，但调用次数多，成本大概是 3 到 5 倍；GoT 目前还比较学术，生产环境我没见过真正落地的。</p>
<p><strong>项目里</strong>：规划用提示词 + 计划执行器落地，模型负责拆步骤，程序负责校验、限步和执行。</p>
`,
      },
      {
        id: 'P15',
        group: 'agent',
        title: '讲讲 Agent 的反思机制？为什么要用反思？具体怎么实现？',
        body: `
<p><strong>简要回答</strong></p>
<p>反思机制是让智能体在完成一个步骤或整个任务后，自我评估输出质量，判断有没有问题；不达标就重试或调整策略。</p>
<p><strong>为什么要用</strong>：大模型第一次输出不一定最优，加一轮自我检查能明显提升质量，相当于人写完东西自己再看一遍。</p>
<p><strong>怎么实现</strong>：生成 → 按评分标准 / 证据 / 测试用例批判 → 修订或重试；设置最大轮次，保留最好版本，没提升就停。</p>
<p><strong>代价</strong>：至少多一次大模型调用，token 和延迟都会增加；所以只在质量要求高的关键节点启用，不是每步都做。江中目前把这类检查放在离线评测和审阅，不在线每步跑。</p>
`,
      },
      {
        id: 'P73',
        group: 'llm-eng',
        title: '什么是大语言模型？和传统 NLP 模型有什么区别？',
        body: `
<p><strong>简要回答</strong></p>
<p>大语言模型的本质，是一个用海量语料预训练、参数到百亿千亿规模、自回归生成文本的统一模型。它和传统 NLP 模型最根本的区别有三点。</p>
<ol>
<li><strong>一任务一模型 vs 一个模型干所有事</strong>：传统 NLP 的分词、命名实体识别、情感分析、问答各训各的，每个模型只会干自己那点事；LLM 在预训练阶段学的是「预测下一个 token」这件最通用的事，下游任务用 Prompt 表达就行，不用再分别训练。</li>
<li><strong>判别式 vs 生成式</strong>：传统 NLP 模型吃一段文本输出一个标签或概率；LLM 是生成式的，吃一段文本输出更多文本，理解和生成在同一个模型里完成。</li>
<li><strong>规模涌现</strong>：规模到一定程度，LLM 会「涌现」出训练目标里没有显式教过的能力，比如多步推理、上下文学习、跨语言迁移，这种「量变到质变」的现象在传统 NLP 模型上看不到。</li>
</ol>
`,
      },
      {
        id: 'P74',
        group: 'llm-eng',
        title: '讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>Transformer 最核心的创新是 <strong>Self-Attention</strong>，让每个 token 都能直接和序列里任意其他位置建立联系，一次性并行计算，彻底解决了 RNN 顺序计算慢、长距离信息衰减这两个老问题。</p>
<p>理解 Encoder 和 Decoder 的区别时，可以看方向：<strong>Encoder 是双向的</strong>，每个词能同时看前后文，适合做「理解」类任务；<strong>Decoder 是单向的</strong>，只能看前面的词，天然适合「生成」类任务。</p>
<p>现代大模型（GPT、Claude、Qwen）都选 Decoder-only，核心原因是「预测下一个 token」这个训练目标极其统一，可以直接在海量无标注文本上做自监督学习，规模越大，涌现出的能力越强。</p>
`,
      },
      {
        id: 'P75',
        group: 'llm-eng',
        title: '多头注意力（MHA）有哪些局限？MQA、GQA、Flash Attention 怎么解决？',
        body: `
<p><strong>简要回答</strong></p>
<p>MHA 有三个核心痛点。</p>
<ol>
<li><strong>显存爆炸</strong>：推理时每个 head 都要为序列里所有 token 保存自己的 K 和 V 矩阵，这就是 KV Cache。头数越多、序列越长，显存占用越夸张。一个 7B 模型跑 32K 上下文，光 KV Cache 就能吃掉十几 GB。</li>
<li><strong>访存慢</strong>：Attention 计算里 softmax 那步要把整个 N×N 的注意力矩阵搬来搬去，频繁读写 GPU 显存，瓶颈不在算力而在「内存带宽」。</li>
<li><strong>N² 复杂度</strong>：注意力分数矩阵是 N×N 的，序列翻倍计算量翻 4 倍，长上下文极其昂贵。</li>
</ol>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>方案</th><th>层次</th><th>做法与效果</th></tr>
</thead>
<tbody>
<tr><td>MQA</td><td>结构层</td><td>所有 head 共享一份 K/V，显存压到 1/H，但表达能力损失明显</td></tr>
<tr><td>GQA</td><td>结构层</td><td>把 H 个 head 分成 G 组，每组共享一份 K/V；效果接近 MHA，显存接近 MQA。Llama 2 70B、Llama 3、Qwen 2/3 的不少主力模型都用这个思路</td></tr>
<tr><td>Flash Attention</td><td>实现层</td><td>不改变 MHA 结构，把 N×N 的注意力矩阵切成小块，用 GPU 片上缓存做在线 softmax，避免反复读写大矩阵；显存从 O(N²) 降到 O(N)，速度还更快</td></tr>
</tbody>
</table>
</div>
<p>最关键的认知是：<strong>MQA/GQA 是「结构层」的优化，Flash Attention 是「实现层」的优化</strong>，两者是叠加关系，不冲突。现在的主流模型基本上都是 GQA + Flash Attention 一起用。</p>
`,
      },
      {
        id: 'P76',
        group: 'llm-eng',
        title: '大模型的位置编码是干什么用的？sin/cos、RoPE、ALiBi 有什么区别？',
        body: `
<p><strong>简要回答</strong></p>
<p>位置编码要解决的是 Self-Attention 的「位置盲」缺陷。Attention 的计算是对称的，不管词序怎么变，注意力分数都一样，「我打你」和「你打我」对模型来说是一回事，所以必须显式注入位置信息。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>方案</th><th>做法</th><th>优缺点</th></tr>
</thead>
<tbody>
<tr><td>sin/cos 绝对位置编码</td><td>原始 Transformer 用的：给每个位置算一组固定的 sin/cos 值，加到 token embedding 上</td><td>简单、不需要训练参数；但「绝对位置」太死板，模型实际关心的是「相对距离」；训练时见过的最长位置之外（比如训练 2K、推理上 4K）效果断崖下跌</td></tr>
<tr><td>RoPE 旋转位置编码</td><td>不往 embedding 上「加」，而是「旋转」Q 和 K 向量；每个位置对应一个旋转角度，位置越靠后角度越大，两个 token 做注意力时，Q/K 的点积自然带上了「相对距离」</td><td>相对位置直接编进点积里，长上下文的泛化能力强；配合 NTK、YaRN 等扩展技巧和必要的继续训练或校准，能把上下文推得更长。Llama、Qwen、DeepSeek 等主流开源模型大量使用</td></tr>
<tr><td>ALiBi</td><td>最简单粗暴：直接在注意力分数里加一个「距离惩罚」，离得越远扣分越多，斜率随 head 不同</td><td>不引入可学习参数，长上下文外推天然较好；但表达能力弱一些，对位置的精细建模不如 RoPE。MosaicML 的 MPT、BLOOM 用过，但没成主流</td></tr>
</tbody>
</table>
</div>
<p>最关键的一句话是：<strong>主流大模型几乎全部选择了 RoPE</strong>，因为它在「相对位置编码 + 长上下文外推 + 兼容现代推理优化」三个维度上都最均衡。</p>
`,
      },
      {
        id: 'P77',
        group: 'llm-eng',
        title: '什么是大模型的分词器？原理是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>面试被问到 Tokenizer，最重要的是先说清楚「为什么需要它」：<strong>模型只能处理整数，不认识字符串</strong>，Tokenizer 就是把文字转成数字 ID 序列的桥梁。</p>
<p><strong>原理</strong>：主流路线都是子词分词（subword），常见实现有 BPE、SentencePiece / Unigram、WordPiece 等。BPE 的直觉是从小单元出发，反复把出现频率最高的相邻片段合并成新 token，最终形成一个几万到十几万规模的词汇表，既能控制大小又能处理新词。</p>
<p><strong>实际开发要注意</strong>：API 按 token 计费而不是按字数；1000 个汉字大概对应 1000 到 1500 个 token，但具体比例和模型的 tokenizer 强相关，估算成本和上下文窗口用量都要用真实 tokenizer 来算。</p>
`,
      },
      {
        id: 'P78',
        group: 'llm-eng',
        title: '大模型是怎么训练出来的？',
        body: `
<p><strong>简要回答</strong></p>
<p>大模型训练分三个阶段，每个阶段解决不同层次的问题，可以用一个类比来记。</p>
<ol>
<li><strong>预训练</strong>：像一个人从小到大读了海量的书，积累语言能力和世界知识；训练目标就是「预测下一个词」，简单但威力巨大。</li>
<li><strong>SFT</strong>：给这个博学的人做面试培训，让他学会把知识转化成有问有答的对话形式，而不是一直续写文章。</li>
<li><strong>对齐</strong>：做职业素养培训，用 RLHF 或 DPO 让回答方式更符合人类偏好、更安全。</li>
</ol>
<p>三个阶段缺一不可：<strong>预训练决定能力天花板，SFT 给格式，对齐给价值观</strong>，这是目前所有主流大模型训练的基本框架。</p>
`,
      },
      {
        id: 'P79',
        group: 'llm-eng',
        title: '什么是 Scaling Law？大模型的「涌现能力」是怎么回事？',
        body: `
<p><strong>简要回答</strong></p>
<p>Scaling Law（缩放定律）讲的是大模型的损失值如何随<strong>模型规模、训练数据量、训练算力</strong>这三个量变化的可预测关系。OpenAI 在 2020 年提出，DeepMind 在 2022 年的 Chinchilla 论文里做了精修。核心发现有三个。</p>
<ol>
<li><strong>损失值随这三个量按幂律下降</strong>（loss ∝ N<sup>-α</sup>，N 是规模），意思是规模翻倍，损失值可按可预测的比例下降，没有「饱和点」。</li>
<li><strong>参数和数据要按一定比例配</strong>。Chinchilla 给出的最优比例是 <strong>1:20</strong>（每个参数配 20 tokens）。GPT-3 175B 用 300B tokens 属于「严重欠训」，比例只有 1:1.7；DeepMind 训了一个 70B 模型配 1.4T tokens（1:20），反而超过了 GPT-3 和自家更大的 280B Gopher。</li>
<li><strong>1:20 不是数据上限</strong>。Llama 3 这类后续模型用了远高于 1:20 的训练 token，效果继续提升。更准确地说，Chinchilla 的 1:20 是「固定训练算力下的 compute-optimal 配比」，不是「数据再多就一定没用」的上限。后来的小模型大量喂数据，很多时候是在用更多训练计算换更低的推理成本。</li>
</ol>
<p><strong>涌现能力（Emergent Abilities）</strong>是 Scaling Law 的一个特殊副产品。当模型规模超过某个临界值（典型是 50B–100B 参数），某些能力会从「完全不能」突变到「能做」：多步推理、上下文学习、跨语言迁移、代码理解等。</p>
<p>但要注意，2023 年斯坦福的 Mirage 论文挑战了「涌现」的定义，认为很多涌现现象只是「评估指标的不连续性」造成的测量假象，换成连续指标后曲线就平滑了。学术争议还在继续，但工程层面，模型规模带来的能力跃迁是客观存在的。</p>
<p><strong>对工程选型的启发</strong>：不是越大越好，要看「参数 × 数据 × 算力」三者的最优搭配；数据规模可能比参数规模更值得加大（Llama 3 8B 用 15T tokens 跑赢 GPT-3 175B 就是例证）；同样算力下，按 Chinchilla 比例训出来的小模型，可能比胡乱堆参数的大模型还强。</p>
`,
      },
      {
        id: 'P80',
        group: 'llm-eng',
        title: '大模型微调的方案有哪些？',
        body: `
<p><strong>简要回答</strong></p>
<p>先明确一个认知：<strong>微调不是首选，而是最后手段</strong>。大多数问题先把 Prompt 写好、加 Few-shot 示例，或者用 RAG 接外部知识，基本都能解决。</p>
<p><strong>真正需要微调的场景</strong>：模型需要以特定风格持续输出；需要学会稳定的任务格式；或者需要大幅降低成本，用小模型替代大模型。</p>
<p><strong>方案上</strong>：</p>
<ul>
<li><strong>LoRA / QLoRA</strong> 是最常用的：只训练一小部分参数，普通 GPU 上就能跑，不需要全量更新所有权重。</li>
<li><strong>SFT</strong> 是微调的目标形式，让模型从续写模式变成指令回答模式。</li>
<li><strong>DPO</strong> 用于偏好对齐，比 RLHF 简单得多，效果也不差。</li>
</ul>
<p>选模型不是看谁排行榜最高，选微调方案也是同理，核心是看<strong>资源约束和实际需求</strong>。</p>
`,
      },
      {
        id: 'P81',
        group: 'llm-eng',
        title: '请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？',
        body: `
<p><strong>简要回答</strong></p>
<p>LoRA 我在项目里用过，省参数这个优点大家都知道，但它还有几个很实用的好处。</p>
<ul>
<li><strong>推理零开销</strong>：训练完之后，LoRA 的 A、B 两个小矩阵可以直接合并回原始权重，推理阶段完全不需要带额外模块，速度和原始模型一样，这比 Adapter 方案有明显优势。</li>
<li><strong>部署特别灵活</strong>：一个 7B 基础模型才 14GB，每套 LoRA 只有几十 MB，可以同时维护客服、代码、翻译几套 LoRA，按请求类型热切换，不需要为每个场景各跑一个完整模型。</li>
<li><strong>灾难性遗忘风险更低</strong>：原始权重全程冻结，只有旁路的小矩阵在学习，相当于在原来知识旁边打补丁，通用能力通常更容易保住。</li>
<li><strong>训练更稳定</strong>：可训练参数少，梯度空间小，对学习率这类超参不那么敏感，调参成本低。</li>
<li><strong>多个 LoRA 可以加权混合</strong>：比如把指令遵循 LoRA 和代码 LoRA 合并一下，不用重新训练就能融合两种能力。</li>
</ul>
`,
      },
      {
        id: 'P82',
        group: 'llm-eng',
        title: 'SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒绝采样什么关系？',
        body: `
<p><strong>简要回答</strong></p>
<p>Post-Training 是个上位概念，指的是 SFT 之后所有继续提升模型质量的训练阶段，它不是单一方法，而是一族方法的总称。</p>
<p>SFT 让模型学会「按指令格式回答」，但 SFT 后的模型还有两个问题没解决：第一，回答可能有害、不符合人类价值观；第二，同一个问题的多种合格回答里，模型不知道哪个更受人类欢迎。这就是 Post-Training 要补的课。</p>
<p><strong>主流方法有五类</strong>：</p>
<ul>
<li><strong>RLHF</strong>：最经典的方案。先用人类对回答的排名训练一个奖励模型，再用 PPO 算法让大模型生成的回答尽量得高分；同时维护一个参考模型，用 KL 散度约束，防止主模型「钻空子」。优点是效果上限高，缺点是流程复杂、要同时维护 4 个模型、训练不稳定。</li>
<li><strong>DPO</strong>：RLHF 的简化版。核心洞见是 RLHF 的优化目标可以推导成一个等价的监督学习损失，绕过显式奖励模型，直接拿（提示、好回答、差回答）三元组训练。优点是只需 2 个模型、训练稳定、实现简单；缺点是效果上限依赖偏好数据质量，探索能力不如精心调过的 RL。很多开源 Instruct 模型会用 DPO 或其变体做偏好对齐，但公开论文里的关键对齐方法仍是拒绝采样和 PPO/RLHF。</li>
<li><strong>GRPO</strong>：DeepSeek 在 2024 年提出的 PPO 改进版。核心思路是砍掉 PPO 的 Value Model，改用「同一问题采样 G 个回答、用组内相对排名作为基线」来估计优势函数，省掉 Value Model 的训练成本，显存减半。DeepSeek R1、DeepSeek-Math、Qwen 系列推理模型都用 GRPO，是近两年最热的对齐方案之一。</li>
<li><strong>拒绝采样</strong>：简单粗暴。让模型对每个 Prompt 生成多个回答，用奖励模型筛出高分的，然后再做一轮 SFT。流程里没有 RL，就是「生成 → 筛选 → 再 SFT」循环，Llama 2 的对齐流程里就用了这个。</li>
<li><strong>RLAIF</strong>：用强 AI 模型代替人类标注偏好。Anthropic 的 Constitutional AI 是代表：先让模型按一套原则自我批评和修订，再由 AI 对多个回答做偏好判断，训练奖励模型或直接做偏好优化。好处是标注成本低、可规模化；风险是会继承标注模型的偏见，也更容易出现奖励黑客。</li>
</ul>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>方法</th><th>偏好从哪来</th><th>要不要奖励模型</th><th>一句话定位</th></tr>
</thead>
<tbody>
<tr><td>RLHF</td><td>人类排名</td><td>要，再跑 PPO</td><td>最经典的偏好优化，效果上限高但工程重</td></tr>
<tr><td>DPO</td><td>人类偏好对</td><td>不要</td><td>把 RLHF 化简成监督学习，稳定好实现</td></tr>
<tr><td>GRPO</td><td>规则或奖励模型打分</td><td>不要 Value Model</td><td>PPO 的省显存版，推理模型常用</td></tr>
<tr><td>拒绝采样</td><td>奖励模型筛选</td><td>用奖励模型做过滤</td><td>不跑 RL，生成、筛选、再 SFT</td></tr>
<tr><td>RLAIF</td><td>AI 判断</td><td>可用可不用</td><td>把人类反馈换成 AI 反馈，换的是反馈来源</td></tr>
</tbody>
</table>
</div>
<p><strong>它们的关系</strong>：SFT 教格式；RLHF 是最经典的偏好优化框架；DPO 是 RLHF 目标的等价简化；GRPO 是 PPO 去掉 Value Model 的改进；拒绝采样是「生成—筛选—再 SFT」的数据循环，不涉及 RL；RLAIF 改变的是反馈来源，可以和前面的优化方法组合使用。</p>
<p><strong>怎么选</strong>：有高质量人类偏好数据、追求效果上限，选 RLHF / PPO；数据量有限、想快速稳定落地，选 DPO；训练推理模型、需要大量采样和规则奖励，选 GRPO；只是想把现有数据利用好，拒绝采样最省事；人类标注贵或不可扩展，再考虑 RLAIF。</p>
`,
      },
      {
        id: 'P83',
        group: 'llm-eng',
        title: '大模型的 DPO 和 PPO 的区别是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>DPO 和 PPO 都是大模型对齐训练里的方法，都是在 SFT 之后让模型的输出更符合人类期望。</p>
<p><strong>PPO</strong> 是强化学习里的一个算法。在大模型里的用法是：先额外训练一个「奖励模型」来给模型的回答打分，然后用 PPO 这个 RL 算法不断调整大模型的参数，让它生成的内容往高分方向走。这套流程需要同时维护好几个模型，工程复杂度高，训练也容易不稳定，所以成本比较大。</p>
<p><strong>DPO</strong> 是后来提出的简化方案，它不需要单独训练奖励模型，直接拿「人类偏好对」数据——同一个问题的「好回答」和「差回答」——让模型直接学「应该更像哪个」。更准确地说，DPO 是从带 KL 约束的 RLHF 目标推导出来的一个闭式偏好优化目标，不是说它和任意 PPO 训练过程都完全等价。工程上可以把它理解成把复杂 RL 流程简化成监督学习问题，只需要两个模型，更稳定、更好实现。</p>
<p><strong>简单总结</strong>：PPO 是「先训练裁判、再训练选手」，DPO 是「直接拿比赛录像告诉选手哪个动作对、哪个动作错」。两者目标一致，但 DPO 省去了裁判这个中间层。</p>
`,
      },
      {
        id: 'P84',
        group: 'llm-eng',
        title: '大模型生成文本时的解码策略有哪些？贪心、Beam Search、采样分别什么时候用？',
        body: `
<p><strong>简要回答</strong></p>
<p>解码策略本质上回答一个问题：<strong>模型在每一步输出了一个 vocabulary 大小的概率分布，我们怎么从中选下一个 token？</strong>主流方案分两大类。</p>
<p><strong>第一类：确定性策略</strong>，输入相同，输出永远相同。</p>
<ul>
<li><strong>贪心解码</strong>：每一步选概率最高的 token。简单、可复现，但容易重复啰嗦、缺乏多样性。</li>
<li><strong>Beam Search</strong>：每一步保留 Top-B 条候选路径（B = 4、8 等），最后选总概率最高的整条序列。比贪心更接近全局最优，但对生成式任务有「天然缺陷」。</li>
</ul>
<p><strong>第二类：随机性策略</strong>，引入随机性让输出有多样性。</p>
<ul>
<li><strong>Temperature 采样</strong>：通过缩放概率分布的「锐度」控制随机性强度。Temperature 越低越确定，越高越发散。</li>
<li><strong>Top-K 采样</strong>：每步只从概率最高的 K 个 token 里采样，截断长尾。</li>
<li><strong>Top-P（Nucleus）采样</strong>：每步累加概率到 P 为止，从这个「核」里采样，自适应截断。</li>
</ul>
<p>两类的核心区别是：<strong>确定性策略保证质量但牺牲多样性；随机性策略保证多样性但每次输出不同</strong>。</p>
<p>LLM 工程实践里有个反直觉的现象：<strong>Beam Search 在大模型时代基本被弃用了</strong>。原因是它优化的是「整体序列概率最高」，但生成式任务（聊天、写作、推理）没有「单一最优答案」，Beam Search 给出的「最高概率序列」往往是「最 boring 的回答」，多样性差，还容易陷入复读循环。</p>
<p>所以现在的 LLM API 通常都会提供 Temperature + Top-P 这类采样参数，默认值各家不完全一样，有的默认更稳定，有的默认更开放。更稳的工程表达是：精确任务（代码、数学、信息抽取）用 Temperature = 0 或低温来提高可复现性；对话 / 创意任务用较高 Temperature 配合 Top-P 平衡多样性和质量。</p>
`,
      },
      {
        id: 'P85',
        group: 'llm-eng',
        title: '大模型的温度值、Top-P、Top-K 分别是什么？各场景下怎么设置？',
        body: `
<p><strong>简要回答</strong></p>
<p>我调这几个参数的经验是：<strong>Temperature 是最关键的，另外两个基本不用动</strong>。</p>
<ul>
<li><strong>Temperature</strong>：控制输出的随机性，越低越稳定可复现，越高越发散有创意。</li>
<li><strong>Top-P</strong>：从累计概率达到 P 的候选词里采样，比 Top-K 更灵活自适应。</li>
<li><strong>Top-K</strong>：固定从概率最高的 K 个词里选。</li>
</ul>
<p><strong>实践取值</strong>：</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>场景</th><th>Temperature</th></tr>
</thead>
<tbody>
<tr><td>代码生成、精确问答</td><td>0 ~ 0.2</td></tr>
<tr><td>日常对话</td><td>0.5 ~ 0.7</td></tr>
<tr><td>创意写作</td><td>0.8 ~ 1.2</td></tr>
</tbody>
</table>
</div>
<p>Top-P 和 Top-K 保持默认就好，同时调多个参数反而互相干扰。</p>
`,
      },
      {
        id: 'P86',
        group: 'llm-eng',
        title: 'KV Cache 是什么？Prompt Caching 的原理是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>KV Cache 和 Prompt Caching 是<strong>同一个机制在两个时间尺度上的应用</strong>。</p>
<p><strong>KV Cache 是「单次推理内」的优化</strong>。自回归生成时，每次生成新 token 都要让模型重新对前面所有 token 算 attention。如果每次都从零开始算，N 个 token 的总计算量是 O(N³)，根本不可接受。KV Cache 把前面所有 token 的 K 和 V 矩阵缓存在 GPU 显存里，每次新 token 只算自己的 Q、K、V，然后跟缓存的 K/V 做 attention，把总计算量从 O(N³) 降到 O(N²)。</p>
<p><strong>Prompt Caching 是「跨请求」的优化</strong>。把上面 KV Cache 的概念从「单次生成内」扩展到「不同请求之间」：如果两个请求的 Prompt 前缀完全相同（比如都用同样的 System Prompt），第一个请求算完的 KV Cache 在 API 服务器上保留下来，第二个请求遇到相同前缀直接跳过计算、复用已有 KV Cache，只算新增的部分。</p>
<p><strong>价值上的区别</strong>：</p>
<ul>
<li><strong>KV Cache</strong> 解决的是「让自回归生成可行」，是 Transformer 推理的基本盘。</li>
<li><strong>Prompt Caching</strong> 解决的是「降低 API 成本和延迟」，是工程层面的 ROI 优化。不同厂商的计费规则不一样，比如 Claude 的缓存读取价格可以低到普通输入 token 的 10%，OpenAI 等平台也有自己的缓存折扣；延迟收益也和前缀长度、命中率、服务端负载有关，不能死记一个固定比例。</li>
</ul>
<p>最关键的认知是：<strong>Prompt Caching 不是新发明，是 KV Cache 这个底层机制的工程级延伸</strong>。理解了 KV Cache，Prompt Caching 几乎是自然推论。</p>
<p>实际工程使用 Prompt Caching 的核心要点是：<strong>固定内容在前、动态内容在后</strong>，前缀只要差一个字符就缓存 miss。</p>
`,
      },
      {
        id: 'P87',
        group: 'llm-eng',
        title: '大模型量化是什么？INT8/INT4/AWQ/GPTQ 怎么选？',
        body: `
<p><strong>简要回答</strong></p>
<p>量化的本质，是把模型参数从「高精度浮点数」（FP32 或 FP16）映射到「低精度整数」（INT8 或 INT4），用更少的比特表示同样的信息。</p>
<p><strong>核心收益是显存和速度</strong>。一个 7B 模型 FP16 占 14GB，INT4 量化后只剩 4GB，显存压到 1/3.5；同时 INT4 计算比 FP16 快、访存压力也小，推理速度提升 2–4 倍。</p>
<p><strong>精度维度</strong>：FP16 → INT8 → INT4 → 更激进的 NF4 / FP8 等。位数越少越省，但精度损失越大。INT4 是当前的甜蜜点，效果接近 FP16，体积只有 1/4。</p>
<p><strong>算法维度</strong>：</p>
<ul>
<li><strong>GPTQ</strong>：基于「误差补偿」的逐层量化。每量化一层权重，用一小批校准数据测出量化误差，把误差补偿到下一层去。优点是数学严谨、支持 INT3 这种极端精度。</li>
<li><strong>AWQ</strong>：基于「激活感知」的权重保护。核心洞见是「不是所有权重都同样重要」，那些和激活值大的输入相关的权重更要保护好，其他的可以激进压缩。优点是推理速度快、效果稳。</li>
<li><strong>QLoRA 里的 NF4</strong>：NormalFloat 4-bit，专为权重的近高斯分布设计的非均匀量化，配合 LoRA 微调用，让 24GB 消费级显卡能微调 7B 模型。</li>
</ul>
<p><strong>怎么选</strong>：</p>
<ul>
<li>生产部署、看推理速度：优先评估 AWQ / GPTQ / FP8 / 框架原生 INT4，具体看 vLLM、SGLang、TensorRT-LLM 当前版本支持哪种 kernel，不能简单说某个框架默认就是 AWQ。</li>
<li>生产部署、追求最高精度：GPTQ INT4 或 FP16。</li>
<li>个人微调、消费级 GPU：QLoRA NF4。</li>
<li>极端压缩（边缘设备）：INT3 GPTQ 或 GGUF 的 Q4_K_M。</li>
</ul>
<p><strong>精度损失</strong>要看模型、任务和校准数据。一般经验是：FP16 → INT8 通常损失很小；INT4 是部署甜蜜点，但数学推理、长代码、长上下文任务可能更敏感，建议先跑自己的评测；INT2 就要非常谨慎，通常只适合极端压缩或边缘场景。</p>
`,
      },
      {
        id: 'P88',
        group: 'llm-eng',
        title: '如何写好 Prompt？分享下 Prompt 工程实践经验？',
        body: `
<p><strong>简要回答</strong></p>
<p>我在实际做项目时踩过不少坑，发现 Prompt 写不好通常不是因为太短，而是因为「模糊」，模型根本不知道你想要什么格式、什么风格、给谁看的。</p>
<p>后来总结下来，写好 Prompt 核心就是做好五件事：</p>
<ol>
<li>给模型设定角色；</li>
<li>说清楚任务；</li>
<li>交代背景上下文；</li>
<li>约定输出格式；</li>
<li>提供示例。</li>
</ol>
<p>其中格式约束是最容易忽略、但对程序解析影响最大的。而且 Prompt 不是写完就完了，我们项目里一定要建测试集，每次改动都跑一遍，才知道改好了还是改坏了。</p>
`,
      },
      {
        id: 'P89',
        group: 'llm-eng',
        title: '什么是 CoT？为什么效果好？它有什么缺点或局限性？',
        body: `
<p><strong>简要回答</strong></p>
<p>CoT 我第一次用是在做一个需要多步逻辑推理的任务，发现只要让模型先分步分析，效果提升就很明显。</p>
<p><strong>为什么有效</strong>：模型是一个 token 一个 token 生成的，让它先组织中间步骤，等于给了它「草稿纸」，后面生成答案时能利用前面的推理上下文，自然出错就少了。</p>
<p><strong>缺点</strong>也很实际：消耗的 token 会多很多，延迟和成本都上去了；而且推理链本身也可能出错，错误还会累积传导。</p>
<p><strong>我的经验</strong>：对需要多步推理的任务用 CoT，简单问答直接回答就好；对外产品里不一定展示完整 CoT，展示简要理由或核查步骤通常更合适。</p>
`,
      },
      {
        id: 'P90',
        group: 'llm-eng',
        title: '大模型为什么会出现幻觉？怎么缓解？',
        body: `
<p><strong>简要回答</strong></p>
<p>大模型的幻觉本质是：<strong>模型生成了听上去很合理但实际是错的内容</strong>。这是 LLM 的固有缺陷，不是某个 bug。</p>
<p>幻觉的根因可以归到三个层面。</p>
<ol>
<li><strong>训练数据层面</strong>：互联网语料本身就有错误、矛盾、过时的信息，模型把这些都「学进去」当作事实记忆。</li>
<li><strong>生成机制层面</strong>：LLM 本质是「按概率续写下一个 token」，不是「查询知识库」。模型对「自己知不知道某件事」没有显式信号，碰到不熟悉的问题，会按训练时见过的相似上下文「编一个看起来合理的答案」。这就是为什么 Temperature = 0 也会幻觉，因为概率最高的那条路径本身就是错的。</li>
<li><strong>对齐目标层面</strong>：SFT 和 RLHF 训练时，「自信地回答」往往比「我不知道」得分更高，模型被无形中训练成了「不会拒答」。</li>
</ol>
<p><strong>幻觉分三类</strong>：事实性幻觉（编造不存在的事实，把人物事件张冠李戴）、推理性幻觉（推理链条错乱、前后矛盾）、上下文不一致（违背用户给的明确条件）。</p>
<p><strong>缓解方案要分三层组合用</strong>：</p>
<ul>
<li><strong>训练层</strong>：对齐数据里专门加入「不知道就说不知道」的样例，做校准（Calibration）训练，让模型学会拒答。</li>
<li><strong>推理层</strong>：让模型先做必要的分步分析再答（最终可以只展示简要依据）、Temperature 调低减少随机偏差、Self-Consistency 多次采样投票（错误答案不一定容易收敛）、约束解码（限制只能输出特定 vocabulary）。</li>
<li><strong>系统层</strong>：RAG 接入外部知识库（让模型「看着资料答」而不是「凭记忆答」）、答案后处理核查、强制带引用来源。</li>
</ul>
<p>最关键的认知是：<strong>幻觉不可能完全消除</strong>，因为它是 LLM 概率生成机制的固有副产品。工程上的目标是「降低发生率 + 让用户能识别」，不是「彻底消除」。</p>
`,
      },
      {
        id: 'P91',
        group: 'llm-eng',
        title: 'MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？',
        body: `
<p><strong>简要回答</strong></p>
<p>MoE（Mixture of Experts，混合专家模型）的核心思想，是把传统 Transformer 中的 FFN（前馈网络）层替换成 N 个并行的「专家网络」，再加一个 Router 来决定每个 token 进哪个专家。</p>
<p><strong>核心设计哲学是「总参数大，但激活参数小」</strong>。比如 DeepSeek V3 总参数 671B，但每个 token 推理时只激活 37B（约 1/18）。这样能用「总参数 671B 的知识量」+「激活参数 37B 的推理成本」，达到 Dense 模型做不到的「学得多 + 跑得快」。</p>
<p>具体看 MoE 三个核心组件：</p>
<ol>
<li><strong>多个专家（Experts）</strong>：把 Transformer 每层的 FFN 复制 N 份（典型 N = 8、64、256），每份就是一个独立的「专家」，在训练中各自学到不同的「擅长方向」（语言、代码、数学、知识等）。</li>
<li><strong>Router（路由器）</strong>：每个 token 进到 MoE 层时，Router 算一个「专家偏好分数」，决定这个 token 该去哪个专家。最常见的是 Top-K 路由（K = 1 或 K = 2），DeepSeek V3 是 Top-8 + 1 个共享专家。</li>
<li><strong>负载均衡</strong>：训练时要加辅助损失防止「专家不平衡」（Router 偏爱某几个专家，其他专家没被训过），保证所有专家都在学。</li>
</ol>
<p><strong>为什么 DeepSeek V3、Mixtral、部分 Qwen 模型都在用 MoE</strong>：</p>
<ul>
<li><strong>训练性价比高</strong>：同样算力下训出来的 MoE 模型，效果接近一个大 Dense 模型，但参数总量是 Dense 的 5–20 倍。</li>
<li><strong>推理成本可控</strong>：每个 token 只用一小部分参数，推理速度和小 Dense 模型相当。</li>
<li><strong>可扩展性强</strong>：要增加模型容量，加专家数比加层数容易。</li>
</ul>
<p><strong>但 MoE 也有挑战</strong>：训练难度高（专家不平衡、路由坍缩、并行化复杂）；显存占用高（虽然激活只 37B，但所有专家的参数都要加载到显存，671B 是实打实的）；推理时还有通信开销（分布式部署时专家分散在多卡、多机，token 路由要跨卡做 All-to-All 通信，这是推理延迟的大头）。</p>
`,
      },
      {
        id: 'P92',
        group: 'llm-eng',
        title: '大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？',
        body: `
<p><strong>简要回答</strong></p>
<p>大模型部署框架的本质问题是：<strong>怎么在固定的硬件上跑得更快、更省显存、支持更多并发用户？</strong>主流框架按定位分四类。</p>
<ol>
<li><strong>vLLM</strong>：当前生产部署里很常见的框架，UC Berkeley 出品。核心创新是 <strong>PagedAttention</strong>，把 KV Cache 像操作系统虚拟内存一样分页管理，大幅减少碎片，显存利用率能明显提高；配合 Continuous Batching 实现很高的吞吐量，是很多团队部署 LLM API 时会优先评估的方案。</li>
<li><strong>SGLang</strong>：vLLM 之后的<strong>新一代推理框架</strong>，LMSYS 出品。核心创新是 <strong>RadixAttention</strong>，把多请求的共享前缀（如 System Prompt、Few-shot 示例、对话历史）组织成树结构，相同前缀只存一份 KV Cache。在 Agent、多轮对话、批量 Prompt 场景下比 vLLM 显存更省、首 token 延迟更低。</li>
<li><strong>TGI</strong>：HuggingFace 出品，与整个 HF 生态深度集成。优点是开箱即用、支持各种 HF Hub 上的模型、企业级 API 接口（鉴权、metrics、健康检查）。但要注意它近两年的增长势头不如 vLLM / SGLang，选它更多是看中 HF 生态和既有系统集成，而不是追求极致性能。</li>
<li><strong>llama.cpp</strong>：CPU / 边缘设备部署的事实标准。用 C++ 重写整个推理栈，配合 GGUF 量化文件格式，可以让 7B 模型在 MacBook Pro 上跑、在树莓派上跑、在手机上跑，是个人开发者和边缘部署的首选。</li>
</ol>
<p><strong>怎么选</strong>：</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>场景</th><th>选型</th></tr>
</thead>
<tbody>
<tr><td>生产高吞吐 LLM API</td><td>vLLM 默认</td></tr>
<tr><td>Agent / 多轮对话 / Few-shot</td><td>SGLang 更省</td></tr>
<tr><td>拥抱 HuggingFace 生态、企业级</td><td>TGI</td></tr>
<tr><td>本地 / Mac / 边缘 / 无 GPU</td><td>llama.cpp</td></tr>
<tr><td>极致性能、自家定制</td><td>TensorRT-LLM（NVIDIA 官方）</td></tr>
</tbody>
</table>
</div>
`,
      },
      {
        id: 'P93',
        group: 'llm-eng',
        title: '大模型能力评测指标有哪些？',
        body: `
<p><strong>简要回答</strong></p>
<p>我对这块的理解是，学术 Benchmark 只能作为参考，真正重要的是在<strong>自己业务数据上的表现</strong>。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>能力</th><th>常见评测</th></tr>
</thead>
<tbody>
<tr><td>综合知识</td><td>MMLU / MMLU-Pro</td></tr>
<tr><td>代码</td><td>HumanEval / SWE-bench Verified</td></tr>
<tr><td>数学与科学推理</td><td>GSM8K / MATH / GPQA</td></tr>
<tr><td>抗数据污染</td><td>LiveBench、Humanity's Last Exam 这类更新型评测</td></tr>
</tbody>
</table>
</div>
<p>这些指标看一眼能大概判断模型能力区间，但不能直接等价成业务效果。</p>
<p><strong>我们实际项目里的做法</strong>：从真实用户请求里采样、人工标注期望输出，建一个 50–200 条的测试集，每次改 Prompt 或换模型都在上面跑一遍，再加上线上的用户满意率来形成闭环，这才是可靠的评测体系。</p>
`,
      },
      {
        id: 'P94',
        group: 'llm-eng',
        title: '对比使用过哪些主流大模型？项目中最终选用了哪个？为什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>项目选型阶段，我会先把模型分成两类：一类是<strong>国内可落地的生产候选</strong>，比如 DeepSeek、Qwen、豆包这类模型；另一类是<strong>海外能力标杆</strong>，比如 GPT-5.5 / o 系列、Claude Sonnet / Opus 系列，用来做能力上限参照。</p>
<p>如果是面向国内企业用户的 Agentic RAG 系统，我倾向于把国内模型作为主链路候选，海外模型只做离线评测或非敏感场景兜底。原因不是海外模型不好，而是企业项目里合规、网络稳定性、成本预算、售后支持这些约束会直接决定方案能不能上线。</p>
<p>最终落地时，我不会死磕一个模型，而是用 <strong>Model Routing（模型路由）</strong>：格式要求严格、Tool Use 多的节点优先选指令遵循和结构化输出稳定的模型；高频推理、数据清洗、摘要归纳这类节点优先选性价比高的模型；特别难的问题再路由给能力更强但更贵的模型。选模型从来不是看谁跑分最高，而是看谁最契合业务的<strong>合规、成本、延迟与能力特征</strong>。</p>
`,
      },
      {
        id: 'P95',
        group: 'llm-eng',
        title: '为什么长上下文会出现 Lost in the Middle？上下文窗口越大越好吗？',
        body: `
<p><strong>简要回答</strong></p>
<p>我不会把长上下文能力简单理解成「模型最多能接收多少 token」。最大上下文窗口只是输入上限，真正有用的是模型在不同长度、不同位置和不同干扰强度下，能不能稳定找到证据并完成推理，也就是它的<strong>有效上下文能力</strong>。</p>
<p><strong>Lost in the Middle</strong> 指的是：关键信息放在长文本中间时，模型的利用效果往往比放在开头或结尾更差。它不只是位置编码造成的，还和训练时见过的长度分布、注意力的位置偏置、无关内容对注意力的稀释，以及任务需要跨段整合多少信息有关。</p>
<p><strong>窗口不是越大越好</strong>。输入越长，稠密 Self-Attention 的计算量增长很快，KV Cache、首 token 延迟和调用成本也会增加。工程上我会先做检索和重排，只保留真正相关的片段，再配合结构化摘要、清晰分区和关键约束布局，最后用不同长度、不同证据位置的测试集验证，而不是把所有资料一次性塞给模型。</p>
`,
      },
      {
        id: 'P17',
        group: 'llm-eng',
        title: 'Agent 的上下文工程怎么设计？',
        body: `
<p><strong>简要回答</strong></p>
<p>上下文工程是运行时装配，不是把所有信息长期堆在一个提示词里。每次模型调用前，根据当前子任务，从指令、用户需求、结构化任务状态、短期对话、长期记忆、工具定义和结果、RAG 证据里挑选本轮需要的内容，再做优先级排序、来源隔离和 token 分配。</p>
<p><strong>优先级</strong>：系统 / 开发者指令负责“要做什么、不能做什么”。System 和 Developer 都是应用开发者写好的规则，区别只是模型 API 的角色名；User 是终端用户这一轮的问题。任务状态里的目标、约束、待办、当前步骤和已完成结果负责“现在做到哪了”；记忆、RAG 和工具结果补充“完成这一步需要知道什么”。旧记忆和外部资料不能覆盖更高优先级指令；网页、文档和工具返回值必须当数据处理，不能混成新命令。</p>
<p><strong>预算</strong>：先预留输出空间，再给各类上下文设预算和不可丢项。超预算时依次去重、裁剪低相关证据和无关工具，最后才压缩旧历史。</p>
<p><strong>状态</strong>：执行后的状态增量写回外部状态库，下一轮按当前步骤重新装配，而不是让模型只靠聊天记录记住一切。江中就是系统提示 + 任务卡 + 记忆 + 结构化摘要 + 预算内最近轮次，状态落 PostgreSQL。</p>
`,
      },
      {
        id: 'P18',
        group: 'agent',
        title: 'Agent 的多轮对话状态怎么管理？怎么防跑偏、怎么支持中断恢复？',
        body: `
<p><strong>简要回答</strong></p>
<p>多轮对话状态不要把所有内容都塞进 messages，先把信息分四类：对话历史、业务状态、任务状态、长期记忆。对话历史保留原话；业务状态存已确认的实体和约束；任务状态记目标、当前步骤和工具执行进度；长期记忆只存跨任务仍有价值的偏好和历史经验。</p>
<p><strong>当前任务</strong>：显式维护核心意图、当前子任务、待执行工具、已完成步骤和上下文快照。每轮先判断用户输入是补充、纠错、回答澄清，还是明确换任务，再更新结构化状态。核心意图是锚点，模型不能自行覆盖；用户确认换任务时，才创建新任务或新版本。</p>
<p><strong>防跑偏</strong>：执行层用状态机控制合法流转，比如规划中 → 执行中 → 等待用户 → 校验中 → 完成。自然语言历史保留语气、原因和细节，状态机决定现在能做什么，两者不能互相替代。</p>
<p><strong>中断恢复</strong>：用会话 ID / 任务 ID 隔离，关键步骤保存状态快照；恢复时加载最近一次已提交状态，核对未决工具调用。所有写外部系统的动作都要带稳定幂等键，不能简单从失败位置再执行一遍，否则可能重复下单、重复发消息。</p>
<p><strong>江中怎么设计</strong></p>
<ul>
<li><strong>四类信息</strong>：对话历史存消息 / 轮次 / 步骤；业务状态放任务卡的设备号、告警码、工单号、批次号、确认事实和未知项；任务状态放目标、计划、步骤、观察、回执、审批和等待项；长期记忆走五张表、五类范围，默认关闭。</li>
<li><strong>当前任务</strong>：任务卡显式维护目标、计划、步骤、观察、回执、待审批、约束、任务状态和等待项；任务卡随状态快照持久化，不把工具结果原文塞进提示词。</li>
<li><strong>防跑偏</strong>：LangGraph 主图控制阶段（规划 / 执行 / 审批），固定流程子图控制步骤；同一会话用咨询锁串行；计划编译校验、限步。</li>
<li><strong>恢复</strong>：会话、图状态、任务卡、审批、场景回执落 PostgreSQL；按会话 ID / 任务 ID 恢复，核对未决工具调用；状态不明不自动重放，写操作带幂等键。</li>
</ul>
`,
      },
      {
        id: 'P19',
        group: 'agent',
        title: '如何评估一个 Agent 的效果？评测集和指标怎么设计？',
        body: `
<p><strong>简要回答</strong></p>
<p>评估 Agent 不能只看最终答案，要分四层看：</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>层级</th><th>看什么</th></tr>
</thead>
<tbody>
<tr><td>工具层</td><td>该不该调用、工具选得对不对、参数和返回处理是否正确。</td></tr>
<tr><td>单步 / 轨迹层</td><td>每一步决策是否合理；有没有漏步、重复调用、越权、绕过必要流程。</td></tr>
<tr><td>端到端层</td><td>任务最终是否完成，外部环境状态是否达到目标。</td></tr>
<tr><td>线上层</td><td>真实业务成功率、用户接受率、延迟、token、成本和安全事件。</td></tr>
</tbody>
</table>
</div>
<p><strong>评测集</strong>：来自真实用户请求、历史坏例、边界场景和对抗样本。每条样本不只存问题和参考答案，还要存目标状态、允许 / 禁止的动作、关键检查点和评分规则；有多条正确路径的任务，不强求轨迹逐步一致。</p>
<p><strong>评分</strong>：确定性检查放最前面，能用参数结构、数据库状态、单元测试、权限规则判断的，不用大模型猜。开放式质量再交给人工和大模型裁判，但要用人工样本校准裁判，并防位置、篇幅和自我偏好偏差。</p>
<p><strong>门禁与闭环</strong>：安全和关键业务约束设为发布硬门禁；其余指标按核心任务和场景切片，与基线比较。上线后用调用链、用户反馈和业务结果发现坏例，回流到离线集，形成持续回归闭环。江中就是固定断言 + 任务完成 / 安全 / 数值溯源 + 人工标注校准 + 发布门禁。</p>
`,
      },
      {
        id: 'P20',
        group: 'agent',
        title: 'Agent 为什么会出现路径震荡、重复调用和死循环？怎么检测和治理？',
        body: `
<p><strong>简要回答</strong></p>
<p><strong>常见原因</strong>：目标和停止条件模糊；工具失败只返回空结果；任务状态没有随执行结果更新；多智能体职责边界不清，交接形成 A → B → A 的循环。</p>
<p><strong>怎么检测</strong>：调度层记录每一步的智能体、工具、标准化参数、结果摘要和执行前后状态；用动作指纹、输出相似度、状态变化和智能体调用图检测；再用步数、时间、token、成本和交接次数做全局预算。单纯动作重复只是预警，“状态长时间没有向完成标准推进”才是更可靠的循环信号。</p>
<p><strong>怎么治理</strong>：先区分临时性错误和无进展循环。临时错误走有界重试和退避；参数或权限错误直接修正或询问用户；执行路径没有进展时，禁用当前失败路径，换参数或工具，必要时从检查点重新规划。预算耗尽或风险越界后，系统停止自动执行，把已完成结果、卡点和可选方案交给用户或人工处理。</p>
<p><strong>江中</strong>：整轮最多 20 次模型调用、10 次工具调用，每步默认 60s、整轮默认 1h，递归上限 50；任务卡和状态快照都在，路径没进展或状态不明就停，不自动重放。</p>
`,
      },
      {
        id: 'P21',
        group: 'llm-eng',
        title: '线上 Agent 延迟明显升高时，如何通过 Trace 定位和优化？',
        body: `
<p><strong>简要回答</strong></p>
<p>先分清慢在哪：是 <strong>TTFT</strong>（用户多久看到第一个 Token），还是<strong>总时延</strong>（从接收到完成一共多久）。再按任务类型、模型版本、工具、租户和发布时间切片，看 P50 / P95 / P99，判断是整体变慢，还是少量长尾请求有问题。</p>
<p><strong>用 Trace 定位</strong>：同一个 Trace ID 串起网关、排队、上下文构建、检索、模型调用、工具调用、编排决策和最终生成；每个环节一个 Span，记录耗时、状态、重试次数、输入输出规模、token 数和错误类型，但不记录密码、完整提示词等敏感内容。先用指标圈定异常范围，再抽慢 Trace 和正常 Trace 做对比，从瀑布图里找关键路径：排队时间是否上涨、模型 TTFT 或生成速度是否变化、检索和工具是否长尾、Agent 步数和重试是否膨胀、原本并行的步骤是否被串行执行。</p>
<p><strong>对症优化</strong>：排队问题做容量和并发治理；模型问题从路由、上下文、输出长度和缓存入手；检索与工具问题考虑连接复用、缓存、批量和安全并行；编排问题减少无效步骤、重复调用和过度反思。修改后用历史轨迹回放、灰度和分位数对比验证，同时守住任务成功率、答案质量、安全和成本，不能只把耗时压下来就算成功。</p>
<p><strong>江中</strong>：trace 串网关、排队、计划、模型、工具和场景回执；重点看 TTFT、阶段耗时、工具失败和重试；优化从限流、上下文预算、工具连接复用和减少无效步骤入手。</p>
`,
      },
      {
        id: 'P23',
        group: 'agent',
        title: 'Agent 的「任务幻觉」是什么？如何避免没执行工具却声称任务完成？',
        body: `
<p><strong>简要回答</strong></p>
<p>「任务幻觉」是智能体把计划、尝试或者一段看起来成功的工具输出，当成真实完成，并向用户声明一个和外部状态不一致的结果。普通文本幻觉主要是事实说错；任务幻觉更危险，会让用户以为退款、发信、改代码这些动作已经发生。</p>
<p><strong>怎么避免</strong>：把模型定位成决策者，不是事实裁判。调度层用代码维护任务状态机；只有真正调用工具、保存执行回执，并通过数据库查询、资源读取、单元测试等确定性方式验证目标状态后，任务才能从「执行成功」进入「已验证」。最终回复只能根据这份已验证状态生成。</p>
<p><strong>超时怎么处理</strong>：不能直接当失败重试，因为动作可能已经执行。有副作用的请求要设置幂等键，再通过请求 ID 或业务状态查询结果；暂时查不清就明确返回「结果待确认」，不能把未知包装成成功。</p>
<p><strong>评测</strong>：专门构造未调用工具、伪造成功返回、异步未完成、响应丢失、陈旧缓存和部分成功等样本；重点统计错误完成声明率、证据覆盖率、重复副作用率和未知状态处理正确率，并把错误完成声明设成上线硬门禁。江中就是场景回执、写操作审批、幂等和状态不明不重放。</p>
`,
      },
      {
        id: 'P24',
        group: 'llm-eng',
        title: '大模型或 Agent 连接数据库时，如何防止越权、敏感数据泄漏和查询幻觉？',
        body: `
<p><strong>简要回答</strong></p>
<p>不要把 Prompt 当安全边界，也不要让模型拿高权限账号直接执行任意 SQL。用户身份和租户范围来自可信的登录态，由网关传给策略层；模型只负责表达查询意图，真正的授权要在模型之外逐次校验。</p>
<p><strong>数据库侧</strong>：遵循最小权限。查询智能体用独立的只读账号，只开放必要的库、表、视图和列，再用行级策略强制租户隔离。能封装成“查订单”“统计销售额”这类业务工具的，就不暴露通用 SQL。必须做 Text-to-SQL 时，用 SQL 解析器检查语法树，对语句类型、表、列、函数和查询规模做 allowlist，再通过参数化查询、只读事务、超时和行数限制执行。</p>
<p><strong>敏感数据</strong>：从源头最小化，优先查询脱敏视图和聚合结果，进入模型前后都做字段裁剪与脱敏。数据库里的文本也属于不可信数据，即使出现“忽略规则”之类内容，也只能作为数据展示，不能改变工具权限或执行策略。</p>
<p><strong>查询正确性与写操作</strong>：查询安全不等于查询正确，还要校验字段是否存在、指标口径、租户过滤、时间范围和结果合理性，并保存查询依据。高风险写操作用独立工具，先预览变更，再经过权限校验和人工审批，最后靠事务、幂等、影响行数限制和审计日志兜底。江中就是身份从宿主来、工具目录 + 参数校验 + 写操作审批 + 审计，不把通用 SQL 暴露给模型。</p>
`,
      },
      {
        id: 'P25',
        group: 'agent',
        title: 'Agent Harness 是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>Agent Harness 可以理解为围绕大模型的一套运行支撑，核心是组织“模型调用 + 工具执行”的循环，让模型能根据实际结果连续推进任务。</p>
<p>模型负责理解目标、判断下一步、输出回复或工具请求；Harness 接住这些输出，检查并安排实际执行，再把工具结果放进下一轮输入，继续调用模型。工具请求本身只是模型提出的动作，真正的文件读取、命令执行或接口调用，需要外部程序完成。</p>
<p>任务变长以后，Harness 还要组织每轮上下文，并配合任务记录保存进度，让中断后的运行能接上已有结果；同时落实动作权限、运行预算和结束判断，避免只凭模型说完成就结束任务。</p>
<p>所以：模型提供理解与决策，工具提供具体操作，Harness 把它们组织成可持续运行的任务过程。框架可以提供这些组件，也可能直接封装好运行机制，具体看它实际包含什么能力。江中：Harness = LangGraph 主图 + 工具执行 + 任务卡 / 状态快照 + 审批和场景回执 + 预算和限步。</p>
`,
      },
      {
        id: 'P26',
        group: 'agent',
        title: '如何设计一个完整的 Agent Harness？',
        body: `
<p><strong>简要回答</strong></p>
<p>Harness 的核心是一个执行循环：程序准备上下文，调用模型，接住它的工具请求，执行后把结果交回去，再让模型决定下一步。比如修 Bug，模型负责判断要读哪些代码、怎么改；程序负责读文件、应用修改和运行测试。</p>
<p>每轮调用前，保留任务目标、约束、当前进度和相关材料。完整日志放在外部，需要时再读，避免把所有历史都塞给模型。工具执行要在允许的工作区和权限范围内，还要限制耗时，并把成功、失败或结果未知的情况传回来。</p>
<p>长任务的进度要单独持久化，包括已经做过的操作、产物和未解决的问题。中断以后先核对实际文件和未决操作，再恢复执行。任务结束以事先确定的验收条件为准，比如修改符合需求、相关测试通过；模型说完成时，程序还要检查这些证据。</p>
<p>另外，给整个任务设步数、时间和费用预算，并记录每轮输入、工具结果和状态变化。这样既能控制循环，也能在失败时查清问题出在模型决策、工具执行还是运行程序。最初这些模块可以放在一个服务里，接口分清楚以后，再按需要拆分。江中就是 LangGraph 主图 + 计划执行器 + 任务卡 / 状态快照 + 审批和场景回执 + 预算和限步。</p>
`,
      },
      {
        id: 'P27',
        group: 'agent',
        title: 'Agent 的自进化机制如何实现？',
        body: `
<p><strong>简要回答</strong></p>
<p>把自进化做成任务执行之外的持续改进流程：任务完成后，把用户纠正、测试结果和实际执行记录放在一起，定位问题出在哪一步，提炼成有适用范围、有证据的经验；下次遇到同类任务，把相关经验放进上下文，让它在决策前避开以前的错误。</p>
<p>比如统计有效订单漏了状态条件，不要只记住“上次答案是 4”，而要记住“这类指标先查业务定义，再按定义生成查询”。一个场景的经验按需召回；很多任务都有相同问题时，整理进 Prompt 或 Skill，改进整个流程。这些都可以在不更新模型参数的情况下实现。</p>
<p><strong>验证</strong>：新经验和新流程先用没参与优化的任务验证，同时跑原来的成功场景，确认能推广、没有引入退化；再逐步启用，保留来源和版本，出问题能撤回。单次反思或修好一道旧题，不能证明 Agent 持续变好了。</p>
`,
      },
      {
        id: 'P28',
        group: 'agent',
        title: 'Agent 应该在什么情况下请求人工确认？',
        body: `
<p><strong>简要回答</strong></p>
<p>先看这一步是否在用户已经授权的范围内。目标和参数明确、操作符合执行规则时，可以继续完成，不需要每次调用工具都重复确认。需要停下来问的是：关键对象或要求有歧义、准备执行的动作超出原来的授权，或者业务规则要求人工审批。</p>
<p>还要看操作影响。对外发送、删除唯一数据、扩大权限这类后果较大的动作，要把具体对象、内容和影响讲清楚，确认确实被授权。用户已经明确批准过同一项操作，而且方案和条件没有变化，可以沿用这份批准，不能只因为又调用一次工具就重新问。</p>
<p><strong>实现</strong>：真正执行前保存待确认方案，让用户批准、修改或拒绝；批准要和具体任务、参数版本绑定，恢复时再核对权限。用户说“同意”不等于有后端操作权限，也不能证明一次超时的操作没有发生；结果未知时先查实际状态，需要人的判断再升级处理，不能拿一句“继续”代替事实核查。</p>
`,
      },
      {
        id: 'P29',
        group: 'llm-eng',
        title: 'Agent 的上下文压缩阈值应该如何确定？',
        body: `
<p><strong>简要回答</strong></p>
<p>压缩阈值要根据剩余空间和接下来要做的任务确定，没有通用的 80%。当前输入除了聊天记录，还有指令、工具定义和工具结果；先把这些内容的实际 token 占用算清楚，再给模型输出和下一步可能增加的内容留空间。</p>
<p>比如 Agent 接下来要读大量测试日志，即使当前窗口还没到 80%，剩余空间也可能不够；如果只是做一次短查询，后续增长很小，就可以保留更多原始信息。所以阈值更适合跟着任务动态调整。</p>
<p>压缩本身也有代价：太早会损失细节，太晚可能超限。具体触发比例和压缩后的目标大小，要在实际任务上比较完成效果、关键信息保留、延迟和成本。压缩完还得检查目标、约束和未完成状态有没有保留下来，不能只看 token 降了多少。</p>
`,
      },
      {
        id: 'P30',
        group: 'llm-eng',
        title: '相同输入为什么会得到不同的 Agent 执行结果？',
        body: `
<p><strong>简要回答</strong></p>
<p>先确认“相同输入”指什么：是同一句用户问题，还是完整运行条件都相同。Agent 还会用到系统指令、历史、记忆、工具定义和任务状态，这些内容变化，模型实际收到的请求就已经不同了；后续工具读到的数据也可能变化，所以相同用户文本不一定应该得到相同结果。</p>
<p>即使模型请求相同，生成策略也可能从候选里采样，导致输出不同。降低 temperature 或固定支持的 seed，可以控制一部分变化，但模型版本、推理实现和数值计算也会影响。并发的工具调用、超时重试和共享状态更新，都可能改变后续决策；这些差异进入多步循环后，还会继续影响下一轮输入。</p>
<p><strong>排查</strong>：保存实际请求、模型配置、工具参数和返回、状态变化，对齐两次执行记录，先找最早出现差异的位置，再通过固定观察或回放事件检查对应环节。稳定性按业务要求判断：合理路径和措辞可以不同，事实、计算结果、权限约束和写操作的幂等必须符合规定，不能只用逐字一致衡量。</p>
`,
      },
      {
        id: 'P31',
        group: 'rag',
        title: '什么是 RAG？完整 RAG 系统的工作流程是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 全称 Retrieval-Augmented Generation，就是检索增强生成。大模型的知识在训练后固定，私有数据和最新信息答不上来；RAG 在生成前先从外部知识库检索相关内容，再把检索结果和问题一起交给大模型，让它基于上下文回答，相当于开卷考试。</p>
<p><strong>离线流程</strong>：文档接入 → 解析清洗 → 切片 → 向量化 + 关键词索引 → 元数据 / 父块 → 版本化发布。</p>
<p><strong>在线流程</strong>：问题理解 / 改写 → 权限过滤 → 向量 + 关键词双路召回 → 融合（如 RRF）→ 精排 → 父块补全 → 组装上下文 → 生成答案 + 引用 → 证据校验 / 拒答。</p>
<p><strong>质量闭环</strong>：固定检索集和生成集，分别看召回 / 命中、答案正确性、引用依据和幻觉；用门禁和回归防止退化。</p>
`,
      },
      {
        id: 'P32',
        group: 'rag',
        title: '大模型的 RAG 主要用来解决什么问题？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 主要解决三个问题。</p>
<p>第一是<strong>知识时效性</strong>：大模型训练完知识就固定了，训练截止日期之后发生的事它一无所知。第二是<strong>私有知识覆盖</strong>：公司内部文档、行业专有数据根本没有机会进训练集，模型对这些内容是空白的。第三是<strong>幻觉问题</strong>：没有知识依据时，模型容易“自己发挥”，编出一个听起来合理但实际错误的答案；给了它参考资料之后，幻觉就少很多。</p>
<p>这三个问题的根源都是同一件事：<strong>知识被固化在了模型参数里</strong>。RAG 的解法是把知识存到外部，用的时候实时检索注入，彻底绕开参数里的知识限制。</p>
`,
      },
      {
        id: 'P33',
        group: 'rag',
        title: '相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自优劣势？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 和微调解决的不是同一层面的问题，不是谁替代谁。微调是把新知识或行为直接烧进模型参数，适合改变输出风格、格式或培养深度专业能力；RAG 是在推理时实时检索注入知识，适合知识频繁更新、需要溯源和权限隔离的场景。</p>
<p><strong>RAG 的优势</strong>：知识更新快、可引用、可按权限过滤、不用训练；代价是检索质量决定上限，增加上下文和延迟。<strong>微调的优势</strong>：输出格式 / 语气稳定、领域能力更深；代价是训练成本高、知识容易过期、难引用和撤回。</p>
<p><strong>怎么选</strong>：知识库问答优先 RAG，成本低、随时更新；要让模型学会特定输出格式或行业语气，用微调；实际也可以组合，先微调再套 RAG。</p>
`,
      },
      {
        id: 'P34',
        group: 'rag',
        title: 'RAG 中的文档怎么存？粒度多大？文档切割策略怎么设计？',
        body: `
<p><strong>简要回答</strong></p>
<p>文档不能直接塞进向量库，必须先切成 chunk，每个 chunk 向量化后存一条记录。每条记录有三部分：<strong>向量</strong>用于相似度检索；<strong>原始文本</strong>用于命中后塞给大模型读；<strong>metadata</strong> 记录来源文件、页码、章节等，用于过滤和溯源。向量负责“找到”，原文负责“阅读”，缺一不可。</p>
<p><strong>切割粒度</strong>没有固定答案，500–1000 token 是常见起点，但更重要的是按文档类型选策略：普通文本用固定大小 + 重叠；有标题结构的文档按语义边界切；代码按函数 / 成员切；既要检索精度又要上下文完整时，用父子切割——小块检索，大块返回。</p>
<p><strong>ThingJS RAG 怎么落</strong>：按 Markdown 结构和代码 AST 切，保留类 / 成员身份和父块；target 900 / max 1200 / overlap 150；当前 9,366 个 chunk、878 个父块；metadata 带来源、路径、行号和符号；切块参数进入指纹，参数变化要重建索引。</p>
`,
      },
      {
        id: 'P35',
        group: 'rag',
        title: '怎么规避语义被切割掉的问题？',
        body: `
<p><strong>简要回答</strong></p>
<p>从两个方向规避。第一，切的时候不要在语义中间截断：用重叠切割和语义边界切割，按句子、段落这些自然边界来切，保证每个 chunk 内容完整。</p>
<p>第二，切完之后用检索策略把上下文补回来：核心是句子窗口检索，命中一个句子就把周围几句一起返回给大模型；另外还有父子切割，小块检索命中，大块内容输出。</p>
<p>还有一个比较有价值的方案，是 Anthropic 提出的 <strong>Contextual Retrieval</strong>：在 Embedding 之前，先让大模型看着整篇文档为每个 chunk 生成一段背景说明，把这段背景和 chunk 拼在一起再向量化，从根本上解决孤立 chunk 没头没尾的问题。ThingJS RAG 则是用结构化边界 + 父块回填 + 重叠来补上下文。</p>
`,
      },
      {
        id: 'P36',
        group: 'rag',
        title: 'RAG 中 Embedding 是什么？如何选择和评估 Embedding 模型？',
        body: `
<p><strong>简要回答</strong></p>
<p>Embedding 就是把一段文本转成一串数字向量的过程。它有一个关键特性：语义相近的文本，转出来的向量在数学空间里的距离也近。RAG 里的语义检索就是靠这个实现的，不是关键词匹配，而是看两段内容的意思相不相近。</p>
<p><strong>选模型看三个维度</strong>：第一是中文支持，中文场景优先 BGE 系列，效果经常比 OpenAI 的模型好；第二是向量维度，维度越高精度越好，但存储和计算成本也越大；第三是最大输入长度，它决定了能处理多长的 chunk。</p>
<p><strong>评估</strong>：不要只看通用排行榜，一定要在自己的业务数据上跑召回测试，看 Recall@K、命中率、误空和端到端答案质量，那个才有参考价值。ThingJS RAG 用的是 Qwen3-Embedding-4B、2,560 维；换模型时即使维度不变，旧向量也不能直接复用，要全量重嵌。</p>
`,
      },
      {
        id: 'P37',
        group: 'rag',
        title: 'Embedding 有哪几种算法你了解过吗？',
        body: `
<p><strong>简要回答</strong></p>
<p>Embedding 算法大致经历三代演进。</p>
<p><strong>第一代：静态词向量</strong>，以 Word2Vec、GloVe 为代表。每个词映射成固定向量，同一个词不管上下文是什么，向量永远不变，处理不了多义词。</p>
<p><strong>第二代：上下文相关向量</strong>，以 BERT 为代表。同一个词在不同语境下有不同的向量，表达能力大幅提升；但 BERT 本身输出的是 token 级向量，两个句子要比相似度就必须拼在一起跑，百万条文档就要跑百万次，检索速度完全不可接受。</p>
<p><strong>第三代：句子级对比学习 Embedding</strong>，以 SBERT、SimCSE、BGE 为代表。专门为“两段文本有多相似”这个任务优化，能提前把所有文档向量算好存起来，查询时只需算一次，是 RAG 场景的标配。</p>
`,
      },
      {
        id: 'P38',
        group: 'rag',
        title: '什么是向量数据库？有没有做过向量数据库的对比选型？',
        body: `
<p><strong>简要回答</strong></p>
<p>向量数据库是专门用来存储和检索高维向量的数据库，核心能力是近似最近邻搜索（ANN），能在百万甚至亿级的向量里快速找出最相似的几条。普通关系型数据库的索引结构对高维向量基本失效，所以需要专门的数据库来处理。</p>
<p><strong>选型对比</strong>：本地开发用 Chroma，零配置、上手快；生产环境中小规模推荐 Qdrant，性能不错、API 简洁；超大规模考虑 Milvus，字节和小米都在用；不想自己运维就用 Pinecone 云托管；项目里已经有 PostgreSQL，可以直接用 pgvector 插件，不用引入新组件。</p>
<p><strong>ThingJS RAG</strong>：用的是 LanceDB；当前 9,366 个 chunk 全表扫描约 90ms，所以没有上 ANN，避免 ANN 训练随机性破坏基线对比；规模上来再评估。</p>
`,
      },
      {
        id: 'P39',
        group: 'rag',
        title: '讲讲你用的向量数据库？数据量级、性能、瓶颈怎么处理？',
        body: `
<p><strong>简要回答</strong></p>
<p>我实际用的是 <strong>LanceDB</strong>：嵌入式、列式存储，不用单独起服务，直接在本地磁盘上跑。ThingJS RAG 当前是 9,366 个 chunk、2,560 维，规模不大，所以没有上 ANN，向量全表扫描大约 90ms，够用。</p>
<p><strong>为什么用 LanceDB</strong>：数据量小，全表扫描已经够快；ANN 训练有随机性，重建后 Top-K 不可复现，会破坏基线对比；嵌入式部署简单，和项目一起走，不用维护额外组件。</p>
<p><strong>瓶颈和扩容</strong>：如果数据涨到百万级、并发也高，LanceDB 的单机全表扫描会顶不住，这时我会换 <strong>Milvus</strong>：分布式部署、读写分离，支持 HNSW。百万条 1,024 维的 HNSW 单次查询大概 20–50ms；内存压力大就开 SQ8 量化，把 float32 压成 int8，内存降到原来的四分之一；大批量写入会触发 Segment 合并，影响查询延迟，可以放到业务低峰、分小批次写。</p>
`,
      },
      {
        id: 'P40',
        group: 'rag',
        title: '给 RAG 系统一个输入，完整工作流程是怎样的？',
        body: `
<p><strong>简要回答</strong></p>
<p>把问题输入 RAG 系统后，不会直接丢给大模型，而是先走“检索 → 整理 → 生成”的流水线。</p>
<p>具体来说：问题预处理（改写成更适合检索的形式）→ 问题向量化 → 去向量库找最相关的文档片段 → 精排筛掉噪音 → 把筛选出来的片段和问题一起拼成 Prompt 交给大模型 → 大模型基于这些参考资料生成最终答案。</p>
<p>整个流程的核心目标只有一个：让大模型在回答时有真实的知识作为依据，而不是凭空发挥。工程上还会加权限过滤、引用和证据校验。</p>
`,
      },
      {
        id: 'P41',
        group: 'rag',
        title: '向量检索和关键词检索有什么区别？',
        body: `
<p><strong>简要回答</strong></p>
<p>关键词检索（BM25 这类）靠词频统计，看查询词在文档里出现了多少次，擅长精确命中；向量检索靠语义空间里的距离，能理解“换了种表达方式的同一个意思”，擅长模糊语义匹配。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>维度</th><th>关键词检索</th><th>向量检索</th></tr>
</thead>
<tbody>
<tr><td>原理</td><td>词频统计</td><td>语义空间距离</td></tr>
<tr><td>擅长</td><td>精确命中、专有名词 / 型号</td><td>同义表达、模糊语义</td></tr>
<tr><td>盲区</td><td>同义词没辙</td><td>专有名词 / 产品型号容易漏</td></tr>
</tbody>
</table>
</div>
<p>所以 RAG 系统通常两路都跑：向量捕获语义相关内容，BM25 精准命中关键词，再用 RRF 把两路结果合并，覆盖比单路宽很多。ThingJS RAG 就是向量 + BM25 + RRF，再加精确符号置顶。</p>
`,
      },
      {
        id: 'P42',
        group: 'rag',
        title: '如何润色用户的 Query（Query Rewrite）？目的是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>Query Rewrite 主要是为了弥补用户提问方式和知识库文档表述之间的语义鸿沟。用户的问题往往口语化、模糊、带缩写，而文档写的是正式书面语，向量相似度天然偏低，导致该召回的内容没被召回。</p>
<p><strong>常见做法</strong>：</p>
<ul>
<li><strong>直接改写</strong>：让大模型把口语化问题转成更精准的表述。</li>
<li><strong>Query 扩展</strong>：补充相关关键词。</li>
<li><strong>HyDE</strong>：让大模型先生成一个假设答案，再用答案的向量去检索。</li>
<li><strong>Step-back Prompting</strong>：把具体问题往上抽象一层，检索更通用的背景知识。</li>
</ul>
<p>ThingJS RAG 的查询分析做类名纠错、别名展开、否定约束和实体识别，再产出查询计划。</p>
`,
      },
      {
        id: 'P43',
        group: 'rag',
        title: '什么是多路召回？具体怎么做？',
        body: `
<p><strong>简要回答</strong></p>
<p>多路召回就是同时用多种不同的检索方式去捞候选内容，然后合并排序，而不是只靠单一的向量检索。</p>
<p><strong>为什么</strong>：向量检索擅长语义相似，但对精确词语比如产品型号、缩写、数字效果比较差；BM25 关键词检索正好相反，精确匹配强，但不理解语义。两路各有盲区，所以要一起跑。</p>
<p><strong>具体怎么做</strong>：向量检索 + BM25 混合检索，再加多 Query 扩展——把用户问题改写成多个版本分别检索；多路结果用 RRF 融合，最后送进 Rerank 精排。工程上还会加元数据 / 权限过滤、去重和候选池大小控制。</p>
<p><strong>ThingJS RAG</strong>：向量 + BM25 + 精确符号置顶，RRF 融合；显式类名 / 代码题会扩大候选池（向量 56 / BM25 80），再做类 / 成员采纳和父块回填。</p>
`,
      },
      {
        id: 'P44',
        group: 'rag',
        title: 'RAG 检索优化策略有哪些？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 检索优化可以从四个层次看：</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>层</th><th>优化手段</th></tr>
</thead>
<tbody>
<tr><td>索引层</td><td>切片策略、父子块、元数据、结构化 / 代码切分、增量索引、版本化。</td></tr>
<tr><td>查询层</td><td>Query Rewrite、扩展、HyDE、Step-back、类名纠错 / 别名 / 否定约束。</td></tr>
<tr><td>召回层</td><td>向量 + BM25、多路召回、多 Query、精确符号、权限 / 元数据过滤、候选池控制。</td></tr>
<tr><td>重排层</td><td>Rerank、类 / 成员配额、去重、父块回填、上下文预算。</td></tr>
</tbody>
</table>
</div>
<p>单独优化一个层次往往效果有限，线上要组合：先用索引优化和多路召回保证覆盖率，再用 Rerank 保证精度；用户提问质量差，再额外加查询优化。</p>
<p>ThingJS RAG 就是结构化切片 + 向量 / BM25 + RRF + 精确符号置顶 + 类 / 成员配额 + 父块回填。</p>
`,
      },
      {
        id: 'P45',
        group: 'rag',
        title: '了解哪些更复杂的 RAG 范式？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 的发展大致经历三代：<strong>Naive RAG</strong> 是最基础的检索加生成；<strong>Advanced RAG</strong> 在检索前后加优化，比如 Query 改写、Rerank、混合检索；<strong>Modular RAG</strong> 把各环节做成模块，可以任意组合。</p>
<p>在这之上还有几个值得关注的高级范式：</p>
<ul>
<li><strong>Self-RAG</strong>：让大模型自己决定要不要检索，以及评估检索质量。</li>
<li><strong>CRAG</strong>：检索质量差时自动降级到网络搜索。</li>
<li><strong>GraphRAG</strong>：微软的方案，用知识图谱的社区发现和层次摘要增强全局理解能力。</li>
<li><strong>Agentic RAG</strong>：把 RAG 做成智能体，支持多轮动态检索。</li>
</ul>
<p>工程上大多数场景 Advanced / Modular 就够；需要全局理解或多跳关系再看 GraphRAG；问题开放、需要多轮检索再考虑 Agentic RAG。</p>
`,
      },
      {
        id: 'P46',
        group: 'rag',
        title: '什么场景下会用图数据库增强传统向量检索？',
        body: `
<p><strong>简要回答</strong></p>
<p>当业务问题涉及多个实体之间的关联推理时，就需要考虑引入图数据库来增强。向量检索有一个根本局限：它只能做单跳检索，找和问题直接相关的文档，没办法沿着实体之间的关系链做推理。</p>
<p>比如问“公司 A 的投资方和公司 B 有什么交集”，答案不在某一段文档里，而是藏在多个节点之间的关系上；单纯向量检索很难处理。</p>
<p>这时候图数据库就能发挥作用：沿着关系边一跳一跳地把关联信息收集回来。典型场景有企业关系分析、医疗知识图谱、代码依赖关系查询、供应链溯源。实际落地通常是混合：先用向量 / 关键词找到实体，再用图沿关系扩展。</p>
`,
      },
      {
        id: 'P47',
        group: 'rag',
        title: '如何规避 RAG 系统中大模型的幻觉？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 幻觉主要有两类：第一类是检索没有召回到相关内容，大模型没有可用的上下文，靠自身知识编造答案；第二类是检索内容召回了，但大模型没有严格遵循，在文档内容的基础上加了自己的推断。</p>
<p><strong>四个方向</strong>：</p>
<ul>
<li><strong>Prompt 强约束</strong>：明确告知只能根据提供的资料回答，资料里没有的就说不知道。</li>
<li><strong>检索质量门控</strong>：Rerank 分数低于阈值就直接拒答，不让大模型在低质量上下文上硬撑。</li>
<li><strong>生成后引用核查</strong>：每个关键声明都要在 chunk 里找到来源依据。</li>
<li><strong>结构化输出强制溯源</strong>：让大模型输出 JSON，每条结论必须附上来源编号。</li>
</ul>
<p>成本最低、收效最快的组合是 <strong>Prompt 强约束 + 检索质量门控</strong>，生产系统上线前这两个必须做。ThingJS RAG 还会做结构化 JSON、证据筛选、领域守卫、引用校验和无证据拒答。</p>
`,
      },
      {
        id: 'P48',
        group: 'rag',
        title: '怎么量化你的 RAG 效果？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 效果分两层看：<strong>检索层</strong>看该召回的有没有召回到，用 Hit@K 和 MRR 衡量；<strong>生成层</strong>看答案对不对、有没有幻觉、和问题相不相关，主要用 RAGAs 框架，核心指标是 Faithfulness、Answer Relevancy 和 Context Recall。</p>
<p>建议一定要在自己的业务数据上跑，不能只看通用排行榜，那个不能代表你的场景。通常要建固定黄金集，检索和生成分别看指标，再加门禁和回归。</p>
<p>线上指标是用户点踩率、追问率、转人工率这些，才是最终衡量标准，离线指标只是辅助。ThingJS RAG 就是 100 题检索集、30 题生成集、12 题裁判校准，三套门禁绑定配置版本。</p>
`,
      },
      {
        id: 'P49',
        group: 'rag',
        title: 'RAG 知识库如何实现动态与持续更新？',
        body: `
<p><strong>简要回答</strong></p>
<p>知识库更新的核心挑战是：文档变了，对应的 chunk 和向量都要跟着变，而且要做到增量处理，不能每次全量重建。</p>
<p><strong>通用方案</strong>：给每个文档算一个内容 hash，通过轮询或监听数据源变更，检测到文档新增、修改、删除时，先清掉旧的向量，再重新切割入库。发布时写 manifest / 版本目录，校验通过后切 active 指针，失败回滚。</p>
<p><strong>实时性要求高</strong>：用 Kafka 这类消息队列做变更事件驱动，实现秒级入库；同时做去抖、幂等和版本控制，避免同一文档反复重建。ThingJS RAG 就是文件 hash 增量 + manifest 校验 + active 指针切换 + docs watch 去抖 / 冷却 + 门禁失败回滚。</p>
`,
      },
      {
        id: 'P50',
        group: 'rag',
        title: '实际落地中，你觉得 RAG 最难的地方是哪里？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 最难的不是把它跑起来，一个基础 Demo 一两天就能搭起来，难的是把它调好。工程上最头疼的有三块：</p>
<ul>
<li><strong>文档预处理</strong>：原始数据格式五花八门，PDF 里的表格、图片、嵌套格式，处理不好就是一堆乱码进了知识库；进去的是垃圾，出来的也是垃圾。</li>
<li><strong>检索质量调优</strong>：向量召回不准是整个系统效果的天花板，但问题来源很多——Chunking、Embedding、Query 改写，任何一个环节出问题都会影响结果，排查起来很费劲。</li>
<li><strong>效果评估</strong>：答案对不对很难系统性地衡量，不知道是哪个环节出了问题，优化就变成了瞎猜。</li>
</ul>
<p>所以我会先建分层评测和 trace，把预处理、召回、生成拆开看，再逐层优化，否则只能盲调。</p>
`,
      },
      {
        id: 'P51',
        group: 'rag',
        title: '不同来源的文档发生知识冲突时，RAG 应该信谁？',
        body: `
<p><strong>简要回答</strong></p>
<p>遇到知识冲突时，我不会直接选向量相似度最高的文档。相似度只能说明内容和问题相关，不能证明它更权威、更及时，也不能证明它适用于当前用户。</p>
<p><strong>处理顺序</strong>：先看适用范围，再看来源权威度、版本状态和生效时间。入库时保存来源、负责人、发布时间、生效区间、版本、地区、产品和状态等元数据；检索时先按用户、地区、产品和时间做过滤，再在适用的文档中召回和排序。</p>
<p><strong>仍然冲突</strong>：如果两份同等权威且同时有效的材料仍然矛盾，系统不应该偷偷二选一，而要明确告诉用户存在冲突，分别引用两边的依据，必要时转人工审核。工程上还要有冲突检测、灰度发布、版本回滚和专项评测，保证错误知识不会悄悄进入生产答案。</p>
`,
      },
      {
        id: 'P52',
        group: 'rag',
        title: '上下文窗口很大时为什么还需要 RAG？',
        body: `
<p><strong>简要回答</strong></p>
<p>上下文窗口决定模型一次能读多少资料，RAG 负责从外部资料里找出当前问题需要的证据。即使整个知识库都装得下，也不代表每份资料都相关、都有效，或者模型一定能把分散的条件全部用对。</p>
<p>RAG 可以在生成之前检索并整理材料，把相关内容和适用版本交给模型，减少无关信息，也避免每次处理整个资料库。外部资料更新以后，更新内容和索引就能让后续回答使用新证据，不需要重新训练模型。不过版本、权限和索引刷新都要真正实现，不能只靠向量相似度判断。</p>
<p>它也不是每个任务都必须用。资料少、需要整体理解时，直接读全文可能更合适；检索可能漏掉例外或跨段关系。大窗口反而能帮助 RAG 读得更完整，比如先定位相关文档，再读取完整章节。两者可以配合，取舍看证据是否充分，以及整条链路的效果和成本。</p>
`,
      },
      {
        id: 'P53',
        group: 'rag',
        title: 'RAG 与 Agent 自主文件检索应该如何选型？',
        body: `
<p><strong>简要回答</strong></p>
<p>这里比较的是常见的预建索引 RAG 和 Agent 在运行时自主查找文件，主要看任务是否需要根据中间结果继续探索。广义上，Agent 搜索外部资料再回答，也属于检索增强，二者并不是完全对立的技术。</p>
<p><strong>怎么选</strong>：资料量大、同类问题多，且答案通常能从明确的知识范围里找到，预建索引更容易复用资料、控制成本，也便于控制查询链路。需要沿引用、配置或代码关系逐步追查时，自主检索更灵活，读到什么就能决定下一步查什么，但探索轮数和成本也更容易波动。</p>
<p>关键词还是语义匹配，是另一项选择。RAG 可以用关键词索引，Agent 也可以调用语义检索。实际可以让索引先定位候选文件，再由 Agent 读取原文、核对版本并补查关联材料。最终要比较任务完成情况、证据完整性和总开销；少量资料需要通读时，直接读取全文也可能最简单。</p>
`,
      },
      {
        id: 'P54',
        group: 'tools',
        title: '什么是 Function Calling？原理是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>Function Calling 是一套机制：开发者用 JSON schema 把工具描述好传给模型；模型判断需要调工具时，不输出自然语言，而是直接输出一段结构化的 <code>tool_calls</code> JSON，告诉你“我要调哪个函数、参数是什么”；你的代码拿到这段 JSON 去真正执行，把结果塞回对话，模型再生成最终答案。</p>
<p>整个流程本质上是两轮对话：第一轮模型说“我需要调这个工具”，你去执行；第二轮模型拿到执行结果说“答案是这个”。</p>
<p>最核心的设计是：<strong>模型全程只做决策，执行的事情一律由宿主代码完成</strong>，职责分得很清楚。</p>
`,
      },
      {
        id: 'P01',
        group: 'tools',
        title: 'MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP？',
        body: `
<p><strong>简要回答</strong></p>
<p>两者不是竞争关系，解决的不是同一层面的问题。<strong>Function Calling 是“调用语言”</strong>，定义模型怎么表达“我要调哪个函数、参数是什么”；<strong>MCP 是“工具生态协议”</strong>，定义工具怎么标准化打包、注册、被 AI 客户端发现。</p>
<p>MCP 底层其实还是用 Function Calling 来触发工具调用，只是在它之上加了一套工具管理框架，让工具实现一次、到处复用。打个比方：Function Calling 像 HTTP 请求格式，MCP 像 REST API 的设计规范加服务注册发现机制，两者是不同层次的东西。</p>
<p><strong>实际经验</strong>：我用 Claude Desktop 配过文件系统和 GitHub 的 MCP Server，在配置文件里加几行就能用，Claude 会自动发现工具，完全不用写对接代码。江中则是助手通过 MCP 拿工具目录，Function Calling 提议调用，服务端做参数校验、权限和审批。</p>
`,
      },
      {
        id: 'P55',
        group: 'tools',
        title: '大模型的 Function Call 能力是怎么训练出来的？',
        body: `
<p><strong>简要回答</strong></p>
<p>Function Call 的能力主要靠两个训练阶段来培养，这两个阶段解决的是不同问题。</p>
<p><strong>第一阶段：SFT（监督微调）</strong>给模型喂大量“包含工具调用的完整对话样本”，每条样本覆盖工具定义、用户问题、模型应该输出的结构化 JSON 调用、工具执行结果和最终答案，让模型通过模仿学会整套流程。但光有 SFT 不够，模型可能学得过激，遇到什么问题都想调工具。</p>
<p><strong>第二阶段：RLHF（基于人类反馈的强化学习）</strong>通过人类标注“哪种回答更好”来训练奖励模型，再用强化学习调整主模型，让它学会“能直接回答就直接回答，需要实时数据才去调工具”的边界感。</p>
<p><strong>一句话总结</strong>：SFT 教会怎么调，RLHF 教会什么时候调。</p>
<p><strong>运行层面</strong>：每次请求时，应用代码把工具描述（schema）传给模型；模型判断需要工具，就输出结构化的 <code>tool_calls</code> JSON；你的代码拿到 JSON 去真正执行，把结果塞回对话，模型再给出最终答案。模型只做决策，执行由宿主代码完成。</p>
`,
      },
      {
        id: 'P56',
        group: 'tools',
        title: 'MCP 由哪几部分组成？',
        body: `
<p><strong>简要回答</strong></p>
<p>MCP 是连接 AI 应用与外部工具、数据的开放协议，由三层组成，可以从<strong>角色、能力、协议</strong>三个维度理解。</p>
<p><strong>角色层</strong>：<strong>Host</strong> 是 AI 应用本身，比如 Claude Desktop；<strong>Client</strong> 是 Host 里负责和 Server 通信的模块；<strong>Server</strong> 是工具提供方实现的独立进程。一个 Host 可以同时连多个 Server。</p>
<p><strong>能力层</strong>：Server 能暴露三类东西——<strong>Tools</strong> 是模型可调用的操作，可能有副作用，比如创建文件、调 API；<strong>Resources</strong> 是只读数据，比如读取文档内容；<strong>Prompts</strong> 是预定义的提示词模板。</p>
<p><strong>协议层</strong>：消息格式统一用 JSON-RPC 2.0；传输支持 <strong>stdio</strong>（本地子进程通信）和 <strong>Streamable HTTP</strong>（远程 HTTP 连接）。早期的 HTTP + SSE 双端点方案在 2025 年 3 月的规范更新里被标记为 deprecated。</p>
<p>调用时，模型通过 Function Calling 提议工具名和参数，Host 检查授权，Client 请求 Server 执行，再把结果交回模型。江中：助手是 Host / Client，中台是 Server；ThingJS 反过来是 Server。</p>
`,
      },
      {
        id: 'P57',
        group: 'tools',
        title: '什么场景用 Function Calling，什么场景用 MCP？',
        body: `
<p><strong>简要回答</strong></p>
<p>如果只是给单个应用接一两个工具、场景临时、不需要复用，Function Calling 就够了，简单直接，不需要引入额外的进程和配置。</p>
<p>但只要工具需要跨项目或跨团队复用，或者数量多了管理麻烦，或者社区已经有现成的 MCP Server 可以直接配置，MCP 就值得上了。</p>
<p>判断的核心问题只有一个：<strong>这个工具会不会在这个应用之外被用到？</strong>会的话，把它封装成 MCP Server 是更长远的选择。</p>
<p>此外，做智能体系统的话更应该选 MCP：工具来源多、数量大，手写 Function Calling 的维护成本会让代码变得难以管理。</p>
`,
      },
      {
        id: 'P58',
        group: 'tools',
        title: '为什么有些特定的推理模型不支持 MCP 协议？',
        body: `
<p><strong>简要回答</strong></p>
<p>根本原因是两者的生成范式有冲突。</p>
<p>推理模型在给出答案之前，会先跑一段完整的“思维链”，这个 thinking 过程是一次性连续生成的，不能中途打断。但工具调用天然是多轮交互：模型输出调用请求 → 暂停等工具执行 → 拿到结果再继续生成。这两种模式没法兼容：你没法在思考链跑到一半的时候暂停去等工具结果，否则之前的推理上下文全断了。</p>
<p>而 MCP 底层就是靠 Function Calling 驱动的，推理模型连 Function Calling 都支持不好，MCP 自然也用不了。</p>
<p>当然这个问题不是无解的。后来 o3 和 Claude Extended Thinking 都找到了折中方案，比如让工具调用发生在思考阶段结束之后，保证思考过程还是一次性完整生成的。</p>
`,
      },
      {
        id: 'P59',
        group: 'tools',
        title: 'Skill 是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>Agent Skill 是把“指令、脚本、模板”一体化打包成可复用能力包的机制。关键在三点：Agent 能自动发现它、按需加载它、在需要时调用里面的脚本和资源。它不只是“存 prompt”，而是一份 Agent 能自己翻阅的“操作手册 + 工具箱”。每个 Skill 是一个文件夹，里面有一份 <code>SKILL.md</code> 指令文件，还可以带脚本、模板、参考文档等资源。</p>
<p><strong>和普通 prompt 的区别</strong>：Skill 能被 Agent 自动发现、按需加载，不用每次手动输入。<strong>和 MCP 工具的区别</strong>：MCP 给 Agent 提供外部工具和数据的访问能力，Skill 教 Agent 拿到这些工具和数据之后该怎么用。</p>
<p>Anthropic 在 2025 年 10 月推出了 Agent Skills，同年 12 月把规范作为开放标准发布，允许其他 Agent 平台按照这套格式兼容 Skills 生态。</p>
`,
      },
      {
        id: 'P60',
        group: 'tools',
        title: 'MCP 和 Agent Skill 的区别是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>MCP 和 Agent Skill 不是同类概念，不是竞争关系，而是互补的。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>维度</th><th>MCP</th><th>Agent Skill</th></tr>
</thead>
<tbody>
<tr><td>解决什么</td><td>Agent 怎么获得外部能力</td><td>Agent 拿到能力后，按什么步骤、什么标准完成任务</td></tr>
<tr><td>具体做什么</td><td>把数据库、API、文件系统标准化封装成服务，Agent 查数据、调接口、读写文件</td><td>把某类工作的知识和流程打包成可复用模块</td></tr>
<tr><td>类比</td><td>给 Agent 配的电脑和软件</td><td>给 Agent 发的操作手册和 SOP</td></tr>
<tr><td>关系</td><td>被流程调用</td><td>定义流程，流程中调用 MCP 工具</td></tr>
</tbody>
</table>
</div>
<p>实际系统里两者经常同时工作：Skill 定义流程，流程中调用 MCP 提供的工具。</p>
`,
      },
      {
        id: 'P61',
        group: 'tools',
        title: 'Function Calling、Skill、MCP 这三个有什么区别？',
        body: `
<p><strong>简要回答</strong></p>
<p>这三个概念在不同层次工作，不是竞争关系。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>层次</th><th>解决什么</th></tr>
</thead>
<tbody>
<tr><td>Function Calling</td><td>最底层的调用协议：模型怎么调函数。模型输出结构化 JSON，告诉程序该调哪个函数、传什么参数</td></tr>
<tr><td>MCP</td><td>在 Function Calling 之上做工具标准化：工具怎么暴露给模型。把数据库、API 等外部能力封装成标准化服务，一次实现到处复用</td></tr>
<tr><td>Agent Skill</td><td>最上层做知识和流程封装：拿到工具之后按什么流程完成任务。把执行步骤、标准、脚本、模板打包成可复用模块</td></tr>
</tbody>
</table>
</div>
<p>简单记：<strong>Function Calling 是语言，MCP 是工具箱，Skill 是操作手册</strong>。</p>
`,
      },
      {
        id: 'P62',
        group: 'tools',
        title: '什么是 A2A 协议？它和 MCP 协议的区别是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>A2A 是 Google 发布的开放协议，专门解决多个 AI Agent 之间怎么互相通信协作的问题。</p>
<p>和 MCP 的区别在于分工不同：<strong>MCP 解决「单个 Agent 怎么连工具和数据」，A2A 解决「多个 Agent 之间怎么分工协作」</strong>。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>维度</th><th>MCP</th><th>A2A</th></tr>
</thead>
<tbody>
<tr><td>连接方向</td><td>Agent 向下连工具和数据</td><td>Agent 向上连其他 Agent</td></tr>
<tr><td>解决什么</td><td>单个 Agent 怎么获得外部能力</td><td>多个 Agent 之间怎么分工、委托、协作</td></tr>
<tr><td>典型动作</td><td>查数据库、调 API、读写文件</td><td>把子任务委托给专业 Agent，接收方按自己的 Skill 声明承接</td></tr>
<tr><td>能力</td><td>工具标准化、一次实现到处复用</td><td>支持异步长任务和流式推送结果</td></tr>
</tbody>
</table>
</div>
<p>两者是互补的，不冲突：<strong>MCP 向下连工具，A2A 向上连 Agent</strong>，复杂的多 Agent 系统里通常两个都要用到。</p>
`,
      },
      {
        id: 'P63',
        group: 'tools',
        title: 'MCP 协议通常采用什么通信方式？',
        body: `
<p><strong>简要回答</strong></p>
<p>MCP 支持两种主要传输方式，分别适用于不同场景。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>场景</th><th>传输方式</th><th>说明</th></tr>
</thead>
<tbody>
<tr><td>本地</td><td>stdio</td><td>Client 把 Server 作为子进程启动，通过标准输入输出通信；延迟极低，不用开端口，也没有网络安全问题。用 Claude Desktop 接本地工具走的就是这种方式</td></tr>
<tr><td>远程</td><td>Streamable HTTP</td><td>Server 作为独立的 HTTP 服务部署，多个 Client 可以共享同一个 Server，适合团队统一管理工具服务</td></tr>
</tbody>
</table>
</div>
<p>MCP 早期版本（2024-11-05 规范）的远程传输是「HTTP + SSE」双端点方案，2025 年 3 月的规范更新里被标记为 <strong>deprecated</strong>（保留向后兼容但不推荐新项目使用），Streamable HTTP 成为推荐的远程传输方式。</p>
<p>不管哪种传输方式，底层消息格式都统一用 <strong>JSON-RPC 2.0</strong>，传输方式只影响「怎么传」，消息协议本身不变。</p>
`,
      },
      {
        id: 'P67',
        group: 'tools',
        title: '工具很多时，Agent 如何做 Tool Routing，减少 Token 并避免选错工具？',
        body: `
<p><strong>简要回答</strong></p>
<p>工具很多时，不会把全部 Schema 都塞给模型，而是做<strong>分层 Tool Routing</strong>。</p>
<ol>
<li><strong>维护统一的工具注册表</strong>：给工具补齐命名空间、标签、适用场景、参数 Schema、权限、风险等级和可用状态。</li>
<li><strong>硬过滤</strong>：每次请求先用产品范围、租户、用户角色、环境和当前任务状态做硬过滤，把无权调用或当前不可用的工具直接隐藏。</li>
<li><strong>两级召回</strong>：一级用规则或轻量分类模型判断工具类别，比如检索类、订单类、支付类；二级在相关类别内，用关键词、BM25、Embedding 或混合检索召回少量候选工具。</li>
<li><strong>动态绑定</strong>：最后只把候选工具的完整描述和 Schema 绑定给 LLM，让它判断是否调用、选哪个工具以及怎样填参数。</li>
</ol>
<p>注意区分：<strong>Tool Routing 路由的是「工具候选集」，Multi-Agent Routing 路由的是「任务由哪个 Agent 接手」</strong>，这两个层次可以配合，但不能混为一谈。</p>
<p><strong>上线后看这些指标</strong>：候选工具的 Recall@K、最终工具选择准确率、无工具场景的拒选准确率、参数合法率、任务成功率、工具 Schema Token、端到端延迟和越权暴露率。低置信度时优先澄清或扩大召回，不能让模型猜一个高风险工具直接执行。</p>
`,
      },
      {
        id: 'P68',
        group: 'tools',
        title: '工具调用格式非法、参数错误、超时或失败时，Agent 如何容错？',
        body: `
<p><strong>简要回答</strong></p>
<p>把工具调用拆成<strong>决策 → 校验 → 执行 → 确认 → 恢复</strong>五个阶段，每个阶段使用不同的处理方式。</p>
<p><strong>决策阶段</strong>：模型选错工具、JSON 不合法或缺少参数时，先用结构化输出和 Schema 拦截，再把明确的校验错误交给模型重新生成。</p>
<p><strong>校验阶段</strong>：参数满足 Schema 后，服务端还要检查业务约束、用户身份、工具权限和风险级别，不能信任模型自己判断权限。</p>
<p><strong>执行阶段</strong>：只对限流、连接失败和部分 5xx 这类瞬时故障做有界重试，并同时满足三个条件——调用可以安全重放、总时间预算还有余量、重试次数没有超限。退避要加抖动，遇到 <code>Retry-After</code> 就尊重服务端建议。参数错误、权限不足和明确的业务失败应该修参数、重新规划或询问用户，不能原样重试。</p>
<p><strong>确认阶段</strong>：付款、发邮件、创建订单这类工具还要处理「结果未知」。第一次调用前生成幂等键并写入 Checkpoint，重试和恢复时复用同一个键；超时后先按幂等键查询状态，确认没有执行再决定是否重试。查不清时暂停任务并转人工，避免重复副作用。</p>
<p><strong>恢复阶段</strong>：系统还需要熔断、降级、故障转移和统一的结构化错误。Trace 里记录每次调用的工具版本、参数摘要、耗时、重试决策、幂等键摘要和最终状态，敏感参数要脱敏，方便告警、复盘和审计。</p>
`,
      },
      {
        id: 'P69',
        group: 'tools',
        title: '为什么要把 Agent 的工具执行流程封装成 CLI？',
        body: `
<p><strong>简要回答</strong></p>
<p>封装成 CLI，主要是为了让工具流程能够独立运行，并被不同调用方复用。业务逻辑与聊天状态分开以后，同一套能力既能给 Agent 调用，也能给开发者调试、脚本和定时任务使用，不需要每次都启动整个 Agent 应用。</p>
<p>另一个好处是便于调试和自动化。CLI 有明确的参数、结果和退出状态，工具出错时，可以拿对应输入和环境单独运行，检查是工具本身的问题，还是 Agent 选错了工具、传错了参数。机器调用时，还可以把结构化结果与诊断日志分开，避免靠终端里一句「成功」判断业务是否完成。</p>
<p>流程里已经确定的步骤，也可以由工具代码统一组织。模型负责选择工具和填写参数，宿主负责启动 CLI、接收结果，再交回模型，内部步骤就不用每次重新编排。</p>
<p><strong>代价</strong>：CLI 会增加进程启动、数据传递和部署成本，也不会自动提供权限隔离。它更适合需要独立运行、多入口复用的工具流程；只在当前程序里使用的小函数，直接调用通常更合适。</p>
`,
      },
      {
        id: 'P70',
        group: 'tools',
        title: 'Agent 接入工具时应该如何选择 CLI 或 MCP？',
        body: `
<p><strong>简要回答</strong></p>
<p>主要看<strong>调用方的接入需求和维护成本</strong>。CLI 提供命令行执行入口，MCP 约定客户端与服务端怎样发现和调用能力，两者可以组合，不一定要互相替换。</p>
<ul>
<li><strong>只有一个可控的 Agent 宿主，且已有稳定的 CLI</strong>：直接适配通常更简单。宿主维护工具说明，把模型生成的参数转换成命令参数，再解析执行结果。</li>
<li><strong>一项能力要被多个兼容 MCP 的宿主复用</strong>：MCP 更有价值。工具描述、参数结构和调用方式通过统一协议提供，减少重复接入。</li>
</ul>
<p>已有 CLI 也可以由 MCP Server 包装，业务逻辑继续复用。部署位置则要单独考虑：MCP 能通过 stdio 连接本地进程，也能通过 Streamable HTTP 提供网络服务；CLI 本身也可以访问远程 API。最终要比较安装、版本维护、调用开销和权限管理，不能只按「本地用 CLI、远程用 MCP」来选。</p>
`,
      },
      {
        id: 'P71',
        group: 'ai-coding',
        title: 'Agent 的代码执行沙箱应该如何设计？',
        body: `
<p><strong>简要回答</strong></p>
<p>核心是让代码只拿到当前任务需要的权限，并把资源消耗限制在预算里。模型生成的代码要按<strong>不可信代码</strong>处理，不能只靠 Prompt 约束，也不应该直接继承宿主的全部权限。</p>
<p><strong>执行环境</strong>：只提供本次任务的输入，输入设为只读，给临时目录和输出目录写权限，用低权限身份运行。网络按需开放，宿主凭据和管理接口不交给代码。资源限制覆盖 CPU、内存、进程数量和运行时间，并作用于整个任务的进程集合，而不只是启动的那个进程。</p>
<p><strong>隔离实现</strong>：容器可以作为实现，但需要检查挂载、权限和网络配置，而且普通 Linux 容器共享宿主内核。面对任意用户代码或更高的隔离要求，可以评估虚拟机等更强边界，同时考虑启动成本和兼容性。</p>
<p><strong>运行管理</strong>：任务由沙箱外的运行器管理——准备输入，启动受限执行，超时或取消时终止整个执行单元，核对并导出允许的产物，最后清理环境。沙箱负责限制代码的影响范围；结果是否符合业务要求，还要另外验证。</p>
`,
      },
      {
        id: 'P108',
        group: 'ai-coding',
        title: '如何向 AI 描述开发需求、约束条件和验收标准？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先讲清这次开发要改变什么行为，再提供理解这个任务需要的项目背景，比如当前接口是什么、已有行为有什么问题、相关代码在哪里。功能需求里，我会明确输入输出，以及会影响结果的边界和失败处理，避免让 AI 自己补业务规则。</p>
<p>然后我会说明修改范围和必须保留的约定，比如接口兼容性、依赖版本，以及哪些已有行为不能改变。硬约束和偏好我会分开写，实现细节则尽量沿用项目约定，给 AI 留出选择空间。</p>
<p><strong>验收标准会在编码前从需求里推导</strong>，写成「在什么条件下，应该观察到什么结果」。重点覆盖新增行为、关键边界和需要保留的原有行为。测试通过可以作为证据，但预期结果要依据已经确认的规则，不能跟着 AI 生成的实现来改。</p>
<p>对不确定的内容，我会先区分是<strong>项目事实还是规则决策</strong>：接口和现有实现可以让 AI 查源码确认；会改变用户可见行为的规则，应该向我确认。任务较复杂时，我会让它先复述目标、约束和验收条件，检查有没有漏掉或误解，再开始修改。</p>
<p>这样生成之前就有了交付依据，后续发现问题，也能判断是实现偏了、需求需要调整，还是验证还没完成。</p>
`,
      },
      {
        id: 'P109',
        group: 'ai-coding',
        title: 'Coding Agent 如何在大型代码仓库中定位相关代码？',
        body: `
<p><strong>简要回答</strong></p>
<p>大型仓库里的代码定位，核心是<strong>先缩小搜索范围，再沿代码关系补齐上下文</strong>。需求里的业务描述和源码命名不一定一致，所以要先结合目录结构，把接口路径、报错文本、日志、字段名或者堆栈转成可以搜索的线索。</p>
<p>有明确标识时，文本搜索通常更直接；只有模糊的业务描述时，可以用语义检索寻找候选。命中后还要读取完整函数和相关类型，用跳转定义、查找引用等工具确认符号，避免把同名代码当成同一个实现。</p>
<p>接下来要看调用方、被调用方，以及数据读写和事件传递关系，把分散在多个文件里的实现连起来。配置和注册代码也要核对，因为它们会影响当前实际使用哪个实现。</p>
<p>定位到什么程度取决于任务：新增功能需要确认实现职责和修改会影响的范围；排查故障还要结合日志、执行轨迹或最小复现验证原因。整个过程应围绕当前问题逐步读取代码，并保留路径、关键符号和验证依据，支持后续修改。</p>
`,
      },
      {
        id: 'P110',
        group: 'ai-coding',
        title: 'Vibe Coding 和 Spec 驱动开发有什么区别？分别适合什么场景？',
        body: `
<p><strong>简要回答</strong></p>
<p>我理解的 Vibe Coding，采用的是较严格的含义：<strong>用自然语言让 AI 生成和修改代码，开发者主要看运行效果、继续反馈，对生成代码本身的理解和审查较少</strong>。如果我会阅读改动、理解实现并做验证，即使没有专门的规格文档，也可以属于普通的 AI 辅助开发。</p>
<p><strong>Spec 驱动开发</strong>则会先把已经确认的行为、约束和验收条件写成规格，再组织实现和验证。像 Spec Kit 这样的工具，会用 <code>spec.md</code> 说明做什么、<code>plan.md</code> 说明怎么做、<code>tasks.md</code> 安排具体步骤，再通过对应的 Skill 推进。需求变更时，也要更新受影响的文档和检查。文件可以很短，关键是规则有确认依据，后续能持续对照它们。</p>
<p><strong>两者的差别主要在怎么处理不确定性</strong>：想法还没成形时，快速生成原型、看效果再调整，能够帮助探索；规则已经明确，需要兼容已有系统、多人协作或长期维护时，按规格组织开发更容易追踪要求和验证结果。</p>
<p><strong>实际工作中，我会根据任务阶段组合使用</strong>：先用低成本、容易舍弃的原型确认方向；准备进入正式交付时，再明确规格、检查原型代码，并补齐验证。我不会因为原型能跑就直接继承全部实现，也不会把规格写得很长当成质量保证。</p>
`,
      },
      {
        id: 'P111',
        group: 'ai-coding',
        title: '复杂开发需求如何拆分，才能让 AI 更可靠地完成？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先结合需求和现有代码，找出要改变的行为、需要保留的约定，以及哪些地方还没弄清楚，再按<strong>可验证的目标</strong>拆任务。</p>
<p>每个任务要说明依据、修改范围、依赖和完成标准。粒度以能理解、能检查为准，一个任务可以跨多个文件；相关实现和必要验证也要一起安排。比如给查询增加筛选，筛选条件怎样进入查询、怎样影响结果和总数，需要作为同一项行为来考虑，不能分别改完却没人检查它们是否一致。</p>
<p>执行顺序上，我会先确认共享接口和必要的前置条件，优先打通一条能够验证的链路，再逐步扩展。只有依赖已经满足、修改范围不会冲突的任务，才考虑并行，最终还要验证它们组合后的行为。</p>
<p>我会把任务、依赖和验证结果保存在 <code>tasks.md</code> 里。执行中发现新依赖、需求变化或者原来判断不成立，就更新受影响的剩余计划。完成依据是实际改动和检查结果，最后再对照总需求做集成和回归检查，确保局部任务都完成以后，整体功能也成立。</p>
`,
      },
      {
        id: 'P112',
        group: 'ai-coding',
        title: '如何保证 AI 生成代码的质量？',
        body: `
<p><strong>简要回答</strong></p>
<p>判断 AI 生成的代码能不能交付，主要看它是否符合需求、是否破坏已有行为，以及能否安全地接入项目。<strong>代码能运行只是基础</strong>，模型的解释和自我审查不能代替实际验证。</p>
<p><strong>生成前</strong>要明确输入输出、边界条件和不允许改变的行为，再提供相关源码、真实接口和项目约束，让修改集中在必要范围。这样既减少模型猜测，也方便后续检查每一处改动。</p>
<p><strong>生成后</strong>要先做构建、类型和静态检查，再用测试验证业务行为和真实调用链。测试预期必须有独立的需求依据，不能照着生成实现反推，否则实现和测试可能一起错。已有测试还要做相关回归，检查这次修改有没有破坏原来的功能。</p>
<p><strong>最后审查实际代码差异</strong>，重点看业务规则、权限边界和修改范围。发现失败就根据规则修复，不能靠删断言、跳过检查把结果改绿；修复后重新验证受影响部分。交付判断要依据最终这份代码的检查结果，并说明还有哪些重要条件没有验证。</p>
`,
      },
      {
        id: 'P113',
        group: 'ai-coding',
        title: '如何审查 AI 生成的代码，发现「看起来合理但实际错误」的实现？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先对照需求和必须保留的约定，看实际代码差异，确认改了哪些文件、增加或删除了什么。审查范围也包括测试、依赖和检查配置，避免只看 AI 的完成说明。</p>
<p>接着，我会把改动转成行为问题：哪些条件变了，数据从哪里来、经过什么处理、最后影响谁。关键位置要补读调用方和依赖，重点检查业务边界、权限范围、错误处理和接口兼容性。判断依据是项目规则和当前实现，<strong>代码的名字、注释和解释只能辅助理解</strong>。</p>
<p>发现疑点以后，我会找出具体触发条件，说明预期结果与实际结果的差别，再用源码推导或最小复现核验。还要检查外围是否已经处理了这个条件，避免把局部片段里的疑点直接当成缺陷。</p>
<p>测试也需要审查：是否真的触发了目标路径，断言是否依据独立规则，以及有没有通过删断言、放宽预期让结果变绿。AI 可以帮助寻找遗漏，但每条意见都要核实。最后按影响处理问题，修复后重新检查最终差异和相关验证，并说明仍未确认的范围。</p>
`,
      },
      {
        id: 'P114',
        group: 'ai-coding',
        title: '如何利用报错、日志和测试结果，让 AI 排查并修复问题？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先把问题复现清楚，给 AI 明确的预期结果、实际结果、触发步骤，以及对应的代码版本、运行环境和执行命令。报错保留异常信息和相关调用栈，日志筛出同一次请求或测试的关键过程，避免把无关输出混进去。</p>
<p>接着，我会让它沿报错位置追踪输入和数据来源，提出有依据的原因假设，并说明下一步怎样区分这些假设。每轮先做能缩小范围的检查，例如读取依赖契约、观察中间值或构造最小复现，再按结果更新判断。</p>
<p>确认原因后，我会要求它按原有业务约定修复，保留正常行为和错误语义。比如遗漏异步等待，就应当等查询结果回来再处理，不能靠返回默认值让报错消失。</p>
<p>最后用原来的复现条件检查修复，补上能在旧实现中失败的回归用例，再检查相关路径和最终差异。<strong>AI 的解释属于判断，实际执行结果才是验证依据</strong>；无法复现或尚未验证的部分，我会单独说明。</p>
`,
      },
      {
        id: 'P115',
        group: 'ai-coding',
        title: '如何保证 AI 生成的测试用例覆盖关键业务场景？',
        body: `
<p><strong>简要回答</strong></p>
<p>关键是<strong>先把业务规则对应到场景，再让 AI 生成测试</strong>，而不是只按函数数量分配用例。场景要从输入范围、业务状态、权限条件和流程中的失败点推导；涉及重复请求或并发时，还要考虑操作顺序。</p>
<p>每条用例都需要明确前置状态、执行操作和预期结果，并确认测试真的触发了目标条件。比如测试重试，就不能只模拟一次失败，还要检查后续执行有没有违反业务约定。正确预期要来自需求、已确认样例或可信参考模型，不能照着待测实现反推。</p>
<p>生成后要把关键规则与实际运行的测试对应起来，检查哪些规则没有用例、哪些只有正常路径，以及断言有没有观察关键结果。<strong>代码覆盖率能帮助发现没执行的区域，但不能证明业务已经做对</strong>。</p>
<p>对重要规则，还可以在测试副本里故意破坏相关逻辑，看现有用例能否失败，再补充遗漏。AI 负责辅助扩展和编写，规则、预期与实际执行结果仍要核对，最后明确已验证的范围和剩余缺口。</p>
`,
      },
      {
        id: 'P116',
        group: 'ai-coding',
        title: 'AI 编程的上下文越来越长时，如何保留关键信息？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先围绕下一步开发整理当前状态，保留目标、不能违反的约束、当前采用的方案、代码改到哪里、验证结果和剩余问题。聊天过程里重复的讨论、大段源码和日志，可以压缩成结论并保留读取位置；关键条件和结论的适用范围要写清楚。</p>
<p>摘要不能只写「已经完成、测试通过」。我会区分<strong>代码已修改</strong>和<strong>行为已验证</strong>，记录测试对应的版本或工作区状态，以及修改后有没有重跑。旧方案已经替换、某个原因只是猜测，也要标明，避免整理以后又被当成当前依据。</p>
<p>我通常把核心状态放进一份简短的 Markdown 记录，详细规则、源码和原始结果保留在各自的位置。需要使用时，确认相关内容已经进入模型的当前输入，并按路径和符号补读。文件存在，并不等于模型已经读过。</p>
<p>需求变化、完成一个阶段或上下文明显变杂时，我会更新摘要，移除重复和失效内容。继续开发前，让 AI 复述当前约束与下一步验证，再对照原始材料核验关键判断。这样保留的是能够继续工作的状态，同时还留着回查证据的入口。</p>
`,
      },
      {
        id: 'P117',
        group: 'ai-coding',
        title: 'Coding Agent 如何避免被过期的代码描述误导？',
        body: `
<p><strong>简要回答</strong></p>
<p>代码描述是根据源码提炼出来的摘要，可以帮助 Agent 找到相关实现，但<strong>关键判断还要回到源码核验</strong>。判断描述是否过期，主要看它依据的代码和依赖有没有变化，不能只看生成日期。</p>
<p>生成描述时，需要记录对应的仓库、路径、符号和源码版本，并保存生成输入的内容指纹。代码变化后，先把受影响的描述标为失效，停止作为当前信息返回，再增量重建。影响范围还包括依赖这些代码的职责说明和上层摘要，不能只处理改动文件。</p>
<p>检索描述和读取源码要对齐目标版本；本地代码还没提交时，也要检查实际文件的变化。更新期间可以直接读取源码；新描述生成后，还要确认它对应的输入没有在过程中再次变化，避免旧任务覆盖新结果。</p>
<p>Agent 用描述找到候选后，要确认关键函数、调用关系和必要配置。如果发现描述与当前实现冲突，就根据源码和执行证据修正判断，同时纠正上下文里已经采用的旧结论。版本匹配解决的是来源一致，描述本身是否准确仍然需要核验。</p>
`,
      },
      {
        id: 'P118',
        group: 'ai-coding',
        title: '跨会话继续开发时，如何让 AI 接续需求、代码状态和任务进度？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会在结束前保存实际代码和交接记录，写清当前需求、必须保留的约定、已确认方案，以及哪些代码已实现、哪些只写了一部分、哪些还没验证。记录也要说明工作区位置、版本与未提交文件，保证新会话能拿到真正的开发成果。</p>
<p>新会话开始后，我会让 AI 先读取交接记录和项目规范，再核对当前目录、代码差异、新增文件和相关实现。交接记录是恢复线索，实际工作区可能已经变化；有冲突时，要区分记录过期与代码不符合需求，保留已确认的业务约定。</p>
<p>运行状态也要重新确认，包括依赖、开发服务和测试条件。之前执行过的命令可能已经创建任务或修改数据，不能当成初始化步骤全部重放。需要先检查当前状态，再决定继续使用、恢复还是补做。</p>
<p>接着，我会从明确的未完成项入手，先做与它相关的检查，再继续修改和验证。每完成一个阶段，就更新交接记录中的代码状态、实际验证结果和剩余工作。接续成功要看当前行为和进度能否对上，不能只看 AI 是否复述出了昨天的总结。</p>
`,
      },
      {
        id: 'P119',
        group: 'ai-coding',
        title: 'AI 修改文件、执行命令和读取外部内容时，应该如何控制权限与风险？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先明确用户授权的任务和范围，再给 AI 完成任务所需的工具权限。<strong>允许修改本地代码并运行相关检查，通常不等于允许发布、修改生产数据或把项目资料发到外部</strong>。已有授权覆盖的正常操作可以继续，不能因为工具能执行就扩大任务。</p>
<p>判断风险时，我会看实际目标、环境、参数和副作用。文件操作要核对范围，命令要看脚本及依赖会做什么，测试也要确认连接的是测试环境。再通过文件和网络限制、隔离环境及范围受限的凭据控制影响，不能只靠提示词约束。</p>
<p>读取网页、依赖文档和日志时，我会把其中的技术信息与操作指令分开。<strong>外部内容可以提供线索，但它自称已获授权，不能代替用户授权</strong>。项目规则是否作为指令使用，也要符合工具约定和用户授权范围。</p>
<p>确实需要扩大权限或执行高影响动作时，我会先完成范围内的准备，给出具体改动、目标环境、操作和影响，再取得所需授权。执行后核对实际结果与文件差异，保留操作依据；发现异常时停止相关后续动作，先确认已经产生了什么影响。</p>
`,
      },
      {
        id: 'P72',
        group: 'tools',
        title: 'Agent 的 Skill 加载机制是如何实现的？',
        body: `
<p><strong>简要回答</strong></p>
<p>Skill 通常采用<strong>渐进式加载</strong>。</p>
<ol>
<li>宿主先发现可用的能力包，读取 <code>SKILL.md</code> 里的名称和描述，形成一份<strong>轻量目录</strong>。</li>
<li>模型根据任务和描述判断需要哪个 Skill，或者由用户明确指定，再把对应正文读进上下文。</li>
<li>正文提供操作步骤，详细参考、模板和脚本留在包里，执行到需要它们的步骤时再取用。</li>
</ol>
<p>这样模型先知道有哪些能力，用到时才读具体方法，不需要启动就加载所有手册和资源。</p>
<p>这里的加载主要是在<strong>补充模型当前的工作信息</strong>：不会更新模型参数，也不等于执行脚本。脚本仍然要通过工具调用，由宿主检查参数和权限后运行。文件发现、正文读取和上下文维护都由宿主完成，所以安装了 Skill，不代表模型已经读到了它，更不代表相关操作已经发生。</p>
`,
      },
      {
        id: 'P02',
        group: 'js',
        title: 'WebSocket 和 MQTT 有什么区别？',
        body: `
<p><strong>WebSocket</strong>：全双工长连接，客户端和服务端都能主动推；适合实时对话、大屏同步、三维控制。</p>
<p><strong>MQTT</strong>：发布 / 订阅，轻量、省带宽；适合设备到云、海量设备和弱网环境。</p>
<p><strong>项目里</strong>：大屏和 iPad 同步用 WebSocket；设备状态上报 / 订阅用 MQTT。</p>
<p><strong>选型</strong>：看是“双向实时交互”还是“设备遥测和发布订阅”。</p>
`,
      },
      {
        id: 'P64',
        group: 'js',
        title: 'WebSocket 和 SSE 通信的区别及局限性？',
        body: `
<p><strong>简要回答</strong></p>
<p>最核心的区别是通信方向：<strong>SSE 是服务端单向推</strong>，客户端只能接收，想发消息只能另起一个 HTTP 请求；<strong>WebSocket 是全双工</strong>，双方都可以随时主动发消息。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>维度</th><th>SSE</th><th>WebSocket</th></tr>
</thead>
<tbody>
<tr><td>通信方向</td><td>服务端到客户端单向推送</td><td>全双工，双方随时主动发</td></tr>
<tr><td>适用场景</td><td>LLM 流式输出：模型一直在推 token、用户只是看</td><td>真正需要双向实时交互，比如用户要在模型说话过程中随时打断</td></tr>
<tr><td>优点</td><td>轻量、HTTP 原生支持、运维简单；OpenAI 和 Anthropic 的 API 用的都是 SSE</td><td>双向、低延迟</td></tr>
<tr><td>局限</td><td>HTTP/1.1 下有连接数上限；只支持文本传输</td><td>有状态、横向扩展麻烦；容易被企业代理或防火墙拦住</td></tr>
</tbody>
</table>
</div>
<p>大多数 LLM 文字对话产品用 SSE 就够了；WebSocket 的复杂性只有在真正需要双向实时交互时（比如随时打断）才值得引入。</p>
`,
      },
      {
        id: 'P65',
        group: 'js',
        title: '为什么要用 WebRTC？它和 WebSocket 在 AI 对话流中的核心差异是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>核心原因是 <strong>WebSocket 基于 TCP，而 TCP 的可靠性设计在实时语音场景里反而是负担</strong>。</p>
<p>语音可以容忍丢包，但绝对不能容忍延迟；一旦网络抖动丢了包，TCP 强制等重传，后续所有音频都得跟着等，延迟一堆积通话就卡。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>维度</th><th>WebSocket</th><th>WebRTC</th></tr>
</thead>
<tbody>
<tr><td>传输层</td><td>TCP</td><td>UDP</td></tr>
<tr><td>丢包处理</td><td>强制重传，后续数据一起等</td><td>丢包不等重传，直接用插值算法填补</td></tr>
<tr><td>延迟表现</td><td>网络抖动时延迟堆积</td><td>用一点音质损失换稳定低延迟，能控制在 50 到 150 毫秒</td></tr>
<tr><td>内置能力</td><td>都要自己实现</td><td>内置回声消除、噪声抑制、自适应码率等语音处理</td></tr>
</tbody>
</table>
</div>
<p>所以 OpenAI Realtime API 这类实时语音产品选 WebRTC，就是因为 TCP 根本撑不住语音场景的延迟要求。</p>
`,
      },
      {
        id: 'P66',
        group: 'llm-eng',
        title: '有没有用过大模型的网关框架？网关层解决了什么问题？',
        body: `
<p><strong>简要回答</strong></p>
<p>用过的网关框架是 LiteLLM，它目前是<strong>最活跃的开源 LLM 网关</strong>。网关本质上是架在应用和模型 API 之间的中间层，主要解决几个实际问题。</p>
<ul>
<li><strong>多模型统一接口</strong>：业务代码只调一个地方，想换模型只改网关配置，不用动应用代码。</li>
<li><strong>API Key 集中管理</strong>：不用每个服务都存一份，降低泄漏风险。</li>
<li><strong>限流和配额</strong>：可以给不同团队分别设 token 预算，防止某个团队把整个公司的额度用光。</li>
<li><strong>成本追踪</strong>：所有请求的 token 用量都在网关记录，方便统计哪个服务最烧钱。</li>
<li><strong>语义缓存</strong>：两个用户问了语义相近的问题，直接命中缓存返回上次的结果，根本不打底层模型，省钱还降延迟。</li>
</ul>
`,
      },
    ],
  },

]

export const predictedGroups = [
  {
    id: 'predicted-agent',
    group: 'agent',
    title: 'Agent 面试题',
    description: '定义、架构、范式、记忆、多智能体、可靠性与评估。',
  },
  {
    id: 'predicted-rag',
    group: 'rag',
    title: 'RAG 面试题',
    description: '切片、召回、融合、证据与评测。',
  },
  {
    id: 'predicted-tools',
    group: 'tools',
    title: 'LLM 工具调用面试题',
    description: 'Function Call、MCP、工具目录与参数校验。',
  },
  {
    id: 'predicted-llm-eng',
    group: 'llm-eng',
    title: '大模型工程面试题',
    description: '上下文、延迟、数据库安全、压缩与稳定性。',
  },
  {
    id: 'predicted-langchain',
    group: 'langchain',
    title: 'LangChain 框架面试',
    description: 'LangChain、LangGraph、LCEL 与选型。',
  },
  {
    id: 'predicted-ai-coding',
    group: 'ai-coding',
    title: 'AI 编程面试',
    description: '用大模型写代码、验证与工程约束。',
  },
  {
    id: 'predicted-js',
    group: 'js',
    title: 'JavaScript 面试',
    description: 'JS 基础与前端通信。',
  },
]

export const categoryOrder = [
  'project-intro',
  'predicted',
  'project-architecture',
  'agent',
  'resume-keywords',
  'compare-pressure',
  'frontend',
]

export const totalQuestions = categories.reduce(
  (sum, category) => sum + category.questions.length,
  0,
)
