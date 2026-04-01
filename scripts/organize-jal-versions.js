#!/usr/bin/env node

/**
 * 日本航空多版本机型整理工具
 * 检测有多个座位图配置的机型，并整理到 V.1, V.2, V.3 等目录
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/日本航空 JL';

// 分类体系
const CATEGORIES = [
  '0-原始数据',
  '1-座椅布局',
  '2-座椅图片',
  '3-机上餐食',
  '4-娱乐设备',
  '5-其他信息'
];

// 从原始页面 HTML 中提取座位图 hash
function extractSeatmapHashes(htmlPath) {
  if (!fs.existsSync(htmlPath)) return [];
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const matches = html.match(/seatmaps\/([a-f0-9]{32})/g) || [];
  return [...new Set(matches.map(m => m.split('/')[1]))];
}

// 分析座位图对应的版本信息
function analyzeVersions(aircraftDir) {
  const htmlPath = path.join(aircraftDir, 'images/0-原始数据/原始页面.html');
  const hashes = extractSeatmapHashes(htmlPath);
  
  if (hashes.length <= 1) {
    return { isMultiVersion: false, versions: [] };
  }
  
  // 每个座位图 hash 代表一个版本
  const versions = hashes.map((hash, index) => ({
    hash,
    versionName: `V.${index + 1}`,
    seatmapFile: `${hash}.webp`
  }));
  
  return { isMultiVersion: true, versions };
}

// 整理单个机型
function organizeAircraft(aircraftName, aircraftDir) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`处理：${aircraftName}`);
  console.log('='.repeat(50));
  
  const analysis = analyzeVersions(aircraftDir);
  
  if (!analysis.isMultiVersion) {
    console.log(`  单版本机型，跳过`);
    return;
  }
  
  console.log(`  发现 ${analysis.versions.length} 个版本`);
  
  // 创建版本目录
  const imagesDir = path.join(aircraftDir, 'images');
  
  for (const version of analysis.versions) {
    const versionDir = path.join(aircraftDir, version.versionName);
    const versionImagesDir = path.join(versionDir, 'images');
    
    // 创建版本目录结构
    CATEGORIES.forEach(cat => {
      const catDir = path.join(versionImagesDir, cat);
      if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true });
      }
    });
    
    console.log(`  创建 ${version.versionName} 目录`);
    
    // 复制属于该版本的座位图
    const seatmapSrc = path.join(imagesDir, '1-座椅布局', version.seatmapFile);
    const seatmapDst = path.join(versionImagesDir, '1-座椅布局', version.seatmapFile);
    if (fs.existsSync(seatmapSrc)) {
      fs.copyFileSync(seatmapSrc, seatmapDst);
      console.log(`    - 复制座位图：${version.seatmapFile}`);
    }
  }
  
  // 复制公共图片（座椅图片、餐食、娱乐设备等）到所有版本
  const commonCategories = ['2-座椅图片', '3-机上餐食', '4-娱乐设备', '5-其他信息'];
  for (const version of analysis.versions) {
    const versionImagesDir = path.join(aircraftDir, version.versionName, 'images');
    for (const cat of commonCategories) {
      const srcDir = path.join(imagesDir, cat);
      const dstDir = path.join(versionImagesDir, cat);
      if (fs.existsSync(srcDir)) {
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcPath = path.join(srcDir, file);
          const dstPath = path.join(dstDir, file);
          if (!fs.existsSync(dstPath)) {
            fs.copyFileSync(srcPath, dstPath);
          }
        }
      }
    }
  }
  
  // 复制原始页面 HTML 到第一个版本
  const htmlSrc = path.join(imagesDir, '0-原始数据/原始页面.html');
  if (fs.existsSync(htmlSrc)) {
    const htmlDst = path.join(aircraftDir, analysis.versions[0].versionName, 'images/0-原始数据/原始页面.html');
    fs.copyFileSync(htmlSrc, htmlDst);
  }
  
  // 生成版本索引
  const indexContent = generateVersionIndex(aircraftName, analysis.versions);
  const indexPath = path.join(aircraftDir, '版本索引.md');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`  生成版本索引：版本索引.md`);
  
  // 重命名原始机型详情.md
  const oldDetailMd = path.join(aircraftDir, '机型详情.md');
  const newDetailMd = path.join(aircraftDir, '机型详情 - 原始.md');
  if (fs.existsSync(oldDetailMd)) {
    fs.renameSync(oldDetailMd, newDetailMd);
  }
}

// 生成版本索引
function generateVersionIndex(aircraftName, versions) {
  let md = `# ${aircraftName} 版本索引\n\n`;
  md += `该机型有 **${versions.length}** 种不同配置：\n\n`;
  md += `| 版本 | 说明 | 详情 |\n`;
  md += `|------|------|------|\n`;
  
  for (const version of versions) {
    md += `| [${version.versionName}](${version.versionName}/机型详情.md) | 配置 ${versions.indexOf(version) + 1} | [查看](${version.versionName}/完整内容整理.md) |\n`;
  }
  
  return md;
}

// 主函数
function main() {
  console.log('日本航空多版本机型整理工具');
  console.log('=' .repeat(60));
  
  const aircraftDirs = fs.readdirSync(BASE_DIR).filter(item => {
    const itemPath = path.join(BASE_DIR, item);
    return fs.statSync(itemPath).isDirectory() && !item.startsWith('V.') && !item.startsWith('.');
  });
  
  console.log(`检测到 ${aircraftDirs.length} 个机型`);
  
  for (const aircraftName of aircraftDirs) {
    const aircraftDir = path.join(BASE_DIR, aircraftName);
    organizeAircraft(aircraftName, aircraftDir);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('整理完成!');
}

main();
