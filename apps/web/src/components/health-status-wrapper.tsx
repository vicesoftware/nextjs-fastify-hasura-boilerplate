"use client";

import dynamic from "next/dynamic";

// Dynamically import the HealthStatus component with SSR disabled
// to prevent hydration errors from the client-side API fetch
const HealthStatus = dynamic(() => import("./health-status"), {
  ssr: false,
});

export default function HealthStatusWrapper() {
  // Detect which API implementation we're using
  const apiImplementation =
    process.env.NEXT_PUBLIC_API_IMPLEMENTATION || "nestjs";

  // Determine API URL based on implementation
  let baseApiUrl;

  switch (apiImplementation) {
    case "fastify":
      baseApiUrl =
        process.env.NEXT_PUBLIC_API_URL_FASTIFY ||
        process.env.NEXT_PUBLIC_API_URL;
      break;
    case "nextjs":
      baseApiUrl =
        process.env.NEXT_PUBLIC_API_URL_NEXTJS ||
        process.env.NEXT_PUBLIC_API_URL;
      break;
    case "nestjs":
    default:
      baseApiUrl =
        process.env.NEXT_PUBLIC_API_URL_NESTJS ||
        process.env.NEXT_PUBLIC_API_URL;
      break;
  }

  // Construct the full API URL
  const apiUrl = `${baseApiUrl}/health`;

  // Log API connection details
  console.log("HealthStatusWrapper - API URL Details:");
  console.log("API Implementation:", apiImplementation);
  console.log("Base API URL:", baseApiUrl);
  console.log("Constructed apiUrl:", apiUrl);

  return (
    <div>
      <HealthStatus apiUrl={apiUrl} />
      <div className="mt-2 text-xs text-gray-500 text-center">
        API Implementation: {apiImplementation}
      </div>
    </div>
  );
}
