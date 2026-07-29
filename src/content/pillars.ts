/**
 * The four product pillars. Titles and descriptions are the brief's wording,
 * unchanged.
 *
 * `detail` is additional — one concrete sentence per pillar, so the section
 * says what the thing actually does rather than only what it is called. Each is
 * grounded in something `bch/plan.md` already specifies, not invented:
 * the map and its domains, the reputation layer, the next-hop rule and the
 * Opportunity Engine, and the contribution pipeline.
 */
export const PILLARS_SECTION = {
  eyebrow: "What it is",
  heading: "Four things a plaza does that a feed cannot.",
  lead: "Bitplaza gives every community a place with a shape — one you can enter, read, contribute to, and be known in.",
} as const;

export const PILLARS = [
  {
    id: "discover",
    title: "Discover your place",
    body: "Enter a community and quickly understand its people, ideas, organizations, events and conversations.",
    detail:
      "A community arrives already mapped — its territories, the threads inside them, and a marked way in at every level of depth.",
  },
  {
    id: "identity",
    title: "Build a living identity",
    body: "Create a portable profile shaped by what you care about, what you have done and how you contribute.",
    detail:
      "Reputation accrues from real contribution, and it belongs to you — it travels between plazas and off the platform entirely.",
  },
  {
    id: "next-move",
    title: "Find your next move",
    body: "Use AI to discover people to meet, projects to join, skills to learn, events to attend and opportunities to pursue.",
    detail:
      "Every page ends somewhere deliberate. No dead ends, because a dead end is where people leave a community for good.",
  },
  {
    id: "participate",
    title: "Participate directly",
    body: "Learn, collaborate, organize, exchange value and support the communities you belong to.",
    detail:
      "Contribution is the point, not a later phase. Communities are meant to end up running their own plazas.",
  },
] as const;
