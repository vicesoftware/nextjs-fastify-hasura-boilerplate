"use client";

import dynamic from "next/dynamic";

// Dynamically import the HealthStatus component with SSR disabled
// to prevent hydration errors from the client-side API fetch
const HealthStatus = dynamic(() => import("./health-status"), {
  ssr: false,
});

export default function HealthStatusWrapper() {
  // Use the web app's own health endpoint which aggregates API data including database status
  const apiUrl = "/api/health";

  // Detect which API implementation the web app is configured to use
  const apiImplementation =
    process.env.NEXT_PUBLIC_API_IMPLEMENTATION || "fastify";

  // Log API connection details
  console.log("HealthStatusWrapper - Using web app health endpoint");
  console.log("Health URL:", apiUrl);
  console.log("Backend API Implementation:", apiImplementation);

  return <HealthStatus apiUrl={apiUrl} />;
}
