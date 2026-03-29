# 对话流商务舱推荐（参考实现）

本目录实现计划中的 **Schema + CabinKB + 编排层 + SSE + H5 演示 + QA 校验**。

## 结构

| 路径 | 说明 |
|------|------|
| [schemas/](./schemas/) | `FlightCard` / `CabinUpsell` JSON Schema 与 [PROTOCOL.md](./schemas/PROTOCOL.md) |
| [cabin-kb/](./cabin-kb/) | 航司+机型 → 事实、图片 URL、accordion 模板；无数据显式占位 |
| [orchestrator/](./orchestrator/) | 并行 mock 检索、槽位策略、`toSSESequence` |
| [client/chat-blocks-demo.html](./client/chat-blocks-demo.html) | 解析 SSE、卡片 + 手风琴 + 图片白名单 |
| [../H5/qwen-flight-chat-uiux-demo.html](../H5/qwen-flight-chat-uiux-demo.html) | **静态高保真**千问风对话页（UI-UX-ProMax 令牌 + 本地配图），可直接用浏览器打开 |
| [qa-metrics/](./qa-metrics/) | `golden-set.json`、`validate-blocks.js`、`events.md` |

## 运行

```bash
cd chat-flight-recommendation
npm install
npm start
```

浏览器打开 <http://127.0.0.1:3847/> ，点击「拉取 SSE」。

## 校验

```bash
npm run validate
```

## 环境变量

- `CHAT_FLIGHT_PORT`：默认 `3847`

## 接入真实 API

替换 [orchestrator/mock-flight-api.js](./orchestrator/mock-flight-api.js) 为真实查价服务；CabinKB 可将 [fixtures.json](./cabin-kb/fixtures.json) 换为数据库或 FlightData 管道。
