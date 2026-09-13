import type MarkdownIt from 'markdown-it'

export function mermaidPlugin(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const lang = tokens[idx].info.trim().split(/\s+/)[0]

    if (lang === 'mermaid') {
      const code = encodeURIComponent(tokens[idx].content.trim())
      return `<ClientOnly><MermaidDiagram code="${code}" /></ClientOnly>\n`
    }

    return fence(...args)
  }
}
