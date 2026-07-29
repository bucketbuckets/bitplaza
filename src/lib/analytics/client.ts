"use client";

import posthog from "posthog-js";

import { analyticsAllowed } from "./consent";
import { findForbiddenKeys, type EventMap, type EventName } from "./events";

let started = false;

/**
 * Initialise PostHog, configured for a privacy-sensitive audience.
 *
 * Almost everything here is a disabled default. That is the point: the standard
 * drop-in captures far more than the twelve events this product needs, and
 * `plan.md` §11 rates a covert-telemetry incident as unrecoverable. Every flag
 * below is a promise the code has to keep on its own, because the client is
 * open source and someone will read it.
 */
export function initAnalytics(): void {
  if (started || typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // Not configured — local dev and previews stay silent.

  if (!analyticsAllowed()) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",

    // Memory-only: no cookie, no localStorage id, no identity across sessions.
    persistence: "memory",

    // Nothing is captured unless this file asks for it by name.
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    disable_surveys: true,

    // Heatmaps and web vitals both imply broad passive collection.
    capture_heatmaps: false,
    capture_performance: false,

    // The IP is dropped server-side; this stops the geo enrichment that would
    // otherwise attach a city to every anonymous event.
    ip: false,

    // We call initAnalytics() ourselves at the right moment.
    loaded: () => {
      started = true;
    },
  });

  started = true;
}

/**
 * Send one catalogued event.
 *
 * Typed against `EventMap`, so an unlisted name will not compile. The runtime
 * PII check is a second belt: types do not survive `as any`, and a payload that
 * leaks an email address is the failure this project can least afford.
 */
export function capture<K extends EventName>(name: K, props: EventMap[K]): void {
  if (typeof window === "undefined") return;

  const payload = (props ?? {}) as Record<string, unknown>;

  if (process.env.NODE_ENV !== "production") {
    const forbidden = findForbiddenKeys(payload);
    if (forbidden.length > 0) {
      throw new Error(
        `Analytics event "${name}" carries forbidden propert${
          forbidden.length === 1 ? "y" : "ies"
        }: ${forbidden.join(", ")}. Personal data must not enter the event stream — ` +
          `put it in the database instead. See src/lib/analytics/events.ts.`,
      );
    }
  }

  if (!started || !analyticsAllowed()) return;

  posthog.capture(name, payload);
}

/** Stop sending immediately, for the footer and /data opt-out control. */
export function stopAnalytics(): void {
  if (!started) return;
  posthog.opt_out_capturing();
  started = false;
}
