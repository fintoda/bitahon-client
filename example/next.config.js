/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
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
}

module.exports = nextConfig
