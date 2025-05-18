"use client";

import { useState, useEffect } from "react";
import { HealthCheckResponse, HealthIndicatorStatus } from "@repo/api-types";
import styles from "./health-status.module.css";

type HealthStatusProps = {
  apiUrl?: string;
};

export default function HealthStatus({
  apiUrl = "http://localhost:4000/api/health",
}: HealthStatusProps) {
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
      <div className={styles.healthStatus}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading health status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.healthStatus} ${styles.error}`}>
        <div className={styles.statusHeader}>
          <div
            className={`${styles.statusIndicator} ${styles.statusDown}`}
          ></div>
          <h3>API Health: Error</h3>
        </div>
        <p className={styles.errorMessage}>{error}</p>
        <button
          className={styles.retryButton}
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

  const getStatusColor = (status: HealthIndicatorStatus): string => {
    switch (status) {
      case "up":
      case "ok":
        return styles.statusUp;
      case "down":
        return styles.statusDown;
      case "shutting_down":
        return styles.statusWarning;
      default:
        return styles.statusUnknown;
    }
  };

  return (
    <div className={styles.healthStatus}>
      <div className={styles.statusHeader}>
        <div
          className={`${styles.statusIndicator} ${getStatusColor(healthData.status)}`}
        ></div>
        <h3>API Health: {healthData.status.toUpperCase()}</h3>
      </div>

      <div className={styles.metrics}>
        {healthData.details.uptime && (
          <div className={styles.metric}>
            <h4>Uptime</h4>
            <p>{formatTime(healthData.details.uptime.uptimeInSeconds)}</p>
            <p className={styles.metricDetail}>
              Started: {formatDate(healthData.details.uptime.startedAt)}
            </p>
          </div>
        )}

        {healthData.details.memory_heap && (
          <div className={styles.metric}>
            <h4>Memory</h4>
            <p
              className={`${styles.metricStatus} ${getStatusColor(healthData.details.memory_heap.status)}`}
            >
              {healthData.details.memory_heap.status.toUpperCase()}
            </p>
          </div>
        )}

        {healthData.details.disk && (
          <div className={styles.metric}>
            <h4>Disk</h4>
            <p
              className={`${styles.metricStatus} ${getStatusColor(healthData.details.disk.status)}`}
            >
              {healthData.details.disk.status.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
