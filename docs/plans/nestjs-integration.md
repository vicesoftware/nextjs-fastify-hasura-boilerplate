# NestJS Integration Plan

## Overview

This plan outlines the steps to integrate a NestJS backend into our Turborepo monorepo, with a health check endpoint that will be displayed by the frontend.

## Architecture

- Add a new NestJS application in the `apps/api` directory
- Create a health check endpoint in the NestJS app
- Create shared types between frontend and backend
- Implement a component in the Next.js app to display the health status

## AI Agent Process

**CRITICAL: Follow the AI Agent Process for all tasks**

This project uses a standardized AI Agent Process for task management and implementation.
The full process is documented in [docs/best-practices/ai-agent-process.md](/docs/best-practices/ai-agent-process.md).

Refer to this document when working with AI assistants on any task related to this project.

## Implementation Steps

### 1. Add NestJS Application ✅

- Create a new NestJS app in the `apps/api` directory using NestJS CLI:
  ```bash
  npx @nestjs/cli new apps/api --package-manager=pnpm
  ```
- Adjust the NestJS port to 4000 (since Next.js uses 3000):
  ```typescript
  // In apps/api/src/main.ts
  await app.listen(process.env.PORT ?? 4000);
  ```
- Enable CORS for communication with Next.js frontend
- Added dev and check-types scripts to package.json
- Confirmed app runs on port 4000

### 2. Configure NestJS Health Check ✅

- Create health check controller/endpoint using @nestjs/terminus
- Implement basic health metrics:
  - Server uptime (time since server start)
  - Memory usage check
  - Disk storage check
- Health check endpoint available at `http://localhost:4000/api/health`
- Tested and verified endpoint returns proper health metrics

### 3. Implement Automatic Code Formatting ✅

- Install required packages at root level (concurrently, onchange)
- Add format watcher scripts to each app
- Update dev scripts to run formatters alongside development servers
- Configure Turborepo to support the new scripts
- Update build pipeline to enforce linting standards

To ensure consistent code formatting across the monorepo, we've implemented automatic formatting that runs when files are saved during development:

1. Installed required packages at root level:

   ```bash
   pnpm add -D -w concurrently onchange
   ```

2. Added format watcher scripts to each app package.json:

   ```json
   "format:watch": "onchange \"**/*.{ts,tsx,js,jsx,json,md}\" -- prettier --write {{changed}}"
   ```

3. Updated the dev scripts to run both the development server and format watcher concurrently:

   ```json
   "dev": "concurrently \"original-dev-command\" \"pnpm format:watch\""
   ```

4. Configured Turborepo to support the new scripts in turbo.json:

   ```json
   "format:watch": {
     "cache": false,
     "persistent": true
   }
   ```

5. Enhanced the build pipeline to enforce code quality standards:
   ```json
   "build": {
     "dependsOn": ["^build", "lint", "check-types"],
     "inputs": ["$TURBO_DEFAULT$", ".env*"],
     "outputs": [".next/**", "!.next/cache/**"]
   }
   ```

This implementation:

- Automatically formats files when saved during development
- Enforces linting and type checking during build (for PRs and production)
- Allows developers to work quickly in development without blocking on lint errors
- Requires all lint and type issues to be fixed before code can be merged

### 4. Shared Types ✅

- Create `@repo/api-types` package for shared types
- Define health check response interface based on @nestjs/terminus output
- Configure package for export/import structure for type sharing
- Configure package for use in the frontend
- Successfully integrated with the health controller

### 5. Frontend Integration ✅

- Create component to fetch and display health status
- Add health status indicator to the web app
- Implement error handling for API failures
- Added automatic refresh of health status data every 30 seconds

### 6. Turborepo Configuration ✅

- Update Turborepo configuration to include the NestJS app
- Configure build, dev, and test commands for the API
- Set up proper dependencies between packages
- Fixed dev command to build the project before starting watch mode

### 7. Testing

- Test health check endpoint directly
- Test frontend integration
- Verify error handling works as expected

### 8. CI/CD Setup

- Add GitHub Actions workflow to run build on PRs
- Ensure builds fail if linting or type checking fails
- Set up automatic deployment for main branch

### 9. Fix ESLint IDE integration for the packages

- We need to get better support for eslint in the IDE in all the packages like api-types package

## Development Workflow

1. Start the NestJS server with `pnpm dev --filter=api`
2. Start the Next.js app with `pnpm dev --filter=web`
3. Verify the health check appears on the frontend

## Future Considerations

- Add authentication between frontend and backend
- Implement more comprehensive health metrics
- Add PostgreSQL integration and database health checks
