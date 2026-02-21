/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/", destination: "/v2.1", permanent: false },
    ];
  },
};

export default nextConfig;

