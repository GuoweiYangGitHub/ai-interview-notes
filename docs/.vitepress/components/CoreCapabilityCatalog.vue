<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter, withBase } from 'vitepress'
import generatedManifest from '../core-topics.generated.mjs'

const query = ref('')
const manifest = generatedManifest
const mode = ref('catalog')
const selectedGroup = ref('')
const statusFilter = ref('all')
const kindFilter = ref('all')
const selectedId = ref('')
const localState = ref({})
const hydrated = ref(false)
const storageKey = 'ai-docs/core-review/v1'
const router = useRouter()
const readerEl = ref(null)

const kindOptions = [
  { id: 'all', label: '全部' },
  { id: 'knowledge', label: '知识点' },
  { id: 'qa', label: '技术问答' },
  { id: 'project', label: '项目' },
]

onMounted(() => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}')
    if (saved && typeof saved === 'object') localState.value = saved
  } catch {
    localState.value = {}
  }
  hydrated.value = true
  syncFromLocation()
  window.addEventListener('hashchange', syncFromLocation)
  window.addEventListener('popstate', syncFromLocation)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncFromLocation)
  window.removeEventListener('popstate', syncFromLocation)
})

watch(
  () => router.route.hash,
  () => {
    if (typeof window !== 'undefined') syncFromLocation()
  },
)

const allTopics = computed(() =>
  manifest.groups.flatMap((group) => group.topics),
)

const normalizedQuery = computed(() => query.value.trim().toLowerCase())
const visibleGroups = computed(() => {
  return manifest.groups
    .filter(
      (group) =>
        mode.value !== 'review' ||
        !selectedGroup.value ||
        group.id === selectedGroup.value,
    )
    .map((group) => ({
      ...group,
      topics: group.topics.filter((topic) => {
        const haystack =
          `${group.title} ${group.description} ${topic.title} ${topic.module} ${kindLabel(topic.kind)}`.toLowerCase()
        const matchesStatus =
          statusFilter.value === 'all' ||
          reviewStatus(topic.id) === statusFilter.value
        const matchesKind =
          kindFilter.value === 'all' || topic.kind === kindFilter.value
        return (
          (!normalizedQuery.value ||
            haystack.includes(normalizedQuery.value)) &&
          matchesStatus &&
          matchesKind
        )
      }),
    }))
    .filter((group) => group.topics.length)
})

const visibleCount = computed(() =>
  visibleGroups.value.reduce((sum, group) => sum + group.topics.length, 0),
)

const selectedTopic = computed(() => findTopic(selectedId.value))

function kindLabel(kind) {
  return (
    { knowledge: '知识点', qa: '技术问答', project: '项目经历' }[kind] || kind
  )
}

function href(path) {
  return withBase(path)
}

function reviewStatus(id) {
  return localState.value[id]?.status || 'unseen'
}

function statusLabel(id) {
  return { unseen: '未复习', review: '待复习', mastered: '已掌握' }[
    reviewStatus(id)
  ]
}

function promptFor(topic) {
  return {
    knowledge: '先尝试解释或画出链路',
    qa: '先口述答案，再对照正文',
    project: '先复盘方案、取舍与边界',
  }[topic.kind]
}

function slugifyTopicId(id) {
  return id.replace(/[/.]/g, '-')
}

function findTopic(id) {
  if (!id) return null
  const exact = allTopics.value.find((topic) => topic.id === id)
  if (exact) return exact
  const slug = slugifyTopicId(id)
  return (
    allTopics.value.find(
      (topic) =>
        slugifyTopicId(topic.id) === id || slugifyTopicId(topic.id) === slug,
    ) || null
  )
}

function readTopicId() {
  if (typeof window === 'undefined') return ''
  const raw = window.location.hash.replace(/^#/, '')
  if (!raw) return ''
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

function writeTopicHash(id) {
  if (typeof window === 'undefined') return
  const next = id ? `#${encodeURIComponent(id)}` : ''
  const url = `${window.location.pathname}${window.location.search}${next}`
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== url) {
    history.replaceState(null, '', url)
  }
}

function syncFromLocation() {
  const topic = findTopic(readTopicId())
  if (topic) selectedId.value = topic.id
}

function selectTopic(topic) {
  selectedId.value = topic.id
  writeTopicHash(topic.id)
  nextTick(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 960px)').matches
    ) {
      readerEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

function setKindFilter(kind) {
  kindFilter.value = kind
}

function setStatus(id, status) {
  localState.value = {
    ...localState.value,
    [id]: { status, lastReviewedAt: new Date().toISOString() },
  }
  window.localStorage.setItem(storageKey, JSON.stringify(localState.value))
}

function browseCatalog() {
  mode.value = 'catalog'
  selectedGroup.value = ''
  statusFilter.value = 'all'
}

function startReview() {
  mode.value = 'review'
  selectedGroup.value = selectedGroup.value || manifest.groups[0].id
}

function startGroup(id) {
  mode.value = 'review'
  selectedGroup.value = id
  statusFilter.value = 'all'
}

function resetLocalState() {
  localState.value = {}
  window.localStorage.removeItem(storageKey)
}
</script>

<template>
  <div class="core-catalog">
    <div class="core-catalog__toolbar">
      <label class="core-catalog__search">
        <span class="sr-only">筛选重点</span>
        <input
          v-model="query"
          type="search"
          placeholder="筛选重点、模块或内容类型"
        />
      </label>
      <span class="core-catalog__total">{{ visibleCount }} 项重点</span>
    </div>

    <div class="core-catalog__kinds" aria-label="类型筛选">
      <button
        v-for="option in kindOptions"
        :key="option.id"
        type="button"
        :class="{ active: kindFilter === option.id }"
        @click="setKindFilter(option.id)"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="core-catalog__modes" aria-label="复习模式">
      <button
        :class="{ active: mode === 'catalog' }"
        type="button"
        @click="browseCatalog"
      >
        目录浏览
      </button>
      <button
        :class="{ active: mode === 'review' }"
        type="button"
        @click="startReview"
      >
        复习模式
      </button>
      <template v-if="mode === 'review'">
        <select v-model="selectedGroup" aria-label="选择复习分组">
          <option
            v-for="group in manifest.groups"
            :key="group.id"
            :value="group.id"
          >
            {{ group.title }}
          </option>
        </select>
        <select v-model="statusFilter" aria-label="筛选复习状态">
          <option value="all">全部状态</option>
          <option value="unseen">未复习</option>
          <option value="review">待复习</option>
          <option value="mastered">已掌握</option>
        </select>
        <button
          v-if="hydrated"
          class="core-catalog__reset"
          type="button"
          @click="resetLocalState"
        >
          清空本机记录
        </button>
      </template>
    </div>

    <div class="core-catalog__workspace">
      <div class="core-catalog__list">
        <p v-if="!visibleGroups.length" class="core-catalog__empty">
          没有匹配的重点。
        </p>
        <details
          v-for="group in visibleGroups"
          :key="group.id"
          class="core-group"
          :open="mode === 'review' || normalizedQuery || group.defaultOpen"
        >
          <summary>
            <span>
              <strong>{{ group.title }}</strong>
              <small>{{ group.description }}</small>
            </span>
            <em>{{ group.topics.length }}</em>
            <button
              v-if="mode === 'catalog'"
              class="core-group__start"
              type="button"
              @click.stop="startGroup(group.id)"
            >
              开始本组复习
            </button>
          </summary>
          <ul class="core-group__list">
            <li
              v-for="topic in group.topics"
              :key="topic.id"
              :class="{ active: selectedId === topic.id }"
            >
              <span class="core-topic__title">
                <strong v-if="mode === 'review'">{{ promptFor(topic) }}</strong>
                <button
                  type="button"
                  class="core-topic__open"
                  @click="selectTopic(topic)"
                >
                  {{ topic.title }}
                </button>
              </span>
              <span class="core-topic__module">{{ topic.module }}</span>
              <span class="core-topic__kind">{{ kindLabel(topic.kind) }}</span>
              <template v-if="mode === 'review' && hydrated">
                <span class="core-topic__status">{{
                  statusLabel(topic.id)
                }}</span>
                <span class="core-topic__actions">
                  <button type="button" @click="setStatus(topic.id, 'review')">
                    待复习
                  </button>
                  <button
                    type="button"
                    @click="setStatus(topic.id, 'mastered')"
                  >
                    已掌握
                  </button>
                </span>
              </template>
            </li>
          </ul>
        </details>
      </div>

      <aside ref="readerEl" class="core-reader" aria-live="polite">
        <template v-if="selectedTopic">
          <p v-if="mode === 'review'" class="core-reader__prompt">
            {{ promptFor(selectedTopic) }}
          </p>
          <p class="core-reader__meta">
            <span>{{ selectedTopic.module }}</span>
            <span class="core-topic__kind">{{
              kindLabel(selectedTopic.kind)
            }}</span>
            <span
              v-if="mode === 'review' && hydrated"
              class="core-topic__status"
              >{{ statusLabel(selectedTopic.id) }}</span
            >
          </p>
          <h2 class="core-reader__title">{{ selectedTopic.title }}</h2>
          <div
            v-if="selectedTopic.html"
            class="vp-doc core-reader__body"
            v-html="selectedTopic.html"
          />
          <p v-else class="core-catalog__empty">这一条还没有抽出正文。</p>
          <div class="core-reader__footer">
            <a :href="href(selectedTopic.href)">打开原文</a>
            <span v-if="mode === 'review' && hydrated" class="core-topic__actions">
              <button
                type="button"
                @click="setStatus(selectedTopic.id, 'review')"
              >
                待复习
              </button>
              <button
                type="button"
                @click="setStatus(selectedTopic.id, 'mastered')"
              >
                已掌握
              </button>
            </span>
          </div>
        </template>
        <p v-else class="core-reader__placeholder">
          点左侧一条重点，正文在这里展开。原文只维护一份，需要上下文时再打开原文。
        </p>
      </aside>
    </div>
  </div>
</template>
