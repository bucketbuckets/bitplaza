/**
 * Analytics consent.
 *
 * `bch/plan.md` §1.4 rule 3 commits to "opt-out of behavioral logging without
 * degrading the browsing experience" — opt-OUT, not opt-in. So the posture is:
 *
 *   · On by default, but deliberately weak: memory-only persistence, no cookie,
 *     no localStorage id, no cross-session identity, no autocapture, no session
 *     recording. Closing the tab ends the identity.
 *   · `navigator.doNotTrack` and Global Privacy Control are honoured as a hard
 *     opt-out, with no banner asking the user to reconsider.
 *   · An explicit opt-out control lives in the footer and on /data, and the
 *     choice persists.
 *
 * There is no consent banner, and that is the considered position rather than
 * an omission. A banner would be the dark pattern here: it interrupts everyone
 * to authorise data collection that has been designed not to need authorising.
 */

const STORAGE_KEY = "bp-analytics-optout";

/** The browser is signalling a tracking preference we are bound to respect. */
export function browserOptsOut(): boolean {
  if (typeof navigator === "undefined") return false;

  const nav = navigator as Navigator & {
    doNotTrack?: string;
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  const win = typeof window !== "undefined" ? (window as Window & { doNotTrack?: string }) : undefined;

  const dnt = nav.doNotTrack ?? win?.doNotTrack ?? nav.msDoNotTrack;
  return dnt === "1" || dnt === "yes" || nav.globalPrivacyControl === true;
}

/** The user has explicitly opted out on this device. */
export function userOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Storage can throw in private mode or with third-party cookies blocked.
    // Failing closed here would silently disable analytics for a whole class of
    // browser; failing open keeps the memory-only default, which is harmless.
    return false;
  }
}

export function setUserOptedOut(optedOut: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (optedOut) window.localStorage.setItem(STORAGE_KEY, "1");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing useful to do — the in-memory flag still applies for this session */
  }
  for (const listener of listeners) listener();
}

/* The preference is external state — it lives in localStorage and can change in
   another tab — so the UI reads it with useSyncExternalStore rather than
   mirroring it into React state on mount. */

const listeners = new Set<() => void>();

export function subscribeOptOut(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export type ConsentState = "measuring" | "user-opted-out" | "browser-opted-out";

export function getConsentState(): ConsentState {
  if (browserOptsOut()) return "browser-opted-out";
  return userOptedOut() ? "user-opted-out" : "measuring";
}

/** Before hydration nothing is known, and the control renders inert. */
export function getServerConsentState(): ConsentState {
  return "measuring";
}

/** The single question the analytics client asks before sending anything. */
export function analyticsAllowed(): boolean {
  return !browserOptsOut() && !userOptedOut();
}
