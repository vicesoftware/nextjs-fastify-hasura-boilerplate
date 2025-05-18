# Next.js + NestJS + Postgres Boilerplate <!-- omit in toc -->

- [Overview](#overview)
- [📋 Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build](#build)
- [🏗️ Architecture](#️-architecture)
- [What's inside?](#whats-inside)
  - [Apps and Packages](#apps-and-packages)
  - [Architectural Features](#architectural-features)
- [🧰 Developer Experience Features](#-developer-experience-features)
  - [Automatic Code Formatting](#automatic-code-formatting)
  - [Build Pipeline Quality Checks](#build-pipeline-quality-checks)
- [🔄 Type Sharing Example: Health Check](#-type-sharing-example-health-check)
- [🔮 Future Integrations](#-future-integrations)
  - [Redis Integration Plan](#redis-integration-plan)
- [🚀 Deployment](#-deployment)
  - [Utilities](#utilities)
  - [Build](#build-1)
  - [Develop](#develop)
  - [Remote Caching](#remote-caching)
- [📚 Learn More](#-learn-more)

## Overview

A full-stack TypeScript monorepo boilerplate built with Turborepo, featuring:

- 🚀 **Next.js** for frontend
- 🦅 **NestJS** for backend API
- 🐘 **PostgreSQL** for database
- 🔄 **Type sharing** between frontend and backend
- ✨ **Automatic code formatting** during development

## 📋 Quick Start Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PNPM](https://pnpm.io/) (`npm install -g pnpm`)
- [PostgreSQL](https://www.postgresql.org/) (optional for local development)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nextjs-nestjs-postgres-boilerplate.git
cd nextjs-nestjs-postgres-boilerplate

# Install dependencies
pnpm install
```

### Development

Start all applications at once:

```bash
pnpm dev
```

Or run specific applications:

```bash
# Frontend only
pnpm dev --filter=web

# Backend API only
pnpm dev --filter=api

# Documentation site
pnpm dev --filter=docs
```

### Build

```bash
# Build all applications
pnpm build
```

## 🏗️ Architecture

```
├── apps/
│   ├── api/                 # NestJS backend
│   ├── web/                 # Next.js frontend
│   └── docs/                # Documentation site
├── packages/
│   ├── api-types/           # Shared types between frontend & backend
│   ├── eslint-config/       # Shared ESLint configs
│   └── typescript-config/   # Shared TypeScript configs
└── turbo.json               # Turborepo configuration
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `api`: a [NestJS](https://nestjs.com/) backend
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/api-types`: shared TypeScript interfaces between frontend and backend

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Architectural Features

This boilerplate integrates Next.js (frontend) and NestJS (backend) in a monorepo structure:

1. **Isolation**: Each application runs in its own workspace while sharing common configurations and types
2. **Type Safety**: Full end-to-end type safety with shared types between frontend and backend
3. **Development Experience**: Automatic code formatting, linting, and type checking
4. **Performance**: Fast builds and development with Turborepo's caching
5. **Scalability**: Ready for production with health checks and monitoring

## 🧰 Developer Experience Features

### Code Quality Workflow

This repository includes a zero-configuration code quality workflow:

#### ✨ Automatic Code Formatting

**Files are automatically formatted when you save them - no setup required!**

- Prettier automatically formats your code on save during development
- The format watcher runs in the background when you use `pnpm dev`
- No IDE/editor configuration needed - it just works!

```json
// From package.json
"format:watch": "onchange \"**/*.{ts,tsx,js,jsx,json,md}\" -- prettier --write {{changed}}"
```

You can also manually format all files:

```bash
pnpm format
```

#### 🔍 ESLint for Code Quality

ESLint is used for code quality checks, not formatting:

- Run linting checks with `pnpm lint`
- ESLint catches potential bugs and code quality issues
- Formatting concerns are completely delegated to Prettier

#### ✅ Build Pipeline Checks

The build pipeline enforces code quality checks:

- Linting and type checking are required for successful builds
- Type errors prevent deployments, ensuring type safety
- Development mode is fast, but CI/CD enforces quality standards

```json
// From turbo.json
"build": {
  "dependsOn": ["^build", "lint", "check-types"],
  "outputs": [".next/**", "!.next/cache/**"]
}
```

## 🔄 Type Sharing Example: Health Check

This boilerplate demonstrates type sharing with a health check feature:

1. **Backend**: The NestJS health controller provides server health metrics
2. **Shared Types**: The `@repo/api-types` package defines the health check response type
3. **Frontend**: The Next.js app consumes and displays the health data with full type safety

Example from the health controller:

```typescript
// apps/api/src/health/health.controller.ts
@Get()
@HealthCheck()
async check(): Promise<HealthCheckResponse> {
  const result = await this.health.check([
    // Health check implementations
  ]);

  // Uses the shared type from @repo/api-types
  return result as unknown as HealthCheckResponse;
}
```

Frontend component with type safety:

```typescript
// apps/web/components/health-status.tsx
import { HealthCheckResponse } from "@repo/api-types";

// Component uses the shared type for full type safety
const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
```

## 🔮 Future Integrations

### Redis Integration Plan

Redis integration is planned for improving application performance and scalability. The detailed plan is available in [docs/redis-integration-guide.md](docs/redis-integration-guide.md).

Key implementation timelines:

- **100+ concurrent users**: Add Redis for API response caching
- **1,000+ users**: Implement Redis for session management
- **10,000+ users**: Use Redis for rate limiting and WebSocket scaling

Common use cases that will be implemented:

- Caching frequent database queries
- Session management across multiple API instances
- API rate limiting for security
- WebSocket scaling for real-time features

## 🚀 Deployment

This boilerplate can be deployed to Render using the blueprint approach. See [docs/plans/render-depolyment.md](docs/plans/render-depolyment.md) for detailed deployment instructions.

Key deployment features:

- Automatic deployments on Git push
- Environment variable management
- PostgreSQL integration
- Redis add-on (when needed)

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## 📚 Learn More

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

Other documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
