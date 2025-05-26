import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { HealthCheckResponse } from "@repo/api-types";
import {
  checkDbConnection,
  runMigrations,
  getEnhancedHealthStatus,
} from "./db/index.js";
import { seedDatabase } from "./db/seed.js";
import { versionSyncService } from "./services/version-sync.js";
import { activityLogger } from "./lib/activity-logger.js";
import { hasuraService } from "./lib/hasura-client.js";
import { hasuraSyncRoutes } from "./routes/hasura-sync.js";

// Start time for uptime calculation
const startTime = new Date();

// Create Fastify instance
const server = Fastify({
  logger: true,
});

// Configure CORS
// Get allowed origins from environment variables
const allowedOrigins = [
  "http://localhost:3000", // Local Next.js development
  "https://web-ubxh.onrender.com", // Production web app
];

// Add WEB_URL from environment if it exists
if (process.env.WEB_URL) {
  allowedOrigins.push(process.env.WEB_URL);
  console.log(`Adding ${process.env.WEB_URL} to CORS allowed origins`);
}

// Register CORS plugin
await server.register(cors, {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Register Hasura sync routes
await server.register(hasuraSyncRoutes);

// Log system startup
await activityLogger.logAppEvent("startup");

// Health check route
server.get("/api/health", async (): Promise<HealthCheckResponse> => {
  const uptime = Date.now() - startTime.getTime();
  const uptimeInSeconds = Math.floor(uptime / 1000);

  // Log health check activity
  await activityLogger.logHealthCheck();

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
        memory_heap: {
          status: "up",
        },
        disk: {
          status: "up",
        },
        database: enhancedStatus.dbStatus,
        hasura: {
          status: enhancedStatus.hasuraAvailable ? "up" : "down",
          response_time: enhancedStatus.responseTime,
        },
      },
    } as HealthCheckResponse;
  } catch (error) {
    console.error(
      "Enhanced health check failed, falling back to basic check:",
      error
    );

    // Log error activity
    await activityLogger.logError("health_check_failed");

    // Fallback to basic health check if enhanced version fails
    const dbStatus = await checkDbConnection();

    return {
      status: dbStatus.status === "down" ? "down" : "up",
      info: {},
      details: {
        uptime: {
          status: "up",
          uptimeInSeconds,
          startedAt: startTime.toISOString(),
        },
        memory_heap: {
          status: "up",
        },
        disk: {
          status: "up",
        },
        database: dbStatus,
      },
    } as HealthCheckResponse;
  }
});

// Activity demo endpoint - demonstrates Hasura's auto-generated CRUD
server.get("/api/activities", async () => {
  // Log API request
  await activityLogger.logApiRequest("activities");

  try {
    // Get recent activities using Hasura's auto-generated query
    const activities = await hasuraService.getRecentActivities(10);

    return {
      success: true,
      data: activities,
      message: "Recent activities fetched using Hasura's auto-generated query",
    };
  } catch (error) {
    await activityLogger.logError("activities_fetch_failed");
    return {
      success: false,
      error: "Failed to fetch activities",
      message: "This demonstrates Hasura's error handling",
    };
  }
});

// Bulk activity logging demo endpoint
server.post("/api/activities/bulk", async (request) => {
  const { actions } = request.body as { actions: string[] };

  if (!actions || !Array.isArray(actions)) {
    return {
      success: false,
      error: "Invalid request: actions array required",
    };
  }

  try {
    // Demonstrate Hasura's bulk insert capabilities
    const success = await activityLogger.logBulk(actions);

    return {
      success,
      message: success
        ? `${actions.length} activities logged using Hasura's auto-generated bulk mutation`
        : "Failed to log activities in bulk",
    };
  } catch (error) {
    await activityLogger.logError("bulk_logging_failed");
    return {
      success: false,
      error: "Failed to log activities in bulk",
    };
  }
});

// Start the server
const start = async () => {
  try {
    // Run migrations and seeding on startup
    await runMigrations();
    await seedDatabase();

    // Sync version information to database (non-blocking)
    versionSyncService.syncVersionOnStartup().catch((error) => {
      console.warn("Version sync failed during startup:", error);
    });

    const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    await server.listen({ port, host: "0.0.0.0" });
    const address = server.server.address();
    const listeningPort = typeof address === "string" ? address : address?.port;
    console.log(`Server listening on ${listeningPort}`);

    // Log successful startup
    await activityLogger.log("server.started");

    console.log(`🚀 API Server running on port ${port}`);
    console.log(
      `📊 Activity logging enabled - demonstrating Hasura's CRUD capabilities`
    );
  } catch (err) {
    await activityLogger.logError("server_start_failed");
    server.log.error(err);
    process.exit(1);
  }
};

start();
