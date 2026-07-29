import { ROUTES } from "./site";

/**
 * The community-leader conversion section. Addressed to someone who already
 * runs something and is tired. The copy assumes competence and offers relief.
 * No artificial scarcity: the closing note communicates focus and care, which
 * happens to be true.
 */
export const LEADERS_SECTION = {
  eyebrow: "For community leaders",
  /** Manually broken display headline. */
  heading: ["You built the community.", "You should not also have to build the map."],
  lead: "Bitplaza turns the knowledge already living in people's heads, pinned messages, documents, spreadsheets, feeds, and event pages into a shared place the community can actually navigate.",

  benefits: [
    {
      id: "entrance",
      title: "Give newcomers a clear entrance",
      body: "Replace repetitive onboarding questions with a shared starting point.",
    },
    {
      id: "connect",
      title: "Connect what already exists",
      body: "Bring together people, resources, events, projects, and opportunities.",
    },
    {
      id: "current",
      title: "Keep the community current",
      body: "Let members improve the map through transparent contribution and moderation.",
    },
    {
      id: "insight",
      title: "See where people get stuck",
      body: "Understand what visitors search for, where paths break, and what the community is missing.",
    },
  ],

  cta: { label: "Map your community", href: ROUTES.communities },
  note: "We are starting with a small number of communities and helping each one launch properly.",
} as const;
