/**
 * The ten communities offered in the interest selector.
 *
 * Each one carries THREE colour tokens, not one. That is not over-engineering —
 * a single hue cannot serve as both a fill and as text on two different grounds
 * and stay above WCAG AA. The split is enforced by tests/tokens.contrast.test.ts.
 *
 *   fill      the community's identity. Absolute — never shifts with theme.
 *   onFill    text placed ON that fill.
 *   textLight the hue as TEXT, on the light theme's grounds.
 *   textDark  the hue as TEXT, on the dark theme's grounds.
 *
 * Bitcoin is the only light-value hue in the set, so it is the only one whose
 * `onFill` is ink rather than white. That difference is structural, not
 * special-casing: it falls out of the colour, and it is the reason Bitcoin can
 * sit among the other nine without dominating the page.
 *
 * These are marketing categories, deliberately kept separate from the product
 * taxonomy in `bch/verticals/bitcoin.md` (twelve domains, ~70 threads). Do not
 * merge the two lists — they answer different questions.
 */

export const COMMUNITY_IDS = [
  "bitcoin",
  "ai",
  "design",
  "collecting",
  "opensource",
  "entrepreneurship",
  "music",
  "local",
  "education",
  "gaming",
] as const;

export type CommunityId = (typeof COMMUNITY_IDS)[number];

export interface Community {
  id: CommunityId;
  label: string;
  fill: string;
  onFill: string;
  textLight: string;
  textDark: string;
}

export const COMMUNITIES: readonly Community[] = [
  {
    id: "bitcoin",
    label: "Bitcoin",
    fill: "#f7931a",
    onFill: "#1b1d1a",
    textLight: "#9a5a08",
    textDark: "#f7931a",
  },
  {
    id: "ai",
    label: "AI",
    fill: "#3a47b5",
    onFill: "#ffffff",
    textLight: "#3a47b5",
    textDark: "#93a0ee",
  },
  {
    id: "design",
    label: "Design",
    fill: "#c0308f",
    onFill: "#ffffff",
    textLight: "#a82a7c",
    textDark: "#f08ccb",
  },
  {
    id: "collecting",
    label: "Collecting",
    fill: "#7e3050",
    onFill: "#ffffff",
    textLight: "#7e3050",
    textDark: "#de8fac",
  },
  {
    id: "opensource",
    label: "Open source",
    fill: "#1e7a45",
    onFill: "#ffffff",
    textLight: "#1b6b3d",
    textDark: "#63c68c",
  },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship",
    fill: "#b33a2b",
    onFill: "#ffffff",
    textLight: "#9e3326",
    textDark: "#f0907f",
  },
  {
    id: "music",
    label: "Music",
    fill: "#6b4fd6",
    onFill: "#ffffff",
    textLight: "#5f45c0",
    textDark: "#afa0f0",
  },
  {
    id: "local",
    label: "Local community",
    fill: "#5e6916",
    onFill: "#ffffff",
    textLight: "#565f14",
    textDark: "#b3c155",
  },
  {
    id: "education",
    label: "Education",
    fill: "#1a66ab",
    onFill: "#ffffff",
    textLight: "#1a66ab",
    textDark: "#78b6ee",
  },
  {
    id: "gaming",
    label: "Gaming",
    fill: "#0a6b6d",
    onFill: "#ffffff",
    textLight: "#0a6b6d",
    textDark: "#4fc0c2",
  },
] as const;

/** The brief's cap. Enforced in the UI, in Zod, and again server-side. */
export const MAX_COMMUNITIES = 3;

const BY_ID = new Map(COMMUNITIES.map((c) => [c.id, c]));

export function getCommunity(id: string): Community | undefined {
  return BY_ID.get(id as CommunityId);
}

export function isCommunityId(value: unknown): value is CommunityId {
  return typeof value === "string" && BY_ID.has(value as CommunityId);
}

/** Labels for display, in the canonical order — never re-sorted by selection. */
export function labelsFor(ids: readonly string[]): string[] {
  return COMMUNITIES.filter((c) => ids.includes(c.id)).map((c) => c.label);
}
