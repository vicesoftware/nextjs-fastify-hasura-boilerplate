# API Implementation Selection Guide

This project supports multiple API implementations that can be switched between as needed. This guide explains how to use and test different API implementations.

## Available API Implementations

The project currently supports the following API implementations:

1. **Fastify API** (default) - Located in `apps/api-fastify`
2. **NestJS API** - Located in `apps/api` 
3. **Next.js API Routes** - Built into the web app in `apps/web/src/app/api`

## Local Development

### Running the Fastify API

To run the Fastify API locally:

```bash
# From the project root
cd apps/api-fastify
pnpm install
pnpm dev
```

The Fastify API will be available at http://localhost:5001/api/health

### Running the Next.js App with Different API Backends

You can configure which API backend to use by setting the `NEXT_PUBLIC_API_URL` environment variable when running the Next.js app:

```bash
# Use the local Fastify API
cd apps/web
API_IMPLEMENTATION=fastify pnpm dev

# Use the local NestJS API
cd apps/web
API_IMPLEMENTATION=nestjs pnpm dev

# Use the local Next.js API routes
cd apps/web
API_IMPLEMENTATION=nextjs pnpm dev

# You can also override the specific API URL if needed
cd apps/web
API_IMPLEMENTATION=fastify NEXT_PUBLIC_API_URL_FASTIFY=http://localhost:5001/api pnpm dev
```

## Deployment Configuration

In the deployment configuration (render.yaml), you can control which API implementation is used by setting the `API_IMPLEMENTATION` environment variable:

```yaml
# In render.yaml
envVars:
  - key: API_IMPLEMENTATION
    value: "nestjs" # Options: "nestjs", "fastify", "nextjs"
```

This value is then passed to the Next.js app to display which API implementation is currently being used.

## API URL Configuration

The web app connects to the API using a combination of `API_IMPLEMENTATION` and specific API URL environment variables:

```yaml
# Environment variables for different API implementations
NEXT_PUBLIC_API_URL_NESTJS: https://api-82a7.onrender.com/api
NEXT_PUBLIC_API_URL_FASTIFY: https://api-fastify-xxxx.onrender.com/api
NEXT_PUBLIC_API_URL_NEXTJS: /api

# The implementation to use
API_IMPLEMENTATION: fastify
```

The web app will automatically use the correct API URL based on the selected implementation. You can also use the legacy `NEXT_PUBLIC_API_URL` variable as a fallback.

## Implementation Differences

All API implementations provide the same core functionality but may have different performance characteristics or implementation details:

1. **NestJS API**
   - Full-featured framework with dependency injection
   - Built-in health monitoring
   - More heavyweight solution

2. **Fastify API**
   - Lightweight and high-performance
   - Simpler implementation
   - Good for microservices

3. **Next.js API Routes**
   - Integrated with the web app
   - Serverless by default
   - Good for simple APIs without separate deployment

## Testing and Evaluation

When evaluating different API implementations, consider the following factors:

1. **Performance** - Response times and throughput
2. **Developer Experience** - Ease of implementation and maintenance
3. **Deployment Complexity** - Infrastructure requirements
4. **Scaling Characteristics** - Behavior under load
5. **Cost** - Resources required for running each implementation