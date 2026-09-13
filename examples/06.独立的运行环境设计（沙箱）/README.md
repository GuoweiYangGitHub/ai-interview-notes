# 06.独立的运行环境设计（沙箱）

下次模型会生成指令、但不能直接在本机任意执行时看这里。

## 前置条件

- 本示例不调模型，仓库 `.env` 可缺
- `06:01` / `06:03` / `06:04` / `06:05` 不依赖 Docker
- `06:02` 需要本机 Docker CLI、daemon，以及事先 pull 好的 `python:3.12-slim`；缺环境则跳过，不回退宿主执行

## 使用方法

```bash
npm run 06
npm run 06:01
npm run 06:02
npm run 06:03
npm run 06:04
npm run 06:05
```

`npm run 06` 只列出五种方案。`06:docker` 等同 `06:02`。能落地的跑证据；落不了的打印方案卡后跳过。

## 目录架构

```text
06.独立的运行环境设计（沙箱）/
  index.ts           五种方案目录索引
  01.受限进程/       新进程 + 超时 + 裁剪环境，并证明宿主文件仍可改写
    scheme.ts
    restrictedProcess.ts
    index.ts
  02.Docker/         预检、create、inspect、回收
    scheme.ts
    dockerSandbox.ts
    index.ts
  03.gVisor/         方案卡（本机无 runsc）
    scheme.ts
    index.ts
  04.microVM/        方案卡（本机无 KVM / Firecracker）
    scheme.ts
    index.ts
  05.托管沙盒/       方案卡 + Host 合同（未接供应商）
    scheme.ts
    contract.ts
    index.ts
```

方案子目录不另开 README。

## 查阅要点

- does: 按课10 五种执行环境方案分目录。能落地的跑证据；落不了的打印方案、边界和注意点
- not: 登记表和名单过滤管入口，不在 06；`06:03`/`06:04`/`06:05` 只说明不执行；`06:02` 缺 Docker 则跳过、不自动 pull
- ref: 课10 方案对比表、`s02_instruction_subprocess.py`、`s04_docker_execution_environment.py`
