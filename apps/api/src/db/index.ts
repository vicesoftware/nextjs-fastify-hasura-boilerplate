import { Pool } from 'pg';

// Get connection string from environment variable
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:25432/app';

// Create a PostgreSQL connection pool
export const pool = new Pool({ connectionString });

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
      error: error.message
    };
  }
}