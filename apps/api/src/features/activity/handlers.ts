import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { HasuraClient } from "../../shared/hasura/client.js";
import { EventBus } from "../../shared/events/bus.js";
import {
  CreateActivityInput,
  CreateBulkActivitiesInput,
  ActivityCreatedEvent,
  ActivityBulkCreatedEvent,
  Activity,
} from "../../../../../packages/shared-types/src/activity.js";
import { ACTIVITY_QUERIES } from "./queries.js";

interface QueryParams {
  limit?: string;
  hours?: string;
}

interface ActionItem {
  action: string;
}

// Hasura response types
interface CreateActivityResponse {
  insert_activity_log_one: Activity;
}

interface CreateBulkActivitiesResponse {
  insert_activity_log: {
    affected_rows: number;
    returning: Activity[];
  };
}

interface GetRecentActivitiesResponse {
  activity_log: Activity[];
}

interface GetActivityStatsResponse {
  activity_log_aggregate: {
    aggregate: {
      count: number;
    };
  };
  recent_actions: ActionItem[];
}

interface GetActivityCountResponse {
  activity_log_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export class ActivityHandlers {
  constructor(
    private hasura: HasuraClient,
    private eventBus: EventBus
  ) {}

  async logActivity(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body as CreateActivityInput;

    if (!input.action) {
      return reply.code(400).send({ error: "Action is required" });
    }

    try {
      // Direct Hasura mutation
      const result = await this.hasura.request<CreateActivityResponse>(
        ACTIVITY_QUERIES.CREATE_ACTIVITY,
        {
          activity: {
            action: input.action,
          },
        }
      );

      const activity = result.insert_activity_log_one;

      // Emit feature event
      await this.eventBus.emit("activity.created", {
        type: "activity.created",
        data: activity,
      } as ActivityCreatedEvent);

      return {
        success: true,
        data: activity,
        message: "Activity logged successfully",
      };
    } catch (error) {
      console.error("Failed to log activity:", error);
      return reply.code(500).send({
        success: false,
        error: "Failed to log activity",
      });
    }
  }

  async logBulkActivities(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body as CreateBulkActivitiesInput;

    if (!input.activities?.length) {
      return reply.code(400).send({ error: "Activities array is required" });
    }

    try {
      const result = await this.hasura.request<CreateBulkActivitiesResponse>(
        ACTIVITY_QUERIES.CREATE_BULK_ACTIVITIES,
        {
          activities: input.activities.map((activity: CreateActivityInput) => ({
            action: activity.action,
          })),
        }
      );

      await this.eventBus.emit("activity.bulk_created", {
        type: "activity.bulk_created",
        data: {
          count: result.insert_activity_log.affected_rows,
          activities: result.insert_activity_log.returning,
        },
      } as ActivityBulkCreatedEvent);

      return {
        success: true,
        data: {
          created: result.insert_activity_log.affected_rows,
          activities: result.insert_activity_log.returning,
        },
        message: `${result.insert_activity_log.affected_rows} activities logged successfully`,
      };
    } catch (error) {
      console.error("Failed to log bulk activities:", error);
      return reply.code(500).send({
        success: false,
        error: "Failed to log bulk activities",
      });
    }
  }

  async getRecentActivities(
    request: FastifyRequest<{ Querystring: QueryParams }>
  ) {
    const limit = Math.min(Number(request.query.limit) || 20, 100);

    try {
      const result = await this.hasura.request<GetRecentActivitiesResponse>(
        ACTIVITY_QUERIES.GET_RECENT_ACTIVITIES,
        { limit }
      );

      return {
        success: true,
        data: result.activity_log,
        message:
          "Recent activities fetched using Hasura's auto-generated query",
      };
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
      return {
        success: false,
        error: "Failed to fetch activities",
        message: "This demonstrates Hasura's error handling",
      };
    }
  }

  async getActivityStats(
    request: FastifyRequest<{ Querystring: QueryParams }>
  ) {
    const hoursBack = Number(request.query.hours) || 24;
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    try {
      const result = await this.hasura.request<GetActivityStatsResponse>(
        ACTIVITY_QUERIES.GET_ACTIVITY_STATS,
        {
          since: since.toISOString(),
        }
      );

      return {
        success: true,
        data: {
          totalActivities: result.activity_log_aggregate.aggregate.count,
          timeRange: `${hoursBack} hours`,
          topActions: result.recent_actions.map((a: ActionItem) => a.action),
        },
        message: "Activity statistics fetched successfully",
      };
    } catch (error) {
      console.error("Failed to fetch activity stats:", error);
      return {
        success: false,
        error: "Failed to fetch activity statistics",
      };
    }
  }

  async healthCheck() {
    try {
      await this.hasura.request<GetActivityCountResponse>(
        ACTIVITY_QUERIES.GET_ACTIVITY_COUNT
      );
      return {
        status: "healthy",
        feature: "activity",
        hasura_available: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        status: "unhealthy",
        feature: "activity",
        hasura_available: false,
        error: errorMessage,
      };
    }
  }

  // Helper method for logging common activity types (backward compatibility)
  async logSystemActivity(action: string): Promise<boolean> {
    try {
      const result = await this.hasura.request<CreateActivityResponse>(
        ACTIVITY_QUERIES.CREATE_ACTIVITY,
        {
          activity: { action },
        }
      );

      await this.eventBus.emit("activity.created", {
        type: "activity.created",
        data: result.insert_activity_log_one,
      } as ActivityCreatedEvent);

      return true;
    } catch (error) {
      console.error(`Failed to log system activity: ${action}`, error);
      return false;
    }
  }
}

// Register routes directly in the same file
export async function registerActivityRoutes(
  fastify: FastifyInstance,
  options: { hasura: HasuraClient; eventBus: EventBus }
) {
  const handlers = new ActivityHandlers(options.hasura, options.eventBus);

  // Register all routes with the handlers
  fastify.post("/api/activity/log", handlers.logActivity.bind(handlers));
  fastify.post("/api/activity/bulk", handlers.logBulkActivities.bind(handlers));
  fastify.get(
    "/api/activity/recent",
    handlers.getRecentActivities.bind(handlers)
  );
  fastify.get("/api/activity/stats", handlers.getActivityStats.bind(handlers));
  fastify.get("/api/activity/health", handlers.healthCheck.bind(handlers));

  // Backward compatibility routes
  fastify.get("/api/activities", handlers.getRecentActivities.bind(handlers));
  fastify.post("/api/activities/bulk", async (request, reply) => {
    // Transform old format to new format
    const { actions } = request.body as { actions: string[] };
    if (!actions || !Array.isArray(actions)) {
      return reply.code(400).send({
        success: false,
        error: "Invalid request: actions array required",
      });
    }

    const transformedInput = {
      activities: actions.map((action) => ({ action })),
    };

    request.body = transformedInput;
    return handlers.logBulkActivities(request, reply);
  });
}
