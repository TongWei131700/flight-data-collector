---
name: figma-link-workflow
description: 用户提供 figma.com 设计稿链接时的标准流程：解析 fileKey/nodeId、用 Figma MCP 读稿、画布写入优先用官方 use_figma（须先读 figma-use）。Vibma 仅作极少数无法走官方 MCP 时的后备。本机 Figma MCP 端点见文内「本机 MCP」。在用户粘贴 Figma URL、要求「按链接改设计稿」「实现/同步 Figma」时启用。
---

# Figma 链接 → 读稿与改稿

## 0. 本机 Figma MCP 端点（固定记录）

- **本机 MCP URL**：`http://127.0.0.1:3845/mcp`
- **用途**：Cursor / Agent 通过该地址连接 Figma MCP（读稿 `get_design_context` / `get_metadata` / `get_screenshot`、改稿 **`use_figma`** 等），与 Figma 桌面端或本地桥接配合。
- **配置**：在 Cursor 的 MCP 设置里，将 Figma 相关服务的 **`url`** 指向上述地址（与官方 `https://mcp.figma.com/mcp` 二选一或按环境切换）；仓库根可参考 `D2C/.cursor/mcp.json`。
- **注意**：`127.0.0.1:3845` 仅本机可用；需先在本机启动对应的 Figma MCP / 桌面联动服务，否则连接失败。

## 1. 从链接解析参数

- 典型 URL：`https://www.figma.com/design/<fileKey>/...?node-id=<nodeId>`
- **fileKey**：路径里 `design/` 后的第一段 ID。
- **nodeId**：查询参数 `node-id`，把 `-` 换成 `:`（例如 `12-345` → `12:345`）。
- 分支链接若含 `/branch/<branchKey>/`，用 **branchKey** 作为 fileKey。

## 2. 读设计（Figma MCP — 默认唯一读路径）

使用已连接的 Figma MCP 工具（端点优先 **§0 本机 `http://127.0.0.1:3845/mcp`**，否则为 Cursor 当前配置的 figma 服务）：

- `get_design_context`：主入口，拿节点代码上下文与说明。
- `get_metadata`：结构树、子节点 id。
- `get_screenshot`：视觉对照。
- 需要变量定义时：`get_variable_defs`。

**不要**把「打开 Vibma、curl 3056/3055」当作读稿前置条件；读稿只依赖 Figma MCP 可用。

## 3. 改画布（默认：官方 `use_figma`）

- **每次调用 `use_figma` 前**必须先阅读并遵守技能 **figma-use**（Cursor Figma 插件自带）。
- 复杂整页搭建时额外参考 **figma-generate-design**、**figma-implement-design**。
- 调用 `use_figma` 时按 figma-use 要求传入 `skillNames: "figma-use"`。
- 确保 Figma 桌面端已打开目标文件、MCP 会话已授权写入（以当前环境提示为准）。

这是本项目的**标准写入路径**；文档、任务书、Prompt 中应默认写「通过 Figma MCP + `use_figma` 改画布」，而不是 Vibma 连接流程。

## 4. 后备：Vibma（非默认，尽量不用）

仅在同时满足以下情况时考虑：

- 官方 Figma MCP / `use_figma` 无法完成所需操作（例如环境未启用桌面 MCP、或确有仅 Vibma 脚本覆盖的批量场景）；且
- 用户明确要求或已运行本仓库遗留的 Vibma 自动化脚本。

若启用：Relay 端口、频道、`join_channel` / `ping` 等以 `D2C/.cursor/mcp.json` 与 Vibma 文档为准。**不要**在常规「按 Figma 链接改稿」流程中把 Vibma 与官方 MCP 并列为第一选项。

历史 HTTP 文案通道（如仓库 `CLAUDE.md` 中的 `http://localhost:3056/update`）属于 Vibma 生态，**非本项目推荐链路**；除非用户点名要用，否则改用 `use_figma`。

## 5. 与本仓库的约定

- **Figma MCP**：本机开发推荐 **`http://127.0.0.1:3845/mcp`**（见 §0）；亦可在 `D2C/.cursor/mcp.json` 中配置 **`figma`** 为 `https://mcp.figma.com/mcp`（官方）— 按实际环境选用其一。
- **Vibma**：保留在 monorepo MCP 配置中仅为兼容旧脚本；**新流程不依赖 Vibma 作为设计稿链接方式**。

## 6. 最小检查清单

- [ ] 已从 URL 得到正确的 `fileKey` / `nodeId`。
- [ ] 只读：已调用 `get_design_context`（或配合 `get_metadata` / `get_screenshot`）。
- [ ] 写入：已读 **figma-use**，并准备通过 **`use_figma`** 执行（仅在例外情况下才改走 Vibma）。
