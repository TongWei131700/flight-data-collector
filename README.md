# Flight Data Collector

飞猪机票航司机型数据收集 Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 简介

系统化收集航空公司机型资料，并整理成可复用的数据目录。支持从 seatmaps.com 抓取航司机型数据、图片分类、去重、多版本整理等功能。

## 效果演示

### H5 页面效果
项目最终效果演示视频：[`assets/previews/H5页面.mp4`](assets/previews/H5页面.mp4)

该视频展示了 H5 页面的完整交互效果。

### Skill 抓取示例 - 阿联酋航空
本 Skill 抓取数据的示例视频：[`assets/previews/阿联酋航空爬取 - 02.mp4`](assets/previews/阿联酋航空爬取%20-%2002.mp4)

该视频展示了使用本 Skill 抓取阿联酋航空数据的完整过程，是第一个成功运行的 Skill 抓取数据示例。

## 快速开始

```bash
# 安装依赖
npm install

# 运行批量处理
npm run batch-process

# 图片分类
npm run classify

# 图片去重
npm run dedup
```

## 目录结构

```
.
├── SKILL.md                   # 技能主入口 (Claude Skill)
├── README.md                  # 本文件
├── LICENSE                    # MIT 许可证
├── package.json               # Node.js 依赖配置
├── .gitignore                 # Git 忽略规则
├── .claude/settings.local.json # Claude 项目配置
├── docs/                      # 项目文档
│   ├── requirements/          # PRD 需求文档
│   ├── iterations/            # 迭代记录
│   └── presentations/         # PPT 演示
├── assets/                    # 静态资源
│   └── demos/                 # H5 效果演示
├── data/                      # 核心数据
│   └── 国泰航空 CX/           # 航司数据库
├── references/                # 参考资料
│   ├── specs/                 # 规范文档
│   └── template.md            # 模板
├── resources/                 # 资源文件
├── scripts/                   # 可执行脚本
│   ├── core/                  # 核心流程脚本
│   ├── organize/              # 多版本/机型整理
│   ├── utils/                 # 工具脚本
│   ├── maintenance/           # 维护脚本
│   └── mcp-temp/              # MCP 临时文件
└── scripts/README.md          # 脚本说明文档
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run batch-process` | 批量处理流程 |
| `npm run classify` | 图片语义分类 |
| `npm run dedup` | 图片去重 |
| `npm run check-raw` | 检查原始数据完整性 |
| `npm run fix-raw` | 修复原始数据目录 |

## 技术栈

- **Node.js** >= 16.0.0
- **Python** >= 3.8
- **核心依赖**: sharp, fs-extra, axios, cheerio

## 许可证

[MIT](LICENSE)

---

## 迁移记录

| 原位置 | 新位置 |
|--------|--------|
| `1 Prd/` | `docs/requirements/` |
| `2 H5效果/` | `assets/demos/` |
| `3 其他文件/scripts/` | `scripts/` |
| `3 其他文件/specs/` | `references/specs/` |
| `4 自我迭代/` | `docs/iterations/` |
| `5 项目PPT/` | `docs/presentations/` |
| `6 航司数据库/` | `data/` |
