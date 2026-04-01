# flight-data-collector / scripts

本目录为**全局真源** `~/skills/flight-data-collector/scripts` 的一部分；Cursor / Claude / OpenClaw 通过符号链接使用同一目录。参数以各脚本注释与 `--help` 为准。Phase 说明见 [reference.md](../reference.md)。

## 核心流程

| 文件 | 用途 |
|------|------|
| `scrape_seatmaps.py` | 从 seatmaps.com 抓取航司或单 URL 机型数据（自动创建 `机型详情.md`） |
| `batch-process.js` | 可选：串联部分步骤的一键流程 |
| `classify-images-v2.js` | 语义分类图片到 `images/1-5` 子目录 |
| `classify-images-v3.js` | 与 v2 并列的替代/升级版本 |
| `dedup-images.js` | 图片去重 |
| `migrate-and-classify-v2.js` | 迁移与分类辅助 |

## 多版本 / 机型整理

| 文件 | 用途 |
|------|------|
| `organize-a330-versions.js` | A330 等多版本目录整理 |
| `organize-a330-versions-v2.js` | 同上迭代版 |
| `organize-emirates-a380-versions.js` | 阿联酋 A380 版本整理 |
| `distribute-a380-images.js` | A380 图片分发 |
| `dedup-emirates-images.js` | 阿联酋相关去重 |

## 其它工具脚本

| 文件 | 用途 |
|------|------|
| `crawl-a330-v2.py` | A330 相关爬取补充 |
| `download-a330-complete.py` | A330 资源下载 |
| `download-a330-images.py` | A330 图片下载 |
| `download-sq-a350-v2-v3-images.py` | 新航 A350 版本图片 |
| `create-a330-detail-doc.py` | 生成机型详情文档 |
| `create-airline-shortcuts.sh` | 为航司目录创建 seatmaps + 官网快捷方式 |
| `fix-emirates-seatmaps.js` | 修复阿联酋航空 seatmap 文件映射 |
| `fix-raw-data-dir.js` | 修复 `0-原始数据` 目录，确保所有分类图片在其中都有副本 |
| `check-raw-data-completeness.js` | 检查 `0-原始数据` 目录完整性 |
| `organize-emirates-all-aircraft.js` | 阿联酋航空全部机型多版本整理 |

## 维护全局链接

| 文件 | 用途 |
|------|------|
| `link-global-skill.sh` | 创建/修复指向真源的符号链接 |
| `verify-global-skill-links.sh` | 校验 Cursor / Claude / OpenClaw 三处链接 |
| `check-claude-skill-link.sh` | 兼容旧名：校验 Claude 链接（内部可调用 verify） |
| `git-save-skill.sh` | 一键将 `skills/flight-data-collector` 提交到 `$HOME` 的 Git（保存 skill；若仓库存在未解决合并冲突会先报错退出） |
