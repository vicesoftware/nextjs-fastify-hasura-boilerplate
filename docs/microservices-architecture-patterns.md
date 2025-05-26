# Microservices-Ready API Architecture Patterns

> **Organizing your API layer for future microservices decomposition while leveraging Hasura's strengths**

## Overview

This document outlines patterns for structuring your API layer to support seamless transition from monolith to microservices **without negating Hasura's benefits**. The key is keeping features thin and letting Hasura handle the heavy lifting.

## 🏗️ **Core Architectural Patterns**

### 1. **Simplified Feature Structure**

Organize by business features but keep them **ultra-thin** with minimal files:

```
apps/api/src/
├── features/
│   ├── activity/               # Activity Management Feature
│   │   ├── handlers.ts         # Business logic + routes
│   │   └── queries.ts          # GraphQL operations
│   ├── user/                   # User Management Feature
│   │   ├── handlers.ts         # Business logic + routes
│   │   └── queries.ts          # GraphQL operations
│   └── notification/           # Notification Feature
│       ├── handlers.ts         # Business logic + routes
│       └── queries.ts          # GraphQL operations
├── shared/
│   ├── hasura/                 # Hasura client & utilities
│   ├── events/                 # Event bus
│   └── middleware/             # Auth, logging, etc.
└── app.ts                      # Application bootstrap

packages/shared-types/src/
├── activity.ts                 # Activity feature types
├── user.ts                     # User feature types
├── notification.ts             # Notification feature types
└── index.ts                    # Export all types
```

**Key Principles**:

- **2 files per feature maximum**
- **Shared types in centralized package**
- **Direct Hasura usage, no abstractions**

### 2. **Hasura-Direct Pattern (Recommended)**

Skip repository abstractions and use Hasura directly with feature-specific query builders:

```typescript
// features/activity/queries.ts - Feature-specific GraphQL queries
export const ACTIVITY_QUERIES = {
  CREATE_ACTIVITY: `
    mutation CreateActivity($activity: activity_log_insert_input!) {
      insert_activity_log_one(object: $activity) {
        id timestamp action user_id metadata source
      }
    }
  `,

  GET_RECENT: `
    query GetRecentActivities($limit: Int!) {
      activity_log(order_by: {timestamp: desc}, limit: $limit) {
        id timestamp action user_id metadata source
      }
    }
  `,

  GET_STATS: `
    query GetActivityStats($timeRange: timestamptz!) {
      activity_log_aggregate(where: {timestamp: {_gte: $timeRange}}) {
        aggregate { count }
      }
    }
  `,
};

// features/activity/handlers.ts - Combined business logic + routes
import { FastifyInstance } from "fastify";
import { CreateActivityInput } from "@repo/shared-types/activity";

export class ActivityHandlers {
  constructor(
    private hasura: HasuraClient,
    private eventBus: EventBus
  ) {}

  async logActivity(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body as CreateActivityInput;

    // Direct Hasura mutation
    const result = await this.hasura.request(ACTIVITY_QUERIES.CREATE_ACTIVITY, {
      activity: { action: input.action, user_id: input.userId },
    });

    // Emit feature event
    await this.eventBus.emit(
      "activity.created",
      result.insert_activity_log_one
    );

    return result.insert_activity_log_one;
  }
}

// Register routes in same file
export async function registerActivityRoutes(
  fastify: FastifyInstance,
  options: { hasura: HasuraClient; eventBus: EventBus }
) {
  const handlers = new ActivityHandlers(options.hasura, options.eventBus);

  fastify.post("/api/activity/log", handlers.logActivity.bind(handlers));
  fastify.get(
    "/api/activity/recent",
    handlers.getRecentActivities.bind(handlers)
  );
}
```

### 3. **Centralized Type Sharing**

All feature types live in a shared package for maximum reusability:

```typescript
// packages/shared-types/src/activity.ts
export interface Activity {
  id: string;
  timestamp: Date;
  action: string;
  userId?: string;
  metadata?: Record<string, any>;
  source: ActivitySource;
}

export interface CreateActivityInput {
  action: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export enum ActivitySource {
  SYSTEM = "system",
  USER = "user",
  API = "api",
}

// packages/shared-types/src/index.ts
export * from "./activity";
export * from "./user";
export * from "./health";
```

**Usage across all apps:**

```typescript
// Frontend (apps/web)
import { Activity, ActivitySource } from "@repo/shared-types";

// Backend (apps/api)
import { CreateActivityInput } from "@repo/shared-types";

// Documentation (apps/docs)
import { Activity } from "@repo/shared-types";
```

### 4. **Event-Driven Coordination**

Use events for cross-feature communication, keeping features decoupled:

```typescript
// Simple event bus usage
await this.eventBus.emit("activity.created", {
  activityId: result.id,
  userId: result.user_id,
  action: result.action,
});

// Other features can listen
this.eventBus.on("activity.created", async (data) => {
  // Update user stats, send notifications, etc.
});
```

## 🎯 **Why This Approach Works Better**

### ✅ **Preserves Hasura Benefits**

- **Auto-generated CRUD**: Use Hasura's mutations/queries directly
- **Real-time subscriptions**: Expose GraphQL subscriptions through features
- **Complex queries**: Leverage Hasura's query capabilities without abstraction
- **Performance**: No unnecessary data mapping or abstraction overhead

### ✅ **Enables Microservices Migration**

- **Clear boundaries**: Each feature is self-contained (2 files)
- **Event-driven**: Loose coupling between features
- **Thin services**: Easy to extract as separate microservices
- **Shared types**: Centralized for easy distribution

### ✅ **Developer Experience**

- **Minimal files**: Only 2 files per feature to navigate
- **Type safety**: Shared types across all applications
- **Debugging**: Clear path from API → Hasura → Database
- **Testing**: Mock Hasura client, not complex repository hierarchies

## 🔄 **Migration Strategy**

### Phase 1: Organized Monolith (Current)

```
Single API + Single Hasura + Single Database
├── Feature-organized routes (2 files each)
├── Direct Hasura usage
├── Centralized shared types
└── Event bus (in-memory)
```

### Phase 2: Modular Services

```
Multiple APIs + Single Hasura + Single Database
├── activity-api (2 files + shared types)
├── user-api (2 files + shared types)
├── notification-api (2 files + shared types)
└── Shared Hasura instance
```

### Phase 3: True Microservices

```
Multiple APIs + Multiple Hasuras + Multiple Databases
├── activity-service (own Hasura + DB + shared types)
├── user-service (own Hasura + DB + shared types)
└── Event bus (Redis/RabbitMQ)
```

## 🛠️ **Implementation Example**

### Ultra-Simple Feature Implementation

```typescript
// features/activity/handlers.ts (complete feature)
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateActivityInput } from "@repo/shared-types/activity";
import { ACTIVITY_QUERIES } from "./queries.js";

export class ActivityHandlers {
  constructor(
    private hasura: HasuraClient,
    private eventBus: EventBus
  ) {}

  async logActivity(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body as CreateActivityInput;
    if (!input.action)
      return reply.code(400).send({ error: "Action required" });

    const result = await this.hasura.request(ACTIVITY_QUERIES.CREATE_ACTIVITY, {
      activity: { action: input.action, user_id: input.userId },
    });

    await this.eventBus.emit(
      "activity.created",
      result.insert_activity_log_one
    );
    return result.insert_activity_log_one;
  }

  async getRecentActivities(request: FastifyRequest) {
    const limit = Math.min(Number(request.query?.limit) || 20, 100);
    const result = await this.hasura.request(ACTIVITY_QUERIES.GET_RECENT, {
      limit,
    });
    return result.activity_log;
  }
}

// Register routes directly
export async function registerActivityRoutes(
  fastify: FastifyInstance,
  options: { hasura: HasuraClient; eventBus: EventBus }
) {
  const handlers = new ActivityHandlers(options.hasura, options.eventBus);

  fastify.post("/api/activity/log", handlers.logActivity.bind(handlers));
  fastify.get(
    "/api/activity/recent",
    handlers.getRecentActivities.bind(handlers)
  );
}
```

### Main App Integration

```typescript
// apps/api/src/app.ts
import { registerActivityRoutes } from "./features/activity/handlers.js";
import { registerUserRoutes } from "./features/user/handlers.js";

export async function createApp() {
  const app = fastify();

  const hasura = new HasuraClient(process.env.HASURA_URL!);
  const eventBus = new InMemoryEventBus();

  // Register all features (each is just 2 files)
  await registerActivityRoutes(app, { hasura, eventBus });
  await registerUserRoutes(app, { hasura, eventBus });

  return app;
}
```

## 📊 **Benefits Summary**

### ✅ **Preserves Hasura Benefits**

- **Auto-generated CRUD**: Use Hasura's mutations/queries directly
- **Real-time subscriptions**: Expose GraphQL subscriptions through features
- **Complex queries**: Leverage Hasura's query capabilities without abstraction
- **Performance**: No unnecessary data mapping or abstraction overhead

### ✅ **Enables Microservices Migration**

- **Clear boundaries**: Each feature is self-contained (2 files)
- **Event-driven**: Loose coupling between features
- **Thin services**: Easy to extract as separate microservices
- **Shared types**: Centralized for easy distribution

### ✅ **Developer Experience**

- **Minimal files**: Only 2 files per feature to navigate
- **Type safety**: Shared types across all applications
- **Debugging**: Clear path from API → Hasura → Database
- **Testing**: Mock Hasura client, not complex repository hierarchies

### ✅ **Architecture Benefits**

- **Files per Feature**: 2 files maximum
- **Type Sharing**: Centralized in `@repo/shared-types`
- **Navigation**: Simple, predictable structure
- **Boilerplate**: Minimal code overhead
- **Microservices Ready**: Clear boundaries with easy extraction

## 🎯 **Best Practices**

1. **Keep features ultra-thin**: 2 files maximum per feature
2. **Centralize shared types**: Use `@repo/shared-types` package
3. **Use Hasura directly**: Don't hide its capabilities
4. **Event-driven communication**: Loose coupling between features
5. **GraphQL-first**: Leverage Hasura's query capabilities

---

**💡 This approach gives you microservices-ready organization with minimal file overhead while keeping Hasura's benefits intact. Each feature becomes a thin orchestration layer that can be easily extracted as a separate service when needed.**
