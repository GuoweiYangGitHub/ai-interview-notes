/**
 * @file Okapi BM25
 * @description 与 rank_bm25 默认 k1=1.5、b=0.75 同一套公式。
 */
export class Bm25Index {
  private readonly docs: string[][]
  private readonly docLen: number[]
  private readonly avgdl: number
  private readonly idf = new Map<string, number>()
  private readonly tf: Map<string, number>[]
  private readonly k1 = 1.5
  private readonly b = 0.75

  constructor(docs: string[][]) {
    this.docs = docs
    this.docLen = docs.map((doc) => doc.length)
    const total = this.docLen.reduce((sum, len) => sum + len, 0)
    this.avgdl = docs.length === 0 ? 0 : total / docs.length
    this.tf = docs.map((doc) => {
      const freq = new Map<string, number>()
      for (const token of doc) {
        freq.set(token, (freq.get(token) ?? 0) + 1)
      }
      return freq
    })
    const df = new Map<string, number>()
    for (const freq of this.tf) {
      for (const token of freq.keys()) {
        df.set(token, (df.get(token) ?? 0) + 1)
      }
    }
    const n = docs.length
    for (const [token, count] of df) {
      this.idf.set(token, Math.log(n - count + 0.5) - Math.log(count + 0.5))
    }
  }

  scores(query: string[]): number[] {
    const n = this.docs.length
    const result = new Array<number>(n).fill(0)
    if (this.avgdl === 0) {
      return result
    }
    for (const term of query) {
      const idf = this.idf.get(term)
      if (idf === undefined) {
        continue
      }
      for (let i = 0; i < n; i++) {
        const freq = this.tf[i].get(term) ?? 0
        const denom =
          freq +
          this.k1 * (1 - this.b + (this.b * this.docLen[i]) / this.avgdl)
        result[i] += idf * ((freq * (this.k1 + 1)) / denom)
      }
    }
    return result
  }
}
