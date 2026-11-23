import { readFile, writeFile } from 'node:fs/promises'

const thingjsTalk = 'docs/03-项目实战/01-THINGJS文档RAG/10-面试讲法.md'
const thingjsQA = 'docs/03-项目实战/01-THINGJS文档RAG/12-项目问答.md'
const jiangzhongNumbers = 'docs/03-项目实战/02-江中智能助手/10-数字速查与讲法.md'

const deepNames =
  '02-索引构建与热更新|03-检索链路|04-生成与会话记忆|05-API契约与鉴权|06-前端与SSE|07-评测平台与质量门禁|08-运维观测与问题闭环'

let text = await readFile(thingjsTalk, 'utf8')
text = text.replace(
  new RegExp(
    `\\[(${deepNames})\\]\\(/03-项目实战/01-THINGJS文档RAG/12-项目问答\\)`,
    'g',
  ),
  '[项目问答](/03-项目实战/01-THINGJS文档RAG/12-项目问答)',
)
await writeFile(thingjsTalk, text, 'utf8')

text = await readFile(thingjsQA, 'utf8')
for (const [from, to] of [
  ['索引细节见 02-索引构建与热更新，检索细节见 03-检索链路。', '索引与检索细节见本题要点。'],
  ['项目事实见 01-项目全景与架构。', '项目事实见本题要点。'],
  ['详见 02-索引构建与热更新。', '详见本题要点。'],
  ['详细链路见 03-检索链路', '详细链路见本题要点'],
  ['完整检索机制见 03-检索链路', '完整检索机制见本题要点'],
  ['完整引用机制见 04-生成与会话记忆', '完整引用机制见本题要点'],
  ['见 04-生成与会话记忆 的「降级」', '见本题「降级」要点'],
  ['完整夹具见 07-评测平台与质量门禁。', '完整夹具见本题要点。'],
  ['详见 07-评测平台与质量门禁。', '详见本题要点。'],
  ['完整发布流程见 02-索引构建与热更新。', '完整发布流程见本题要点。'],
  ['排查路径见 08-运维观测与问题闭环', '排查路径见本题要点'],
  ['备份/恢复命令与校验见 08-运维观测与问题闭环。', '备份/恢复命令与校验见本题要点。'],
]) {
  text = text.split(from).join(to)
}
await writeFile(thingjsQA, text, 'utf8')

text = await readFile(jiangzhongNumbers, 'utf8')
text = text.replace(
  '[/03-项目实战/02-江中智能助手/07-评测与质量闭环](/03-项目实战/02-江中智能助手/11-面试问答)',
  '[评测与质量闭环](/03-项目实战/02-江中智能助手/11-面试问答)',
)
await writeFile(jiangzhongNumbers, text, 'utf8')

console.log('cleaned project references')
