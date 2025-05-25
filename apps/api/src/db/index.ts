import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "./schema.js";
import {
  hasuraService,
  type AppMetadata,
  type HealthSnapshot,
} from "../lib/hasura-client.js";

// Get connection string from environment variable
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:25432/app";

// Create a PostgreSQL connection pool
export const pool = new Pool({ connectionString });

// Create Drizzle database instance
export const db = drizzle(pool, { schema });

// Run migrations on startup
export async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Export function to test the database connection
export async function checkDbConnection() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT NOW() as time");
      return {
        status: "up",
        responseTime: Date.now(),
        timestamp: result.rows[0].time,
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    return {
      status: "down",
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}

// Enhanced health check function with Hasura integration
export async function getEnhancedHealthStatus() {
  const startTime = Date.now();

  // 1. Check direct database connection (existing functionality)
  const dbStatus = await checkDbConnection();

  // 2. Test Hasura connection
  const hasuraAvailable = await hasuraService.testConnection();

  // 3. Fetch version metadata from Hasura (with fallback)
  let versions: AppMetadata[] = [];
  if (hasuraAvailable) {
    try {
      const environment = process.env.NODE_ENV || "production";
      versions = await hasuraService.getAppMetadata(environment);
    } catch (error) {
      console.error("Failed to fetch version metadata:", error);
    }
  }

  // 4. Prepare health snapshot for recording
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

  // 5. Record health snapshot (non-blocking)
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
