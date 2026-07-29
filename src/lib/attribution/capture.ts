"use client";

/**
 * Cookie-free attribution. `?ref` and `utm_*` are read once on first load
 * into sessionStorage, so they survive the scroll (or a same-tab reload)
 * between landing and submitting — without setting anything /data would have
 * to disclose as tracking. Nothing here leaves the browser until the visitor
 * chooses to submit the form, and then only inside their own submission.
 */

const KEY = "bitplaza.attribution";

export interface Attribution {
  ref?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

/** Longer than any legitimate value; bounds what a crafted URL can store. */
const MAX_LEN = 100;

function clean(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, MAX_LEN);
  return trimmed === "" ? undefined : trimmed;
}

/** Idempotent; call on every load. First captured value wins for the session. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const incoming: Attribution = {
      ref: clean(params.get("ref")),
      utmSource: clean(params.get("utm_source")),
      utmMedium: clean(params.get("utm_medium")),
      utmCampaign: clean(params.get("utm_campaign")),
    };
    if (!incoming.ref && !incoming.utmSource && !incoming.utmMedium && !incoming.utmCampaign) {
      return;
    }
    const existing = getAttribution();
    window.sessionStorage.setItem(KEY, JSON.stringify({ ...incoming, ...existing }));
  } catch {
    // Storage can be unavailable (private mode, quotas). Attribution is
    // nice-to-have; the signup must not notice.
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const pick = (k: string) =>
      typeof parsed[k] === "string" ? (parsed[k] as string).slice(0, MAX_LEN) : undefined;
    return {
      ref: pick("ref"),
      utmSource: pick("utmSource"),
      utmMedium: pick("utmMedium"),
      utmCampaign: pick("utmCampaign"),
    };
  } catch {
    return {};
  }
}
