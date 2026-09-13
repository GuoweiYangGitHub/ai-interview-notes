import { Marked } from 'marked'

export function isMarkdownFile(file, path) {
  if (file?.lang === 'md') return true
  return /\.md$/i.test(path || file?.name || '')
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function resolveRelPath(fromFile, href) {
  const clean = String(href || '')
    .split('#')[0]
    .split('?')[0]
    .trim()
  if (!clean) return ''
  const base = fromFile.includes('/')
    ? fromFile.slice(0, fromFile.lastIndexOf('/') + 1)
    : ''
  const url = new URL(clean, `https://example.local/${base}`)
  return decodeURIComponent(url.pathname.replace(/^\//, ''))
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

export function renderMarkdownPreview(src, { highlightSync, resolveSrc }) {
  const marked = new Marked({
    gfm: true,
    renderer: {
      code({ text, lang }) {
        const info = String(lang || '')
          .trim()
          .split(/\s+/)[0]
        if (info === 'mermaid') {
          return `<div class="md-mermaid" data-code="${encodeURIComponent(text)}"></div>\n`
        }
        return `<div class="md-code"><button type="button" class="md-copy" data-code="${encodeURIComponent(text)}">复制</button>${highlightSync(text, info)}</div>\n`
      },
      image({ href, title, text }) {
        const src = resolveSrc(href || '')
        const extra = title ? ` title="${escapeHtml(title)}"` : ''
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(text || '')}"${extra} />`
      },
      link({ href, title, text, tokens }) {
        const rawHref = href || ''
        const label = tokens ? this.parser.parseInline(tokens) : text
        const extra = title ? ` title="${escapeHtml(title)}"` : ''
        if (/^(https?:|mailto:|#)/i.test(rawHref)) {
          const blank = /^https?:/i.test(rawHref)
            ? ' target="_blank" rel="noreferrer"'
            : ''
          return `<a href="${escapeHtml(rawHref)}"${extra}${blank}>${label}</a>`
        }
        return `<a href="${escapeHtml(rawHref)}" class="md-internal"${extra}>${label}</a>`
      },
    },
  })
  return marked.parse(src)
}
