// Health feature types - shared across all apps

export interface HealthCheckResponse {
  status: "up" | "down";
  timestamp?: string;
  uptime?: number;
  environment?: string;

  // Enhanced version information
  info?: {
    versions?: AppMetadata[];
    deployment?: DeploymentInfo;
  };

  // Component health details
  details?: {
    uptime?: HealthIndicatorStatus;
    memory_heap?: HealthIndicatorStatus;
    disk?: HealthIndicatorStatus;
    database?: HealthIndicatorStatus;
    hasura?: HealthIndicatorStatus;
  };
}

export interface HealthIndicatorStatus {
  status: "up" | "down";
  message?: string;
  responseTime?: number;
  error?: string;
}

export interface AppMetadata {
  id?: number;
  component: string;
  version: string;
  deployed_at: string;
  git_commit?: string;
  environment?: string;
  metadata?: Record<string, any>;
}

export interface DeploymentInfo {
  environment: string;
  hasura_available: boolean;
  last_deployed?: string;
}

export interface HealthSnapshot {
  id?: number;
  timestamp?: Date;
  overall_status: "up" | "down" | "degraded";
  component_statuses: Record<string, string>;
  response_times?: Record<string, number>;
  errors?: Record<string, string>;
}
