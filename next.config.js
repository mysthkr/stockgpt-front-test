/** @type {import('next').NextConfig} */
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first")

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  compiler: {
    //styled-components
    styledComponents: true,
  },
}

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

// module.exports = nextConfig