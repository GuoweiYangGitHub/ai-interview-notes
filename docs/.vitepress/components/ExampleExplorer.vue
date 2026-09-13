<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import { createHighlighter } from 'shiki'
import ExampleTreeNodes from './ExampleTreeNodes.vue'
import {
  copyText,
  isMarkdownFile,
  renderMarkdownPreview,
  resolveRelPath,
} from './markdownPreview.js'

const props = defineProps({
  path: { type: String, default: '' },
})

const { isDark, frontmatter } = useData()
const router = useRouter()
const showPageFull = computed(
  () => frontmatter.value.pageClass === 'example-view',
)

const manifest = ref(null)
const exampleId = ref('')
const activePath = ref('')
const raw = ref('')
const html = ref('')
const previewHtml = ref('')
const loading = ref(true)
const error = ref('')
const openDirs = ref(new Set())
const viewMode = ref('source')
const copied = ref(false)
const pageFull = ref(false)
const canTeleport = ref(false)
const previewEl = ref(null)

let copiedTimer = 0
let mermaidSeq = 0

let highlighter = null

const SHIKI_LANG = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  python: 'python',
  md: 'markdown',
  json: 'json',
  yaml: 'yaml',
  html: 'html',
  css: 'css',
  vue: 'vue',
  bash: 'bash',
  sql: 'sql',
  toml: 'toml',
  text: 'plaintext',
}

function readExampleId() {
  if (props.path) return props.path
  if (typeof window === 'undefined') return ''
  const query = new URLSearchParams(window.location.search).get('p')
  if (query) return query
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
  if (hash.startsWith('p=')) return hash.slice(2)
  return hash
}

function slugifyExampleId(id) {
  return id.replace(/[/.]/g, '-')
}

function idsMatch(itemId, queryId) {
  if (!itemId || !queryId) return false
  if (itemId === queryId) return true
  const itemSlug = slugifyExampleId(itemId)
  const querySlug = slugifyExampleId(queryId)
  return itemSlug === queryId || itemSlug === querySlug
}

function findExample(data, id) {
  if (!data?.groups || !id) return null
  for (const lang of data.groups) {
    for (const topic of lang.topics || []) {
      const found = (topic.examples || []).find((item) => idsMatch(item.id, id))
      if (found) {
        return { ...found, groupTitle: `${lang.title} · ${topic.title}` }
      }
    }
    const flat = (lang.examples || []).find((item) => idsMatch(item.id, id))
    if (flat) return { ...flat, groupTitle: lang.title }
  }
  return null
}

function firstExampleId(data) {
  for (const lang of data?.groups || []) {
    for (const topic of lang.topics || []) {
      if (topic.examples?.[0]) return topic.examples[0].id
    }
    if (lang.examples?.[0]) return lang.examples[0].id
  }
  return ''
}

const example = computed(() => findExample(manifest.value, exampleId.value))

const groupTitle = computed(() => example.value?.groupTitle || '')

function fileUrl(rel) {
  const prefix = example.value?.path || ''
  const full = rel ? `${prefix}/${rel}` : prefix
  return withBase(`/code/${full.split('/').map(encodeURIComponent).join('/')}`)
}

function firstFile(nodes) {
  for (const node of nodes || []) {
    if (node.type === 'file' && node.name.toLowerCase() === 'readme.md')
      return node
  }
  for (const prefer of ['index.ts', 'main.py', 'index.js']) {
    const found = (nodes || []).find(
      (n) => n.type === 'file' && n.name === prefer,
    )
    if (found) return found
  }
  for (const node of nodes || []) {
    if (node.type === 'file') return node
    if (node.type === 'dir') {
      const child = firstFile(node.children)
      if (child) return child
    }
  }
  return null
}

function collectDirPaths(nodes, prefix = '') {
  const dirs = []
  for (const node of nodes || []) {
    if (node.type !== 'dir') continue
    const current = prefix ? `${prefix}/${node.name}` : node.name
    dirs.push(current)
    dirs.push(...collectDirPaths(node.children, current))
  }
  return dirs
}

async function ensureHighlighter() {
  if (highlighter) return highlighter
  highlighter = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: [
      'typescript',
      'tsx',
      'javascript',
      'python',
      'markdown',
      'json',
      'yaml',
      'html',
      'css',
      'vue',
      'bash',
      'sql',
      'toml',
      'plaintext',
    ],
  })
  return highlighter
}

function findFile(nodes, rel) {
  for (const node of nodes || []) {
    if (node.type === 'file' && node.path === rel) return node
    if (node.type === 'dir') {
      const found = findFile(node.children, rel)
      if (found) return found
    }
  }
  return null
}

const activeFile = computed(() => {
  if (!example.value) return null
  return findFile(example.value.tree, activePath.value)
})

const isMarkdown = computed(() =>
  isMarkdownFile(activeFile.value, activePath.value),
)

const lineCount = computed(() =>
  raw.value ? raw.value.replace(/\n$/, '').split('\n').length : 0,
)

function highlightSync(hl, code, lang) {
  const mapped = SHIKI_LANG[lang] || lang || 'plaintext'
  return hl.codeToHtml(code, {
    lang: hl.getLoadedLanguages().includes(mapped) ? mapped : 'plaintext',
    theme: isDark.value ? 'github-dark' : 'github-light',
  })
}

function resolveSrc(href) {
  if (!href || /^(https?:|data:|mailto:|#)/i.test(href)) return href
  return fileUrl(resolveRelPath(activePath.value, href))
}

async function updatePreview(hl) {
  if (!isMarkdown.value || !raw.value) {
    previewHtml.value = ''
    return
  }
  previewHtml.value = await renderMarkdownPreview(raw.value, {
    highlightSync: (code, lang) => highlightSync(hl, code, lang),
    resolveSrc,
  })
}

async function loadFile(rel) {
  if (!example.value || !rel) return
  activePath.value = rel
  viewMode.value = isMarkdownFile(findFile(example.value.tree, rel), rel)
    ? 'preview'
    : 'source'
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(fileUrl(rel))
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    raw.value = await res.text()
    const hl = await ensureHighlighter()
    const lang = SHIKI_LANG[activeFile.value?.lang] || 'plaintext'
    html.value = highlightSync(hl, raw.value, lang)
    await updatePreview(hl)
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    raw.value = ''
    html.value = ''
    previewHtml.value = ''
  } finally {
    loading.value = false
  }
}

function openExample(id) {
  exampleId.value = id
  const current = example.value
  if (!current) {
    error.value = `找不到示例：${id}`
    loading.value = false
    return
  }
  openDirs.value = new Set(collectDirPaths(current.tree))
  const file = firstFile(current.tree)
  if (file) loadFile(file.path)
  else {
    raw.value = ''
    html.value = ''
    previewHtml.value = ''
    loading.value = false
    error.value = current.skipped?.length
      ? '这个示例没有可展示的文本文件。'
      : '这个示例是空的。'
  }
}

async function boot() {
  loading.value = true
  try {
    const res = await fetch(withBase('/code/manifest.json'))
    if (!res.ok) throw new Error('无法读取示例目录')
    manifest.value = await res.json()
    openExample(readExampleId() || firstExampleId(manifest.value))
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    loading.value = false
  }
}

function onHash() {
  const next = readExampleId()
  if (next && next !== exampleId.value) openExample(next)
}

function exampleLinkMatches(href, id) {
  if (!href || !id) return false
  let url
  try {
    url = new URL(href, window.location.origin)
  } catch {
    return false
  }
  const query = url.searchParams.get('p')
  if (query === id) return true
  try {
    if (query && decodeURIComponent(query) === id) return true
  } catch {
    /* ignore */
  }
  let hash = url.hash.replace(/^#/, '')
  try {
    hash = decodeURIComponent(hash)
  } catch {
    /* keep raw */
  }
  if (hash.startsWith('p=')) hash = hash.slice(2)
  return hash === id || slugifyExampleId(hash) === slugifyExampleId(id)
}

function syncSidebarActive() {
  if (typeof document === 'undefined') return
  if (frontmatter.value.pageClass !== 'example-view') return
  const id = exampleId.value
  const items = document.querySelectorAll('.VPSidebar .VPSidebarItem')
  items.forEach((el) => {
    el.classList.remove('is-current-example', 'has-current-example')
  })
  items.forEach((el) => {
    const link = el.querySelector(':scope > .item > .link')
    if (!link || !exampleLinkMatches(link.getAttribute('href') || '', id))
      return
    el.classList.add('is-current-example')
    let parent = el.parentElement
    while (parent) {
      const item = parent.closest('.VPSidebarItem')
      if (!item) break
      item.classList.add('has-current-example')
      parent = item.parentElement
    }
  })
}

function setPageFull(on) {
  pageFull.value = on
  document.documentElement.classList.toggle('example-content-full', on)
  document.body.style.overflow = on ? 'hidden' : ''
}

function togglePageFull() {
  setPageFull(!pageFull.value)
}

function onKeydown(event) {
  if (event.key === 'Escape' && pageFull.value) setPageFull(false)
}

async function copyRaw() {
  if (!raw.value) return
  await copyText(raw.value)
  copied.value = true
  window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => {
    copied.value = false
  }, 1500)
}

function onPreviewClick(event) {
  const copyBtn = event.target.closest('.md-copy')
  if (copyBtn) {
    event.preventDefault()
    copyText(decodeURIComponent(copyBtn.getAttribute('data-code') || '')).then(
      () => {
        copyBtn.textContent = '已复制'
        window.setTimeout(() => {
          copyBtn.textContent = '复制'
        }, 1500)
      },
    )
    return
  }
  const link = event.target.closest('a.md-internal')
  if (!link || !example.value) return
  const href = link.getAttribute('href') || ''
  const rel = resolveRelPath(activePath.value, href)
  const readme = `${rel.replace(/\/$/, '')}/README.md`
  const target = findFile(example.value.tree, rel)
    ? rel
    : findFile(example.value.tree, readme)
      ? readme
      : ''
  if (!target) return
  event.preventDefault()
  loadFile(target)
}

async function hydrateMermaid() {
  const root = previewEl.value
  if (!root || viewMode.value !== 'preview') return
  const nodes = [
    ...root.querySelectorAll('.md-mermaid:not(.is-ready):not(.is-error)'),
  ]
  if (!nodes.length) return
  const mermaid = (await import('mermaid')).default
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: isDark.value ? 'dark' : 'default',
  })
  for (const el of nodes) {
    const code = decodeURIComponent(el.getAttribute('data-code') || '')
    mermaidSeq += 1
    try {
      const id = `md-mermaid-${mermaidSeq}-${Math.random().toString(36).slice(2, 9)}`
      const { svg } = await mermaid.render(id, code)
      el.innerHTML = svg
      el.classList.add('is-ready')
    } catch {
      el.classList.add('is-error')
      el.innerHTML = `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`
    }
  }
}

onMounted(() => {
  boot()
  canTeleport.value = !!document.querySelector('#VPContent')
  window.addEventListener('hashchange', onHash)
  window.addEventListener('popstate', onHash)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHash)
  window.removeEventListener('popstate', onHash)
  window.removeEventListener('keydown', onKeydown)
  window.clearTimeout(copiedTimer)
  setPageFull(false)
})

watch(
  () => [router.route.path, router.route.query, router.route.hash],
  () => {
    if (typeof window !== 'undefined') onHash()
  },
)

watch(isDark, () => {
  if (activePath.value) loadFile(activePath.value)
})

watch([previewHtml, viewMode], async () => {
  if (viewMode.value !== 'preview') return
  await nextTick()
  await hydrateMermaid()
})

watch(exampleId, async () => {
  await nextTick()
  syncSidebarActive()
})

function toggleDir(key) {
  const next = new Set(openDirs.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  openDirs.value = next
}
</script>

<template>
  <Teleport v-if="canTeleport && showPageFull" to="#VPContent">
    <button
      type="button"
      class="example-full-btn"
      :aria-pressed="pageFull"
      @click="togglePageFull"
    >
      {{ pageFull ? '退出全屏' : '全屏' }}
    </button>
  </Teleport>
  <div class="example-explorer">
    <aside class="tree-pane">
      <div class="tree-head">
        <div class="kicker">{{ groupTitle }}</div>
        <div class="title">{{ example?.title || '代码示例' }}</div>
      </div>
      <nav v-if="example" class="tree">
        <ExampleTreeNodes
          :nodes="example.tree"
          :active="activePath"
          :open-dirs="openDirs"
          @open-file="loadFile"
          @toggle="toggleDir"
        />
        <p v-if="example.skipped?.length" class="skipped">
          未收录 {{ example.skipped.length }} 个二进制文件
        </p>
      </nav>
    </aside>
    <section class="code-pane">
      <header class="code-head">
        <span class="file-name">{{ activePath || '未选择文件' }}</span>
        <div class="code-actions">
          <div v-if="isMarkdown" class="mode-switch">
            <button
              type="button"
              :class="{ active: viewMode === 'preview' }"
              @click="viewMode = 'preview'"
            >
              预览
            </button>
            <button
              type="button"
              :class="{ active: viewMode === 'source' }"
              @click="viewMode = 'source'"
            >
              源码
            </button>
          </div>
          <button
            type="button"
            class="action-btn"
            :disabled="!raw"
            @click="copyRaw"
          >
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
      </header>
      <div v-if="error" class="status">{{ error }}</div>
      <div v-else-if="loading && !html && !previewHtml" class="status">
        加载中…
      </div>
      <div
        v-else-if="isMarkdown && viewMode === 'preview'"
        class="preview-body"
      >
        <div
          ref="previewEl"
          class="md-preview vp-doc"
          v-html="previewHtml"
          @click="onPreviewClick"
        />
      </div>
      <div v-else class="code-body">
        <div class="gutter" aria-hidden="true">
          <span v-for="n in lineCount" :key="n">{{ n }}</span>
        </div>
        <div class="code" v-html="html" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.example-explorer {
  display: flex;
  min-height: calc(100vh - var(--vp-nav-height) - 48px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.tree-pane {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: auto;
}

.tree-head {
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.kicker {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.title {
  font-weight: 600;
  line-height: 1.4;
}

.tree {
  padding: 8px 6px 16px;
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

.dir .tree,
.dir .dir {
  padding-left: 12px;
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

.skipped {
  margin: 12px 10px 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.code-pane {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
}

.code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.file-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--vp-font-family-mono);
}

.code-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.mode-switch {
  display: flex;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.mode-switch button,
.action-btn {
  padding: 4px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.mode-switch button {
  border: 0;
  border-radius: 0;
}

.mode-switch button.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.action-btn:disabled {
  cursor: default;
  opacity: 0.5;
}

.preview-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.md-preview {
  padding: 16px 20px 32px;
}

.md-preview :deep(.md-code) {
  position: relative;
  margin: 16px 0;
}

.md-preview :deep(.md-copy) {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.md-preview :deep(.md-mermaid) {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  overflow-x: auto;
}

.md-preview :deep(.md-mermaid.is-error pre) {
  width: 100%;
  white-space: pre-wrap;
}

.md-preview :deep(.md-mermaid svg) {
  max-width: 100%;
  height: auto;
}

.status {
  padding: 24px;
  color: var(--vp-c-text-2);
}

.code-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.gutter {
  flex-shrink: 0;
  padding: 16px 8px 16px 12px;
  text-align: right;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-3);
  user-select: none;
  border-right: 1px solid var(--vp-c-divider);
}

.gutter span {
  display: block;
}

.code {
  flex: 1;
  min-width: 0;
}

.code :deep(pre) {
  margin: 0;
  padding: 16px 16px 32px;
  background: transparent !important;
  overflow: visible;
  font-size: 13px;
  line-height: 1.7;
}

.code :deep(code) {
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .example-explorer {
    flex-direction: column;
    min-height: auto;
  }

  .tree-pane {
    width: 100%;
    max-height: 240px;
  }

  .code-head {
    flex-wrap: wrap;
    align-items: flex-start;
  }
}
</style>
