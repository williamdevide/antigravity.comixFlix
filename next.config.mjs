/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'contribution.usercontent.google.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: '**.panini.com.br',
      },
      {
        protocol: 'https',
        hostname: 'd14d9vp3wdof84.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'images.tcdn.com.br',
      },
      {
        protocol: 'https',
        hostname: 'pipocaenanquim.com.br',
      },
      {
        protocol: 'https',
        hostname: 'cdl-static.s3-sa-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.companhiadasletras.com.br',
      },
    ],
  },
};

export default nextConfig;
