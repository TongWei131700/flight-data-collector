#!/usr/bin/env node

/**
 * 检查 0-原始数据 目录是否包含所有分类目录文件的副本
 */

const fs = require('fs');
const path = require('path');

const FLIGHT_DATA_ROOT = '/Users/dengxinyang/Desktop/AI·Project/FlightData';
const CATEGORIES = ['1-座椅布局', '2-座椅图片', '3-机上餐食', '4-娱乐设备', '5-其他信息'];

function checkDirectory(imagesDir) {
  const rawDir = path.join(imagesDir, '0-原始数据');

  if (!fs.existsSync(rawDir)) {
    return;
  }

  const rawFiles = new Set(fs.readdirSync(rawDir));
  let missingCount = 0;

  for (const cat of CATEGORIES) {
    const catDir = path.join(imagesDir, cat);
    if (!fs.existsSync(catDir)) {
      continue;
    }

    const files = fs.readdirSync(catDir)
      .filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));

    for (const file of files) {
      if (!rawFiles.has(file)) {
        console.log(`缺失：${imagesDir}/${cat}/${file}`);
        missingCount++;
      }
    }
  }

  return missingCount;
}

function scanDirectory(dirPath, relativePath = '') {
  const items = fs.readdirSync(dirPath);
  let totalMissing = 0;

  for (const item of items) {
    if (item.startsWith('.')) continue;

    const itemPath = path.join(dirPath, item);
    const relPath = path.join(relativePath, item);

    if (!fs.statSync(itemPath).isDirectory()) {
      continue;
    }

    // 检查是否为 images 目录
    if (item === 'images' && fs.existsSync(itemPath)) {
      const missing = checkDirectory(itemPath);
      if (missing > 0) {
        totalMissing += missing;
      }
    } else {
      // 递归扫描子目录
      totalMissing += scanDirectory(itemPath, relPath);
    }
  }

  return totalMissing;
}

function main() {
  console.log('============================================================');
  console.log('检查 0-原始数据 目录完整性');
  console.log(`工作目录：${FLIGHT_DATA_ROOT}`);
  console.log('============================================================\n');

  const totalMissing = scanDirectory(FLIGHT_DATA_ROOT);

  console.log('\n============================================================');
  if (totalMissing === 0) {
    console.log('✅ 所有分类目录的文件在 0-原始数据 中都有副本！');
  } else {
    console.log(`⚠️  发现 ${totalMissing} 个文件缺失，需要修复`);
  }
  console.log('============================================================\n');
}

main();
