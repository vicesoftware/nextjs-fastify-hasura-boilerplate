# Activity Feature: Simplified Hasura-Direct Implementation

> **Practical example of organizing features to preserve Hasura's benefits while maintaining microservices readiness**

## 🎯 **Goal**

Implement a thin, Hasura-direct approach that:

- ✅ Keeps feature boundaries clear
- ✅ Preserves all Hasura benefits
- ✅ Minimizes file count per feature
- ✅ Centralizes shared types
- ✅ Maintains microservices readiness

## 📊 **Implementation Structure**

```
apps/api/src/features/activity/
├── handlers.ts                  # Business logic + routes
└── queries.ts                   # GraphQL operations

packages/shared-types/src/
└── activity.ts                  # Feature types
```

## 🔧 **Implementation**

### 1. Shared Types (`packages/shared-types/src/activity.ts`)

```typescript
// Centralized types available to all apps
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
  source?: ActivitySource;
}

export enum ActivitySource {
  SYSTEM = "system",
  USER = "user",
  API = "api",
  HEALTH_CHECK = "health_check",
  DEMO = "demo",
}

// Feature events (for cross-feature communication)
export interface ActivityCreatedEvent {
  type: "activity.created";
  data: Activity;
}
```

### 2. GraphQL Queries (`features/activity/queries.ts`)

```typescript
// Feature-specific GraphQL operations
export const ACTIVITY_QUERIES = {
  CREATE_ACTIVITY: `
    mutation CreateActivity($activity: activity_log_insert_input!) {
      insert_activity_log_one(object: $activity) {
        id timestamp action user_id metadata source
      }
    }
  `,

  CREATE_BULK_ACTIVITIES: `
    mutation CreateBulkActivities($activities: [activity_log_insert_input!]!) {
      insert_activity_log(objects: $activities) {
        returning { id timestamp action user_id metadata source }
        affected_rows
      }
    }
  `,

  GET_RECENT_ACTIVITIES: `
    query GetRecentActivities($limit: Int!) {
      activity_log(order_by: {timestamp: desc}, limit: $limit) {
        id timestamp action user_id metadata source
      }
    }
  `,

  GET_ACTIVITY_STATS: `
    query GetActivityStats($since: timestamptz!) {
      activity_log_aggregate(where: {timestamp: {_gte: $since}}) {
        aggregate { count }
      }
      recent_actions: activity_log(
        where: {timestamp: {_gte: $since}}
        distinct_on: action
        order_by: [{action: asc}, {timestamp: desc}]
      ) {
        action
      }
    }
  `,
};
```

### 3. Combined Handlers + Routes (`features/activity/handlers.ts`)

```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { HasuraClient } from "../../shared/hasura/client.js";
import { EventBus } from "../../shared/events/bus.js";
import {
  CreateActivityInput,
  ActivitySource,
} from "@repo/shared-types/activity";
import { ACTIVITY_QUERIES } from "./queries.js";

export class ActivityHandlers {
  constructor(
    private hasura: HasuraClient,
    private eventBus: EventBus
  ) {}

  async logActivity(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body as CreateActivityInput;

    if (!input.action) {
      return reply.code(400).send({ error: "Action is required" });
    }

    // Direct Hasura mutation
    const result = await this.hasura.request(ACTIVITY_QUERIES.CREATE_ACTIVITY, {
      activity: {
        action: input.action,
        user_id: input.userId,
        metadata: input.metadata,
        source: input.source || ActivitySource.API,
      },
    });

    const activity = result.insert_activity_log_one;

    // Emit feature event
    await this.eventBus.emit("activity.created", {
      type: "activity.created",
      data: activity,
    });

    return activity;
  }

  async logBulkActivities(request: FastifyRequest, reply: FastifyReply) {
    const { activities } = request.body as {
      activities: CreateActivityInput[];
    };

    if (!activities?.length) {
      return reply.code(400).send({ error: "Activities array is required" });
    }

    const result = await this.hasura.request(
      ACTIVITY_QUERIES.CREATE_BULK_ACTIVITIES,
      {
        activities: activities.map((activity) => ({
          action: activity.action,
          user_id: activity.userId,
          metadata: activity.metadata,
          source: activity.source || ActivitySource.API,
        })),
      }
    );

    await this.eventBus.emit("activity.bulk_created", {
      type: "activity.bulk_created",
      data: { count: result.insert_activity_log.affected_rows },
    });

    return {
      created: result.insert_activity_log.affected_rows,
      activities: result.insert_activity_log.returning,
    };
  }

  async getRecentActivities(request: FastifyRequest) {
    const limit = Math.min(Number(request.query?.limit) || 20, 100);
    const result = await this.hasura.request(
      ACTIVITY_QUERIES.GET_RECENT_ACTIVITIES,
      { limit }
    );
    return result.activity_log;
  }

  async getActivityStats(request: FastifyRequest) {
    const hoursBack = Number(request.query?.hours) || 24;
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    const result = await this.hasura.request(
      ACTIVITY_QUERIES.GET_ACTIVITY_STATS,
      {
        since: since.toISOString(),
      }
    );

    return {
      totalActivities: result.activity_log_aggregate.aggregate.count,
      timeRange: `${hoursBack} hours`,
      topActions: result.recent_actions.map((a: any) => a.action),
    };
  }

  async healthCheck() {
    try {
      await this.hasura.request(
        "query { activity_log_aggregate { aggregate { count } } }"
      );
      return { status: "healthy", feature: "activity" };
    } catch (error) {
      return { status: "unhealthy", feature: "activity", error: error.message };
    }
  }
}

// Register routes directly in the same file
export async function registerActivityRoutes(
  fastify: FastifyInstance,
  options: { hasura: HasuraClient; eventBus: EventBus }
) {
  const handlers = new ActivityHandlers(options.hasura, options.eventBus);

  // Register all routes with the handlers
  fastify.post("/api/activity/log", handlers.logActivity.bind(handlers));
  fastify.post("/api/activity/bulk", handlers.logBulkActivities.bind(handlers));
  fastify.get(
    "/api/activity/recent",
    handlers.getRecentActivities.bind(handlers)
  );
  fastify.get("/api/activity/stats", handlers.getActivityStats.bind(handlers));
  fastify.get("/api/activity/health", handlers.healthCheck.bind(handlers));
}
```

## 🚀 **Integration with Main App**

```typescript
// apps/api/src/app.ts
import { registerActivityRoutes } from "./features/activity/handlers.js";
import { HasuraClient } from "./shared/hasura/client.js";
import { InMemoryEventBus } from "./shared/events/bus.js";

export async function createApp() {
  const app = fastify();

  // Shared services
  const hasura = new HasuraClient(process.env.HASURA_URL!);
  const eventBus = new InMemoryEventBus();

  // Register feature routes
  await registerActivityRoutes(app, { hasura, eventBus });

  return app;
}
```

## 📈 **Benefits of This Approach**

### ✅ **Minimal File Count**

- **2 files per feature** (handlers + queries)
- **Shared types centralized** in `@repo/shared-types`
- **Easy navigation** with clear separation of concerns

### ✅ **Better Type Sharing**

- **Frontend**: Import types from `@repo/shared-types/activity`
- **Backend**: Import types from `@repo/shared-types/activity`
- **Documentation**: Import types from `@repo/shared-types/activity`
- **Single source of truth** for feature types

### ✅ **Preserved Hasura Benefits**

- **Auto-generated CRUD**: Direct use of Hasura mutations/queries
- **Real-time ready**: Easy to add GraphQL subscriptions
- **Complex queries**: Leverage Hasura's aggregation capabilities
- **Performance**: No unnecessary data mapping

### ✅ **Microservices Ready**

- **Clear boundaries**: Each feature is 2 files that can be extracted
- **Event-driven**: Loose coupling via event bus
- **Easy extraction**: Can become separate service with own Hasura instance

## 🎯 **Shared Types Package Structure**

```typescript
// packages/shared-types/src/index.ts
export * from './activity';
export * from './user';
export * from './health';
// ... other features

// packages/shared-types/package.json
{
  "name": "@repo/shared-types",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

## 🔄 **Usage Across Apps**

```typescript
// Frontend (apps/web)
import { Activity, ActivitySource } from "@repo/shared-types";

// Backend (apps/api)
import { CreateActivityInput } from "@repo/shared-types";

// Documentation (apps/docs)
import { Activity } from "@repo/shared-types";
```

## 📊 **Architecture Benefits**

| Aspect                  | This Approach           |
| ----------------------- | ----------------------- |
| **Files per Feature**   | 2 files                 |
| **Type Sharing**        | Centralized package     |
| **Hasura Benefits**     | ✅ Fully leveraged      |
| **Navigation**          | Simple 2-file structure |
| **Microservices Ready** | ✅ Clear boundaries     |
| **Boilerplate**         | Minimal                 |

**Result**: Clean, focused features that fully leverage Hasura while staying microservices-ready!
