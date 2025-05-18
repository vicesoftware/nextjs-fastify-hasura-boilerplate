"use client";

import { useState, useEffect } from "react";
import { HealthCheckResponse, HealthIndicatorStatus } from "@repo/api-types";

type HealthStatusProps = {
  apiUrl: string;
};

export default function HealthStatus({ apiUrl }: HealthStatusProps) {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHealthStatus();

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchHealthStatus, 30000);

    return () => clearInterval(intervalId);
  }, [apiUrl]);

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {healthData.details?.uptime && (
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
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
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
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
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
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
      </div>
    </div>
  );
}
