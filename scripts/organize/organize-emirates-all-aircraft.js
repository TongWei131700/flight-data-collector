#!/usr/bin/env node

/**
 * 阿联酋航空所有机型多版本整理工具
 * 处理：A350-900 (2 类型), A380 (10 类型), 777-200LR (2 类型), 777-300ER (9 类型)
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/Emirates EK';

// 机型配置
const AIRCRAFT_CONFIG = {
  'Airbus A350-900': {
    versions: {
      'V.1': { seats: 312, config: '32 商务舱，21 优选经济舱，259 经济舱' },
      'V.2': { seats: 298, config: '32 商务舱，28 优选经济舱，238 经济舱' }
    },
    seatmapFiles: {
      // 需要从原始数据中识别
    }
  },
  'Airbus A380': {
    versions: {
      'V.1': { seats: 484, config: '14 头等舱，76 商务舱，56 优选经济舱，338 经济舱' },
      'V.2': { seats: 519, config: '14 头等舱，76 商务舱，429 经济舱' },
      'V.3': { seats: 517, config: '14 头等舱，76 商务舱，427 经济舱' },
      'V.4': { seats: 489, config: '14 头等舱，76 商务舱，399 经济舱' },
      'V.5': { seats: 491, config: '14 头等舱，76 商务舱，401 经济舱' },
      'V.6': { seats: 615, config: '58 商务舱，557 经济舱' },
      'V.7': { seats: 516, config: '14 头等舱，76 商务舱，426 经济舱' },
      'V.8': { seats: 487, config: '14 头等舱，76 商务舱，56 优选经济舱，341 经济舱' },
      'V.9': { seats: 468, config: '14 头等舱，76 商务舱，56 优选经济舱，322 经济舱' },
      'V.10': { seats: 569, config: '76 商务舱，56 优选经济舱，437 经济舱' }
    }
  },
  'Boeing 777-200Lr': {
    versions: {
      'V.1': { seats: 302, config: '38 商务舱，264 经济舱' },
      'V.2': { seats: 276, config: '38 商务舱，24 优选经济舱，214 经济舱' }
    }
  },
  'Boeing 777-300Er': {
    versions: {
      'V.1': { seats: 360, config: '8 头等舱，42 商务舱，310 经济舱' },
      'V.2': { seats: 354, config: '8 头等舱，42 商务舱，304 经济舱' },
      'V.3': { seats: 428, config: '42 商务舱，386 经济舱' },
      'V.4': { seats: 356, config: '8 头等舱，42 商务舱，306 经济舱' },
      'V.5': { seats: 354, config: '6 头等舱，42 商务舱，306 经济舱' },
      'V.6': { seats: 324, config: '6 头等舱，38 商务舱，24 优选经济舱，256 经济舱' },
      'V.7': { seats: 328, config: '8 头等舱，40 商务舱，24 优选经济舱，256 经济舱' },
      'V.8': { seats: 421, config: '35 商务舱，386 经济舱' },
      'V.9': { seats: 332, config: '8 头等舱，40 商务舱，24 优选经济舱，260 经济舱' }
    }
  }
};

// 分类目录
const CATEGORIES = [
  '0-原始数据',
  '1-座椅布局',
  '2-座椅图片',
  '3-机上餐食',
  '4-娱乐设备',
  '5-其他信息'
];

function createVersionStructure(aircraftName, versions) {
  const aircraftDir = path.join(BASE_DIR, aircraftName);
  const imagesDir = path.join(aircraftDir, 'images');
  const rawDir = path.join(imagesDir, '0-原始数据');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`处理机型：${aircraftName}`);
  console.log(`${'='.repeat(60)}`);

  // 检查原始数据目录
  if (!fs.existsSync(rawDir)) {
    console.log(`  ⚠️  原始数据目录不存在：${rawDir}`);
    return;
  }

  // 获取所有原始数据文件
  const rawFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
  console.log(`  📁 原始数据文件数：${rawFiles.length}`);

  const versionKeys = Object.keys(versions);

  // 策略：将原始数据平均分配到各个版本
  // 对于 seatmap 文件（32 位 hex 文件名），按顺序分配
  const seatmapFiles = rawFiles.filter(f => /^[a-f0-9]{32}\./.test(f));
  const otherFiles = rawFiles.filter(f => !/^[a-f0-9]{32}\./.test(f));

  console.log(`  📊 Seatmap 文件：${seatmapFiles.length}, 其他文件：${otherFiles.length}`);

  // 为每个版本创建目录结构
  for (let i = 0; i < versionKeys.length; i++) {
    const version = versionKeys[i];
    const versionDir = path.join(aircraftDir, version);
    const versionImagesDir = path.join(versionDir, 'images');
    const info = versions[version];

    console.log(`\n  --- 处理 ${version} ---`);

    // 创建版本目录
    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir, { recursive: true });
      console.log(`    ✅ 创建目录：${version}`);
    }

    // 创建 images 和分类子目录
    for (const cat of CATEGORIES) {
      const catDir = path.join(versionImagesDir, cat);
      if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true });
        console.log(`    ✅ 创建分类目录：${cat}`);
      }
    }

    // 分配 seatmap 文件到 1-座椅布局 和 0-原始数据
    if (seatmapFiles.length > 0) {
      // 按版本数量平均分配 seatmap 文件
      const filesPerVersion = Math.ceil(seatmapFiles.length / versionKeys.length);
      const startIdx = i * filesPerVersion;
      const endIdx = Math.min(startIdx + filesPerVersion, seatmapFiles.length);
      const assignedFiles = seatmapFiles.slice(startIdx, endIdx);

      for (const file of assignedFiles) {
        const src = path.join(rawDir, file);
        const dstLayout = path.join(versionImagesDir, '1-座椅布局', file);
        const dstRaw = path.join(versionImagesDir, '0-原始数据', file);

        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dstLayout);
          fs.copyFileSync(src, dstRaw);
        }
      }
      console.log(`    ✅ 复制 ${assignedFiles.length} 个 seatmap 文件`);
    }

    // 复制其他文件（餐食、娱乐等）到所有版本
    // 这些文件通常是共享的
    for (const file of otherFiles) {
      const src = path.join(rawDir, file);
      // 根据文件名关键词分类
      let targetCat = '0-原始数据';
      const fileLower = file.toLowerCase();

      if (fileLower.includes('food') || fileLower.includes('meal') || fileLower.includes('dining') || fileLower.includes('菜单')) {
        targetCat = '3-机上餐食';
      } else if (fileLower.includes('entertainment') || fileLower.includes('screen') || fileLower.includes('ife') || fileLower.includes('wifi')) {
        targetCat = '4-娱乐设备';
      } else if (fileLower.includes('logo') || fileLower.includes('exterior') || fileLower.includes('外观')) {
        targetCat = '5-其他信息';
      } else if (fileLower.includes('seat') || fileLower.includes('business') || fileLower.includes('economy') || fileLower.includes('first') || fileLower.includes('suite')) {
        targetCat = '2-座椅图片';
      }

      if (targetCat !== '0-原始数据') {
        const dst = path.join(versionImagesDir, targetCat, file);
        if (fs.existsSync(src) && !fs.existsSync(dst)) {
          fs.copyFileSync(src, dst);
        }
      }
    }
    if (otherFiles.length > 0) {
      console.log(`    ✅ 复制 ${otherFiles.length} 个其他文件到分类目录`);
    }

    // 生成机型详情.md
    const mdContent = generateMarkdown(aircraftName, version, info);
    const mdPath = path.join(versionDir, '机型详情.md');
    fs.writeFileSync(mdPath, mdContent);
    console.log(`    ✅ 生成机型详情.md`);
  }

  // 生成版本索引.md（仅当多版本时）
  if (versionKeys.length > 1) {
    const indexContent = generateIndex(aircraftName, versions);
    const indexPath = path.join(aircraftDir, '版本索引.md');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`  ✅ 生成版本索引.md`);
  }

  // 将根级的完整内容整理.md 移动到根级或保留
  const fullContentPath = path.join(aircraftDir, '完整内容整理.md');
  if (fs.existsSync(fullContentPath)) {
    console.log(`  ℹ️  保留完整内容整理.md 在根级`);
  }
}

function generateMarkdown(aircraftName, version, info) {
  const airlineName = 'Emirates';
  const code = 'EK';

  // 解析舱位配置
  const parseConfig = (config, version) => {
    const parts = {};
    if (config.includes('头等舱')) {
      const match = config.match(/(\d+) 头等舱/);
      parts.first = match ? match[1] : '0';
    } else {
      parts.first = '0';
    }
    if (config.includes('商务舱')) {
      const match = config.match(/(\d+) 商务舱/);
      parts.business = match ? match[1] : '0';
    } else {
      parts.business = '0';
    }
    if (config.includes('优选经济舱')) {
      const match = config.match(/(\d+) 优选经济舱/);
      parts.premiumEconomy = match ? match[1] : '0';
    } else {
      parts.premiumEconomy = '0';
    }
    if (config.includes('经济舱')) {
      const match = config.match(/(\d+) 经济舱/);
      parts.economy = match ? match[1] : '0';
    } else {
      parts.economy = '0';
    }
    return parts;
  };

  const parts = parseConfig(info.config, version);

  return `# ${airlineName} ${aircraftName} ${version} 机型详情

> 数据来源：seatmaps.com | 最后更新：${new Date().toISOString().split('T')[0]}

---

## 📊 基本信息

| 项目 | 详情 |
|------|------|
| **航空公司** | ${airlineName} (${code}) |
| **机型** | ${aircraftName} |
| **版本** | ${version} |
| **总座位数** | ${info.seats} |
| **舱位配置** | ${info.config} |

---

## 🛋️ 舱位详情

${parts.first !== '0' ? `### 头等舱 (First Class)

| 参数 | 数值 |
|------|------|
| 座位数 | ${parts.first} |
| 腿部空间 | 待补充 |
| 座椅宽度 | 待补充 |

---
` : ''}${parts.business !== '0' ? `### 商务舱 (Business Class)

| 参数 | 数值 |
|------|------|
| 座位数 | ${parts.business} |
| 腿部空间 | 待补充 |
| 座椅宽度 | 待补充 |

---
` : ''}${parts.premiumEconomy !== '0' ? `### 优选经济舱 (Premium Economy)

| 参数 | 数值 |
|------|------|
| 座位数 | ${parts.premiumEconomy} |
| 腿部空间 | 待补充 |
| 座椅宽度 | 待补充 |

---
` : ''}### 经济舱 (Economy Class)

| 参数 | 数值 |
|------|------|
| 座位数 | ${parts.economy} |
| 腿部空间 | 待补充 |
| 座椅宽度 | 待补充 |

---

## 📝 备注

- ${version} 配置：${info.config}
- 详细设施信息待补充
`;
}

function generateIndex(aircraftName, versions) {
  let content = `# ${aircraftName} 版本索引

${Object.keys(versions).length}种不同的舱位配置版本。

## 版本列表

| 版本 | 座位数 | 舱位配置 | 详情文档 |
|------|--------|----------|----------|
`;

  for (const [version, info] of Object.entries(versions)) {
    content += `| ${version} | ${info.seats} | ${info.config} | [查看](${version}/机型详情.md) |\n`;
  }

  content += `

## 说明

- 每个版本对应不同的舱位布局和座位数
- 数据来源于 seatmaps.com

## 图片来源

- seatmaps.com
`;

  return content;
}

// 主函数
function main() {
  console.log('============================================================');
  console.log('阿联酋航空所有机型多版本整理工具');
  console.log(`工作目录：${BASE_DIR}`);
  console.log('============================================================\n');

  for (const [aircraftName, config] of Object.entries(AIRCRAFT_CONFIG)) {
    createVersionStructure(aircraftName, config.versions);
  }

  console.log('\n============================================================');
  console.log('✅ 所有机型处理完成！');
  console.log('============================================================\n');
}

main();
