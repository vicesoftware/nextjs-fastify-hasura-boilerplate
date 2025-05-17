import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('api/health')
export class HealthController {
  // Track the start time of the server
  private readonly startTime: Date = new Date();

  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Check memory usage
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB max heap
      // Check disk storage
      async () =>
        this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }), // 90% threshold
      // Custom uptime check
      () => {
        const uptime = Date.now() - this.startTime.getTime();
        const uptimeInSeconds = Math.floor(uptime / 1000);

        return {
          uptime: {
            status: 'up',
            uptimeInSeconds,
            startedAt: this.startTime.toISOString(),
          },
        };
      },
    ]);
  }
}
