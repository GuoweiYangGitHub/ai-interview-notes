import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const projects = {
  thingjs: {
    file: 'docs/03-项目实战/01-THINGJS文档RAG/面试问题.md',
    link: '/03-项目实战/01-THINGJS文档RAG/面试问题',
  },
  jiangzhong: {
    file: 'docs/03-项目实战/02-江中智能助手/面试问题.md',
    link: '/03-项目实战/02-江中智能助手/面试问题',
  },
  compare: {
    file: 'docs/03-项目实战/跨项目对比与压力问题.md',
    link: '/03-项目实战/跨项目对比与压力问题',
    flat: true,
    title: '跨项目对比与压力问题',
  },
  chinaMobile: {
    file: 'docs/03-项目实战/04-中国移动网络拓扑.md',
    link: '/03-项目实战/04-中国移动网络拓扑',
    flat: true,
    title: '中国移动网络拓扑',
    section: '高频追问',
  },
}

const sectionTextOverrides = {
  '项目专属：索引发布、评测门禁与运行边界': '索引发布与运行边界',
  '项目专属：审批、回执、并发与交付判定': '审批、回执与交付判定',
  '项目追问：指代、注入与真实请求': '指代、注入与真实请求',
}

function parseProject({ file, link, flat = false, title, section: questionSection }) {
  const markdown = fs.readFileSync(path.join(root, file), 'utf8')
  const groups = flat
    ? [{ text: title, collapsed: false, items: [] }]
    : []
  let current = flat ? groups[0] : null
  let collecting = flat ? !questionSection : true

  for (const line of markdown.split(/\r?\n/)) {
    if (flat) {
      const section = line.match(/^##\s+(.+?)\s*$/)
      if (section) {
        if (questionSection) {
          collecting = section[1].includes(questionSection)
        }
        continue
      }
    } else {
      const section = line.match(/^##\s+(.+?)\s*$/)
      if (section) {
        const rawTitle = section[1].replace(/^[一二三四五六七八九十]+、/, '')
        current = {
          text: sectionTextOverrides[rawTitle] ?? rawTitle,
          collapsed: true,
          hashAware: true,
          items: [],
        }
        groups.push(current)
        continue
      }
    }

    if (!collecting || !current) continue
    const anchored = line.match(/^###\s+(.+?)\s*\{#(q\d+)\}\s*$/)
    const plain = anchored ? null : line.match(/^###\s+(.+?)\s*$/)
    const question = anchored ?? plain
    if (!question) continue

    const rawTitle = question[1].trim()
    const numbered = rawTitle.match(/^(Q\d+)\s+(.+)$/)
    if (!flat && !numbered) continue

    const number = numbered
      ? numbered[1]
      : `Q${String(current.items.length + 1).padStart(2, '0')}`
    const title = (numbered ? numbered[2] : rawTitle)
      .replace(/（\[题库 [A-Z]+-\d+\]\([^)]*\)）\s*$/, '')
      .trim()
    const label = `${number} ${title}`
    current.items.push({
      text: label.length > 34 ? `${label.slice(0, 34)}…` : label,
      link: `${link}#${anchored ? anchored[2] : number.toLowerCase()}`,
    })
  }

  return groups.filter((group) => group.items.length > 0)
}

const nav = {
  thingjs: parseProject(projects.thingjs),
  jiangzhong: parseProject(projects.jiangzhong),
  compare: parseProject(projects.compare),
  chinaMobile: parseProject(projects.chinaMobile),
}

const out = `// 由 scripts/generate-project-qa-nav.mjs 生成，请勿手改。\nexport const projectQaNav = ${JSON.stringify(nav, null, 2)}\n`
const outFile = path.join(root, 'docs/.vitepress/data/project-qa-nav.mjs')
fs.writeFileSync(outFile, out)
console.log(
  `generated ${outFile}: thingjs ${nav.thingjs.length}, jiangzhong ${nav.jiangzhong.length}, compare ${nav.compare.length}, chinaMobile ${nav.chinaMobile.length}`,
)
