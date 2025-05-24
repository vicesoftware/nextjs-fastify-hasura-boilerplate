import { serial, varchar, timestamp, jsonb, pgTable, unique } from 'drizzle-orm/pg-core';

// Application metadata and version tracking
export const appMetadata = pgTable('app_metadata', {
  id: serial('id').primaryKey(),
  component: varchar('component', { length: 50 }).notNull(),
  version: varchar('version', { length: 20 }).notNull(),
  deployedAt: timestamp('deployed_at').defaultNow(),
  gitCommit: varchar('git_commit', { length: 40 }),
  environment: varchar('environment', { length: 20 }).default('production'),
  metadata: jsonb('metadata'),
}, (table) => {
  return {
    componentEnvironmentUnique: unique().on(table.component, table.environment),
  };
});

// Health check snapshots for historical analysis
export const healthSnapshots = pgTable('health_snapshots', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  overallStatus: varchar('overall_status', { length: 10 }).notNull(),
  componentStatuses: jsonb('component_statuses').notNull(),
  responseTimes: jsonb('response_times'),
  errors: jsonb('errors'),
});