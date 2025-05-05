/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true, // Ensure this is enabled for the `/src/app` directory
	},
};

export default nextConfig;
