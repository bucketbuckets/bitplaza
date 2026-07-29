/**
 * Hero copy. design.md §16, district 1.
 *
 * The headline is stored as an ARRAY OF LINES, not a string. Where a display
 * headline breaks is a design decision at this size — leaving it to the browser
 * produces a different composition at every viewport width, and one of them is
 * always wrong.
 *
 * Supporting copy is ONE sentence, maximum 20 words. The previous version ran to
 * 34 and read as a paragraph, which §16 rules out: nobody arrives wanting to
 * read. Everything cut from here is said properly further down the page.
 */
export const HERO = {
  eyebrow: "The internet for your interests",

  /** Manually broken. Each entry is one line at desktop size. */
  headline: ["Find your", "people."],

  /** One sentence. 19 words. */
  supporting:
    "Enter the communities you care about, and everything worth doing next — without depending on one closed platform.",

  primaryCta: { label: "Enter the first plaza", href: "#bitcoin" },
  secondaryCta: { label: "Request early access", href: "#waitlist" },
  tertiaryCta: { label: "See how it works", href: "#pillars" },

  trustLine: "Start with Bitcoin. Expand anywhere.",

  /** Describes the composition for anyone who cannot see it. */
  sceneLabel:
    "A colonnade of arches, each a doorway into a different community, with people gathered at the thresholds.",
} as const;
