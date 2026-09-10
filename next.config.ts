import type { NextConfig } from "next";

const repo = "interview-mation-flat-form";
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Static export only for GitHub Pages. Local `next dev` / `next start` stay dynamic.
  output: isGhPages ? "export" : undefined,
  basePath: isGhPages ? `/${repo}` : undefined,
  assetPrefix: isGhPages ? `/${repo}` : undefined,
  images: { unoptimized: true },
  // Avoid trailingSlash locally (can confuse deep links). Keep for GH Pages static folders.
  trailingSlash: isGhPages,
};

export default nextConfig;
