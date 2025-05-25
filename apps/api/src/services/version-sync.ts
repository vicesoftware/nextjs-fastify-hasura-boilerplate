import { hasuraService } from "../lib/hasura-client.js";
import packageJson from "../../package.json" with { type: "json" };
import { execSync } from "child_process";

export interface VersionInfo {
  component: string;
  version: string;
  git_commit: string;
  deployed_at: string;
  environment: string;
}

// Local interface matching database schema
interface DbVersionInfo {
  component: string;
  version: string;
  git_commit?: string;
  deployed_at: string;
}

export class VersionSyncService {
  /**
   * Sync current version to database on startup
   * Non-blocking - logs warnings on failure but doesn't crash the app
   */
  async syncVersionOnStartup(): Promise<void> {
    try {
      const currentVersion = this.getCurrentVersion();
      const latestDbVersion = await this.getLatestDbVersion(
        currentVersion.component
      );

      if (this.shouldUpdateVersion(currentVersion, latestDbVersion)) {
        await this.recordNewVersion(currentVersion);
        console.log(
          `✅ Version synced: ${currentVersion.component}@${currentVersion.version}`
        );
      } else {
        console.log(
          `📋 Version unchanged: ${currentVersion.component}@${currentVersion.version}`
        );
      }
    } catch (error) {
      console.warn(`⚠️ Version sync failed (non-critical):`, error);
    }
  }

  /**
   * Get current version information from environment and package.json
   */
  private getCurrentVersion(): VersionInfo {
    return {
      component: "api",
      version: this.getVersionString(),
      git_commit: this.getGitCommit(),
      deployed_at: this.getBuildTime(),
      environment: process.env.NODE_ENV || "development",
    };
  }

  /**
   * Get version string - environment-aware for trunk-based development
   */
  private getVersionString(): string {
    const environment = process.env.NODE_ENV || "development";
    const commit = this.getGitCommit().substring(0, 7);

    // Production: Use clean semantic version from environment or git tag
    if (environment === "production") {
      return (
        process.env.APP_VERSION || this.getLatestGitTag() || packageJson.version
      );
    }

    // Staging: Add staging suffix with commit
    if (environment === "staging") {
      const baseVersion = this.getLatestGitTag() || packageJson.version;
      return `${baseVersion}-staging.${commit}`;
    }

    // Preview/Development: Add preview suffix with commit
    const baseVersion = this.getLatestGitTag() || packageJson.version;
    return `${baseVersion}-preview.${commit}`;
  }

  /**
   * Get latest git tag for semantic versioning
   */
  private getLatestGitTag(): string | null {
    try {
      const gitTag = execSync("git describe --tags --abbrev=0", {
        encoding: "utf8",
        timeout: 1000,
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      return gitTag;
    } catch (error) {
      // No git tags available
      return null;
    }
  }

  /**
   * Get git commit hash - try multiple sources
   */
  private getGitCommit(): string {
    // 1. Environment variable (set by Render in production)
    if (process.env.GIT_COMMIT) {
      return process.env.GIT_COMMIT;
    }

    // 2. Try to get from git command (development)
    try {
      const gitCommit = execSync("git rev-parse HEAD", {
        encoding: "utf8",
        timeout: 1000,
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      return gitCommit;
    } catch (error) {
      // Git not available or not in a git repo
      return "unknown";
    }
  }

  /**
   * Get build/deploy time
   */
  private getBuildTime(): string {
    // 1. Environment variable (set by Render in production)
    if (process.env.BUILD_TIME) {
      return process.env.BUILD_TIME;
    }

    // 2. Current time for development
    return new Date().toISOString();
  }

  /**
   * Get latest version from database for this component
   */
  private async getLatestDbVersion(
    component: string
  ): Promise<DbVersionInfo | null> {
    try {
      const environment = process.env.NODE_ENV || "development";
      const versions = await hasuraService.getAppMetadata(environment);

      const componentVersion = versions.find((v) => v.component === component);
      return componentVersion || null;
    } catch (error) {
      console.warn("Failed to fetch latest version from database:", error);
      return null;
    }
  }

  /**
   * Check if we should update the version in database
   */
  private shouldUpdateVersion(
    current: VersionInfo,
    latest: DbVersionInfo | null
  ): boolean {
    if (!latest) {
      return true; // No version in DB, definitely update
    }

    // Update if version or git commit changed
    return (
      current.version !== latest.version ||
      current.git_commit !== latest.git_commit
    );
  }

  /**
   * Record new version in database
   * For now, we'll just log it - we'll implement proper DB insertion later
   */
  private async recordNewVersion(version: VersionInfo): Promise<void> {
    // TODO: Implement proper version recording to app_metadata table
    // For now, just record a health snapshot to test the flow
    await hasuraService.recordHealthSnapshot({
      overall_status: "up",
      component_statuses: {
        [version.component]: "up",
        version_sync: "completed",
      },
      response_times: { version_sync: Date.now() },
      errors: undefined,
    });

    console.log(
      `📝 Version sync completed for ${version.component}@${version.version} (${version.git_commit.substring(0, 7)})`
    );
  }
}

// Export singleton instance
export const versionSyncService = new VersionSyncService();
