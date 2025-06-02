"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HealthCheckResponse, HealthIndicatorStatus } from "@repo/api-types";

type HealthStatusProps = {
  apiUrl: string;
};

// Type for component version information
type ComponentVersion = {
  component: string;
  version: string;
  deployed_at: string;
  git_commit?: string;
};

// Type for detailed Hasura status
type HasuraStatusResponse = {
  hasura_available: boolean;
  tracked_tables_count: number;
  tracked_tables: string[];
};

// Extended health response that includes web app specific fields
type ExtendedHealthResponse = HealthCheckResponse & {
  version?: {
    app: string;
    monorepo: string;
    packageManager: string;
    node: string;
  };
  environment?: string;
};

export default function HealthStatus({ apiUrl }: HealthStatusProps) {
  const [healthData, setHealthData] = useState<ExtendedHealthResponse | null>(
    null
  );
  const [hasuraDetails, setHasuraDetails] =
    useState<HasuraStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasuraLoading, setHasuraLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHasuraDetails = useCallback(async () => {
    try {
      setHasuraLoading(true);
      const hasuraApiUrl = apiUrl.replace("/health", "/hasura/status");
      const response = await fetch(hasuraApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHasuraDetails(data);
      }
    } catch (err) {
      console.error("Failed to fetch Hasura details:", err);
    } finally {
      setHasuraLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch health status: ${response.status}`);
        }

        const data = await response.json();
        setHealthData(data);

        // Auto-fetch Hasura details if Hasura is available
        if (
          data.details?.hasura?.status === "up" ||
          data.info?.deployment?.hasura_available
        ) {
          fetchHasuraDetails();
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHealthStatus();

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchHealthStatus, 30000);

    return () => clearInterval(intervalId);
  }, [apiUrl, fetchHasuraDetails]);

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 w-full max-w-md shadow-sm border border-gray-200 dark:border-gray-700 font-sans">
        <div className="w-6 h-6 border-3 border-gray-300 dark:border-gray-600 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-center">Loading health status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 w-full max-w-md shadow-sm border border-red-200 dark:border-red-800/30 font-sans">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <h3 className="text-lg font-semibold">API Health: Error</h3>
        </div>
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
        <button
          className="bg-foreground text-background border-none rounded px-4 py-2 text-sm font-medium cursor-pointer transition-opacity hover:opacity-90"
          onClick={() => {
            setLoading(true);
            setError(null);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!healthData) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    return `${Math.floor(seconds / 3600)} hours, ${Math.floor((seconds % 3600) / 60)} minutes`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColorClass = (status: HealthIndicatorStatus): string => {
    switch (status) {
      case "up":
      case "ok":
        return "bg-emerald-500";
      case "down":
        return "bg-red-500";
      case "shutting_down":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatVersion = (version: ComponentVersion): string => {
    const parts = [version.version];
    if (version.git_commit && version.git_commit !== "initial") {
      parts.push(`(${version.git_commit.substring(0, 7)})`);
    }
    return parts.join(" ");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 w-full max-w-md shadow-sm border border-gray-200 dark:border-gray-700 font-sans">
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-3 h-3 rounded-full ${getStatusColorClass(healthData.status)}`}
        ></div>
        <h3 className="text-lg font-semibold">
          API Health: {healthData.status.toUpperCase()}
        </h3>
      </div>

      {/* Version Information Section */}
      {((healthData.info?.versions && healthData.info.versions.length > 0) ||
        healthData.version) && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800/30">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            📦 Component Versions
          </h4>

          {/* Hasura-based version data */}
          {healthData.info?.versions && healthData.info.versions.length > 0 && (
            <div className="space-y-2 mb-3">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                Backend Components:
              </div>
              {healthData.info.versions.map(
                (version: ComponentVersion, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-medium text-blue-700 dark:text-blue-400 capitalize">
                      {version.component}:
                    </span>
                    <span className="text-blue-600 dark:text-blue-300 font-mono">
                      {formatVersion(version)}
                    </span>
                  </div>
                )
              )}
            </div>
          )}

          {/* Web app version data */}
          {healthData.version && (
            <div className="space-y-2">
              {healthData.info?.versions &&
                healthData.info.versions.length > 0 && (
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1 pt-2 border-t border-blue-200 dark:border-blue-800/50">
                    Frontend Components:
                  </div>
                )}
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  Web App:
                </span>
                <span className="text-blue-600 dark:text-blue-300 font-mono">
                  {healthData.version.app}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  Node.js:
                </span>
                <span className="text-blue-600 dark:text-blue-300 font-mono">
                  {healthData.version.node}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  Package Manager:
                </span>
                <span className="text-blue-600 dark:text-blue-300 font-mono">
                  {healthData.version.packageManager}
                </span>
              </div>
            </div>
          )}

          {/* Environment information */}
          {(healthData.info?.deployment?.environment ||
            healthData.environment) && (
            <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800/50">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  Environment:
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 rounded font-mono">
                  {healthData.info?.deployment?.environment ||
                    healthData.environment}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {healthData.details?.uptime && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <h4 className="text-sm font-semibold text-foreground/80 m-0 mb-2">
              Uptime
            </h4>
            <p className="text-base font-medium m-0">
              {formatTime(healthData.details.uptime.uptimeInSeconds)}
            </p>
            <p className="text-xs opacity-70 mt-1 m-0">
              Started: {formatDate(healthData.details.uptime.startedAt)}
            </p>
          </div>
        )}

        {healthData.details?.memory_heap && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <h4 className="text-sm font-semibold text-foreground/80 m-0 mb-2">
              Memory
            </h4>
            <p
              className={`text-sm font-semibold ${getStatusColorClass(healthData.details.memory_heap.status)} bg-opacity-10 dark:bg-opacity-20 inline-block px-2 py-1 rounded`}
            >
              {healthData.details.memory_heap.status.toUpperCase()}
            </p>
          </div>
        )}

        {healthData.details?.disk && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <h4 className="text-sm font-semibold text-foreground/80 m-0 mb-2">
              Disk
            </h4>
            <p
              className={`text-sm font-semibold ${getStatusColorClass(healthData.details.disk.status)} bg-opacity-10 dark:bg-opacity-20 inline-block px-2 py-1 rounded`}
            >
              {healthData.details.disk.status.toUpperCase()}
            </p>
          </div>
        )}

        {healthData.details?.database && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <h4 className="text-sm font-semibold text-foreground/80 m-0 mb-2">
              Database
            </h4>
            <p
              className={`text-sm font-semibold ${getStatusColorClass(healthData.details.database.status)} bg-opacity-10 dark:bg-opacity-20 inline-block px-2 py-1 rounded mb-2`}
            >
              {healthData.details.database.status.toUpperCase()}
            </p>
            {healthData.details.database.timestamp && (
              <p className="text-xs opacity-70 m-0">
                Last checked:{" "}
                {formatDate(healthData.details.database.timestamp)}
              </p>
            )}
            {healthData.details.database.error && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1 m-0">
                Error: {healthData.details.database.error}
              </p>
            )}
          </div>
        )}

        {healthData.details?.hasura && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground/80 m-0">
                Hasura GraphQL
              </h4>
              <button
                onClick={fetchHasuraDetails}
                disabled={hasuraLoading}
                className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors disabled:opacity-50"
              >
                {hasuraLoading ? "..." : "↻"}
              </button>
            </div>
            <p
              className={`text-sm font-semibold ${getStatusColorClass(healthData.details.hasura.status)} bg-opacity-10 dark:bg-opacity-20 inline-block px-2 py-1 rounded mb-2`}
            >
              {healthData.details.hasura.status.toUpperCase()}
            </p>
            {healthData.details.hasura.response_time && (
              <p className="text-xs opacity-70 m-0 mb-1">
                Response time: {healthData.details.hasura.response_time}ms
              </p>
            )}
            {hasuraDetails && (
              <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                <p className="text-xs opacity-70 m-0 mb-1">
                  Tables tracked: {hasuraDetails.tracked_tables_count}
                </p>
                {hasuraDetails.tracked_tables.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {hasuraDetails.tracked_tables.map((table) => (
                      <span
                        key={table}
                        className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded font-mono"
                      >
                        {table}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!hasuraDetails && healthData.details.hasura.status === "up" && (
              <p className="text-xs opacity-50 mt-2">
                Click ↻ to load table details
              </p>
            )}
            {(healthData.details.hasura.status === "up" ||
              healthData.info?.deployment?.hasura_available) && (
              <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                <Link
                  href="/hasura"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  View detailed Hasura status →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Show legacy database status if using old response format */}
        {healthData.details?.api?.details?.database &&
          !healthData.details?.database && (
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <h4 className="text-sm font-semibold text-foreground/80 m-0 mb-2">
                Database
              </h4>
              <p
                className={`text-sm font-semibold ${getStatusColorClass(healthData.details.api.details.database.status)} bg-opacity-10 dark:bg-opacity-20 inline-block px-2 py-1 rounded mb-2`}
              >
                {healthData.details.api.details.database.status.toUpperCase()}
              </p>
              {healthData.details.api.details.database.timestamp && (
                <p className="text-xs opacity-70 m-0">
                  Last checked:{" "}
                  {formatDate(
                    healthData.details.api.details.database.timestamp
                  )}
                </p>
              )}
              {healthData.details.api.details.database.error && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 m-0">
                  Error: {healthData.details.api.details.database.error}
                </p>
              )}
            </div>
          )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Health aggregated via web app</span>
          {healthData.info?.deployment?.hasura_available !== undefined && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                healthData.info.deployment.hasura_available
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
              }`}
            >
              Hasura:{" "}
              {healthData.info.deployment.hasura_available
                ? "Available"
                : "Unavailable"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
