# OpenManus · 知识点

## OpenManus

## [重点] OpenManus 核心结构

开源通用 Agent 框架（对标闭源 Manus）。六层从上到下：交互进来，基础设施托底。

1. **用户交互层** — CLI、Web API、可视化界面，收用户任务、回过程与结果。
2. **应用入口层** — 单智能体（如 `main.py`）、多智能体协作、远程工具 / MCP 接入；决定这次走 Agent 还是 Flow。
3. **智能体层** — 四级继承：`BaseAgent`（状态、记忆、循环）→ `ReActAgent`（Think-Act）→ `ToolCallAgent`（解析并执行工具）→ `Manus`（注入浏览器等完整工具集）。新业务 Agent 继承 ToolCall，只换工具，不重写循环。
4. **工具层** — `BaseTool` + `ToolCollection` 统一注册。常见：搜索、浏览器、代码执行、文件编辑；可接沙箱和 MCP 远程工具。
5. **流程控制层** — `BaseFlow` / `PlanningFlow`：复杂任务先拆步再派给 Agent；支持规划 → 执行 → 校验的多 Agent 协作。
6. **基础设施层** — LLM 适配、Memory、配置与日志；可选 Docker / 沙箱、缓存、向量库。

调用链可以记：交互 → 入口（单 Agent 或 Flow）→ Agent 选工具 → 工具打到浏览器/代码/搜索 → LLM 与记忆在最底层。

## Daytona

通过DayTona沙箱，Agent可以使用：

- SandboxBrowserTool (sb_browser_tool)：沙箱浏览器工具
  - 在远程沙箱中运行浏览器
  - 支持浏览器自动化操作
  - 可通过 VNC 实时查看操作过程
- SandboxShellTool (sb_shell_tool)：沙箱 Shell 工具
  - 在沙箱中执行 Shell 命令
  - 支持命令行操作
- SandboxFilesTool (sb_files_tool)：沙箱文件操作工具
  - 在沙箱中读写文件
  - 管理 /workspace 目录下的文件
- SandboxVisionTool (sb_vision_tool)：沙箱视觉工具
  - 在沙箱中进行视觉识别和分析

## SandboxManus使用

> SandboxManus 是在一个云端沙箱中运行的 Agent，与 Manus（本地 Agent）相比，提供了完全隔离的执行环境

1. **沙箱环境管理**
   - 自动创建：调用 `SandboxManus.create()` 时自动创建 Daytona 云端沙箱
   - 服务初始化：自动启动 supervisord 和浏览器自动化服务（端口 8003）
   - 资源清理：任务完成后自动删除沙箱，释放资源
2. **沙箱工具集**
   - `SandboxBrowserTool`：沙箱内浏览器，网页浏览、表单填写、内容提取
   - `SandboxFilesTool`：沙箱文件系统，创建 / 编辑 / 删除
   - `SandboxShellTool`：执行 Shell，支持命令和会话管理
   - `SandboxVisionTool`：视觉识别和分析
3. **VNC 远程访问**
   - 启动时输出 VNC URL，浏览器打开即可看沙箱桌面
   - 实时观察浏览器操作和任务执行
   - 便于调试和监控

和本地 Manus 的差别：代码、浏览器、文件都在云端隔离环境里跑，跑完销毁，本机不被 Agent 直接改。
