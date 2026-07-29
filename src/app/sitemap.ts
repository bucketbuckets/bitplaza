import type { MetadataRoute } from "next";

import { ROUTES, SITE } from "@/content/site";

/** Canonical origin without a trailing slash, so path joins never double up. */
const BASE = SITE.url.replace(/\/+$/, "");

/**
 * Every indexable route, and only those. Redirect sources
 * (/for-community-builders, /data — 308s in next.config.ts) and /api routes
 * stay out on purpose: crawlers should only ever see the canonical URLs.
 */
const ENTRIES: ReadonlyArray<{
  path: (typeof ROUTES)[keyof typeof ROUTES];
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: ROUTES.home, changeFrequency: "weekly", priority: 1 },
  { path: ROUTES.bitcoin, changeFrequency: "weekly", priority: 0.9 },
  { path: ROUTES.communities, changeFrequency: "monthly", priority: 0.8 },
  { path: ROUTES.open, changeFrequency: "monthly", priority: 0.6 },
  { path: ROUTES.about, changeFrequency: "monthly", priority: 0.6 },
  { path: ROUTES.questions, changeFrequency: "monthly", priority: 0.5 },
  { path: ROUTES.privacy, changeFrequency: "yearly", priority: 0.3 },
  { path: ROUTES.terms, changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ENTRIES.map(({ path, changeFrequency, priority }) => ({
    url: path === ROUTES.home ? BASE : `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
