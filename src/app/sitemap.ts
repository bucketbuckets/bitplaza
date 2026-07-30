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
  /** Date of the last MEANINGFUL content change. Bump it when you ship one —
      a request-time `new Date()` here taught crawlers the field was noise. */
  lastModified: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: ROUTES.home, lastModified: "2026-07-30", changeFrequency: "weekly", priority: 1 },
  { path: ROUTES.bitcoin, lastModified: "2026-07-30", changeFrequency: "weekly", priority: 0.9 },
  { path: ROUTES.communities, lastModified: "2026-07-30", changeFrequency: "monthly", priority: 0.8 },
  { path: ROUTES.open, lastModified: "2026-07-30", changeFrequency: "monthly", priority: 0.6 },
  { path: ROUTES.about, lastModified: "2026-07-29", changeFrequency: "monthly", priority: 0.6 },
  { path: ROUTES.questions, lastModified: "2026-07-29", changeFrequency: "monthly", priority: 0.5 },
  { path: ROUTES.privacy, lastModified: "2026-07-30", changeFrequency: "yearly", priority: 0.3 },
  { path: ROUTES.terms, lastModified: "2026-07-30", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ENTRIES.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: path === ROUTES.home ? BASE : `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
