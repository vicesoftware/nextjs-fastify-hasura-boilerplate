import { FastifyInstance } from "fastify";
import { hasuraService } from "../lib/hasura-client.js";
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";

/**
 * Auto-sync Hasura with database schema
 * This endpoint discovers new tables and tracks them in Hasura
 */
export async function hasuraSyncRoutes(fastify: FastifyInstance) {
  // Auto-track all untracked tables
  fastify.post("/api/hasura/sync", async (request, reply) => {
    try {
      if (!db) {
        return reply.status(500).send({
          success: false,
          error: "Database not available",
        });
      }

      // Get all tables from database
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `);

      // Get currently tracked tables from Hasura
      const trackedTables = await hasuraService.getTrackedTables();
      const trackedTableNames = trackedTables.map(
        (t: { name: string }) => t.name
      );

      // Find untracked tables
      const untrackedTables = tables.rows
        .map((row: Record<string, unknown>) => row.table_name as string)
        .filter((tableName: string) => !trackedTableNames.includes(tableName));

      // Track each untracked table
      const results = [];
      for (const tableName of untrackedTables) {
        try {
          await hasuraService.trackTable(tableName);
          results.push({ table: tableName, status: "tracked" });
        } catch (error) {
          results.push({
            table: tableName,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return {
        success: true,
        message: `Synced ${untrackedTables.length} new tables`,
        results,
        tracked_tables: trackedTableNames.length,
        new_tables: untrackedTables.length,
      };
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: "Failed to sync Hasura with database",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Health check for Hasura sync
  fastify.get("/api/hasura/status", async () => {
    const isAvailable = await hasuraService.testConnection();
    const trackedTables = isAvailable
      ? await hasuraService.getTrackedTables()
      : [];

    return {
      hasura_available: isAvailable,
      tracked_tables_count: trackedTables.length,
      tracked_tables: trackedTables.map((t: { name: string }) => t.name),
    };
  });
}
