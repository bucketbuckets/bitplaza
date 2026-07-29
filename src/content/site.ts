/**
 * Site-wide constants and structure.
 *
 * Rule for this whole directory: no copy lives in JSX, ever. Every headline,
 * label and answer is a typed constant here, which is what makes a copy
 * review, a landing-page variant, or a second community's page cheap instead
 * of a refactor.
 */

export const SITE = {
  name: "Bitplaza",
  /** Used in <title> templates and the OG image. */
  tagline: "The Open Map for Communities",
  description:
    "Bitplaza brings a community's people, knowledge, projects, events, and opportunities into one open, navigable map. Start with Bitcoin.",
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL per environment. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://joinbitplaza.com",
  locale: "en_US",
} as const;

/** The one-line promise, used in the footer. */
export const BRAND_PROMISE = "Every community deserves a map." as const;

export const ROUTES = {
  home: "/",
  bitcoin: "/bitcoin",
  communities: "/communities",
  open: "/open",
  about: "/about",
  questions: "/questions",
  privacy: "/privacy",
  terms: "/terms",
} as const;

/**
 * Four items and one action. Anything more competes with the two paths the
 * site exists to offer: explore Bitcoin, or map your community.
 */
export const NAV_LINKS = [
  { href: ROUTES.bitcoin, label: "Explore" },
  { href: ROUTES.communities, label: "For communities" },
  { href: ROUTES.open, label: "Open source" },
  { href: ROUTES.about, label: "About" },
] as const;

/** The header's one action. Leaders are the conversion the header serves. */
export const NAV_CTA = { href: ROUTES.communities, label: "Map your community" } as const;

export const FOOTER_GROUPS = [
  {
    heading: "Product",
    links: [
      { href: ROUTES.bitcoin, label: "Explore Bitcoin" },
      { href: ROUTES.communities, label: "Map your community" },
      { href: "/#waitlist", label: "Get early access" },
    ],
  },
  {
    heading: "Bitplaza",
    links: [
      { href: ROUTES.about, label: "About" },
      { href: ROUTES.open, label: "Open architecture" },
      { href: ROUTES.questions, label: "Questions" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: ROUTES.privacy, label: "Privacy" },
      { href: ROUTES.terms, label: "Terms" },
    ],
  },
] as const;

/**
 * The commercial position in one line, used in the footer. The map is open;
 * the company charges operators for the tools built on top of it.
 */
export const OPENNESS_LINE =
  "The map is open. Bitplaza sustains itself by building the tools communities run on top of it." as const;
