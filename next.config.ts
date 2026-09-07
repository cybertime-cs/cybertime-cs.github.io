import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The build script exports both public routes with their exact base path.
  basePath: '',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
