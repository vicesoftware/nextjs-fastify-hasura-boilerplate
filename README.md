# Next.js + Fastify + PostgreSQL + Hasura Boilerplate <!-- omit from toc -->

> **A production-ready monorepo that's designed for easy migration to microservices when you're ready to scale.**

- [🚀 **Quick Start** (2 minutes)](#-quick-start-2-minutes)
- [📋 **Development Tickets** (Temporary)](#-development-tickets-temporary)
- [🎯 **Live Demo: See It in Action**](#-live-demo-see-it-in-action)
- [🏛️ **Microservices-Ready Architecture (MRA)**](#️-microservices-ready-architecture-mra)
  - [📁 **Feature Structure (2 Files Maximum)**](#-feature-structure-2-files-maximum)
  - [📖 **Complete Documentation**](#-complete-documentation)
  - [💡 **Why This Approach?**](#-why-this-approach)
- [🚀 **Why Hasura?**](#-why-hasura)
  - [🔥 **Instant CRUD Operations**](#-instant-crud-operations)
  - [⚡ **Development Speed Benefits**](#-development-speed-benefits)
  - [🛠️ **Perfect for Rapid Prototyping**](#️-perfect-for-rapid-prototyping)
  - [📊 **Production-Ready Features**](#-production-ready-features)
- [📋 **Developer Setup** (Required)](#-developer-setup-required)
  - [Quick Setup (2 commands)](#quick-setup-2-commands)
  - [VS Code Extensions (Recommended)](#vs-code-extensions-recommended)
  - [1. Install Pre-commit Hooks (REQUIRED)](#1-install-pre-commit-hooks-required)
  - [2. VS Code Setup (RECOMMENDED)](#2-vs-code-setup-recommended)
  - [3. Available Quality Commands](#3-available-quality-commands)
- [🔧 **What's Inside**](#-whats-inside)
- [🏗️ **Technical Architecture**](#️-technical-architecture)
  - [Enhanced Health Check System](#enhanced-health-check-system)
  - [API Gateway Pattern: Unified API + Complex Business Logic](#api-gateway-pattern-unified-api--complex-business-logic)
    - [🛡️ **API Gateway (Fastify) - For Complex Business Logic**](#️-api-gateway-fastify---for-complex-business-logic)
    - [🚀 **Hasura GraphQL - For CRUD \& Sophisticated Queries**](#-hasura-graphql---for-crud--sophisticated-queries)
    - [🎯 **When to Use Which Layer**](#-when-to-use-which-layer)
    - [🔄 **Integration Benefits**](#-integration-benefits)
  - [Database Schema](#database-schema)
  - [Database Migrations](#database-migrations)
  - [Version Tracking \& Deployment Metadata](#version-tracking--deployment-metadata)
- [🚀 **Deployment**](#-deployment)
  - [📋 [Infrastructure & Deployment Epic](docs/tickets/infrastructure-epic.md)](#-infrastructure--deployment-epic)
  - [Quick Deploy](#quick-deploy)
  - [Environment Variables](#environment-variables)
    - [Web Application (Next.js)](#web-application-nextjs)
    - [API Application (Fastify)](#api-application-fastify)
    - [Hasura Configuration](#hasura-configuration)
- [📚 **Learn More**](#-learn-more)

## 🚀 **Quick Start** (2 minutes)

**Get the project running locally in under 2 minutes:**

```bash
# 1. Clone and install
git clone <repo-url>
cd nextjs-nestjs-postgres-boilerplate
pnpm install

# 2. Start services
docker compose up -d    # PostgreSQL + Hasura
pnpm dev               # All applications

# 3. See it live
open http://localhost:3000        # Main app
open http://localhost:3000/activity  # Live demo
```

**That's it!** The project includes:

- ✅ **Frontend**: Next.js app with live activity dashboard
- ✅ **Backend**: Fastify API with auto-generated GraphQL
- ✅ **Database**: PostgreSQL with sample data
- ✅ **Real-time**: Hasura GraphQL engine

## 📋 **Development Tickets** (Temporary)

**🚧 Temporary Tracking System** - We'll be migrating to Linear this week for proper project management

**📋 [View All Development Stories & Tickets](docs/tickets/initial-tickets.md)**

For now, we're using a simple emoji-based tracking system in our documentation:

- **📝 Ready** → **🚧 In Progress** → **👀 Under Review** → **🧪 Ready for Test** → **✅ Deployed**
- **15 tickets** organized across **4 epics** (Authentication, Organizations, Events, Profiles)
- **Priority indicators**: 🔥 Critical, ⚡ High, 📋 Medium, 📝 Low

**Current Focus:**

- 🔥 **PEG-1**: WorkOS Integration Setup (Critical blocker)
- 🔥 **PEG-3**: User Roles Architecture Spike (Critical blocker)
- ⚡ **PEG-7**: Organization Management APIs

**Coming This Week:** Migration to Linear for proper sprint planning, story points, and team collaboration.

## 🎯 **Live Demo: See It in Action**

> **🎯 Experience Hasura's auto-generated APIs and real-time updates in action**

**Try these live features:**

- **📊 [Activity Dashboard](http://localhost:3000/activity)** - Real-time activity feed that updates every 3 seconds
- **📚 [How It Works Tutorial](http://localhost:3000/tutorial)** - Step-by-step technical walkthrough
- **🚀 [Hasura Console](http://localhost:8080)** - Explore auto-generated GraphQL schema
- **🗄️ [Database Studio](https://local.drizzle.studio)** - View tables and data

**What you'll see:**

- ✅ **Zero CRUD Code**: All database operations use Hasura's auto-generated APIs
- ✅ **Real-time Updates**: Live data without manual polling
- ✅ **Complex Queries**: Filtering, sorting, aggregations without writing SQL
- ✅ **Type Safety**: End-to-end TypeScript from database to frontend
- ✅ **Microservices-Ready**: Feature organization for easy service extraction
- ✅ **Production Patterns**: Auto-sync deployment workflow

📖 **[Complete Documentation](docs/activity-history-feature.md)**

## 🏛️ **Microservices-Ready Architecture (MRA)**

> **🎯 This is the core organizational pattern for this boilerplate - designed for easy future migration to microservices**

This boilerplate uses a **feature-driven monolith architecture** that's designed for easy microservices decomposition when you're ready to scale. Start as a monolith, migrate to microservices later without major refactoring.

### 📁 **Feature Structure (2 Files Maximum)**

```
apps/api/src/features/
├── activity/               # Activity Management Feature
│   ├── handlers.ts         # Business logic + routes
│   └── queries.ts          # GraphQL operations
├── user/                   # User Management Feature
│   ├── handlers.ts         # Business logic + routes
│   └── queries.ts          # GraphQL operations
└── notification/           # Notification Feature
    ├── handlers.ts         # Business logic + routes
    └── queries.ts          # GraphQL operations

packages/shared-types/      # Centralized Types
├── activity.ts             # Activity domain types
├── user.ts                 # User domain types
└── notification.ts         # Notification domain types
```

### 📖 **Complete Documentation**

- **📋 [Microservices-Ready Patterns](docs/microservices-architecture-patterns.md)** - Complete guide to organizing your API layer

### 💡 **Why This Approach?**

- ✅ **Start Simple**: Monolith for faster development
- ✅ **Future-Proof**: Clear boundaries for easy service extraction
- ✅ **Minimal Files**: Only 2 files per feature
- ✅ **Hasura Direct**: No repository abstractions - leverage auto-generated APIs
- ✅ **Type Safety**: Shared types across frontend/backend

## 🚀 **Why Hasura?**

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

## 📋 **Developer Setup** (Required)

> **⚠️ Required for contributing code - ensures quality and prevents build failures**

### Quick Setup (2 commands)

```bash
# 1. Install pre-commit hooks
pnpm add -D husky lint-staged && npx husky init
echo "pnpm validate" > .husky/pre-commit && chmod +x .husky/pre-commit

# 2. Verify everything works
pnpm validate && pnpm format
```

### VS Code Extensions (Recommended)

- **ESLint** (`ms-vscode.vscode-eslint`) - Real-time linting
- **Prettier** (`esbenp.prettier-vscode`) - Auto-format on save
- **TypeScript Importer** (`pmneo.tsimporter`) - Auto-imports

**What happens automatically:**

- ✅ Code formats on save
- ✅ Lint + type check before commits
- ✅ Build pipeline enforces quality

<details>
<summary>📖 <strong>Detailed Setup Instructions</strong></summary>

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

**VS Code Workspace Settings** (automatically configured):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["typescript", "typescriptreact"],
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### 3. Available Quality Commands

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

</details>

## 🔧 **What's Inside**

**Apps:**

- **`web`** - Next.js frontend with activity dashboard
- **`api`** - Fastify backend with GraphQL integration
- **`docs`** - Documentation site (currently not used)

**Packages:**

- **`@repo/ui`** - Shared React components
- **`@repo/api-types`** - Shared TypeScript interfaces
- **`@repo/eslint-config`** - ESLint configurations
- **`@repo/typescript-config`** - TypeScript configurations

**Key Features:**

- ✅ **Type Safety**: End-to-end TypeScript
- ✅ **Code Quality**: ESLint + Prettier + pre-commit hooks
- ✅ **Real-time Data**: Hasura GraphQL subscriptions
- ✅ **Auto-formatting**: Code formats during development
- ✅ **Fast Builds**: Turborepo caching and parallelization

## 🏗️ **Technical Architecture**

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

### Database Migrations

**🔄 Automated Migration System** - Uses Drizzle ORM with automatic execution on startup

**How It Works:**

1. **📝 Schema Changes**: Modify `apps/api/src/db/schema.ts`
2. **🔄 Generate Migration**: Run `cd apps/api && pnpm db:generate`
3. **🚀 Auto-Apply**: Migrations run automatically when the API starts
4. **🛡️ Retry Logic**: Built-in retry mechanism (5 attempts, 2-second delays)

**Available Commands:**

```bash
# Generate new migration from schema changes
cd apps/api && pnpm db:generate

# Apply migrations manually (usually not needed - auto-runs on startup)
cd apps/api && pnpm db:migrate

# Push schema directly to DB (development only - skips migration files)
cd apps/api && pnpm db:push

# View database in browser
cd apps/api && pnpm drizzle-kit studio
```

**Migration Files Location:**

- `apps/api/src/db/migrations/` - Generated SQL migration files
- `apps/api/drizzle.config.ts` - Drizzle configuration

**Development Workflow:**

1. **Modify Schema**: Edit `apps/api/src/db/schema.ts`
2. **Generate Migration**: `pnpm db:generate` creates new SQL file
3. **Restart API**: Migrations auto-apply on next `pnpm dev`
4. **Verify Changes**: Check [Drizzle Studio](https://local.drizzle.studio)

**Production Deployment:**

- ✅ Migrations run automatically during deployment
- ✅ Zero-downtime: Compatible migrations are safe
- ✅ Rollback: Use git to revert schema changes if needed

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

## 🚀 **Deployment**

> **📋 [Infrastructure & Deployment Epic](docs/tickets/infrastructure-epic.md)** - Current deployment modernization roadmap and tasks

### Quick Deploy

1. **Fork this repository**
2. **Connect to Render** - Import your fork
3. **Deploy** - Render handles the rest automatically

### Environment Variables

<details>
<summary>📖 <strong>Environment Configuration Details</strong></summary>

#### Web Application (Next.js)

| Variable              | Development                 | Production          | Description                    |
| --------------------- | --------------------------- | ------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | From Render service | URL of the backend API service |
| `NODE_ENV`            | `development`               | `production`        | Environment mode               |

#### API Application (Fastify)

| Variable              | Development                        | Production              | Description                       |
| --------------------- | ---------------------------------- | ----------------------- | --------------------------------- |
| `PORT`                | `4000`                             | Set by hosting platform | Port on which the API server runs |
| `NODE_ENV`            | `development`                      | `production`            | Environment mode                  |
| `DATABASE_URL`        | From docker-compose                | From Render service     | PostgreSQL connection string      |
| `HASURA_URL`          | `http://localhost:8080/v1/graphql` | From Render service     | Hasura GraphQL endpoint           |
| `HASURA_ADMIN_SECRET` | `dev-admin-secret`                 | From Render service     | Hasura admin secret               |

#### Hasura Configuration

| Variable                        | Development         | Production          | Description                      |
| ------------------------------- | ------------------- | ------------------- | -------------------------------- |
| `HASURA_GRAPHQL_DATABASE_URL`   | From docker-compose | From Render service | PostgreSQL connection for Hasura |
| `HASURA_GRAPHQL_ADMIN_SECRET`   | `dev-admin-secret`  | From Render service | Hasura GraphQL admin secret      |
| `HASURA_GRAPHQL_ENABLE_CONSOLE` | `true`              | `false`             | Enable/disable Hasura console    |

</details>

## 📚 **Learn More**

- **📋 [Microservices-Ready Patterns](docs/microservices-architecture-patterns.md)** - Complete guide to organizing your API layer
- **📖 [Activity History Feature Documentation](docs/activity-history-feature.md)** - Comprehensive implementation guide
