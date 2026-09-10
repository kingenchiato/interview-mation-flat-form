import type { NextConfig } from "next";

const repo = "interview-mation-flat-form";
const isGhPages = process.env.GITHUB_PAGES === "true";
const basePath = isGhPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: isGhPages ? "export" : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: isGhPages,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
