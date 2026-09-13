# 02.Coze API使用

下次要调 Coze 已发布 Bot（阻塞 / 流式 / 带历史 / 查 Bot）时看这里。

## 前置条件

- 仓库根目录 `.env`：`COZE_API_TOKEN`、`COZE_BOT_ID`
- 可选 `COZE_BASE_URL`（默认 `https://api.coze.cn`）、`COZE_USER_ID`
- 密钥只进 `client.ts`，业务代码不读环境变量
- Bot 已在开放平台发布；缺 token 或 bot id 会报错退出

## 使用方法

```bash
npm run coze
```

非交互跑一遍：查 Bot 信息、阻塞回复、流式增量、带历史再问。不做 Python 里的 quit / 切换 stream REPL。

## 目录架构

```text
02.Coze API使用/
  client.ts    createCozeClient / chat / chatStream / chatWithHistory / getBotInfo
  index.ts     非交互跑一遍四个功能点
```

## 查阅要点

- does: `@coze/api` 调中国区 Bot；演示查信息、阻塞回复、流式增量、带历史再问
- not: 不做 Python 里的交互式 REPL（quit / 切换 stream）
- ref: 课 8 `coze_client.py`、`config.py`
