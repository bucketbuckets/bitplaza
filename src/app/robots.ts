import type { MetadataRoute } from "next";

import { SITE } from "@/content/site";

/** Canonical origin without a trailing slash, so path joins never double up. */
const BASE = SITE.url.replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
