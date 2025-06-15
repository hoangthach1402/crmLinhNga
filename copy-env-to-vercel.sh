#!/bin/bash

# Script để copy environment variables từ .env.local để paste vào Vercel

echo "=== VERCEL ENVIRONMENT VARIABLES ==="
echo ""

if [ ! -f ".env.local" ]; then
    echo "❌ File .env.local không tồn tại!"
    exit 1
fi

echo "📋 Copy các giá trị sau vào Vercel Dashboard > Settings > Environment Variables:"
echo ""

# Đọc file .env.local và format cho Vercel
while IFS='=' read -r key value; do
    # Bỏ qua dòng trống và dòng comment
    if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
        echo "---"
        echo "🔑 Name: $key"
        echo "💾 Value: $value"
        echo "🌍 Environment: Production, Preview, Development"
        echo ""
    fi
done < .env.local

echo "---"
echo ""
echo "✅ Hoàn thành! Paste các giá trị trên vào Vercel Dashboard."
echo ""
echo "🔗 Link: https://vercel.com/dashboard > [Your Project] > Settings > Environment Variables"
