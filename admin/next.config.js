/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Serve the admin under a sub-path when deployed behind a shared domain
  // (e.g. /admin). Leave NEXT_PUBLIC_BASE_PATH unset for local dev (root).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

module.exports = nextConfig;
