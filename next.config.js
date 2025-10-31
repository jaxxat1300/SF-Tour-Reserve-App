/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production'
const repoName = 'SF-Tour-Reserve-App'

const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  // Configure basePath/assetPrefix for GitHub Project Pages
  ...(isGithubPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
  images: {
    // Static export requires unoptimized images
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;

