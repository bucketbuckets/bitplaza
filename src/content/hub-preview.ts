import { ROUTES } from "./site";

/**
 * The Bitcoin Culture Hub preview: the first map, shown as a real place with
 * visible activity rather than a static taxonomy.
 *
 * HONESTY RULE (owner, 2026-07-30): `activity` carries NO numbers — it names
 * the kinds of things each territory holds ("foundational texts · thinkers"),
 * which is true today. The earlier illustrative counts and their visible
 * disclaimer are both gone; when real live counts exist they may return
 * together with whatever caveat they then need.
 *
 * One depth system, used everywhere: Start, Explore, Deepen.
 */
export const HUB_PREVIEW_SECTION = {
  eyebrow: "The first map",
  heading: "Explore the first map.",
  lead: "Bitcoin is where Bitplaza begins. Explore its ideas, builders, organizations, culture, events, and opportunities without needing to know where everything is already hidden.",
  cta: { label: "Explore Bitcoin", href: ROUTES.bitcoin },
} as const;

export interface Territory {
  id: string;
  name: string;
  /** One line naming what the territory holds. Category labels, no counts. */
  activity: string;
  /** A marked way in, so no territory is a dead end. */
  start: string;
}

/** The eleven territories of the Bitcoin map. */
export const TERRITORIES: readonly Territory[] = [
  {
    id: "origins",
    name: "Origins and philosophy",
    activity: "foundational texts · thinkers · reading paths",
    start: "Start with the whitepaper, annotated",
  },
  {
    id: "protocol",
    name: "Protocol and development",
    activity: "active projects · open review queues",
    start: "Start with how a transaction works",
  },
  {
    id: "mining",
    name: "Mining and energy",
    activity: "operations mapped · research groups",
    start: "Start with what miners actually do",
  },
  {
    id: "payments",
    name: "Payments",
    activity: "wallets and tools · merchant guides",
    start: "Start with your first Lightning payment",
  },
  {
    id: "custody",
    name: "Self-custody and privacy",
    activity: "guides · tools compared",
    start: "Start with keys, in plain language",
  },
  {
    id: "markets",
    name: "Money and markets",
    activity: "explainers · recurring debates mapped",
    start: "Start with why fixed supply matters",
  },
  {
    id: "culture",
    name: "Art and culture",
    activity: "creators · collections · upcoming exhibitions",
    start: "Start with the art the culture argues about",
  },
  {
    id: "media",
    name: "Media and education",
    activity: "shows and courses · newsletters",
    start: "Start with one honest beginner course",
  },
  {
    id: "community",
    name: "Community and place",
    activity: "meetups · upcoming events near you",
    start: "Start with the meetup nearest you",
  },
  {
    id: "policy",
    name: "Freedom and policy",
    activity: "organizations · live policy questions",
    start: "Start with what is actually at stake",
  },
  {
    id: "work",
    name: "Work and builders",
    activity: "open roles · projects seeking contributors",
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
