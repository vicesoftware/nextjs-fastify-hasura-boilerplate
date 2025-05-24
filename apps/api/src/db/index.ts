import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from './schema';

// Get connection string from environment variable
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:25432/app';

// Create a PostgreSQL connection pool
export const pool = new Pool({ connectionString });

// Create Drizzle database instance
export const db = drizzle(pool, { schema });

// Run migrations on startup
export async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Export function to test the database connection
export async function checkDbConnection() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW() as time');
      return {
        status: 'up',
        responseTime: Date.now(),
        timestamp: result.rows[0].time
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    return {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}