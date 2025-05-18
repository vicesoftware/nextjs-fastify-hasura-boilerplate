# Render Deployment <!-- omit in toc -->

Here's a detailed deployment plan using Render's Blueprint (render.yaml) with your monorepo structure:

- [Render.yaml Example](#renderyaml-example)
- [Key Implementation Steps](#key-implementation-steps)
- [Recommended Workflow Options](#recommended-workflow-options)

## Render.yaml Example

```yaml
# render.yaml
services:
  - type: web
    name: nextjs-frontend
    env: node
    build:
      command: |
        cd apps/web && 
        npm install --force && 
        npm run build
    start: |
      cd apps/web && 
      npm start
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://nestjs-backend.onrender.com
    autoDeploy: true
    caching:
      paths:
        - /apps/web/node_modules

  - type: web
    name: nestjs-backend
    env: node
    build:
      command: |
        cd apps/api && 
        npm install --force && 
        npm run build
    start: |
      cd apps/api && 
      npm run start:prod
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres-db
          property: connectionString
      - key: PORT
        value: 3001
    autoDeploy: true
    addons:
      - type: postgresql
        name: postgres-db
        plan: free
```

## Key Implementation Steps

**1. Environment Management**

- Use Render's **Secret Files** for sensitive `.env` values
- Configure service-to-service communication via:
  ```env
  # Frontend .env.production
  NEXT_PUBLIC_API_URL=${{ services.nestjs-backend.env.PUBLIC_URL }}
  ```
- For shared types package:
  ```bash
  # Add to both services' build commands
  npm install --workspace=packages/api-types
  ```

**2. TurboRepo Optimization**

```bash
# Frontend build optimization
turbo prune --scope=web --docker |
  cd out &&
  npm ci --omit=dev &&
  npm run build

# Backend build optimization
turbo prune --scope=api --docker |
  cd out &&
  npm ci --omit=dev &&
  npm run build
```

**3. GUI Setup Workflow**

1. Create PostgreSQL addon first
2. Deploy backend service:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
3. Deploy frontend service:
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Connect services via **Internal Network Binding**

**4. Critical Paths for Caching**

```
├── apps/
│   ├── web/
│   │   ├── .next/cache
│   ├── api/
│   │   ├── dist/
├── packages/
│   ├── api-types/
│   │   ├── dist/
```

## Recommended Workflow Options

**Option 1: Render Blueprint First**

1. Commit `render.yaml` to repo root
2. Connect repo to Render
3. Services auto-provision with monorepo awareness

**Option 2: GUI First + YAML Export**

1. Manually create services in Render Dashboard
2. Use **Export as YAML** from service settings
3. Merge generated YAML with monorepo structure

**For Turbo Build Acceleration:**

```yaml
# Global build settings
envVars:
  - key: TURBO_REMOTE_ONLY
    value: true
  - key: TURBO_TEAM
    value: your-team-name
  - key: TURBO_TOKEN
    sync: false
```
