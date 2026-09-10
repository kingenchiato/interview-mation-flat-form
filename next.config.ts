import type { NextConfig } from "next";

const repo = "interview-mation-flat-form";
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGhPages ? "export" : undefined,
  basePath: isGhPages ? `/${repo}` : undefined,
  assetPrefix: isGhPages ? `/${repo}/` : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
