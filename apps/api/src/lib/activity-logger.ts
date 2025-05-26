import { hasuraService } from "./hasura-client.js";
import { db } from "../db/index.js";
import { activityLog } from "../db/schema.js";

/**
 * Simple activity logger service
 * Demonstrates logging activities that Hasura will provide CRUD operations for
 */
export class ActivityLogger {
  /**
   * Log an activity using Hasura's auto-generated mutation
   * This demonstrates Hasura's CRUD capabilities
   */
  static async logViaHasura(action: string): Promise<boolean> {
    if (!hasuraService.isAvailable()) {
      console.warn(`Activity logging via Hasura unavailable: ${action}`);
      return false;
    }

    try {
      const result = await hasuraService.logActivity(action);
      console.log(`✅ Activity logged via Hasura: ${action}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to log activity via Hasura: ${action}`, error);
      return false;
    }
  }

  /**
   * Log an activity using direct database insert
   * Fallback method when Hasura is unavailable
   */
  static async logViaDirect(action: string): Promise<boolean> {
    if (!db) {
      console.warn(`Database unavailable for activity logging: ${action}`);
      return false;
    }

    try {
      await db.insert(activityLog).values({ action });
      console.log(`✅ Activity logged directly: ${action}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to log activity directly: ${action}`, error);
      return false;
    }
  }

  /**
   * Log an activity with automatic fallback
   * Try Hasura first (to demonstrate CRUD), fallback to direct DB
   */
  static async log(action: string): Promise<boolean> {
    // Try Hasura first to demonstrate auto-generated mutations
    const hasuraSuccess = await this.logViaHasura(action);
    if (hasuraSuccess) {
      return true;
    }

    // Fallback to direct database insert
    console.log(`Falling back to direct database insert for: ${action}`);
    return await this.logViaDirect(action);
  }

  /**
   * Log multiple activities in bulk using Hasura's auto-generated bulk insert
   */
  static async logBulk(actions: string[]): Promise<boolean> {
    if (!hasuraService.isAvailable()) {
      console.warn(
        `Bulk activity logging via Hasura unavailable for ${actions.length} actions`
      );
      return false;
    }

    try {
      const result = await hasuraService.logActivitiesBulk(actions);
      console.log(`✅ ${actions.length} activities logged in bulk via Hasura`);
      return result;
    } catch (error) {
      console.error(
        `❌ Failed to log ${actions.length} activities in bulk`,
        error
      );
      return false;
    }
  }

  /**
   * Helper methods for common activity types
   */
  static async logSystemStartup(): Promise<boolean> {
    return await this.log("system.startup");
  }

  static async logHealthCheck(): Promise<boolean> {
    return await this.log("health.check");
  }

  static async logApiRequest(endpoint?: string): Promise<boolean> {
    const action = endpoint ? `api.request.${endpoint}` : "api.request";
    return await this.log(action);
  }

  static async logDatabaseQuery(): Promise<boolean> {
    return await this.log("database.query");
  }

  static async logError(errorType?: string): Promise<boolean> {
    const action = errorType ? `error.${errorType}` : "error.occurred";
    return await this.log(action);
  }

  /**
   * Log application lifecycle events
   */
  static async logAppEvent(
    event: "startup" | "shutdown" | "restart"
  ): Promise<boolean> {
    return await this.log(`app.${event}`);
  }
}

// Export singleton instance and static class
export const activityLogger = ActivityLogger;
export default ActivityLogger;
