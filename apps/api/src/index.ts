import fastify from 'fastify';
import cors from '@fastify/cors';
import { HealthCheckResponse } from '@repo/api-types';
import { checkDbConnection } from './db';

// Start time for uptime calculation
const startTime = new Date();

// Create Fastify instance
const server = fastify({
  logger: true
});

// Configure CORS
// Get allowed origins from environment variables
const allowedOrigins = [
  'http://localhost:3000',  // Local Next.js development
  'https://web-ubxh.onrender.com'  // Production web app
];

// Add WEB_URL from environment if it exists
if (process.env.WEB_URL) {
  allowedOrigins.push(process.env.WEB_URL);
  console.log(`Adding ${process.env.WEB_URL} to CORS allowed origins`);
}

// Register CORS plugin
server.register(cors, {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Health check route
server.get('/api/health', async (): Promise<HealthCheckResponse> => {
  const uptime = Date.now() - startTime.getTime();
  const uptimeInSeconds = Math.floor(uptime / 1000);

  // Get package info
  // Note: Using require for JSON files as they need resolveJsonModule
  const packageJson = require('../package.json');
  const rootPackageJson = require('../../../package.json');

  // Check database connection
  const dbStatus = await checkDbConnection();
  
  return {
    status: dbStatus.status === 'down' ? 'down' : 'up',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    details: {
      uptime: {
        status: 'up',
        uptimeInSeconds,
        startedAt: startTime.toISOString(),
      },
      memory_heap: {
        status: 'up',
      },
      disk: {
        status: 'up',
      },
      database: dbStatus,
    },
    version: {
      app: packageJson.version,
      monorepo: rootPackageJson.name,
      packageManager: rootPackageJson.packageManager,
      node: process.version,
    },
  };
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on ${server.server.address().port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();