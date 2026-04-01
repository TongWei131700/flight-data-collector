#!/usr/bin/env node

/**
 * 修复 0-原始数据 目录 - 确保所有分类图片在 0-原始数据 中都有副本
 *
 * SKILL.md 规则：0-原始数据 只追加、不删除，保存首次抓取的原始图片
 * 分类目录 (1-5) 是从 0-原始数据 复制/归类过去的
 *
 * 用法:
 * node fix-raw-data-dir.js                           # 修复所有航司
 * node fix-raw-data-dir.js --base-dir "FlightData/Emirates EK"
 */

const fs = require('fs');
const path = require('path');

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base-dir' && args[i + 1]) {
      return path.resolve(args[++i]);
    }
  }
  return null;
}

const CUSTOM_BASE_DIR = parseArgs();
const FLIGHT_DATA_ROOT = CUSTOM_BASE_DIR || '/Users/dengxinyang/Desktop/AI·Project/FlightData';

// 分类目录（需要复制到 0-原始数据 的）
const CATEGORIES_TO_COPY = [
  '1-座椅布局',
  '2-座椅图片',
  '3-机上餐食',
  '4-娱乐设备',
  '5-其他信息'
];

// 检查目录是否为有效的机型目录（包含 images 子目录）
function isValidAircraftDir(dirPath) {
  const imagesPath = path.join(dirPath, 'images');
  return fs.existsSync(imagesPath) && fs.statSync(imagesPath).isDirectory();
}

// 检查是否为版本目录（如 V.1, V.2 或 "A330-300 V.1"）
function isVersionDir(dirName) {
  return /^V\.\d+$/.test(dirName) || /V\.\d+$/.test(dirName);
}

// 修复单个机型目录（单类型或多类型）
function fixAircraftDir(aircraftDir) {
  const aircraftName = path.basename(aircraftDir);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`修复：${aircraftName}`);
  console.log(`${'='.repeat(60)}`);

  const items = fs.readdirSync(aircraftDir);
  const versionDirs = items.filter(isVersionDir).map(name => path.join(aircraftDir, name));

  if (versionDirs.length === 0) {
    // 单类型机型：直接修复根级 images
    fixImagesDir(path.join(aircraftDir, 'images'), aircraftName);
  } else {
    // 多类型机型：修复每个版本目录
    for (const versionDir of versionDirs) {
      const versionName = path.basename(versionDir);
      fixImagesDir(path.join(versionDir, 'images'), `${aircraftName}/${versionName}`);
    }
  }
}

// 修复 images 目录
function fixImagesDir(imagesDir, label) {
  if (!fs.existsSync(imagesDir)) {
    console.log(`  ${label}: ⚠️ images 目录不存在，跳过`);
    return;
  }

  const rawDir = path.join(imagesDir, '0-原始数据');

  // 确保 0-原始数据 目录存在
  if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true });
    console.log(`  ${label}: ✅ 创建 0-原始数据 目录`);
  }

  // 获取当前 0-原始数据 中已有的文件
  const existingRawFiles = new Set(fs.readdirSync(rawDir));

  let copiedCount = 0;

  // 从各分类目录复制文件到 0-原始数据
  for (const category of CATEGORIES_TO_COPY) {
    const catDir = path.join(imagesDir, category);

    if (!fs.existsSync(catDir)) {
      continue;
    }

    const files = fs.readdirSync(catDir)
      .filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));

    for (const file of files) {
      if (existingRawFiles.has(file)) {
        // 文件已在 0-原始数据 中，跳过
        continue;
      }

      const srcPath = path.join(catDir, file);
      const dstPath = path.join(rawDir, file);

      try {
        fs.copyFileSync(srcPath, dstPath);
        copiedCount++;
        existingRawFiles.add(file);
      } catch (error) {
        console.error(`    ❌ 复制失败：${file} - ${error.message}`);
      }
    }
  }

  if (copiedCount > 0) {
    console.log(`  ${label}: ✅ 已复制 ${copiedCount} 个文件到 0-原始数据`);
  } else {
    console.log(`  ${label}: ✓ 0-原始数据 已完整`);
  }

  // 显示最终统计
  const finalCount = fs.readdirSync(rawDir)
    .filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg')).length;
  console.log(`  ${label}: 📊 0-原始数据 总计 ${finalCount} 个文件`);
}

// 扫描并修复所有航司
function scanAndFix() {
  console.log('============================================================');
  console.log('0-原始数据 目录修复工具');
  console.log(`工作目录：${FLIGHT_DATA_ROOT}`);
  console.log('============================================================\n');

  const airlines = fs.readdirSync(FLIGHT_DATA_ROOT)
    .filter(name => {
      const dirPath = path.join(FLIGHT_DATA_ROOT, name);
      return fs.statSync(dirPath).isDirectory() && !name.startsWith('.');
    });

  for (const airline of airlines) {
    const airlineDir = path.join(FLIGHT_DATA_ROOT, airline);
    const aircraftList = fs.readdirSync(airlineDir)
      .filter(name => {
        const dirPath = path.join(airlineDir, name);
        return fs.statSync(dirPath).isDirectory() && isValidAircraftDir(dirPath);
      });

    if (aircraftList.length === 0) {
      continue;
    }

    console.log(`\n>>> ${airline}`);

    for (const aircraft of aircraftList) {
      const aircraftDir = path.join(airlineDir, aircraft);
      fixAircraftDir(aircraftDir);
    }
  }

  console.log('\n============================================================');
  console.log('✅ 所有机型修复完成！');
  console.log('============================================================\n');
}

// 主函数
function main() {
  if (CUSTOM_BASE_DIR) {
    // 修复指定目录
    fixAircraftDir(CUSTOM_BASE_DIR);
  } else {
    // 扫描所有航司
    scanAndFix();
  }
}

main();
