import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
const enableStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable to prevent Leaflet double-initialization in dev
  // Enable static export for GitHub Pages
  // Only enable static export when explicitly requested (GitHub Pages build)
  ...(enableStaticExport ? { output: 'export' } : {}),
  // Optional: set when deploying under a subpath like username.github.io/repo
  ...(basePath ? { basePath } : {}),
  ...(assetPrefix ? { assetPrefix } : {}),
};

export default nextConfig;
