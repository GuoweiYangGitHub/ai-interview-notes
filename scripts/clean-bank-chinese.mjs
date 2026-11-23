import { readFile, writeFile } from 'node:fs/promises'

const file = 'docs/.vitepress/data/interview-bank.mjs'
let text = await readFile(file, 'utf8')

for (const term of [
  '智能体',
  '检索增强生成',
  '工具协议',
  '服务器推送',
  '排名融合',
  '关键词检索',
  '场景回执',
  '普通问答接口',
  '流式问答接口',
]) {
  text = text
    .replace(new RegExp(`[ \\t]+${term}`, 'g'), term)
    .replace(new RegExp(`${term}[ \\t]+`, 'g'), term)
}

const exact = [
  [
    '普通问答接口是普通问答接口，一次返回完整回答；流式问答接口是流式接口，边生成边返回，前端可以逐字显示。',
    '普通问答接口问一次，返回完整回答；流式问答接口边生成边返回，前端可以逐字显示。',
  ],
  ['不是一个大 Prompt', '不是一个大提示词'],
  ['YAML Prompt', 'YAML 提示词'],
  [
    '索引按文件 hash 增量构建，manifest 校验后切 active 指针；docs 改动可热更新',
    '索引按文件内容指纹增量构建，索引清单校验后切激活指针；文档改动可热更新',
  ],
  ['manifest / active 指针', '索引清单 / 激活指针'],
  ['manifest 校验后切 active 指针', '索引清单校验后切激活指针'],
  ['classify、route、计划编译', '分类、规划、计划编译'],
  ['工具协议工具的调用方', '工具协议里工具的调用方'],
  ['智能体编排、检索增强生成检索与评测', '智能体编排、检索与评测'],
  ['用排名融合融合', '用排名融合把两路结果合并'],
  ['关键词检索补精确符号，排名融合按排名融合', '关键词检索补精确符号，排名融合按名次合并'],
  [
    '为什么不用固定长度切块？向量和关键词检索各解决什么？排名融合为什么比加权求和稳？',
    '为什么不用固定长度切块？向量和关键词检索各解决什么？排名融合为什么比加权求和稳？',
  ],
]

for (const [from, to] of exact) {
  text = text.split(from).join(to)
}

// 删除已经不需要的“人话解释”段。
text = text.replace(/<p><strong>人话解释<\/strong>.*?<\/p>\s*/gs, '')

// 标题顺手改顺。
text = text.split("'THINGJS 文档检索增强生成 3 分钟'").join("'THINGJS 文档问答系统 3 分钟'")
text = text.split("'工具协议工具目录怎么用？参数怎么校验？'").join("'工具目录怎么用？参数怎么校验？'")
text = text.split("'检索增强生成与检索质量'").join("'检索与回答质量'")

await writeFile(file, text, 'utf8')
console.log('cleaned bank chinese')
