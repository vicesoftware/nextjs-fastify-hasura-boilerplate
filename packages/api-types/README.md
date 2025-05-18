# API Types

Shared type definitions for the API used in both frontend and backend applications.

## Health Check Types

This package contains TypeScript interfaces for the health check endpoint response based on the `@nestjs/terminus` package. These types are shared between the NestJS backend and Next.js frontend to ensure type safety when working with API responses.

## Usage

```typescript
import { HealthCheckResponse } from "@repo/api-types";

// Now you can use the type definitions in your code
const response: HealthCheckResponse = await fetch("/api/health").then((res) =>
  res.json(),
);
```
