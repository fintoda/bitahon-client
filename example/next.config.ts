import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: function (config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  experimental: {
    webpackBuildWorker: true,
  },
};

export default nextConfig;
