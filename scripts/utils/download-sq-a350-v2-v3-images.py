#!/usr/bin/env python3
"""
新加坡航空 A350-900 V.2 和 V.3 图片下载工具
"""

import os
import requests
from pathlib import Path

# A350-900 三个版本的 hash（从页面获取）
# V.1: 295 座（两舱）
# V.2: 253 座（三舱，反向鱼骨商务舱）
# V.3: 253 座（三舱）
HASHES = {
    "V.1": "034260c0426cf36118803ce0df4457fd",
    "V.2": "349f8e8088df63050757dd8be4356216",
    "V.3": "9d86d83f925f2149e9edb0ac3b49229c"
}

BASE_DIR = Path("/Users/dengxinyang/Desktop/AI·Project/FlightData/新加坡航空 SQ/Airbus A350-900")
BASE_URL = "https://seatmaps.com"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}


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


def download_version_images(version, hash_id):
    """下载某个版本的图片"""
    images_dir = BASE_DIR / version / 'images'

    print(f"\n处理：A350-900 {version}")
    print(f"  Hash: {hash_id}")

    # 1. 下载座位图
    seatmap_url = f'{BASE_URL}/img/screenshots/seatmaps/{hash_id}.webp'
    output_path = images_dir / '1-座椅布局' / f'seatmap-{hash_id[:8]}.webp'
    success, size = download_image(seatmap_url, output_path)
    if success:
        print(f"  ✓ 座位图：{size} bytes")
        # 复制到 0-原始数据
        orig_path = images_dir / '0-原始数据' / f'seatmap-{hash_id[:8]}.webp'
        with open(output_path, 'rb') as src:
            with open(orig_path, 'wb') as dst:
                dst.write(src.read())

    # 2. 下载全景图
    for i in range(1, 11):
        url = f'{BASE_URL}/img/screenshots/planes/{hash_id}/panorama_{i}.webp'
        output_path = images_dir / '2-座椅图片' / f'panorama-{i:02d}.webp'
        success, size = download_image(url, output_path)
        if success and size > 1000:
            print(f"  ✓ 全景图 {i}: {size} bytes")
            # 复制到 0-原始数据
            orig_path = images_dir / '0-原始数据' / f'panorama-{i:02d}.webp'
            with open(output_path, 'rb') as src:
                with open(orig_path, 'wb') as dst:
                    dst.write(src.read())
        elif not success or size < 1000:
            break

    # 统计
    total = sum(len(list((images_dir / cat).glob('*.webp'))) for cat in ['0-原始数据', '1-座椅布局', '2-座椅图片', '3-机上餐食', '4-娱乐设备', '5-其他信息'])
    print(f"  总图片数：{total}")


def main():
    print("="*60)
    print("新加坡航空 A350-900 V.2 和 V.3 图片下载")
    print("="*60)

    # V.1 已有图片，跳过
    download_version_images("V.2", HASHES["V.2"])
    download_version_images("V.3", HASHES["V.3"])

    print("\n" + "="*60)
    print("✅ 完成!")
    print("="*60)


if __name__ == "__main__":
    main()
