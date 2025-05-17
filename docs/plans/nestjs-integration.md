# NestJS Integration Plan

## Overview
This plan outlines the steps to integrate a NestJS backend into our Turborepo monorepo, with a health check endpoint that will be displayed by the frontend.

## Architecture
- Add a new NestJS application in the `apps/api` directory
- Create a health check endpoint in the NestJS app
- Create shared types between frontend and backend
- Implement a component in the Next.js app to display the health status

## Process
1. Review task list and pick next unstarted task
1. Ask any clarifying questions and number them for easy answering
1. Implement a task
1. Ask developer to verify it's working
1. Update documentation to concisely indicate task is complete using emojis
1. Commit
1. Ask if we should start next task

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

### 3. Implement Automatic Code Formatting
- Install required packages at root level (concurrently, onchange)
- Add format watcher scripts to each app
- Update dev scripts to run formatters alongside development servers
- Configure Turborepo to support the new scripts

To ensure consistent code formatting across the monorepo, we'll implement automatic formatting that runs when files are saved during development:

1. Install required packages at root level:
   ```bash
   pnpm add -D concurrently onchange
   ```

2. Add format watcher scripts to each app package.json:
   ```json
   "format:watch": "onchange \"**/*.{ts,tsx,js,jsx,json,md}\" -- prettier --write {{changed}}"
   ```

3. Update the dev scripts to run both the development server and format watcher concurrently:
   ```json
   "dev": "concurrently \"original-dev-command\" \"pnpm format:watch\""
   ```

4. Configure Turborepo to support the new scripts in turbo.json

This approach will automatically format files in each app when saved during development.

### 4. Shared Types
- Create `@repo/api-types` package for shared types
- Define health check response interface
- Configure package for use in both frontend and backend

### 5. Frontend Integration
- Create component to fetch and display health status
- Add health status indicator to the web app
- Implement error handling for API failures

### 6. Turborepo Configuration
- Update Turborepo configuration to include the NestJS app
- Configure build, dev, and test commands for the API
- Set up proper dependencies between packages

### 7. Testing
- Test health check endpoint directly
- Test frontend integration
- Verify error handling works as expected

## Development Workflow
1. Start the NestJS server with `pnpm dev --filter=api`
2. Start the Next.js app with `pnpm dev --filter=web`
3. Verify the health check appears on the frontend

## Future Considerations
- Add authentication between frontend and backend
- Implement more comprehensive health metrics
- Add PostgreSQL integration and database health checks

