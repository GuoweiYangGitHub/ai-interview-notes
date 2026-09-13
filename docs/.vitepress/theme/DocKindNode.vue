<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'DocKindNode' })
import { useRoute, withBase } from 'vitepress'
import { itemContains, normalizePath, type SidebarItem } from '../sidebar-abc'

const props = defineProps<{
  item: SidebarItem
  depth: number
}>()

const route = useRoute()
const hasChildren = computed(() => (props.item.items?.length ?? 0) > 0)
const containsActive = computed(() => itemContains(props.item, route.path))
const open = ref(containsActive.value)

watch(
  () => route.path,
  () => {
    if (containsActive.value) {
      open.value = true
    }
  },
)

function isActive(link: string) {
  if (normalizePath(route.path) !== normalizePath(link)) return false
  const linkHash = link.includes('#')
    ? decodeURIComponent(link.slice(link.indexOf('#')))
    : ''
  const routeHash = decodeURIComponent(route.hash || '')
  if (linkHash) return routeHash === linkHash
  return !routeHash
}

function toggle() {
  open.value = !open.value
}
</script>

<template>
  <li :class="`doc-kind-node depth-${depth}`">
    <a
      v-if="item.link && !hasChildren"
      class="doc-kind-link"
      :class="{ active: isActive(item.link) }"
      :href="withBase(item.link)"
    >
      {{ item.text }}
    </a>
    <button
      v-else
      type="button"
      class="doc-kind-group"
      :class="{ open, active: containsActive }"
      :aria-expanded="open"
      @click="toggle"
    >
      <span>{{ item.text }}</span>
      <span class="doc-kind-caret" aria-hidden="true" />
    </button>
    <ul v-if="hasChildren && open" class="doc-kind-list">
      <DocKindNode
        v-for="child in item.items"
        :key="child.link ?? child.text"
        :item="child"
        :depth="depth + 1"
      />
    </ul>
  </li>
</template>
