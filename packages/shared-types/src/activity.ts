// Activity feature types - shared across all apps

export interface Activity {
  id: string;
  timestamp: Date;
  action: string;
}

export interface CreateActivityInput {
  action: string;
}

export interface CreateBulkActivitiesInput {
  activities: CreateActivityInput[];
}

export interface ActivityStats {
  totalActivities: number;
  timeRange: string;
  topActions: string[];
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
