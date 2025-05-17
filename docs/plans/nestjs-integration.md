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

### 2. Configure NestJS Health Check
- Create health check controller/endpoint
- Implement basic health metrics (uptime, status)
- Document API endpoint

### 3. Shared Types
- Create `@repo/api-types` package for shared types
- Define health check response interface
- Configure package for use in both frontend and backend

### 4. Frontend Integration
- Create component to fetch and display health status
- Add health status indicator to the web app
- Implement error handling for API failures

### 5. Turborepo Configuration
- Update Turborepo configuration to include the NestJS app
- Configure build, dev, and test commands for the API
- Set up proper dependencies between packages

### 6. Testing
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