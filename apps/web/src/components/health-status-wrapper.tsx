"use client";

import dynamic from "next/dynamic";

// Dynamically import the HealthStatus component with SSR disabled
// to prevent hydration errors from the client-side API fetch
const HealthStatus = dynamic(() => import("./health-status"), {
  ssr: false,
});

export default function HealthStatusWrapper() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/health`;
  
  // Add detailed logging about the API URL construction
  console.log("HealthStatusWrapper - API URL Details:");
  console.log("Raw env var:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Constructed apiUrl:", apiUrl);
  console.log("URL encoding test:", encodeURIComponent("${services.api.url}"));
  console.log("String construction test:", `${process.env.NEXT_PUBLIC_API_URL || "fallback"}/health`);
  
  return <HealthStatus apiUrl={apiUrl} />;
}
