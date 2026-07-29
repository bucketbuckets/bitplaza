/**
 * The complete analytics catalogue. Sixteen events, and nothing else.
 *
 * This is a closed map on purpose. `capture()` is typed against it, so an
 * event name that is not listed here is a compile error rather than a stray
 * row in PostHog that nobody can interpret six months later. The taxonomy is
 * documented in docs/02-analytics-events.md; keep the two in sync.
 *
 * Two rules bind every entry:
 *
 *   1. NO PII. Never an email, a name, a referral code, or free text the user
 *      typed. `findForbiddenKeys` enforces this against the property names
 *      below at runtime in development.
 *
 *   2. Properties are low-cardinality. Counts, enums and booleans — the
 *      shapes that survive aggregation. Anything unique to one person belongs
 *      in the database, not the event stream.
 */
export interface EventMap {
  /** Fired once per route render, including client-side navigations. */
  page_view: { path: string };

  /** The hero's two pathways. */
  hero_cta_clicked: { cta: "primary" | "secondary" };

  /** A goal chosen inside the interactive map preview. */
  preview_engaged: { choice: "learn" | "build" | "meet" | "work" };

  /** A path card opened or expanded. `path_id` is the stable content id. */
  path_selected: { path_id: string; location: "home" | "bitcoin" };

  /** A territory opened in the hub preview or on /bitcoin. */
  territory_opened: { territory_id: string; location: "home" | "bitcoin" };

  /** Any "Map your community" action. */
  leader_cta_clicked: { location: "header" | "hero" | "section" | "closing" | "footer" };

  /** The waitlist form received focus or was navigated to with intent. */
  waitlist_started: {
    source: "header" | "hero" | "closing" | "footer" | "bitcoin" | "direct";
  };

  waitlist_completed: {
    user_type: string;
    has_referrer: boolean;
    /** True when the address was already on the list. */
    duplicate: boolean;
  };

  /** A submission that did not result in success. No field contents, ever. */
  waitlist_failed: { reason: "validation" | "network" | "server" };

  /** The architecture page opened from a tracked link. */
  architecture_link_clicked: { location: "section" | "footer" };

  /** Only fires once a public repository link exists. */
  repo_link_clicked: { location: "section" | "open_page" };

  faq_opened: { question_id: string };

  referral_link_copied: { method: "button" | "keyboard" };

  /** Fired on the referred person's signup, never on the referrer's device. */
  referral_signup_completed: Record<string, never>;

  community_application_started: Record<string, never>;

  community_application_completed: { community_size: string };
}

export type EventName = keyof EventMap;

/**
 * Property names that must never appear in an event payload.
 * Checked at build time by the type system and again at runtime in development.
 */
export const FORBIDDEN_PROPERTY_PATTERNS: readonly RegExp[] = [
  /email/i,
  /\bname\b/i,
  /first_?name|last_?name|full_?name/i,
  /referral_?code/i,
  /\bgoal\b/i,
  /primary_?problem/i,
  /response/i,
  /website/i,
  /\bip\b/i,
  /phone/i,
];

/** True when a payload carries a key we have forbidden. Used in dev and tests. */
export function findForbiddenKeys(props: Record<string, unknown>): string[] {
  return Object.keys(props).filter((key) =>
    FORBIDDEN_PROPERTY_PATTERNS.some((pattern) => pattern.test(key)),
  );
}
