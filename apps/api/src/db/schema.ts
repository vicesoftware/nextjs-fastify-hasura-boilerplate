import {
  serial,
  varchar,
  timestamp,
  jsonb,
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";

// Application metadata for version tracking
export const appMetadata = pgTable(
  "app_metadata",
  {
    id: serial("id").primaryKey(),
    component: varchar("component", { length: 50 }).notNull(),
    version: varchar("version", { length: 20 }).notNull(),
    deployedAt: timestamp("deployed_at").defaultNow(),
    gitCommit: varchar("git_commit", { length: 40 }),
    environment: varchar("environment", { length: 20 }).default("production"),
    metadata: jsonb("metadata"),
  },
  (table) => ({
    uniqueComponentEnvironment: {
      name: "app_metadata_component_environment_unique",
      columns: [table.component, table.environment],
    },
  })
);

// Health check snapshots for historical analysis
export const healthSnapshots = pgTable("health_snapshots", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  overallStatus: varchar("overall_status", { length: 10 }).notNull(),
  componentStatuses: jsonb("component_statuses").notNull(),
  responseTimes: jsonb("response_times"),
  errors: jsonb("errors"),
});

// Simple activity log for tracking app history
export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  action: varchar("action", { length: 100 }).notNull(), // 'user.login', 'health.check', 'api.request'
});
