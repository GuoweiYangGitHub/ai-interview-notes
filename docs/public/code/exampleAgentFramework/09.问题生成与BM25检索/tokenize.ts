/**
 * @file 中文检索分词
 * @description 拉丁词整词；汉字用相邻二字 bigram。不依赖 jieba。
 */
const STOP = new Set([
  '的',
  '了',
  '在',
  '是',
  '我',
  '有',
  '和',
  '就',
  '不',
  '人',
  '都',
  '一',
  '一个',
  '上',
  '也',
  '很',
  '到',
  '说',
  '要',
  '去',
  '你',
  '会',
  '着',
  '没有',
  '看',
  '好',
  '自己',
  '这',
])

export function tokenize(text: string): string[] {
  if (!text.trim()) {
    return []
  }
  const tokens: string[] = []
  for (const match of text.matchAll(/[A-Za-z0-9]+/g)) {
    const word = match[0].toLowerCase()
    if (word.length > 1 && !STOP.has(word)) {
      tokens.push(word)
    }
  }
  const chars = [...text].filter((ch) => /[\u4e00-\u9fff]/.test(ch))
  for (let i = 0; i < chars.length - 1; i++) {
    const gram = chars[i] + chars[i + 1]
    if (!STOP.has(chars[i]) && !STOP.has(chars[i + 1])) {
      tokens.push(gram)
    }
  }
  return tokens
}
