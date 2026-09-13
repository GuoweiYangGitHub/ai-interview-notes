import type MarkdownIt from 'markdown-it'

export function keyBadgePlugin(md: MarkdownIt) {
  const defaultRender =
    md.renderer.rules.text ||
    ((tokens, idx) => md.utils.escapeHtml(tokens[idx].content))

  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const content = tokens[idx].content
    if (!content.includes('[重点]')) {
      return defaultRender(tokens, idx, options, env, self)
    }
    return content
      .split('[重点]')
      .map((part) => md.utils.escapeHtml(part))
      .join('<span class="key-badge">重点</span>')
  }
}
