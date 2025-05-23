# Architecture Best Practices

## Environment Configuration

### Fail Fast Principle
Applications should **fail immediately** if not properly configured rather than falling back to defaults. This ensures:
- Developers learn proper configuration
- Production issues are caught early
- No silent failures in misconfigured environments

### Rules
1. **No Default Environment Variables**: Never provide fallback values for required environment variables
2. **Explicit Configuration**: All environment variables must be explicitly set
3. **Clear Error Messages**: When configuration is missing, provide clear error messages indicating what needs to be configured

```javascript
// ❌ Bad - provides defaults
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ✅ Good - fails fast with clear error
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}
```

## Service Communication

### Database Access Pattern
- **Web app** should never directly connect to the database
- **API service** handles all database connections
- **Web app** calls API endpoints for data, including health checks
- This maintains proper separation of concerns and allows for:
  - Better security (database credentials only in API)
  - Easier scaling (API can be load balanced)
  - Cleaner architecture (single point of database access)

### Health Check Architecture
```
Web App Health Check → API Health Check → Database Connection
```

The web app's health endpoint should:
1. Call the API's health endpoint
2. Include API response in its own health response
3. Aggregate status (if API is down, web app reports degraded status)
4. Never bypass the API to check services directly

## Error Handling

### Health Check Responses
- Use appropriate HTTP status codes (503 for service unavailable)
- Include detailed error information in development
- Provide clear status indicators for monitoring systems
- Maintain consistent response format across services