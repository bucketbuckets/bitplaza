import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Routes that shipped under earlier names. Permanent, so shared links and
    // any indexed URLs keep working.
    return [
      { source: "/for-community-builders", destination: "/communities", permanent: true },
      { source: "/data", destination: "/open", permanent: true },
    ];
  },
};

export default nextConfig;
