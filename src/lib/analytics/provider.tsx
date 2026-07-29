"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { capture, initAnalytics } from "./client";

/**
 * Starts analytics and reports route changes.
 *
 * `capture_pageview` is off in the client config, so page views are sent from
 * here. Doing it explicitly means the path is the only thing recorded — the
 * automatic version also attaches the full URL including the query string,
 * which on this site would carry the referral code.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;
    capture("page_view", { path: pathname });
  }, [pathname]);

  return <>{children}</>;
}
