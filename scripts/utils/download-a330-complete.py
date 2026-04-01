#!/usr/bin/env python3
"""
国泰航空 A330-300 完整数据下载工具
从 seatmaps.com 下载 A330-300 的所有图片和数据，包括 6 个版本
"""

import os
import sys
import requests
import hashlib
from pathlib import Path
from datetime import datetime

# A330-300 的 6 个版本配置
VERSIONS = {
    'V.1': {
        'hash': '1a3650aedfdd3a21444047ed2d89458f',
        'seats': 262, 'business': 39, 'economy': 223,
        'layout': '39 商务舱，223 经济舱'
    },
    'V.2': {
        'hash': '7e0ff37942c2de60cbcbd27041196ce3',
        'seats': 317, 'business': 24, 'economy': 293,
        'layout': '24 商务舱，293 经济舱'
    },
    'V.3': {
        'hash': '2fa6cb0776995363c2a2ae7d57ac3845',
        'seats': 293, 'business': 28, 'economy': 265,
        'layout': '28 商务舱，265 经济舱'
    },
    'V.4': {
        'hash': '4910fcdaedc2be5c5f05533b7a9cb8c2',
        'seats': 307, 'business': 42, 'economy': 265,
        'layout': '42 商务舱，265 经济舱'
    },
    'V.5': {
        'hash': '832635d692f57778f906e5563b757187',
        'seats': 251, 'business': 39, 'premium': 21, 'economy': 191,
        'layout': '39 商务舱，21 优选经济舱，191 经济舱'
    },
    'V.6': {
        'hash': '1aab7baa714e14868fe9eac65fcbd315',
        'seats': 280, 'business': 50, 'economy': 230,
        'layout': '50 商务舱，230 经济舱'
    }
}

BASE_URL = 'https://seatmaps.com'
BASE_DIR = Path('/Users/dengxinyang/Desktop/AI·Project/FlightData/国泰航空 CX/A330-300')
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

# 分类体系
CATEGORIES = [
    '0-原始数据',
    '1-座椅布局',
    '2-座椅图片',
    '3-机上餐食',
    '4-娱乐设备',
    '5-其他信息'
]


def download_image(url, output_path):
    """下载图片"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        with open(output_path, 'wb') as f:
            f.write(response.content)
        return True, os.path.getsize(output_path)
    except Exception as e:
        return False, str(e)


def create_version_directory(version):
    """为版本创建目录结构"""
    version_dir = BASE_DIR / f'A330-300 {version}' / 'images'
    for cat in CATEGORIES:
        (version_dir / cat).mkdir(parents=True, exist_ok=True)
    return version_dir


def save_version_info(version):
    """保存版本信息"""
    version_dir = BASE_DIR / f'A330-300 {version}'
    info = VERSIONS[version]
    content = f"# A330-300 {version} 配置信息\n\n"
    content += "| 项目 | 数值 |\n"
    content += "|------|------|\n"
    content += f"| 总座位数 | {info['seats']} |\n"
    content += f"| 商务舱 | {info['business']} 座 |\n"
    if 'premium' in info:
        content += f"| 优选经济舱 | {info['premium']} 座 |\n"
    content += f"| 经济舱 | {info['economy']} 座 |\n"
    content += f"| 布局 | {info['layout']} |\n"

    with open(version_dir / '版本信息.md', 'w', encoding='utf-8') as f:
        f.write(content)


def fetch_seatmap_images():
    """从 seatmaps.com 获取座位图图片链接"""
    seatmap_urls = {}
    for version, info in VERSIONS.items():
        hash_id = info['hash']
        # 座位图 URL 模式
        seatmap_url = f'{BASE_URL}/img/screenshots/seatmaps/{hash_id}.webp'
        seatmap_urls[version] = {
            'seatmap': seatmap_url,
            'hash': hash_id
        }
    return seatmap_urls


def fetch_cabin_images(version_hash):
    """获取客舱图片链接"""
    cabin_urls = []
    # 从页面中提取客舱图片
    # seatmaps.com 的客舱图片 URL 模式
    for i in range(10):  # 最多尝试 10 张客舱图片
        url = f'{BASE_URL}/assets/photo-planes/{version_hash}/cathay-pacific-airbus-a330-300-business-{version_hash}-{i}_thumb.webp'
        cabin_urls.append(url)
    return cabin_urls


def save_main_document(seatmap_urls):
    """保存主文档"""
    doc_path = BASE_DIR / '完整内容整理.md'

    content = "# Cathay Pacific Airbus A330-300 座位图 - 完整内容整理\n\n"
    content += f"**抓取时间**: {datetime.now().strftime('%Y-%m-%d %H:%M GMT+8')}\n"
    content += f"**来源网址**: https://seatmaps.com/zh-CN/airlines/cx-cathay-pacific/airbus-a330-300/\n\n"
    content += "---\n\n"

    content += "## 📋 基本信息\n\n"
    content += "| 项目 | 详情 |\n"
    content += "|------|------|\n"
    content += "| **航空公司** | Cathay Pacific (CX) |\n"
    content += "| **机型** | Airbus A330-300 |\n"
    content += "| **版本数量** | 6 |\n"
    content += "| **首飞时间** | 待补充 |\n\n"

    content += "---\n\n"
    content += "## 🛋️ 各版本配置\n\n"
    content += "| 版本 | 总座位数 | 商务舱 | 优选经济 | 经济舱 | 布局 |\n"
    content += "|------|----------|--------|----------|--------|------|\n"
    for version, info in VERSIONS.items():
        premium = info.get('premium', '-')
        premium_str = f"{premium} 座" if premium != '-' else '-'
        content += f"| {version} | {info['seats']} | {info['business']} 座 | {premium_str} | {info['economy']} 座 | {info['layout']} |\n"

    content += "\n---\n\n"
    content += "## 🖼️ 已下载图片\n\n"
    content += "每个版本包含以下分类的图片：\n\n"
    for cat in CATEGORIES:
        content += f"- `{cat}/` - "
        if cat == '0-原始数据':
            content += "从 seatmaps.com 爬取的原始图片\n"
        elif cat == '1-座椅布局':
            content += "座位图、舱位布局平面图\n"
        elif cat == '2-座椅图片':
            content += "座椅实物照片（商务舱、经济舱等）\n"
        elif cat == '3-机上餐食':
            content += "餐食、饮品、菜单图片\n"
        elif cat == '4-娱乐设备':
            content += "IFE 屏幕、USB 端口、WiFi 等设备\n"
        else:
            content += "logo、图标等其他图片\n"

    content += "\n---\n\n"
    content += "## 📁 目录结构\n\n"
    content += "```\n"
    content += "A330-300/\n"
    for version in VERSIONS.keys():
        content += f"├── A330-300 {version}/\n"
        content += f"│   ├── 版本信息.md\n"
        content += f"│   └── images/\n"
        for cat in CATEGORIES:
            content += f"│       ├── {cat}/\n"
    content += "```\n"

    with open(doc_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'📄 主文档已保存：{doc_path}')


def main():
    print('=' * 60)
    print('国泰航空 A330-300 完整数据下载工具')
    print('=' * 60)

    # 创建主目录
    BASE_DIR.mkdir(parents=True, exist_ok=True)

    # 获取座位图链接
    seatmap_urls = fetch_seatmap_images()

    # 保存主文档
    save_main_document(seatmap_urls)

    # 为每个版本下载图片
    print('\n开始下载各版本图片...')
    total_downloaded = 0

    for version, info in VERSIONS.items():
        print(f'\n处理 {version} (hash: {info["hash"]})...')

        # 创建目录
        version_dir = create_version_directory(version)
        save_version_info(version)

        original_dir = version_dir / '0-原始数据'
        seatmap_dir = version_dir / '1-座椅布局'
        cabin_dir = version_dir / '2-座椅图片'

        # 下载座位图
        seatmap_url = seatmap_urls[version]['seatmap']
        filename = f"seatmap-{info['hash'][:16]}.webp"
        seatmap_path = original_dir / filename

        success, result = download_image(seatmap_url, seatmap_path)
        if success:
            print(f'  ✅ 座位图：{result} bytes')
            # 复制到座椅布局目录
            import shutil
            shutil.copy(seatmap_path, seatmap_dir / filename)
            total_downloaded += 1
        else:
            print(f'  ❌ 座位图失败：{result}')

        # 获取并下载客舱图片
        cabin_urls = fetch_cabin_images(info['hash'])
        cabin_count = 0
        for i, cabin_url in enumerate(cabin_urls):
            filename = f"cabin-{i+1}.webp"
            cabin_path = original_dir / filename

            success, result = download_image(cabin_url, cabin_path)
            if success:
                # 只复制大于 10KB 的有效图片
                if result > 10000:
                    print(f'  ✅ 客舱图片 {i+1}: {result} bytes')
                    shutil.copy(cabin_path, cabin_dir / filename)
                    cabin_count += 1
                    total_downloaded += 1
                else:
                    # 删除无效小文件
                    os.remove(cabin_path)
            else:
                # 404 错误跳过
                if '404' in result:
                    break
                print(f'  ❌ 客舱图片 {i+1} 失败：{result}')

        print(f'  该版本下载：{1 + cabin_count} 张图片')

    # 下载通用 logo
    print('\n下载通用图片...')
    logo_dir = BASE_DIR / 'A330-300 V.1' / 'images' / '5-其他信息'
    logo_url = 'https://seatmaps.com/assets/logo/logo-CX.png'
    logo_path = logo_dir / 'logo-CX.png'
    success, result = download_image(logo_url, logo_path)
    if success:
        print(f'  ✅ Logo: {result} bytes')
        total_downloaded += 1
    else:
        print(f'  ❌ Logo 失败：{result}')

    # 复制 logo 到其他版本
    for version in VERSIONS.keys():
        if version != 'V.1':
            src = BASE_DIR / 'A330-300 V.1' / 'images' / '5-其他信息' / 'logo-CX.png'
            dst = BASE_DIR / f'A330-300 {version}' / 'images' / '5-其他信息' / 'logo-CX.png'
            if src.exists():
                import shutil
                shutil.copy(src, dst)

    print('\n' + '=' * 60)
    print(f'✅ A330-300 数据下载完成！')
    print(f'📊 总计下载：{total_downloaded} 张图片')
    print(f'📁 数据目录：{BASE_DIR}')
    print('=' * 60)


if __name__ == '__main__':
    main()
