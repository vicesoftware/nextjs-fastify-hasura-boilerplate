# Next.js + Fastify + PostgreSQL + Hasura Boilerplate <!-- omit from toc -->

> **🚨 MANDATORY DEVELOPER SETUP REQUIRED** 🚨  
> **All developers MUST complete the [Developer Setup](#-mandatory-developer-setup) section before starting development.**

- [🎯 **LIVE DEMO: Activity History Feature**](#-live-demo-activity-history-feature)
  - [🚀 **Try It Right Now** (2 minutes)](#-try-it-right-now-2-minutes)
  - [🎯 **What You'll See**](#-what-youll-see)
  - [📖 **Complete Documentation**](#-complete-documentation)
  - [🚀 Why Hasura? Accelerated Development with Auto-Generated APIs](#-why-hasura-accelerated-development-with-auto-generated-apis)
    - [🔥 **Instant CRUD Operations**](#-instant-crud-operations)
    - [⚡ **Development Speed Benefits**](#-development-speed-benefits)
    - [🛠️ **Perfect for Rapid Prototyping**](#️-perfect-for-rapid-prototyping)
    - [📊 **Production-Ready Features**](#-production-ready-features)
  - [🎯 Activity History Feature: Hasura CRUD Demonstration](#-activity-history-feature-hasura-crud-demonstration)
    - [🚀 **Live Demo \& Documentation**](#-live-demo--documentation)
    - [🎯 **What It Demonstrates**](#-what-it-demonstrates)
    - [🏃‍♂️ **Quick Start to See It in Action**](#️-quick-start-to-see-it-in-action)
  - [📋 Quick Start Guide](#-quick-start-guide)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
    - [Build](#build)
  - [🏗️ Architecture](#️-architecture)
    - [Enhanced Health Check System](#enhanced-health-check-system)
    - [API Gateway Pattern: Unified API + Complex Business Logic](#api-gateway-pattern-unified-api--complex-business-logic)
      - [🛡️ **API Gateway (Fastify) - For Complex Business Logic**](#️-api-gateway-fastify---for-complex-business-logic)
      - [🚀 **Hasura GraphQL - For CRUD \& Sophisticated Queries**](#-hasura-graphql---for-crud--sophisticated-queries)
      - [🎯 **When to Use Which Layer**](#-when-to-use-which-layer)
      - [🔄 **Integration Benefits**](#-integration-benefits)
    - [Database Schema](#database-schema)
    - [Version Tracking \& Deployment Metadata](#version-tracking--deployment-metadata)
  - [What's inside?](#whats-inside)
    - [Apps and Packages](#apps-and-packages)
    - [Architectural Features](#architectural-features)
  - [🧰 Developer Experience Features](#-developer-experience-features)
    - [Code Quality Workflow](#code-quality-workflow)
      - [✨ Automatic Code Formatting](#-automatic-code-formatting)
      - [🔍 ESLint for Code Quality](#-eslint-for-code-quality)
      - [✅ Build Pipeline Checks](#-build-pipeline-checks)
  - [🔄 Type Sharing Example: Enhanced Health Check](#-type-sharing-example-enhanced-health-check)
  - [🔮 Future Integrations](#-future-integrations)
    - [Redis Integration Plan](#redis-integration-plan)
  - [🚀 Deployment](#-deployment)
    - [Environment Variables](#environment-variables)
      - [Web Application (Next.js)](#web-application-nextjs)
      - [API Application (Fastify)](#api-application-fastify)
      - [Hasura Configuration](#hasura-configuration)
      - [Database Configuration](#database-configuration)
    - [Utilities](#utilities)
    - [Build](#build-1)
    - [Develop](#develop)
    - [Remote Caching](#remote-caching)
  - [📚 Learn More](#-learn-more)

## 🚨 MANDATORY Developer Setup

**⚠️ ALL DEVELOPERS MUST COMPLETE THIS SETUP BEFORE CONTRIBUTING CODE ⚠️**

This ensures code quality and prevents build failures. **PRs will be rejected if this setup is not completed.**

### 1. Install Pre-commit Hooks (REQUIRED)

```bash
# Install Husky and lint-staged
pnpm add -D husky lint-staged

# Initialize Husky (creates .husky/ directory)
npx husky init

# Set up pre-commit hook
echo "pnpm validate" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### 2. VS Code Setup (RECOMMENDED)

If using VS Code, install these essential extensions:

- **ESLint** (`ms-vscode.vscode-eslint`) - Shows linting errors in real-time
- **Prettier** (`esbenp.prettier-vscode`) - Auto-formats code on save
- **TypeScript Importer** (`pmneo.tsimporter`) - Auto-imports TypeScript types

**VS Code Workspace Settings** (automatically configured):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["typescript", "typescriptreact"],
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### 3. Verify Setup

Run these commands to ensure everything works:

```bash
# Test linting and type checking
pnpm validate

# Test code formatting
pnpm format

# Try to commit (should trigger pre-commit hooks)
git add .
git commit -m "test: verify pre-commit setup"
```

### 4. Available Quality Commands

```bash
# Check all code quality (runs before commit automatically)
pnpm validate      # Runs lint + type check

# Individual checks
pnpm lint         # ESLint across all packages
pnpm check-types  # TypeScript compilation check
pnpm format       # Format all code with Prettier

# Auto-fix what's possible
pnpm lint --fix   # Fix ESLint issues automatically
```

### 5. What Happens Automatically

- **Pre-commit**: Lint and type check run before every commit
- **On Save**: Code auto-formats in VS Code
- **CI/CD**: Quality checks block deployment if they fail
- **Development**: Format watcher runs during `pnpm dev`

**🎯 If any command fails, fix the issues before committing!**

---

## Overview

A full-stack TypeScript monorepo boilerplate built with Turborepo, featuring:

- 🚀 **Next.js** for frontend with enhanced health monitoring
- ⚡ **Fastify** for high-performance backend API
- 🐘 **PostgreSQL** for database with version tracking
- 🔄 **Hasura GraphQL** for real-time data and deployment metadata
- 📊 **Enhanced Health Check System** with version tracking and deployment monitoring
- 🔄 **Type sharing** between frontend and backend
- ✨ **Automatic code formatting** during development

---

# 🎯 **LIVE DEMO: Activity History Feature**

> **🚨 START HERE: See Hasura's Auto-Generated CRUD in Action! 🚨**

This boilerplate includes a **fully functional Activity History feature** that demonstrates Hasura's power with **zero manual CRUD code**. This is the best way to understand what this boilerplate can do for you.

## 🚀 **Try It Right Now** (2 minutes)

```bash
# 1. Start PostgreSQL and Hasura
docker compose up -d

# 2. Start all applications
pnpm dev

# 3. See it live
open http://localhost:3000/activity    # 📊 Real-time activity dashboard
open http://localhost:3000/tutorial    # 📚 How it works tutorial
```

## 🎯 **What You'll See**

- **✅ Zero Manual CRUD Code**: All database operations use Hasura's auto-generated GraphQL APIs
- **✅ Real-time Updates**: Live activity feed updating every 3 seconds
- **✅ Complex Queries**: Filtering, sorting, pagination without writing SQL
- **✅ Production Ready**: Auto-sync deployment workflow for CI/CD
- **✅ Type Safety**: End-to-end TypeScript from database to frontend

## 📖 **Complete Documentation**

**📋 [Activity History Feature Documentation](docs/activity-history-feature.md)** - Comprehensive implementation guide with:

- Architecture diagrams and data flow
- Complete code walkthroughs
- Production deployment strategies
- Future enhancement roadmap

**🛠️ Development Tools:**

- **🚀 Hasura Console**: [localhost:8080](http://localhost:8080) - Explore auto-generated GraphQL schema
- **🗄️ Drizzle Studio**: [local.drizzle.studio](https://local.drizzle.studio) - View database tables and data

---

## 🚀 Why Hasura? Accelerated Development with Auto-Generated APIs

**Hasura is included in this boilerplate to dramatically accelerate your development workflow** by providing:

### 🔥 **Instant CRUD Operations**

- **Zero Boilerplate**: Hasura automatically generates GraphQL CRUD endpoints based on your PostgreSQL schema
- **Real-time Subscriptions**: Get live data updates without writing WebSocket code
- **Advanced Filtering**: Built-in support for complex queries, pagination, and sorting

### ⚡ **Development Speed Benefits**

- **Skip API Development**: No need to write repetitive CRUD endpoints for every table
- **Automatic Schema Introspection**: Changes to your database schema instantly reflect in your GraphQL API
- **Built-in Authorization**: Row-level security and role-based access control out of the box

### 🛠️ **Perfect for Rapid Prototyping**

- **Focus on Business Logic**: Spend time on features that matter, not on basic data operations
- **GraphQL Playground**: Built-in query explorer for testing and development
- **Type-Safe Queries**: Auto-generated TypeScript types for your GraphQL operations

### 📊 **Production-Ready Features**

- **Performance**: Optimized queries with automatic query planning
- **Scalability**: Built-in connection pooling and caching
- **Monitoring**: Comprehensive metrics and observability

**Example**: Instead of writing dozens of API endpoints for user management, blog posts, and comments, Hasura generates them automatically from your database schema. You can immediately start querying data like:

```graphql
query GetUserPosts {
  users(where: { id: { _eq: 1 } }) {
    name
    posts(order_by: { created_at: desc }) {
      title
      content
      comments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
}
```

**This boilerplate demonstrates how to integrate Hasura with a traditional REST API**, giving you the best of both worlds: rapid GraphQL development for data operations and custom business logic in your Fastify API.

## 🎯 Activity History Feature: Hasura CRUD Demonstration

This boilerplate includes a **comprehensive Activity History feature** that serves as a live demonstration of Hasura's auto-generated CRUD capabilities. This feature showcases real-world implementation patterns and best practices.

### 🚀 **Live Demo & Documentation**

**Experience the feature in action:**

- **📊 Activity Dashboard**: Visit `http://localhost:3000/activity` to see real-time activity updates
- **📚 Interactive Tutorial**: Visit `http://localhost:3000/tutorial` for step-by-step technical explanation
- **📖 Complete Documentation**: See [docs/activity-history-feature.md](docs/activity-history-feature.md) for comprehensive implementation guide

**Development Tools:**

- **🚀 Hasura Console**: `http://localhost:8080` - Explore auto-generated GraphQL schema
- **🗄️ Drizzle Studio**: `https://local.drizzle.studio` - View database tables and data

### 🎯 **What It Demonstrates**

- **✅ Zero Manual CRUD Code**: All database operations use Hasura's auto-generated GraphQL APIs
- **✅ Real-time Updates**: Live activity feed with polling (upgradeable to GraphQL subscriptions)
- **✅ Complex Queries**: Filtering, sorting, pagination without writing SQL
- **✅ Dual Architecture**: API Gateway for business logic + Hasura for data operations
- **✅ Production Ready**: Auto-sync deployment workflow for CI/CD pipelines
- **✅ Type Safety**: End-to-end TypeScript from database to frontend

### 🏃‍♂️ **Quick Start to See It in Action**

```bash
# 1. Start all services
pnpm dev

# 2. Visit the live demo
open http://localhost:3000/activity

# 3. Read the documentation
open docs/activity-history-feature.md

# 4. Explore the implementation
open http://localhost:8080  # Hasura Console
open https://local.drizzle.studio  # Database Studio
```

The activity feed will show live data updating every 3 seconds, demonstrating how Hasura's auto-generated queries power real-time applications with minimal code.

**📖 For complete implementation details, architecture explanations, and code walkthroughs, see the [Activity History Feature Documentation](docs/activity-history-feature.md).**

## 📋 Quick Start Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PNPM](https://pnpm.io/) (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) for PostgreSQL and Hasura
- [PostgreSQL](https://www.postgresql.org/) (via Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nextjs-nestjs-postgres-boilerplate.git
cd nextjs-nestjs-postgres-boilerplate

# Install dependencies
pnpm install
```

### Development

First, start the PostgreSQL database and Hasura:

```bash
# Start PostgreSQL and Hasura in Docker
docker-compose up -d
```

Then start all applications at once:

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

You can also manage the database with these commands:

```bash
# Stop the database and Hasura
docker-compose down

# Reset the database (deletes all data)
docker-compose down -v && docker-compose up -d
```

### Build

```bash
# Build all applications
pnpm build
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  📱 Next.js Web App & Mobile Apps                              │
│  └── Single API Integration Point                              │
│      └── HTTP /api/* → API Gateway (Business Logic)           │
│      └── GraphQL → Hasura (CRUD & Complex Queries)            │
└─────────────────────────────────────────────────────────────────┘
                          │                    │
                          ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                           │
│                 (Complex Business Logic)                       │
├─────────────────────────────────────────────────────────────────┤
│  ⚡ Fastify API Server (apps/api/src/index.ts)                 │
│  ├── 🧠 Complex Business Logic & Workflows                     │
│  ├── 🔐 Authentication & Authorization                         │
│  ├── 📧 Email/SMS/Payment Integrations                         │
│  ├── 🔄 Multi-Service Orchestration                            │
│  ├── 📊 Analytics & Reporting                                  │
│  └── 🛡️ Unified API for Frontend/Mobile Apps                   │
└─────────────────────────────────────────────────────────────────┘
                          │                    │
                          ▼                    ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│         Data Sources            │  │      GraphQL Engine             │
│      (Direct Access)            │  │   (CRUD & Sophisticated         │
│                                 │  │        Queries)                 │
├─────────────────────────────────┤  ├─────────────────────────────────┤
│  🐘 PostgreSQL Database         │  │  🔄 Hasura GraphQL              │
│  ├── Direct SQL Queries        │  │  ├── 🚀 Auto-Generated CRUD     │
│  ├── Connection Health Tests   │  │  ├── 🔍 Complex Query Support   │
│  ├── Custom Business Queries   │  │  ├── 📡 Real-time Subscriptions │
│  └── Database Tables:          │  │  ├── 🔗 Relationship Queries    │
│      ├── app_metadata          │  │  ├── 📊 Aggregations & Analytics│
│      └── health_snapshots      │  │  └── 🎯 Direct Frontend Access  │
└─────────────────────────────────┘  └─────────────────────────────────┘
```

### Enhanced Health Check System

The application features a comprehensive health monitoring system that provides:

**🔍 Real-time Health Monitoring:**

- Database connection status and response times
- Hasura GraphQL engine availability
- Application uptime and memory usage
- Component-level health tracking

**📊 Version Tracking:**

- Automatic deployment version detection
- Git commit tracking for traceability
- Environment-specific version formatting
- Historical deployment data

**📈 Health Analytics:**

- Health snapshot recording for trend analysis
- Component status aggregation
- Performance metrics collection
- Error tracking and reporting

### API Gateway Pattern: Unified API + Complex Business Logic

The architecture implements a **dual-layer approach** that maximizes both development speed and flexibility:

#### 🛡️ **API Gateway (Fastify) - For Complex Business Logic**

**Purpose**: Handle sophisticated business workflows and provide a unified API interface

- **🧠 Complex Business Logic**: Multi-step workflows, business rule validation, complex calculations
- **🔐 Authentication & Authorization**: User management, role-based access, session handling
- **📧 Third-Party Integrations**: Email services, payment processing, SMS, external APIs
- **🔄 Multi-Service Orchestration**: Combine data from multiple sources, transaction management
- **📊 Custom Analytics**: Business intelligence, custom reporting, data transformation
- **🛡️ Unified Interface**: Single integration point for frontend and mobile applications
- **⚡ Performance Optimization**: Caching strategies, response optimization, rate limiting

#### 🚀 **Hasura GraphQL - For CRUD & Sophisticated Queries**

**Purpose**: Accelerate development with auto-generated APIs and handle complex data queries

- **🚀 Auto-Generated CRUD**: Zero-code endpoints for all database tables and relationships
- **🔍 Sophisticated Queries**: Complex filtering, sorting, pagination, and nested queries
- **📡 Real-time Subscriptions**: Live data updates without WebSocket complexity
- **🔗 Relationship Queries**: Fetch related data in a single query across multiple tables
- **📊 Aggregations & Analytics**: Built-in support for counts, sums, averages, and grouping
- **🎯 Direct Frontend Access**: Frontend can query Hasura directly for simple data operations
- **⚡ Query Optimization**: Automatic query planning and performance optimization

#### 🎯 **When to Use Which Layer**

| Use Case                                   | Layer       | Why                                                |
| ------------------------------------------ | ----------- | -------------------------------------------------- |
| User registration with email verification  | API Gateway | Complex workflow with external service integration |
| Fetch user profile data                    | Hasura      | Simple CRUD operation with relationships           |
| Process payment and update multiple tables | API Gateway | Complex business logic with transaction management |
| Real-time chat messages                    | Hasura      | Real-time subscriptions with automatic updates     |
| Generate complex business reports          | API Gateway | Custom business logic and data transformation      |
| Filter and paginate blog posts             | Hasura      | Sophisticated queries with built-in filtering      |

#### 🔄 **Integration Benefits**

1. **🚀 Rapid Development**: Use Hasura for 80% of data operations, focus API development on business logic
2. **🛡️ Unified Interface**: Frontend has single integration point while maintaining direct GraphQL access
3. **📈 Scalability**: Each layer optimized for its specific use case
4. **🔧 Flexibility**: Easy to move operations between layers as requirements evolve
5. **🎯 Type Safety**: End-to-end TypeScript types across all layers

### Database Schema

**Version Tracking Table:**

```sql
CREATE TABLE app_metadata (
  id SERIAL PRIMARY KEY,
  component VARCHAR(50) NOT NULL,     -- 'api', 'web', 'hasura'
  version VARCHAR(20) NOT NULL,       -- Semantic version
  deployed_at TIMESTAMP DEFAULT NOW(),
  git_commit VARCHAR(40),             -- Full commit hash
  environment VARCHAR(20) DEFAULT 'production',
  metadata JSONB,                     -- Additional deployment info
  UNIQUE(component, environment)
);
```

**Health Analytics Table:**

```sql
CREATE TABLE health_snapshots (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  overall_status VARCHAR(10) NOT NULL,  -- 'up', 'down', 'degraded'
  component_statuses JSONB NOT NULL,    -- Component health details
  response_times JSONB,                 -- Performance metrics
  errors JSONB                          -- Error details
);
```

### Version Tracking & Deployment Metadata

The system automatically tracks deployment information:

- **Development**: `v1.2.3-preview.abc1234` (feature branches)
- **Staging**: `v1.2.3-staging.def5678` (main branch)
- **Production**: `v1.2.3` (tagged releases)

Each deployment updates the `app_metadata` table with:

- Component version (API, Web, Hasura)
- Git commit hash for traceability
- Deployment timestamp
- Environment-specific metadata

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) documentation app
- `web`: [Next.js](https://nextjs.org/) frontend with enhanced health monitoring
- `api`: [Fastify](https://fastify.io/) backend with GraphQL integration
- `@repo/ui`: React component library shared by applications
- `@repo/eslint-config`: ESLint configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: Shared TypeScript configurations
- `@repo/api-types`: Shared TypeScript interfaces for health checks and API responses

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Architectural Features

This boilerplate integrates Next.js (frontend), Fastify (backend), and Hasura (GraphQL) in a monorepo structure:

1. **Enhanced Health Monitoring**: Real-time health checks with version tracking and deployment metadata
2. **GraphQL Integration**: Hasura provides real-time data access and version management
3. **Type Safety**: Full end-to-end type safety with shared types between all layers
4. **Development Experience**: Automatic code formatting, linting, and type checking
5. **Performance**: Fast builds and development with Turborepo's caching
6. **Scalability**: Production-ready with comprehensive monitoring and fallback strategies
7. **Version Tracking**: Automatic deployment version detection and historical tracking

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

## 🔄 Type Sharing Example: Enhanced Health Check

This boilerplate demonstrates type sharing with an enhanced health check feature:

1. **Backend**: The Fastify API server provides comprehensive health metrics with Hasura integration
2. **Shared Types**: The `@repo/api-types` package defines enhanced health check response types
3. **Frontend**: The Next.js app consumes and displays the health data with full type safety
4. **GraphQL Layer**: Hasura provides version metadata and health analytics

Example from the enhanced health endpoint:

```typescript
// apps/api/src/index.ts
server.get("/api/health", async (): Promise<HealthCheckResponse> => {
  const uptime = Date.now() - startTime.getTime();
  const uptimeInSeconds = Math.floor(uptime / 1000);

  try {
    // Use enhanced health check with Hasura integration
    const enhancedStatus = await getEnhancedHealthStatus();

    return {
      status:
        enhancedStatus.healthSnapshot.overall_status === "down" ? "down" : "up",
      info: {
        versions: enhancedStatus.versions,
        deployment: {
          environment: process.env.NODE_ENV || "production",
          hasura_available: enhancedStatus.hasuraAvailable,
        },
      },
      details: {
        uptime: {
          status: "up",
          uptimeInSeconds,
          startedAt: startTime.toISOString(),
        },
        memory_heap: { status: "up" },
        disk: { status: "up" },
        database: enhancedStatus.dbStatus,
        hasura: {
          status: enhancedStatus.hasuraAvailable ? "up" : "down",
          response_time: enhancedStatus.responseTime,
        },
      },
    } as HealthCheckResponse;
  } catch (error) {
    // Fallback to basic health check if enhanced version fails
    const dbStatus = await checkDbConnection();
    return basicHealthResponse;
  }
});
```

Enhanced health check with Hasura integration:

```typescript
// apps/api/src/db/index.ts
export async function getEnhancedHealthStatus() {
  const startTime = Date.now();

  // 1. Check direct database connection
  const dbStatus = await checkDbConnection();

  // 2. Test Hasura connection
  const hasuraAvailable = await hasuraService.testConnection();

  // 3. Fetch version metadata from Hasura
  let versions: AppMetadata[] = [];
  if (hasuraAvailable) {
    try {
      const environment = process.env.NODE_ENV || "production";
      versions = await hasuraService.getAppMetadata(environment);
    } catch (error) {
      console.error("Failed to fetch version metadata:", error);
    }
  }

  // 4. Record health snapshot (non-blocking)
  const healthSnapshot: HealthSnapshot = {
    overall_status:
      dbStatus.status === "up" && hasuraAvailable
        ? "up"
        : dbStatus.status === "up"
          ? "degraded"
          : "down",
    component_statuses: {
      database: dbStatus.status,
      hasura: hasuraAvailable ? "up" : "down",
      api: "up",
    },
    response_times: {
      database: dbStatus.responseTime || 0,
      total: Date.now() - startTime,
    },
    errors: dbStatus.error ? { database: dbStatus.error } : undefined,
  };

  if (hasuraAvailable) {
    hasuraService.recordHealthSnapshot(healthSnapshot).catch((error) => {
      console.error("Failed to record health snapshot:", error);
    });
  }

  return {
    dbStatus,
    hasuraAvailable,
    versions,
    healthSnapshot,
    responseTime: Date.now() - startTime,
  };
}
```

Frontend component with enhanced type safety:

```typescript
// apps/web/src/components/health-status.tsx
import { HealthCheckResponse, AppMetadata } from "@repo/api-types";

const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);

// Display version information with full type safety
{healthData?.info?.versions?.map((version: AppMetadata) => (
  <div key={`${version.component}-${version.environment}`} className="version-info">
    <span className="component">{version.component}</span>
    <span className="version">{version.version}</span>
    <span className="deployed">{new Date(version.deployed_at).toLocaleDateString()}</span>
    {version.git_commit && (
      <span className="commit">{version.git_commit.substring(0, 7)}</span>
    )}
  </div>
))}
```

Enhanced response type with version metadata:

```typescript
// packages/api-types/src/health.ts
export interface HealthCheckResponse {
  status: "up" | "down";
  timestamp?: string;
  uptime?: number;
  environment?: string;

  // Enhanced version information
  info?: {
    versions?: AppMetadata[];
    deployment?: DeploymentInfo;
  };

  // Component health details
  details?: {
    uptime?: HealthIndicatorStatus;
    memory_heap?: HealthIndicatorStatus;
    disk?: HealthIndicatorStatus;
    database?: HealthIndicatorStatus;
    hasura?: HealthIndicatorStatus;
  };
}

export interface AppMetadata {
  id?: number;
  component: string;
  version: string;
  deployed_at: string;
  git_commit?: string;
  environment?: string;
  metadata?: Record<string, any>;
}

export interface DeploymentInfo {
  environment: string;
  hasura_available: boolean;
  last_deployed?: string;
}
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

This boilerplate is deployed to Render using a blueprint approach with enhanced health monitoring and version tracking. The deployment includes:

- **Web Application**: Next.js frontend with health monitoring dashboard
- **API Server**: Fastify backend with enhanced health checks and Hasura integration
- **Database**: PostgreSQL with version tracking and health analytics tables
- **GraphQL Engine**: Hasura for real-time data access and deployment metadata

Key deployment features:

- Automatic deployments on Git push
- Environment variable management via render.yaml
- PostgreSQL integration with automatic migrations
- Hasura GraphQL engine for version tracking
- Enhanced health monitoring across all services
- Fallback strategies for service resilience

### Environment Variables

#### Web Application (Next.js)

| Variable              | Development                 | Production          | Description                    |
| --------------------- | --------------------------- | ------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | From Render service | URL of the backend API service |
| `NODE_ENV`            | `development`               | `production`        | Environment mode               |

Create a `.env.local` file in the `apps/web` directory for local development:

```
# API Configuration for local development
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

#### API Application (Fastify)

| Variable              | Development                        | Production              | Description                        |
| --------------------- | ---------------------------------- | ----------------------- | ---------------------------------- |
| `PORT`                | `4000`                             | Set by hosting platform | Port on which the API server runs  |
| `NODE_ENV`            | `development`                      | `production`            | Environment mode                   |
| `WEB_URL`             | Not required                       | Set automatically       | URL of the web frontend (for CORS) |
| `DATABASE_URL`        | From docker-compose                | From Render service     | PostgreSQL connection string       |
| `HASURA_URL`          | `http://localhost:8080/v1/graphql` | From Render service     | Hasura GraphQL endpoint            |
| `HASURA_ADMIN_SECRET` | `admin`                            | From Render service     | Hasura admin secret                |

The production deployment automatically configures these variables in the render.yaml file:

```yaml
# From render.yaml
envVars:
  - key: NODE_ENV
    value: production
  - key: WEB_URL
    fromService:
      type: web
      name: web
      property: url
  - key: DATABASE_URL
    fromDatabase:
      name: pegasus-prod
      property: connectionString
```

#### Hasura Configuration

The following environment variables are used for Hasura configuration:

| Variable                        | Development         | Production          | Description                      |
| ------------------------------- | ------------------- | ------------------- | -------------------------------- |
| `HASURA_GRAPHQL_DATABASE_URL`   | From docker-compose | From Render service | PostgreSQL connection for Hasura |
| `HASURA_GRAPHQL_ADMIN_SECRET`   | `admin`             | From Render service | Hasura GraphQL admin secret      |
| `HASURA_GRAPHQL_ENABLE_CONSOLE` | `true`              | `false`             | Enable/disable Hasura console    |

For local development, these are configured in the docker-compose.yml file. In production, they are automatically configured by the Render Hasura service.

#### Database Configuration

The following environment variables are used for PostgreSQL database connection:

| Variable       | Development                                        | Production          | Description                  |
| -------------- | -------------------------------------------------- | ------------------- | ---------------------------- |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:25432/app` | From Render service | PostgreSQL connection string |

For local development, this is configured in the docker-compose.yml file. In production, it's automatically configured by the Render PostgreSQL service.

**Database Schema**: The application automatically creates the following tables on startup:

- `app_metadata`: Version tracking and deployment metadata
- `health_snapshots`: Historical health check data for analytics

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

Learn more about the technologies used in this boilerplate:

**Turborepo:**

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

**Frontend & Backend:**

- [Next.js Documentation](https://nextjs.org/docs) - React framework for production
- [Fastify Documentation](https://fastify.io/docs/) - Fast and low overhead web framework
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Static type checking

**Database & GraphQL:**

- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Advanced open source database
- [Hasura Documentation](https://hasura.io/docs/) - GraphQL engine for PostgreSQL
- [Drizzle ORM Documentation](https://orm.drizzle.team/) - TypeScript ORM for SQL databases

**Deployment & DevOps:**

- [Render Documentation](https://render.com/docs) - Cloud platform for modern apps
- [Docker Documentation](https://docs.docker.com/) - Containerization platform

**Architecture Documentation:**

- [API Gateway Pattern](https://microservices.io/patterns/apigateway.html) - Architectural pattern overview
