import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	transpilePackages: ["@reactlit/core", "@reactlit/vanilla"],
	reactStrictMode: true,
};

export default nextConfig;
