import { GraphQLClient } from "graphql-request";

// Validate required environment variables
const hasuraUrl = process.env.HASURA_URL;
const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET;

if (!hasuraUrl) {
  throw new Error("HASURA_URL environment variable is required but not set");
}

if (!hasuraAdminSecret) {
  throw new Error(
    "HASURA_ADMIN_SECRET environment variable is required but not set"
  );
}

// Hasura GraphQL client configuration
const hasuraClient = new GraphQLClient(hasuraUrl, {
  headers: {
    "x-hasura-admin-secret": hasuraAdminSecret,
  },
});

// GraphQL queries and mutations
export const GET_APP_METADATA = `
  query GetVersions($env: String!) {
    app_metadata(where: {environment: {_eq: $env}}) {
      component
      version
      deployed_at
      git_commit
      metadata
    }
  }
`;

export const RECORD_HEALTH_SNAPSHOT = `
  mutation RecordHealthSnapshot($snapshot: health_snapshots_insert_input!) {
    insert_health_snapshots_one(object: $snapshot) {
      id
      timestamp
    }
  }
`;

export const UPDATE_APP_METADATA = `
  mutation UpdateAppMetadata($component: String!, $version: String!, $environment: String!, $git_commit: String, $metadata: jsonb) {
    insert_app_metadata_one(
      object: {
        component: $component
        version: $version
        environment: $environment
        git_commit: $git_commit
        metadata: $metadata
      }
      on_conflict: {
        constraint: app_metadata_component_environment_key
        update_columns: [version, deployed_at, git_commit, metadata]
      }
    ) {
      id
      component
      version
      deployed_at
    }
  }
`;

// Interface definitions for type safety
export interface AppMetadata {
  component: string;
  version: string;
  deployed_at: string;
  git_commit?: string;
  metadata?: Record<string, unknown>;
}

export interface HealthSnapshot {
  overall_status: "up" | "down" | "degraded";
  component_statuses: Record<string, string>;
  response_times?: Record<string, number>;
  errors?: Record<string, unknown>;
}

// Hasura client functions
export class HasuraService {
  private client: GraphQLClient;
  private available: boolean = true;

  constructor() {
    this.client = hasuraClient;
  }

  /**
   * Fetch application metadata for a specific environment
   */
  async getAppMetadata(
    environment: string = "production"
  ): Promise<AppMetadata[]> {
    try {
      const response = await this.client.request<{
        app_metadata: AppMetadata[];
      }>(GET_APP_METADATA, { env: environment });
      this.available = true;
      return response.app_metadata;
    } catch (error) {
      console.error("Failed to fetch app metadata from Hasura:", error);
      this.available = false;
      return [];
    }
  }

  /**
   * Record a health check snapshot for historical analysis
   */
  async recordHealthSnapshot(snapshot: HealthSnapshot): Promise<boolean> {
    try {
      await this.client.request(RECORD_HEALTH_SNAPSHOT, { snapshot });
      return true;
    } catch (error) {
      console.error("Failed to record health snapshot:", error);
      return false;
    }
  }

  /**
   * Update application metadata (typically called during deployment)
   */
  async updateAppMetadata(
    component: string,
    version: string,
    environment: string = "production",
    gitCommit?: string,
    metadata?: Record<string, unknown>
  ): Promise<boolean> {
    try {
      await this.client.request(UPDATE_APP_METADATA, {
        component,
        version,
        environment,
        git_commit: gitCommit,
        metadata,
      });
      return true;
    } catch (error) {
      console.error("Failed to update app metadata:", error);
      return false;
    }
  }

  /**
   * Check if Hasura is available
   */
  isAvailable(): boolean {
    return this.available;
  }

  /**
   * Test Hasura connection with a simple query
   */
  async testConnection(): Promise<boolean> {
    try {
      // Simple introspection query to test connection
      await this.client.request(`query { __schema { queryType { name } } }`);
      this.available = true;
      return true;
    } catch (error) {
      console.error("Hasura connection test failed:", error);
      this.available = false;
      return false;
    }
  }
}

// Export singleton instance
export const hasuraService = new HasuraService();
export default hasuraService;
