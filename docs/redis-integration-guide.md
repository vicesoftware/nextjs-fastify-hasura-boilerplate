# Redis Integration Guide for Next.js + NestJS Applications <!-- omit in toc -->

This guide explains when and how to add Redis to your Turborepo monorepo with Next.js and NestJS.

- [Why Redis?](#why-redis)
  - [Key Benefits](#key-benefits)
- [When to Add Redis](#when-to-add-redis)
  - [User Scale Thresholds](#user-scale-thresholds)
- [Common Use Cases and Implementation Timing](#common-use-cases-and-implementation-timing)
  - [Application Complexity Indicators](#application-complexity-indicators)
  - [Infrastructure Considerations](#infrastructure-considerations)
  - [Cost/Benefit Perspective](#costbenefit-perspective)
- [Implementation with Render](#implementation-with-render)
  - [1. Add Redis Service in Render](#1-add-redis-service-in-render)
  - [2. Get Connection Details](#2-get-connection-details)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Add Redis to Next.js (Frontend)](#4-add-redis-to-nextjs-frontend)
  - [5. Add Redis to NestJS (Backend)](#5-add-redis-to-nestjs-backend)
- [Common Use Cases](#common-use-cases)
  - [Caching in NestJS](#caching-in-nestjs)
  - [Rate Limiting in NestJS](#rate-limiting-in-nestjs)
  - [WebSocket Scaling with Socket.IO in NestJS](#websocket-scaling-with-socketio-in-nestjs)
- [Monitoring Redis](#monitoring-redis)
- [Resources](#resources)

## Why Redis?

Redis is an in-memory data structure store that can significantly enhance your application's performance, scalability, and capabilities.

### Key Benefits

1. **Caching**: Dramatically speeds up responses by storing frequent data in memory
2. **Session Management**: Efficiently store and retrieve user sessions across distributed servers
3. **Rate Limiting**: Protect your APIs from abuse with distributed request throttling
4. **Real-time Communication**: Enable WebSocket scaling across multiple server instances
5. **Distributed Locking**: Coordinate processes across different services/instances

## When to Add Redis

Redis provides the most value when your application reaches certain complexity thresholds:

### User Scale Thresholds

- **100+ concurrent users**: At this scale, Redis can noticeably improve response times through caching frequently requested data.

- **1,000+ users**: Session management becomes significantly more efficient with Redis compared to database-stored sessions.

- **10,000+ users**: Redis becomes almost mandatory for rate limiting and managing high connection loads, especially during traffic spikes.

## Common Use Cases and Implementation Timing

| Feature            | When to Implement                                                                                                                  | Value Provided                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Caching            | • Database queries become a bottleneck<br>• The same data is requested frequently<br>• Response times exceed acceptable thresholds | • Reduced database load<br>• Faster response times<br>• Lower infrastructure costs                            |
| Session Management | • Deploying multiple API instances<br>• Using serverless functions<br>• Implementing authentication                                | • Seamless user experience across instances<br>• Improved security<br>• Reduced database load                 |
| Rate Limiting      | • Public-facing APIs<br>• High-value endpoints vulnerable to abuse<br>• Multi-instance deployment                                  | • Protection against abuse/DDoS<br>• Fair resource allocation<br>• Controlled scaling costs                   |
| WebSocket Scaling  | • Adding real-time features (chat, notifications)<br>• Multiple server instances<br>• 1000+ concurrent connections                 | • Seamless message delivery across instances<br>• Horizontal scaling for WebSockets<br>• Improved reliability | # Redis Integration Guide for Next.js + NestJS Applications |

### Application Complexity Indicators

Redis becomes increasingly valuable when your application:

1. **Moves to multiple instances/servers**: Once you deploy multiple API instances behind a load balancer, Redis becomes essential for:

   - Sharing session data between instances
   - Coordinating real-time messages
   - Implementing distributed locking

2. **Has performance bottlenecks in database queries**: When you identify frequently executed but slow queries that return the same data repeatedly, Redis caching provides immediate performance gains.

3. **Implements real-time features**: When adding chat, notifications, or other real-time features, Redis Pub/Sub becomes critical for scaling WebSocket connections across multiple server instances.

4. **Requires shared state across services**: As you break your application into microservices, Redis becomes invaluable as a high-performance shared state layer.

### Infrastructure Considerations

Redis becomes particularly valuable when:

- You're deploying to Kubernetes or other container orchestration platforms where instances are ephemeral
- Your application needs to scale horizontally to handle traffic spikes
- You need to implement request throttling to protect downstream services
- You're working with serverless architectures that need to share state

### Cost/Benefit Perspective

Redis introduces its most valuable cost/benefit ratio when:

- Database costs increase due to connection count or query volume
- Application response time becomes a business concern
- Engineering time is spent solving problems Redis already handles efficiently
- Your application needs to maintain reliability during traffic spikes

## Implementation with Render

Render makes it easy to add Redis to your application stack:

### 1. Add Redis Service in Render

1. Log in to your Render dashboard
2. Navigate to "New" and select "Redis"
3. Configure settings:
   - Name: `your-app-redis`
   - Plan: Choose based on your needs (start with smallest)
   - Region: Select same region as your web services
4. Click "Create Redis"

### 2. Get Connection Details

After creation, Render will provide:

- Redis URL (`redis://...`)
- Internal URL (for services in the same Render network)
- Password

### 3. Configure Environment Variables

Add these variables to your Render web services:

- `REDIS_HOST` - Redis hostname (from Internal URL)
- `REDIS_PORT` - Usually 6379
- `REDIS_PASSWORD` - Generated password
- `REDIS_URL` - Full connection string (optional)

### 4. Add Redis to Next.js (Frontend)

```typescript
// lib/redis.ts
import { Redis } from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

export default redis;
```

### 5. Add Redis to NestJS (Backend)

Install required packages:

```bash
cd apps/api
npm install @nestjs/cache-manager cache-manager cache-manager-redis-store redis
```

Create Redis module:

```typescript
// src/redis/redis.module.ts
import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get("REDIS_HOST"),
        port: configService.get("REDIS_PORT"),
        password: configService.get("REDIS_PASSWORD"),
        ttl: 60 * 60, // 1 hour cache lifetime
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
```

## Common Use Cases

### Caching in NestJS

```typescript
import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class UsersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async findAll() {
    // Try to get data from cache
    let users = await this.cacheManager.get("all_users");

    if (!users) {
      // If not in cache, get from database
      users = await this.usersRepository.findAll();

      // Store in cache for next time
      await this.cacheManager.set("all_users", users);
    }

    return users;
  }
}
```

### Rate Limiting in NestJS

```typescript
// Install required package:
// npm install @nestjs/throttler

// app.module.ts
import { ThrottlerModule } from "@nestjs/throttler";
import { ThrottlerStorageRedisService } from "@nestjs/throttler/dist/throttler-storage-redis.service";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: new ThrottlerStorageRedisService({
          host: config.get("REDIS_HOST"),
          port: config.get("REDIS_PORT"),
          password: config.get("REDIS_PASSWORD"),
        }),
        limit: 10, // 10 requests
        ttl: 60, // per 60 seconds
      }),
    }),
  ],
})
export class AppModule {}
```

### WebSocket Scaling with Socket.IO in NestJS

```typescript
// Install required packages:
// npm install @nestjs/websockets @socket.io/redis-adapter socket.io redis

// src/app.gateway.ts
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

@WebSocketGateway({
  cors: true,
})
export class AppGateway {
  @WebSocketServer() server: Server;

  async afterInit() {
    const pubClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
    });

    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.server.adapter(createAdapter(pubClient, subClient));
  }
}
```

## Monitoring Redis

Render provides metrics for your Redis instance. Additionally, consider:

1. Setting up alerts for Redis memory usage
2. Monitoring cache hit/miss rates
3. Configuring appropriate maxmemory-policy based on your use case

## Resources

- [Render Redis Documentation](https://render.com/docs/redis)
- [NestJS Caching](https://docs.nestjs.com/techniques/caching)
- [Redis Official Documentation](https://redis.io/documentation)
- [Socket.IO Redis Adapter](https://socket.io/docs/v4/redis-adapter/)
