import { HasuraClient } from "../../shared/hasura/client.js";
import { EventBus } from "../../shared/events/bus.js";
import { ActivityHandlers } from "./handlers.js";
import { ACTIVITY_QUERIES } from "./queries.js";
import {
  ActivityBulkCreatedEvent,
  Activity,
} from "../../../../../packages/shared-types/src/activity.js";

// Hasura response type
interface CreateBulkActivitiesResponse {
  insert_activity_log: {
    affected_rows: number;
    returning: Activity[];
  };
}

/**
 * Activity logger service that provides backward compatibility
 * while using the new microservices architecture pattern
 */
export class ActivityLoggerService {
  private handlers: ActivityHandlers;
  private hasura: HasuraClient;
  private eventBus: EventBus;

  constructor(hasura: HasuraClient, eventBus: EventBus) {
    this.hasura = hasura;
    this.eventBus = eventBus;
    this.handlers = new ActivityHandlers(hasura, eventBus);
  }

  /**
   * Log an activity using the new feature structure
   */
  async log(action: string): Promise<boolean> {
    try {
      await this.handlers.logSystemActivity(action);
      return true;
    } catch (error) {
      console.error(`Failed to log activity: ${action}`, error);
      return false;
    }
  }

  /**
   * Log multiple activities in bulk
   */
  async logBulk(actions: string[]): Promise<boolean> {
    try {
      const activities = actions.map((action) => ({ action }));

      // Call Hasura directly instead of using mock objects
      const result = await this.hasura.request<CreateBulkActivitiesResponse>(
        ACTIVITY_QUERIES.CREATE_BULK_ACTIVITIES,
        { activities }
      );

      // Emit event
      await this.eventBus.emit("activity.bulk_created", {
        type: "activity.bulk_created",
        data: {
          count: result.insert_activity_log.affected_rows,
          activities: result.insert_activity_log.returning,
        },
      } as ActivityBulkCreatedEvent);

      return true;
    } catch (error) {
      console.error(`Failed to log bulk activities:`, error);
      return false;
    }
  }

  /**
   * Helper methods for common activity types (backward compatibility)
   */
  async logSystemStartup(): Promise<boolean> {
    return await this.log("system.startup");
  }

  async logHealthCheck(): Promise<boolean> {
    return await this.log("health.check");
  }

  async logApiRequest(endpoint?: string): Promise<boolean> {
    const action = endpoint ? `api.request.${endpoint}` : "api.request";
    return await this.log(action);
  }

  async logDatabaseQuery(): Promise<boolean> {
    return await this.log("database.query");
  }

  async logError(errorType?: string): Promise<boolean> {
    const action = errorType ? `error.${errorType}` : "error.occurred";
    return await this.log(action);
  }

  async logAppEvent(
    event: "startup" | "shutdown" | "restart"
  ): Promise<boolean> {
    return await this.log(`app.${event}`);
  }
}
