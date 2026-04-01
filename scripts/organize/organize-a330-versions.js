#!/usr/bin/env node

/**
 * 国泰航空 A330-300 版本整理工具
 * 将 A330-300 的图片按照 6 个配置版本 (V.1-V.6) 进行组织
 *
 * A330-300 版本信息:
 * - V.1: 39 商务 +223 经济 =262 座
 * - V.2: 24 商务 +293 经济 =317 座
 * - V.3: 28 商务 +265 经济 =293 座
 * - V.4: 42 商务 +265 经济 =307 座
 * - V.5: 39 商务 +21 优选经济 +191 经济 =251 座
 * - V.6: 50 商务 +230 经济 =280 座
 *
 * 图片分组逻辑 (基于 30 张图片):
 * - 01-02: logo 和图标 (共用)
 * - 03: 主座位布局图 (可能是 V.1)
 * - 04-08: 功能图标 (共用)
 * - 09-12: 座椅细节图片
 * - 13: 座位布局图 (可能是 V.2)
 * - 14-18: 座椅细节/额外视角
 * - 19: 座位布局图 (可能是 V.3)
 * - 20-23: 设备/其他图片
 * - 24: 座位布局图 (可能是 V.4)
 * - 25-28: 设备/其他图片
 * - 29: 座位布局图 (可能是 V.5/V.6)
 * - 30: 图标
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

  // 03 = 主座椅布局图
  if (index === 3 && ext === 'webp') {
    return { category: '1-座椅布局', reason: '座椅布局平面图（主图）' };
  }

  if (index >= 4 && index <= 8 && ext === 'svg') {
    return { category: '5-其他信息', reason: '功能图标' };
  }

  if (index >= 9 && index <= 12 && ext === 'webp') {
    return { category: '2-座椅图片', reason: '座椅细节图片' };
  }

  // 13 = 副座椅布局图
  if (index === 13 && ext === 'webp') {
    return { category: '1-座椅布局', reason: '座椅布局平面图（副图）' };
  }

  // 14-17: 根据大小判断
  if (index >= 14 && index <= 17 && ext === 'webp') {
    if (size > 50000) {
      return { category: '1-座椅布局', reason: '座椅布局平面图（大文件）' };
    }
    return { category: '2-座椅图片', reason: '座椅或舱位图片' };
  }

  // 18: 根据大小判断
  if (index === 18 && ext === 'webp') {
    if (size > 50000) {
      return { category: '1-座椅布局', reason: '座椅布局平面图' };
    }
    return { category: '2-座椅图片', reason: '座椅实物图片' };
  }

  // 19-22: 根据大小判断
  if (index >= 19 && index <= 22 && ext === 'webp') {
    if (size > 50000) {
      return { category: '1-座椅布局', reason: '座椅布局平面图（大文件）' };
    }
    return { category: '4-娱乐设备', reason: '机上设备图片' };
  }

  // 23-29: 根据大小判断
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

// 为主版本（V.1）创建完整分类
function processMainVersion() {
  console.log('\n' + '='.repeat(50));
  console.log('处理主版本：A330-300 V.1');
  console.log('='.repeat(50));

  const sourceDir = path.join(BASE_DIR, 'images', '0-原始数据');
  const versionDir = path.join(BASE_DIR, 'A330-300 V.1', 'images');

  // 创建目录结构
  const targetDirs = CATEGORIES.map(c => path.join(versionDir, c.id));
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // 读取源目录
  if (!fs.existsSync(sourceDir)) {
    console.log(`⚠️ 源目录不存在：${sourceDir}`);
    return null;
  }

  const files = fs.readdirSync(sourceDir);
  const images = files.filter(f => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f));
  console.log(`找到 ${images.length} 张图片`);

  // 首先复制所有图片到 0-原始数据
  const originalDataDir = path.join(versionDir, '0-原始数据');
  for (const image of images) {
    const srcPath = path.join(sourceDir, image);
    const dstPath = path.join(originalDataDir, image);
    try {
      fs.copyFileSync(srcPath, dstPath);
    } catch (error) {
      console.error(`复制失败：${image} - ${error.message}`);
    }
  }
  console.log(`已复制 ${images.length} 张图片到 0-原始数据`);

  const classification = {};
  for (const cat of CATEGORIES) {
    classification[cat.id] = [];
  }

  // 分类每张图片
  for (const image of images) {
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

  // 输出分类结果
  console.log('\n分类结果:');
  for (const cat of CATEGORIES) {
    console.log(`  ${cat.id}: ${classification[cat.id].length} 张`);
  }

  // 复制图片到对应目录（除了 0-原始数据）
  for (const cat of CATEGORIES) {
    if (cat.id === '0-原始数据') continue;

    const targetDir = path.join(versionDir, cat.id);
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
  const infoPath = path.join(BASE_DIR, 'A330-300 V.1', '版本信息.md');
  let info = `# A330-300 V.1 配置信息\n\n`;
  info += `| 项目 | 数值 |\n`;
  info += `|------|------|\n`;
  info += `| 总座位数 | ${VERSION_INFO['V.1'].seats} |\n`;
  info += `| 商务舱 | ${VERSION_INFO['V.1'].business} 座 |\n`;
  info += `| 经济舱 | ${VERSION_INFO['V.1'].economy} 座 |\n`;
  info += `| 布局 | ${VERSION_INFO['V.1'].layout} |\n`;
  fs.writeFileSync(infoPath, info);

  // 保存详细报告
  const reportPath = path.join(versionDir, 'classification-report.md');
  let report = `# A330-300 V.1 图片分类报告\n\n`;
  report += `生成时间：${new Date().toLocaleString('zh-CN')}\n\n`;
  report += `## 版本配置\n\n`;
  report += `| 项目 | 数值 |\n`;
  report += `|------|------|\n`;
  report += `| 总座位数 | ${VERSION_INFO['V.1'].seats} |\n`;
  report += `| 商务舱 | ${VERSION_INFO['V.1'].business} 座 |\n`;
  report += `| 经济舱 | ${VERSION_INFO['V.1'].economy} 座 |\n\n`;
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
  console.log(`报告已保存：${reportPath}`);

  return classification;
}

// 为其他版本创建简化结构（共用图片）
function createOtherVersions() {
  for (const version of VERSIONS) {
    if (version === 'V.1') continue;

    console.log(`\n创建：A330-300 ${version}`);

    const versionDir = path.join(BASE_DIR, `A330-300 ${version}`, 'images');
    const sourceDir = path.join(BASE_DIR, 'images', '0-原始数据');

    // 创建目录结构
    const targetDirs = CATEGORIES.map(c => path.join(versionDir, c.id));
    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // 复制所有原始图片
    const files = fs.readdirSync(sourceDir)
      .filter(f => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f));

    for (const file of files) {
      const srcPath = path.join(sourceDir, file);
      const dstPath = path.join(versionDir, '0-原始数据', file);
      fs.copyFileSync(srcPath, dstPath);
    }

    // 保存版本信息
    const infoPath = path.join(BASE_DIR, `A330-300 ${version}`, '版本信息.md');
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

    console.log(`  已创建目录和版本信息`);
  }
}

// 生成 A330-300 索引文件
function createIndex() {
  const indexPath = path.join(BASE_DIR, 'A330-300-versions-INDEX.md');
  let index = `# 国泰航空 A330-300 配置版本索引\n\n`;
  index += `A330-300 共有 6 种不同的舱位配置版本：\n\n`;
  index += `| 版本 | 总座位数 | 商务舱 | 优选经济 | 经济舱 | 目录 |\n`;
  index += `|------|----------|--------|----------|--------|------|\n`;

  for (const version of VERSIONS) {
    const info = VERSION_INFO[version];
    const premium = info.premium || '-';
    index += `| ${version} | ${info.seats} | ${info.business} | ${premium} | ${info.economy} | [详情](A330-300%20${version}/) |\n`;
  }

  index += `\n## 图片来源\n\n`;
  index += `所有图片来自 seatmaps.com 的 [国泰航空 A330-300 页面](https://seatmaps.com/zh-CN/airlines/cx-cathay-pacific/airbus-a330-300/)\n`;

  fs.writeFileSync(indexPath, index);
  console.log(`\n索引已保存：${indexPath}`);
}

function main() {
  console.log('='.repeat(60));
  console.log('国泰航空 A330-300 版本整理工具');
  console.log('='.repeat(60));

  // 处理主版本
  processMainVersion();

  // 创建其他版本
  createOtherVersions();

  // 生成索引
  createIndex();

  console.log('\n' + '='.repeat(60));
  console.log('✅ A330-300 版本整理完成!');
  console.log('='.repeat(60));
}

main();
