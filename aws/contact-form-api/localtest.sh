#!/bin/bash

echo "🔨 SAM Build 開始..."
sam build -t template.yaml

if [ $? -ne 0 ]; then
  echo "❌ build に失敗しました。"
  exit 1
fi

echo "🚀 ローカルAPIサーバー起動（ポート3001）"
sam local start-api --port 3001 -t template.yaml
