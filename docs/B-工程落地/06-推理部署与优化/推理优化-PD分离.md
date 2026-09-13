# 推理优化 · PD 分离

只在 Prefill 与 Decode 互相干扰时再考虑。原理和交棒难点看[全量笔记](./推理优化-全量笔记#重点-为什么需要pd分离)。

## 0. 总图

Prefill 和 Decode 对 GPU 的胃口相反：

| | Prefill | Decode |
| --- | --- | --- |
| 干什么 | 整段 prompt → 写出 KV | 逐步吐字，KV 追加 |
| 瓶颈 | 算力（Compute-Bound） | HBM / 读 KV（Memory-Bound） |
| 指标 | TTFT | TPOT |
| 一张卡上的副作用 | 长 prompt 独占 GPU，别人停吐字 | 小 batch 算力闲着；大 batch TPOT 变差 |

混合执行：两段在同一张卡上交替跑。短跑和马拉松在同一条跑道，谁都跑不好。

- 跑 Prefill 时，正在流式输出的 Decode 被堵住 → **TPOT 飙升**。
- 跑 Decode 时，计算单元大量空闲 → **浪费 Prefill 最需要的算力**，新请求 TTFT 也上不去。

PD 分离把请求拆到两种实例：P 只做预填充，D 只做逐字生成，中间传 KV。

## 先查什么

还没拆池之前，先确认是「互抢」而不是别的：

1. 长 prompt 进来，正在吐字的请求 TPOT 立刻毛刺 → 互抢。
2. 先开 Chunked Prefill（长 prompt 切块，和 Decode 交错）。同一条跑道分时让道，毛刺会小，但还在一张卡上。
3. KV 已经在 swap → 先减并发、量化或加卡，拆池救不了换页。
4. 小流量、短 prompt → 混跑 + chunked 通常够，不要默认上 PD。

## 何时拆、何时不拆

**值得拆**

- 长 prompt + 高并发，TTFT 和 TPOT 都要稳。
- Chunked Prefill 之后，Prefill 仍明显堵住 Decode。
- 有高速互联（NVLink / RDMA）能把 KV 从 P 交到 D。走普通 TCP 会把分离省下的 TTFT 吃光。

**先别拆**

- 小流量、短请求。
- 还没做分页、持续批、chunked-prefill、prefix cache。
- 没有规划 P/D 比例和 KV 传输。拆开不是「多买几张卡」，是算力型 GPU 和带宽型 GPU 各干各的。

P/D 数量按流量：prompt 很长就多 P，生成很长就多 D。P 盯 TTFT，请求侧 batch 通常不大；D 盯 TPOT，可以用大 batch 把带宽吃满。

## 和另外几层怎么叠

PD 是最外层部署，决定另外三样跑在哪张卡上：

1. **PagedAttention** — P、D 两端都要。
2. **Continuous Batching** — 拆开后是两套队列，不是关掉持续批。
3. **推测解码** — 只挂在 Decode 池。
4. **PD 分离** — P 写出 KV，传到 D。

口条：**分页打底，两边各自持续批，推测只给 Decode，PD 决定它们分家。**

## 深入

- [为什么需要 PD 分离](./推理优化-全量笔记#重点-为什么需要pd分离)
- 叠加用法、短 Prompt TTFT 反高：见 [推理优化 · 技术问答](./推理优化-面试题)
