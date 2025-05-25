import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "./schema.js";
import {
  hasuraService,
  type AppMetadata,
  type HealthSnapshot,
} from "../lib/hasura-client.js";

// Get connection string from environment variable - make resilient for service startup
const connectionString = process.env.DATABASE_URL;

console.log("=== DATABASE CONNECTION DEBUG ===");
console.log("DATABASE_URL:", connectionString ? "SET" : "NOT SET");
console.log(
  "All DATABASE/POSTGRES env vars:",
  Object.keys(process.env).filter(
    (key) =>
      key.includes("DATABASE") || key.includes("POSTGRES") || key.includes("DB")
  )
);
console.log(
  "All RENDER env vars:",
  Object.keys(process.env).filter((key) => key.includes("RENDER"))
);

if (!connectionString) {
  console.warn(
    "DATABASE_URL environment variable is not set - database features will be disabled until service is ready"
  );
  console.warn(
    "This is normal during startup while waiting for PostgreSQL service to become available"
  );
} else {
  console.log(
    "Database connection string:",
    connectionString.replace(/:[^:@]*@/, ":***@")
  ); // Log with masked password
}

// Create a PostgreSQL connection pool (will be null if no connection string)
export const pool = connectionString ? new Pool({ connectionString }) : null;

// Create Drizzle database instance (will be null if no pool)
export const db = pool ? drizzle(pool, { schema }) : null;

// Run migrations on startup with retry logic
export async function runMigrations() {
  if (!pool || !db) {
    console.warn("Database not available - skipping migrations");
    return;
  }

  const maxRetries = 5;
  const retryDelay = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Migration attempt ${attempt}/${maxRetries}`);
      await migrate(db, { migrationsFolder: "./src/db/migrations" });
      console.log("Database migrations completed successfully");
      return;
    } catch (error) {
      console.error(`Migration attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        console.error("All migration attempts failed");
        throw error;
      }

      console.log(`Retrying in ${retryDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

// Export function to test the database connection
export async function checkDbConnection() {
  if (!pool) {
    return {
      status: "down",
      error: "Database pool not available - DATABASE_URL not set",
    };
  }

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
