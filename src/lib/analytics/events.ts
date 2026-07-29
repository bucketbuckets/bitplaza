import type { CommunityId } from "@/lib/communities";

/**
 * The complete analytics catalogue. Twelve events, and nothing else.
 *
 * This is a closed map on purpose. `capture()` is typed against it, so an event
 * name that is not listed here is a compile error rather than a stray row in
 * PostHog that nobody can interpret six months later.
 *
 * Two rules bind every entry:
 *
 *   1. NO PII. Never an email, a name, a referral code, or free text the user
 *      typed. `tests/analytics.no-pii.test.ts` enforces this against the
 *      property names below; the reason it is a test and not a convention is
 *      that `plan.md` §11 rates a telemetry incident as unrecoverable for a
 *      public good, and this audience reads the source.
 *
 *   2. Properties are low-cardinality. Counts, enums and booleans — the shapes
 *      that survive aggregation. Anything unique to one person belongs in the
 *      database, not the event stream.
 */
export interface EventMap {
  /** Fired once per route render, including client-side navigations. */
  page_view: { path: string };

  hero_cta_clicked: { cta: "primary" | "secondary" };

  /** The "Explore the vision" affordance, wherever it appears. */
  vision_clicked: { location: "hero" | "nav" };

  interest_selected: {
    community: CommunityId;
    action: "add" | "remove";
    /** How many are selected AFTER this action. 0–3. */
    selected_count: number;
  };

  /** The third selection landed and the preview animated in. */
  interest_preview_completed: { communities: CommunityId[] };

  waitlist_started: {
    source: "hero" | "nav" | "interest_preview" | "waitlist_section" | "footer";
    /** Whether interests were carried in from the selector. */
    prefilled: boolean;
  };

  waitlist_completed: {
    user_type: string;
    community_count: number;
    has_referrer: boolean;
    /** True when the address was already on the list. */
    duplicate: boolean;
  };

  referral_link_copied: { method: "button" | "keyboard" };

  /** Fired on the referred person's signup, never on the referrer's device. */
  referral_signup_completed: Record<string, never>;

  community_application_started: Record<string, never>;

  community_application_completed: { community_size: string };

  faq_opened: { question_id: string };
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
