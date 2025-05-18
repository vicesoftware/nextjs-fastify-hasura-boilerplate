/**
 * Status values for health check indicators
 * Includes all possible values from @nestjs/terminus
 */
export type HealthIndicatorStatus = 'up' | 'down' | 'ok' | 'shutting_down';

/**
 * Basic structure for any health indicator
 */
export interface HealthIndicatorResult {
  status: HealthIndicatorStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
 * Combined health check response from @nestjs/terminus
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}