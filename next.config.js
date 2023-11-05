/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  typescript: {
    // ignore weird build error
    // happens with State enum in /home/page.tsx
    // https://github.com/vercel/next.js/issues/50870
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
