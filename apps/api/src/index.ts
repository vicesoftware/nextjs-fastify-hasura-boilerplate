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
import { hasuraSyncRoutes } from "./routes/hasura-sync.js";

// Import new microservices architecture components
import { HasuraClient } from "./shared/hasura/client.js";
import { InMemoryEventBus } from "./shared/events/bus.js";
import { registerActivityRoutes } from "./features/activity/handlers.js";
import { ActivityLoggerService } from "./features/activity/service.js";

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

// Initialize new microservices architecture components
const hasura = new HasuraClient();
const eventBus = new InMemoryEventBus();
const activityService = new ActivityLoggerService(hasura, eventBus);

// Register new microservices feature routes
await registerActivityRoutes(server, { hasura, eventBus });

console.log("🏗️ Microservices architecture routes registered:");
console.log("  POST /api/activity/log");
console.log("  POST /api/activity/bulk");
console.log("  GET  /api/activity/recent");
console.log("  GET  /api/activity/stats");
console.log("  GET  /api/activity/health");

// Log system startup using new activity service
await activityService.logAppEvent("startup");

// Health check route
server.get("/api/health", async (): Promise<HealthCheckResponse> => {
  const uptime = Date.now() - startTime.getTime();
  const uptimeInSeconds = Math.floor(uptime / 1000);

  // Log health check activity using new service
  await activityService.logHealthCheck();

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
    await activityService.logError("health_check_failed");

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

// NOTE: Removed old /api/activities and /api/activities/bulk routes
// These are now handled by the new microservices feature with backward compatibility

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
    await activityService.log("server.started");

    console.log(`🚀 API Server running on port ${port}`);
    console.log(
      `📊 Activity logging enabled - demonstrating Hasura's CRUD capabilities`
    );
  } catch (err) {
    await activityService.logError("server_start_failed");
    server.log.error(err);
    process.exit(1);
  }
};

start();
