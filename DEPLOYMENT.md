# Deployment Guide

## Render Configuration

### File-Based Configuration (render.yaml)

The repository includes a `render.yaml` file with the correct build configuration using Turborepo. If Render is reading from this file, no manual configuration is needed.

### Dashboard Configuration Override

If Render is using dashboard configuration instead of the file, update the API service build command to:

```bash
export NODE_ENV=production
corepack enable
pnpm install --no-frozen-lockfile
pnpm build --filter=api
```

### Turborepo Build Approach (Recommended)

The build commands use Turborepo's dependency management:

- **Web**: `pnpm build --filter=web`
- **API**: `pnpm build --filter=api`

Turborepo automatically:

1. Builds `shared-types` package first (dependency of `api-types`)
2. Builds `api-types` package second (dependency of `api`)
3. Builds the target application last
4. Skips unchanged packages (smart caching)
5. Runs independent builds in parallel

### Troubleshooting

**Error: Cannot find module '@repo/shared-types'**

- This means the `shared-types` package wasn't built before the API
- Ensure you're using the Turborepo command: `pnpm build --filter=api`
- Turborepo should automatically handle dependency building

**Build Command Not Found**

- Ensure Turborepo is installed: `pnpm install` should install it
- Verify `turbo.json` exists in the repository root
- Check that the filter target exists: `api` should match the package name

**Dependency Resolution Issues**

- Verify `turbo.json` has correct dependency configuration:
  ```json
  {
    "tasks": {
      "build": {
        "dependsOn": ["^build"]
      }
    }
  }
  ```

### Legacy Manual Approach (Not Recommended)

If Turborepo isn't working, you can manually build dependencies:

```bash
export NODE_ENV=production
corepack enable
pnpm install --no-frozen-lockfile
cd packages/shared-types && pnpm build
cd ../api-types && pnpm build
cd ../../apps/api && pnpm build
```

However, this approach is fragile and doesn't scale well.
