const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? "/realworldasset" : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export" as const,
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
