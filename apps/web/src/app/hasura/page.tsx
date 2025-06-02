"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Types for different API responses
type HasuraStatusResponse = {
  hasura_available: boolean;
  tracked_tables_count: number;
  tracked_tables: string[];
};

type ActivityResponse = {
  status: string;
  feature: string;
  hasura_available: boolean;
  error?: string;
};

type RecentActivitiesResponse = {
  success: boolean;
  data: Array<{
    id: string;
    timestamp: string;
    action: string;
  }>;
  message: string;
};

export default function HasuraStatusPage() {
  const [hasuraStatus, setHasuraStatus] = useState<HasuraStatusResponse | null>(
    null
  );
  const [activityStatus, setActivityStatus] = useState<ActivityResponse | null>(
    null
  );
  const [recentActivities, setRecentActivities] =
    useState<RecentActivitiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all Hasura-related data in parallel
      const [statusRes, activityRes, activitiesRes] = await Promise.all([
        fetch(`${apiUrl}/api/hasura/status`),
        fetch(`${apiUrl}/api/activity/health`),
        fetch(`${apiUrl}/api/activity/recent?limit=10`),
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setHasuraStatus(statusData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivityStatus(activityData);
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setRecentActivities(activitiesData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Hasura GraphQL Status</h1>
            <div className="flex gap-2">
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Hasura Service Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${hasuraStatus?.hasura_available ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              Hasura Service
            </h2>

            {hasuraStatus ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={`font-semibold ${hasuraStatus.hasura_available ? "text-green-600" : "text-red-600"}`}
                  >
                    {hasuraStatus.hasura_available
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tracked Tables:</span>
                  <span className="font-semibold">
                    {hasuraStatus.tracked_tables_count}
                  </span>
                </div>
                {hasuraStatus.tracked_tables.length > 0 && (
                  <div>
                    <span className="block mb-2">Tables:</span>
                    <div className="flex flex-wrap gap-2">
                      {hasuraStatus.tracked_tables.map((table) => (
                        <span
                          key={table}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm font-mono"
                        >
                          {table}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Unable to fetch Hasura status</p>
            )}
          </div>

          {/* Activity Feature Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${activityStatus?.status === "healthy" ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              Activity Logging
            </h2>

            {activityStatus ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Feature Status:</span>
                  <span
                    className={`font-semibold ${activityStatus.status === "healthy" ? "text-green-600" : "text-red-600"}`}
                  >
                    {activityStatus.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hasura Connection:</span>
                  <span
                    className={`font-semibold ${activityStatus.hasura_available ? "text-green-600" : "text-red-600"}`}
                  >
                    {activityStatus.hasura_available
                      ? "Connected"
                      : "Disconnected"}
                  </span>
                </div>
                {activityStatus.error && (
                  <div className="text-red-600 text-sm">
                    Error: {activityStatus.error}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Unable to fetch activity status</p>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>

          {recentActivities?.success ? (
            <div className="space-y-2">
              {recentActivities.data.length > 0 ? (
                recentActivities.data.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="font-mono text-sm">
                        {activity.action}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent activities
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Unable to fetch recent activities</p>
          )}
        </div>

        {/* API Endpoints for Testing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Endpoints</h2>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between items-center py-1">
              <span>Hasura Status:</span>
              <a
                href={`${apiUrl}/api/hasura/status`}
                target="_blank"
                className="text-blue-600 hover:underline"
                rel="noreferrer"
              >
                GET /api/hasura/status
              </a>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Activity Health:</span>
              <a
                href={`${apiUrl}/api/activity/health`}
                target="_blank"
                className="text-blue-600 hover:underline"
                rel="noreferrer"
              >
                GET /api/activity/health
              </a>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Recent Activities:</span>
              <a
                href={`${apiUrl}/api/activity/recent`}
                target="_blank"
                className="text-blue-600 hover:underline"
                rel="noreferrer"
              >
                GET /api/activity/recent
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
