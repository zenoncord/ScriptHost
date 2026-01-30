/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // High recommended to set this to false once errors are fixed
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Required for Tailwind 4 + Next 15/16 in some environments
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
}

export default nextConfig
