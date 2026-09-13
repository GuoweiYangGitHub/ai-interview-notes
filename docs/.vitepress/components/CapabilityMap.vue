<template>
  <section
    id="能力地图"
    class="capability-map"
    aria-labelledby="capability-map-title"
  >
    <div class="capability-map__intro">
      <p class="capability-map__eyebrow">CAPABILITY MAP</p>
      <h2 id="capability-map-title">从技术判断到交付证据</h2>
      <p>
        以 AI
        应用开发岗位的真实工作链路组织内容：理解模型能力，构建可靠应用，并能用项目说明设计取舍。
      </p>
      <a class="capability-map__core-link" href="/核心能力/"
        >按核心能力顺序复习 →</a
      >
    </div>

    <div class="capability-map__grid">
      <a class="capability-card" href="/C-模型能力/">
        <span class="capability-card__index">01</span>
        <h3>模型原理与选型</h3>
        <p>理解模型边界、Embedding、多模态与微调的适用条件。</p>
        <span class="capability-card__cta">查看专题 →</span>
      </a>
      <a class="capability-card" href="/A-应用开发/">
        <span class="capability-card__index">02</span>
        <h3>AI 应用构建</h3>
        <p>Prompt、RAG、Agent、工具调用与应用框架。</p>
        <span class="capability-card__cta">查看专题 →</span>
      </a>
      <a class="capability-card" href="/B-工程落地/">
        <span class="capability-card__index">03</span>
        <h3>服务与生产工程</h3>
        <p>流式交互、评测、可观测性、安全、部署与性能。</p>
        <span class="capability-card__cta">查看专题 →</span>
      </a>
      <a class="capability-card capability-card--project" href="/E-代码示例/">
        <span class="capability-card__index">04</span>
        <h3>代码参考</h3>
        <p>按专题浏览示例源码，对照笔记里的判断和选型。</p>
        <span class="capability-card__cta">查看示例 →</span>
      </a>
    </div>

    <div class="capability-map__support" aria-label="辅助材料">
      <a href="/E-代码示例/">代码示例</a>
      <span aria-hidden="true">·</span>
      <a href="/语法对照/">Python / JavaScript 语法对照</a>
    </div>
  </section>
</template>
