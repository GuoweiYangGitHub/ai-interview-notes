# 01.Dify API使用

下次要调 Dify 对话流、文本生成或工作流时看这里。

## 前置条件

- 仓库根目录 `.env`：`DIFY_API_KEY`
- 可选 `DIFY_BASE_URL`（默认 `http://localhost/v1`，云端 `https://api.dify.ai/v1`）、`DIFY_USER_ID`
- 密钥只进 `client.ts`，业务代码不读环境变量
- 本机或云端 Dify 应用已创建；缺密钥会报错退出

## 使用方法

```bash
npm run dify
npm run dify -- --mode workflow
npm run dify -- --mode completion
```

默认 `--mode chat`：阻塞对话、续聊、拉消息、流式。`--mode workflow` 跑工作流，`--mode completion` 文本生成。控制台 JSON 里 `error: true` 即调用失败。

## 目录架构

```text
01.Dify API使用/
  client.ts    chat / completion / runWorkflow / getConversationMessages
  index.ts     按 --mode 演示
```

## 查阅要点

- does: fetch 直打开放 API。chat 对话流 + 续聊 + 拉消息 + 流式；workflow 跑工作流；completion 文本生成
- not: 不做 `app_type=auto` 连试三个端点；不打印 Authorization
- ref: 课 8 `dify_agent_client.py`、`dify_chat_example.py`、`dify_workflow_example.py`
