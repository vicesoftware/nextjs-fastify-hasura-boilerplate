# API Server

A lightweight API server implementation using Fastify.

## Features

- Fast, low-overhead API server
- Health check endpoint with system metrics
- CORS configuration for cross-origin requests
- Simple, maintainable codebase

## Project Setup

```bash
$ pnpm install
```

## Running the Project

```bash
# Development with hot reload
$ pnpm dev

# Production build
$ pnpm build

# Run production build
$ pnpm start
```

## API Endpoints

- `GET /api/health` - Health check endpoint that returns system metrics and uptime

## Environment Variables

- `PORT` - The port to run the server on (default: 5001)
- `NODE_ENV` - The environment mode (development, production)
- `WEB_URL` - The URL of the web frontend (for CORS configuration)