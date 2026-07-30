import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www serves the app directly (CNAME → Vercel), which made it a 200
      // duplicate of the apex splitting crawl signals. One canonical host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.joinbitplaza.com" }],
        destination: "https://joinbitplaza.com/:path*",
        permanent: true,
      },
      // Routes that shipped under earlier names. Permanent, so shared links
      // and any indexed URLs keep working.
      { source: "/for-community-builders", destination: "/communities", permanent: true },
      { source: "/data", destination: "/open", permanent: true },
    ];
  },
};

export default nextConfig;
