// CORS headers for Next.js API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://web-ubxh.onrender.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// Helper function to handle OPTIONS requests
export function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}