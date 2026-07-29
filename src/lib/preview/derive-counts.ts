import type { CommunityId } from "@/lib/communities";

/**
 * The preview numbers for a selection — deterministic on purpose.
 *
 * The same three interests must always produce the same counts: a random
 * number that changes on re-render reads as fake, and credibility is the
 * entire asset here (docs/00 R5). The UI labels the output "Product preview —
 * illustrative" in visible text; this function's job is only to make the
 * illustration stable and plausible.
 *
 * Units are plan.md's entity types: people, projects, events, opportunities.
 */

export interface PreviewCounts {
  people: number;
  projects: number;
  events: number;
  opportunities: number;
}

/** Bounds keep every value in the "small, believable, early" range. */
const BOUNDS = {
  people: { min: 9, max: 26 },
  projects: { min: 3, max: 9 },
  events: { min: 2, max: 6 },
  opportunities: { min: 4, max: 12 },
} as const;

/** FNV-1a — tiny, stable, good spread for short strings. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export function deriveCounts(ids: readonly CommunityId[]): PreviewCounts {
  // Sorted: the preview describes a set of interests, not a click order.
  const seed = [...ids].sort().join("+");

  const pick = (key: keyof typeof BOUNDS, salt: number): number => {
    const { min, max } = BOUNDS[key];
    if (ids.length === 0) return 0;
    const h = hash(`${seed}#${salt}`);
    // More communities → the top of the range; one community → the lower half.
    const span = max - min;
    const base = min + ((h % 1000) / 1000) * span * 0.6;
    const breadth = (span * 0.4 * (ids.length - 1)) / 2;
    return Math.round(Math.min(max, base + breadth));
  };

  return {
    people: pick("people", 1),
    projects: pick("projects", 2),
    events: pick("events", 3),
    opportunities: pick("opportunities", 4),
  };
}
