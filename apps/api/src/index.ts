import fastify from "fastify";
import cors from "@fastify/cors";
import { HealthCheckResponse } from "@repo/api-types";
import {
  checkDbConnection,
  runMigrations,
  getEnhancedHealthStatus,
} from "./db/index.js";
import { seedDatabase } from "./db/seed.js";

// Start time for uptime calculation
const startTime = new Date();

// Create Fastify instance
const server = fastify({
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
server.register(cors, {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Health check route
server.get("/api/health", async (): Promise<HealthCheckResponse> => {
  const uptime = Date.now() - startTime.getTime();
  const uptimeInSeconds = Math.floor(uptime / 1000);

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

// Start the server
const start = async () => {
  try {
    // Run migrations and seeding on startup
    await runMigrations();
    await seedDatabase();

    const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    await server.listen({ port, host: "0.0.0.0" });
    const address = server.server.address();
    const listeningPort = typeof address === "string" ? address : address?.port;
    console.log(`Server listening on ${listeningPort}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
