export const categoryPrefixes = {
  frontend: 'FE',
  'predicted-agent': 'AG',
  'predicted-rag': 'RA',
  'predicted-tools': 'TL',
  'predicted-llm-eng': 'LM',
  'predicted-langchain': 'LC',
  'predicted-ai-coding': 'AC',
  'project-intro': 'IN',
}

export function categoryPrefix(categoryId) {
  return categoryPrefixes[categoryId] ?? categoryId.toUpperCase()
}

export function questionLabel(categoryId, index) {
  return `${categoryPrefix(categoryId)}-${String(index + 1).padStart(2, '0')}`
}

export function questionAnchor(categoryId, index) {
  return `${categoryId}-${String(index + 1).padStart(2, '0')}`
}

export const categories = [
  {
    id: 'frontend',
    title: '前端与 JavaScript',
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
<p>工程上：服务器推送取消可以用 <code>AbortController</code>；模型调用要设超时和兜底。</p>
`,
      },
      {
        id: 'Q35',
        title: 'TypeScript：type 和 interface 的区别',
        body: `
<ul><li><code>interface</code> 可声明合并，适合对象结构；<code>type</code> 能表达联合、交叉、条件类型。</li><li><code>type</code> 不能重复声明合并；<code>interface</code> 更适合扩展。</li><li>实际接口契约常用 <code>type</code> + Zod 校验；组件 props 用 <code>interface</code> 也常见。</li></ul>
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
<p>工程上：Markdown 渲染用 DOMPurify；接口做参数校验。</p>
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
      {
        id: 'P02',
        title: 'WebSocket 和 MQTT 有什么区别？',
        body: `
<p><strong>WebSocket</strong>：全双工长连接，客户端和服务端都能主动推；适合实时对话、大屏同步、三维控制。</p>
<p><strong>MQTT</strong>：发布 / 订阅，轻量、省带宽；适合设备到云、海量设备和弱网环境。</p>
<p><strong>例如</strong>：大屏和 iPad 同步可以用 WebSocket；设备状态上报 / 订阅可以用 MQTT。</p>
<p><strong>选型</strong>：看是“双向实时交互”还是“设备遥测和发布订阅”。</p>
`,
      },
      {
        id: 'P64',
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
<p>我会把 Agent 框架理解成一个围绕 LLM 的闭环决策系统：<strong>大模型 + Planner + Memory + Tools + Executor + Evaluator</strong>，再加上状态管理、权限控制和日志观测等工程模块。</p>
<ul>
<li><strong>大模型</strong>：整个系统的大脑，负责理解任务和做决策。</li>
<li><strong>Planner</strong>：把用户目标转成可执行步骤。</li>
<li><strong>Memory</strong>：提供短期对话状态，以及长期知识、偏好和历史经验。</li>
<li><strong>Tools</strong>：把模型能力扩展到搜索、数据库、代码执行、业务 API 等外部动作。</li>
<li><strong>Executor</strong>：调度工具、推进步骤、维护中间状态。</li>
<li><strong>Evaluator</strong>：判断每一步和最终结果是否满足目标，并触发重试、改写计划或人工接管。</li>
</ul>
<p><strong>组件边界要清楚</strong>：Planner 不应直接执行副作用工具；Tools 不应承担业务决策；Evaluator 不能只看模型自评，还要结合规则、测试、业务校验和用户反馈。</p>
<p>生产里再加执行循环、状态管理、权限控制和日志观测。</p>
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
<p><strong>短期记忆不只放原始聊天</strong>：通常分四类——最近几轮原始对话（保留语气和未完成指代）、滚动摘要（压缩长上下文）、结构化事实（用户偏好、约束、任务目标）、工具状态（已查到的结果、执行进度和外部系统返回）。</p>
<p><strong>抽取时机</strong>：每轮对话后、工具调用后、任务阶段切换时，或上下文接近预算时触发；高风险事实要等用户确认或标注置信度。存储上短期记忆是 session / task 级别，可以放在会话状态、缓存、数据库或专门的 memory store，并和长期记忆、工具持久状态分开。</p>
<p><strong>拼进 System Prompt</strong>：按优先级组织——系统规则最高，其次是当前任务目标、已确认约束、相关短期记忆、工具状态摘要、最近对话；每条标注来源、时间和置信度。还要做 token 预算、去重、冲突处理和失效清理，任务结束、用户纠正、事实过期或工具状态被新结果覆盖时更新。</p>
<p><strong>为什么记忆不能全塞进 Prompt</strong>：记忆里有过期信息、低相关内容、冲突事实、隐私信息和大量噪声，全塞会消耗 token、干扰当前任务，甚至让模型把旧偏好当成当前指令。</p>
<p><strong>渐进式披露</strong>：当前会话状态直接可见；项目或用户长期记忆先通过检索候选进入摘要区；高风险或低置信记忆只在需要时进一步展开；原始证据只在模型需要核对时提供。流程是先根据当前任务抽取检索 query，召回少量候选，再做相关性、新鲜度、权限和冲突过滤，把压缩后的摘要放入上下文；模型进入子任务或提出需要更多背景时，再披露更细颗粒度内容。</p>
<p><strong>评估</strong>：看任务成功、记忆命中、幻觉、冲突处理、token 成本和隐私泄露风险。</p>
<p><strong>长期记忆设计</strong>：先定义记忆类型，比如用户偏好、长期目标、事实资料、项目背景、历史决策和禁用规则；写入由模型或规则从对话中抽取候选，经过用户授权、置信度判断、去重和结构化后存储。召回时结合当前任务、时间、用户、权限和相似度检索，再 rerank 并按上下文预算注入。</p>
<p><strong>持续优化</strong>：支持冲突解决、过期衰减、用户纠错、删除和审计；评估看记忆命中率、任务提升、误召回、过期信息、隐私投诉和用户可控感。</p>
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
`,
      },
      {
        id: 'P121',
        group: 'langchain',
        title: '用 LangChain 编排 AI 工作流时，如何和原生调用、自研引擎做选型？各自优缺点和瓶颈是什么？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先按复杂度选型。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>方案</th><th>适合场景</th><th>优点</th><th>瓶颈</th></tr>
</thead>
<tbody>
<tr><td>原生调用</td><td>几个固定 prompt、一次 RAG 检索或简单工具调用</td><td>代码路径短、依赖少，延迟和错误都更可控；把模型 client、prompt 模板、重试、日志和 schema 校验封装好就够了</td><td>流程一复杂就要自己补编排、状态和观测</td></tr>
<tr><td>LangChain</td><td>探索期，快速验证 RAG、tool calling、memory、agent executor、向量库连接和各种 loader</td><td>原型速度快，生态方便</td><td>生产化要警惕抽象过厚、版本不稳定、链路调试困难、token / 成本不可见、异步和并发控制不细；需要补 tracing、callback、超时、限流和自己的 adapter</td></tr>
<tr><td>自研引擎</td><td>工作流很多、状态复杂，需要 DAG / 状态机、人工审批、回放补偿、权限、灰度、审计和统一观测的平台场景</td><td>控制和可观测性最强，能贴合业务</td><td>研发成本高，早期容易过度设计</td></tr>
</tbody>
</table>
</div>
<p><strong>我的建议是</strong>：探索用 LangChain，简单高频链路用原生，复杂且可复用的核心链路沉淀自研编排内核；同时用统一节点接口、状态模型和 trace，把三者隔离在可替换边界内。</p>
`,
      },
      {
        id: 'P133',
        group: 'langchain',
        title: '主流 Agent 框架如何选型？如何按 RAG 检索、有状态工作流、多 Agent 协作、工具/记忆/检索能力和自主性边界做取舍？',
        body: `
<p><strong>简要回答</strong></p>
<p>我不会先问哪个框架最火，而会先判断这个 Agent 项目的核心矛盾是什么。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>核心需求</th><th>优先评估</th><th>关注点</th></tr>
</thead>
<tbody>
<tr><td>知识库问答、文档检索</td><td>LlamaIndex，或 LangChain 的 RAG 组件</td><td>数据连接器、索引、召回、rerank、引用和检索评估</td></tr>
<tr><td>多步骤、有状态、可恢复的任务（审批、下单、代码修复、工单流转）</td><td>LangGraph 这类状态图</td><td>显式节点、边、state、重试和中断</td></tr>
<tr><td>多角色协作、辩论、规划执行分工、代码 Agent 实验</td><td>AutoGen 这类多 Agent 编排</td><td>生产里要警惕成本、循环、不可控和难评估</td></tr>
</tbody>
</table>
</div>
<p>框架还要看工具、记忆、检索和模型调用的抽象是否清晰：工具要有 schema、权限和错误码；记忆要区分短期上下文、长期用户偏好和任务状态；检索要有可评估的召回与引用。</p>
<p><strong>选型维度</strong>包括自主性和可控性的平衡、工具调用可靠性、状态持久化、可观测性、测试回放、权限安全、延迟成本、团队熟悉度和迁移成本。</p>
<p><strong>生产建议是从最小框架开始</strong>：RAG 用专门的检索层，流程用显式工作流，模型接入用薄适配层，多 Agent 只在确有复杂协作收益时引入。</p>
`,
      },
      {
        id: 'P152',
        group: 'langchain',
        title: '基于 LangGraph 和 RAG 的内容生成 Agent，应如何设计检索、生成和审核流程？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把这个内容生成 Agent 设计成一个<strong>有状态流程</strong>。</p>
<ol>
<li>入口接收主题、目标受众、风格、长度、禁区和输出格式；</li>
<li>做 query 改写和知识检索，从知识库、素材库或规则库拿到可引用证据；</li>
<li>进行证据筛选、去重、排序和摘要，形成生成上下文；</li>
<li>生成节点按结构化大纲产出初稿；</li>
<li>审核节点检查事实依据、敏感内容、重复内容、风格一致性和格式约束；</li>
<li>不通过时根据失败原因回到检索、重写或人工确认节点。</li>
</ol>
<p>LangGraph 的价值在于把这些节点、条件边、状态快照和重试路径显式化；RAG 的价值是让内容基于可追溯资料。</p>
<p>工程上还要记录来源、版本、审核结果、人工修改和线上反馈，用于后续评估和知识库更新。</p>
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
<p><strong>工程上</strong>：规划常用提示词 + 计划执行器落地，模型负责拆步骤，程序负责校验、限步和执行。</p>
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
<p><strong>代价</strong>：至少多一次大模型调用，token 和延迟都会增加；所以只在质量要求高的关键节点启用，不是每步都做。</p>
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
<p>LoRA 实际用过，省参数这个优点大家都知道，但它还有几个很实用的好处。</p>
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
<p>其中格式约束是最容易忽略、但对程序解析影响最大的。而且 Prompt 不是写完就完了，实际项目里一定要建测试集，每次改动都跑一遍，才知道改好了还是改坏了。</p>
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
<p><strong>实际项目里的做法</strong>：从真实用户请求里采样、人工标注期望输出，建一个 50–200 条的测试集，每次改 Prompt 或换模型都在上面跑一遍，再加上线上的用户满意率来形成闭环，这才是可靠的评测体系。</p>
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
<p><strong>强模型直连 vs 本地模型 + RAG + Prompt</strong>：不先说哪种更好，先看业务约束。任务依赖强推理、复杂泛化、多语言或长链路规划，且数据可以外发、成本可接受，强模型直连通常上线更快、效果上限更高。任务主要依赖企业私有知识、数据敏感、响应 SLA 可控、调用量大且问题域稳定，本地模型 + RAG + Prompt 可能更合适：知识可控、数据边界清楚、长期边际成本可能更低。但本地不是免费午餐，要维护文档解析、切分、embedding、向量库、rerank、权限、新鲜度、提示词和模型服务。评估时用同一批真实任务比较正确率、幻觉、覆盖率、P95/P99、单次成本、峰值容量、安全边界和故障降级。实际架构常是<strong>混合路由</strong>：敏感或高频标准问题走本地 RAG，复杂推理或低置信样本升级到强模型，并保留回退、审计和持续评测。</p>
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
<p><strong>分层组织</strong>：最上层是稳定的角色、目标、边界和安全规则；第二层是当前用户任务和可见输入；第三层是可用工具、工具 schema、调用约束和返回格式；第四层是历史对话、任务状态、已完成步骤和待决问题；第五层是检索到的记忆或知识片段。每类信息都要有优先级、生命周期和最大预算：系统规则最高，当前任务高于历史记忆，工具结果做结构化摘要，长期记忆按相关性和新鲜度检索，低置信或过期信息不能直接塞进上下文。</p>
<p><strong>状态</strong>：执行后的状态增量写回外部状态库，下一轮按当前步骤重新装配，而不是让模型只靠聊天记录记住一切。</p>
<p><strong>评估</strong>：除了 token 预算、截断顺序、冲突消解、敏感信息过滤和 trace，还要用真实任务看任务成功率、工具调用正确率、幻觉率、上下文遗漏率和成本延迟，持续调整装配策略。</p>
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
<p><strong>门禁与闭环</strong>：安全和关键业务约束设为发布硬门禁；其余指标按核心任务和场景切片，与基线比较。上线后用调用链、用户反馈和业务结果发现坏例，回流到离线集，形成持续回归闭环。</p>
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
<p><strong>评测</strong>：专门构造未调用工具、伪造成功返回、异步未完成、响应丢失、陈旧缓存和部分成功等样本；重点统计错误完成声明率、证据覆盖率、重复副作用率和未知状态处理正确率，并把错误完成声明设成上线硬门禁。</p>
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
<p><strong>查询正确性与写操作</strong>：查询安全不等于查询正确，还要校验字段是否存在、指标口径、租户过滤、时间范围和结果合理性，并保存查询依据。高风险写操作用独立工具，先预览变更，再经过权限校验和人工审批，最后靠事务、幂等、影响行数限制和审计日志兜底。</p>
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
<p>所以：模型提供理解与决策，工具提供具体操作，Harness 把它们组织成可持续运行的任务过程。框架可以提供这些组件，也可能直接封装好运行机制，具体看它实际包含什么能力。</p>
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
<p>另外，给整个任务设步数、时间和费用预算，并记录每轮输入、工具结果和状态变化。这样既能控制循环，也能在失败时查清问题出在模型决策、工具执行还是运行程序。最初这些模块可以放在一个服务里，接口分清楚以后，再按需要拆分。</p>
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
        title: 'Agent 的上下文压缩应该在什么时候触发？如何确定阈值并做取舍？',
        body: `
<p><strong>简要回答</strong></p>
<p>压缩阈值要根据剩余空间和接下来要做的任务确定，没有通用的 80%。当前输入除了聊天记录，还有指令、工具定义和工具结果；先把这些内容的实际 token 占用算清楚，再给模型输出和下一步可能增加的内容留空间。</p>
<p>比如 Agent 接下来要读大量测试日志，即使当前窗口还没到 80%，剩余空间也可能不够；如果只是做一次短查询，后续增长很小，就可以保留更多原始信息。所以阈值更适合跟着任务动态调整。</p>
<p><strong>触发条件分几类</strong>：</p>
<ul>
<li><strong>硬阈值</strong>：当前上下文达到窗口的 70% 到 85%、预计下一轮工具结果会超预算，或检索内容和历史消息放不下；</li>
<li><strong>阶段切换</strong>：需求澄清结束、完成一次工具调用链、生成中间方案、进入执行或总结阶段，可把旧对话压成任务状态和决策摘要；</li>
<li><strong>信息密度变化</strong>：历史里有大量重复确认、日志、长工具输出和低价值闲聊，可以摘要或裁剪；</li>
<li><strong>风险触发</strong>：模型开始遗漏约束、重复问已确认信息、引用旧状态冲突，说明该整理上下文，而不是继续堆叠。</li>
</ul>
<p><strong>压缩时保留</strong>：任务目标、用户约束、关键决策、当前计划、未完成事项、工具结果摘要、引用来源和不可丢失的原文片段；<strong>可以丢弃或弱化</strong>：寒暄、重复推理、过期计划和已确认无效的分支。</p>
<p><strong>取舍与保障</strong>：压缩能省 token、降噪声、改善长会话稳定性，但会损失细节和可追溯性。所以要保留原始消息或 trace 供回查，并给摘要加版本、时间、来源和置信度。</p>
<p><strong>评估指标</strong>：压缩后任务完成率、约束遗漏率、追问重复率、幻觉率、成本延迟、摘要可恢复性和人工抽检质量。</p>
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
        id: 'P120',
        group: 'agent',
        title: 'AI Agent 遇到上下文污染、任务过长或工具结果不可靠时，如何用上下文裁剪、状态机拆分和工具链治理提升稳定性？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先把问题拆成三类。</p>
<ol>
<li><strong>上下文污染</strong>：历史对话、工具返回、草稿、用户偏好和失败结果混在一起，模型把过期信息当成事实。解决办法是区分短期对话、长期记忆、任务状态和外部证据，只把当前步骤需要的信息放入 prompt；对长历史做摘要、引用、时间戳和来源标注，过期或冲突信息不进入决策上下文。</li>
<li><strong>任务过长</strong>：不要让一个 Agent 在一个大 prompt 里从计划到执行到验收全靠自由生成，而要拆成显式状态机，例如需求澄清、计划、检索、工具调用、结果校验、生成、验收、恢复；每个状态有输入、输出、超时、重试和停止条件。</li>
<li><strong>工具结果不可靠</strong>：工具必须有 schema、错误码、置信度、幂等、超时、重试、缓存、权限和结果校验；关键工具结果要做交叉验证或引用证据，不能让模型把任意工具文本当真。</li>
</ol>
<p>最后用 trace 和 eval 做闭环：记录每次状态转移、上下文裁剪、工具调用、返回值、模型判断和失败原因，用回放集、badcase 集和线上指标评估稳定性。</p>
<p>遇到失败时按<strong>可重试、需补参、可降级、需人工确认和必须终止</strong>分类恢复，避免无限循环和静默错误。</p>
`,
      },
      {
        id: 'P125',
        group: 'agent',
        title: 'AI Agent 在故障排查场景中生成错误建议时，如何用证据约束、置信度、人审/拒答、工具校验和回归评测避免误导用户？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先把故障排查 Agent 的输出分级：<strong>低风险</strong>的信息整理可以自动生成；<strong>中风险</strong>的排查建议要附带证据和可回滚步骤；<strong>高风险</strong>的变更、删除、扩容、重启、封禁等操作必须经过人审或工具权限控制。</p>
<p>Agent 不能只凭模型记忆回答，它应基于日志、指标、trace、告警、变更单、知识库和工具实时查询结果生成建议，并在答案中区分<strong>事实、推断和建议</strong>。没有证据或证据冲突时，应该降低置信度、提出下一步采集信息，甚至拒答。</p>
<p><strong>落地上我会做三层约束</strong>：</p>
<ol>
<li><strong>输入和检索约束</strong>：把用户问题结构化成服务、时间窗口、现象、影响范围和已知变更，检索只使用有权限、时效明确、来源可信的证据。</li>
<li><strong>生成约束</strong>：要求每条建议关联证据、风险等级、预期现象、验证命令和回滚方式，禁止输出未经授权的破坏性动作。</li>
<li><strong>评测和运营</strong>：建设历史故障 case、反事实 case、工具异常 case 和红线 case；离线看证据引用准确率、建议可执行性、误导率和拒答率，线上看采纳率、人工纠错、事故后复盘和误操作事件。</li>
</ol>
<p>这样 Agent 才是<strong>排查助手</strong>，而不是不受控的自动运维专家。</p>
`,
      },
      {
        id: 'P128',
        group: 'agent',
        title: 'Agent 评估体系应该覆盖哪些维度？如何分别衡量规划能力、任务成功率和幻觉率？',
        body: `
<p><strong>简要回答</strong></p>
<p>Agent 评估我会分为<strong>结果指标</strong>和<strong>过程指标</strong>。</p>
<p><strong>结果层</strong>看任务成功率、用户满意度、人工接管率、安全违规率和成本延迟；<strong>过程层</strong>看计划是否合理、步骤是否可执行、工具是否选对、参数是否正确、状态是否推进、输出是否有证据支撑。</p>
<p><strong>规划能力</strong>可以用任务分解正确率、步骤依赖合法率、无效步骤率、重规划成功率和最终达成率衡量；<strong>幻觉率</strong>要看模型输出中没有证据、与工具结果矛盾、引用不存在、越权推断和错误自信的比例。</p>
<p>评估方式应组合规则校验、自动测试、LLM judge、人工标注和线上 A/B，<strong>不能只让模型自评</strong>。</p>
`,
      },
      {
        id: 'P130',
        group: 'agent',
        title: 'Agent 的计划模式是什么？如何把用户目标拆成步骤、工具调用和可恢复执行状态？',
        body: `
<p><strong>简要回答</strong></p>
<p>我理解 Agent 的计划模式，是在执行复杂目标前，先把用户目标拆成结构化步骤，并在执行过程中维护计划状态、工具调用和恢复点。</p>
<p>它和普通一次性问答不同：普通 LLM 直接生成答案，计划模式会先识别目标、约束、资源和完成标准，然后生成任务列表或任务图，例如收集信息、调用检索、执行 API、校验结果、汇总输出。</p>
<p>执行时 Agent 不是盲目连续调用工具，而是按计划选择工具，拿到 observation 后更新状态：这一步完成了吗，是否需要重试，是否发现新约束，是否要改计划。</p>
<p><strong>工程上通常需要一个状态模型</strong>，记录任务 id、步骤状态、输入输出、工具参数、错误、重试次数、检查点和人工确认点。这样即使中途 API 超时、模型输出参数错、权限不足或会话中断，也能从最近的步骤恢复，而不是从头再来。</p>
<p>计划模式的价值是提升复杂任务的可控性、可解释性和可靠性，但代价是延迟、状态管理和错误恢复复杂度更高。适合多步骤、强依赖、需要工具和验证的任务；简单问答则不一定要开启。</p>
`,
      },
      {
        id: 'P132',
        group: 'agent',
        title: 'Agent 记忆出现过期或冲突事实时，如何更新、覆盖和回溯？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把 Agent 记忆当成<strong>有生命周期的事实记录</strong>，而不是一段永久有效的聊天摘要。</p>
<p>每条记忆至少要有主体、属性、值、来源、时间、作用域、置信度、版本和状态。当新信息进入时，先做冲突检测，例如同一用户的公司、职位、偏好或任务目标出现不同值。</p>
<p><strong>冲突解决按优先级处理</strong>：用户明确纠正通常高于模型推断；外部可信工具结果高于普通对话推测；更新近的事实高于旧事实。但如果影响重要决策，要向用户确认。</p>
<p><strong>存储上不要简单删除旧值</strong>，而是写入新版本，把旧事实标为 inactive、superseded 或 tombstoned，保留审计链路；涉及隐私删除时再按合规要求真正清除。</p>
<p><strong>Prompt 拼装时</strong>只放当前有效、相关、可信的记忆，并标注时间和来源；低置信冲突可以触发澄清。</p>
<p>线上还要记录记忆变更日志、恢复入口和 badcase，避免 Agent 因旧记忆反复给出错误答案。</p>
`,
      },
      {
        id: 'P137',
        group: 'agent',
        title: '电商客服 Agent 覆盖商品咨询、售后咨询和投诉安抚时，如何设计离线评测集、线上指标、用户满意度和提效口径？',
        body: `
<p><strong>简要回答</strong></p>
<p>电商客服 Agent 不能只用准确率评价。商品咨询、售后咨询和投诉安抚的目标不同，评测要同时看问题解决、用户体验、人工效率、业务风险和长期迭代。</p>
<p><strong>离线评测集分场景</strong>：按商品咨询、订单物流、售后政策、退款争议、投诉安抚、活动规则和异常长尾分桶。每类样本要有标准答案、证据、风险标签和是否应转人工，并覆盖高频、长尾和高风险问题。</p>
<p><strong>线上指标看闭环</strong>：核心看自助解决率、首触解决率、人工接管率、重复进线率、平均处理时长、转人工后坐席采纳率和工单有效率。指标要按场景分桶，否则整体提升可能掩盖投诉场景退化。</p>
<p><strong>满意度要防偏</strong>：可结合评价、投诉、会话中断、追问次数和人工申诉。只看点赞率会受样本选择和用户情绪影响，也容易忽略沉默流失和重复进线。</p>
<p><strong>提效口径要算净收益</strong>：提效不是减少人工入口这么简单，要扣除误答补救、人工复核、知识维护、模型成本和投诉处理成本，计算净节省和体验变化，并和人工基线做同口径对比。</p>
<p><strong>风险和回流</strong>：监控越权承诺、价格 / 库存错误、退款误导、隐私泄露和情绪升级。badcase 要回流到知识库、Prompt、工具规则和评测集。</p>
<p>最终用「指标分桶 + 净收益口径 + badcase 回流」判断效果，避免用单一准确率或点赞率下结论。</p>
`,
      },
      {
        id: 'P138',
        group: 'agent',
        title: 'Agent 按需加载工具说明、规则和上下文的渐进式披露架构下，是否还需要 RAG？二者如何分工与协同？',
        body: `
<p><strong>简要回答</strong></p>
<p>渐进式披露不会替代 RAG。</p>
<p>它解决的是 Agent 在每一步该展开哪些能力、工具 schema、规则和上下文，避免一次性塞满 Prompt；RAG 解决的是当前任务需要外部事实时如何检索、过滤和引用证据。工程上通常是<strong>先披露能力，再判断是否检索知识</strong>。</p>
<p><strong>渐进式披露管能力上下文</strong>：Agent 不应一开始加载所有工具文档、规则、技能和记忆。它先根据意图加载高层能力目录，再按当前步骤展开具体工具 schema、调用规则、少量示例和必要短期状态，减少 token 浪费和上下文污染。</p>
<p><strong>RAG 管外部事实证据</strong>：当问题依赖产品文档、代码库、业务知识、用户历史或实时资料时，需要 RAG 检索证据。没有 RAG，Agent 只能依赖模型先验和已披露规则，容易在事实更新、长尾文档和私有知识上编造。</p>
<p><strong>协同链路要可执行</strong>：典型链路是 intent routing → 加载相关工具 schema 和规则 → 判断是否需要外部知识 → 做权限过滤的 RAG 检索 → 把证据摘要注入当前步骤 → 输出答案、引用和知识版本。这样既不把全量知识常驻上下文，也能在需要时拿到证据。</p>
<p><strong>按任务决定边界</strong>：只依赖固定流程、用户当前输入和已知工具返回的任务，可以只用渐进式披露；涉及政策、文档、代码、历史记录或时效事实的任务必须接 RAG。边界应由评测集按任务类型验证，而不是靠架构口号决定。</p>
<p><strong>权限、时效和失败策略</strong>：渐进式披露加载能力时要遵守用户角色和租户边界；RAG 检索也要做 ACL 过滤、版本标注和更新时间检查。检索低置信、证据冲突或权限不足时，应追问、降级、拒答或转人工，而不是继续生成确定结论。</p>
`,
      },
      {
        id: 'P139',
        group: 'agent',
        title: 'AI / 自动化 Agent 平台如何结合 Jenkins 调度、Linux 日志采集解析和配置规则治理，实现状态回传、参数校验，并从拉日志演进到自动排障？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把这个平台设计成<strong>任务编排层、执行调度层、观测采集层、规则治理层和智能诊断层</strong>。</p>
<p>用户或上游系统提交排障任务后，平台先做参数校验、权限校验和配置规则匹配，再通过 Jenkins 触发标准化 job，例如拉取指定环境、服务、机器、时间窗口和 traceId 的日志。Jenkins 负责执行可复用流水线；Linux 侧通过 SSH、agent、日志采集器或现有可观测系统拉取 journal、应用日志、容器日志和系统指标，并把执行状态、进度、产物路径、错误码和结果摘要回传平台。</p>
<p><strong>从产品演进看分四个阶段</strong>：</p>
<ol>
<li><strong>自动拉日志</strong>：解决多机、多路径、多账号和时间窗口不一致的问题；</li>
<li><strong>日志解析</strong>：把错误栈、关键字、请求链路、配置差异、机器状态和版本信息结构化；</li>
<li><strong>规则沉淀</strong>：把常见故障模式、配置禁用项、阈值、依赖关系和处理建议配置化；</li>
<li><strong>AI 辅助排障</strong>：让 Agent 根据日志、规则、变更记录和历史案例给出根因候选、置信度和下一步动作。</li>
</ol>
<p>真正自动修复要非常谨慎，应从<strong>只读诊断、建议操作、人工确认、低风险自动执行</strong>逐步推进，并保留审计、回滚、幂等和熔断。</p>
`,
      },
      {
        id: 'P140',
        group: 'agent',
        title: 'Agent 系统中 Multi-Agent、One-Agent 和 LLM + Workflow 应如何选型？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先说明三种模式解决的问题不同。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>模式</th><th>适合场景</th><th>优点</th><th>缺点</th></tr>
</thead>
<tbody>
<tr><td>LLM + Workflow</td><td>流程稳定、规则明确、状态可枚举，比如固定审批、资料抽取、标准 RAG 和可预测工具链</td><td>可控、可测试、延迟稳定</td><td>灵活性较弱</td></tr>
<tr><td>One-Agent</td><td>目标明确、但步骤有一定不确定性，由一个 Agent 负责规划、工具调用和总结</td><td>实现简单、上下文集中</td><td>复杂任务中容易上下文膨胀、工具选择混乱、失败不可解释</td></tr>
<tr><td>Multi-Agent</td><td>需要角色分工、并行探索、互相评审或不同专业能力的复杂任务</td><td>职责可拆、可并行、可引入审核</td><td>编排复杂、通信成本高、状态一致性和责任边界难</td></tr>
</tbody>
</table>
</div>
<p><strong>选型时看</strong>任务复杂度、失败风险、是否需要确定性、工具数量、延迟成本、可观测性和团队维护能力。</p>
<p>很多生产系统会用 <strong>workflow 包住关键路径，在局部节点引入 Agent</strong>，而不是全盘多 Agent。</p>
`,
      },
      {
        id: 'P143',
        group: 'agent',
        title: 'AI 应用开发中的原子状态机是什么？如何用有限状态、原子转移和异常状态约束执行流程？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把 AI 应用或 Agent runtime 的原子状态机理解为一套<strong>执行控制层</strong>：用有限状态描述 Agent 当前处在什么阶段，用明确事件触发迁移，并保证每次迁移是原子的、可恢复的、可审计的。</p>
<p>它不是单纯画流程图，而是把 LLM 输出、工具调用、观察结果、重试和终止条件都纳入状态约束，避免模型在开放循环里随意跳步。</p>
<p><strong>常见状态集合</strong>：<code>INIT</code>、<code>PLANNING</code>、<code>WAITING_TOOL_DECISION</code>、<code>TOOL_CALLING</code>、<code>OBSERVING</code>、<code>REFLECTING</code>、<code>RESPONDING</code>、<code>COMPLETED</code>，以及异常状态 <code>TOOL_ERROR</code>、<code>TIMEOUT</code>、<code>INVALID_ACTION</code>、<code>POLICY_BLOCKED</code>、<code>HUMAN_REVIEW</code>、<code>CANCELLED</code>、<code>FAILED</code>。</p>
<p>每个状态只允许有限的下一跳，例如只有从 <code>WAITING_TOOL_DECISION</code> 才能进入 <code>TOOL_CALLING</code>，拿到 observation 后才能进入 <code>OBSERVING</code> 或 <code>REFLECTING</code>，不能在任意状态重复发起同一个工具。</p>
<p><strong>原子转移</strong>的关键是把状态变更和副作用边界设计清楚：执行工具前先生成 <code>tool_call_id</code> 和幂等键，持久化一条从 <code>WAITING_TOOL_DECISION</code> 到 <code>TOOL_CALLING</code> 的转移记录，再调用工具；工具返回后用同一个 ID 写入 observation，并推进到 <code>OBSERVING</code>。如果进程崩溃或超时，恢复时先查状态和事件日志：已进入 <code>TOOL_CALLING</code> 但没有 observation，就按幂等键查询工具结果，或进入 <code>TIMEOUT</code> / <code>RETRY_WAIT</code>，而不是盲目再调一次。</p>
<p><strong>并发控制</strong>通常需要锁、版本号或 compare-and-set：同一个 run 只能有一个 worker 把 <code>state_version</code> 从 5 更新到 6，失败的 worker 必须重新读状态。这样避免两个 worker 同时消费同一个 LLM action，造成重复扣费、重复外部动作、重复发消息或状态覆盖。对有外部副作用的工具，幂等键比简单重试更重要。</p>
<p><strong>防死循环要落在状态机上</strong>，不能只相信 prompt：设置最大 step 数、最大连续工具调用数、同工具同参重复阈值、无进展检测、状态循环哈希、重试预算和强制终止状态。LLM 输出非法 action 就进入 <code>INVALID_ACTION</code> 要求修正，多次失败转 <code>HUMAN_REVIEW</code> 或 <code>FAILED</code>；工具超时、权限不足、内容安全拦截都要有显式异常状态，而不是让模型继续猜。</p>
<p><strong>验证指标</strong>：状态转移覆盖率、非法转移次数、重复工具调用率、run 卡死率、平均 step 数、超时恢复成功率、人工接管率、任务成功率和事件日志可回放性。好的原子状态机让 Agent 正常路径顺畅执行，异常路径可恢复、可终止、可解释，而不是把所有复杂性交给 LLM 的自然语言推理。</p>
`,
      },
      {
        id: 'P145',
        group: 'agent',
        title: '构建复杂 LLM Agent 时最主要的挑战是什么？如何处理可靠性、规划、工具调用和可观测性？',
        body: `
<p><strong>简要回答</strong></p>
<p>构建复杂 LLM Agent 时，最主要的挑战是<strong>可靠性和可控性</strong>。</p>
<p>Agent 不只是回答文本，它会拆任务、调用工具、读取外部数据甚至改变业务状态；而 LLM 输出天然有不确定性，所以同一个任务可能出现不同计划、错误参数、重复调用、陷入循环或忽略工具结果。复杂度越高、链路越长，问题越难定位：一次失败可能来自意图识别、上下文污染、planner 选错步骤、工具描述歧义、参数 schema 不严、工具服务超时、权限不足或最终总结幻觉。</p>
<p><strong>治理要分层</strong>：</p>
<ul>
<li><strong>规划层</strong>：把任务拆成有限状态或工作流，明确开始、步骤、停止条件、重试预算和失败出口，不要让模型无限自由规划。</li>
<li><strong>工具层</strong>：清晰的工具描述、严格 schema、权限校验、幂等键、超时、熔断、重试和降级；高风险动作要 dry-run、用户确认或人工审批。</li>
<li><strong>上下文层</strong>：做 token budget、短期记忆、长期记忆、RAG 证据、工具结果和用户输入的优先级管理，避免过期记忆或无关证据污染决策。</li>
</ul>
<p><strong>可观测性是复杂 Agent 能上线的前提</strong>：每次运行记录 trace——用户目标、上下文摘要、计划、候选工具、最终工具、参数、工具返回、重试、成本、耗时和最终答案。</p>
<p><strong>评测</strong>不能只看最终回答，要看任务成功率、工具选择准确率、参数合法率、循环率、人工接管率、P95 延迟、单任务成本和安全拦截。</p>
<p>最后用历史 badcase 建回归集，持续改 prompt、planner、工具描述、schema 和降级策略。</p>
`,
      },
      {
        id: 'P146',
        group: 'agent',
        title: '生产级 Agent 如何工程化实现自我校验、链路复盘、错误归因和动态修正？',
        body: `
<p><strong>简要回答</strong></p>
<p>生产级 Agent 的自我校验不能停留在让模型回答前说「请检查一下」，而要工程化成一套<strong>可记录、可回放、可归因、可修正</strong>的闭环。</p>
<p><strong>先结构化执行过程</strong>：记录用户目标、规划步骤、工具选择、工具入参、工具返回、模型中间决策、状态变化、最终输出和用户反馈，形成完整 trace。</p>
<p><strong>自我校验分三类</strong>：</p>
<ul>
<li><strong>执行前</strong>：任务是否清楚、权限是否足够、工具是否可用、参数是否完整；</li>
<li><strong>执行中</strong>：工具结果是否异常、计划是否偏离、是否进入循环、成本是否超预算；</li>
<li><strong>执行后</strong>：输出是否满足目标、是否引用了真实证据、是否存在未完成步骤或风险动作。</li>
</ul>
<p><strong>链路复盘</strong>要能把一次失败拆到具体环节：意图理解错、计划拆解错、工具选错、参数生成错、工具服务失败、检索证据不足、状态污染、最终表达误导或前端交互信息缺失。</p>
<p><strong>错误归因</strong>不能只靠模型自评，要结合规则校验、工具返回、日志、评测器、人工标注和用户反馈。</p>
<p><strong>动态修正要分级</strong>：低风险可以自动补参、重试、改写查询或重新规划；中风险提示用户确认或转人工；高风险应停止执行、保留现场并进入人工审核。前端提供可理解的状态、确认、纠错和反馈入口，后端要有 trace、版本、实验分组、策略命中和回放能力。</p>
<p>长期看，归因结果要回流到 Prompt、工具 schema、知识库、路由策略、测试集和产品流程，让 Agent 从单次纠错变成持续改进。</p>
`,
      },
      {
        id: 'P147',
        group: 'agent',
        title: '客服 Agent 从通用 Agent 拆成 Expert Agent 后，如何设计 A/B 测试与指标归因，判断提升来自路由、Prompt 还是 Workflow，并监控泛化损失？',
        body: `
<p><strong>简要回答</strong></p>
<p>通用 Agent 拆成 Expert Agent 后，A/B 测试不能只看总体解决率上涨。</p>
<p>要把收益拆到<strong>路由、检索、工具执行、转人工、回答质量和用户体验</strong>各环节，否则无法判断提升来自专家拆分、知识更新、Prompt 改动还是流量结构变化。</p>
<p><strong>先定义实验单元</strong>：按用户、会话或问题单元随机分流，并保证业务线、问题类型、用户等级和时段分布可比。客服场景尤其要防止同一用户跨组造成体验和归因污染。</p>
<p><strong>指标分层归因</strong>：顶层看自助解决率、满意度、投诉率和人工成本；中间层看路由命中率、证据覆盖率、工具成功率、转人工率；底层看误答、拒答、重复追问和延迟。</p>
<p><strong>幻觉要单独标注</strong>：拆成无证据回答、证据误读、越权承诺、工具结果编造和事实过期，通过人工抽检、规则校验和 badcase 归因，判断新架构是否真的降低幻觉。</p>
<p><strong>泛化损失要压测</strong>：Expert 架构容易在长尾问题、跨域问题和混合意图上失效。需要保留长尾测试集、跨域样本和回退策略，监控无命中、错路由和多轮未解决比例。</p>
<p><strong>结论要能指导迭代</strong>：如果收益主要来自路由准确，应优化分类和候选召回；如果来自工具执行，应强化权限和参数校验；如果长尾下降明显，应调整 Expert 粒度或增加 fallback。</p>
`,
      },
      {
        id: 'P148',
        group: 'agent',
        title: '多 Agent 运行时如何按任务复杂度、风险等级和运行时信号，在单 Agent、规划-执行、并行候选和监督校验之间动态切换？',
        body: `
<p><strong>简要回答</strong></p>
<p>多 Agent 系统的执行策略不是固定选一种。</p>
<p>简单任务可以单步工具调用，复杂任务可用规划-执行，探索任务可用多候选并行，高风险任务要加入监督和人工确认。策略切换的关键是<strong>用任务特征和运行时信号控制</strong>，而不是让模型随意决定。</p>
<p><strong>先定义策略集合</strong>：单 Agent 快速执行、Planner-Executor 分工、多 Agent 讨论、并行候选求解、Critic 校验、人工确认和降级模板回答。每种策略要有适用条件和成本。</p>
<p><strong>用任务特征路由</strong>：根据意图、风险等级、是否需要工具、步骤数、实时性、用户价值和证据要求选择初始策略。比如高风险写操作不应进入无监督自动执行。</p>
<p><strong>运行中动态切换</strong>：当工具失败、置信度下降、循环次数过多、用户补充信息、成本超预算或证据冲突时，可以从快速执行切到重规划、校验、转人工或降级。</p>
<p><strong>状态要可迁移</strong>：切换策略时保留目标、已完成步骤、工具结果、证据、失败原因和用户确认，避免重新开始或丢失关键上下文。</p>
<p><strong>评估看收益成本</strong>：用任务成功率、延迟、成本、错误率、人工接管率和用户满意度评估。复杂策略如果只提升少量质量却显著拖慢体验，未必值得默认启用。</p>
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
<p><strong>更细的判断</strong>：如果问题依赖外部知识、更新频繁、需要引用和可追溯，优先 RAG；如果要改变模型稳定行为、风格、格式遵循或领域推理模式，才考虑 SFT。实际工程里常见组合是 RAG 负责知识注入，SFT 或提示词负责回答格式和工具使用习惯。</p>
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
<p><strong>由产品目标定义来源和拆分</strong>：不要先问 chunk 多大，先问产品要回答什么问题、服务谁、引用什么才可信。先定义目标场景和用户任务，比如政策问答、商家运营、客服知识、内部 SOP；再确定权威来源，包括官方文档、业务规则、FAQ、工单、案例库或结构化数据，并标注负责人、更新频率、权限和可信等级；再按用户问题粒度和答案边界拆分，例如一个业务规则、一个操作步骤、一个 FAQ、一个案例或一个政策条款，而不是机械按字数切；拆分后保留标题、层级、来源、时间、权限和关联关系。上线后用召回命中、引用正确、答案采纳、badcase 和人工反馈调整来源和拆分策略。</p>
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
<p>还有一个比较有价值的方案，是 Anthropic 提出的 <strong>Contextual Retrieval</strong>：在 Embedding 之前，先让大模型看着整篇文档为每个 chunk 生成一段背景说明，把这段背景和 chunk 拼在一起再向量化，从根本上解决孤立 chunk 没头没尾的问题。</p>
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
<p><strong>评估</strong>：不要只看通用排行榜，一定要在自己的业务数据上跑召回测试，看 Recall@K、命中率、误空和端到端答案质量，那个才有参考价值。换模型时即使维度不变，旧向量也不能直接复用，要全量重嵌。</p>
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
<p><strong>选型对比</strong>：本地开发用 Chroma，零配置、上手快；生产环境中小规模推荐 Qdrant，性能不错、API 简洁；超大规模考虑 Milvus，字节和小米都在用；不想自己运维就用 Pinecone 云托管；如果项目里已经有 PostgreSQL，可以直接用 pgvector 插件，不用引入新组件。</p>
`,
      },
      {
        id: 'P39',
        group: 'rag',
        title: '讲讲你用的向量数据库？数据量级、性能、瓶颈怎么处理？',
        body: `
<p><strong>简要回答</strong></p>
<p>选型要看数据量级、并发、部署形态和运维成本。小规模、单机、希望零运维时可以选嵌入式向量库，比如 LanceDB；数据量到百万级以上、并发高、需要读写分离时，再评估 Milvus、Qdrant 这类独立服务。</p>
<p><strong>嵌入式方案的取舍</strong>：LanceDB 列式存储，不用单独起服务，和进程一起部署；适合中小规模。代价是单机扩展能力有限，规模变大或并发变高时，全表扫描会成为瓶颈，这时要评估 ANN 索引或独立向量库。ANN 训练有随机性，重建后 Top-K 可能不可复现，做基线对比时要固定参数或改用指标评估。</p>
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
<p>所以 RAG 系统通常两路都跑：向量捕获语义相关内容，BM25 精准命中关键词，再用 RRF 把两路结果合并，覆盖比单路宽很多。</p>
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
<p>工程上常把查询分析做成“实体 / 类名纠错、别名展开、否定约束、实体识别”，再根据结果选择检索路和过滤条件，必要时产出查询计划。</p>
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
<p><strong>各自的盲区</strong>：向量召回对专有名词、缩写、数字、代码符号、错误码、日期和很短 query 不稳定，也容易召回语义相似但不能回答事实的片段；BM25 基于词项匹配和词频逆文档频率，对精确关键词、标题、接口名、配置项和实体命中更可靠，但对同义改写、长自然语言和语义泛化不足。</p>
<p><strong>融合权重怎么定</strong>：不能只说五五开。冷启动可先用 RRF 或经验权重——语义问答偏向量，错误码、产品名、接口路径、短词查询偏 BM25；再用标注集评估 Recall@K、Precision@K、nDCG、MRR、答案忠实度和引用准确率，结合线上点击、采纳、人工反馈和 badcase 调整。更进一步可以用 query classifier 或 learned ranker，让不同查询类型采用不同融合权重。目标是让 BM25 提供精确锚点，向量提供语义覆盖，再由 rerank 判断哪些证据真正能回答问题。</p>
`,
      },
      {
        id: 'P44',
        group: 'rag',
        title: 'RAG 可以做哪些优化？检索、生成和工程侧分别怎么优化？',
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
<p><strong>生成侧</strong>：上下文压缩、引用约束、答案格式控制、拒答策略和减少幻觉。</p>
<p><strong>工程侧</strong>：处理索引增量更新、权限过滤、缓存、延迟和监控。</p>
<p><strong>评估</strong>：看召回命中、上下文相关性、答案正确率、引用准确性和用户反馈。</p>
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
<p>成本最低、收效最快的组合是 <strong>Prompt 强约束 + 检索质量门控</strong>，生产系统上线前这两个必须做。生产系统通常还会做结构化 JSON、证据筛选、领域守卫、引用校验和无证据拒答。</p>
`,
      },
      {
        id: 'P48',
        group: 'rag',
        title: '怎么量化你的 RAG 效果？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 效果分两层看：<strong>检索层</strong>看该召回的有没有召回到，用 Hit@K 和 MRR 衡量；<strong>生成层</strong>看答案对不对、有没有幻觉、和问题相不相关，主要用 RAGAs 框架，核心指标是 Faithfulness、Answer Relevancy 和 Context Recall。</p>
<p><strong>RAG 作为 Agent 工具开放后分四层</strong>：第一层检索本身，看 query 改写、相关文档召回、topK 排序、权限和新鲜度，指标有 recall@K、precision@K、MRR、nDCG、空召回率和错误召回率；第二层 Agent 工具选择，看该查时有没有调用、不该调时有没有乱调、参数和迭代次数是否合理；第三层最终答案，看是否基于证据、引用是否支持结论、是否减少幻觉、能否承认无证据；第四层端到端任务效果和体验，看任务成功率、轮次、延迟、成本、用户采纳、点踩和人工修正。</p>
<p><strong>评估方式</strong>：用标注 query-doc 集合、历史任务回放、人工 review 和线上日志分层分析，避免只优化召回率却让 Agent 更慢、更贵或更容易使用错误证据。</p>
<p>建议一定要在自己的业务数据上跑，不能只看通用排行榜，那个不能代表你的场景。通常要建固定黄金集，检索和生成分别看指标，再加门禁和回归。</p>
<p>线上指标是用户点踩率、追问率、转人工率这些，才是最终衡量标准，离线指标只是辅助。</p>
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
<p><strong>细到 chunk 粒度</strong>：文档要有 docId、version、更新时间、权限、解析配置和 chunk 版本；按段落、标题、表格或语义边界切 chunk 并计算 hash。局部更新时比较新旧 chunk，只重新 embedding 变化部分，未变化的复用。新增和修改写入新版本，删除的 chunk 标记 tombstone 或从索引移除；查询侧只读旧版本或新版本，避免读到半更新状态。</p>
<p><strong>元数据和权限同步</strong>：权限、时间、业务标签、来源链接和召回过滤条件也要随版本更新，否则可能召回旧权限或过期内容。</p>
<p><strong>定期维护</strong>：接入权威数据源，做去重、清洗、权限和版本管理；按文档结构切分，保留标题、章节、时间、来源、权限等元数据；定期做过期清理、冲突检测和回滚演练；上线后用检索召回率、命中片段质量、答案引用正确率和用户 badcase 评估，而不是只看索引条数。</p>
<p><strong>不停服更新</strong>：核心是不要在生产索引上边写边查，而是做版本化索引和原子切换。流程是采集、解析、切分、embedding、索引构建、质量校验、灰度切换和回滚：新知识先在离线或旁路索引构建，保留版本号、文档版本、chunk 版本和权限元数据；构建完用抽样 query、黄金集和影子流量验证召回、排序、权限过滤和延迟；通过后用 alias 或路由配置把线上流量从旧版本切到新版本。切换时处理缓存失效、增量数据双写、会话内版本一致性和失败回滚。</p>
<p><strong>监控</strong>：索引新鲜度、召回命中、空召回、引用版本、权限错误、延迟和 badcase，保证用户看到的是一致且可追溯的知识结果。</p>
<p><strong>实时性要求高</strong>：用 Kafka 这类消息队列做变更事件驱动，实现秒级入库；同时做去抖、幂等和版本控制，避免同一文档反复重建。工程上常用“文件 hash 增量 + manifest 校验 + active 指针切换 + 文件监听去抖 / 冷却 + 门禁失败回滚”这套组合。</p>
<p><strong>回归验证</strong>：更新后用固定 query 集检查召回、排序、答案引用和删除是否生效；监控 embedding 队列延迟、失败重试、索引版本滞后和过期召回比例。</p>
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
        id: 'P123',
        group: 'rag',
        title: 'RAG 检索召回无关内容时，如何从 query rewrite、混合检索、rerank、过滤和拒答机制处理？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先把无关召回当成<strong>检索链路问题</strong>定位，而不是直接归因于大模型。</p>
<p><strong>第一步复盘</strong>线上样本里的原始 query、改写后 query、召回文档、检索分数、重排结果、最终引用和回答内容，判断问题来自用户表达偏差、索引噪声、切片粒度、召回策略失配、重排失效、权限过滤缺失，还是生成阶段没有识别证据不足。</p>
<p><strong>处理上分四层</strong>：</p>
<ol>
<li><strong>查询侧</strong>：意图识别、改写、拆解、实体归一和歧义澄清；</li>
<li><strong>索引侧</strong>：治理文档质量、切片、标题路径、时间、权限和业务元数据；</li>
<li><strong>召回侧</strong>：稠密检索、关键词检索、结构化过滤和多路召回融合；</li>
<li><strong>排序与生成侧</strong>：增加重排、相关性阈值、证据覆盖检查、引用约束和拒答兜底。</li>
</ol>
<p>最后用<strong>离线标注集和线上 badcase 闭环</strong>观察召回率、无关召回率、首个相关片段位置、拒答准确率、延迟和用户反馈，避免只凭单个案例调参。</p>
`,
      },
      {
        id: 'P150',
        group: 'rag',
        title: 'Claude Code 使用 grep 检索与 RAG 检索有什么区别？',
        body: `
<p><strong>简要回答</strong></p>
<p><code>grep</code> 更适合在代码库里做精确字符串或正则匹配，优点是快、可解释、确定性强，缺点是依赖关键词，找不到语义相近但字面不同的内容。</p>
<p>RAG 会先把文档切块、向量化或建立混合索引，再根据 query 做语义召回和重排，把相关上下文交给大模型生成答案。它能处理同义表达和知识问答，但有切块、召回误差、排序、幻觉和成本问题。</p>
<p>代码场景通常会<strong>混合使用</strong>：<code>grep</code> 定位精确符号，RAG 补充语义理解。</p>
<div class="interview-bank-doc__table-wrap">
<table class="interview-bank-doc__table">
<thead>
<tr><th>维度</th><th>grep</th><th>RAG</th></tr>
</thead>
<tbody>
<tr><td>匹配方式</td><td>精确字符串 / 正则</td><td>语义召回 + 重排</td></tr>
<tr><td>优点</td><td>快、确定、可解释</td><td>能处理同义表达和知识问答</td></tr>
<tr><td>缺点</td><td>依赖关键词，语义变体找不到</td><td>切块、召回误差、排序、幻觉、成本</td></tr>
<tr><td>适合</td><td>定位精确符号、配置、报错文本</td><td>模糊描述、跨文档知识、问答</td></tr>
</tbody>
</table>
</div>
`,
      },
      {
        id: 'P151',
        group: 'rag',
        title: 'RAG 处理 PDF 知识库时，如何设计切片、分页元数据和检索链路来减少答非所问？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把 PDF RAG 分成<strong>解析、切片、索引、检索、组装和生成</strong>六步。</p>
<p><strong>解析</strong>：不能只按页抽文本，要尽量识别标题层级、段落、表格、列表、页眉页脚和跨页段落，并清理重复页眉、页脚、水印。</p>
<p><strong>切片</strong>：以章节和语义段落为主，控制 chunk 大小，给相邻 chunk overlap；表格和条款类内容尽量保持完整。页码不能当唯一切片单位，因为分页可能切断语义，但每个 chunk 必须保留 <code>source</code>、<code>page_start</code>、<code>page_end</code>、<code>section_title</code>、<code>heading_path</code> 等 metadata，方便召回和溯源。</p>
<p><strong>检索链路</strong>：先做 query rewrite 或意图识别，再混合向量召回和关键词召回，之后用 reranker 按相关性重排，必要时扩展相邻 chunk。</p>
<p><strong>组装与生成</strong>：去重、按章节顺序排序、控制 token 预算，并要求模型只基于证据回答；证据不足要说明无法确定。</p>
<p><strong>答非所问的 badcase</strong> 要回看是解析丢信息、chunk 粒度不合适、召回漏了、重排错了，还是生成阶段没有引用约束。</p>
`,
      },
      {
        id: 'P153',
        group: 'rag',
        title: 'RAG 为什么要引入父子索引？如何兼顾小粒度召回和大粒度上下文回填？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把父子索引理解成解决<strong>检索粒度和生成粒度不一致</strong>的问题。</p>
<p><strong>离线建库</strong>时，把原始文档按层级组织成父节点和子节点：父节点可以是整篇文档、章节、FAQ 条目或一段完整业务说明，保存标题、来源、权限、版本、更新时间和摘要；子节点则是更小的段落、列表项、表格行组或代码片段，用来生成 embedding 和 BM25 字段索引。</p>
<p><strong>在线查询</strong>时，先用子节点召回，因为子节点更短、更聚焦，语义向量不容易被无关内容稀释；命中子节点后，再根据 <code>parentId</code> 回填父章节、相邻子块、父摘要或结构化上下文，让模型拿到足够完整的证据。</p>
<p><strong>回填后不能全塞</strong>：要重新做去重、重排和 token 预算控制；同一父节点下多个子命中可以合并，分数综合子命中强度、父节点质量、章节完整度和 query 覆盖；过长父节点只取命中段落附近窗口，加父标题和父摘要。</p>
<p>父子索引还要处理<strong>权限继承、版本一致性、删除更新、引用追踪和评估指标</strong>。核心不是多建一张表，而是让检索阶段用小粒度提升命中，生成阶段用大粒度保证证据完整。</p>
`,
      },
      {
        id: 'P154',
        group: 'rag',
        title: 'RAG 中检索文档正确但生成答案错误时，如何定位 Prompt、上下文组织、模型推理和后处理问题？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先把问题按日志回放拆开，而不是直接说调 prompt。</p>
<ol>
<li><strong>确认检索真的正确</strong>：命中的文档是否包含直接答案，版本是否最新，权限和过滤后是否仍然保留。</li>
<li><strong>看证据有没有丢</strong>：rerank 后是否被低分截掉，父子回填是否拿错段落，上下文组装是否超 token 被截断，正确证据是否放在长上下文中间被稀释，证据编号和引用是否混乱。</li>
<li><strong>检查 Prompt 约束</strong>：是否要求只基于证据回答、证据不足要拒答、引用证据编号、优先使用高置信证据、处理冲突，以及不要用外部常识覆盖证据。</li>
<li><strong>检查模型生成本身</strong>：是否因为问题需要推理、多文档合成、否定条件、数字比较或时间条件而误读证据；是否温度过高、输出格式不稳定，或长上下文 lost-in-the-middle。</li>
<li><strong>检查后处理和产品逻辑</strong>：JSON 解析、答案裁剪、模板填充、单位转换、链接替换、敏感词过滤和缓存都可能把正确答案改错。</li>
</ol>
<p><strong>修复</strong>：优化上下文排序和证据包、加强引用约束、做答案-证据一致性校验、降低解码随机性、为复杂问题拆解推理、增加生成后验证和 badcase 回流。核心是<strong>证明错误发生在哪一跳</strong>，而不是把所有问题都归因于检索或模型幻觉。</p>
`,
      },
      {
        id: 'P155',
        group: 'rag',
        title: 'RAG 需要跨多个文档综合回答时，如何做多跳召回、证据合并和冲突处理？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把跨多文档 RAG 分成「<strong>找全证据</strong>」和「<strong>基于证据综合推理</strong>」两段。</p>
<ol>
<li><strong>判断是否真的需要多文档</strong>：比如要比较多个对象、串联多个时间点、同时满足多个条件，或者单个文档只给出局部事实。</li>
<li><strong>query planning</strong>：把原问题拆成若干子问题或检索意图，比如实体识别、时间范围、约束条件和待比较维度；每个子问题生成不同 query，走向量、BM25、元数据过滤、父子索引或图关系召回。</li>
<li><strong>按 evidence coverage 排序</strong>，而不是只按单 chunk 相似度：候选集合是否覆盖所有子问题、是否来自互补文档、是否有重复内容、是否足够新、是否可信。</li>
<li><strong>证据组织</strong>：把 chunk 按实体、主题、时间线或论点分组，保留文档标题、段落、时间、版本和引用位置；重复证据合并，矛盾证据标注冲突来源和优先级。</li>
<li><strong>生成</strong>：Prompt 明确要求只基于给定证据回答、逐点引用来源、证据不足时说明缺口，并把综合推理限制在可追溯证据上。</li>
</ol>
<p><strong>评估</strong>要拆成多跳召回率、证据覆盖率、引用准确率、冲突处理正确率和最终答案 faithfulness，而不是只看答案是否流畅。</p>
`,
      },
      {
        id: 'P156',
        group: 'rag',
        title: 'RAG 中 query rewrite、HyDE 和 RRF 分别解决什么问题？如何接入混合检索链路？',
        body: `
<p><strong>简要回答</strong></p>
<p>在 RAG 混合检索链路里，query rewrite、HyDE 和 RRF 解决的是不同层的问题。</p>
<ul>
<li><strong>Query rewrite</strong> 解决用户问题表达不完整、口语化、指代不清或需要拆解的问题：把原始 query 改写成更适合检索的一个或多个 query，例如补全上下文、扩展同义词、拆成子问题、生成关键词查询和语义查询。</li>
<li><strong>HyDE</strong> 解决向量检索中的语义鸿沟：问题很短或抽象时，先让模型生成一个假设性答案或文档，再对假设文档做 embedding 去检索真实文档；答案式文本往往和知识库文档更接近。</li>
<li><strong>RRF</strong> 解决多路召回结果怎么融合：不要求不同检索器分数可比，而是按每路排名做倒数排名融合，把 BM25、向量、改写 query、HyDE query 等结果合并成统一候选集。</li>
</ul>
<p><strong>接入链路</strong>：原始 query 先做意图识别和 rewrite 生成多路查询；部分走关键词检索，部分走向量检索，必要时生成 HyDE 文档再走向量检索；所有召回结果用 RRF 或加权 RRF 融合去重，再进入 rerank，最后由生成模型基于高置信上下文回答。</p>
<p>这三者都可能引入噪声，所以要有开关、超时、成本预算、离线评测和线上观测。</p>
`,
      },
      {
        id: 'P157',
        group: 'rag',
        title: 'RAG 中如何评估 Rerank 的有效性？应该看哪些离线指标和线上指标？',
        body: `
<p><strong>简要回答</strong></p>
<p>评估 Rerank，要先明确它的目标：不是单独追求模型打分更高，而是在召回候选中把<strong>真正能回答问题、可信、权限正确、时效合适</strong>的上下文排到前面，并在有限上下文窗口内提升最终答案质量。</p>
<p><strong>离线指标</strong>：用带标注的 query-doc 数据集看 MRR、nDCG@k、context Recall@k / 证据 Recall@k（rerank 后进入生成上下文的 topK 是否覆盖答案证据）、Precision@k、Hit@k、MAP；也要看 topK 证据覆盖率、答案支持率、重复率、负样本压制能力，以及不同 query 类型的分桶表现。关键是比较 rerank 前后<strong>送进生成模型的 topN</strong> 是否更相关，而不只是候选全集指标。</p>
<p><strong>线上指标</strong>：最终回答正确率、证据命中率、用户采纳率、追问率、投诉率、无答案率、人工质检分；同时监控 P95/P99 延迟、超时率、成本、吞吐、降级率和缓存命中。</p>
<p>最可靠的方式是<strong>离线回放 + 线上 A/B</strong>：先确认 rerank 对相关性和答案支持有稳定提升，再用灰度实验验证用户侧收益是否大于额外延迟和成本。</p>
`,
      },
      {
        id: 'P158',
        group: 'rag',
        title: '向量数据库检索到语义相关但时间过久的历史信息时，RAG 系统应如何判断能否使用？',
        body: `
<p><strong>简要回答</strong></p>
<p>RAG 不能直接把语义相关的旧信息塞进上下文，而要先判断这个问题是否<strong>时间敏感</strong>。</p>
<ol>
<li><strong>query 分流</strong>：问定义、基础原理、历史事实，旧文档可能仍可用；问价格、政策、接口状态、库存、版本兼容、当前负责人或线上配置，就必须要求新鲜证据。</li>
<li><strong>看候选元数据</strong>：发布时间、更新时间、生效时间、失效时间、版本号、适用地区、数据源和文档状态。</li>
<li><strong>freshness-aware ranking</strong>：对过期候选降权或过滤，优先召回最近文档；必要时触发静态库之外的动态网页、数据库或业务 API 检索。</li>
<li><strong>证据一致性检查</strong>：旧文档与新文档冲突时，以更权威、更近、生效范围更明确的证据为准；无法判定时让模型说明不确定，或请用户限定时间。</li>
</ol>
<p><strong>输出要带时间边界</strong>，例如「截至某日期的文档显示」。工程上还要用时效敏感 query 集合评估 stale evidence rate、冲突率、引用新鲜度、拒答准确率和答案正确率。</p>
`,
      },
      {
        id: 'P159',
        group: 'rag',
        title: 'RAG 知识库有十几万文档时，如何设计切片、索引、召回和增量更新，避免检索质量与性能下降？',
        body: `
<p><strong>简要回答</strong></p>
<p>十几万文档的 RAG，我会先把文档处理成可检索的知识单元，再设计混合召回和增量索引。</p>
<p><strong>文档侧</strong>：解析标题、层级、段落、表格、时间、权限和来源；切片根据语义边界、标题路径和 overlap 控制粒度，给每个 chunk 加元数据。</p>
<p><strong>索引侧</strong>：通常同时建向量索引和关键词 / 稀疏索引；召回后做去重、权限过滤、重排和上下文压缩。</p>
<p><strong>增量更新</strong>：要有文档版本、chunk hash、删除 tombstone、异步重建和回滚。</p>
<p><strong>质量评估</strong>：用标注 query 集看 recall@k、MRR、答案命中率和无证据拒答率；<strong>性能</strong>上关注索引分片、ANN 参数、缓存、批量 embedding 和重排成本。</p>
`,
      },
      {
        id: 'P160',
        group: 'rag',
        title: 'RAG 或大模型知识库应用中，知识不断追加导致 Prompt 越来越长时，会带来哪些问题，如何治理？',
        body: `
<p><strong>简要回答</strong></p>
<p>知识库追加内容后，最危险的做法是把更多资料直接拼进 Prompt。这样会带来三类问题。</p>
<ol>
<li><strong>上下文问题</strong>：Prompt 可能超过模型窗口，或挤掉系统指令、用户问题、历史对话和真正相关证据；长上下文中容易出现中间信息被忽略、证据相互矛盾、旧文档覆盖新文档。</li>
<li><strong>成本和性能问题</strong>：输入 token 增加会拉高 prefill 延迟、推理费用、KV cache 占用和并发压力，多步大模型应用中成本会被放大。</li>
<li><strong>质量和可靠性问题</strong>：无关知识稀释重点，过期或冲突知识诱导幻觉，未授权内容进入上下文还会造成权限泄露。</li>
</ol>
<p><strong>治理上把 Prompt 当成有限预算，而不是知识库容器</strong>：</p>
<ul>
<li><strong>知识库侧</strong>：清洗、去重、切分、元数据、版本和权限；</li>
<li><strong>检索侧</strong>：query rewrite、混合召回、rerank 和阈值过滤；</li>
<li><strong>上下文侧</strong>：优先级编排、摘要压缩、证据引用、token budget 和冲突处理；</li>
<li><strong>上线后</strong>：用召回率、引用正确率、幻觉率、P95 延迟、单次成本和 badcase 回流持续验证。</li>
</ul>
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
<p><strong>实际经验</strong>：我用 Claude Desktop 配过文件系统和 GitHub 的 MCP Server，在配置文件里加几行就能用，Claude 会自动发现工具，完全不用写对接代码。</p>
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
<p>调用时，模型通过 Function Calling 提议工具名和参数，Host 检查授权，Client 请求 Server 执行，再把结果交回模型。</p>
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
<p><strong>文件超过上下文窗口时</strong>，不要把整文件硬塞给模型，而是把问题变成相关代码定位和最小上下文构造：先建立代码结构索引（路径、符号、函数、类、调用关系、import、注释和行号），再用 grep、AST、LSP、调用图和语义检索找候选片段；按任务打包相关函数、接口定义、调用方、被调用方、配置和测试，而不是连续截取一大段；让模型基于带行号和来源的片段分析或生成补丁，必要时分轮补充上下文；最后用编译、单测、静态检查、搜索引用和人工 review 验证。核心原则是<strong>工具负责召回和裁剪，模型负责理解和改动建议</strong>，并保留可追溯的代码范围。</p>
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
        id: 'P142',
        group: 'ai-coding',
        title: 'AI Coding Agent 如何从人工逐步确认切换到自主执行？权限、审批策略、风险护栏和回滚机制应如何设计？',
        body: `
<p><strong>简要回答</strong></p>
<p>AI Coding Agent 从人工确认到自主执行不能一步切到全自动，而要按动作风险做<strong>分级授权</strong>。</p>
<ul>
<li><strong>低风险</strong>：读文件、搜索代码、运行只读命令、执行局部测试，可以默认自动；</li>
<li><strong>中风险</strong>：修改普通源码、安装开发依赖、生成 patch，可以在受限目录、受限命令和自动测试通过的前提下自动；</li>
<li><strong>高风险</strong>：删除文件、改生产配置、提交推送、访问密钥、数据库迁移、执行网络或付费操作，必须保留人工审批或更强策略。</li>
</ul>
<p><strong>权限</strong>上采用最小权限和能力令牌，Agent 只拿当前任务需要的文件、命令、网络和写入范围，并设置超时、资源配额和审计 trace。</p>
<p><strong>审批策略</strong>可以从手动确认演进为规则引擎：按动作类型、文件敏感度、diff 大小、测试覆盖、置信度和用户偏好，决定自动批准、要求确认或拒绝。</p>
<p><strong>护栏</strong>上要有沙箱、命令 allowlist、敏感信息扫描、越权检测、输出校验和二次验证。</p>
<p><strong>回滚</strong>机制要支持 patch 级回退、临时工作区、版本控制、检查点和失败自动停止。</p>
<p>最后用<strong>灰度策略</strong>上线：先在只读和测试环境自动化，再扩展到低风险代码改动，持续监控误改率、审批命中率、回滚率和用户信任。</p>
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
<p><strong>更细地可以分三层披露</strong>：第一层只给技能名称、简短描述、触发条件和风险等级，帮助 Agent 判断是否需要；第二层在选中后加载详细输入输出、步骤、约束和示例；第三层执行时再加载工具 schema、校验规则、回滚方式和异常处理。这样既减少 token 和干扰，又能让 Agent 在需要时拿到足够细节。</p>
<p>这里的加载主要是在<strong>补充模型当前的工作信息</strong>：不会更新模型参数，也不等于执行脚本。脚本仍然要通过工具调用，由宿主检查参数和权限后运行。文件发现、正文读取和上下文维护都由宿主完成，所以安装了 Skill，不代表模型已经读到了它，更不代表相关操作已经发生。</p>
<p>工程上要配合检索、权限、版本、日志和评估，避免 Skill 被误触发或执行失控。</p>
`,
      },
      {
        id: 'P124',
        group: 'tools',
        title: 'Agent 调用外部工具失败时，如何区分短暂网络抖动、工具服务不可用和业务错误，并设计超时、重试、熔断与降级策略？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会先把工具调用失败分成三类，而不是统一重试。</p>
<ol>
<li><strong>短暂网络抖动</strong>：通常表现为连接超时、偶发 5xx、DNS/TLS 抖动或单次请求延迟异常，适合短超时、指数退避、少量重试和 jitter。</li>
<li><strong>工具服务不可用</strong>：通常是持续 5xx、超时率升高、限流或依赖故障，需要熔断、限流、排队保护、降级到缓存或备用工具。</li>
<li><strong>业务错误</strong>：通常是参数不合法、权限不足、资源不存在、余额不足、状态冲突等，重试没有意义，应该把错误转换成可解释反馈，必要时让 Agent 重新规划参数或请求用户补充信息。</li>
</ol>
<p><strong>策略上按工具重要性和副作用设计</strong>：读操作可以更积极重试；写操作必须有幂等 key、去重和补偿，避免 Agent 重复下单、重复发券或重复修改状态。每个工具要有 connect timeout、read timeout、总 deadline 和上游预算传递，防止一个慢工具拖垮整轮 Agent。</p>
<p><strong>熔断</strong>要基于错误率、超时率、P95/P99、并发和限流码，半开探测恢复；<strong>降级</strong>要提前定义 fallback，例如返回缓存结果、只做检索不执行动作、切换备用 provider、让模型承认当前工具不可用并给出人工处理路径。</p>
<p>最后用 traceId 串起用户请求、模型规划、工具入参、返回码、重试次数和最终回复，才能定位是模型计划问题、参数问题还是外部依赖问题。</p>
`,
      },
      {
        id: 'P127',
        group: 'tools',
        title: '多工具 Agent 如何设计工具选择与调用调度链路，并在超时、参数错误或工具失败时做 fallback？',
        body: `
<p><strong>简要回答</strong></p>
<p>多工具 Agent 我会按「<strong>选工具、造参数、执行、观察、纠错</strong>」来设计。</p>
<p><strong>工具侧</strong>先有清晰 schema、能力描述、权限、幂等性和风险等级；<strong>调度侧</strong>根据用户意图、上下文状态、规则和模型判断召回候选工具，再让模型生成参数并经过确定性校验。</p>
<p><strong>执行时</strong>要设置超时、重试、限流和并发控制，工具结果写入任务状态，再由 planner / evaluator 判断是否继续。</p>
<p><strong>fallback 不能只写 try-catch</strong>，要按错误类型处理：</p>
<ul>
<li>参数错误：让模型修正，或触发澄清；</li>
<li>超时：切备用工具，或返回部分结果；</li>
<li>业务失败：降级到缓存、人工接管或安全终止；</li>
<li>副作用工具：审批、dry-run 和补偿。</li>
</ul>
`,
      },
      {
        id: 'P131',
        group: 'tools',
        title: '大模型 Function Call 为什么会产生工具调用幻觉？工程上如何用 schema、权限、校验和反馈闭环降低误调用？',
        body: `
<p><strong>简要回答</strong></p>
<p>Function Call 幻觉本质上是模型在不该调用工具时调用、调用不存在或不适合的工具、编造参数、漏填必填字段，或者把工具结果错误解释成事实。</p>
<p><strong>原因</strong>通常有几类：工具描述不清晰或相互重叠，schema 过宽，提示里没有明确调用条件，模型缺少外部状态，历史上下文有冲突，或者工具执行失败后没有有效反馈。</p>
<p><strong>工程上分层治理</strong>：</p>
<ol>
<li><strong>工具定义</strong>：每个工具要有清晰职责、适用条件、禁用条件、参数枚举、范围、默认值和示例，避免多个工具语义重叠。</li>
<li><strong>调用前门禁</strong>：先判断任务是否真的需要工具；对高风险工具加确认、权限和速率限制；对低置信调用要求模型补充信息，而不是硬调。</li>
<li><strong>参数校验</strong>：用严格 schema、类型检查、范围校验、业务规则、资源权限和幂等键拦住编造参数。</li>
<li><strong>执行反馈</strong>：工具返回结构化状态、错误码、可重试性和证据，模型不能把失败结果当成功。</li>
<li><strong>观测和评测</strong>：记录调用理由、入参、出参、失败原因、人工纠错和误调用样本，构建离线评测集和线上规则回放。</li>
</ol>
<p>还要把<strong>高风险工具和低风险工具分级处理</strong>，让只读查询、写操作、外发操作和不可逆操作走不同确认策略。</p>
<p>这样可以把 Function Call 从「模型想调就调」变成<strong>模型提议、系统校验、工具执行、结果回传、闭环优化</strong>的受控流程。</p>
`,
      },
      {
        id: 'P134',
        group: 'tools',
        title: 'Agent 中多个工具语义相近且副作用不同时，如何设计工具命名、description 和 JSON Schema，避免误选、漏参和高风险误触发？',
        body: `
<p><strong>简要回答</strong></p>
<p>工具注册质量不是只靠一句 description。</p>
<p><strong>命名先做粗筛</strong>：工具名应使用稳定的业务动作和对象，例如 <code>search_order</code>、<code>update_order_address</code>、<code>cancel_order_requires_confirmation</code>。避免 <code>getInfo</code>、<code>process</code>、<code>handle</code> 这类泛名，也避免同义词堆叠造成候选混淆。</p>
<p><strong>description 写使用边界</strong>：要明确业务意图、适用场景、禁止场景、调用前置条件、返回结果含义，以及与相似工具的差异。边界不清时，模型会把读操作、写操作和审批操作混成一个候选。</p>
<p><strong>schema 约束参数空间</strong>：字段要有自然语言含义、类型、必填条件、枚举、格式、默认值策略和来源说明。用户没给订单号、地址、金额等关键字段时，模型应追问或拒绝执行，而不是猜参数。</p>
<p><strong>副作用和确认前置</strong>：写操作、资金、消息发送、删除、审批等工具，要在命名、description 和 schema 中共同暴露风险等级、确认要求和幂等键。模型只负责选择和填参，真正执行仍要由服务端权限和业务规则校验。</p>
<p><strong>用评测迭代工具契约</strong>：构造工具选择测试集，覆盖相似意图、缺字段、多轮补参、高风险误触发和工具返回失败。记录误选、漏选、参数错、重复调用和无意义调用，再决定改名、改 description、收紧 schema 或拆分工具。</p>
<p>最后要落到可验证的指标、失败兜底和迭代闭环上，面试里不要只讲概念名词，要说明边界、取舍、数据来源、线上观测和出问题后的回滚或人工介入。</p>
`,
      },
      {
        id: 'P135',
        group: 'tools',
        title: 'Agent 推理链路中多个工具串行调用导致响应变慢时，如何优化延迟并保证结果可靠？',
        body: `
<p><strong>简要回答</strong></p>
<p>多个工具串行调用慢，不能只说并发。</p>
<p><strong>先拆每个工具</strong>：是否有数据依赖、是否可缓存、是否可批量、是否可提前执行，再决定并行、合并、跳过、降级或改变交互方式。</p>
<p><strong>拆阶段耗时</strong>：记录规划、检索、每个工具、模型生成、结果聚合和网络排队耗时，找出关键路径。没有 trace 就无法判断该优化工具、模型还是调度，也无法发现慢其实来自排队、重试或外部工具抖动。</p>
<p><strong>依赖图并行化</strong>：无依赖工具可以并行，有依赖工具按 DAG 调度。比如用户画像、库存、价格可以并发查；必须等订单信息后才能查售后规则的步骤则串行；写操作还要避免并发副作用。</p>
<p><strong>减少不必要调用</strong>：通过意图识别、置信阈值、缓存、预取、批量接口和参数复用减少工具次数。对低价值信息不要每轮都重新调用，对稳定信息可以在会话级缓存并记录版本。</p>
<p><strong>交互上缓解等待</strong>：长链路可以先返回已接收、展示阶段进度、流式输出中间摘要，或把后台任务异步化。用户可感知延迟比后端总耗时更影响体验，因此前端状态和取消能力也要设计。</p>
<p><strong>可靠性不能牺牲</strong>：并行和缓存可能带来过期、冲突和部分失败。需要结果版本、超时、重试、熔断、校验和降级策略，确保快的同时不乱用旧数据。</p>
<p><strong>指标</strong>：看 P50/P95/P99、关键路径耗时、工具调用次数、缓存命中率、并行成功率、超时和重试率、最终任务成功率，再按 badcase 回放持续优化。</p>
`,
      },
      {
        id: 'P144',
        group: 'tools',
        title: 'Function Call / Agent 工具调用不正确时，如何用 SFT 或 GRPO 设计数据与奖励函数来提升能力？',
        body: `
<p><strong>简要回答</strong></p>
<p>工具调用不正确时，我会先做<strong>错误分类</strong>，而不是直接加数据。</p>
<p>常见错误包括：不该调用却调用、该调用却不调用、选错工具、参数 schema 错、必填参数缺失、参数值错、调用顺序错、没有处理工具报错、拿到结果后没使用、把工具结果编造进回答、重复调用、越权调用或泄露敏感参数。不同错误对应的数据和奖励不同，混在一起训练很难收敛。</p>
<p><strong>SFT 阶段适合建立基础格式和行为边界</strong>：数据要包含用户请求、可用工具列表、工具 schema、正确 tool call、参数、工具返回、基于结果的最终回答，也要覆盖无需调用工具的样本。负例不能只做「错误答案」，要有可学习的对比信息，例如相似工具的混淆、缺少必填字段、错误枚举值、日期单位错误、用户没授权时拒绝调用、工具失败时重试或解释。多轮 Agent 数据还要保留 action-observation 轨迹，让模型学会在每次观察后更新计划，而不是一次性编造最终结果。</p>
<p><strong>GRPO 更适合在可执行或可模拟的环境里优化工具调用策略</strong>：对每个 prompt 采样多条工具调用轨迹，分别执行或用 mock server 校验，然后按一组奖励打分并做组内相对归一化。奖励可以分层：工具选择正确给分，参数 schema 通过给分，参数语义匹配给分，调用顺序和依赖正确给分，工具结果被正确引用给分，最终任务完成给分；同时对幻觉调用、无效参数、重复调用、越权工具、忽略结果、编造结果和高成本无收益调用扣分。</p>
<p>线上前必须有 <strong>guardrails</strong>：schema validator、权限校验、敏感工具确认、执行预算、幂等键、审计日志、降级回答和人工确认。</p>
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
      {
        id: 'P122',
        group: 'llm-eng',
        title: 'LLM 流式输出如何设计断点续传、停止生成和 Token 计费？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把流式输出设计成<strong>有会话状态的生成任务</strong>，而不是一次不可控的 HTTP 流。</p>
<p>每次生成要有 requestId、messageId、序列号和任务状态，服务端记录已提交给用户的增量片段、模型生成状态、取消状态和 token 使用。</p>
<p><strong>断点续传</strong>：客户端带上最后收到的序列号，服务端优先补发已确认生成但客户端未收到的片段；如果模型任务仍在运行，可以继续挂载到同一流；如果任务已结束，则返回完整结果或结束状态。</p>
<p><strong>停止生成</strong>：前端事件要传到服务端调度器，取消模型流和正在执行的工具，标记任务为 cancelled，并保证重复停止是幂等的。</p>
<p><strong>计费</strong>：以服务端实际生成或已结算 token 为准，明确 prompt token、completion token、取消前 token、失败重试 token 和补发片段的关系，补发不能重复计费。</p>
<p>关键是把<strong>流、状态、取消和计费用同一套任务记录</strong>串起来。</p>
`,
      },
      {
        id: 'P126',
        group: 'llm-eng',
        title: '大模型 SFT 从数据构建到训练通常怎么做？SFT 之后 DPO、RLHF/PPO、RL 等 Post-Training 分别解决什么问题？',
        body: `
<p><strong>简要回答</strong></p>
<p>我会把 SFT 视为大模型从预训练能力走向可用助手的<strong>第一层指令对齐</strong>。</p>
<p><strong>流程</strong>上先定义目标场景和任务分布，再采集或合成 instruction-response 数据，经过去重、质量筛选、安全过滤、格式统一和难度配比，最后用监督学习让模型学习在给定指令下生成期望答案。</p>
<p>SFT 之后的 Post-Training 解决的是 SFT 不够表达的问题：</p>
<ul>
<li><strong>DPO</strong> 用偏好对直接优化好坏答案的相对选择；</li>
<li><strong>RLHF/PPO</strong> 把人类偏好训练成奖励模型，再做策略优化；</li>
<li><strong>RL 类方法</strong>可以针对可验证任务、工具调用或多步推理优化长期目标。</li>
</ul>
<p>回答时要强调它们<strong>不是线性堆 buzzword</strong>，而是分别面向指令遵循、偏好排序、风险控制、复杂目标和线上反馈的不同训练机制。</p>
`,
      },
      {
        id: 'P129',
        group: 'llm-eng',
        title: '多轮对话中 Attention 为什么可能导致历史信息衰减？',
        body: `
<p><strong>简要回答</strong></p>
<p>可以从机制和工程两层回答。</p>
<p><strong>机制上</strong>，Transformer 的 Attention 会让当前 token 对上下文中所有 token 分配权重，但权重总量是竞争性的。多轮对话越长，新的用户意图、最近的实体、系统提示、工具结果和噪声内容越多，早期关键信息即使还在窗口内，也可能因为相关性得分低、距离远或被大量 token 稀释而分不到足够权重。</p>
<p>上下文窗口还有硬限制，超过长度后历史会被截断；即使用摘要保留历史，摘要也会损失细节、约束和语气。</p>
<p><strong>工程上</strong>，KV Cache 只是加速推理保存历史键值，并不天然提供永久记忆，窗口滑动或服务端策略仍可能丢掉旧轮次。</p>
<p><strong>缓解方法</strong>包括关键信息结构化记忆、周期性摘要但保留原始证据、RAG 检索历史片段、对用户画像和任务状态做显式存储，以及在提示词中把长期约束与当前目标分层组织。</p>
`,
      },
      {
        id: 'P136',
        group: 'llm-eng',
        title: '高并发或批量任务下，如何设计弹性伸缩、动态限流、优先级调度、背压、故障隔离与告警？',
        body: `
<p><strong>简要回答</strong></p>
<p>Agent 高并发的瓶颈不只在 Web 服务，还包括模型额度、GPU / 推理服务、工具服务、向量库、队列、数据库和成本预算。批量任务同时占用这些资源时，排队变长、超时增多、重试放大，最终可能把上下游一起拖垮。所以弹性伸缩要围绕完整链路设计，并用监控和告警提前发现雪崩风险。</p>
<p><strong>容量对象分层</strong>：分别评估入口 QPS、会话并发、队列长度、模型请求、token 吞吐、工具 QPS、向量库查询和数据库写入。不同资源的扩缩容速度和上限不同。</p>
<p><strong>伸缩指标要组合</strong>：CPU 只是基础指标。Agent 服务更应看排队时间、P95/P99 延迟、最老任务年龄、模型限流、工具错误率、token/s、成本消耗和成功率。</p>
<p><strong>队列和限流保护</strong>：突发流量先进入优先级队列，按租户、任务类型和风险等级限流。低优先级任务可延迟、降级或暂停，保障在线关键任务。</p>
<p><strong>动态限流</strong>：按租户、任务类型、模型供应商、工具服务和全局资源设置令牌桶或并发窗口，并根据实时延迟、错误率、队列长度、下游限额和成本预算动态收缩或放大。</p>
<p><strong>优先级调度</strong>：区分实时用户任务、付费高价值任务、后台批处理、重试任务和低优先级探索任务，避免低价值批量任务挤占实时链路。</p>
<p><strong>背压</strong>：核心是让下游压力传导到上游。队列积压时延迟接收、拒绝新任务、降低并发、暂停低优先级任务或返回排队状态，而不是无限堆积。</p>
<p><strong>故障隔离</strong>：按任务池、工具池、模型池、租户和风险等级隔离资源，单个下游异常只影响相关任务，并通过熔断、降级、超时、有限重试、死信队列和人工补偿收敛。</p>
<p><strong>告警分级处理</strong>：分为容量预警、错误率告警、业务质量告警和成本告警，并绑定自动动作，如扩容、切模型、熔断工具、降级、通知值班和回滚配置。</p>
<p><strong>观测要能归因</strong>：每个请求要有 trace，记录模型、工具、检索、版本、租户和成本。否则告警触发后，也无法定位是模型慢、工具挂、检索慢还是队列积压。</p>
<p>落地时配合容量压测、故障演练和事后复盘验证伸缩与告警是否真的生效，避免只配了阈值没有可执行动作。</p>
`,
      },
      {
        id: 'P141',
        group: 'llm-eng',
        title: '知识卡片抽取 Prompt 中为什么要同时写好示例和坏示例？如何用正反 few-shot 稳定结构化输出？',
        body: `
<p><strong>简要回答</strong></p>
<p>知识卡片抽取 Prompt 里同时放好示例和坏示例，本质是在给模型建立一个<strong>可执行的判别边界</strong>。</p>
<p><strong>好示例</strong>定义目标结构、字段粒度、表达风格和信息来源；<strong>坏示例</strong>定义禁止行为，比如凭空补充、字段混淆、把无关信息抽成知识点、格式不符合 schema、过度压缩导致关键信息丢失。</p>
<p>正反 few-shot 的价值不是堆例子，而是覆盖最常见的边界场景，让模型知道「像这样输出」和「不要这样输出」的差别。</p>
<p><strong>落地时</strong>我会先定义字段 schema 和验收规则，再选覆盖面高的正例、反例和边界例，最后用离线样本评估准确率、字段完整率、格式合法率和人工修改率。</p>
`,
      },
      {
        id: 'P149',
        group: 'llm-eng',
        title: 'Agent 异步任务通过消息队列处理时，如何将处理结果与原请求关联？为什么不直接用数据库通信？',
        body: `
<p><strong>简要回答</strong></p>
<p>Agent 异步任务经消息队列处理时，结果关联不能靠消费者记忆，也不能只靠数据库轮询。</p>
<p>标准做法是入口生成全局 <strong>requestId / taskId</strong>，消息、状态表、trace 和回调都携带这个标识，用队列解耦执行压力，用数据库保存可查询状态。</p>
<p><strong>入口生成关联键</strong>：用户请求进入后创建 taskId、sessionId、userId、幂等键和 traceId。后续每条 MQ 消息、工具调用、状态更新和结果回调都携带这些字段。</p>
<p><strong>状态表记录进度</strong>：数据库适合保存任务状态、阶段、版本、结果摘要、失败原因和更新时间。前端可以查状态或订阅推送，但执行本身不应靠数据库锁和轮询驱动。</p>
<p><strong>队列负责削峰解耦</strong>：MQ 负责异步投递、重试、缓冲和消费者扩缩容，把模型调用、工具执行、结果聚合拆开，避免用户请求线程长时间阻塞。</p>
<p><strong>为什么不直接用数据库通信</strong>：数据库擅长持久化和查询，不擅长任务分发。拿数据库当队列，就要自己实现轮询、锁、可见性超时、重试、死信和消费者扩缩容，还会把业务库读写压力放大、延迟抬高。即使使用 <code>SKIP LOCKED</code> 这类方案，也只在吞吐不高、运维想少引入组件时合适。</p>
<p><strong>结果回传要幂等</strong>：消费者写结果时按 taskId 和阶段做幂等校验，避免重复消费导致重复写入、重复通知或重复执行有副作用的工具。</p>
<p><strong>异常路径要闭环</strong>：处理超时、死信、取消、重试耗尽、消费者崩溃和结果迟到；状态机定义 <code>running</code>、<code>succeeded</code>、<code>failed</code>、<code>cancelled</code>、<code>expired</code> 等终态。</p>
<p><strong>观测指标</strong>：队列积压、消息年龄、消费成功率、重试率、死信量、任务端到端延迟、状态滞留时长和重复写入次数。</p>
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
]

export const categoryOrder = [
  'predicted',
  'frontend',
]

export const totalQuestions = categories.reduce(
  (sum, category) => sum + category.questions.length,
  0,
)
