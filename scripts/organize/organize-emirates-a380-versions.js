#!/usr/bin/env node

/**
 * 阿联酋航空 A380 多版本整理工具
 * 为 10 个版本（V.1-V.10）各创建完整的图片分类目录
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/阿联酋航空 EK/Airbus A380';

// 版本与 seatmap 文件名的映射
const VERSION_MAP = {
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

// 版本配置信息
const VERSION_INFO = {
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

function organizeVersions() {
  console.log('============================================================');
  console.log('阿联酋航空 A380 多版本整理工具');
  console.log('工作目录：' + BASE_DIR);
  console.log('============================================================\n');

  const imagesDir = path.join(BASE_DIR, 'images');
  const seatmapsDir = path.join(imagesDir, '1-座椅布局');
  const rawDir = path.join(imagesDir, '0-原始数据');

  // 检查 seatmap 文件是否存在
  console.log('检查 seatmap 文件...');
  for (const [version, filename] of Object.entries(VERSION_MAP)) {
    const seatmapPath = path.join(seatmapsDir, filename);
    if (!fs.existsSync(seatmapPath)) {
      console.log(`  ⚠️  未找到 ${version} 的 seatmap: ${filename}`);
    } else {
      console.log(`  ✅ 找到 ${version} 的 seatmap: ${filename}`);
    }
  }

  console.log('\n开始为每个版本创建目录结构...\n');

  // 为每个版本创建目录
  for (const version of Object.keys(VERSION_MAP)) {
    const versionDir = path.join(BASE_DIR, version);

    console.log(`\n${'='.repeat(50)}`);
    console.log(`处理 ${version}`);
    console.log(`${'='.repeat(50)}`);

    // 创建版本目录
    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir, { recursive: true });
      console.log(`  ✅ 创建目录：${version}`);
    } else {
      console.log(`  ℹ️  目录已存在：${version}`);
    }

    // 创建 images 子目录
    const versionImagesDir = path.join(versionDir, 'images');
    for (const cat of CATEGORIES) {
      const catDir = path.join(versionImagesDir, cat);
      if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true });
        console.log(`  ✅ 创建分类目录：${cat}`);
      }
    }

    // 复制 seatmap 到 1-座椅布局
    const seatmapSrc = path.join(seatmapsDir, VERSION_MAP[version]);
    const seatmapDst = path.join(versionImagesDir, '1-座椅布局', VERSION_MAP[version]);
    if (fs.existsSync(seatmapSrc)) {
      fs.copyFileSync(seatmapSrc, seatmapDst);
      console.log(`  ✅ 复制 seatmap 到 1-座椅布局`);
    }

    // 复制原始数据
    const rawSrc = path.join(rawDir, VERSION_MAP[version]);
    const rawDst = path.join(versionImagesDir, '0-原始数据', VERSION_MAP[version]);
    if (fs.existsSync(rawSrc)) {
      fs.copyFileSync(rawSrc, rawDst);
      console.log(`  ✅ 复制原始数据到 0-原始数据`);
    }

    // 生成版本信息.md
    const info = VERSION_INFO[version];
    const mdContent = `# Emirates Airbus A380 ${version} 机型详情

> 数据来源：seatmaps.com | 最后更新：${new Date().toISOString().split('T')[0]}

---

## 📊 基本信息

| 项目 | 详情 |
|------|------|
| **航空公司** | Emirates (EK) |
| **机型** | Airbus A380 |
| **版本** | ${version} |
| **总座位数** | ${info.seats} |
| **舱位配置** | ${info.config} |

---

## 🛋️ 舱位详情

### 头等舱 (First Class)

| 参数 | 数值 |
|------|------|
| 座位数 | ${info.config.includes('头等舱') ? info.config.match(/(\\d+) 头等舱/)?.[1] || '待补充' : '不适用'} |
| 腿部空间 | 待补充 |
| 座椅宽度 | 待补充 |

### 商务舱 (Business Class)

| 参数 | 数值 |
|------|------|
| 座位数 | ${info.config.match(/(\\d+) 商务舱/)?.[1] || '待补充'} |
| 腿部空间 | 待补充 |
| 座椅宽度 | 待补充 |

### 优选经济舱 (Premium Economy)

| 参数 | 数值 |
|------|------|
| 座位数 | ${info.config.includes('优选经济舱') ? info.config.match(/(\\d+) 优选经济舱/)?.[1] || '待补充' : '不适用'} |
| 腿部空间 | 待补充 |
| 座椅宽度 | 待补充 |

### 经济舱 (Economy Class)

| 参数 | 数值 |
|------|------|
| 座位数 | ${info.config.match(/(\\d+) 经济舱/)?.[1] || '待补充'} |
| 腿部空间 | 待补充 |
| 座椅宽度 | 待补充 |

---

## 📝 备注

- ${version} 配置：${info.config}
- 详细设施信息待补充
`;

    const mdPath = path.join(versionDir, '机型详情.md');
    fs.writeFileSync(mdPath, mdContent);
    console.log(`  ✅ 生成机型详情.md`);

    console.log(`  ✅ ${version} 处理完成`);
  }

  // 生成版本索引
  console.log('\n生成版本索引...\n');

  let indexContent = `# Emirates Airbus A380 版本索引

阿联酋航空 A380 共有 **10 种不同的舱位配置版本**。

## 版本列表

| 版本 | 座位数 | 舱位配置 | 详情文档 |
|------|--------|----------|----------|
`;

  for (const version of Object.keys(VERSION_MAP)) {
    const info = VERSION_INFO[version];
    indexContent += `| ${version} | ${info.seats} | ${info.config} | [查看](${version}/机型详情.md) |\n`;
  }

  indexContent += `

## 说明

- 每个版本对应不同的舱位布局和座位数
- 部分版本包含头等舱，部分版本仅商务舱和经济舱
- 数据来源于 seatmaps.com

## 图片来源

- seatmaps.com
`;

  const indexPath = path.join(BASE_DIR, '版本索引.md');
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ 生成版本索引.md');

  console.log('\n============================================================');
  console.log('✅ 所有版本处理完成！');
  console.log('============================================================\n');
}

organizeVersions();
