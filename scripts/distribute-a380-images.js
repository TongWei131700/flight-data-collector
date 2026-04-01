#!/usr/bin/env node

/**
 * 阿联酋航空 A380 图片分配工具
 * 将 2-座椅图片 分配到 V.1-V.10 版本目录
 */

const fs = require('fs');
const path = require('path');

const A380_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/阿联酋航空 EK/Airbus A380';

// 版本与 seatmap hash 的映射
const VERSION_MAP = {
  'V.1': 'dc1913d422398c25c5f0b81cab94cc87',
  'V.2': 'fe87435d12ef7642af67d9bc82a8b3cd',
  'V.3': 'aa6b7ad9d68bf3443c35d23de844463b',
  'V.4': 'f3ac63c91272f19ce97c7397825cc15f',
  'V.5': 'dacb283d1182b49af03528f6f02eccd7',
  'V.6': '01064f1de9dfcd9d77b14d11beefefd4',
  'V.7': 'd4ea5dacfff2d8a35c0952291779290d',
  'V.8': '719e427d3b21a35b8cdcd2d88db6ca11',
  'V.9': '5d7009220a974e94404889274d3a9553',
  'V.10': '823de42f619c837112209aa7a127c4af'
};

function distributeImages() {
  console.log('============================================================');
  console.log('阿联酋航空 A380 图片分配工具');
  console.log('============================================================\n');

  const rootImagesDir = path.join(A380_DIR, 'images/2-座椅图片');

  // 获取所有 2-座椅图片
  const allFiles = fs.readdirSync(rootImagesDir);
  console.log(`根目录共有 ${allFiles.length} 张 2-座椅图片\n`);

  // 按版本分配图片
  for (const [version, hash] of Object.entries(VERSION_MAP)) {
    const versionDir = path.join(A380_DIR, version, 'images/2-座椅图片');

    // 创建目录
    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir, { recursive: true });
    }

    // 找到属于这个版本的图片
    const versionFiles = allFiles.filter(f => f.includes(hash));

    console.log(`${version} (hash: ${hash.slice(0, 8)}...):`);
    console.log(`  找到 ${versionFiles.length} 张图片`);

    // 复制图片到版本目录
    for (const file of versionFiles) {
      const src = path.join(rootImagesDir, file);
      const dst = path.join(versionDir, file);
      fs.copyFileSync(src, dst);
    }

    console.log(`  已复制到 ${version}/images/2-座椅图片/\n`);
  }

  console.log('============================================================');
  console.log('图片分配完成！');
  console.log('============================================================\n');
}

distributeImages();
