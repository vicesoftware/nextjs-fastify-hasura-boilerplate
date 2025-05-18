"use client";

import dynamic from "next/dynamic";

// Dynamically import the HealthStatus component with SSR disabled
// to prevent hydration errors from the client-side API fetch
const HealthStatus = dynamic(() => import("./health-status"), {
  ssr: false,
});

export default function HealthStatusWrapper() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/health`;
  return <HealthStatus apiUrl={apiUrl} />;
}
