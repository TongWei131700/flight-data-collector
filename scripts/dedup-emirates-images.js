#!/usr/bin/env node

/**
 * 阿联酋航空 EK 图片去重工具
 *
 * 问题：
 * 1. 0-原始数据 与分类目录（1-座椅布局等）保存的是相同的图片文件
 * 2. A380 根目录与 V.1-V.10 版本目录也有重复
 *
 * 解决方案：
 * - 0-原始数据 应该保存原始爬取的图片（hash 文件名）
 * - 分类目录应该只保存图片的引用或移动（而非复制）
 * - 或者：删除 0-原始数据 中的重复文件，仅保留分类目录
 *
 * 根据 skill 规范：0-原始数据 只追加、不删除
 * 所以我们应该：删除分类目录中与 0-原始数据 重复的文件
 *
 * 但实际上：分类目录的图片和 0-原始数据 是同一份文件（硬链接或复制）
 * 正确做法：分类目录应该是符号链接，或者 0-原始数据 只保存未分类的图片
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/阿联酋航空 EK';

const AIRCRAFT = [
  'Airbus A350-900',
  'Airbus A380',
  'Boeing 777-200Lr',
  'Boeing 777-300Er'
];

const CATEGORIES = [
  '0-原始数据',
  '1-座椅布局',
  '2-座椅图片',
  '3-机上餐食',
  '4-娱乐设备',
  '5-其他信息'
];

function findDuplicates() {
  console.log('============================================================');
  console.log('阿联酋航空 EK 图片去重工具');
  console.log('============================================================\n');

  for (const aircraft of AIRCRAFT) {
    const aircraftDir = path.join(BASE_DIR, aircraft);
    if (!fs.existsSync(aircraftDir)) continue;

    console.log(`\n=== 检查：${aircraft} ===\n`);

    // 检查根目录图片
    const imagesDir = path.join(aircraftDir, 'images');
    checkDirectory(imagesDir, aircraft);

    // 检查版本目录（A380）
    for (let v = 1; v <= 10; v++) {
      const versionDir = path.join(aircraftDir, `V.${v}`);
      if (fs.existsSync(versionDir)) {
        const versionImagesDir = path.join(versionDir, 'images');
        checkDirectory(versionImagesDir, `${aircraft}/${v}`);
      }
    }
  }
}

function checkDirectory(imagesDir, label) {
  if (!fs.existsSync(imagesDir)) return;

  // 收集所有文件 hash
  const fileHashes = new Map(); // hash -> [{category, filename, path}]
  const duplicates = [];

  for (const cat of CATEGORIES) {
    const catDir = path.join(imagesDir, cat);
    if (!fs.existsSync(catDir)) continue;

    const files = fs.readdirSync(catDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.webp', '.png', '.jpg', '.jpeg', '.gif'].includes(ext)) continue;

      const hash = path.basename(file, ext);
      const filePath = path.join(catDir, file);

      if (fileHashes.has(hash)) {
        // 发现重复
        const existing = fileHashes.get(hash);
        duplicates.push({
          hash,
          files: [...existing, { category: cat, filename: file, path: filePath }]
        });
        fileHashes.delete(hash); // 避免重复报告
      } else {
        fileHashes.set(hash, [{ category: cat, filename: file, path: filePath }]);
      }
    }
  }

  if (duplicates.length > 0) {
    console.log(`  发现 ${duplicates.length} 组重复文件:`);
    for (const dup of duplicates.slice(0, 10)) {
      const locations = dup.files.map(f => `${f.category}/${f.filename}`).join(' = ');
      console.log(`    ${dup.hash}: ${locations}`);
    }
    if (duplicates.length > 10) {
      console.log(`    ... 还有 ${duplicates.length - 10} 组`);
    }
    console.log('');
  } else {
    console.log('  ✅ 无重复文件');
  }
}

function removeDuplicates() {
  console.log('\n============================================================');
  console.log('开始去重处理');
  console.log('============================================================\n');

  // A380 特殊处理：根目录与版本目录重复
  const a380Dir = path.join(BASE_DIR, 'Airbus A380');

  console.log('处理 Airbus A380 根目录与版本目录的重复...\n');

  // 根目录的 0-原始数据 和 1-座椅布局 中的文件对应不同版本
  // 应该删除根目录中已分配到版本目录的重复文件

  const rootRawDir = path.join(a380Dir, 'images/0-原始数据');
  const rootSeatmapDir = path.join(a380Dir, 'images/1-座椅布局');

  // 版本映射
  const versionMap = {
    'V.1': 'dc1913d422398c25c5f0b81cab94cc87.webp',
    'V.2': 'fe87435d12ef7642af67d9bc82a8b3cd.webp',
    'V.3': 'aa6b7ad9d68bf3443c35d23de844463b.webp',
    'V.4': 'f3ac63c91272f19ce97c7397825cc15f.webp',
    'V.5': 'dacb283d1182b49af03528f6f02eccd7.webp',
    'V.6': '01064f1de9dfcd9d77b14d11beefefd4.webp',
    'V.7': 'd4ea5dacfff2d8a35c0952291779290d.webp',
    'V.8': '719e427d3b21a35b8cdcd2d88db6ca11.webp',
    'V.9': '5d7009220a974e94404889274d3a9553.webp',
    'V.10': '823de42f619c837112209aa7a127c4af.webp'
  };

  // 删除根目录中已分配到版本目录的文件
  let deletedCount = 0;

  // 删除根目录 0-原始数据 中已分配的文件
  if (fs.existsSync(rootRawDir)) {
    for (const [version, filename] of Object.entries(versionMap)) {
      const filePath = path.join(rootRawDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`  删除：Airbus A380/images/0-原始数据/${filename} (已存在于 ${version}/)`);
        deletedCount++;
      }
    }
  }

  // 删除根目录 1-座椅布局 中已分配的文件
  if (fs.existsSync(rootSeatmapDir)) {
    for (const [version, filename] of Object.entries(versionMap)) {
      const filePath = path.join(rootSeatmapDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`  删除：Airbus A380/images/1-座椅布局/${filename} (已存在于 ${version}/)`);
        deletedCount++;
      }
    }
  }

  console.log(`\n  共删除 ${deletedCount} 张重复图片\n`);

  // 其他机型：删除 0-原始数据 中与分类目录重复的文件
  console.log('处理其他机型的 0-原始数据 重复...\n');

  for (const aircraft of ['Airbus A350-900', 'Boeing 777-200Lr', 'Boeing 777-300Er']) {
    const aircraftDir = path.join(BASE_DIR, aircraft);
    if (!fs.existsSync(aircraftDir)) continue;

    const imagesDir = path.join(aircraftDir, 'images');
    const rawDir = path.join(imagesDir, '0-原始数据');

    if (!fs.existsSync(rawDir)) continue;

    const rawFiles = fs.readdirSync(rawDir);
    let deletedInAircraft = 0;

    for (const file of rawFiles) {
      const ext = path.extname(file).toLowerCase();
      if (!['.webp', '.png', '.jpg', '.jpeg', '.gif'].includes(ext)) continue;

      const hash = path.basename(file, ext);

      // 检查是否在分类目录中已存在
      let foundInCategory = false;
      for (const cat of ['1-座椅布局', '2-座椅图片', '3-机上餐食', '4-娱乐设备', '5-其他信息']) {
        const catDir = path.join(imagesDir, cat);
        if (!fs.existsSync(catDir)) continue;

        const catFiles = fs.readdirSync(catDir);
        for (const catFile of catFiles) {
          const catHash = path.basename(catFile, path.extname(catFile));
          if (catHash === hash) {
            foundInCategory = true;
            break;
          }
        }
        if (foundInCategory) break;
      }

      if (foundInCategory) {
        fs.unlinkSync(path.join(rawDir, file));
        console.log(`  删除：${aircraft}/images/0-原始数据/${file} (已存在于分类目录)`);
        deletedInAircraft++;
        deletedCount++;
      }
    }

    if (deletedInAircraft > 0) {
      console.log(`  ${aircraft}: 删除 ${deletedInAircraft} 张重复图片\n`);
    }
  }

  console.log(`\n============================================================`);
  console.log(`去重完成！共删除 ${deletedCount} 张重复图片`);
  console.log(`============================================================\n`);
}

// 运行
findDuplicates();
console.log('\n');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('是否执行去重？(y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    removeDuplicates();
  } else {
    console.log('取消去重操作');
  }
  rl.close();
});
