# Database Health Check Implementation Plan

## Current Status

### ✅ Completed
- **Database Connection Module**: Created `apps/api/src/db/index.ts` with PostgreSQL connection pool and health check function
- **API Health Endpoint**: Implemented `/api/health` in Fastify API with database connectivity check
- **Docker Configuration**: Set up `docker-compose.yml` with PostgreSQL 16 container and health checks
- **Production Configuration**: Added database environment variables to `render.yaml` for Render deployment

### 🔄 In Progress
- **Testing Database Connectivity**: Need to validate local and production database connections

### ⏳ Pending Tasks

#### High Priority
1. **Local Testing Setup**
   - Create `.env.example` with database configuration templates
   - Test local database startup with `docker-compose up`
   - Verify API can connect to local database
   - Test health endpoints return correct database status

2. **Web App Database Integration**
   - Add database health check to web app's `/api/health` endpoint
   - Ensure consistent health check response format between API and web

#### Medium Priority
3. **Health Check Enhancements**
   - Update API types to include database health indicator interface
   - Add database connection pooling metrics to health responses
   - Implement database migration health checks

4. **Documentation & Configuration**
   - Document database setup process in README
   - Add environment variable documentation
   - Create troubleshooting guide for database connectivity issues

#### Low Priority
5. **Production Validation**
   - Test Render deployment with PostgreSQL service
   - Validate database connectivity in production environment
   - Monitor health check endpoints for database-related failures

## Technical Implementation Details

### Current Database Setup
- **Database**: PostgreSQL 16 (Alpine Linux)
- **Local Port**: 25432 (mapped to container port 5432)
- **Connection Pool**: Node.js `pg` library with connection pooling
- **Health Check**: Simple `SELECT NOW()` query to verify connectivity

### Environment Variables
```bash
# Local Development
DATABASE_URL=postgres://postgres:postgres@localhost:25432/app

# Production (Render)
DATABASE_URL=<from Render PostgreSQL service>
POSTGRES_USER=<from Render PostgreSQL service>
POSTGRES_PASSWORD=<from Render PostgreSQL service>
POSTGRES_DB=<from Render PostgreSQL service>
```

### Health Check Endpoints
- **API**: `GET /api/health` - Includes database status in response
- **Web**: `GET /api/health` - Currently missing database check
- **Expected Response Format**:
```json
{
  "status": "up",
  "details": {
    "database": {
      "status": "up",
      "responseTime": 1234567890,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Testing Strategy

### 1. Local Development Testing
```bash
# Start database
docker-compose up -d postgres

# Test database connection
docker exec app-postgres pg_isready -U postgres

# Start API and verify health check
cd apps/api && pnpm dev
curl http://localhost:4000/api/health

# Start web app and verify health check
cd apps/web && pnpm dev
curl http://localhost:3000/api/health
```

### 2. Integration Testing
- Verify health checks return "down" status when database is unavailable
- Test connection pool recovery after database restart
- Validate CORS configuration allows health check access from web app

### 3. Production Testing
- Deploy to Render and verify PostgreSQL service connectivity
- Monitor health check endpoints for consistent "up" status
- Test failover scenarios and error handling

## Success Criteria
- [ ] Local database starts successfully with `docker-compose up`
- [ ] API health check returns database status
- [ ] Web health check includes database connectivity
- [ ] Production deployment connects to Render PostgreSQL
- [ ] Health checks accurately reflect database availability
- [ ] Documentation is complete and accurate

## Next Steps
1. Create `.env.example` file
2. Test local database setup
3. Add database health check to web app
4. Validate production deployment