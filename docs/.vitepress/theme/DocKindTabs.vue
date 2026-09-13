<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import {
  isQuizPath,
  matchAbcSection,
  normalizePath,
  pairKey,
  type SidebarItem,
} from '../sidebar-abc'
import DocKindNode from './DocKindNode.vue'

type Kind = 'notes' | 'quiz'

const route = useRoute()
const router = useRouter()
const override = ref<Kind | null>(null)

const section = computed(() => matchAbcSection(route.path))
const inferred = computed<Kind>(() =>
  isQuizPath(route.path) ? 'quiz' : 'notes',
)

watch(
  () => route.path,
  () => {
    override.value = null
  },
)

const kind = computed(() => override.value ?? inferred.value)
const items = computed<SidebarItem[]>(() => {
  if (!section.value) return []
  return kind.value === 'quiz' ? section.value.quiz : section.value.notes
})

function leaves(items: SidebarItem[]): SidebarItem[] {
  return items.flatMap((item) =>
    item.items?.length ? leaves(item.items) : item.link ? [item] : [],
  )
}

function counterpart(next: Kind): string | null {
  if (!section.value) return null
  const currentItems = inferred.value === 'quiz'
    ? section.value.quiz
    : section.value.notes
  const targetItems = next === 'quiz' ? section.value.quiz : section.value.notes
  const current = leaves(currentItems).find(
    (item) => item.link && normalizePath(item.link) === normalizePath(route.path),
  )
  if (!current) return null
  return leaves(targetItems).find((item) => pairKey(item) === pairKey(current))?.link ?? null
}

function select(next: Kind) {
  const target = counterpart(next)
  if (target) {
    router.go(target)
    return
  }
  override.value = next
}
</script>

<template>
  <div v-if="section" class="doc-kind">
    <div class="doc-kind-tabs" role="tablist" aria-label="知识点或技术问答">
      <button
        type="button"
        role="tab"
        class="doc-kind-tab"
        :class="{ active: kind === 'notes' }"
        :aria-selected="kind === 'notes'"
        @click="select('notes')"
      >
        知识点
      </button>
      <button
        type="button"
        role="tab"
        class="doc-kind-tab"
        :class="{ active: kind === 'quiz' }"
        :aria-selected="kind === 'quiz'"
        @click="select('quiz')"
      >
        技术问答
      </button>
    </div>
    <ul class="doc-kind-list">
      <DocKindNode
        v-for="item in items"
        :key="item.link ?? item.text"
        :item="item"
        :depth="0"
      />
    </ul>
  </div>
</template>
