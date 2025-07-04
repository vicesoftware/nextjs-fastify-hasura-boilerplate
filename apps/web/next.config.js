/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add environment variables
  env: {
    NEXT_PUBLIC_API_IMPLEMENTATION: process.env.API_IMPLEMENTATION || "fastify",
    // Default API URLs for different implementations
    NEXT_PUBLIC_API_URL_FASTIFY:
      process.env.NEXT_PUBLIC_API_URL_FASTIFY || "http://localhost:4000/api",
    NEXT_PUBLIC_API_URL_NEXTJS:
      process.env.NEXT_PUBLIC_API_URL_NEXTJS || "/api",
  },
};

export default nextConfig;
