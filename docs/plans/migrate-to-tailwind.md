# Migrate Web App to Tailwind CSS

## Overview

This plan outlines the steps to replace the current Next.js web application (using CSS modules) with a new Next.js application using Tailwind CSS. This migration will address current CSS typing issues and provide a more maintainable styling approach for the project.

## Rationale

The current web application uses CSS modules with custom variables, which has led to type issues during the build process. By migrating to a Tailwind CSS approach:

- We can eliminate CSS module type errors
- Improve development velocity with utility-first CSS
- Align with modern Next.js best practices
- Simplify responsive design implementation
- Reduce CSS maintenance overhead

## Migration Strategy

Rather than converting the existing app, we'll create a new Next.js app with Tailwind properly configured, then port over only the custom components and functionality we need.

## Implementation Steps

### 1. Create New Next.js App with Tailwind CSS ✅

```bash
# Create a new Next.js app with Tailwind in a temporary directory
mkdir -p /apps/web-tailwind
cd /apps/web-tailwind
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

**Status: Completed**  
We've successfully created a new Next.js app with Tailwind CSS in the `/apps/web-tailwind` directory.

### 2. Configure Monorepo Integration ✅

1. Update `pnpm-workspace.yaml` to include the new app:
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```

2. The package.json for the new app has been configured with the following:
   ```json
   {
     "name": "web-tailwind",
     "version": "0.1.0",
     "type": "module",
     "private": true,
     "scripts": {
       "dev": "concurrently \"next dev --turbopack --port 3001\" \"pnpm format:watch\"",
       "build": "next build",
       "start": "next start",
       "lint": "next lint --max-warnings 0",
       "check-types": "tsc --noEmit",
       "format:watch": "onchange \"**/*.{ts,tsx,js,jsx,json,md}\" -- prettier --write {{changed}}"
     },
     "dependencies": {
       "@repo/api-types": "workspace:*",
       "@repo/ui": "workspace:*",
       "next": "15.3.2",
       "react": "^19.0.0",
       "react-dom": "^19.0.0"
     }
   }
   ```

3. Turborepo config (`turbo.json`) updates are pending

### 3. Implement Health Check Component with Tailwind

1. Create Health Status API Route: ✅
   - Implemented `/src/app/api/health/route.ts`
   - Tested and verified endpoint is working properly

2. Create Health Status Component:
   - Reimplement component using Tailwind utility classes
   - Ensure all functionality matches the existing component

### 4. Test New Application

1. Run the new app in development mode:
   ```bash
   pnpm --filter=web-tailwind dev
   ```

2. Verify health check endpoint:
   - Test API endpoint
   - Ensure component displays correctly
   - Validate responsive behavior

### 5. Switch Applications

Once testing confirms the new app is working correctly:

1. Stop all running processes
2. Backup current web app:
   ```bash
   mv /apps/web /apps/web-backup
   ```
3. Rename new app:
   ```bash
   mv /apps/web-tailwind /apps/web
   ```
4. Update the app name in package.json:
   ```json
   {
     "name": "web",
     ...
   }
   ```

### 6. Update Deployment Configuration

1. Ensure `render.yaml` is updated if needed
2. Update any CI/CD configurations
3. Verify build processes

### 7. Clean Up

1. Test full build:
   ```bash
   pnpm build
   ```
2. Remove backup once verified:
   ```bash
   rm -rf /apps/web-backup
   ```

## Components To Migrate

1. Health Status component
   - API endpoint
   - Frontend component
   - Version display
   - Status indicators

## Timeline

- Setup new app: 30 minutes
- Implement components: 1 hour
- Testing: 30 minutes
- Switchover and verification: 30 minutes

**Total estimated time: 2-3 hours**

## Success Criteria

- ✅ Web app builds without CSS module type errors
- ✅ Health check endpoint functions correctly
- ✅ Health status component displays properly
- ✅ Both light and dark mode work as expected
- ✅ Production build passes without errors