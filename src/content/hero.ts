import { ROUTES } from "./site";

/**
 * Hero copy. One idea, stated once: every community deserves a map.
 *
 * The headline is stored as an ARRAY OF LINES, not a string. Where a display
 * headline breaks is a design decision at this size; leaving it to the browser
 * produces a different composition at every viewport width, and one of them is
 * always wrong.
 */
export const HERO = {
  eyebrow: "The open map for communities",

  /** Manually broken. Each entry is one line at desktop size. */
  headline: ["Every community", "deserves a map."],

  /** One sentence. */
  supporting:
    "Bitplaza brings its people, knowledge, projects, events, and opportunities into one open place.",

  primaryCta: { label: "Explore Bitcoin", href: ROUTES.bitcoin },
  secondaryCta: { label: "Map your community", href: ROUTES.communities },

  trustLine: "Open source. Portable identity. No advertising.",
} as const;
