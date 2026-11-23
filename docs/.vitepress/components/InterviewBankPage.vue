<script setup lang="ts">
import {
  categories,
  categoryOrder,
  predictedGroups,
  totalQuestions,
} from '../data/interview-bank.mjs'
import ZoomableFigure from './ZoomableFigure.vue'

const orderedCategories = categoryOrder
  .map((id) => categories.find((category) => category.id === id))
  .filter(Boolean)

const introCategories = orderedCategories.filter(
  (category) => category.id === 'project-intro',
)
const predictedContainer = orderedCategories.find(
  (category) => category.id === 'predicted',
)
const predictedCategories = predictedGroups.map((group) => ({
  id: group.id,
  title: group.title,
  description: group.description,
  questions:
    predictedContainer?.questions.filter(
      (question) => question.group === group.group,
    ) ?? [],
}))
const followUpCategories = orderedCategories.filter(
  (category) =>
    category.id !== 'project-intro' && category.id !== 'predicted',
)

const blocks = [
  ...introCategories.map((category) => ({ type: 'category', category })),
  ...predictedCategories.map((category) => ({ type: 'category', category })),
  {
    type: 'label',
    id: 'follow-ups',
    title: '面试官追问',
    lead: '下面按项目、智能体、简历、对比和前端分类整理；每个分类从 Q01 开始。',
  },
  ...followUpCategories.map((category) => ({ type: 'category', category })),
]

function localNumber(index: number) {
  return `Q${String(index + 1).padStart(2, '0')}`
}
</script>

<template>
  <div class="interview-bank-doc">
    <p class="interview-bank-doc__summary">
      共 <strong>{{ totalQuestions }}</strong> 题。左侧分类和题号，右侧题目和答案。
    </p>

    <section id="keywords" class="interview-bank-doc__keywords">
      <h2>关键词</h2>
      <p class="interview-bank-doc__keywords-lead">
        面试里常听到的词，先用中文说清它是什么。
      </p>
      <div class="interview-bank-doc__keywords-table-wrap">
        <table class="interview-bank-doc__keywords-table">
          <thead>
            <tr>
              <th>关键词</th>
              <th>是什么</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SSE</td>
              <td>服务器推送。服务端边生成边把结果推给前端，前端不用等完整回答。</td>
            </tr>
            <tr>
              <td>TTFT</td>
              <td>Time To First Token，用户多久看到第一个字 / Token；流式体验看它，端到端总耗时另算。</td>
            </tr>
            <tr>
              <td>trace</td>
              <td>调用链。把一次请求经过的步骤串起来，能看出慢在哪一步、错在哪一层。</td>
            </tr>
            <tr>
              <td>Span</td>
              <td>调用链里的一个时间片段 / 节点，记录某个环节的耗时、状态和属性；多个 Span 组成一条 Trace，用同一个 Trace ID 串起来。</td>
            </tr>
            <tr>
              <td>RRF</td>
              <td>排名融合。向量检索和关键词检索各给一个排名，按名次把两路结果合并。</td>
            </tr>
            <tr>
              <td>Recall@K</td>
              <td>召回率@K：前 K 个候选里覆盖了多少本该召回的结果。K 越小要求越高，常用来衡量检索或工具候选集够不够全。</td>
            </tr>
            <tr>
              <td>父块回填</td>
              <td>切片时子块可能丢掉上下文；命中子块后，把它所属的父块补回上下文。</td>
            </tr>
            <tr>
              <td>证据守卫</td>
              <td>生成前后检查答案有没有检索证据支持；没有证据就拒答或降级，防止编造。</td>
            </tr>
            <tr>
              <td>泛化损失</td>
              <td>模型或系统在常见场景表现好，遇到长尾、跨域、混合意图等新场景时效果明显下降。Expert 拆分、微调和规则化后要专门用长尾集压测。</td>
            </tr>
            <tr>
              <td>Critic 校验</td>
              <td>由独立角色或模型审查主 Agent 的计划、工具调用或答案，发现问题就要求修订、重试或转人工。和自评不同，最好用独立上下文、规则或可执行检查。</td>
            </tr>
            <tr>
              <td>Prometheus 定位退化</td>
              <td>用 Prometheus 监控 P95、错误率、空答率等指标，发现新版本上线后的质量下降，再结合 trace 和评测定位。</td>
            </tr>
            <tr>
              <td>有界重试</td>
              <td>失败重试有次数、时间和退避上限；超过就停止、换方案或转人工，避免无限重试和重复副作用。只对可重试的瞬时错误重试，写操作要幂等。</td>
            </tr>
            <tr>
              <td>幂等键</td>
              <td>给一次写操作分配唯一标识；重复提交同一个键，服务端只执行一次。用来防超时重试、任务恢复导致重复扣款、重复下单。</td>
            </tr>
            <tr>
              <td>Checkpoint</td>
              <td>检查点。把执行中的状态、已完成步骤和中间结果持久化；中断、超时或重启后从最近检查点恢复，不必从头重跑。</td>
            </tr>
            <tr>
              <td>Correlation ID</td>
              <td>一次请求或异步任务的全局关联标识，贯穿入口、MQ 消息、状态表、工具调用、回调、日志和 trace，用同一个 ID 把上下游串起来。常与 taskId / traceId 配合。</td>
            </tr>
            <tr>
              <td>索引发布</td>
              <td>新索引构建并校验通过后，切换激活指针；失败回滚旧版本，不停服。</td>
            </tr>
            <tr>
              <td>XSS 净化</td>
              <td>渲染 Markdown 或 HTML 前过滤危险脚本和标签，防止用户内容注入执行。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <template
      v-for="(block, blockIndex) in blocks"
      :key="block.type === 'category' ? block.category.id : `label-${blockIndex}`"
    >
      <section
        v-if="block.type === 'label'"
        :id="block.id"
        class="interview-bank-doc__section"
      >
        <h2>{{ block.title }}</h2>
        <p>{{ block.lead }}</p>
      </section>

      <section
        v-else
        :id="`cat-${block.category.id}`"
        class="interview-bank-doc__category"
      >
        <h2>{{ block.category.title }}</h2>
        <p
          v-if="block.category.description"
          class="interview-bank-doc__category-lead"
        >
          {{ block.category.description }}
        </p>
        <p
          v-if="!block.category.questions.length"
          class="interview-bank-doc__empty"
        >
          暂无题目，后续补充。
        </p>

        <article
          v-for="(question, index) in block.category.questions"
          :key="question.id"
          class="interview-bank-doc__question"
        >
          <h3 :id="`${block.category.id}-${localNumber(index)}`">
            <span class="interview-bank-doc__num">{{ localNumber(index) }}</span>
            {{ question.title }}
          </h3>

          <div class="vp-doc interview-bank-doc__body" v-html="question.body" />

          <ZoomableFigure
            v-if="question.figure === 'jiangzhong'"
            src="/assets/jiangzhong/architecture.svg"
            alt="江中智能助手系统架构、智能体运行流程与 LangGraph 主图"
            caption="江中系统架构、智能体运行流程与 LangGraph 主图；可缩放、可拖拽。"
          />
          <ZoomableFigure
            v-else-if="question.figure === 'thingjs'"
            src="/assets/thingjs/architecture.webp"
            alt="THINGJS 文档问答系统架构、索引、检索、生成、评测与发布门禁"
            caption="THINGJS 系统流程、离线索引、在线检索、评测与发布门禁；可缩放、可拖拽，或打开原图。"
            original="/assets/thingjs/architecture-large.webp"
          />
        </article>
      </section>
    </template>
  </div>
</template>
