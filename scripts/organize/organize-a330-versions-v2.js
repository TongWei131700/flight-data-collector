#!/usr/bin/env node

/**
 * 国泰航空 A330-300 版本整理工具 v2
 * 清理重复目录，为 6 个版本（V.1-V.6）各创建完整的图片分类
 *
 * 目录结构:
 * A330-300/
 * ├── A330-300-versions-INDEX.md
 * ├── A330-300 V.1/
 * │   ├── 版本信息.md
 * │   └── images/
 * │       ├── 0-原始数据/
 * │       ├── 1-座椅布局/
 * │       ├── 2-座椅图片/
 * │       ├── 3-机上餐食/
 * │       ├── 4-娱乐设备/
 * │       └── 5-其他信息/
 * └── A330-300 V.2-V.6/ (同上)
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/国泰航空 CX/A330-300';
const VERSIONS = ['V.1', 'V.2', 'V.3', 'V.4', 'V.5', 'V.6'];

// 版本配置信息
const VERSION_INFO = {
  'V.1': { seats: 262, business: 39, economy: 223, layout: '39 商务舱，223 经济舱' },
  'V.2': { seats: 317, business: 24, economy: 293, layout: '24 商务舱，293 经济舱' },
  'V.3': { seats: 293, business: 28, economy: 265, layout: '28 商务舱，265 经济舱' },
  'V.4': { seats: 307, business: 42, economy: 265, layout: '42 商务舱，265 经济舱' },
  'V.5': { seats: 251, business: 39, premium: 21, economy: 191, layout: '39 商务舱，21 优选经济舱，191 经济舱' },
  'V.6': { seats: 280, business: 50, economy: 230, layout: '50 商务舱，230 经济舱' }
};

// 分类体系
const CATEGORIES = [
  { id: '0-原始数据', description: '从航司官网爬取的原始图片' },
  { id: '1-座椅布局', description: '座位图、舱位布局平面图' },
  { id: '2-座椅图片', description: '座椅实物照片（商务舱、经济舱等）' },
  { id: '3-机上餐食', description: '餐食、饮品、菜单图片' },
  { id: '4-娱乐设备', description: 'IFE 屏幕、USB 端口、WiFi 等设备' },
  { id: '5-其他信息', description: 'logo、图标、外观等其他图片' }
];

// 基于序号和文件大小的分类规则
function classifyImage(filename, size, ext) {
  const match = filename.match(/^(\d+)-/);
  const index = match ? parseInt(match[1]) : -1;

  if (filename.includes('完整页面')) {
    return { category: '5-其他信息', reason: '完整页面截图' };
  }

  if (index === 1 && ext === 'png') {
    return { category: '5-其他信息', reason: '航空公司 logo' };
  }

  if (index === 2 && ext === 'svg') {
    return { category: '5-其他信息', reason: '信息图标' };
  }

  if (index === 3 && ext === 'webp') {
    return { category: '1-座椅布局', reason: '座椅布局平面图（主图）' };
  }

  if (index >= 4 && index <= 8 && ext === 'svg') {
    return { category: '5-其他信息', reason: '功能图标' };
  }

  if (index >= 9 && index <= 12 && ext === 'webp') {
    return { category: '2-座椅图片', reason: '座椅细节图片' };
  }

  if (index === 13 && ext === 'webp') {
    return { category: '1-座椅布局', reason: '座椅布局平面图（副图）' };
  }

  if (index >= 14 && index <= 17 && ext === 'webp') {
    if (size > 50000) {
      return { category: '1-座椅布局', reason: '座椅布局平面图（大文件）' };
    }
    return { category: '2-座椅图片', reason: '座椅或舱位图片' };
  }

  if (index === 18 && ext === 'webp') {
    if (size > 50000) {
      return { category: '1-座椅布局', reason: '座椅布局平面图' };
    }
    return { category: '2-座椅图片', reason: '座椅实物图片' };
  }

  if (index >= 19 && index <= 22 && ext === 'webp') {
    if (size > 50000) {
      return { category: '1-座椅布局', reason: '座椅布局平面图（大文件）' };
    }
    return { category: '4-娱乐设备', reason: '机上设备图片' };
  }

  if (index >= 23 && index <= 29 && ext === 'webp') {
    if (size > 50000) {
      return { category: '1-座椅布局', reason: '座椅布局平面图（大文件）' };
    }
    return { category: '5-其他信息', reason: '待确认' };
  }

  if (index === 30 && ext === 'svg') {
    return { category: '5-其他信息', reason: '图标' };
  }

  return { category: '5-其他信息', reason: '待确认' };
}

// 清理旧的平铺目录和版本目录
function cleanupOldDirs() {
  console.log('\n清理旧目录...');

  // 删除平铺的 images 目录
  const oldImagesDir = path.join(BASE_DIR, 'images');
  if (fs.existsSync(oldImagesDir)) {
    fs.rmSync(oldImagesDir, { recursive: true, force: true });
    console.log(`  已删除：${oldImagesDir}`);
  }

  // 删除旧的版本目录
  for (const version of VERSIONS) {
    const versionDir = path.join(BASE_DIR, `A330-300 ${version}`);
    if (fs.existsSync(versionDir)) {
      fs.rmSync(versionDir, { recursive: true, force: true });
      console.log(`  已删除：A330-300 ${version}`);
    }
  }

  // 删除旧的索引文件
  const oldIndexFile = path.join(BASE_DIR, 'A330-300-versions-INDEX.md');
  if (fs.existsSync(oldIndexFile)) {
    fs.unlinkSync(oldIndexFile);
    console.log(`  已删除：A330-300-versions-INDEX.md`);
  }

  console.log('清理完成');
}

// 为每个版本创建完整分类
function createVersion(version) {
  console.log(`\n处理 ${version}...`);

  const sourceDir = path.join(BASE_DIR, 'temp-source');
  const versionDir = path.join(BASE_DIR, `A330-300 ${version}`);
  const imagesDir = path.join(versionDir, 'images');

  // 创建目录结构
  const targetDirs = CATEGORIES.map(c => path.join(imagesDir, c.id));
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // 从临时源目录读取图片
  if (!fs.existsSync(sourceDir)) {
    console.log(`⚠️ 源目录不存在：${sourceDir}`);
    return null;
  }

  const files = fs.readdirSync(sourceDir)
    .filter(f => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f));
  console.log(`  找到 ${files.length} 张图片`);

  const classification = {};
  for (const cat of CATEGORIES) {
    classification[cat.id] = [];
  }

  // 分类每张图片
  for (const image of files) {
    const imagePath = path.join(sourceDir, image);
    const stats = fs.statSync(imagePath);
    const ext = path.extname(image).toLowerCase().replace('.', '');

    const result = classifyImage(image, stats.size, ext);
    classification[result.category].push({
      original: image,
      reason: result.reason,
      size: stats.size
    });
  }

  // 复制图片到对应目录
  for (const cat of CATEGORIES) {
    const targetDir = path.join(imagesDir, cat.id);
    for (const item of classification[cat.id]) {
      const srcPath = path.join(sourceDir, item.original);
      const dstPath = path.join(targetDir, item.original);
      try {
        fs.copyFileSync(srcPath, dstPath);
      } catch (error) {
        console.error(`复制失败：${item.original} - ${error.message}`);
      }
    }
  }

  // 保存版本信息
  const infoPath = path.join(versionDir, '版本信息.md');
  let info = `# A330-300 ${version} 配置信息\n\n`;
  info += `| 项目 | 数值 |\n`;
  info += `|------|------|\n`;
  info += `| 总座位数 | ${VERSION_INFO[version].seats} |\n`;
  if (VERSION_INFO[version].business) {
    info += `| 商务舱 | ${VERSION_INFO[version].business} 座 |\n`;
  }
  if (VERSION_INFO[version].premium) {
    info += `| 优选经济舱 | ${VERSION_INFO[version].premium} 座 |\n`;
  }
  info += `| 经济舱 | ${VERSION_INFO[version].economy} 座 |\n`;
  info += `| 布局 | ${VERSION_INFO[version].layout} |\n`;
  fs.writeFileSync(infoPath, info);

  // 保存详细报告
  const reportPath = path.join(imagesDir, 'classification-report.md');
  let report = `# A330-300 ${version} 图片分类报告\n\n`;
  report += `生成时间：${new Date().toLocaleString('zh-CN')}\n\n`;
  report += `## 版本配置\n\n`;
  report += `| 项目 | 数值 |\n`;
  report += `|------|------|\n`;
  report += `| 总座位数 | ${VERSION_INFO[version].seats} |\n`;
  if (VERSION_INFO[version].business) {
    report += `| 商务舱 | ${VERSION_INFO[version].business} 座 |\n`;
  }
  if (VERSION_INFO[version].premium) {
    report += `| 优选经济舱 | ${VERSION_INFO[version].premium} 座 |\n`;
  }
  info += `| 经济舱 | ${VERSION_INFO[version].economy} 座 |\n`;
  report += `| 经济舱 | ${VERSION_INFO[version].economy} 座 |\n\n`;
  report += `## 分类统计\n\n`;
  report += `| 分类 | 图片数量 | 说明 |\n`;
  report += `|------|----------|------|\n`;
  for (const cat of CATEGORIES) {
    report += `| ${cat.id} | ${classification[cat.id].length} | ${cat.description} |\n`;
  }

  report += `\n## 详细文件列表\n\n`;
  for (const cat of CATEGORIES) {
    if (classification[cat.id].length > 0) {
      report += `\n### ${cat.id}\n\n`;
      report += `| 文件名 | 大小 (KB) | 分类理由 |\n`;
      report += `|--------|-----------|----------|\n`;
      for (const item of classification[cat.id]) {
        const sizeKB = (item.size / 1024).toFixed(1);
        report += `| ${item.original} | ${sizeKB} | ${item.reason} |\n`;
      }
    }
  }

  fs.writeFileSync(reportPath, report);
  console.log(`  分类完成：${JSON.stringify(Object.fromEntries(Object.entries(classification).map(([k, v]) => [k, v.length])))}`);

  return classification;
}

// 生成索引文件
function createIndex(results) {
  const indexPath = path.join(BASE_DIR, 'A330-300-versions-INDEX.md');
  let index = `# 国泰航空 A330-300 配置版本索引\n\n`;
  index += `A330-300 共有 6 种不同的舱位配置版本：\n\n`;
  index += `| 版本 | 总座位数 | 商务舱 | 优选经济 | 经济舱 | 图片数 | 目录 |\n`;
  index += `|------|----------|--------|----------|--------|--------|------|\n`;

  for (const version of VERSIONS) {
    const info = VERSION_INFO[version];
    const premium = info.premium || '-';
    const imgCount = results[version] ? Object.values(results[version]).reduce((a, b) => a + b.length, 0) : 0;
    index += `| ${version} | ${info.seats} | ${info.business} | ${premium} | ${info.economy} | ${imgCount} | [详情](A330-300%20${version}/) |\n`;
  }

  index += `\n## 分类体系\n\n`;
  index += `| 编号 | 分类名称 | 说明 |\n`;
  index += `|------|----------|------|\n`;
  for (const cat of CATEGORIES) {
    index += `| ${cat.id} | ${cat.description} |\n`;
  }

  index += `\n## 图片来源\n\n`;
  index += `所有图片来自 seatmaps.com 的 [国泰航空 A330-300 页面](https://seatmaps.com/zh-CN/airlines/cx-cathay-pacific/airbus-a330-300/)\n`;

  fs.writeFileSync(indexPath, index);
  console.log(`\n索引已保存：${indexPath}`);
}

function main() {
  console.log('='.repeat(60));
  console.log('国泰航空 A330-300 版本整理工具 v2');
  console.log('='.repeat(60));

  // 步骤 1: 清理旧目录
  cleanupOldDirs();

  // 步骤 2: 确保临时源目录存在
  const sourceDir = path.join(BASE_DIR, 'temp-source');
  if (!fs.existsSync(sourceDir)) {
    console.error(`错误：源目录不存在 ${sourceDir}`);
    console.log('请确保先将原始图片复制到 temp-source 目录');
    return;
  }

  // 步骤 3: 为每个版本创建分类
  const results = {};
  for (const version of VERSIONS) {
    results[version] = createVersion(version);
  }

  // 步骤 4: 生成索引
  createIndex(results);

  // 步骤 5: 清理临时目录
  if (fs.existsSync(sourceDir)) {
    fs.rmSync(sourceDir, { recursive: true, force: true });
    console.log('\n已清理临时目录');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ A330-300 版本整理完成!');
  console.log('='.repeat(60));
}

main();
