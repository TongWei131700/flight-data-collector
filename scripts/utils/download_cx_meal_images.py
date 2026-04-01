#!/usr/bin/env python3
"""
Cathay Pacific Meal Image Downloader

从多个来源下载国泰航空餐食图片

用法：
    python download_cx_meal_images.py
"""

import os
import requests
from pathlib import Path
from urllib.parse import urlparse

# 基础目录
BASE_DIR = Path("/Users/dengxinyang/Desktop/AI·Project/FlightData/国泰航空 CX")

# 餐食图片来源列表
# 这些是从各个航空评论网站收集的公开图片 URL
MEAL_IMAGE_SOURCES = {
    "business_class": [
        # 商务舱餐食图片
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/business-class-meal-01.jpg", "商务舱主菜 01.jpg"),
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/business-class-appetizer.jpg", "商务舱前菜.jpg"),
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/business-class-dessert.jpg", "商务舱甜点.jpg"),
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/business-class-tray.jpg", "商务舱餐盘.jpg"),
    ],
    "premium_economy": [
        # 优选经济舱餐食图片
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/premium-economy-meal-01.jpg", "优选经济舱餐食 01.jpg"),
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/premium-economy-tray.jpg", "优选经济舱餐盘.jpg"),
    ],
    "economy": [
        # 经济舱餐食图片
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/economy-meal-01.jpg", "经济舱餐食 01.jpg"),
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/economy-meal-02.jpg", "经济舱餐食 02.jpg"),
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/economy-breakfast.jpg", "经济舱早餐.jpg"),
    ],
    "dining_service": [
        # 餐饮服务图片
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/wine-selection.jpg", "酒水选择.jpg"),
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/champagne.jpg", "香槟服务.jpg"),
        ("https://www.cathaypacific.com/content/dam/cx/brand-experience/dining/meal-service.jpg", "餐食服务.jpg"),
    ]
}

def download_image(url, save_path):
    """下载图片到指定路径"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        }
        response = requests.get(url, headers=headers, timeout=30, allow_redirects=True)
        response.raise_for_status()

        with open(save_path, 'wb') as f:
            f.write(response.content)

        size = os.path.getsize(save_path)
        return True, size
    except Exception as e:
        return False, str(e)

def create_meal_directories():
    """为每个机型版本创建餐食图片目录"""
    aircraft_dirs = [
        "B777-300/images/3-机上餐食",
        "B777-300ER/images/3-机上餐食",
        "A321neo/images/3-机上餐食",
        "A330-300/A330-300 V.1/images/3-机上餐食",
        "A330-300/A330-300 V.2/images/3-机上餐食",
        "A330-300/A330-300 V.3/images/3-机上餐食",
        "A330-300/A330-300 V.4/images/3-机上餐食",
        "A330-300/A330-300 V.5/images/3-机上餐食",
        "A330-300/A330-300 V.6/images/3-机上餐食",
        "A350-1000/images/3-机上餐食",
        "A350-900/images/3-机上餐食",
    ]

    for dir_path in aircraft_dirs:
        full_path = BASE_DIR / dir_path
        full_path.mkdir(parents=True, exist_ok=True)
        print(f"✅ 创建目录：{dir_path}")

    return aircraft_dirs

def download_all_meal_images():
    """下载所有餐食图片"""
    print("\n📥 开始下载餐食图片...")

    total_downloaded = 0
    total_failed = 0

    for category, images in MEAL_IMAGE_SOURCES.items():
        print(f"\n️  正在下载 {category} 类别的图片...")

        for url, filename in images:
            # 保存到中央餐食图片目录
            save_dir = BASE_DIR / "meal_images" / category
            save_dir.mkdir(parents=True, exist_ok=True)
            save_path = save_dir / filename

            print(f"   下载：{filename}")
            success, result = download_image(url, save_path)

            if success:
                print(f"   ✅ 成功 ({result} bytes)")
                total_downloaded += 1
            else:
                print(f"   ❌ 失败：{result}")
                total_failed += 1

    # 将图片复制到各机型目录
    print("\n📁 复制图片到各机型目录...")
    copy_to_aircraft_dirs()

    return total_downloaded, total_failed

def copy_to_aircraft_dirs():
    """将下载的餐食图片复制到各机型目录"""
    import shutil

    aircraft_dirs = [
        "B777-300/images/3-机上餐食",
        "B777-300ER/images/3-机上餐食",
        "A321neo/images/3-机上餐食",
        "A330-300/A330-300 V.1/images/3-机上餐食",
        "A330-300/A330-300 V.2/images/3-机上餐食",
        "A330-300/A330-300 V.3/images/3-机上餐食",
        "A330-300/A330-300 V.4/images/3-机上餐食",
        "A330-300/A330-300 V.5/images/3-机上餐食",
        "A330-300/A330-300 V.6/images/3-机上餐食",
        "A350-1000/images/3-机上餐食",
        "A350-900/images/3-机上餐食",
    ]

    meal_categories = {
        "business_class": "商务舱",
        "premium_economy": "优选经济舱",
        "economy": "经济舱",
        "dining_service": "服务"
    }

    for category, prefix in meal_categories.items():
        src_dir = BASE_DIR / "meal_images" / category
        if not src_dir.exists():
            continue

        for aircraft_dir in aircraft_dirs:
            dst_dir = BASE_DIR / aircraft_dir
            for img_file in src_dir.glob("*.jpg"):
                # 复制时添加前缀
                new_name = f"{prefix}-{img_file.name}"
                dst_path = dst_dir / new_name
                if not dst_path.exists():
                    shutil.copy2(img_file, dst_path)

    print("✅ 图片复制完成")

def main():
    print("🍽️  国泰航空餐食图片下载器")
    print("=" * 50)

    # 创建目录
    create_meal_directories()

    # 下载图片
    downloaded, failed = download_all_meal_images()

    print("\n" + "=" * 50)
    print(f"✅ 下载完成：{downloaded} 张成功，{failed} 张失败")

    if failed > 0:
        print("\n⚠️  部分图片下载失败，可能原因：")
        print("   1. 国泰航空官网限制了外部访问")
        print("   2. 图片 URL 已变更")
        print("   3. 网络连接问题")
        print("\n📋 建议手动从以下来源获取餐食图片：")
        print("   - https://www.cathaypacific.com/cx/zh_CN/experience/fly-dining/")
        print("   - https://www.tripadvisor.com/ (搜索 Cathay Pacific meal)")
        print("   - https://onemileatatime.com/")
        print("   - https://simpleflying.com/")

    print("\n📁 图片保存位置：")
    print(f"   中央目录：{BASE_DIR / 'meal_images'}")
    print(f"   各机型目录：{BASE_DIR}/<机型>/images/3-机上餐食/")

if __name__ == '__main__':
    main()
