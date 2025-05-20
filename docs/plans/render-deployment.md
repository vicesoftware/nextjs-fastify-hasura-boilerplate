# Render Deployment <!-- omit in toc -->

Here's a detailed deployment plan using Render's Blueprint (render.yaml) with your monorepo structure:

- [Render.yaml Example](#renderyaml-example)
- [Key Implementation Steps](#key-implementation-steps)
- [Recommended Workflow Options](#recommended-workflow-options)
- [Testing Instructions](#testing-instructions)
- [Redis Integration](#redis-integration)
- [Troubleshooting](#troubleshooting)
- [Implementation Progress](#implementation-progress)

## Render.yaml Example

```yaml
# render.yaml
services:
  - type: web
    name: web
    env: node
    buildFilter:
      paths:
        - apps/web/**
        - packages/**
        - turbo.json
        - pnpm-lock.yaml
        - pnpm-workspace.yaml
    build:
      command: |
        npm install -g pnpm
        pnpm install
        pnpm build --filter=web
    start: |
      cd apps/web && 
      pnpm start
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://api.onrender.com/api
      - key: NODE_ENV
        value: production
    autoDeploy: true
    caching:
      paths:
        - apps/web/node_modules
        - apps/web/.next/cache

  - type: web
    name: api
    env: node
    buildFilter:
      paths:
        - apps/api/**
        - packages/**
        - turbo.json
        - pnpm-lock.yaml
        - pnpm-workspace.yaml
    build:
      command: |
        npm install -g pnpm
        pnpm install
        pnpm build --filter=api
    start: |
      cd apps/api && 
      pnpm start:prod
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres-db
          property: connectionString
      - key: PORT
        value: 4000
      - key: NODE_ENV
        value: production
    healthCheckPath: /api/health
    autoDeploy: true
    addons:
      - type: postgresql
        name: postgres-db
        plan: free
        ipAllowList: []
```

## Key Implementation Steps

**1. Environment Management**

- Use Render's **Secret Files** for sensitive `.env` values
- Configure service-to-service communication via:
  ```env
  # Frontend .env.production
  NEXT_PUBLIC_API_URL=https://api.onrender.com/api
  ```
- For shared types package:
  ```bash
  # Add to both services' build commands
  pnpm install
  pnpm build --filter=api-types
  ```

**2. TurboRepo Optimization**

```bash
# Frontend build optimization
turbo prune --scope=web --docker |
  cd out &&
  pnpm install --frozen-lockfile &&
  pnpm build

# Backend build optimization
turbo prune --scope=api --docker |
  cd out &&
  pnpm install --frozen-lockfile &&
  pnpm build
```

**3. GUI Setup Workflow**

1. Create PostgreSQL addon first
2. Deploy backend service:
   - **Root Directory**: Repository root
   - **Build Command**: `npm install -g pnpm && pnpm install && pnpm build --filter=api`
   - **Start Command**: `cd apps/api && pnpm start:prod`
   - **Health Check Path**: `/api/health`
3. Deploy frontend service:
   - **Root Directory**: Repository root
   - **Build Command**: `npm install -g pnpm && pnpm install && pnpm build --filter=web`
   - **Start Command**: `cd apps/web && pnpm start`
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

**Option 1: Render Blueprint First** ✅

1. Commit `render.yaml` to repo root ✅
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
    value: "true"
  - key: TURBO_TEAM
    value: your-team-name
  - key: TURBO_TOKEN
    sync: false
  - key: PNPM_VERSION
    value: "8.6.0"
```

## Testing Instructions

Follow these steps to verify your Render deployment is working correctly:

1. **Health Check Endpoint** ✅
   - Access the NestJS health endpoint at `https://api.onrender.com/api/health`
   - Verify you receive a `200 OK` response with status information
   - Render automatically monitors this endpoint with the `healthCheckPath` property

2. **Frontend-Backend Communication**
   - Navigate to your frontend application at `https://web.onrender.com`
   - Check that the health status indicator in the UI shows the correct backend status
   - This verifies that the frontend can successfully communicate with the backend API

3. **Database Connection**
   - Access an endpoint that requires database access (e.g., user profile, if implemented)
   - Verify that database operations work as expected
   - Check Render logs for any database connection issues

4. **Environment Variables**
   - Verify all environment variables are correctly set in each service
   - Check the frontend can access necessary backend URLs
   - Ensure sensitive values are properly secured

## Redis Integration

If your application requires Redis for caching, session management, or real-time features, follow these steps to integrate with your Render deployment:

1. **Add Redis Service**
   ```yaml
   # Add to render.yaml
   - type: redis
     name: app-redis
     ipAllowList: []  # Only allow internal connections
     plan: free       # Adjust as needed
   ```

2. **Update Service Environment Variables**
   ```yaml
   # Add to both frontend and backend services
   envVars:
     - key: REDIS_HOST
       fromService:
         name: app-redis
         type: redis
         property: host
     - key: REDIS_PORT
       fromService:
         name: app-redis
         type: redis
         property: port
     - key: REDIS_PASSWORD
       fromService:
         name: app-redis
         type: redis
         property: password
   ```

3. For detailed Redis integration instructions, see the [Redis Integration Guide](../redis-integration-guide.md)

## Troubleshooting

**Common Deployment Issues:**

1. **Build Failures**
   - Check build logs for specific errors
   - Verify all dependencies are correctly specified in package.json
   - Ensure build scripts in package.json are correctly defined

2. **TypeScript Configuration Issues**
   - If you encounter TypeScript errors like `Cannot find name 'Map'` during build:
     - Update the `lib` settings in base TypeScript configuration:
       ```json
       // packages/typescript-config/base.json
       {
         "compilerOptions": {
           "lib": ["es6", "dom", "dom.iterable", "esnext"],
           "target": "es2017"
         }
       }
       ```
     - Ensure proper TypeScript version compatibility between packages
     - Consider updating build commands to explicitly specify TypeScript options:
       ```bash
       npx tsc --lib es6,dom,esnext --target es2017
       ```

3. **Workspace Package Resolution**
   - If shared packages aren't resolved correctly during build:
     - Update the build command to use `--no-frozen-lockfile` for Render builds:
       ```yaml
       build:
         command: |
           npm install -g pnpm@9.0.0
           NODE_ENV=development pnpm install --no-frozen-lockfile
           cd packages/api-types && pnpm build
           # Continue with other builds...
       ```
     - Ensure workspace references use the correct format: `"workspace:*"`
     - Verify the build order respects package dependencies

4. **pnpm Lock File Sync Issues**
   - If you see errors about outdated lockfiles:
     - Update pnpm-lock.yaml before deployment with `pnpm install`
     - Use `--no-frozen-lockfile` during CI/CD builds
     - Consider disabling lockfile validation for specific environments

5. **Runtime Errors**
   - Review Render logs for error messages
   - Verify environment variables are correctly set
   - Check for port conflicts or binding issues

6. **Database Connection Issues**
   - Ensure DATABASE_URL is correctly configured
   - Check database credentials and access permissions
   - Verify database schema migrations have been applied

7. **Service Communication Problems**
   - Confirm internal URLs are correctly formatted
   - Verify that services can communicate over Render's internal network
   - Check for CORS configuration issues in the NestJS backend

**Support Resources:**
- [Render Status Page](https://status.render.com)
- [Render Documentation](https://render.com/docs)
- [Troubleshooting Guide](https://render.com/docs/troubleshooting)

## Implementation Progress

✅ **Completed Tasks:**

1. Created `render.yaml` in repository root with:
   - Correct service names matching the project structure (`web` and `api`)
   - Proper build and start commands using pnpm
   - Configuration for PostgreSQL database
   - Environment variables for service communication
   - Cache path configuration
   - Health check path for API service

2. Updated deployment documentation:
   - Corrected service names
   - Updated testing URLs
   - Added pnpm-specific build commands
   - Added health check path configuration

3. Updated pnpm-lock.yaml to ensure consistency with package.json:
   - Ran `pnpm install` to update the lock file
   - Addressed warnings about peer dependencies

4. Added TypeScript configuration troubleshooting guidance:
   - Solutions for "Cannot find name 'Map'" errors
   - Workspace package resolution fixes
   - pnpm lockfile synchronization strategies

5. Committed and pushed changes to trigger a build in Render

🔄 **Next Steps:**

1. Implement proper handling of shared `api-types` package changes across monorepo services:

## Shared Package Dependency Management

To handle shared `api-types` package changes across monorepo services in Render, implement this dual-layer dependency management:

### 1. Render Configuration (render.yaml)
```yaml
services:
  - type: web
    name: web-app
    rootDir: "apps/web"
    buildFilters:
      includedPaths:
        - "apps/web/**"
        - "packages/api-types/**"  # Monitor shared types
    buildCommand: "npm install && npm run build"

  - type: web
    name: api-service
    rootDir: "apps/api"
    buildFilters:
      includedPaths:
        - "apps/api/**"
        - "packages/api-types/**"  # Monitor shared types
    buildCommand: "npm install && npm run build"
```

### 2. Turborepo Configuration (turbo.json)
```json
{
  "pipeline": {
    "build": {
      "dependsOn": [
        "^build",
        "api-types#build"  # Explicit package dependency
      ],
      "outputs": ["dist/**"]
    },
    "api-types#build": {
      "outputs": ["dist/**"]
    }
  }
}
```

### Dependency Matrix
| Changed Path                | Web Rebuild | API Rebuild |
|-----------------------------|-------------|-------------|
| `apps/web/components/...`   | ✅          | ❌          |
| `apps/api/routes/...`       | ❌          | ✅          |
| `packages/api-types/...`    | ✅          | ✅          |

### Key Mechanisms
1. **Render Build Filters**
   - `includedPaths` watches both service-specific and shared package directories
   - Changes to `api-types` trigger rebuilds for both web and API services

2. **Turborepo Task Dependencies**
   - `dependsOn` ensures `api-types` builds before dependent services
   - Cross-workspace references maintained through package.json entries:
     ```json
     // apps/web/package.json
     {
       "dependencies": {
         "api-types": "workspace:*"
       }
     }
     ```

### Verification Steps
1. Make a change to `packages/api-types/src/types.ts`
2. Check Turborepo build output:
   ```bash
   turbo run build --dry=json
   ```
   Should show both `api-types`, `web`, and `api` in build plan

3. Render build logs should display:
   ```
   Detected changes in: packages/api-types/src/types.ts
   Triggering builds for: web-app, api-service
   ```

This configuration ensures atomic deployments while maintaining cross-service type consistency. For monorepos with deep dependencies, consider adding a global watch pattern in render.yaml:
```yaml
buildFilters:
  includedPaths:
    - "packages/shared/**"  # Catch-all for shared resources
```

2. Verify successful deployment of services
3. Test inter-service communication
4. Add Redis integration when needed (see docs/redis-integration-guide.md)

Note: The implementation uses pnpm instead of npm as the package manager, since this is what the project uses locally.