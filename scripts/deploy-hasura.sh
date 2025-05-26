#!/bin/bash
set -e

echo "🚀 Starting Hasura deployment sync..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
  echo "Database not ready, waiting..."
  sleep 2
done

# Install Hasura CLI if not present
if ! command -v hasura &> /dev/null; then
  echo "📦 Installing Hasura CLI..."
  curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
fi

# Export current metadata from running Hasura instance
echo "📤 Exporting current metadata..."
cd hasura
hasura metadata export --endpoint $HASURA_URL --admin-secret $HASURA_ADMIN_SECRET

# Auto-track any new tables that aren't tracked
echo "🔍 Auto-tracking new tables..."
hasura metadata reload --endpoint $HASURA_URL --admin-secret $HASURA_ADMIN_SECRET

# Apply any metadata changes
echo "✅ Applying metadata..."
hasura metadata apply --endpoint $HASURA_URL --admin-secret $HASURA_ADMIN_SECRET

echo "🎉 Hasura deployment sync complete!" 