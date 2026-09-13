# Agent 系统化笔记

独立 VitePress 站点：A / B / C 专题、核心能力、代码示例、语法对照、课程练习，以及可运行示例。

- 文档入口：`docs/`
- 主线示例：`examples/`
- 框架与平台案例：`cookbook/`
- MCP 工具示例：`mcp-tools/`

```bash
npm install
npm run docs:dev
```

需要模型服务的示例请先复制 `.env.example` 为 `.env` 并填写已有配置。

本地打包（和 Vercel 同一条命令）：

```bash
npm run docs:build
npm run docs:preview
```

产物在 `docs/.vitepress/dist`。构建前会同步核心能力目录并校验内链。Vercel 导入仓库后会读根目录 `vercel.json`：安装 `npm ci`，构建 `npm run docs:build`，发布该目录。Node 需要 20+。不要在 Vercel 里打开 HTML Auto Minify。
