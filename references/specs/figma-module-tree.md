# Figma 模块树 — 对标 Jesko Jets 高舱 H5 改版

> 目标节点：`896:7047`（H5页面）  
> 文件：`YJivJiM80jHttJvfV3ejpG`  
> 对标：[Jesko Jets](https://jeskojets.com/?ref=uiuxshowcase.com)  
> 对应 H5：`Qwen/H5/business-upgrade-editorial-b777.html`

## 新旧结构对照

| 旧版（4 段） | 新版（7 段 + Footer） | Jesko Jets 对应段 |
|---|---|---|
| Section (Hero) `896:7048` | **S1 · Hero** "从容抵达" | "We are movement" 首屏 |
| — | **S2 · Brand Statement** | "5,000+ missions" 品牌背书 |
| — | **S3 · Value Pillars** | 四大价值支柱 |
| Scene 2 — Seat `909:6206` | **S4 · Cabin Showcase** | "Fly the Legacy" 机队展示 |
| — | **S5 · Aircraft Specs** | 技术参数密集区 |
| Scene 3 — Dining `909:6248` | **S6 · Service & Dining** | "A Better Way to Fly" 优势 |
| Scene 4 — Facts `909:6285` | **S7 · Route + Proof + CTA** | 里程碑信任 + Footer CTA |
| Footer (内联) | **Footer** | 页脚询问区 |

## 新版模块树（Figma 节点命名规范）

```
H5页面 (896:7047)                        ← 根 Frame, 750×auto, layoutMode: VERTICAL
├── S1_Hero                              ← 750×1624, bg: a350-hero.webp
│   ├── BG_Hero                          ← 绝对定位图层组
│   │   ├── IMG_Hero                     ← 图片填充, saturate(0.78)
│   │   └── OV_Hero                      ← 渐变叠层
│   ├── StatusBar                        ← iPhone 状态栏 (沿用 938:6351)
│   ├── Badge_Eyebrow                    ← 圆角标签 "CATHAY PACIFIC · A350-1000"
│   ├── Heading_Hero                     ← "从容 / 抵达", 92px/700
│   ├── Sub_Hero                         ← "长途飞行，从此不同", 30px
│   ├── Lead_Hero                        ← 引述段落 + 左边框
│   └── ScrollCue                        ← 滑动线 + "开始探索"
│
├── S2_Brand                             ← 750×1624, bg: gradient
│   ├── Line_Accent                      ← 56px 金色线 (居中)
│   ├── Text_Brand                       ← 大段品牌陈述, 34px/300, 居中
│   └── Tag_Brand                        ← "GLOBAL AVIATION EXCELLENCE"
│
├── S3_Pillars                           ← 750×1624, bg: gradient
│   ├── Kicker_Pillars                   ← "CORE VALUE"
│   ├── Heading_Pillars                  ← "不只是坐得更贵 / 而是能真正休息"
│   └── Grid_Pillars                     ← 2×2 网格
│       ├── Pillar_FlatBed               ← 180° / 全平躺
│       ├── Pillar_Width                 ← 20" / 座椅宽度
│       ├── Pillar_Layout                ← 1-2-1 / 全通道直达
│       └── Pillar_Rating                ← 4.62 / 旅客评分
│
├── S4_Cabin                             ← 750×1624, bg: hero-b777.webp
│   ├── BG_Cabin                         ← 图片 + 叠层
│   ├── Label_Cabin                      ← "BUSINESS CLASS"
│   ├── Heading_Cabin                    ← "奢享 / 随你而行", 76px
│   ├── Model_Cabin                      ← "Airbus" + "A350-1000"
│   ├── Copy_Cabin                       ← 描述段落
│   └── Gallery_Cabin                    ← 横向滚动座椅图
│       ├── IMG_Seat_09
│       ├── IMG_Seat_10
│       ├── IMG_Seat_11
│       └── IMG_Seat_12
│
├── S5_Specs                             ← 750×1624, bg: gradient
│   ├── Kicker_Specs                     ← "SPECIFICATIONS"
│   ├── Heading_Specs                    ← "性能参数"
│   ├── Grid_Specs                       ← 键值对列表
│   │   ├── Row: 座椅间距 / 45-75"
│   │   ├── Row: 座椅宽度 / 20"
│   │   ├── Row: 躺平角度 / 180°
│   │   ├── Row: 舱位布局 / 1-2-1
│   │   ├── Row: 商务舱座位 / 46 座
│   │   ├── Row: 盥洗室 / 10 间
│   │   ├── Row: 机上娱乐 / Wi-Fi·USB·IFE
│   │   └── Row: 充电设施 / 全座位端口
│   ├── Dims_Specs                       ← 3 列舱位卡片
│   │   ├── Card_Business                ← 46 座 / 45-75"
│   │   ├── Card_PremEco                 ← 32 座 / 40"
│   │   └── Card_Economy                 ← 256 座 / 32"
│   └── Blueprint                        ← a350-seatmap.webp
│
├── S6_Service                           ← 750×1624, bg: gradient
│   ├── Kicker_Service                   ← "A BETTER WAY TO FLY"
│   ├── Heading_Service                  ← "不一样的 / 飞行方式"
│   ├── Grid_Service                     ← 4 行服务项
│   │   ├── Item_Dining                  ← 01 / 多道式精致餐饮
│   │   ├── Item_Priority                ← 02 / 优先服务节奏
│   │   ├── Item_IFE                     ← 03 / 沉浸式娱乐系统
│   │   └── Item_Quiet                   ← 04 / 更安静的客舱
│   └── Bar_Stats                        ← 4 列统计
│       ├── Stat: 46 商务舱座位
│       ├── Stat: 334 全机座位
│       ├── Stat: 10 盥洗室
│       └── Stat: 4.62 综合评分
│
├── S7_Route                             ← 750×2400, bg: gradient
│   ├── Kicker_Route                     ← "YOUR JOURNEY"
│   ├── Heading_Route                    ← "你的下一段旅程"
│   ├── Card_Flight                      ← 航班卡片 (沿用 925:6206 结构升级)
│   │   ├── FC_Head                      ← 商务舱·直飞 / 国泰航空 CX
│   │   ├── FC_Times                     ← 09:55 PEK → 16:25 SIN
│   │   └── FC_Footer                    ← 价格信息 + ¥6,320
│   ├── Block_Proof                      ← 社会证明块
│   │   ├── Score_Big                    ← 4.62 渐变大字
│   │   ├── StarBars                     ← 5 行评分分布
│   │   └── Quotes                       ← 3 条旅客评价
│   ├── Hint_PE                          ← 优选经济舱备选提示
│   └── CTA_Primary                      ← "查看实时升级价差 →"
│
└── Footer                               ← 750×auto
    ├── Heading_Footer                   ← "从容抵达，由此开始"
    ├── Sub_Footer                       ← "国泰航空 A350-1000 商务舱"
    ├── CTA_Footer                       ← "立即查看航班 →"
    ├── Line_Footer                      ← 金色分隔线
    └── Source_Footer                    ← 数据来源说明
```

## 色彩与字型 Token

| Token | 值 | 用途 |
|---|---|---|
| --bg | #06070b | 主背景 |
| --bg-2 | #0a0c12 | 过渡背景 |
| --gold | #c9a74e | 金色强调 |
| --gold-light | #e8d5a0 | Hero 二级标题 |
| --text | #f0f1f5 | 主文字 |
| --text-2 | rgba(240,241,245,0.72) | 辅助文字 |
| --text-3 | rgba(240,241,245,0.38) | 弱文字 |
| --line | rgba(255,255,255,0.06) | 分隔线 |

字体：PingFang SC（正文/标题），SF Pro Display（备用）

## 交互与动效映射

| 效果 | H5 实现 | Figma 表达 |
|---|---|---|
| 滚动渐显 | IntersectionObserver + `.rv.vis` | 用 Smart Animate 原型链 |
| 视差 | scroll handler + translateY | 静态截图 + 注释说明 |
| 数字递增 | `data-counter` + JS counter | 在评审时用 gif/视频演示 |
| 星级条动画 | `.bar-fill` width transition | 两帧原型（空→满） |
| 横向图集 | overflow-x: auto | Horizontal scrolling prototype |

## 导入方式

1. 打开 `http://localhost:8077/business-upgrade-editorial-b777.html?figma=1`
2. 页面已含 `figma-capture` 模式（强制 `.rv` 可见）+ html-to-design capture.js
3. 使用 Figma 的 html-to-design 插件导入为新 Frame
4. 替换或覆盖现有 `896:7047` 节点
