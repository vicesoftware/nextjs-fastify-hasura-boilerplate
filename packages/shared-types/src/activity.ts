// Activity feature types - shared across all apps

export interface Activity {
  id: string;
  timestamp: Date;
  action: string;
  userId?: string;
  metadata?: Record<string, any>;
  source: ActivitySource;
}

export interface CreateActivityInput {
  action: string;
  userId?: string;
  metadata?: Record<string, any>;
  source?: ActivitySource;
}

export enum ActivitySource {
  SYSTEM = "system",
  USER = "user",
  API = "api",
  HEALTH_CHECK = "health_check",
  DEMO = "demo",
}

// Feature events (for cross-feature communication)
export interface ActivityCreatedEvent {
  type: "activity.created";
  data: Activity;
}

export interface ActivityBulkCreatedEvent {
  type: "activity.bulk_created";
  data: {
    count: number;
    activities?: Activity[];
  };
}
