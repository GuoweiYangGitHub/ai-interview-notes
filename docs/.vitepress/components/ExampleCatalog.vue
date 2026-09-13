<script setup>
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

const groups = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch(withBase('/code/manifest.json'))
    if (!res.ok) throw new Error('无法读取示例目录')
    const manifest = await res.json()
    groups.value = manifest.groups || []
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
})

function href(id) {
  return withBase(`/E-代码示例/view#${encodeURIComponent(id)}`)
}
</script>

<template>
  <p v-if="error">{{ error }}</p>
  <div v-else class="catalog">
    <section v-for="lang in groups" :key="lang.id">
      <h2>{{ lang.title }}</h2>
      <div v-for="topic in lang.topics || []" :key="topic.id">
        <h3>{{ topic.title }}</h3>
        <ul>
          <li v-for="example in topic.examples" :key="example.id">
            <a :href="href(example.id)">{{ example.title }}</a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
