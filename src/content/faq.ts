import { ROUTES } from "./site";

/**
 * FAQ. The homepage shows HOME_FAQ_IDS (five questions); /questions shows the
 * full list. Answers are written to survive someone who then goes and checks.
 *
 * Two things are deliberately not claimed anywhere below: a launch date, and
 * a governance structure that has not been formed. Resilience is addressed
 * positively (exportability, mirroring, independent hosting), never through
 * shutdown framing.
 *
 * `id` is stable and is what the `faq_opened` analytics event reports, so
 * renaming one breaks the continuity of that metric. Rewrite the question
 * text freely; leave the id alone.
 */
export const FAQ_SECTION = {
  eyebrow: "Questions",
  heading: "Common questions.",
  moreLabel: "All questions",
  moreHref: ROUTES.questions,
} as const;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ: readonly FaqItem[] = [
  {
    id: "what-is-it",
    question: "What is Bitplaza?",
    answer:
      "An open map of a community: its people, knowledge, projects, events, organizations, and opportunities, connected in one navigable place. The first map covers Bitcoin. The system underneath is built to work for any community deep enough to need one.",
  },
  {
    id: "social-network",
    question: "Is it a social network?",
    answer:
      "Not in the conventional sense. Bitplaza helps people understand and participate in existing communities. It connects knowledge, people, projects, events, and opportunities without turning all activity into one engagement-ranked feed.",
  },
  {
    id: "who-creates",
    question: "Who can create a plaza?",
    answer:
      "Anyone who runs a community: an ecosystem, a school, a club, a conference, an open-source project, a professional network, or an ongoing public conversation. A plaza is our name for one community's map. We are starting with a small number of communities and helping each one launch properly.",
  },
  {
    id: "open-source",
    question: "Is Bitplaza open source?",
    answer:
      "Yes, by license and by structure. The code is licensed AGPL-3.0 and community knowledge is published under CC BY-SA, so anyone can hold a copy of the map. The public repository opens alongside early access. The open page describes exactly what is open today and what is still being built.",
  },
  {
    id: "money",
    question: "How does Bitplaza make money?",
    answer:
      "The community map is open. Bitplaza charges organizations for the software and services that help them create, operate, and understand their communities: hosting, administration, integrations, analytics, and advanced AI tools. Community members explore and contribute for free. No advertising. No paid placement. No sale of personal data.",
  },
  {
    id: "why-bitcoin",
    question: "Why start with Bitcoin?",
    answer:
      "Because it is deep enough to get properly lost in, badly fragmented, and the community this work grew out of. It is the hardest case, which makes it the right first one. The architecture underneath is not Bitcoin-specific.",
  },
  {
    id: "need-bitcoin",
    question: "Do I need to know anything about Bitcoin to use it?",
    answer:
      "No. Bitcoin is the first map, not a requirement. Every path is marked for depth, and the Start level assumes nothing.",
  },
  {
    id: "my-community",
    question: "My community is not Bitcoin. Can I still take part?",
    answer:
      "Yes. Tell us what you want to do when you sign up. If you run a community, there is a short application on the communities page, and a person reads every one.",
  },
  {
    id: "data",
    question: "What do you collect about me?",
    answer:
      "From the waitlist: what you typed into the form. From reading the site: anonymous usage with no cookies and an identifier that dies with the tab. No session recording, no profiles, no selling. A switch in the footer turns measurement off, and Do Not Track is honored automatically. The open page lists every event we record.",
  },
  {
    id: "when",
    question: "When does it open?",
    answer:
      "We are not announcing a date we might miss. The Bitcoin map opens first, in stages, and waitlist members go in ahead of everyone else.",
  },
  {
    id: "durability",
    question: "What keeps the map from disappearing?",
    answer:
      "Structure, not promises. Community knowledge is openly licensed and exportable, identity is portable, and the code can be run independently. Anyone can mirror a map, and a community can host its own. The map is built to outlive any single operator, including us.",
  },
] as const;

/** The five shown on the homepage, in order. The rest live on /questions. */
export const HOME_FAQ_IDS = [
  "what-is-it",
  "social-network",
  "who-creates",
  "open-source",
  "money",
] as const;

export const HOME_FAQ: readonly FaqItem[] = HOME_FAQ_IDS.map(
  (id) => FAQ.find((item) => item.id === id)!,
);
