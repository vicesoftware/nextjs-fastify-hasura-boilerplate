import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckResponse } from '@repo/api-types';

// Import package.json for version info
import packageInfo from '../../package.json';
import rootPackageInfo from '../../../../package.json';

// Define typed structures for the JSON files
interface AppPackageJson {
  version: string;
}

interface RootPackageJson {
  name: string;
  packageManager: string;
}

// Type assertion with specific interfaces
const packageJson: AppPackageJson = packageInfo as AppPackageJson;
const rootPackageJson: RootPackageJson = rootPackageInfo as RootPackageJson;

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
  async check(): Promise<HealthCheckResponse> {
    const result = await this.health.check([
      // Check memory usage
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB max heap
      // Check disk storage
      async () =>
        this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }), // 90% threshold
      // Custom uptime check
      () => {
        const uptime = Date.now() - this.startTime.getTime();
        const uptimeInSeconds = Math.floor(uptime / 1000);

        // Follow NestJS health indicator structure
        return {
          uptime: {
            status: 'up',
            uptimeInSeconds,
            startedAt: this.startTime.toISOString(),
          },
        };
      },
      // Version information check
      () => {
        return {
          version: {
            status: 'up',
            app: packageJson.version,
            monorepo: rootPackageJson.name,
            packageManager: rootPackageJson.packageManager,
            node: process.version,
          },
        };
      },
    ]);

    // Convert to our shared type
    return result as unknown as HealthCheckResponse;
  }
}
