/**
 * Site-wide constants and structure.
 *
 * Rule for this whole directory: no copy lives in JSX, ever. Every headline,
 * label and answer is a typed constant here. It is the same discipline
 * `bch/plan.md` §6.5 imposes on the product ("no component contains a
 * vertical-specific string"), applied to the marketing site — and it is what
 * makes a copy review, a landing-page variant, or a second plaza's page cheap
 * instead of a refactor.
 */

export const SITE = {
  name: "Bitplaza",
  /** Used in <title> templates and the OG image. */
  tagline: "Enter the communities that shape your life.",
  description:
    "Bitplaza is an AI-powered network where people find their communities, build reputation and discover meaningful ways to participate.",
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL per environment. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bitplaza.com",
  locale: "en_US",
} as const;

/** The promise, used in the footer and the OG image. */
export const BRAND_PROMISE = "Less noise. More belonging, progress and opportunity." as const;

/**
 * Minimal navigation. Four items and one action — anything more competes with
 * the single conversion the page exists for.
 */
export const NAV_LINKS = [
  { href: "#pillars", label: "What it is" },
  { href: "#plaza-builder", label: "Build your plaza" },
  { href: "#bitcoin", label: "First plaza" },
  { href: "#faq", label: "Questions" },
] as const;

export const ROUTES = {
  home: "/",
  communityBuilders: "/for-community-builders",
  privacy: "/privacy",
  terms: "/terms",
  data: "/data",
} as const;

export const FOOTER_GROUPS = [
  {
    heading: "Bitplaza",
    links: [
      { href: "#pillars", label: "What it is" },
      { href: "#plaza-builder", label: "Build your plaza" },
      { href: "#waitlist", label: "Request early access" },
    ],
  },
  {
    heading: "Communities",
    links: [
      { href: "#bitcoin", label: "Bitcoin Culture Hub" },
      // "Bring your community" → ROUTES.communityBuilders is added here in
      // Stage 4, together with the page itself. Linking to a route that does
      // not exist yet is a broken link and a prefetch 404, not a placeholder.
    ],
  },
  {
    heading: "Openness",
    links: [
      { href: ROUTES.data, label: "What we collect" },
      { href: ROUTES.privacy, label: "Privacy" },
      { href: ROUTES.terms, label: "Terms" },
    ],
  },
] as const;

/**
 * The one-line version of the positioning resolved in docs §9.1.
 *
 * The map is open and belongs to everyone; the company builds the tools on top
 * of it. Both halves are stated because a reader who has seen the repo and a
 * reader who has seen the pitch must arrive at the same understanding.
 *
 * Note the tense: the foundation is described as an intention, not an existing
 * legal entity. `bch/plan.md` §12 action 2 still has the structure open, and
 * claiming a foundation that has not been formed is the kind of detail this
 * audience checks.
 */
export const OPENNESS_LINE =
  "The map belongs to everyone. The tools built on top of it are how we sustain building them." as const;
