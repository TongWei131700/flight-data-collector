# 国泰 CX A350-1000 设计素材与事实映射

数据来源目录：`/Users/dengxinyang/Desktop/AI·Project/FlightData/国泰航空 CX/A350-1000/`  
机型事实出处：同目录 [`机型详情.md`](../FlightData路径见任务书；本仓库相对路径以本机绝对路径为准)。

## 可核验事实（摘自机型详情.md）

| 展示字段 | 值 | 出处 |
|----------|-----|------|
| 商务舱座位数 | 46 | 机型详情 §舱位配置 |
| 腿部空间 | 45–75" (114–190cm) | 同上 |
| 座椅宽度 | 20" (51cm) | 同上 |
| 平躺 | 180° 全平躺 | 同上 |
| 综合评分 | 4.62/5 | 同上 |
| 评论数 | 480 条 | 同上 |
| Wi-Fi / USB / IFE / 充电 | 有 | 机型详情 §娱乐与连接 |

## 配图路径（相对 CX 包）

| 用途 | 绝对路径（本机） |
|------|------------------|
| Hero 主图（商务舱全景/座椅） | `…/A350-1000/images/2-座椅图片/09-image.webp` |
| 缩略图 1 | `…/A350-1000/images/2-座椅图片/10-image.webp` |
| 缩略图 2 | `…/A350-1000/images/2-座椅图片/11-image.webp` |
| 缩略图 3 | `…/A350-1000/images/2-座椅图片/12-image.webp` |
| 座位布局图（Accordion / 详情） | `…/A350-1000/images/1-座椅布局/03-image.webp` |

复制到仓库设计资产：`Qwen/Pencil/assets/cx-a3501000/*.jpg`（由 webp 转 JPEG 供 Figma base64 / Pencil / H5 引用）。

## PRD 块对应（CabinUpsell 示意）

- `facts[]`：上表可核验字段  
- `images[]`：hero + thumb1–3 + 可选 seatmap `03-image`  
- `accordion[]`：建议标题「豪华商务舱」「座位布局」「娱乐与电源」「用户评价摘要」
