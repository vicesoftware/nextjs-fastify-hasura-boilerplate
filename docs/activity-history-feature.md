# Activity History Feature Documentation

> **Complete guide to the activity history feature that demonstrates Hasura's auto-generated CRUD capabilities**

## Quick Links

### Live Demo

- **📊 Activity Dashboard**: [localhost:3000/activity](http://localhost:3000/activity) - See real-time activity updates
- **📚 Interactive Tutorial**: [localhost:3000/tutorial](http://localhost:3000/tutorial) - Step-by-step technical explanation

### Development Tools

- **🚀 Hasura Console**: [localhost:8080](http://localhost:8080) - Explore auto-generated GraphQL schema
- **🗄️ Drizzle Studio**: [local.drizzle.studio](https://local.drizzle.studio) - View database tables and data

## Overview

The Activity History feature is a comprehensive demonstration of **Hasura's auto-generated CRUD capabilities** integrated with a traditional REST API architecture. It showcases how Hasura can accelerate development by automatically generating GraphQL operations from your database schema.

### 🎯 Key Demonstration Points

- **✅ Zero Manual CRUD Code**: All database operations use Hasura's auto-generated APIs
- **✅ Real-time Updates**: Live activity feed with polling (upgradeable to subscriptions)
- **✅ Complex Queries**: Filtering, sorting, and pagination without writing SQL
- **✅ Type Safety**: End-to-end TypeScript from database to frontend
- **✅ Production Ready**: Auto-sync deployment workflow for CI/CD

## Architecture

The feature implements a **dual-layer architecture** that combines the best of both worlds:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  📱 ActivityFeed Component (apps/web/src/components/activity/)  │
│  ├── ⏰ Auto-refresh every 3 seconds                           │
│  ├── 📡 Fetches from REST API endpoint                         │
│  └── 🎨 Beautiful UI with real-time indicators                 │
└─────────────────────────────────────────────────────────────────┘
                          │ HTTP GET /api/activities
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  🚀 Fastify REST Endpoints (apps/api/src/index.ts)             │
│  ├── GET /api/activities → hasuraService.getRecentActivities() │
│  ├── POST /api/activities/bulk → hasuraService.logActivities() │
│  ├── POST /api/hasura/sync → Auto-track new tables             │
│  └── 🛡️ Error handling & fallback strategies                   │
└─────────────────────────────────────────────────────────────────┘
                          │ GraphQL Queries/Mutations
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Hasura GraphQL Engine                       │
├─────────────────────────────────────────────────────────────────┤
│  🚀 AUTO-GENERATED Operations (Zero Code Required!)            │
│  ├── query activity_log { ... }                                │
│  ├── mutation insert_activity_log_one { ... }                  │
│  ├── mutation insert_activity_log { ... } (bulk)               │
│  └── 🎯 Complex filtering, sorting, pagination                 │
└─────────────────────────────────────────────────────────────────┘
                          │ Optimized SQL Queries
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                         │
├─────────────────────────────────────────────────────────────────┤
│  🐘 activity_log table                                         │
│  ├── id (uuid, primary key)                                    │
│  ├── timestamp (auto-generated)                                │
│  ├── action (varchar, indexed)                                 │
│  └── 📊 Optimized indexes for performance                      │
└─────────────────────────────────────────────────────────────────┘
```

### 🛡️ API Gateway Benefits

- Unified REST interface for frontend
- Error handling & fallback strategies
- Business logic & validation
- Authentication & authorization

### 🚀 Hasura Benefits

- Zero manual CRUD code
- Auto-generated GraphQL schema
- Complex queries & relationships
- Real-time subscriptions ready

## Implementation Details

### 📊 Database Schema

Simple, focused schema designed to demonstrate core CRUD operations:

```sql
-- apps/api/src/db/migrations/0001_wandering_shinobi_shaw.sql
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamp DEFAULT now() NOT NULL,
  action varchar(100) NOT NULL
);

-- Performance indexes for common query patterns
CREATE INDEX idx_activity_log_timestamp ON activity_log (timestamp DESC);
CREATE INDEX idx_activity_log_action ON activity_log (action);

-- Sample data for demonstration
INSERT INTO activity_log (action) VALUES
('system.startup'),
('health.check'),
('database.migration');
```

### 🚀 Hasura Auto-Generated Operations

These GraphQL operations are automatically generated by Hasura based on the database schema:

```typescript
// apps/api/src/lib/hasura-client.ts

// 📖 READ: Get recent activities with sorting and limiting
export const GET_RECENT_ACTIVITIES = `
  query GetRecentActivities($limit: Int = 20) {
    activity_log(
      order_by: {timestamp: desc}
      limit: $limit
    ) {
      id
      timestamp
      action
    }
  }
`;

// ✏️ CREATE: Log a single activity
export const LOG_ACTIVITY = `
  mutation LogActivity($action: String!) {
    insert_activity_log_one(object: {action: $action}) {
      id
      timestamp
      action
    }
  }
`;

// 📝 BULK CREATE: Log multiple activities efficiently
export const LOG_ACTIVITIES_BULK = `
  mutation LogActivitiesBulk($activities: [activity_log_insert_input!]!) {
    insert_activity_log(objects: $activities) {
      affected_rows
      returning {
        id
        action
        timestamp
      }
    }
  }
`;

// 🔍 COMPLEX FILTERING: Filter by action types and date ranges
export const GET_ACTIVITIES_BY_ACTION = `
  query GetActivitiesByAction($actions: [String!]) {
    activity_log(
      where: {
        action: {_in: $actions}
        timestamp: {_gte: "2024-01-01"}
      }
      order_by: {timestamp: desc}
    ) {
      id
      timestamp
      action
    }
  }
`;
```

### 📝 Activity Logger Service

Dual logging strategy with Hasura-first approach and database fallback:

```typescript
// apps/api/src/lib/activity-logger.ts
export class ActivityLogger {
  // Primary: Log via Hasura (demonstrates auto-generated mutations)
  async logActivity(action: string): Promise<boolean> {
    const hasuraSuccess = await hasuraService.logActivity(action);

    if (!hasuraSuccess) {
      // Fallback: Direct database logging for reliability
      return await this.logActivityDirect(action);
    }

    return true;
  }

  // Bulk logging via Hasura (demonstrates bulk operations)
  async logActivitiesBulk(actions: string[]): Promise<boolean> {
    const hasuraSuccess = await hasuraService.logActivitiesBulk(actions);

    if (!hasuraSuccess) {
      // Fallback: Log individually to database
      for (const action of actions) {
        await this.logActivityDirect(action);
      }
    }

    return true;
  }
}
```

### 📱 Frontend Integration

React component with auto-refresh polling (upgradeable to real-time subscriptions):

```typescript
// apps/web/src/components/activity/ActivityFeed.tsx
export function ActivityFeed({ limit = 20, refreshInterval = 5000 }) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);

  const fetchActivities = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities`);
    const data = await response.json();

    if (data.success) {
      setActivities(data.data); // 🔄 Update with fresh data
    }
  };

  useEffect(() => {
    fetchActivities(); // 🚀 Initial load

    // ⏰ Auto-refresh every 5 seconds
    const interval = setInterval(fetchActivities, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // 🎨 Beautiful UI with activity icons and timestamps
  return (
    <div className="activity-feed">
      {activities.map(activity => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
```

## Production Features

### 🚀 Auto-Sync Deployment

Automatic table tracking for CI/CD pipelines:

```
POST /api/hasura/sync
→ Discovers new tables
→ Tracks in Hasura automatically
→ Generates CRUD operations
```

### 🛡️ Error Handling

Graceful fallbacks and reliability:

- ✅ Hasura-first logging strategy
- ✅ Database fallback for reliability
- ✅ Non-blocking error handling
- ✅ Graceful degradation

### 📊 Performance Optimization

Database and query optimization:

- ✅ Optimized database indexes
- ✅ Query result limiting
- ✅ Efficient polling intervals
- ✅ Hasura query optimization

### 🔄 Real-time Ready

Easy upgrade path to true real-time:

- ✅ GraphQL subscription foundation
- ✅ WebSocket infrastructure ready
- ✅ Instant update capability
- ✅ Scalable real-time architecture

## Getting Started

### 🚀 Quick Start

1. Start the development environment: `pnpm dev`
2. Visit the Activity Dashboard: [localhost:3000/activity](http://localhost:3000/activity)
3. Watch real-time updates every 3 seconds
4. Explore the tutorial: [localhost:3000/tutorial](http://localhost:3000/tutorial)

### 🔍 Explore the Implementation

- **Database**: Check Drizzle Studio at [local.drizzle.studio](https://local.drizzle.studio)
- **GraphQL**: Explore Hasura Console at [localhost:8080](http://localhost:8080)
- **API**: Test endpoints at `localhost:4000/api/activities`
- **Code**: Review implementation in `apps/api/src/lib/`

## Future Enhancements

### 📡 Real-time Subscriptions

Upgrade from polling to instant updates:

- GraphQL subscriptions via WebSocket
- Instant activity updates
- Live user activity streams
- System monitoring dashboards

### 📊 Advanced Analytics

Enhanced data analysis capabilities:

- Activity aggregation queries
- User engagement analytics
- Performance metrics
- Custom reporting dashboards

### 🔍 Advanced Filtering

Sophisticated query capabilities:

- Full-text search
- Date range filtering
- User-specific activity streams
- Custom filter combinations

### 🚀 Production Scaling

Enterprise-ready features:

- Redis caching layer
- Rate limiting
- Horizontal scaling
- Advanced monitoring

## File Structure

```
📁 Project Root
├── 📁 apps/
│   ├── 📁 api/
│   │   └── 📁 src/
│   │       ├── 📁 db/
│   │       │   ├── 📄 schema.ts                           # ✅ Activity log table schema
│   │       │   └── 📁 migrations/
│   │       │       └── 📄 0001_wandering_shinobi_shaw.sql # ✅ Migration file (applied)
│   │       ├── 📁 lib/
│   │       │   ├── 📄 activity-logger.ts                  # ✅ Activity logging service
│   │       │   └── 📄 hasura-client.ts                    # ✅ Enhanced with activity queries
│   │       └── 📄 index.ts                                # ✅ API endpoints
│   └── 📁 web/
│       └── 📁 src/
│           ├── 📁 components/activity/
│           │   └── 📄 ActivityFeed.tsx                    # ✅ Real-time activity feed
│           ├── 📁 app/
│           │   ├── 📄 activity/page.tsx                   # ✅ Activity dashboard page
│           │   └── 📄 tutorial/page.tsx                   # ✅ Interactive tutorial
└── 📁 docs/
    └── 📄 activity-history-feature.md                     # ✅ This documentation
```

## API Endpoints

### Available Endpoints

- `GET /api/activities` - Recent activities using Hasura auto-generated query
- `POST /api/activities/bulk` - Bulk activity logging via Hasura mutations
- `POST /api/hasura/sync` - Auto-track new database tables in Hasura
- `GET /api/hasura/status` - Check Hasura connection and tracked tables

### Example Usage

```bash
# Get recent activities
curl http://localhost:4000/api/activities

# Log multiple activities
curl -X POST http://localhost:4000/api/activities/bulk \
  -H "Content-Type: application/json" \
  -d '{"actions": ["user.login", "page.view", "api.request"]}'

# Sync new tables with Hasura
curl -X POST http://localhost:4000/api/hasura/sync
```

## Related Documentation

### Architecture Guides

- [Hasura Integration Guide](../hasura-integration.md)
- [API Gateway Pattern](../api-gateway-pattern.md)
- [Database Design Principles](../database-design.md)

### Implementation Details

- [End-to-End Type Safety](../type-safety.md)
- [Real-time Features](../real-time-features.md)
- [Production Deployment](../deployment-guide.md)

---

**💡 This feature demonstrates the power of Hasura's auto-generated CRUD capabilities while maintaining the flexibility of a traditional API Gateway architecture. It's designed to be both educational and production-ready.**
