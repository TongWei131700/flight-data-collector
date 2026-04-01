#!/usr/bin/env node

/**
 * 国泰航空飞机图片 - 迁移原始数据并重新分类 v2
 * 分类体系：
 * - 0-原始数据：从航司官网爬取的原始图片
 * - 1-座椅布局：座位图、舱位布局平面图
 * - 2-座椅图片：座椅实物照片
 * - 3-机上餐食：餐食、饮品图片
 * - 4-娱乐设备：IFE 屏幕、USB 端口等设备
 * - 5-其他信息：logo、图标、外观等
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/国泰航空 CX';

const AIRCRAFT_TYPES = [
  'B777-300',
  'B777-300ER',
  'A321neo',
  'A330-300',
  'A350-1000',
  'A350-900'
];

const CATEGORIES = [
  { id: '0-原始数据', description: '从航司官网爬取的原始图片' },
  { id: '1-座椅布局', description: '座位图、舱位布局平面图' },
  { id: '2-座椅图片', description: '座椅实物照片（商务舱、经济舱等）' },
  { id: '3-机上餐食', description: '餐食、饮品、菜单图片' },
  { id: '4-娱乐设备', description: 'IFE 屏幕、USB 端口、WiFi 等设备' },
  { id: '5-其他信息', description: 'logo、图标、外观等其他图片' }
];

// 基于图片序号和文件特征的分类规则
function classifyImage(filename, size, ext) {
  const match = filename.match(/^(\d+)-/);
  const index = match ? parseInt(match[1]) : -1;

  // 00-完整页面.png = 5-其他信息
  if (filename.includes('完整页面')) {
    return { category: '5-其他信息', reason: '完整页面截图' };
  }

  // 01-image.png = logo
  if (index === 1 && ext === 'png' && size < 10000) {
    return { category: '5-其他信息', reason: '航空公司 logo' };
  }

  // 02-image.svg = 信息图标
  if (index === 2 && ext === 'svg') {
    return { category: '5-其他信息', reason: '信息图标' };
  }

  // 03-image.webp (大) = 座椅布局图
  if (index === 3 && ext === 'webp' && size > 80000) {
    return { category: '1-座椅布局', reason: '座椅布局平面图' };
  }

  // 04-08 SVG = 功能图标
  if (index >= 4 && index <= 8 && ext === 'svg') {
    return { category: '5-其他信息', reason: '功能图标' };
  }

  // 09-12 webp = 座椅图片
  if (index >= 9 && index <= 12 && ext === 'webp') {
    return { category: '2-座椅图片', reason: '座椅细节图片' };
  }

  // 13-image.webp (大) = 座椅布局图
  if (index === 13 && ext === 'webp' && size > 80000) {
    return { category: '1-座椅布局', reason: '座椅布局平面图' };
  }

  // 14-17 webp = 座椅图片
  if (index >= 14 && index <= 17 && ext === 'webp') {
    return { category: '2-座椅图片', reason: '座椅或舱位图片' };
  }

  // 18-image.webp (大) = 座椅实物大图
  if (index === 18 && ext === 'webp' && size > 80000) {
    return { category: '2-座椅图片', reason: '座椅实物大图' };
  }

  // 19-22 = 娱乐设备
  if (index >= 19 && index <= 22 && ext === 'webp') {
    return { category: '4-娱乐设备', reason: '机上设备图片' };
  }

  // 23-image.svg = 图标
  if (index === 23 && ext === 'svg') {
    return { category: '5-其他信息', reason: '图标' };
  }

  return { category: '5-其他信息', reason: '待确认' };
}

function processAircraft(aircraftType) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`处理机型：${aircraftType}`);
  console.log('='.repeat(50));

  const oldSourceDir = path.join(BASE_DIR, aircraftType, 'images', '01-机型信息');
  const newSourceDir = path.join(BASE_DIR, aircraftType, 'images', '0-原始数据');

  // 创建所有目标目录
  const targetDirs = CATEGORIES.map(c => path.join(BASE_DIR, aircraftType, 'images', c.id));
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // 检查旧源目录
  if (!fs.existsSync(oldSourceDir)) {
    console.log(`⚠️ 旧源目录不存在：${oldSourceDir}`);
    return null;
  }

  // 迁移所有图片到 0-原始数据
  const files = fs.readdirSync(oldSourceDir);
  const images = files.filter(f => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f));

  console.log(`从 01-机型信息 迁移 ${images.length} 张图片到 0-原始数据`);

  for (const image of images) {
    const srcPath = path.join(oldSourceDir, image);
    const dstPath = path.join(newSourceDir, image);
    try {
      fs.copyFileSync(srcPath, dstPath);
    } catch (error) {
      console.error(`复制失败：${image} - ${error.message}`);
    }
  }

  // 现在分类
  const classification = {};
  for (const cat of CATEGORIES) {
    classification[cat.id] = [];
  }

  // 分类每张图片
  for (const image of images) {
    const imagePath = path.join(newSourceDir, image);
    const stats = fs.statSync(imagePath);
    const ext = path.extname(image).toLowerCase().replace('.', '');

    const result = classifyImage(image, stats.size, ext);
    classification[result.category].push({
      original: image,
      newPath: image,
      reason: result.reason,
      size: stats.size
    });
  }

  // 输出分类结果
  console.log('\n分类结果:');
  for (const cat of CATEGORIES) {
    console.log(`  ${cat.id}: ${classification[cat.id].length} 张`);
  }

  // 复制图片到对应目录（除了原始数据）
  for (const cat of CATEGORIES) {
    if (cat.id === '0-原始数据') continue;

    const targetDir = path.join(BASE_DIR, aircraftType, 'images', cat.id);
    for (const item of classification[cat.id]) {
      const srcPath = path.join(newSourceDir, item.original);
      const dstPath = path.join(targetDir, item.original);
      try {
        fs.copyFileSync(srcPath, dstPath);
      } catch (error) {
        console.error(`复制失败：${item.original} - ${error.message}`);
      }
    }
  }

  // 保存详细报告
  const reportPath = path.join(BASE_DIR, aircraftType, 'images', 'classification-report-v2.md');
  let report = `# ${aircraftType} 图片分类报告 (v2)\n\n`;
  report += `生成时间：${new Date().toLocaleString('zh-CN')}\n\n`;
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

function main() {
  console.log('=' .repeat(60));
  console.log('国泰航空飞机图片分类工具 v2');
  console.log('迁移原始数据并重新分类');
  console.log('=' .repeat(60));

  const results = {};

  for (const aircraft of AIRCRAFT_TYPES) {
    try {
      results[aircraft] = processAircraft(aircraft);
    } catch (error) {
      console.error(`处理 ${aircraft} 时出错：${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ 所有处理完成!\n');

  // 生成汇总报告
  const summaryPath = path.join(BASE_DIR, '图片分类汇总-v2.md');
  let summary = `# 国泰航空飞机图片分类汇总 (v2)\n\n`;
  summary += `生成时间：${new Date().toLocaleString('zh-CN')}\n\n`;
  summary += `## 分类体系说明\n\n`;
  summary += `| 编号 | 分类名称 | 说明 |\n`;
  summary += `|------|----------|------|\n`;
  for (const cat of CATEGORIES) {
    summary += `| ${cat.id} | ${cat.description} |\n`;
  }

  summary += `\n## 各机型分类统计\n\n`;
  summary += `| 机型 | 0-原始数据 | 1-座椅布局 | 2-座椅图片 | 3-机上餐食 | 4-娱乐设备 | 5-其他信息 | 总计 |\n`;
  summary += `|------|-------------|-------------|-------------|-------------|-------------|------|\n`;

  for (const [aircraft, classification] of Object.entries(results)) {
    const counts = {};
    let total = 0;
    for (const cat of CATEGORIES) {
      counts[cat.id] = classification ? classification[cat.id].length : 0;
      total += counts[cat.id];
    }
    summary += `| ${aircraft} | ${counts['0-原始数据']} | ${counts['1-座椅布局']} | ${counts['2-座椅图片']} | ${counts['3-机上餐食']} | ${counts['4-娱乐设备']} | ${counts['5-其他信息']} | ${total} |\n`;
  }

  fs.writeFileSync(summaryPath, summary);
  console.log(`汇总报告：${summaryPath}\n`);
}

main();
