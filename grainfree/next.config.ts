import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.spoonacular.com",
      },
      {
        protocol: "https",
        hostname: "static.openfoodfacts.org",
      },
      {
        protocol: "https",
        hostname: "images.openfoodfacts.org",
      },
    ],
  },
};

export default nextConfig;
