import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	images: { unoptimized: true },
	// Modularize barrel imports so only the icons/exports actually used are
	// bundled (safe compile-time transform, no behavior change).
	experimental: {
		optimizePackageImports: ["lucide-react", "react-icons", "framer-motion"],
	},
};

export default nextConfig;
