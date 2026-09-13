# exampleMcpTools

下次要接现成的 MCP server（stdio）时看这里。每个工具一个文件夹。

## 前置条件

- 仓库根目录 `.env`：Tavily 要 `TAVILY_API_KEY`；Tushare 要 `TUSHARE_TOKEN`；必应中文搜索不需要密钥
- npx 工具要本机 Node；Tushare 要 Python 3.10+ 且 `pip install -r exampleMcpTools/Tushare/requirements.txt`

## 使用方法

```bash
npm run mcp:tavily
npm run mcp:bing-cn
npm run mcp:tushare
```

控制台先打印 `tools/list`，再打印一次调用结果。

## 目录架构

```text
exampleMcpTools/
  stdio.ts     stdio MCP：npx 或 python
  tavily/      tavily-mcp@0.1.4（Node）
  bing-cn/     bing-cn-mcp（Node）
  Tushare/     开源 tushare Python SDK + FastMCP
```

## 查阅要点

- does: 用官方 MCP SDK 连第三方 stdio server，列出工具并调用
- not: 不接 ModelScope SSE；不把 MCP 再桥进 Agent（那是 `examples/05.MCP协议融入Agent`）
