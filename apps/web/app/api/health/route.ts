import { NextResponse } from "next/server";
import packageJson from "../../../package.json";
import rootPackageJson from "../../../../../package.json";

/**
 * Health check endpoint for the Next.js web app
 * GET /api/health
 */
export async function GET() {
  // Include basic health information including version from package.json
  const healthData = {
    status: "up",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    version: {
      app: packageJson.version,
      monorepo: rootPackageJson.name,
      packageManager: rootPackageJson.packageManager,
      node: process.version,
    },
  };

  return NextResponse.json(healthData, { status: 200 });
}
