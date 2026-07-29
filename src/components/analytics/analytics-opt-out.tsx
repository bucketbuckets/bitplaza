"use client";

import { useSyncExternalStore } from "react";

import { stopAnalytics } from "@/lib/analytics/client";
import {
  getConsentState,
  getServerConsentState,
  setUserOptedOut,
  subscribeOptOut,
} from "@/lib/analytics/consent";

/**
 * The opt-out control `bch/plan.md` §1.4 rule 3 commits to.
 *
 * It sits in the footer rather than behind a banner, and turning it on degrades
 * nothing — the page keeps working identically, which is the actual promise.
 * When the browser already signals Do Not Track or Global Privacy Control we
 * say so and show no control at all, because offering a choice that has already
 * been made would misrepresent what the site is doing.
 */
export function AnalyticsOptOut() {
  const state = useSyncExternalStore(subscribeOptOut, getConsentState, getServerConsentState);

  if (state === "browser-opted-out") {
    return (
      <p className="text-xs text-faint">
        Your browser asks sites not to track you. We are not measuring this visit.
      </p>
    );
  }

  const optedOut = state === "user-opted-out";

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <p className="text-xs text-faint">
        {optedOut
          ? "Anonymous usage measurement is off."
          : "We measure anonymous usage — no cookies, no profile."}
      </p>
      <button
        type="button"
        onClick={() => {
          const next = !optedOut;
          setUserOptedOut(next);
          if (next) stopAnalytics();
        }}
        className="rounded-sm py-1 text-xs font-medium text-accent-text underline underline-offset-4 transition-[text-decoration-thickness] hover:decoration-2"
      >
        {optedOut ? "Turn on" : "Turn off"}
      </button>
    </div>
  );
}
