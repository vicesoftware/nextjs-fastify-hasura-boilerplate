"use client";

import { useState, useEffect } from "react";

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
}

interface ActivityFeedProps {
  limit?: number;
  refreshInterval?: number;
}

export function ActivityFeed({
  limit = 20,
  refreshInterval = 5000,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities`,
      );
      const data = await response.json();

      if (data.success) {
        setActivities(data.data);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch activities");
      }
    } catch (err) {
      setError("Network error fetching activities");
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Set up auto-refresh
    const interval = setInterval(fetchActivities, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (action: string) => {
    if (action.includes("startup") || action.includes("started")) return "🚀";
    if (action.includes("health")) return "💚";
    if (action.includes("api.request")) return "📡";
    if (action.includes("error")) return "❌";
    if (action.includes("demo")) return "🎯";
    return "📝";
  };

  const getActionColor = (action: string) => {
    if (action.includes("startup") || action.includes("started"))
      return "text-green-600";
    if (action.includes("health")) return "text-blue-600";
    if (action.includes("api.request")) return "text-purple-600";
    if (action.includes("error")) return "text-red-600";
    if (action.includes("demo")) return "text-orange-600";
    return "text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading activities...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-500 text-xl mr-2">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">
              Error Loading Activities
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchActivities}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Updates
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Powered by Hasura&apos;s auto-generated GraphQL API
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <span className="text-4xl mb-2 block">��</span>
            <p className="text-gray-500 text-sm">
              No activities yet. The system hasn&apos;t logged any activities or
              there might be a connection issue.
            </p>
          </div>
        ) : (
          activities.slice(0, limit).map((activity) => (
            <div
              key={activity.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl flex-shrink-0 mt-0.5">
                  {getActionIcon(activity.action)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${getActionColor(activity.action)}`}
                    >
                      {activity.action}
                    </p>
                    <time className="text-xs text-gray-500 flex-shrink-0">
                      {formatTimestamp(activity.timestamp)}
                    </time>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    ID: {activity.id}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > limit && (
        <div className="px-6 py-3 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Showing {limit} of {activities.length} activities
          </p>
        </div>
      )}
    </div>
  );
}
