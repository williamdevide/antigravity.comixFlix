const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'antigravity.comixFlix';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  trailingSlash: isGithubPages ? true : false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'contribution.usercontent.google.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: '**.panini.com.br' },
      { protocol: 'https', hostname: 'd14d9vp3wdof84.cloudfront.net' },
      { protocol: 'https', hostname: 'images.tcdn.com.br' },
      { protocol: 'https', hostname: 'pipocaenanquim.com.br' },
      { protocol: 'https', hostname: 'cdl-static.s3-sa-east-1.amazonaws.com' },
      { protocol: 'https', hostname: '**.companhiadasletras.com.br' },
      { protocol: 'https', hostname: '**.vtexassets.com' },
    ],
  },
};

export default nextConfig;
