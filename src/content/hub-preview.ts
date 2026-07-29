import { ROUTES } from "./site";

/**
 * The Bitcoin Culture Hub preview: the first map, shown as a real place with
 * visible activity rather than a static taxonomy.
 *
 * HONESTY RULE: every number in `activity` is illustrative and the interface
 * must say so in visible text (DATA_DISCLAIMER). The map is being seeded;
 * implying these counts are live would spend the site's only asset,
 * credibility. When real counts exist, they replace these in this file and
 * the disclaimer comes off.
 *
 * One depth system, used everywhere: Start, Explore, Deepen.
 */
export const HUB_PREVIEW_SECTION = {
  eyebrow: "The first map",
  heading: "Explore the first map.",
  lead: "Bitcoin is where Bitplaza begins. Explore its ideas, builders, organizations, culture, events, and opportunities without needing to know where everything is already hidden.",
  cta: { label: "Explore Bitcoin", href: ROUTES.bitcoin },
} as const;

/** Shown wherever illustrative territory activity appears. Visible, not a tooltip. */
export const DATA_DISCLAIMER = "Illustrative preview. The map is being seeded now." as const;

export interface Territory {
  id: string;
  name: string;
  /** One line of visible activity. Illustrative until launch. */
  activity: string;
  /** A marked way in, so no territory is a dead end. */
  start: string;
}

/** The eleven territories of the Bitcoin map. */
export const TERRITORIES: readonly Territory[] = [
  {
    id: "origins",
    name: "Origins and philosophy",
    activity: "9 foundational texts · 14 thinkers · 3 reading paths",
    start: "Start with the whitepaper, annotated",
  },
  {
    id: "protocol",
    name: "Protocol and development",
    activity: "22 active projects · 8 open review queues",
    start: "Start with how a transaction works",
  },
  {
    id: "mining",
    name: "Mining and energy",
    activity: "11 operations mapped · 4 research groups",
    start: "Start with what miners actually do",
  },
  {
    id: "payments",
    name: "Payments",
    activity: "16 wallets and tools · 5 merchant guides",
    start: "Start with your first Lightning payment",
  },
  {
    id: "custody",
    name: "Self-custody and privacy",
    activity: "12 guides · 6 tools compared",
    start: "Start with keys, in plain language",
  },
  {
    id: "markets",
    name: "Money and markets",
    activity: "10 explainers · 7 recurring debates mapped",
    start: "Start with why fixed supply matters",
  },
  {
    id: "culture",
    name: "Art and culture",
    activity: "18 creators · 7 collections · 2 upcoming exhibitions",
    start: "Start with the art the culture argues about",
  },
  {
    id: "media",
    name: "Media and education",
    activity: "20 shows and courses · 9 newsletters",
    start: "Start with one honest beginner course",
  },
  {
    id: "community",
    name: "Community and place",
    activity: "24 meetups · 5 upcoming events near you",
    start: "Start with the meetup nearest you",
  },
  {
    id: "policy",
    name: "Freedom and policy",
    activity: "8 organizations · 6 live policy questions",
    start: "Start with what is actually at stake",
  },
  {
    id: "work",
    name: "Work and builders",
    activity: "12 open roles · 6 projects seeking contributors",
    start: "Start with where your skills fit",
  },
] as const;

/** One consistent depth system across the whole product. */
export const DEPTH_LEVELS = [
  { id: "start", label: "Start", meaning: "Assumes nothing. Explains itself." },
  { id: "explore", label: "Explore", meaning: "You know the basics and want the territory." },
  { id: "deepen", label: "Deepen", meaning: "Technical, specialist, or years in." },
] as const;

export type DepthId = (typeof DEPTH_LEVELS)[number]["id"];
