# tavily

下次要用 Tavily 做网页/新闻搜索 MCP 时看这里。

`npx -y tavily-mcp@0.1.4` 起 stdio server。常用工具：`tavily-search`、`tavily-extract`。不要走 ModelScope 的 SSE 接入。

## 前置条件

- 仓库根目录 `.env`：`TAVILY_API_KEY`（https://app.tavily.com/home）
- 密钥只进 `client.ts`

## 使用方法

```bash
npm run mcp:tavily
```

先列出工具，再搜「贵州茅台 最新新闻」。缺密钥会报错退出。

## 目录架构

```text
tavily/
  client.ts   读 TAVILY_API_KEY
  index.ts    list → tavily-search
```

上级 `stdio.ts`：npx 拉起 server。

## 查阅要点

- does: stdio 调用 `tavily-search`（news、最多 5 条）
- not: 不演示 extract / crawl；不把 Key 写进代码
