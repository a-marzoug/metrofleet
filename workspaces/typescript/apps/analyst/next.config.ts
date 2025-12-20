import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Build as a standalone Node.js bundle so the Docker image can run the app without a full Next dev toolchain
  output: "standalone",
};

export default nextConfig;
