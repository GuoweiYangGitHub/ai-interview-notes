# 04.管理Agent的行动能力-注册、工具池与动态装载

下次要注册 Action、按场景装载工具池、模型只能看见当前批次时看这里。

## 前置条件

- 仓库根目录 `.env`：`BAILIAN_TOKEN_PLAN_API_KEY`、`CHAT_BASE_URL`、`CHAT_MODEL`
- 密钥只进 `client.ts`，业务代码不读环境变量

## 使用方法

```bash
npm run 04
```

跑完对照两份 tools 列表：同一问题先装载子集再装载全量，各请求一次。模型只能看见当前已装载的工具。

## 目录架构

```text
04.管理Agent的行动能力-注册、工具池与动态装载/
  registry.ts    register / list / load / call
  catalog.ts     本地 Action（查表、回显）
  client.ts      模型接入
  index.ts       子集 vs 全量对照
```

## 查阅要点

- does: 注册本地 Action；同一问题先装载子集再装载全量，对照两份 tools 列表并各请求一次
- not: 不做远程插件市场或热更新进程
- ref: 课07 `action_manager_example.py`
