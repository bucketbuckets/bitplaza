/**
 * The ten communities offered in the interest selector. See `design.md` §8.4.
 *
 * These ten are fixed by the product brief. They are the selector's options and
 * therefore a data decision — adding or substituting one means changing the
 * waitlist schema too, not just a colour table.
 *
 * Each carries THREE colour tokens, not one:
 *
 *   fill      the community's identity. Absolute — never shifts with theme.
 *   onFill    text placed ON that fill.
 *   textLight the hue as TEXT, on the light theme's grounds.
 *   textDark  the hue as TEXT, on the dark theme's grounds.
 *
 * No single hue clears AA in all three roles, so the split is arithmetic rather
 * than over-engineering.
 *
 * `onFill` is chosen per community BY MEASUREMENT — four take ink, six take
 * white. There is no convention to memorise and no "exception" to remember:
 * compute both, keep the higher. tests/tokens.contrast.test.ts asserts that the
 * value recorded here really is the better of the two.
 *
 * These are marketing categories, deliberately separate from the product
 * taxonomy in `bch/verticals/bitcoin.md` (twelve domains, ~70 threads). Do not
 * merge the lists — they answer different questions.
 */

export const COMMUNITY_IDS = [
  "bitcoin",
  "music",
  "design",
  "opensource",
  "local",
  "collecting",
  "education",
  "gaming",
  "entrepreneurship",
  "ai",
] as const;

export type CommunityId = (typeof COMMUNITY_IDS)[number];

/** Where a plaza is in its life. Never signalled by colour alone. */
export type PlazaStatus = "live" | "forming" | "idea";

export interface Community {
  id: CommunityId;
  label: string;
  fill: string;
  onFill: string;
  textLight: string;
  textDark: string;
  status: PlazaStatus;
}

const INK = "#1a1310";
const WHITE = "#ffffff";

export const COMMUNITIES: readonly Community[] = [
  {
    id: "bitcoin",
    label: "Bitcoin",
    fill: "#f7931a",
    onFill: INK,
    textLight: "#8a5008",
    textDark: "#ffb454",
    status: "live",
  },
  {
    id: "music",
    label: "Music",
    fill: "#e0457b",
    onFill: INK,
    textLight: "#b32458",
    textDark: "#ff93b4",
    status: "forming",
  },
  {
    id: "design",
    label: "Design",
    fill: "#7b3ff2",
    onFill: WHITE,
    textLight: "#6326d6",
    textDark: "#c0a5ff",
    status: "forming",
  },
  {
    id: "opensource",
    label: "Open source",
    fill: "#0e9f6e",
    onFill: INK,
    textLight: "#0b7a54",
    textDark: "#4fdca6",
    status: "forming",
  },
  {
    id: "local",
    label: "Local community",
    fill: "#e4572e",
    onFill: INK,
    textLight: "#a33418",
    textDark: "#ffa07d",
    status: "forming",
  },
  {
    id: "collecting",
    label: "Collecting",
    fill: "#0d7ea8",
    onFill: WHITE,
    textLight: "#0a6386",
    textDark: "#5ec8ef",
    status: "forming",
  },
  {
    id: "education",
    label: "Education",
    fill: "#3b49df",
    onFill: WHITE,
    textLight: "#2c39b8",
    textDark: "#98a6ff",
    status: "idea",
  },
  {
    id: "gaming",
    label: "Gaming",
    fill: "#c026a8",
    onFill: WHITE,
    textLight: "#9c1f87",
    textDark: "#f292de",
    status: "idea",
  },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship",
    fill: "#1f7a3d",
    onFill: WHITE,
    textLight: "#186231",
    textDark: "#59c97f",
    status: "idea",
  },
  {
    id: "ai",
    label: "AI",
    fill: "#5a5f6b",
    onFill: WHITE,
    textLight: "#4a4f59",
    textDark: "#b8bec9",
    status: "idea",
  },
] as const;

/** The brief's cap. Enforced in the UI, in Zod, and again server-side. */
export const MAX_COMMUNITIES = 3;

/** Status is always paired with this label in the UI — never colour alone. */
export const STATUS_LABEL: Record<PlazaStatus, string> = {
  live: "Live",
  forming: "Forming",
  idea: "Idea",
};

const BY_ID = new Map(COMMUNITIES.map((c) => [c.id, c]));

export function getCommunity(id: string): Community | undefined {
  return BY_ID.get(id as CommunityId);
}

export function isCommunityId(value: unknown): value is CommunityId {
  return typeof value === "string" && BY_ID.has(value as CommunityId);
}

/** Labels for display, in canonical order — never re-sorted by selection. */
export function labelsFor(ids: readonly string[]): string[] {
  return COMMUNITIES.filter((c) => ids.includes(c.id)).map((c) => c.label);
}
