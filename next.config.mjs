/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false, 
  
  // High performance development optimizations
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in memory
    maxInactiveAge: 60 * 1000,
    // Number of pages that should be kept simultaneously in memory
    pagesBufferLength: 2,
  },

  images: {
    minimumCacheTTL: 60,
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  experimental: {
    // Speed up package imports by avoiding deep scans
    optimizePackageImports: [
      'lucide-react', 
      '@tanstack/react-query', 
      'axios', 
      'sonner', 
      'framer-motion',
      'radix-ui'
    ],
    // Helps with overall development compilation speed
    webpackBuildWorker: true,
  },
};

export default nextConfig;
