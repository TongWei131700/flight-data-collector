#!/usr/bin/env node

/**
 * 为日本航空多版本机型生成版本详情文档
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = '/Users/dengxinyang/Desktop/AI·Project/FlightData/日本航空 JL';

// 版本配置信息（根据 seatmaps.com 页面信息）
const VERSION_INFO = {
  'Boeing 737-800': {
    'V.1': { seats: 165, business: 20, economy: 145, rating: '4.67', pitch: '38 英寸' },
    'V.2': { seats: 165, business: 20, economy: 145, rating: '4.37', pitch: '38 英寸' },
    'V.3': { seats: 144, business: 12, economy: 132, rating: '4.54', pitch: '47 英寸' }
  },
  'Boeing 767-300Er': {
    'V.1': { seats: 214, business: 18, premium: 24, economy: 172, rating: '4.52' },
    'V.2': { seats: 215, business: 18, premium: 24, economy: 173, rating: '4.48' },
    'V.3': { seats: 190, business: 10, premium: 28, economy: 152, rating: '4.55' }
  },
  'Boeing 787-8': {
    'V.1': { seats: 161, business: 18, premium: 21, economy: 122, rating: '4.62' },
    'V.2': { seats: 153, business: 18, premium: 21, economy: 114, rating: '4.58' },
    'V.3': { seats: 186, business: 18, premium: 21, economy: 147, rating: '4.50' }
  },
  'Boeing 787-9': {
    'V.1': { seats: 195, business: 24, premium: 35, economy: 136, rating: '4.53' },
    'V.2': { seats: 206, business: 24, premium: 35, economy: 147, rating: '4.49' },
    'V.3': { seats: 219, business: 24, premium: 35, economy: 160, rating: '4.45' }
  },
  'Airbus A350-900': {
    'V.1': { seats: 195, business: 24, premium: 24, economy: 147, rating: '4.62' },
    'V.2': { seats: 185, business: 24, premium: 24, economy: 137, rating: '4.58' }
  }
};

function generateVersionDetailMd(aircraftName, versionName, versionInfo) {
  const airlineName = '日本航空';
  const airlineCode = 'JL';
  
  let md = `# ${airlineName} ${aircraftName} ${versionName} 机型详情\n\n`;
  md += `> 数据来源：seatmaps.com | 最后更新：${new Date().toISOString().split('T')[0]}\n\n`;
  md += `## 📊 基本信息\n\n`;
  md += `| 项目 | 详情 |\n`;
  md += `|------|------|\n`;
  md += `| **航空公司** | ${airlineName} (${airlineCode}) |\n`;
  md += `| **机型** | ${aircraftName} |\n`;
  md += `| **版本** | ${versionName} |\n`;
  
  if (versionInfo) {
    md += `| **总座位数** | ${versionInfo.seats} |\n`;
    if (versionInfo.business) md += `| **商务舱** | ${versionInfo.business} |\n`;
    if (versionInfo.premium) md += `| **优选经济舱** | ${versionInfo.premium} |\n`;
    if (versionInfo.economy) md += `| **经济舱** | ${versionInfo.economy} |\n`;
    if (versionInfo.rating) md += `| **用户评分** | ${versionInfo.rating}/5 |\n`;
    if (versionInfo.pitch) md += `| **腿部空间** | ${versionInfo.pitch} |\n`;
  } else {
    md += `| **总座位数** | 待确认 |\n`;
    md += `| **舱位配置** | 待确认 |\n`;
  }
  
  md += `\n---\n\n`;
  md += `## 🛋️ 舱位详情\n\n`;
  
  if (versionInfo) {
    if (versionInfo.business) {
      md += `### 商务舱 (Business Class)\n\n`;
      md += `| 参数 | 数值 |\n`;
      md += `|------|------|\n`;
      md += `| 座位数 | ${versionInfo.business} |\n`;
      md += `| 腿部空间 | ${versionInfo.pitch || '待确认'} |\n\n`;
    }
    if (versionInfo.premium) {
      md += `### 优选经济舱 (Premium Economy)\n\n`;
      md += `| 参数 | 数值 |\n`;
      md += `|------|------|\n`;
      md += `| 座位数 | ${versionInfo.premium} |\n`;
      md += `| 腿部空间 | 待补充 |\n\n`;
    }
    if (versionInfo.economy) {
      md += `### 经济舱 (Economy Class)\n\n`;
      md += `| 参数 | 数值 |\n`;
      md += `|------|------|\n`;
      md += `| 座位数 | ${versionInfo.economy} |\n`;
      md += `| 腿部空间 | 待补充 |\n\n`;
    }
  } else {
    md += `### 商务舱 (Business Class)\n\n待补充\n\n`;
    md += `### 经济舱 (Economy Class)\n\n待补充\n\n`;
  }
  
  md += `## 🔗 参考链接\n\n`;
  md += `- [seatmaps.com - ${airlineName} ${aircraftName}](https://seatmaps.com/zh-CN/airlines/jl-jal/${aircraftName.toLowerCase().replace(/\s+/g, '-')}/)\n`;
  
  return md;
}

function processVersions() {
  const aircraftDirs = fs.readdirSync(BASE_DIR).filter(item => {
    const itemPath = path.join(BASE_DIR, item);
    return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
  });
  
  for (const aircraftName of aircraftDirs) {
    const aircraftDir = path.join(BASE_DIR, aircraftName);
    const versionIndex = path.join(aircraftDir, '版本索引.md');
    
    if (!fs.existsSync(versionIndex)) {
      continue; // 单版本机型，跳过
    }
    
    console.log(`\n处理：${aircraftName}`);
    
    // 读取版本索引获取版本列表
    const indexContent = fs.readFileSync(versionIndex, 'utf-8');
    const versionMatches = indexContent.match(/\[V\.\d+\]/g) || [];
    const versions = versionMatches.map(v => v.replace(/[\[\]]/g, ''));
    
    const versionInfoMap = VERSION_INFO[aircraftName] || {};
    
    for (const versionName of versions) {
      const versionDir = path.join(aircraftDir, versionName);
      const detailMdPath = path.join(versionDir, '机型详情.md');
      
      const versionInfo = versionInfoMap[versionName];
      const md = generateVersionDetailMd(aircraftName, versionName, versionInfo);
      
      fs.writeFileSync(detailMdPath, md);
      console.log(`  - 生成 ${versionName}/机型详情.md`);
      
      // 复制完整内容整理.md
      const srcContent = fs.readFileSync(path.join(aircraftDir, '完整内容整理.md'), 'utf-8');
      const dstContent = srcContent.replace(
        /Jal (.+) 座位图/,
        `Jal ${aircraftName} ${versionName} 座位图`
      );
      fs.writeFileSync(path.join(versionDir, '完整内容整理.md'), dstContent);
      console.log(`  - 生成 ${versionName}/完整内容整理.md`);
    }
  }
}

processVersions();
console.log('\n完成!');
