import { readFile, writeFile } from 'node:fs/promises'

const file = 'docs/.vitepress/data/interview-bank.mjs'
let text = await readFile(file, 'utf8')

const start = text.indexOf("  {\n    id: 'predicted',")
const end = text.indexOf("\n]\n\nexport const categoryOrder", start)
if (start < 0 || end < 0) throw new Error('predicted block not found')

const block = `  {
    id: 'predicted',
    title: '面试预测题',
    description:
      '这里放我猜面试官可能问的题，按智能体 → 前端 JS 从上往下排；和下面分类重复的题只保留在这里。',
    questions: [
      {
        id: 'P03',
        title: '什么是智能体（Agent）？和大模型有什么本质不同？',
        body: \`
<p><strong>一句话</strong>：智能体是一个能自主完成目标的 AI 系统。它和传统 AI 最核心的区别是「自主性」和「能行动」。</p>
<p>传统 AI 是你问一个问题它回答一个问题，每次独立、被动响应；智能体会把复杂目标拆成多步，通过调工具、访问记忆、感知环境来一步步执行，直到完成。</p>
<p>它不只是输出文字，而是真的能做事。大模型负责理解和生成；智能体在大模型外面加了规划、工具、记忆和执行循环。</p>
\`,
      },
      {
        id: 'P04',
        title: '智能体的基本架构是什么？',
        body: \`
<p><strong>智能体 = 大模型 + 工具 + 记忆 + 规划模块。</strong></p>
<ul>
<li><strong>大模型</strong>：整个系统的大脑，负责理解任务和做决策。</li>
<li><strong>工具</strong>：让智能体能跟外部世界交互，搜索、执行代码、调 API 都靠它。</li>
<li><strong>记忆</strong>：让智能体在任务执行过程中保持状态，不会「失忆」。</li>
<li><strong>规划模块</strong>：负责把复杂目标拆解成可执行的步骤。</li>
</ul>
<p>生产里再加执行循环和边界控制。</p>
\`,
      },
      {
        id: 'P05',
        title: '工作流（Workflow）、智能体（Agent）、工具（Tools）有什么区别？',
        body: \`
<p><strong>三者是从小到大的三层结构。</strong></p>
<p><strong>工具（Tools）</strong>：最小的能力单元，封装好的可调用函数，比如搜索、执行代码、发邮件。它只负责执行，本身没有决策能力。</p>
<p><strong>智能体（Agent）</strong>：完整的决策系统，内部用大模型做大脑，自己判断什么时候调哪个工具、要不要继续、什么时候结束，是主动的。</p>
<p><strong>工作流（Workflow）</strong>：更上层的编排框架，把智能体、大模型、工具组织成一条确定性流程；每个节点做什么、按什么顺序流转，都是开发者提前写死的。</p>
<p><strong>核心区别</strong>：工具不做决策只执行；智能体自己做决策；工作流是开发者替所有节点把决策提前写好。</p>
\`,
      },
      {
        id: 'P06',
        title: '了解哪些智能体设计范式？智能体和工作流有什么区别？',
        body: \`
<p><strong>最核心的区别是「谁来决定下一步」。</strong>工作流提前把流程写死，每一步固定，确定性强、好控制；智能体让大模型决定下一步，灵活但不可控。</p>
<p><strong>常见范式</strong>：ReAct、Plan-and-Execute、Reflection，另外还有 Router 分类分发、Multi-Agent 多智能体、Human-in-the-loop 人工确认、Memory-augmented 记忆增强、Tree of Thoughts / Self-consistency 多路径或多答案投票。</p>
<p><strong>Plan-and-Execute</strong>：先产出多步计划，再逐步执行；失败或出现新信息时重规划。计划可以被程序校验、并行和限步。</p>
<p><strong>Reflection</strong>：生成 → 批判 → 修订；风险是自我评审偏差和延迟。</p>
<p><strong>工程里</strong>：固定流程用工作流，需要灵活决策的节点嵌入智能体，整体可控、局部灵活。</p>
\`,
      },
      {
        id: 'P01',
        title: 'Function Call 和 MCP 有什么区别？',
        body: \`
<p><strong>Function Call</strong>：模型根据参数结构，生成“调用哪个函数、传什么参数”，真正执行的是你的程序。</p>
<p><strong>MCP</strong>：一套标准协议，让客户端发现、连接、描述和调用外部工具 / 资源。</p>
<p><strong>关系</strong>：Function Call 是模型的调用能力；MCP 是工具接入协议。可以只用 Function Call；MCP 里的工具最终通常也通过 Function Call 暴露给模型。</p>
<p><strong>项目里</strong>：江中通过 MCP 拿工具目录，Function Call 提议调用，服务端做参数校验、权限和审批。</p>
\`,
      },
      {
        id: 'P02',
        title: 'WebSocket 和 MQTT 有什么区别？',
        body: \`
<p><strong>WebSocket</strong>：全双工长连接，客户端和服务端都能主动推；适合实时对话、大屏同步、三维控制。</p>
<p><strong>MQTT</strong>：发布 / 订阅，轻量、省带宽；适合设备到云、海量设备和弱网环境。</p>
<p><strong>项目里</strong>：大屏和 iPad 同步用 WebSocket；设备状态上报 / 订阅用 MQTT。</p>
<p><strong>选型</strong>：看是“双向实时交互”还是“设备遥测和发布订阅”。</p>
\`,
      },
    ],
  },
`

text = text.slice(0, start) + block + text.slice(end)
await writeFile(file, text, 'utf8')
console.log('trimmed predicted questions')
