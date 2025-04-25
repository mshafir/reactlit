import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	transpilePackages: ["@reactlit/core", "@reactlit/vanilla"],
	reactStrictMode: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
