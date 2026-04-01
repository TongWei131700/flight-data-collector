#!/bin/bash

# 为航司目录创建网页快捷方式
# 用法：./create-airline-shortcuts.sh "Emirates EK" "ek-emirates" "Emirates"

AIRLINE_DIR="$1"        # 航司目录名 (如 "Emirates EK")
AIRLINE_SLUG="$2"       # seatmaps slug (如 "ek-emirates")
AIRLINE_NAME="$3"       # 航司官网名称 (如 "emirates")

BASE_DIR="/Users/dengxinyang/Desktop/AI·Project/FlightData"

if [ -z "$AIRLINE_DIR" ] || [ -z "$AIRLINE_SLUG" ]; then
    echo "用法：$0 <航司目录名> <seatmaps slug> [航司官网名称]"
    echo "示例：$0 \"Emirates EK\" \"ek-emirates\" \"emirates\""
    exit 1
fi

# 默认航司官网名称为 slug 的第一部分
if [ -z "$AIRLINE_NAME" ]; then
    AIRLINE_NAME=$(echo "$AIRLINE_SLUG" | cut -d'-' -f2)
fi

# 创建 seatmaps 快捷方式
SEATMAPS_URL="https://seatmaps.com/zh-CN/airlines/${AIRLINE_SLUG}/"
SEATMAPS_FILE="${BASE_DIR}/${AIRLINE_DIR}/🌐 打开 seatmaps 主页.webloc"

cat > "$SEATMAPS_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>URL</key>
    <string>${SEATMAPS_URL}</string>
</dict>
</plist>
EOF

echo "✅ 已创建：$SEATMAPS_FILE"

# 创建航司官网快捷方式
AIRLINE_URL="https://www.${AIRLINE_NAME}.com/"
AIRLINE_FILE="${BASE_DIR}/${AIRLINE_DIR}/🌐 打开${AIRLINE_NAME}官网.webloc"

cat > "$AIRLINE_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>URL</key>
    <string>${AIRLINE_URL}</string>
</dict>
</plist>
EOF

echo "✅ 已创建：$AIRLINE_FILE"

echo ""
echo "快捷方式已创建在：${BASE_DIR}/${AIRLINE_DIR}/"
ls -la "${BASE_DIR}/${AIRLINE_DIR}/" | grep "🌐"
