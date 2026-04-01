# Hero 舷窗开屏 — 分层素材规范（Jesko 风格）

当前页面默认用 **纯 CSS 椭圆舷窗**（`box-shadow` 造暗角）+ 现有视频底图，无需文件即可跑通滚动放大。若要 **1:1 替换为实拍分层**，请按下列规范导出并改 `business-upgrade-editorial-b777.html` 中对应 `<img>` / 路径。

## 必备图层（同机位、同透视）

| 文件建议名 | 内容 | 格式 |
|------------|------|------|
| `hero-back.webp` | 窗外世界（最终全屏主视觉） | WebP / AVIF，宽 ≥ 2400px |
| `hero-window-frame.webp` | 仅舷窗框 + 舱壁实体，**透明底** | WebP PNG 透明 |
| `hero-window-vignette.webp` | 窗洞内缘暗角、玻璃反光（可半透明） | WebP 透明 |
| `hero-front-over.webp` | 镜头前遮挡（窗沿、座椅前景等） | WebP 透明 |

## 导出注意

- 所有层 **同一画幅、同一相机**，不要单独缩放某一层。
- **不要把窗外景色烤进窗框层**；窗框层只保留实体结构。
- 优先 **WebP**；Retina 可提供 `@2x` 或 `srcset`。
- 替换代码时：背景层用 `object-fit: cover` + 与现视频相同的 `object-position`（底对齐）以免跳变。

## 可选

- `hero-knob.webp`：把手/锁扣小图，绝对定位在窗框下方。
- 轻循环视频：仅替换 **背景层**；窗框仍建议用静态分层，避免整段视频 baked。
