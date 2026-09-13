# Tasks

## 1. 环境与入口

- [x] 1.1 `.env.example` 增加 Coze / Dify 变量
- [x] 1.2 `tsconfig.json` include `exampleAgentFramework/**/*.ts`
- [x] 1.3 `package.json` 增加 `coze` / `dify` 脚本，安装 `@coze/api`

## 2. Coze

- [x] 2.1 `02.Coze API使用/client.ts`：createCozeClient、chat、chatStream、chatWithHistory、getBotInfo
- [x] 2.2 `02.Coze API使用/index.ts`：非交互演示上述功能点

## 3. Dify

- [x] 3.1 `01.Dify API使用/client.ts`：chat / completion / runWorkflow / getConversationMessages，含 SSE
- [x] 3.2 `01.Dify API使用/index.ts`：`--mode chat|workflow|completion` 演示

## 4. 查阅文档

- [x] 4.1 `exampleAgentFramework/README.md` 按 examples 查阅字段写入口
