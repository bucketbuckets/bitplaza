/**
 * The platform family (#platforms): the three platforms Bitplaza serves
 * global communities through, one pillar each — talent development,
 * commerce, community infrastructure. Owner brief, 2026-07-30.
 *
 * URLs are owner-supplied (2026-07-30), never guessed — a wrong guess is a
 * stranger's site with our brand pointing at it. Kids Table currently
 * points at joinbitplaza.com per the owner; swap in its own domain when one
 * exists.
 */

export const PLATFORMS_SECTION = {
  eyebrow: "The platforms",
  heading: "Built to serve communities, worldwide.",
  lead: "Bitplaza is how global communities get what they need to thrive, across talent, commerce, and infrastructure.",
} as const;

export interface Platform {
  id: string;
  name: string;
  pillar: string;
  body: string;
  href: string | null;
}

export const PLATFORMS: readonly Platform[] = [
  {
    id: "kids-table",
    name: "Kids Table",
    pillar: "Talent development",
    body: "Where the next generation learns, builds, and shows what they can do.",
    href: "https://joinbitplaza.com",
  },
  {
    id: "clct",
    name: "CLCT",
    pillar: "Commerce",
    body: "Curated commerce for the culture. Collect and support work that matters.",
    href: "https://clctibles.com",
  },
  {
    id: "bitcoin-culture-hub",
    name: "Bitcoin Culture Hub",
    pillar: "Community infrastructure",
    body: "The navigable home a community runs on, and the first plaza on the map.",
    href: "https://bitcoinculturehub.com",
  },
] as const;
