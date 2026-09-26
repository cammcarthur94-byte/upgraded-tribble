/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/brand-insights",
        destination: "/",
        permanent: false,
      },
      {
        source: "/prompt-analysis",
        destination: "/reports/prompts",
        permanent: false,
      },
      {
        source: "/citations",
        destination: "/reports/citations",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
