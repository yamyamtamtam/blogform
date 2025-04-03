#!/bin/bash

CONTAINER_NAME="dynamodb-local"

# DynamoDB Localを起動
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
  echo "✅ $CONTAINER_NAME コンテナはすでに存在します。起動します..."
  docker start $CONTAINER_NAME
else
  echo "🚀 $CONTAINER_NAME コンテナを新規作成して起動します..."
  docker run -d \
    -p 8000:8000 \
    --name $CONTAINER_NAME \
    amazon/dynamodb-local
fi

# テーブル作成
echo "📋 DynamoDB テーブル 'ContactSession' を作成します..."
CREATE_OUTPUT=$(aws dynamodb create-table \
  --table-name ContactSession \
  --attribute-definitions AttributeName=sessionId,AttributeType=S \
  --key-schema AttributeName=sessionId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000 2>&1)

if echo "$CREATE_OUTPUT" | grep -q 'ResourceInUseException'; then
  echo "⚠️ テーブル 'ContactSession' はすでに存在しています。"

  # TTL状態を確認
  TTL_STATUS=$(aws dynamodb describe-time-to-live \
    --table-name ContactSession \
    --endpoint-url http://localhost:8000 \
    --output json | jq -r '.TimeToLiveDescription.TimeToLiveStatus')

  if [ "$TTL_STATUS" == "ENABLED" ]; then
    echo "✅ TTL（expireAt）はすでに有効です。"
  else
    echo "🔧 TTL（expireAt）を有効にします..."
    aws dynamodb update-time-to-live \
      --table-name ContactSession \
      --time-to-live-specification "Enabled=true, AttributeName=expireAt" \
      --endpoint-url http://localhost:8000
  fi

else
  echo "✅ テーブル作成成功！"

  echo "⏳ TTL（expireAt）を有効にします..."
  aws dynamodb update-time-to-live \
    --table-name ContactSession \
    --time-to-live-specification "Enabled=true, AttributeName=expireAt" \
    --endpoint-url http://localhost:8000
fi
