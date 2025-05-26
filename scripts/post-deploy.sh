#!/bin/bash
set -e

echo "🚀 Post-deployment Hasura sync starting..."

# Wait for API to be healthy
echo "⏳ Waiting for API to be ready..."
for i in {1..30}; do
  if curl -f "$NEXT_PUBLIC_API_URL/health" > /dev/null 2>&1; then
    echo "✅ API is ready"
    break
  fi
  echo "API not ready, attempt $i/30..."
  sleep 10
done

# Sync Hasura with database schema
echo "🔄 Syncing Hasura with database schema..."
SYNC_RESPONSE=$(curl -s -X POST "$NEXT_PUBLIC_API_URL/hasura/sync" \
  -H "Content-Type: application/json")

echo "📊 Sync result: $SYNC_RESPONSE"

# Check if sync was successful
if echo "$SYNC_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Hasura sync completed successfully"
else
  echo "❌ Hasura sync failed"
  echo "$SYNC_RESPONSE"
  exit 1
fi

echo "🎉 Post-deployment sync complete!" 