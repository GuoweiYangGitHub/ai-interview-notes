<script setup>
defineOptions({ name: 'ExampleTreeNodes' })

defineProps({
  nodes: { type: Array, default: () => [] },
  active: { type: String, default: '' },
  openDirs: { type: Object, required: true },
  prefix: { type: String, default: '' },
})

const emit = defineEmits(['open-file', 'toggle'])

function dirKey(name, prefix) {
  return prefix ? `${prefix}/${name}` : name
}
</script>

<template>
  <template
    v-for="node in nodes"
    :key="node.type === 'dir' ? dirKey(node.name, prefix) : node.path"
  >
    <div v-if="node.type === 'dir'" class="dir">
      <button
        class="row dir-row"
        type="button"
        @click="emit('toggle', dirKey(node.name, prefix))"
      >
        <span class="icon">{{
          openDirs.has(dirKey(node.name, prefix)) ? '▾' : '▸'
        }}</span>
        <span>{{ node.name }}</span>
      </button>
      <ExampleTreeNodes
        v-if="openDirs.has(dirKey(node.name, prefix))"
        :nodes="node.children"
        :active="active"
        :open-dirs="openDirs"
        :prefix="dirKey(node.name, prefix)"
        @open-file="emit('open-file', $event)"
        @toggle="emit('toggle', $event)"
      />
    </div>
    <button
      v-else
      class="row file-row"
      :class="{ active: active === node.path }"
      type="button"
      @click="emit('open-file', node.path)"
    >
      <span class="icon">·</span>
      <span>{{ node.name }}</span>
    </button>
  </template>
</template>

<style scoped>
.dir {
  padding-left: 0;
}

.dir .dir,
.dir :deep(.dir) {
  padding-left: 12px;
}

.row {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 13px;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
}

.file-row.active,
.row:hover {
  background: var(--vp-c-bg-elv);
}

.icon {
  width: 14px;
  flex-shrink: 0;
  color: var(--vp-c-text-2);
}
</style>
