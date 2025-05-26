import { GraphQLClient } from "graphql-request";

/**
 * Generic Hasura client for direct GraphQL operations
 * Follows the microservices architecture pattern
 */
export class HasuraClient {
  private client: GraphQLClient | null = null;
  private available: boolean = false;

  constructor(url?: string, adminSecret?: string) {
    const hasuraUrl = url || process.env.HASURA_URL;
    const hasuraAdminSecret = adminSecret || process.env.HASURA_ADMIN_SECRET;

    if (!hasuraUrl) {
      console.warn("HASURA_URL not set - Hasura features disabled");
      return;
    }

    if (!hasuraAdminSecret) {
      console.warn("HASURA_ADMIN_SECRET not set - Hasura features disabled");
      return;
    }

    this.client = new GraphQLClient(hasuraUrl, {
      headers: {
        "x-hasura-admin-secret": hasuraAdminSecret,
      },
    });

    this.available = true;
    console.log("HasuraClient initialized successfully");
  }

  /**
   * Execute a GraphQL request directly
   */
  async request<T = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    if (!this.client) {
      throw new Error("Hasura client not available");
    }

    try {
      const result = await this.client.request<T>(query, variables);
      this.available = true;
      return result;
    } catch (error) {
      this.available = false;
      console.error("Hasura request failed:", error);
      throw error;
    }
  }

  /**
   * Check if Hasura is available
   */
  isAvailable(): boolean {
    return this.available && this.client !== null;
  }

  /**
   * Test connection to Hasura
   */
  async testConnection(): Promise<boolean> {
    if (!this.client) return false;

    try {
      await this.client.request("query { __typename }");
      this.available = true;
      return true;
    } catch {
      this.available = false;
      return false;
    }
  }
}
