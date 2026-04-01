# Mod_AircraftCabinFacts：Figma 与设计数据映射

文件：[Qwen 沉浸式 Figma](https://www.figma.com/design/YJivJiM80jHttJvfV3ejpG/Qwen-%E6%B2%89%E6%B5%B8%E5%BC%8F)  
页面名（插件创建）：`模块_AircraftCabinFacts`

## 组件与变体

| 组件 | 变体属性 | 取值 | 说明 |
|------|----------|------|------|
| `Cmp_AccordionRow` | RowType | Facts, Rating, Compare, Tips, Routes | 对应手风琴标题与正文模板 |
| `Cmp_AccordionRow` | State | Collapsed, Expanded | 与稿面「展开 / 收起」一致 |
| `Mod_AircraftCabinFacts` | FocusCabin | Business, Economy, Both | 摘要条焦点提示，可做弱样式区分 |

**Media（图片）**：不单独做第三维变体，避免 Figma 组件集属性不一致。`RowType=Facts` 且 `State=Expanded` 内含灰色 **Media 占位**；实例层可隐藏矩形即等价 `Media=None`。

**DataHealth（Full / Partial / Empty）**：不增设变体。研发按 JSON 替换 `Slot_CabinTable` 与各 Accordion Body 文案；Empty 时使用「暂无可靠数据」类占位（与 PRD CabinKB 缺失一致）。

## Slot 与 JSON 字段

| 图层 / Slot | JSON 路径 | 约束 |
|-------------|-----------|------|
| `Slot_Summary` 标题 | `aircraft.family` + `aircraft.operator` | 与报价航段一致时再展示 |
| `Slot_Summary` 评分行 | `aircraft.overall_score`, `review_count`, `source`, `updated_at` | 仅展示已校验字段 |
| `Slot_CabinTable` | `cabins[]`（seat count, pitch, width, recline, code） | 缺字段用占位，禁止 LLM 补数字 |
| Accordion Facts | `cabins[J].amenities`, 布局事实, `media.hero_url`（HTTPS 白名单） | 图仅 CDN/CabinKB |
| Accordion Rating | `rating_breakdown`, `reviews.positive/negative` | 可做引用列表 |
| Accordion Compare | `comparison[]` | 对标宽体机等 |
| Accordion Tips | `seat_tips`, `warnings` | 选座 + 注意事项 |
| Accordion Routes | `routes_sample`, 推荐指数 | Tag 或短列表 |

## PRD 与全局 Feed 策略

本模块属 **CabinUpsell / Accordion** 强结构化例外；仅在第三槽有库存、编排允许且存在机型事实源时插入，见仓库 [`如何在对话流商务舱推荐_4ea05d0c.plan.md`](../如何在对话流商务舱推荐_4ea05d0c.plan.md) §6.4。

## 在 Figma 中生成模块

在 Cursor 中已对文件 `YJivJiM80jHttJvfV3ejpG` 执行 **Figma MCP `use_figma`**，脚本内容见 [`../scripts/figma-aircraft-cabin-module-use-figma.js`](../scripts/figma-aircraft-cabin-module-use-figma.js)。若画布中未出现页 `模块_AircraftCabinFacts`，请在 Figma 桌面端打开该文件后重试 MCP，或将该脚本中的 `code` 字符串粘贴到 **Figma MCP / use_figma** 的 `code` 参数并指定同一 `fileKey`。

## Pencil 模版（与 Figma 沉浸式对齐）

- 文件：在 Cursor 中打开的 `pencil-new.pen`（Pencil 编辑器）。
- 根画板节点：`Tpl_Mod_AircraftCabinFacts`（id `Eg4W6`，画布约 x=850）。
- 视觉：页底 `#f7f8fa`、卡片白底 + `#eeeeee` 内描边、主文 `#0f131a` / 次文 `#5c5f66` / 浅灰 `#919499`，与 [设计计划.md](../设计计划.md) 及对话方案三卡片一致；字体暂用 Inter（与现有 `画板B · 对话沉浸` 一致，可再换 PingFang）。
- 结构：`Slot_Summary`、`Slot_CabinTable`、`Group_Accordions`（Facts 含 `Media_Hero` 占位）+ 各 RowType 文案旁注明 JSON 绑定键。

## 示例帧

- `Example_A321neo_Full`：国泰 A321neo 完整字段示例（与仓库 JSON `高舱沉浸式` 内 `Section_AircraftCabinFacts` 文案可对齐）。
- `Example_DataHealth_Empty`：舱位表空态占位。
