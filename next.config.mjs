/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Rewrites `import { X } from 'lucide-react'` to per-icon deep imports so dev never compiles
    // the full ~1500-icon barrel (the cause of multi-second / 15s+ cold page loads). Only the
    // icons actually referenced in lib/nav.ts are pulled into the graph.
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
