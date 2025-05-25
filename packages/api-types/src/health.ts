/**
 * Status values for health check indicators
 * Includes all possible values from @nestjs/terminus
 */
export type HealthIndicatorStatus = "up" | "down" | "ok" | "shutting_down";

/**
 * Basic structure for any health indicator
 */
export interface HealthIndicatorResult {
  status: HealthIndicatorStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Application metadata for version tracking
 */
export interface AppMetadata {
  component: string;
  version: string;
  deployed_at: string;
  git_commit?: string;
}

/**
 * Deployment information
 */
export interface DeploymentInfo {
  environment: string;
  hasura_available: boolean;
  last_deployed?: string;
}

/**
 * Hasura health indicator result
 */
export interface HasuraHealthIndicatorResult extends HealthIndicatorResult {
  status: HealthIndicatorStatus;
  response_time?: number;
}

/**
 * Memory health indicator result
 */
export interface MemoryHealthIndicatorResult {
  memory_heap: {
    status: HealthIndicatorStatus;
    message?: string;
  };
}

/**
 * Disk health indicator result
 */
export interface DiskHealthIndicatorResult {
  disk: {
    status: HealthIndicatorStatus;
    message?: string;
  };
}

/**
 * Uptime indicator result
 */
export interface UptimeHealthIndicatorResult extends HealthIndicatorResult {
  uptime: {
    status: HealthIndicatorStatus;
    uptimeInSeconds: number;
    startedAt: string;
  };
}

/**
 * Enhanced health check response with Hasura integration
 */
export interface HealthCheckResponse {
  status: HealthIndicatorStatus;
  info: {
    memory_heap?: HealthIndicatorResult;
    disk?: HealthIndicatorResult;
    uptime?: {
      status: HealthIndicatorStatus;
      uptimeInSeconds: number;
      startedAt: string;
    };
    // Enhanced version information
    versions?: AppMetadata[];
    // New deployment info
    deployment?: DeploymentInfo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  error?: {
    [key: string]: HealthIndicatorResult;
  };
  details: {
    memory_heap?: HealthIndicatorResult;
    disk?: HealthIndicatorResult;
    uptime?: {
      status: HealthIndicatorStatus;
      uptimeInSeconds: number;
      startedAt: string;
    };
    database?: HealthIndicatorResult;
    hasura?: HasuraHealthIndicatorResult;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
