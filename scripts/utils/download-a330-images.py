#!/usr/bin/env python3
"""
国泰航空 A330-300 图片下载工具
从 seatmaps.com 下载 A330-300 的所有图片并按版本分类
"""

import os
import sys
import requests
from pathlib import Path

# A330-300 的 6 个版本配置
VERSIONS = {
    'V.1': {'seats': 262, 'business': 39, 'economy': 223, 'layout': '39 商务舱，223 经济舱'},
    'V.2': {'seats': 317, 'business': 24, 'economy': 293, 'layout': '24 商务舱，293 经济舱'},
    'V.3': {'seats': 293, 'business': 28, 'economy': 265, 'layout': '28 商务舱，265 经济舱'},
    'V.4': {'seats': 307, 'business': 42, 'economy': 265, 'layout': '42 商务舱，265 经济舱'},
    'V.5': {'seats': 251, 'business': 39, 'premium': 21, 'economy': 191, 'layout': '39 商务舱，21 优选经济舱，191 经济舱'},
    'V.6': {'seats': 280, 'business': 50, 'economy': 230, 'layout': '50 商务舱，230 经济舱'}
}

# 图片列表（从 seatmaps.com A330-300 页面提取）
# 每个版本有对应的座位图和客舱图片
IMAGES = {
    # V.1 (hash: 1a3650aedfdd3a21444047ed2d89458f)
    'V.1': {
        'seatmap': '/img/screenshots/seatmaps/1a3650aedfdd3a21444047ed2d89458f.webp',
        'cabins': [
            'https://seatmaps.com/assets/photo-planes/1a3650aedfdd3a21444047ed2d89458f/cathay-pacific-airbus-a330-300-business-1a3650aedfdd3a21444047ed2d89458f-10_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/1a3650aedfdd3a21444047ed2d89458f/cathay-pacific-airbus-a330-300-business-1a3650aedfdd3a21444047ed2d89458f-11_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/1a3650aedfdd3a21444047ed2d89458f/cathay-pacific-airbus-a330-300-business-1a3650aedfdd3a21444047ed2d89458f-12_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/1a3650aedfdd3a21444047ed2d89458f/cathay-pacific-airbus-a330-300-business-1a3650aedfdd3a21444047ed2d89458f-13_thumb.webp',
        ]
    },
    # V.2 (hash: 7e0ff37942c2de60cbcbd27041196ce3)
    'V.2': {
        'seatmap': '/img/screenshots/seatmaps/7e0ff37942c2de60cbcbd27041196ce3.webp',
        'cabins': []
    },
    # V.3 (hash: 2fa6cb0776995363c2a2ae7d57ac3845)
    'V.3': {
        'seatmap': '/img/screenshots/seatmaps/2fa6cb0776995363c2a2ae7d57ac3845.webp',
        'cabins': [
            'https://seatmaps.com/assets/photo-planes/2fa6cb0776995363c2a2ae7d57ac3845/cathay-pacific-airbus-a330-300-business-2fa6cb0776995363c2a2ae7d57ac3845-0_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/2fa6cb0776995363c2a2ae7d57ac3845/cathay-pacific-airbus-a330-300-business-2fa6cb0776995363c2a2ae7d57ac3845-10_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/2fa6cb0776995363c2a2ae7d57ac3845/cathay-pacific-airbus-a330-300-business-2fa6cb0776995363c2a2ae7d57ac3845-11_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/2fa6cb0776995363c2a2ae7d57ac3845/cathay-pacific-airbus-a330-300-business-2fa6cb0776995363c2a2ae7d57ac3845-1_thumb.webp',
        ]
    },
    # V.4 (hash: 4910fcdaedc2be5c5f05533b7a9cb8c2)
    'V.4': {
        'seatmap': '/img/screenshots/seatmaps/4910fcdaedc2be5c5f05533b7a9cb8c2.webp',
        'cabins': [
            'https://seatmaps.com/assets/photo-planes/4910fcdaedc2be5c5f05533b7a9cb8c2/cathay-pacific-airbus-a330-300-business-4910fcdaedc2be5c5f05533b7a9cb8c2-0_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/4910fcdaedc2be5c5f05533b7a9cb8c2/cathay-pacific-airbus-a330-300-business-4910fcdaedc2be5c5f05533b7a9cb8c2-1_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/4910fcdaedc2be5c5f05533b7a9cb8c2/cathay-pacific-airbus-a330-300-business-4910fcdaedc2be5c5f05533b7a9cb8c2-2_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/4910fcdaedc2be5c5f05533b7a9cb8c2/cathay-pacific-airbus-a330-300-business-4910fcdaedc2be5c5f05533b7a9cb8c2-3_thumb.webp',
        ]
    },
    # V.5 (hash: 832635d692f57778f906e5563b757187)
    'V.5': {
        'seatmap': '/img/screenshots/seatmaps/832635d692f57778f906e5563b757187.webp',
        'cabins': [
            'https://seatmaps.com/assets/photo-planes/832635d692f57778f906e5563b757187/cathay-pacific-airbus-a330-300-business-832635d692f57778f906e5563b757187-0_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/832635d692f57778f906e5563b757187/cathay-pacific-airbus-a330-300-business-832635d692f57778f906e5563b757187-1_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/832635d692f57778f906e5563b757187/cathay-pacific-airbus-a330-300-business-832635d692f57778f906e5563b757187-2_thumb.webp',
            'https://seatmaps.com/assets/photo-planes/832635d692f57778f906e5563b757187/cathay-pacific-airbus-a330-300-business-832635d692f57778f906e5563b757187-3_thumb.webp',
        ]
    },
    # V.6 (hash: 1aab7baa714e14868fe9eac65fcbd315)
    'V.6': {
        'seatmap': '/img/screenshots/seatmaps/1aab7baa714e14868fe9eac65fcbd315.webp',
        'cabins': []
    },
}

# 通用图片（logo、图标等）
COMMON_IMAGES = [
    'https://seatmaps.com/assets/logo/logo-CX.png',
]

BASE_URL = 'https://seatmaps.com'
OUTPUT_DIR = Path('/Users/dengxinyang/Desktop/AI·Project/FlightData/国泰航空 CX/A330-300')

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
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        with open(output_path, 'wb') as f:
            f.write(response.content)

        size = os.path.getsize(output_path)
        return True, size
    except Exception as e:
        return False, str(e)

def create_version_directory(version):
    """为版本创建目录结构"""
    version_dir = OUTPUT_DIR / f'A330-300 {version}' / 'images'

    # 创建分类目录
    for cat in CATEGORIES:
        (version_dir / cat).mkdir(parents=True, exist_ok=True)

    return version_dir

def save_version_info(version):
    """保存版本信息"""
    version_dir = OUTPUT_DIR / f'A330-300 {version}'
    info = VERSIONS[version]

    content = f"""# A330-300 {version} 配置信息

| 项目 | 数值 |
|------|------|
| 总座位数 | {info['seats']} |
| 商务舱 | {info['business']} 座 |
"""
    if 'premium' in info:
        content += f"| 优选经济舱 | {info['premium']} 座 |\n"

    content += f"| 经济舱 | {info['economy']} 座 |\n"
    content += f"| 布局 | {info['layout']} |\n"

    with open(version_dir / '版本信息.md', 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print('=' * 60)
    print('国泰航空 A330-300 图片下载工具')
    print('=' * 60)

    # 创建主目录
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 为每个版本下载图片
    for version, imgs in IMAGES.items():
        print(f'\n处理 {version}...')

        # 创建目录
        version_dir = create_version_directory(version)
        print(f'  目录：{version_dir}')

        # 保存版本信息
        save_version_info(version)

        # 下载座位图
        seatmap_url = BASE_URL + imgs['seatmap'] if imgs['seatmap'].startswith('/') else imgs['seatmap']
        seatmap_path = version_dir / '0-原始数据' / 'seatmap.webp'

        success, result = download_image(seatmap_url, seatmap_path)
        if success:
            print(f'  ✅ 座位图：{result} bytes')
            # 同时复制到 1-座椅布局
            import shutil
            shutil.copy(seatmap_path, version_dir / '1-座椅布局' / 'seatmap.webp')
        else:
            print(f'  ❌ 座位图失败：{result}')

        # 下载客舱图片
        for i, cabin_url in enumerate(imgs['cabins']):
            cabin_path = version_dir / '0-原始数据' / f'cabin-{i+1}.webp'
            success, result = download_image(cabin_url, cabin_path)
            if success:
                print(f'  ✅ 客舱图片 {i+1}: {result} bytes')
                # 同时复制到 2-座椅图片
                import shutil
                shutil.copy(cabin_path, version_dir / '2-座椅图片' / f'cabin-{i+1}.webp')
            else:
                print(f'  ❌ 客舱图片 {i+1} 失败：{result}')

    # 下载通用图片
    print('\n下载通用图片...')
    common_dir = OUTPUT_DIR / 'A330-300 V.1' / 'images' / '5-其他信息'
    for url in COMMON_IMAGES:
        filename = url.split('/')[-1]
        path = common_dir / filename
        success, result = download_image(url, path)
        if success:
            print(f'  ✅ {filename}: {result} bytes')
        else:
            print(f'  ❌ {filename} 失败：{result}')

    # 复制通用图片到其他版本
    print('\n复制通用图片到其他版本...')
    for version in VERSIONS.keys():
        if version != 'V.1':
            src = OUTPUT_DIR / 'A330-300 V.1' / 'images' / '5-其他信息' / 'logo-CX.png'
            dst = OUTPUT_DIR / f'A330-300 {version}' / 'images' / '5-其他信息' / 'logo-CX.png'
            if src.exists():
                import shutil
                shutil.copy(src, dst)

    print('\n' + '=' * 60)
    print('✅ 下载完成!')
    print('=' * 60)

if __name__ == '__main__':
    main()
