
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://launchpad-backend-hyf9hzhbgbdzbyha.centralindia-01.azurewebsites.net/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
