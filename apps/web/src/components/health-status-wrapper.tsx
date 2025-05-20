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
  console.log("HealthStatusWrapper - API URL Details (Updated):");
  console.log("Raw env var:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Type of env var:", typeof process.env.NEXT_PUBLIC_API_URL);
  console.log("Constructed apiUrl:", apiUrl);
  console.log("Contains template syntax:", process.env.NEXT_PUBLIC_API_URL?.includes("${"));
  console.log("JSON stringified:", JSON.stringify(process.env.NEXT_PUBLIC_API_URL));
  
  // Let it fail naturally if incorrectly set
  return <HealthStatus apiUrl={apiUrl} />;
}
