<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  code: string
}>()

const { isDark } = useData()
const svg = ref('')
const error = ref('')
const loaded = ref(false)

let seq = 0

async function render() {
  error.value = ''
  try {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: isDark.value ? 'dark' : 'default',
    })
    const source = decodeURIComponent(props.code)
    seq += 1
    const id = `mermaid-${seq}-${Math.random().toString(36).slice(2, 9)}`
    const { svg: out } = await mermaid.render(id, source)
    svg.value = out
    loaded.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    svg.value = ''
    loaded.value = true
  }
}

onMounted(render)
watch(isDark, render)
</script>

<template>
  <div v-if="error" class="mermaid-error">
    <p>Mermaid 渲染失败</p>
    <pre>{{ error }}</pre>
  </div>
  <div
    v-else
    class="mermaid-diagram"
    :class="{ 'is-ready': loaded }"
    v-html="svg"
  />
</template>

<style scoped>
.mermaid-diagram {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  overflow-x: auto;
  min-height: 4rem;
}

.mermaid-diagram:not(.is-ready) {
  opacity: 0;
}

.mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}

.mermaid-error {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-danger-1);
  border-radius: 6px;
  color: var(--vp-c-danger-1);
  overflow-x: auto;
}

.mermaid-error p {
  margin: 0 0 0.5rem;
}

.mermaid-error pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
