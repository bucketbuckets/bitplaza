/**
 * The community-builder section.
 *
 * Addressed to a different reader than the rest of the page: someone who
 * already runs something and is tired. The copy assumes competence and offers
 * relief rather than tools — a leader does not need to be told what a community
 * is.
 *
 * `bch/plan.md` §2's three stages are the substance behind the promise: a plaza
 * starts owner-curated, opens to contribution, and is designed to be handed to
 * the people in it. That is a genuinely unusual offer and it is the whole reason
 * this section can be honest rather than flattering.
 */
export const COMMUNITY_BUILDERS = {
  eyebrow: "For community leaders",
  heading: "You already built the community. You should not also have to build the map.",
  lead: "If you run a meetup, a club, a school, an ecosystem or an ongoing conversation, you already know where the good stuff is. It is in your head, a pinned message, and four spreadsheets.",

  points: [
    {
      id: "consolidate",
      title: "One place instead of nine",
      body: "The people, the events, the projects and the reading — mapped and connected, instead of scattered across the tools you happen to use.",
    },
    {
      id: "newcomers",
      title: "A marked entrance",
      body: "Newcomers stop asking the same five questions, because the answers are somewhere they can find without asking anyone.",
    },
    {
      id: "handover",
      title: "Built to be handed over",
      body: "Plazas are designed to end up governed by the people in them, one territory at a time, with the people who earned it. Not a promise — the stages are in the architecture.",
    },
  ],

  cta: {
    label: "Apply to bring your community",
    /** The route and this link both land in Stage 4. */
    href: "/for-community-builders",
    note: "A short application. We are taking a small number of communities alongside Bitcoin, and we would rather do a few properly.",
  },
} as const;
