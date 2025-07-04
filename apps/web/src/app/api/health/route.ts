import { NextResponse } from "next/server";
import packageJson from "../../../../package.json";
import rootPackageJson from "../../../../../../package.json";
import { corsHeaders, handleOptions } from "../cors";

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return handleOptions();
}

/**
 * Health check endpoint for the Next.js web app
 * GET /api/health
 */
export async function GET() {
  // Validate required environment variables
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseApiUrl) {
    const errorData = {
      status: "down",
      timestamp: new Date().toISOString(),
      error: "NEXT_PUBLIC_API_URL environment variable is required",
      details: {
        configuration: {
          status: "down",
          error: "Missing required environment variables"
        }
      }
    };
    return NextResponse.json(errorData, { 
      status: 503,
      headers: corsHeaders
    });
  }

  // Construct the API health endpoint URL
  // The NEXT_PUBLIC_API_URL contains the base service URL, we need to add /api/health
  const apiHealthUrl = `${baseApiUrl}/api/health`;

  console.log('Environment Variables Debug Info:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_API_URL:', baseApiUrl);
  console.log('Constructed API Health URL:', apiHealthUrl);

  // Get API health status (including database)
  let apiHealth = null;
  let overallStatus = "up";
  
  try {
    const response = await fetch(apiHealthUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Set a timeout for the API call
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      apiHealth = await response.json();
      // If API reports down status, mark overall as down
      if (apiHealth.status === 'down') {
        overallStatus = 'down';
      }
    } else {
      overallStatus = 'down';
      apiHealth = {
        status: 'down',
        error: `API returned ${response.status}: ${response.statusText}`,
        url: apiHealthUrl
      };
    }
  } catch (error) {
    overallStatus = 'down';
    apiHealth = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Failed to connect to API',
      url: apiHealthUrl
    };
  }

  // Include basic health information including version from package.json
  const healthData = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    details: {
      uptime: {
        status: "up",
        uptimeInSeconds: process.uptime(),
        startedAt: new Date(Date.now() - process.uptime() * 1000).toISOString(),
      },
      memory_heap: {
        status: "up",
      },
      disk: {
        status: "up",
      },
      api: apiHealth,
    },
    version: {
      app: packageJson.version,
      monorepo: rootPackageJson.name,
      packageManager: rootPackageJson.packageManager,
      node: process.version,
    },
  };

  // Return response with CORS headers
  const responseStatus = overallStatus === 'down' ? 503 : 200;
  return NextResponse.json(healthData, { 
    status: responseStatus,
    headers: corsHeaders
  });
}
