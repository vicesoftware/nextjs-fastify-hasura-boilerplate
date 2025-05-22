# CORS Configuration Guide

This document explains how CORS (Cross-Origin Resource Sharing) is configured in this monorepo to enable proper communication between services.

## Overview

CORS is configured in three places:
1. **NestJS API Service**: Configures server-side CORS to allow requests from the Next.js web application
2. **Fastify API Service**: Configures server-side CORS to allow requests from the Next.js web application
3. **Next.js API Routes**: Configures CORS headers for API routes within the Next.js app

## NestJS API Configuration

The NestJS API service is configured to allow cross-origin requests from:
- `http://localhost:3000` (local development)
- The deployed web application URL from Render
- Any URL specified in the `WEB_URL` environment variable

The configuration is in `apps/api/src/main.ts`:

```typescript
// Enable CORS for Next.js frontend
// Get allowed origins from environment variables
const allowedOrigins = [
  'http://localhost:3000',
  'https://web-ubxh.onrender.com'
];

// Add WEB_URL from environment if it exists
if (process.env.WEB_URL) {
  allowedOrigins.push(process.env.WEB_URL);
  console.log(`Adding ${process.env.WEB_URL} to CORS allowed origins`);
}

app.enableCors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
});
```

## Fastify API Configuration

The Fastify API service follows a similar approach, allowing cross-origin requests from:
- `http://localhost:3000` (local development)
- The deployed web application URL from Render
- Any URL specified in the `WEB_URL` environment variable

The configuration is in `apps/api-fastify/src/index.ts`:

```typescript
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
```

## Next.js API Routes Configuration

The Next.js application includes a utility to handle CORS for its API routes in `apps/web/src/app/api/cors.ts`:

```typescript
// CORS headers for Next.js API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://web-ubxh.onrender.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// Helper function to handle OPTIONS requests
export function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
```

To use these CORS headers in a Next.js API route:

```typescript
import { NextResponse } from "next/server";
import { corsHeaders, handleOptions } from "../cors";

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return handleOptions();
}

// Include CORS headers in the response
export async function GET() {
  return NextResponse.json(data, { 
    status: 200,
    headers: corsHeaders
  });
}
```

## Environment Variables

The CORS configuration uses the following environment variables:

1. **WEB_URL**: The URL of the deployed web application, set in the Render configuration:
   ```yaml
   # In render.yaml
   - key: WEB_URL
     fromService:
       type: web
       name: web
       property: url
   ```

2. **NEXT_PUBLIC_API_URL**: The URL of the API service, used by the web app to make requests:
   ```yaml
   # In render.yaml
   - key: NEXT_PUBLIC_API_URL
     value: "https://api-82a7.onrender.com/api"
   ```

## Health Check Integration

The health check feature in the web application makes cross-origin requests to the API service using this CORS configuration:

```typescript
// In apps/web/src/components/health-status-wrapper.tsx
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/health`;
return <HealthStatus apiUrl={apiUrl} />;
```

## Testing CORS Configuration

To verify the CORS configuration is working:

1. Deploy the changes to Render
2. Visit the web application URL
3. Check that the health status component successfully loads data from the API
4. Inspect network requests in browser dev tools to confirm proper CORS headers
5. Check the API service logs for confirmation of the WEB_URL environment variable

If CORS issues occur, check:
- That all URLs in the allowed origins list are correct
- That the environment variables are properly set in Render
- That both services are successfully deployed and running