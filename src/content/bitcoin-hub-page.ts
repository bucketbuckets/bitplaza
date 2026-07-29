import { ROUTES } from "./site";

/**
 * /bitcoin — the first map's own page.
 *
 * OWNER NOTE: the specific launch material (real entries, dates, links to the
 * live hub once it has a URL) is coming later. Swap it in HERE, in this file,
 * not in the components. Territory activity lines come from
 * `src/content/hub-preview.ts` and are labeled illustrative until the seed
 * sprint has run; entry counts are never claimed as live before then.
 *
 * This is the one page where Bitcoin's color leads (as accents and marks,
 * never as a ground behind text).
 */
export const BITCOIN_HUB_PAGE = {
  meta: {
    title: "Explore Bitcoin: the first open community map",
    description:
      "One open map of the Bitcoin community: its people, knowledge, projects, events, and opportunities, marked for depth and connected to a concrete next step.",
  },

  hero: {
    eyebrow: "The first map",
    status: "Opening first, in stages, to the waitlist",
    heading: "The Bitcoin map",
    supporting:
      "Bitcoin's culture is the deepest on the internet, and the most scattered. Bitplaza puts its people, projects, events, learning, and work on one connected map, so wherever you are, you can see where to go next.",
    primaryCta: { label: "Get early access", href: "/#waitlist" },
    secondaryCta: { label: "How Bitplaza works", href: ROUTES.home },
  },

  territories: {
    heading: "Eleven territories",
    body: "Every territory holds people, organizations, resources, events, and opportunities, with a marked place to start. Nothing lives in a silo: a person links to their projects, a project to its events, an event to what to read first.",
  },

  depth: {
    heading: "Three depths",
    body: "Every part of the map is marked for how far in it sits, so you can start where you actually are and go deeper on purpose.",
  },

  paths: {
    heading: "Paths across the map",
    body: "A path is a route to an outcome, not a course. Each one ends somewhere you can point at.",
  },

  closing: {
    heading: "Be there when the doors open.",
    body: "The Bitcoin map opens to the waitlist in order. Join now, and arrive with your people already inside.",
    cta: { label: "Get early access", href: "/#waitlist" },
  },
} as const;
