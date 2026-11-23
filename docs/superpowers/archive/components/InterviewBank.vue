<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { categories, totalQuestions } from '../data/interview-bank.mjs'
import ZoomableFigure from './ZoomableFigure.vue'

const query = ref('')
const selectedId = ref(categories[0].questions[0].id)
const openIds = ref<string[]>(categories.map((category) => category.id))
const reader = ref<HTMLElement | null>(null)

const flatQuestions = computed(() =>
  categories.flatMap((category) =>
    category.questions.map((question) => ({
      ...question,
      categoryId: category.id,
      categoryTitle: category.title,
    })),
  ),
)

const filteredCategories = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return categories
  return categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter((question) =>
        `${question.id} ${question.title} ${question.body}`
          .toLowerCase()
          .includes(term),
      ),
    }))
    .filter((category) => category.questions.length)
})

const selected = computed(
  () => flatQuestions.value.find((question) => question.id === selectedId.value) ?? null,
)

const currentIndex = computed(() =>
  flatQuestions.value.findIndex((question) => question.id === selectedId.value),
)

const previous = computed(() =>
  currentIndex.value > 0 ? flatQuestions.value[currentIndex.value - 1] : null,
)

const next = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < flatQuestions.value.length - 1
    ? flatQuestions.value[currentIndex.value + 1]
    : null,
)

function isOpen(categoryId: string) {
  if (query.value.trim()) return true
  return openIds.value.includes(categoryId)
}

function toggleCategory(categoryId: string) {
  openIds.value = openIds.value.includes(categoryId)
    ? openIds.value.filter((id) => id !== categoryId)
    : [...openIds.value, categoryId]
}

function openCategory(categoryId: string) {
  if (!openIds.value.includes(categoryId)) {
    openIds.value = [...openIds.value, categoryId]
  }
}

function selectQuestion(question: { id: string; categoryId: string }, updateHash = true) {
  selectedId.value = question.id
  openCategory(question.categoryId)
  if (updateHash && typeof window !== 'undefined') {
    history.replaceState(null, '', `#${question.id}`)
  }
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 960px)').matches) {
    nextTick(() => reader.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
}

function selectFromHash() {
  if (typeof window === 'undefined') return
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, '')).toLowerCase()
  if (!hash) return
  const question = flatQuestions.value.find(
    (item) => item.id.toLowerCase() === hash,
  )
  if (question) selectQuestion(question, false)
}

onMounted(() => {
  selectFromHash()
  window.addEventListener('hashchange', selectFromHash)
})
</script>

<template>
  <div class="interview-bank">
    <div class="interview-bank__top">
      <p class="interview-bank__summary">
        共 <strong>{{ totalQuestions }}</strong> 题。左边分类和题号，右边题目和答案。
      </p>
      <label class="interview-bank__search">
        <span class="sr-only">搜索题号或关键词</span>
        <input v-model="query" type="search" placeholder="搜索题号或关键词" />
      </label>
    </div>

    <div class="interview-bank__workspace">
      <nav class="interview-bank__nav" aria-label="面试题分类">
        <p v-if="!filteredCategories.length" class="interview-bank__empty">
          没有匹配的题目。
        </p>
        <section
          v-for="category in filteredCategories"
          :key="category.id"
          class="interview-bank__category"
        >
          <button
            type="button"
            class="interview-bank__category-button"
            :aria-expanded="isOpen(category.id)"
            @click="toggleCategory(category.id)"
          >
            <span>{{ category.title }}</span>
            <em>{{ category.questions.length }}</em>
          </button>
          <ul v-if="isOpen(category.id)" class="interview-bank__list">
            <li v-for="question in category.questions" :key="question.id">
              <button
                type="button"
                class="interview-bank__question"
                :class="{ active: selectedId === question.id }"
                @click="selectQuestion({ ...question, categoryId: category.id })"
              >
                <span class="interview-bank__num">{{ question.id }}</span>
                <span>{{ question.title }}</span>
              </button>
            </li>
          </ul>
        </section>
      </nav>

      <article ref="reader" class="interview-bank__reader" aria-live="polite">
        <template v-if="selected">
          <p class="interview-bank__meta">
            {{ selected.categoryTitle }} · {{ selected.id }}
          </p>
          <h2 class="interview-bank__title">
            <span class="interview-bank__num">{{ selected.id }}</span>
            {{ selected.title }}
          </h2>
          <div class="vp-doc interview-bank__body" v-html="selected.body" />

          <ZoomableFigure
            v-if="selected.figure === 'jiangzhong'"
            src="/assets/jiangzhong/architecture.svg"
            alt="江中智能助手系统架构、智能体运行流程与 LangGraph 主图"
            caption="江中系统架构、智能体运行流程与 LangGraph 主图；可缩放、可拖拽。"
          />
          <ZoomableFigure
            v-else-if="selected.figure === 'thingjs'"
            src="/assets/thingjs/architecture.webp"
            alt="THINGJS 文档 RAG 系统架构、索引、检索、生成、评测与发布门禁"
            caption="THINGJS 系统流程、离线索引、在线检索、评测与发布门禁；可缩放、可拖拽，或打开原图。"
            original="/assets/thingjs/architecture-large.webp"
          />

          <div class="interview-bank__pager">
            <button
              type="button"
              :disabled="!previous"
              @click="previous && selectQuestion(previous)"
            >
              ← {{ previous?.id || '没有上一题' }}
            </button>
            <button
              type="button"
              :disabled="!next"
              @click="next && selectQuestion(next)"
            >
              {{ next?.id || '没有下一题' }} →
            </button>
          </div>
        </template>
      </article>
    </div>
  </div>
</template>
