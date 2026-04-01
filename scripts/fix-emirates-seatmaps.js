#!/usr/bin/env node

/**
 * 修复阿联酋航空 seatmap 文件映射
 * 将正确的 seatmap 文件分配到对应的 0-原始数据 和 1-座椅布局
 */

const fs = require('fs');
const path = require('path');

// 正确的 seatmap 映射（来自 seatmaps.com）
const SEATMAP_MAP = {
  'Airbus A380': {
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
  },
  'Airbus A350-900': {
    'V.1': 'aed8c38949e3efc60bb86697f5c07c98.webp',
    'V.2': 'd5c60496784f8d6c43344eb3bd18574b.webp'
  },
  'Boeing 777-200Lr': {
    'V.1': '4d85374a75c3ff7c040df577395ff7f9.webp',
    'V.2': 'fb647ca6672b0930e9d00dc384d8b16f.webp'
  },
  'Boeing 777-300Er': {
    'V.1': '06d86297d6e28d4637d60c86c2a2f5b6.webp',
    'V.2': '0d9d154fb5b905d3f6d606f8b6cbb750.webp',
    'V.3': '2d71b2ae158c7c5912cc0bbde2bb9d95.webp',
    'V.4': '76e2d26f0496e090a9ad7d94c3128e2a.webp',
    'V.5': '82836ca597a373e6c3cd5ae2d466161e.webp',
    'V.6': '829083d7452626f6e64b96ec0b734811.webp',
    'V.7': 'b2ab001909a8a6f04b51920306046ce5.webp',
    'V.8': 'c96e651946818e0787d6296f69549fe1.webp',
    'V.9': 'ebb1479b12e33aebadde5d35e3c5e3e4.webp'
  }
};

const BASE_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/Emirates EK';

function fixAircraft(aircraftName, versionMap) {
  const aircraftDir = path.join(BASE_DIR, aircraftName);
  const rootRawDir = path.join(aircraftDir, 'images', '0-原始数据');

  console.log(`\n============================================================`);
  console.log(`修复：${aircraftName}`);
  console.log(`============================================================`);

  // 检查根级 0-原始数据 是否有所有需要的文件
  const availableFiles = fs.readdirSync(rootRawDir);
  console.log(`根级 0-原始数据 文件数：${availableFiles.length}`);

  for (const [version, seatmapFile] of Object.entries(versionMap)) {
    const versionDir = path.join(aircraftDir, version);
    const rawDir = path.join(versionDir, 'images', '0-原始数据');
    const layoutDir = path.join(versionDir, 'images', '1-座椅布局');

    // 检查根级是否有这个文件
    if (!availableFiles.includes(seatmapFile)) {
      console.log(`  ${version}: ⚠️  根级缺少文件 ${seatmapFile}`);
      continue;
    }

    const srcPath = path.join(rootRawDir, seatmapFile);
    const rawDstPath = path.join(rawDir, seatmapFile);
    const layoutDstPath = path.join(layoutDir, seatmapFile);

    // 复制文件到 0-原始数据
    if (fs.existsSync(srcPath)) {
      // 删除旧文件（如果有）
      const oldFiles = fs.readdirSync(rawDir);
      for (const oldFile of oldFiles) {
        if (oldFile !== seatmapFile) {
          fs.unlinkSync(path.join(rawDir, oldFile));
        }
      }
      fs.copyFileSync(srcPath, rawDstPath);

      // 删除旧文件（如果有）
      const oldLayoutFiles = fs.readdirSync(layoutDir);
      for (const oldFile of oldLayoutFiles) {
        if (oldFile !== seatmapFile) {
          fs.unlinkSync(path.join(layoutDir, oldFile));
        }
      }
      fs.copyFileSync(srcPath, layoutDstPath);

      console.log(`  ${version}: ✅ ${seatmapFile}`);
    } else {
      console.log(`  ${version}: ❌ 源文件不存在`);
    }
  }
}

// 主函数
function main() {
  console.log('============================================================');
  console.log('阿联酋航空 seatmap 文件修复工具');
  console.log(`工作目录：${BASE_DIR}`);
  console.log('============================================================\n');

  for (const [aircraftName, versionMap] of Object.entries(SEATMAP_MAP)) {
    fixAircraft(aircraftName, versionMap);
  }

  console.log('\n============================================================');
  console.log('✅ 所有机型修复完成！');
  console.log('============================================================\n');
}

main();
