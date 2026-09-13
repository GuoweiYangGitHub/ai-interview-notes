# bing-cn

下次要用必应中文搜索 MCP、又不想申请搜索 Key 时看这里。

`npx -y bing-cn-mcp` 起 stdio server。常用工具：`bing_search`、`crawl_webpage`。

## 前置条件

- 本机已装 Node，能跑 `npx`
- 不需要 API Key

## 使用方法

```bash
npm run mcp:bing-cn
```

先列出工具，再搜「贵州茅台 最新新闻」。

## 目录架构

```text
bing-cn/
  index.ts    list → bing_search
```

上级 `stdio.ts`：npx 拉起 server。

## 查阅要点

- does: stdio 调用 `bing_search`（count=5）
- not: 不演示按 UUID 抓网页；不接远程 SSE
