<script setup lang="ts">
import {
  modules,
  moduleTitle,
  questionLabel,
  questionLegacyAnchor,
  questionSlug,
  questionsForSubmodule,
  topicQuestions,
  totalQuestions,
} from '../data/interview-bank.mjs'
import ZoomableFigure from './ZoomableFigure.vue'

const moduleBlocks = modules.map((module, index) => {
  const submodules = module.submodules
    .map((submodule) => ({
      ...submodule,
      questions: questionsForSubmodule(module.id, submodule.id),
    }))
    .filter((submodule) => submodule.questions.length > 0)

  return {
    ...module,
    number: index + 1,
    count: submodules.reduce(
      (sum, submodule) => sum + submodule.questions.length,
      0,
    ),
    submodules,
  }
})

const evaluationQuestions = topicQuestions('evaluation')

const frameworkLabels: Record<string, string> = {
  langchain: 'LangChain',
  langgraph: 'LangGraph',
  llamaindex: 'LlamaIndex',
  mastra: 'Mastra',
}

const topicLabels: Record<string, string> = {
  evaluation: '评测与质量',
}
</script>

<template>
  <div class="interview-bank-doc">
    <p class="interview-bank-doc__summary">
      共 <strong>{{ totalQuestions }}</strong> 题。左侧按 8 个知识模块和二级分组导航，右侧题目和答案；同一道题只归一个主模块。
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
              <td>Precision@K</td>
              <td>精确率@K：前 K 个候选里有多少是真正相关的。和召回率一起看：召回看「有没有漏」，精确看「有没有混进无关内容」。</td>
            </tr>
            <tr>
              <td>Hit@K</td>
              <td>命中率@K：前 K 个候选里只要出现至少一个相关结果，这一题就算命中；多题取命中比例。每题只有一个相关结果时，Hit@K 和 Recall@K 基本等价。</td>
            </tr>
            <tr>
              <td>nDCG@k</td>
              <td>归一化折损累计增益。越相关、排得越靠前，得分越高；再除以理想排序的得分做归一化。适合相关性有等级的检索评估。</td>
            </tr>
            <tr>
              <td>MRR</td>
              <td>平均倒数排名。先看第一个相关结果排第几，取倒数；多道题再取平均。排第 1 得 1，排第 2 得 0.5，排第 3 得 0.33，越靠前越高。</td>
            </tr>
            <tr>
              <td>MAP</td>
              <td>平均精度均值。先对每题算平均精度：每命中一个相关结果，就看它当前位置的精确率，再对这些精确率取平均；最后多题再平均。既看相关性，也看相关结果排得靠不靠前。</td>
            </tr>
            <tr>
              <td>证据 Recall@k</td>
              <td>也叫 context Recall@k。看送进生成上下文的前 K 条里，有没有覆盖回答所需的证据片段；它不看文档整体是否相关，而是看「支撑答案的那段证据有没有被带进来」。</td>
            </tr>
            <tr>
              <td>query classifier</td>
              <td>查询分类器。先判断用户问题属于哪一类，比如语义问答、错误码、产品名、接口路径或短词查询，再据此选择检索路、融合权重或过滤条件。</td>
            </tr>
            <tr>
              <td>learned ranker</td>
              <td>学习型排序器。用标注数据训练排序模型，根据 query 和候选片段的特征打分重排，代替固定规则或人工权重；需要标注集和离线评估。</td>
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

    <section id="topic-evaluation" class="interview-bank-doc__topic">
      <h2>专题：评测与质量</h2>
      <p class="interview-bank-doc__topic-lead">
        评测题仍归属各自的知识模块，这里按标签聚合，方便集中复习。
      </p>
      <ul class="interview-bank-doc__topic-list">
        <li v-for="question in evaluationQuestions" :key="question.id">
          <a :href="`#${questionSlug(question)}`">
            <span class="interview-bank-doc__num">{{ questionLabel(question) }}</span>
            {{ question.title }}
          </a>
          <span class="interview-bank-doc__topic-module">{{ moduleTitle(question.module) }}</span>
        </li>
      </ul>
    </section>

    <template v-for="block in moduleBlocks" :key="block.id">
      <section
        :id="`module-${block.id}`"
        class="interview-bank-doc__module"
      >
        <h2>
          {{ block.number }}. {{ block.title }}
          <span class="interview-bank-doc__count">{{ block.count }} 题</span>
        </h2>

        <template v-for="submodule in block.submodules" :key="submodule.id">
          <h3 :id="`sub-${submodule.id}`" class="interview-bank-doc__submodule">
            {{ submodule.title }}
            <span class="interview-bank-doc__count">{{ submodule.questions.length }} 题</span>
          </h3>

          <article
            v-for="question in submodule.questions"
            :key="question.id"
            class="interview-bank-doc__question"
          >
            <span
              :id="questionLegacyAnchor(question)"
              class="interview-bank-doc__legacy-anchor"
              aria-hidden="true"
            />
            <h4 :id="questionSlug(question)">
              <span class="interview-bank-doc__num">{{ questionLabel(question) }}</span>
              {{ question.title }}
            </h4>

            <p
              v-if="question.frameworks?.length || question.topics?.length"
              class="interview-bank-doc__tags"
            >
              <span
                v-for="framework in question.frameworks"
                :key="`f-${framework}`"
                class="interview-bank-doc__tag"
              >
                框架：{{ frameworkLabels[framework] ?? framework }}
              </span>
              <span
                v-for="topic in question.topics"
                :key="`t-${topic}`"
                class="interview-bank-doc__tag"
              >
                专题：{{ topicLabels[topic] ?? topic }}
              </span>
            </p>

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
        </template>
      </section>
    </template>
  </div>
</template>
