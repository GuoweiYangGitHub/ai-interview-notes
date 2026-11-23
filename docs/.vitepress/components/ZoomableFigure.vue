<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  caption?: string
  original?: string
}>()

const scale = ref(1)
const minScale = 0.5
const maxScale = 4
const viewport = ref<HTMLElement | null>(null)
const dragging = ref(false)

const start = { x: 0, y: 0, left: 0, top: 0 }

const width = computed(() => `${Math.round(scale.value * 100)}%`)

function applyScale(next: number) {
  const el = viewport.value
  if (!el) {
    scale.value = next
    return
  }
  const centerX = el.scrollLeft + el.clientWidth / 2
  const centerY = el.scrollTop + el.clientHeight / 2
  const ratio = next / scale.value
  scale.value = next
  nextTick(() => {
    el.scrollLeft = centerX * ratio - el.clientWidth / 2
    el.scrollTop = centerY * ratio - el.clientHeight / 2
  })
}

function zoomIn() {
  applyScale(Math.min(maxScale, Number((scale.value + 0.25).toFixed(2))))
}

function zoomOut() {
  applyScale(Math.max(minScale, Number((scale.value - 0.25).toFixed(2))))
}

function reset() {
  scale.value = 1
  const el = viewport.value
  if (el) {
    el.scrollLeft = 0
    el.scrollTop = 0
  }
}

function onPointerDown(event: PointerEvent) {
  const el = viewport.value
  if (!el) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  dragging.value = true
  start.x = event.clientX
  start.y = event.clientY
  start.left = el.scrollLeft
  start.top = el.scrollTop
  try {
    el.setPointerCapture(event.pointerId)
  } catch {
    // 某些浏览器在指针已释放时会抛错，忽略即可。
  }
  event.preventDefault()
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  const el = viewport.value
  if (!el) return
  el.scrollLeft = start.left - (event.clientX - start.x)
  el.scrollTop = start.top - (event.clientY - start.y)
  event.preventDefault()
}

function endDrag(event: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  const el = viewport.value
  if (el?.hasPointerCapture?.(event.pointerId)) {
    el.releasePointerCapture(event.pointerId)
  }
}
</script>

<template>
  <figure class="zoomable-figure">
    <div class="zoomable-figure__toolbar">
      <button type="button" aria-label="缩小" @click="zoomOut">−</button>
      <span class="zoomable-figure__scale">{{ Math.round(scale * 100) }}%</span>
      <button type="button" aria-label="放大" @click="zoomIn">＋</button>
      <button type="button" @click="reset">重置</button>
      <span class="zoomable-figure__hint">拖拽查看</span>
      <a :href="original || src" target="_blank" rel="noreferrer"
        >打开原图 <span aria-hidden="true">↗</span></a
      >
    </div>
    <div
      ref="viewport"
      class="zoomable-figure__viewport"
      :class="{ 'is-dragging': dragging }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @pointerleave="endDrag"
    >
      <img
        :src="src"
        :alt="alt"
        :style="{ width }"
        loading="lazy"
        draggable="false"
      />
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>
