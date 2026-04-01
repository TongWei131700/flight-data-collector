#!/usr/bin/env python3
"""
国泰航空 A330-300 完整数据爬取工具 v2
从 seatmaps.com 完整爬取 A330-300 所有版本的图片和数据
"""

import os
import re
import sys
import json
import requests
import hashlib
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup

BASE_URL = 'https://seatmaps.com'
TARGET_URL = 'https://seatmaps.com/zh-CN/airlines/cx-cathay-pacific/airbus-a330-300/'
BASE_DIR = Path('/Users/dengxinyang/Desktop/AI·Project/FlightData/国泰航空 CX/A330-300')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

CATEGORIES = [
    '0-原始数据',
    '1-座椅布局',
    '2-座椅图片',
    '3-机上餐食',
    '4-娱乐设备',
    '5-其他信息'
]


def fetch_page_html():
    """获取页面 HTML"""
    print('📥 正在获取页面...')
    response = requests.get(TARGET_URL, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return response.text


def extract_versions_from_html(html):
    """从 HTML 中提取所有版本信息"""
    print('🔍 正在解析版本信息...')

    # 查找所有版本锚点（hash ID）
    # 模式 1: 数据属性中的 hash
    hash_pattern = r'data-hash=["\']([a-f0-9]{32})["\']'
    hashes = re.findall(hash_pattern, html)

    # 模式 2: 从 JavaScript 配置中提取
    js_config_pattern = r'var\s+seatmapConfig\s*=\s*\{([^}]+)\}'

    # 模式 3: 从 URL 锚点中提取 (#1a3650aedfdd3a21444047ed2d89458f)
    anchor_pattern = r'#([a-f0-9]{32})'
    anchors = re.findall(anchor_pattern, html)

    # 模式 4: 从图片路径中提取 hash
    img_hash_pattern = r'/img/screenshots/seatmaps/([a-f0-9]{32})\.webp'
    img_hashes = re.findall(img_hash_pattern, html)

    # 模式 5: 从客舱图片路径中提取
    cabin_hash_pattern = r'/assets/photo-planes/([a-f0-9]{32})/'
    cabin_hashes = re.findall(cabin_hash_pattern, html)

    # 合并所有 hash
    all_hashes = list(set(hashes + anchors + img_hashes + cabin_hashes))

    print(f'  找到 {len(all_hashes)} 个版本 hash')

    versions = {}
    for i, h in enumerate(all_hashes):
        version_name = f'V.{i+1}'
        versions[version_name] = {
            'hash': h,
            'index': i + 1
        }
        print(f'  - {version_name}: {h}')

    return versions


def extract_images_for_version(html, version_hash):
    """提取特定版本的所有图片"""
    images = {
        'seatmap': None,
        'cabins': [],
        'icons': []
    }

    # 座位图
    seatmap_url = f'{BASE_URL}/img/screenshots/seatmaps/{version_hash}.webp'
    images['seatmap'] = seatmap_url

    # 客舱图片 - 从 HTML 中提取该 hash 对应的所有客舱图片
    cabin_pattern = rf'/assets/photo-planes/{version_hash}/([^"\']+)\.(webp|jpg|png)'
    cabin_matches = re.findall(cabin_pattern, html)

    for filename, ext in cabin_matches:
        cabin_url = f'{BASE_URL}/assets/photo-planes/{version_hash}/{filename}.{ext}'
        if cabin_url not in images['cabins']:
            images['cabins'].append(cabin_url)

    # 也可能在 JavaScript 数据中
    js_cabin_pattern = rf'"hash":"{version_hash}".*?"photos":\[(.*?)\]'

    return images


def download_image(url, output_path):
    """下载图片"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()

        with open(output_path, 'wb') as f:
            f.write(response.content)

        size = os.path.getsize(output_path)

        # 检查是否是有效图片（大于 1KB）
        if size < 1024:
            os.remove(output_path)
            return False, 0, '文件太小'

        return True, size, 'OK'
    except Exception as e:
        if os.path.exists(output_path):
            os.remove(output_path)
        return False, 0, str(e)


def create_version_structure(version_name, version_info):
    """创建版本目录结构"""
    version_dir = BASE_DIR / f'A330-300 {version_name}'
    images_dir = version_dir / 'images'

    for cat in CATEGORIES:
        (images_dir / cat).mkdir(parents=True, exist_ok=True)

    # 保存版本信息
    info_content = f"# A330-300 {version_name}\n\n"
    info_content += f"**Hash**: {version_info['hash']}\n\n"
    info_content += f"**索引位置**: {version_info.get('index', 'N/A')}\n"

    with open(version_dir / '版本信息.md', 'w', encoding='utf-8') as f:
        f.write(info_content)

    return images_dir


def classify_and_copy(src_path, images_dir):
    """根据图片类型分类复制"""
    filename = src_path.name

    # 座位图 → 1-座椅布局
    if 'seatmap' in filename.lower() or 'seat' in filename.lower():
        dst = images_dir / '1-座椅布局' / src_path.name
    # 客舱图片 → 2-座椅图片
    elif 'cabin' in filename.lower() or 'business' in filename.lower() or 'economy' in filename.lower():
        dst = images_dir / '2-座椅图片' / src_path.name
    # 图标 → 5-其他信息
    elif filename.endswith('.svg') or 'icon' in filename.lower() or 'logo' in filename.lower():
        dst = images_dir / '5-其他信息' / src_path.name
    else:
        # 默认复制到座椅布局
        dst = images_dir / '1-座椅布局' / src_path.name

    import shutil
    shutil.copy2(src_path, dst)


def save_main_document(versions, total_images):
    """保存主文档"""
    doc_path = BASE_DIR / '完整内容整理.md'

    content = "# Cathay Pacific Airbus A330-300 座位图 - 完整内容整理\n\n"
    content += f"**抓取时间**: {datetime.now().strftime('%Y-%m-%d %H:%M GMT+8')}\n"
    content += f"**来源网址**: {TARGET_URL}\n\n"
    content += "---\n\n"

    content += "## 📋 基本信息\n\n"
    content += "| 项目 | 详情 |\n"
    content += "|------|------|\n"
    content += "| **航空公司** | Cathay Pacific (CX) |\n"
    content += "| **机型** | Airbus A330-300 |\n"
    content += "| **版本数量** | 6 |\n\n"

    content += "---\n\n"
    content += "## 🛋️ 各版本配置\n\n"
    content += "| 版本 | Hash | 目录 |\n"
    content += "|------|------|------|\n"
    for vname, vinfo in versions.items():
        content += f"| {vname} | `{vinfo['hash'][:16]}...` | [查看](A330-300%20{vname}/) |\n"

    content += "\n---\n\n"
    content += "## 📊 爬取统计\n\n"
    content += f"- **总图片数**: {total_images} 张\n"
    content += f"- **版本数**: {len(versions)} 个\n\n"

    content += "---\n\n"
    content += "## 🖼️ 图片分类说明\n\n"
    for cat in CATEGORIES:
        content += f"- `{cat}/` - "
        if cat == '0-原始数据':
            content += "从 seatmaps.com 爬取的原始图片（保留原始数据，便于追溯）\n"
        elif cat == '1-座椅布局':
            content += "座位图、舱位布局平面图（俯瞰视角的座位分布图）\n"
        elif cat == '2-座椅图片':
            content += "座椅实物照片（商务舱、经济舱等座椅实拍）\n"
        elif cat == '3-机上餐食':
            content += "餐食、饮品、菜单图片（机上餐饮服务相关）\n"
        elif cat == '4-娱乐设备':
            content += "IFE 屏幕、USB 端口、WiFi 等（机上娱乐和便利设施）\n"
        else:
            content += "logo、图标、外观等（未归类的其他图片）\n"

    with open(doc_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'📄 主文档已保存：{doc_path}')


def main():
    print('=' * 60)
    print('国泰航空 A330-300 完整数据爬取工具 v2')
    print('=' * 60)

    # 创建主目录
    BASE_DIR.mkdir(parents=True, exist_ok=True)

    # 步骤 1: 获取页面 HTML
    try:
        html = fetch_page_html()
        print('  ✅ 页面获取成功')
    except Exception as e:
        print(f'  ❌ 页面获取失败：{e}')
        print('尝试使用备用方式...')
        html = '<html></html>'

    # 步骤 2: 提取版本信息
    versions = extract_versions_from_html(html)

    if not versions:
        print('  ⚠️ 未能从页面提取版本信息，使用备用列表...')
        # 备用版本列表（从之前已知）
        versions = {
            'V.1': {'hash': '1a3650aedfdd3a21444047ed2d89458f', 'index': 1},
            'V.2': {'hash': '7e0ff37942c2de60cbcbd27041196ce3', 'index': 2},
            'V.3': {'hash': '2fa6cb0776995363c2a2ae7d57ac3845', 'index': 3},
            'V.4': {'hash': '4910fcdaedc2be5c5f05533b7a9cb8c2', 'index': 4},
            'V.5': {'hash': '832635d692f57778f906e5563b757187', 'index': 5},
            'V.6': {'hash': '1aab7baa714e14868fe9eac65fcbd315', 'index': 6},
        }
        print(f'  使用 {len(versions)} 个备用版本')

    # 步骤 3: 为每个版本下载图片
    total_images = 0

    for version_name, version_info in versions.items():
        print(f'\n处理 {version_name} (hash: {version_info["hash"][:16]}...)...')

        # 创建目录
        images_dir = create_version_structure(version_name, version_info)
        original_dir = images_dir / '0-原始数据'
        vhash = version_info['hash']

        # 下载座位图
        seatmap_url = f'{BASE_URL}/img/screenshots/seatmaps/{vhash}.webp'
        seatmap_filename = f'seatmap-{vhash[:16]}.webp'
        seatmap_path = original_dir / seatmap_filename

        print(f'  📥 座位图...')
        success, size, msg = download_image(seatmap_url, seatmap_path)
        if success:
            print(f'    ✅ {size} bytes')
            classify_and_copy(seatmap_path, images_dir)
            total_images += 1
        else:
            print(f'    ❌ {msg}')

        # 下载客舱图片（尝试多个索引）
        cabin_count = 0
        for i in range(20):  # 最多尝试 20 张客舱图片
            # 不同的命名模式
            possible_urls = [
                f'{BASE_URL}/assets/photo-planes/{vhash}/cathay-pacific-airbus-a330-300-business-{vhash}-{i}_thumb.webp',
                f'{BASE_URL}/assets/photo-planes/{vhash}/cathay-pacific-airbus-a330-300-{vhash}-{i}_thumb.webp',
                f'{BASE_URL}/assets/photo-planes/{vhash}/{vhash}-{i}.webp',
                f'{BASE_URL}/assets/photo-planes/{vhash}/cabin-{i}.webp',
            ]

            for cabin_url in possible_urls:
                cabin_filename = f'cabin-{i}.webp'
                cabin_path = original_dir / cabin_filename

                if cabin_path.exists():
                    continue

                success, size, msg = download_image(cabin_url, cabin_path)
                if success and size > 5000:
                    print(f'    ✅ 客舱图片 {i+1}: {size} bytes')
                    classify_and_copy(cabin_path, images_dir)
                    cabin_count += 1
                    total_images += 1
                    break
                elif success:
                    os.remove(cabin_path)
            else:
                # 所有 URL 都失败，尝试下一个索引
                continue

        print(f'  该版本下载：{1 + cabin_count} 张图片')

    # 步骤 4: 下载通用 logo
    print('\n下载通用图片...')
    logo_dir = BASE_DIR / 'A330-300 V.1' / 'images' / '5-其他信息'
    logo_url = f'{BASE_URL}/assets/logo/logo-CX.png'

    # 如果上面的 URL 不行，尝试另一个
    alt_logo_url = f'{BASE_URL}/assets/logo/logo-CX.png'

    logo_path = logo_dir / 'logo-CX.png'
    success, size, msg = download_image(logo_url, logo_path)
    if not success:
        success, size, msg = download_image(alt_logo_url, logo_path)

    if success:
        print(f'  ✅ Logo: {size} bytes')
        total_images += 1

        # 复制 logo 到其他版本
        import shutil
        for version_name in versions.keys():
            if version_name != 'V.1':
                src = logo_path
                dst = BASE_DIR / f'A330-300 {version_name}' / 'images' / '5-其他信息' / 'logo-CX.png'
                shutil.copy2(src, dst)
    else:
        print(f'  ❌ Logo 下载失败：{msg}')

    # 步骤 5: 保存主文档
    save_main_document(versions, total_images)

    # 步骤 6: 生成索引
    index_path = BASE_DIR / 'A330-300-versions-INDEX.md'
    index_content = "# 国泰航空 A330-300 配置版本索引\n\n"
    index_content += f"**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    index_content += f"**数据来源**: [seatmaps.com]({TARGET_URL})\n\n"
    index_content += "---\n\n"
    index_content += "## 📋 版本概览\n\n"
    index_content += "| 版本 | Hash | 目录 |\n"
    index_content += "|------|------|------|\n"
    for vname, vinfo in versions.items():
        index_content += f"| {vname} | `{vinfo['hash'][:16]}...` | [查看](A330-300%20{vname}/) |\n"
    index_content += f"\n**总计**: {total_images} 张图片\n"

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_content)
    print(f'📄 索引已保存：{index_path}')

    print('\n' + '=' * 60)
    print(f'✅ A330-300 数据爬取完成！')
    print(f'📊 总计下载：{total_images} 张图片')
    print(f'📁 数据目录：{BASE_DIR}')
    print('=' * 60)

    return total_images


if __name__ == '__main__':
    main()
